
import { useMemo, useState } from "react";
import { useMyShipments } from "@/lib/hooks";
import { useAuth } from "@/context/auth-context";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { ShipmentTable } from "@/components/shared/shipment-table";
import { LoadingState, EmptyState } from "@/components/shared/states";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Search,
  Package,
  History,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

const statusTabs = [
  { value: "all", label: "All History" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "delayed", label: "Delayed" },
  { value: "exception", label: "Exceptions" },
];

export function ShipmentHistoryPage() {
  const { user } = useAuth();
  const myShipments = useMyShipments(user.id);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [mode, setMode] = useState("all");

  const completedShipments = (myShipments.data ?? []).filter((s) =>
    ["delivered", "cancelled", "delayed", "exception"].includes(s.status),
  );

  const filtered = useMemo(() => {
    if (!completedShipments) return [];
    return completedShipments.filter((s) => {
      if (query) {
        const q = query.toLowerCase();
        if (
          !s.trackingNumber.toLowerCase().includes(q) &&
          !s.origin.name.toLowerCase().includes(q) &&
          !s.destination.name.toLowerCase().includes(q) &&
          !s.carrier.toLowerCase().includes(q)
        )
          return false;
      }
      if (mode !== "all" && s.mode !== mode) return false;
      if (status === "all") return true;
      return s.status === status;
    });
  }, [completedShipments, query, status, mode]);

  const deliveredCount = completedShipments.filter(
    (s) => s.status === "delivered",
  ).length;
  const totalValue = completedShipments.reduce(
    (sum, s) => sum + s.declaredValue,
    0,
  );
  const avgProgress = completedShipments.length
    ? Math.round(
        completedShipments.reduce((sum, s) => sum + s.progress, 0) /
          completedShipments.length,
      )
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Shipment History"
        description="Complete record of your past shipments"
        icon={History}
        actions={
          <Button
            variant="outline"
            onClick={() => toast.success("History exported as CSV")}
          >
            <Download className="mr-2 h-4 w-4" />
            Export history
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Shipments"
          value={completedShipments.length}
          icon={Package}
          iconClass="bg-primary/10 text-primary"
        />
        <StatCard
          label="Delivered"
          value={deliveredCount}
          icon={CheckCircle2}
          iconClass="bg-success/10 text-success"
        />
        <StatCard
          label="Total Value"
          value={formatCurrency(totalValue)}
          icon={TrendingUp}
          iconClass="bg-chart-4/10 text-chart-4"
        />
        <StatCard
          label="Avg Progress"
          value={`${avgProgress}%`}
          icon={Clock}
          iconClass="bg-chart-6/10 text-chart-6"
        />
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tracking #, route, carrier..."
              className="pl-9"
            />
          </div>
          <Select value={mode} onValueChange={setMode}>
            <SelectTrigger className="w-full lg:w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All modes</SelectItem>
              <SelectItem value="road">Road</SelectItem>
              <SelectItem value="air">Air</SelectItem>
              <SelectItem value="ocean">Ocean</SelectItem>
              <SelectItem value="rail">Rail</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={status} onValueChange={setStatus} className="mt-4">
          <TabsList className="flex w-full flex-wrap justify-start gap-1 h-auto p-1">
            {statusTabs.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="text-xs">
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </Card>

      {myShipments.isLoading ? (
        <LoadingState />
      ) : filtered.length > 0 ? (
        <ShipmentTable
          shipments={filtered}
          showCustomer={false}
          emptyLabel="No history"
        />
      ) : (
        <EmptyState
          icon={History}
          title="No shipment history"
          description="Completed and past shipments will appear here."
        />
      )}
    </div>
  );
}