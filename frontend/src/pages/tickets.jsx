
import { Link } from "react-router-dom";
import { useTickets } from "@/lib/hooks";
import { useAuth } from "@/context/auth-context";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { LoadingState, EmptyState } from "@/components/shared/states";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, timeAgo } from "@/lib/utils";
import {
  LifeBuoy,
  MessageSquare,
  Clock,
  CheckCircle2,
  Inbox,
  Search,
  Plus,
  Mail,
  Phone,
  MessageCircle,
  Globe,
} from "lucide-react";
import { useState } from "react";

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

const channelIcon = {
  chat: MessageCircle,
  email: Mail,
  phone: Phone,
  portal: Globe,
};

export function TicketsPage() {
  const { user } = useAuth();
  const { data: tickets, isLoading } = useTickets();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const isCustomer = user?.role === "customer";
  // const visible = isCustomer
  //   ? tickets?.filter((t) => t.customerId === user.id)
  //   : tickets;
const visible = isCustomer
  ? tickets?.filter(
      (t) => t.customerId === user.id || t.customerEmail === user.email,
    )
  : tickets;
  const filtered = visible?.filter((t) => {
    if (filter !== "all" && t.status !== filter) return false;
    if (query) {
      const q = query.toLowerCase();
      return (
        t.subject.toLowerCase().includes(q) ||
        t.reference.toLowerCase().includes(q) ||
        t.customer.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const open = visible?.filter((t) => t.status === "open") ?? [];
  const inProgress = visible?.filter((t) => t.status === "in_progress") ?? [];
  const resolved = visible?.filter((t) => t.status === "resolved") ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={isCustomer ? "Help Center" : "Support Tickets"}
        description={
          isCustomer
            ? "Get help with your shipments"
            : "Manage customer support tickets"
        }
        icon={LifeBuoy}
        actions={
          isCustomer ? (
            <Button asChild>
              <Link to="/app/tickets/new">
                <Plus className="mr-2 h-4 w-4" />
                New ticket
              </Link>
            </Button>
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Open"
          value={open.length}
          icon={Inbox}
          iconClass="bg-destructive/10 text-destructive"
        />
        <StatCard
          label="In Progress"
          value={inProgress.length}
          icon={Clock}
          iconClass="bg-warning/10 text-warning"
        />
        <StatCard
          label="Resolved"
          value={resolved.length}
          icon={CheckCircle2}
          iconClass="bg-success/10 text-success"
        />
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tickets…"
              className="pl-9"
            />
          </div>
          <Tabs value={filter} onValueChange={(v) => setFilter(v)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="in_progress">Active</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </Card>

      {isLoading ? (
        <LoadingState />
      ) : filtered && filtered.length > 0 ? (
        <div className="space-y-2.5">
          {filtered.map((t) => {
            const Icon = channelIcon[t.channel];
            return (
              <Link key={t.id} to={`/app/tickets/${t.id}`}>
                <Card className="transition hover:border-primary/30 hover:shadow-sm">
                  <CardContent className="flex items-center gap-3 p-4">
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                        t.channel === "chat" && "bg-chart-6/10 text-chart-6",
                        t.channel === "email" && "bg-primary/10 text-primary",
                        t.channel === "phone" && "bg-success/10 text-success",
                        t.channel === "portal" && "bg-chart-4/10 text-chart-4",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold">
                          {t.subject}
                        </p>
                        {t.priority !== "standard" && (
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px]",
                              t.priority === "critical" && "text-destructive",
                              t.priority === "express" && "text-primary",
                            )}
                          >
                            {t.priority}
                          </Badge>
                        )}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {t.reference} · {t.customer} · updated{" "}
                        {timeAgo(t.updatedAt)}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium",
                        statusMeta[t.status].class,
                      )}
                    >
                      {statusMeta[t.status].label}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={MessageSquare}
          title="No tickets found"
          description="Support tickets will appear here."
        />
      )}
    </div>
  );
}