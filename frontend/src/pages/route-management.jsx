
import { useState } from "react";
import { useRoutes } from "@/lib/hooks";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { MapView } from "@/components/shared/map-view";
import { LoadingState } from "@/components/shared/states";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Route,
  Truck,
  Navigation,
  Fuel,
  AlertTriangle,
  Zap,
  ArrowLeft,
} from "lucide-react";

const statusMeta = {
  planned: {
    label: "Planned",
    class: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground",
  },
  active: {
    label: "Active",
    class: "bg-primary/10 text-primary",
    dot: "bg-primary",
  },
  completed: {
    label: "Completed",
    class: "bg-success/10 text-success",
    dot: "bg-success",
  },
  delayed: {
    label: "Delayed",
    class: "bg-destructive/10 text-destructive",
    dot: "bg-destructive",
  },
};

export function RouteManagementPage() {
  const { data: routes, isLoading } = useRoutes();
  const [selectedId, setSelectedId] = useState(null);

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Route Management"
          description="Plan, optimize & monitor delivery routes"
          icon={Route}
        />
        <LoadingState />
      </div>
    );
  }

  const selected = routes?.find((r) => r.id === selectedId);
  const active = routes?.filter((r) => r.status === "active") ?? [];
  const delayed = routes?.filter((r) => r.status === "delayed") ?? [];
  const totalFuel = routes?.reduce((s, r) => s + r.fuelCostUsd, 0) ?? 0;

  const selectedPoints = selected
    ? [selected.origin, ...selected.waypoints, selected.destination].map(
        (p) => ({
          lat: p.lat,
          lng: p.lng,
          name: p.name,
          status: "idle",
        }),
      )
    : (routes
        ?.filter((r) => r.status === "active" || r.status === "delayed")
        .flatMap((r) =>
          [r.origin, ...r.waypoints, r.destination].map((p) => ({
            lat: p.lat,
            lng: p.lng,
            name: p.name,
            status: r.status === "delayed" ? "maintenance" : "active",
          })),
        ) ?? []);

  const selectedRoute = selected
    ? [selected.origin, ...selected.waypoints, selected.destination].map(
        (p) => ({
          lat: p.lat,
          lng: p.lng,
        }),
      )
    : undefined;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Route Management"
        description="Plan, optimize & monitor delivery routes"
        icon={Route}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Routes"
          value={routes?.length ?? 0}
          icon={Route}
          iconClass="bg-primary/10 text-primary"
        />
        <StatCard
          label="Active Routes"
          value={active.length}
          icon={Navigation}
          iconClass="bg-success/10 text-success"
        />
        <StatCard
          label="Delayed Routes"
          value={delayed.length}
          icon={AlertTriangle}
          iconClass="bg-destructive/10 text-destructive"
        />
        {/* <StatCard
          label="Total Fuel Cost"
          value={`$${totalFuel.toLocaleString()}`}
          icon={Fuel}
          iconClass="bg-chart-3/10 text-chart-3"
        /> */}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-border p-3">
            <div>
              <CardTitle className="text-sm">
                {selected ? selected.name : "All Active Routes"}
              </CardTitle>
              <CardDescription className="text-xs">
                {selected
                  ? `${selected.distanceKm} km · ${selected.estimatedDurationHrs}h`
                  : `${active.length + delayed.length} routes on map`}
              </CardDescription>
            </div>
            {selected && (
              <button
                onClick={() => setSelectedId(null)}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <ArrowLeft className="h-3 w-3" />
                All routes
              </button>
            )}
          </div>
          <div className="h-[420px]">
            <MapView
              points={selectedPoints}
              route={selectedRoute}
              zoom={selected ? 5 : 4}
              className="!rounded-none h-[420px]"
            />
          </div>
        </Card>

        <div className="space-y-3 max-h-[480px] overflow-y-auto scrollbar-thin">
          {routes?.map((r) => (
            <Card
              key={r.id}
              className={cn(
                "cursor-pointer transition hover:shadow-md",
                selectedId === r.id && "border-primary ring-1 ring-primary/20",
              )}
              onClick={() => setSelectedId(r.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{r.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {r.origin.name} → {r.destination.name}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium",
                      statusMeta[r.status].class,
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        statusMeta[r.status].dot,
                      )}
                    />
                    {statusMeta[r.status].label}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Distance</p>
                    <p className="font-semibold">{r.distanceKm} km</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-semibold">{r.estimatedDurationHrs}h</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Stops</p>
                    <p className="font-semibold">{r.stops}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-border pt-2">
                  <div className="flex items-center gap-2">
                    {/* <Badge variant="outline" className="text-[10px] gap-1">
                      {/* <Truck className="h-2.5 w-2.5" /> {r.vehicleUnit} */}
                    {/* </Badge> */} 
                    {/* {r.optimized && (
                      // <Badge
                      //   variant="outline"
                      //   className="text-[10px] gap-1 text-success"
                      // >
                      //   <Zap className="h-2.5 w-2.5" /> Optimized
                      // </Badge>
                    )} */}
                  </div>
                  {/* <span className="text-xs font-semibold text-muted-foreground">
                    ${r.fuelCostUsd}
                  </span> */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}