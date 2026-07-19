
import { useState } from "react";
import { useReports } from "@/lib/hooks";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState, EmptyState } from "@/components/shared/states";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  FileText,
  Download,
  BarChart3,
  Package,
  TrendingUp,
  DollarSign,
  Truck,
  Clock,
  FileSpreadsheet,
  FileBarChart,
} from "lucide-react";

const iconMap = {
  BarChart3,
  Package,
  TrendingUp,
  DollarSign,
  Truck,
  Clock,
};

const formatColors = {
  PDF: "bg-destructive/10 text-destructive",
  CSV: "bg-success/10 text-success",
  XLSX: "bg-chart-4/10 text-chart-4",
  JSON: "bg-chart-6/10 text-chart-6",
};

const BUSINESS_REPORTS = [
  {
    id: "br-1",
    name: "Shipping Volume Report",
    description: "Monthly shipment counts and delivery success rates",
    category: "Shipments",
    format: "PDF",
    lastGenerated: "2026-07-07",
    schedule: "Monthly",
    icon: "Package",
  },
  {
    id: "br-2",
    name: "Cost Analysis Report",
    description: "Shipping spend breakdown by carrier, mode, and route",
    category: "Finance",
    format: "XLSX",
    lastGenerated: "2026-07-05",
    schedule: "Monthly",
    icon: "DollarSign",
  },
  {
    id: "br-3",
    name: "Delivery Performance Report",
    description: "On-time rate, average transit time, and exceptions",
    category: "Analytics",
    format: "PDF",
    lastGenerated: "2026-07-06",
    schedule: "Weekly",
    icon: "TrendingUp",
  },
  {
    id: "br-4",
    name: "Shipment History Export",
    description: "Complete shipment log with timestamps and status",
    category: "Shipments",
    format: "CSV",
    lastGenerated: "2026-07-08",
    schedule: "On-demand",
    icon: "FileText",
  },
  {
    id: "br-5",
    name: "Carrier Comparison Report",
    description: "Side-by-side carrier performance and pricing",
    category: "Analytics",
    format: "PDF",
    lastGenerated: "2026-07-01",
    schedule: "Quarterly",
    icon: "BarChart3",
  },
  {
    id: "br-6",
    name: "Carbon Footprint Report",
    description: "Emissions by transport mode and total impact",
    category: "Sustainability",
    format: "PDF",
    lastGenerated: "2026-06-28",
    schedule: "Monthly",
    icon: "Truck",
  },
];

export function BusinessReportsPage() {
  const { isLoading } = useReports();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const categories = [
    "all",
    ...Array.from(new Set(BUSINESS_REPORTS.map((r) => r.category))),
  ];

  const filtered = BUSINESS_REPORTS.filter((r) => {
    if (query) {
      const q = query.toLowerCase();
      if (
        !r.name.toLowerCase().includes(q) &&
        !r.description.toLowerCase().includes(q)
      )
        return false;
    }
    if (category !== "all" && r.category !== category) return false;
    return true;
  });

  const handleGenerate = (report) => {
    setSelected(report);
    setOpen(true);
  };

  const handleConfirm = () => {
    toast.success(`Generating "${selected?.name}" report...`);
    setOpen(false);
  };

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Reports"
          description="Generate & download business reports"
          icon={FileText}
        />
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Reports"
        description="Generate and export custom business reports"
        icon={FileText}
      />

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reports..."
            className="flex-1"
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c === "all" ? "All categories" : c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((r) => {
            const Icon = iconMap[r.icon] ?? FileText;
            return (
              <Card key={r.id} className="transition hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span
                      className={cn(
                        "rounded-md px-2 py-0.5 text-[10px] font-bold",
                        formatColors[r.format],
                      )}
                    >
                      {r.format}
                    </span>
                  </div>
                  <p className="mt-3 font-semibold">{r.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {r.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 border-t border-border pt-3 text-xs">
                    <Badge variant="outline" className="text-[10px]">
                      {r.category}
                    </Badge>
                    <span className="text-muted-foreground">
                      · {r.schedule}
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground/70">
                    Last generated {formatDate(r.lastGenerated)}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={() => handleGenerate(r)}
                      size="sm"
                      className="flex-1"
                    >
                      <FileBarChart className="mr-1.5 h-3.5 w-3.5" />
                      Generate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.success(`Downloading ${r.name}...`)}
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No reports found"
          description="Try adjusting your search or category filter."
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Report</DialogTitle>
            <DialogDescription>
              Configure and generate "{selected?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
              <p className="font-medium">{selected?.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {selected?.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Date range
                </label>
                <Select defaultValue="30d">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="ytd">Year to date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Format
                </label>
                <Select defaultValue={selected?.format.toLowerCase()}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="xlsx">XLSX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>
              <FileSpreadsheet className="mr-1.5 h-4 w-4" />
              Generate report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}