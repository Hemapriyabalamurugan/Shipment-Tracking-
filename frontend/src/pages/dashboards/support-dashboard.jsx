
import { useAuth } from "@/context/auth-context";
import { useTickets, useShipments } from "@/lib/hooks";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { LoadingState, EmptyState } from "@/components/shared/states";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, timeAgo } from "@/lib/utils";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Package,
  Headphones,
  ArrowRight,
  Inbox,
} from "lucide-react";

const statusMeta = {
  open: {
    label: "Open",
    class: "bg-destructive/10 text-destructive",
  },
  in_progress: {
    label: "In Progress",
    class: "bg-warning/15 text-warning",
  },
  resolved: {
    label: "Resolved",
    class: "bg-success/10 text-success",
  },
  closed: {
    label: "Closed",
    class: "bg-muted text-muted-foreground",
  },
};

export default function SupportDashboard() {
  const { user } = useAuth();
  const tickets = useTickets();
  const shipments = useShipments();
  const isLoading = tickets.isLoading;

  const open = tickets.data?.filter((t) => t.status === "open") ?? [];
  const resolved = tickets.data?.filter((t) => t.status === "resolved") ?? [];
  const myTickets = tickets.data?.filter((t) => t.assignee === user.name) ?? [];
  const exceptions =
    shipments.data?.filter((s) =>
      ["delayed", "exception"].includes(s.status),
    ) ?? [];

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Support Dashboard"
          description="Customer tickets & escalations"
        />
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Support Dashboard"
        description={`Welcome, ${user.name} — here's your support queue`} /////
        actions={
          <Button asChild>
            <Link to="/app/tickets">
              <Inbox className="mr-2 h-4 w-4" />
              Open Inbox
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="My Open Tickets"
          value={
            myTickets.filter(
              (t) => t.status !== "closed" && t.status !== "resolved",
            ).length
          }
          icon={Headphones}
          iconClass="bg-primary/10 text-primary"
        />
        <StatCard
          label="Awaiting Response"
          value={open.length}
          icon={Clock}
          iconClass="bg-warning/10 text-warning"
        />
        <StatCard
          label="Resolved Today"
          value={resolved.length}
          icon={CheckCircle2}
          iconClass="bg-success/10 text-success"
        />
        {/* <StatCard
          label="Shipment Alerts"
          value={exceptions.length}
          icon={AlertCircle}
          iconClass="bg-destructive/10 text-destructive"
        /> */}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Priority Queue</CardTitle>
                <CardDescription>Tickets needing attention</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/app/tickets">
                  All tickets <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {tickets.data
              ?.filter((t) => t.status === "open" || t.status === "in_progress")
              .sort((a) =>
                a.priority === "express" || a.priority === "critical" ? -1 : 1,
              )
              .map((t) => (
                <Link
                  key={t.id}
                  to={`/app/tickets/${t.id}`}
                  className="group flex items-center gap-3 rounded-xl border border-border p-3.5 transition hover:border-primary/30 hover:shadow-sm"
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                      t.channel === "chat" && "bg-chart-6/10 text-chart-6",
                      t.channel === "email" && "bg-primary/10 text-primary",
                      t.channel === "phone" && "bg-success/10 text-success",
                      t.channel === "portal" && "bg-chart-4/10 text-chart-4",
                    )}
                  >
                    <MessageSquare className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold">
                        {t.subject}
                      </p>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {t.reference} · {t.customer} · {timeAgo(t.updatedAt)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-md px-2 py-0.5 text-[11px] font-medium",
                      statusMeta[t.status].class,
                    )}
                  >
                    {statusMeta[t.status].label}
                  </span>
                </Link>
              ))}
            {tickets.data?.filter(
              (t) => t.status === "open" || t.status === "in_progress",
            ).length === 0 && (
              <EmptyState
                icon={CheckCircle2}
                title="Queue is clear!"
                description="No tickets waiting for a response right now."
              />
            )}
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle>By Channel</CardTitle>
            <CardDescription>Ticket distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {["chat", "email", "phone", "portal"].map((ch) => {
              const count =
                tickets.data?.filter((t) => t.channel === ch).length ?? 0;
              const pct = tickets.data?.length
                ? (count / tickets.data.length) * 100
                : 0;
              return (
                <div key={ch}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="capitalize text-muted-foreground">
                      {ch}
                    </span>
                    <span className="font-semibold">{count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        ch === "chat" && "bg-chart-6",
                        ch === "email" && "bg-primary",
                        ch === "phone" && "bg-success",
                        ch === "portal" && "bg-chart-4",
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
              <p className="text-2xl font-bold text-foreground">
                {tickets.data?.length ?? 0}
              </p>
              <p className="text-xs text-muted-foreground">Total tickets</p>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            Shipment Alerts
          </CardTitle>
          <CardDescription>
            Shipments with exceptions that may generate tickets
          </CardDescription>
        </CardHeader>
        <CardContent>
          {exceptions.length > 0 ? (
            <div className="space-y-2.5">
              {exceptions.map((s) => (
                <Link
                  key={s.id}
                  to={`/app/shipments/${s.id}`}
                  className="flex items-center gap-3 rounded-xl border border-border p-3.5 transition hover:border-primary/30"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                    <Package className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-sm font-semibold">
                      {s.trackingNumber}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {s.customer} · {s.currentLocation.name}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-destructive">
                    {s.status}
                  </Badge>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={CheckCircle2}
              title="No active alerts"
              description="All shipments are running smoothly."
            />
          )}
        </CardContent>
      </Card> */}
    </div>
  );
}