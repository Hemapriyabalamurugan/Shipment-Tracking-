
import { useVehicles, useDrivers } from "@/lib/hooks";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { MapView } from "@/components/shared/map-view";
import { LoadingState } from "@/components/shared/states";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn, timeAgo } from "@/lib/utils";
import { Truck, Gauge, Fuel, Wrench, Users, Activity } from "lucide-react";
import { useState } from "react";

const statusMeta = {
  active: {
    label: "Active",
    class: "bg-success/10 text-success",
    dot: "bg-success",
  },
  idle: {
    label: "Idle",
    class: "bg-warning/15 text-warning",
    dot: "bg-warning",
  },
  maintenance: {
    label: "Maintenance",
    class: "bg-destructive/10 text-destructive",
    dot: "bg-destructive",
  },
  offline: {
    label: "Offline",
    class: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground",
  },
};

export function FleetPage() {
  const { data: vehicles, isLoading } = useVehicles();
  const { data: drivers } = useDrivers();
  const [tab, setTab] = useState("vehicles");

  const active = vehicles?.filter((v) => v.status === "active") ?? [];
  const maintenance = vehicles?.filter((v) => v.status === "maintenance") ?? [];
  const idle = vehicles?.filter((v) => v.status === "idle") ?? [];

  const vehiclePoints =
    vehicles
      ?.filter((v) => v.status !== "offline")
      .map((v) => ({
        lat: v.lat,
        lng: v.lng,
        name: `${v.unit} · ${v.driver}`,
        status: v.status,
      })) ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Fleet Management"
        description="Monitor vehicles, drivers & maintenance"
        icon={Truck}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active"
          value={active.length}
          icon={Activity}
          iconClass="bg-success/10 text-success"
        />
        <StatCard
          label="Idle"
          value={idle.length}
          icon={Gauge}
          iconClass="bg-warning/10 text-warning"
        />
        <StatCard
          label="Maintenance"
          value={maintenance.length}
          icon={Wrench}
          iconClass="bg-destructive/10 text-destructive"
        />
        <StatCard
          label="Drivers On Duty"
          value={drivers?.filter((d) => d.status === "on_duty").length ?? 0}
          icon={Users}
          iconClass="bg-primary/10 text-primary"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 overflow-hidden p-0">
          <div className="h-[360px]">
            <MapView
              points={vehiclePoints}
              zoom={4}
              className="!rounded-none h-[360px]"
            />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fleet Status</CardTitle>
            <CardDescription>Live distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(statusMeta).map(([key, meta]) => {
              const count =
                vehicles?.filter((v) => v.status === key).length ?? 0;
              const pct = vehicles?.length
                ? (count / vehicles.length) * 100
                : 0;
              return (
                <div key={key}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className={cn("h-2 w-2 rounded-full", meta.dot)} />
                      <span className="text-muted-foreground">
                        {meta.label}
                      </span>
                    </span>
                    <span className="font-semibold">{count}</span>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                </div>
              );
            })}
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
              <p className="text-2xl font-bold">{vehicles?.length}</p>
              <p className="text-xs text-muted-foreground">Total vehicles</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicles">
          {isLoading ? (
            <LoadingState />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {vehicles?.map((v) => (
                <Card key={v.id} className="transition hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "flex h-11 w-11 items-center justify-center rounded-lg",
                            statusMeta[v.status].class,
                          )}
                        >
                          <Truck className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="font-semibold">{v.unit}</p>
                          <p className="text-xs text-muted-foreground">
                            {v.type}
                          </p>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium",
                          statusMeta[v.status].class,
                        )}
                      >
                        {statusMeta[v.status].label}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2.5 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Gauge className="h-3.5 w-3.5" />
                          Driver
                        </span>
                        <span className="font-medium">{v.driver}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Activity className="h-3.5 w-3.5" />
                          Speed
                        </span>
                        <span className="font-medium">{v.speedKph} km/h</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Fuel className="h-3.5 w-3.5" />
                          Fuel
                        </span>
                        <span className="font-medium">{v.fuelPct}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Utilization
                        </span>
                        <span className="font-medium">{v.utilization}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            v.utilization > 70
                              ? "bg-success"
                              : v.utilization > 40
                                ? "bg-warning"
                                : "bg-muted-foreground",
                          )}
                          style={{ width: `${v.utilization}%` }}
                        />
                      </div>
                      <p className="pt-1 text-[11px] text-muted-foreground/70">
                        Last update {timeAgo(v.lastUpdate)} ·{" "}
                        {Math.round(v.odometerKm).toLocaleString()} km
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="drivers">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {drivers?.map((d) => (
              <Card key={d.id} className="transition hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {d.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                      <div>
                        <p className="font-semibold">{d.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {d.vehicleUnit}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium capitalize",
                        d.status === "on_duty" && "bg-success/10 text-success",
                        d.status === "on_break" && "bg-warning/15 text-warning",
                        d.status === "off_duty" &&
                          "bg-muted text-muted-foreground",
                      )}
                    >
                      {d.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2.5 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Rating</span>
                      <span className="font-semibold">★ {d.rating}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Trips completed
                      </span>
                      <span className="font-medium">{d.tripsCompleted}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Hours on duty
                      </span>
                      <span className="font-medium">{d.hoursOnDuty}h</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        License expiry
                      </span>
                      <span className="font-medium">{d.licenseExpiry}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}