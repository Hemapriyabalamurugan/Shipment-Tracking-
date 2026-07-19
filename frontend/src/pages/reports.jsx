
import { useState } from "react";
import { useReports } from "@/lib/hooks";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
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
import {
  FileText,
  Download,
  Plus,
  BarChart3,
  Package,
  TrendingUp,
  DollarSign,
  Users,
  ShieldCheck,
  Truck,
  Clock,
  FileSpreadsheet,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

const iconMap = {
  BarChart3,
  Package,
  TrendingUp,
  DollarSign,
  Users,
  ShieldCheck,
  Truck,
  Clock,
};

const formatColors = {
  PDF: "bg-destructive/10 text-destructive",
  CSV: "bg-success/10 text-success",
  XLSX: "bg-chart-4/10 text-chart-4",
  JSON: "bg-chart-6/10 text-chart-6",
};

export function ReportsPage() {
  const { data: reports, isLoading } = useReports();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const categories = [
    "all",
    ...Array.from(new Set(reports?.map((r) => r.category) ?? [])),
  ];

  const filtered =
    reports?.filter((r) => {
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
    }) ?? [];

  const handleGenerate = (report) => {
    setSelected(report);
    setOpen(true);
  };

  const handleConfirm = () => {
    toast.success(`Generating "${selected?.name}" report…`);
    setOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Reports"
        description="Generate & download operational reports"
        icon={FileText}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Report Templates"
          value={reports?.length ?? 0}
          icon={FileText}
          iconClass="bg-primary/10 text-primary"
        />
        <StatCard
          label="Daily Reports"
          value={reports?.filter((r) => r.schedule === "Daily").length ?? 0}
          icon={Calendar}
          iconClass="bg-chart-6/10 text-chart-6"
        />
        <StatCard
          label="Weekly Reports"
          value={reports?.filter((r) => r.schedule === "Weekly").length ?? 0}
          icon={Calendar}
          iconClass="bg-success/10 text-success"
        />
        <StatCard
          label="On-Demand"
          value={reports?.filter((r) => r.schedule === "On-demand").length ?? 0}
          icon={Download}
          iconClass="bg-chart-3/10 text-chart-3"
        />
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reports…"
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

      {isLoading ? (
        <LoadingState />
      ) : filtered.length > 0 ? (
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
                    <div className="flex gap-1.5">
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-[10px] font-bold",
                          formatColors[r.format],
                        )}
                      >
                        {r.format}
                      </span>
                    </div>
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
                      <Plus className="mr-1.5 h-3.5 w-3.5" />
                      Generate
                    </Button>
                    <Button variant="outline" size="sm">
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
                    <SelectItem value="json">JSON</SelectItem>
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