
import { useState } from "react";
import { useAuditLogs } from "@/lib/hooks";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { LoadingState, EmptyState } from "@/components/shared/states";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, initials, formatDateTime } from "@/lib/utils";
import {
  ScrollText,
  Search,
  Download,
  Shield,
  AlertTriangle,
  Info,
  Globe,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { ROLE_LABELS } from "@/types";

const categoryMeta = {
  auth: {
    class: "bg-chart-4/10 text-chart-4",
  },
  shipment: {
    class: "bg-primary/10 text-primary",
  },
  user: {
    class: "bg-chart-6/10 text-chart-6",
  },
  system: {
    class: "bg-muted text-muted-foreground",
  },
  billing: {
    class: "bg-success/10 text-success",
  },
  config: {
    class: "bg-warning/15 text-warning",
  },
};

const severityMeta = {
  info: {
    class: "text-muted-foreground",
    icon: Info,
  },
  warning: {
    class: "text-warning",
    icon: AlertTriangle,
  },
  critical: {
    class: "text-destructive",
    icon: AlertTriangle,
  },
};

export function AuditLogsPage() {
  const { data: logs, isLoading } = useAuditLogs();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [severity, setSeverity] = useState("all");

  const filtered =
    logs?.filter((l) => {
      if (query) {
        const q = query.toLowerCase();
        if (
          !l.actor.toLowerCase().includes(q) &&
          !l.action.toLowerCase().includes(q) &&
          !l.target.toLowerCase().includes(q) &&
          !l.ipAddress.includes(q)
        )
          return false;
      }
      if (category !== "all" && l.category !== category) return false;
      if (severity !== "all" && l.severity !== severity) return false;
      return true;
    }) ?? [];

  const critical = logs?.filter((l) => l.severity === "critical").length ?? 0;
  const warnings = logs?.filter((l) => l.severity === "warning").length ?? 0;
  const uniqueActors = new Set(logs?.map((l) => l.actor)).size ?? 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Audit Logs"
        description="Complete trail of platform activity & changes"
        icon={ScrollText}
        actions={
          <Button
            variant="outline"
            onClick={() => toast.success("Audit log exported")}
          >
            <Download className="mr-2 h-4 w-4" />
            Export logs
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Events"
          value={logs?.length ?? 0}
          icon={ScrollText}
          iconClass="bg-primary/10 text-primary"
        />
        <StatCard
          label="Unique Actors"
          value={uniqueActors}
          icon={User}
          iconClass="bg-chart-6/10 text-chart-6"
        />
        <StatCard
          label="Warnings"
          value={warnings}
          icon={AlertTriangle}
          iconClass="bg-warning/10 text-warning"
        />
        <StatCard
          label="Critical Events"
          value={critical}
          icon={Shield}
          iconClass="bg-destructive/10 text-destructive"
        />
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search actor, action, target, IP…"
              className="pl-9"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full lg:w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              <SelectItem value="auth">Auth</SelectItem>
              <SelectItem value="shipment">Shipment</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="billing">Billing</SelectItem>
              <SelectItem value="config">Config</SelectItem>
            </SelectContent>
          </Select>
          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger className="w-full lg:w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All severities</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {isLoading ? (
        <LoadingState />
      ) : filtered.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto scrollbar-thin">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead>Actor</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Category
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Target
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      IP Address
                    </TableHead>
                    <TableHead className="hidden md:table-cell">Time</TableHead>
                    <TableHead>Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((l) => {
                    const SevIcon = severityMeta[l.severity].icon;
                    return (
                      <TableRow key={l.id} className="group">
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback
                                className={cn(
                                  "text-[10px] font-semibold",
                                  l.actor === "System"
                                    ? "bg-muted text-muted-foreground"
                                    : "bg-primary/10 text-primary",
                                )}
                              >
                                {l.actor === "System" ? (
                                  <Globe className="h-3.5 w-3.5" />
                                ) : (
                                  initials(l.actor)
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-xs font-semibold">{l.actor}</p>
                              <p className="text-[10px] text-muted-foreground">
                                {ROLE_LABELS[l.actorRole]}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-foreground">
                          {l.action}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span
                            className={cn(
                              "inline-flex rounded-md px-2 py-0.5 text-[10px] font-medium capitalize",
                              categoryMeta[l.category].class,
                            )}
                          >
                            {l.category}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell font-mono text-xs">
                          {l.target}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell font-mono text-xs text-muted-foreground">
                          {l.ipAddress}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                          {formatDateTime(l.timestamp)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "flex items-center gap-1 text-[11px] font-medium capitalize",
                              severityMeta[l.severity].class,
                            )}
                          >
                            <SevIcon className="h-3 w-3" /> {l.severity}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <EmptyState
          icon={ScrollText}
          title="No audit logs found"
          description="Try adjusting your filters."
        />
      )}
    </div>
  );
}