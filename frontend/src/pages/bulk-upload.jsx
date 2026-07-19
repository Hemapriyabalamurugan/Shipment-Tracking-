
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateShipment } from "@/lib/hooks";
import { useAuth } from "@/context/auth-context";
import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  Plus,
  Trash2,
  Package,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const CITIES = [
  "Chicago, IL",
  "New York, NY",
  "Los Angeles, CA",
  "Dallas, TX",
  "Seattle, WA",
  "Atlanta, GA",
  "Miami, FL",
  "Denver, CO",
];

const PRESET_ROWS = [
  {
    id: "r1",
    origin: "Chicago, IL",
    destination: "New York, NY",
    weightKg: 120,
    pieces: 5,
    declaredValue: 2400,
    mode: "road",
    priority: "standard",
    status: "valid",
  },
  {
    id: "r2",
    origin: "Los Angeles, CA",
    destination: "Seattle, WA",
    weightKg: 340,
    pieces: 12,
    declaredValue: 8800,
    mode: "road",
    priority: "express",
    status: "valid",
  },
  {
    id: "r3",
    origin: "Dallas, TX",
    destination: "Miami, FL",
    weightKg: 580,
    pieces: 24,
    declaredValue: 15000,
    mode: "air",
    priority: "express",
    status: "valid",
  },
  {
    id: "r4",
    origin: "Chicago, IL",
    destination: "Chicago, IL",
    weightKg: 50,
    pieces: 2,
    declaredValue: 800,
    mode: "road",
    priority: "standard",
    status: "invalid",
    error: "Origin and destination cannot be the same",
  },
];

export function BulkUploadPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const createShipment = useCreateShipment();
  const [rows, setRows] = useState(PRESET_ROWS);
  const [uploading, setUploading] = useState(false);

  const validRows = rows.filter((r) => r.status === "valid");
  const invalidRows = rows.filter((r) => r.status === "invalid");
  const totalCost = validRows.reduce((sum, r) => {
    const base =
      r.mode === "air"
        ? 520
        : r.mode === "ocean"
          ? 340
          : r.mode === "rail"
            ? 240
            : 180;
    const mult =
      r.priority === "express" ? 1.5 : r.priority === "critical" ? 2 : 1;
    return sum + Math.round(base * mult * (r.weightKg / 100));
  }, 0);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      toast.success(`${file.name} uploaded`, {
        description: "Parsed 4 shipment rows from CSV",
      });
    }, 1200);
  };

  const removeRow = (id) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const addRow = () => {
    const newRow = {
      id: `r${Date.now()}`,
      origin: CITIES[0],
      destination: CITIES[1],
      weightKg: 100,
      pieces: 1,
      declaredValue: 1000,
      mode: "road",
      priority: "standard",
      status: "valid",
    };
    setRows((prev) => [...prev, newRow]);
  };

  const handleBulkCreate = async () => {
    for (const row of validRows) {
      await createShipment.mutateAsync({
        origin: {
          name: row.origin.split(",")[0],
          address: row.origin,
          lat: 41.8781,
          lng: -87.6298,
        },
        destination: {
          name: row.destination.split(",")[0],
          address: row.destination,
          lat: 40.7484,
          lng: -73.9857,
        },
        mode: row.mode,
        priority: row.priority,
        carrier: "ShipTrack Express",
        customer: user.company ?? user.name,
        customerId: user.id,
        weightKg: row.weightKg,
        pieces: row.pieces,
        declaredValue: row.declaredValue,
        estimatedDelivery: new Date(
          Date.now() + 3 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      });
    }
    toast.success(`${validRows.length} shipments created successfully`);
    navigate("/app/shipments");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Bulk Shipment Upload"
        description="Upload multiple shipments at once via CSV"
        icon={UploadCloud}
      />

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative grid-bg p-8">
            <div className="mx-auto max-w-xl text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl gradient-brand text-white shadow-lg shadow-primary/20">
                <UploadCloud className="h-8 w-8" />
              </div>
              <h2 className="mt-4 text-lg font-bold">
                Upload your shipment file
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Drag & drop a CSV file, or click to browse. Max 500 rows per
                upload.
              </p>
              <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                <FileSpreadsheet className="h-4 w-4" />
                {uploading ? "Uploading..." : "Select CSV file"}
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </label>
              <div className="mt-3 flex items-center justify-center gap-3">
                <button
                  onClick={() => toast.info("Template downloaded")}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  <Download className="mr-1 inline h-3 w-3" />
                  Download CSV template
                </button>
                <span className="text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">
                  Supported: .csv, .xlsx
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Rows</p>
            <p className="text-2xl font-bold">{rows.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Valid</p>
            <p className="flex items-center gap-1 text-2xl font-bold text-success">
              <CheckCircle2 className="h-5 w-5" />
              {validRows.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Errors</p>
            <p className="flex items-center gap-1 text-2xl font-bold text-destructive">
              <AlertCircle className="h-5 w-5" />
              {invalidRows.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Est. Total Cost</p>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(totalCost)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Package className="h-4 w-4 text-primary" />
                Shipment Preview
              </CardTitle>
              <CardDescription className="text-xs">
                Review and fix any errors before submitting
              </CardDescription>
            </div>
            <Button onClick={addRow} variant="outline" size="sm">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add row
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {rows.length > 0 ? (
            <div className="overflow-x-auto scrollbar-thin">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="w-8" />
                    <TableHead>Origin</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Weight
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Pieces
                    </TableHead>
                    <TableHead className="hidden md:table-cell">Mode</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Priority
                    </TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow
                      key={r.id}
                      className={cn(
                        r.status === "invalid" && "bg-destructive/5",
                      )}
                    >
                      <TableCell>
                        {r.status === "valid" ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : (
                          <span title={r.error}>
                            <AlertCircle className="h-4 w-4 text-destructive" />
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        {r.origin}
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        {r.destination}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-xs">
                        {r.weightKg} kg
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-xs">
                        {r.pieces}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs capitalize">
                        {r.mode}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs capitalize">
                        {r.priority}
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => removeRow(r.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No rows uploaded yet
            </p>
          )}
          {invalidRows.length > 0 && (
            <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-destructive">
                <AlertCircle className="h-3.5 w-3.5" /> {invalidRows.length}{" "}
                row(s) have errors
              </p>
              <ul className="mt-1.5 space-y-1">
                {invalidRows.map((r) => (
                  <li key={r.id} className="text-xs text-muted-foreground">
                    Row {r.origin} → {r.destination}: {r.error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold">{validRows.length}</span>
          <span className="text-muted-foreground">
            valid shipments ready to book
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setRows([])}>
            Clear all
          </Button>
          <Button
            onClick={handleBulkCreate}
            disabled={validRows.length === 0 || createShipment.isPending}
          >
            <CheckCircle2 className="mr-1.5 h-4 w-4" />
            {createShipment.isPending
              ? "Creating..."
              : `Book ${validRows.length} Shipment${
                  validRows.length !== 1 ? "s" : ""
                }`}
          </Button>
        </div>
      </div>
    </div>
  );
}