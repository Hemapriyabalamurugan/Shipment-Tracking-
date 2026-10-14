import { Link } from "react-router-dom";
import { useTickets, useCreateTicket } from "@/lib/hooks";
import { useAuth } from "@/context/auth-context";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { LoadingState, EmptyState } from "@/components/shared/states";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { toast } from "sonner";

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
  const createTicket = useCreateTicket();

  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  // Dialog state for new ticket
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [reference, setReference] = useState("");
  const [priority, setPriority] = useState("standard");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isCustomer = user?.role === "customer";
  const visible = isCustomer
    ? tickets?.filter(
        (t) =>
          t.customerId === user?.id ||
          t.customerEmail === user?.email ||
          t.customer === user?.name ||
          t.customerId === "u-customer" ||
          !t.customerId
      )
    : tickets;

  const filtered = visible?.filter((t) => {
    if (filter !== "all" && t.status !== filter) return false;
    if (query) {
      const q = query.toLowerCase();
      return (
        t.subject?.toLowerCase().includes(q) ||
        t.reference?.toLowerCase().includes(q) ||
        t.customer?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const open = visible?.filter((t) => t.status === "open") ?? [];
  const inProgress = visible?.filter((t) => t.status === "in_progress") ?? [];
  const resolved = visible?.filter((t) => t.status === "resolved") ?? [];

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }
    if (!message.trim()) {
      toast.error("Please describe your problem / issue");
      return;
    }

    setSubmitting(true);
    try {
      await createTicket.mutateAsync({
        subject: subject.trim(),
        message: message.trim(),
        priority,
        reference: reference.trim() || undefined,
        customerId: user?.id || "u-customer",
        customerName:
          user?.name ||
          `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
          user?.email ||
          "Customer",
        customerEmail: user?.email || "",
      });

      toast.success("Support ticket created successfully!");
      setIsDialogOpen(false);
      setSubject("");
      setReference("");
      setPriority("standard");
      setMessage("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  };

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
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New ticket
            </Button>
          ) : undefined
        }
      />

      {/* New Ticket Modal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleCreateSubmit}>
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
              <DialogDescription>
                Describe your issue with a shipment or delivery. Our support team will respond promptly.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="ticket-subject">Subject *</Label>
                <Input
                  id="ticket-subject"
                  placeholder="e.g. Package delayed, damaged item, etc."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="ticket-reference">Tracking / Order # (Optional)</Label>
                  <Input
                    id="ticket-reference"
                    placeholder="e.g. STP-2H7M-4410"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="ticket-priority">Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger id="ticket-priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="express">High</SelectItem>
                      <SelectItem value="critical">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ticket-message">Problem Description *</Label>
                <Textarea
                  id="ticket-message"
                  placeholder="Explain what went wrong or how we can help you..."
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Ticket"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All ({visible?.length ?? 0})</TabsTrigger>
            <TabsTrigger value="open">Open ({open.length})</TabsTrigger>
            <TabsTrigger value="in_progress">
              In Progress ({inProgress.length})
            </TabsTrigger>
            <TabsTrigger value="resolved">
              Resolved ({resolved.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingState label="Loading tickets…" />
      ) : filtered && filtered.length > 0 ? (
        <div className="divide-y divide-border rounded-xl border border-border bg-card">
          {filtered.map((t) => {
            const Icon = channelIcon[t.channel] ?? Globe;
            return (
              <Link
                key={t.id}
                to={`/app/tickets/${t.id}`}
                className="block transition-colors hover:bg-muted/50"
              >
                <Card className="border-0 shadow-none rounded-none bg-transparent">
                  <CardContent className="flex items-center justify-between p-4 gap-4">
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="truncate text-sm font-semibold">
                          {t.subject}
                        </span>
                        {t.priority && t.priority !== "standard" && (
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px]",
                              t.priority === "critical" && "text-destructive",
                              t.priority === "express" && "text-primary"
                            )}
                          >
                            {t.priority}
                          </Badge>
                        )}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {t.reference} · {t.customer} · updated {timeAgo(t.updatedAt)}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium",
                        statusMeta[t.status]?.class || statusMeta.open.class
                      )}
                    >
                      {statusMeta[t.status]?.label || t.status}
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
          description="Support tickets will appear here. Click 'New ticket' above to raise an issue."
        />
      )}
    </div>
  );
}