
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTicket, useReplyTicket, useUpdateTicketStatus } from "@/lib/hooks";
import { useAuth } from "@/context/auth-context";
import { LoadingState, EmptyState } from "@/components/shared/states";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, initials, formatDateTime, timeAgo } from "@/lib/utils";
import {
  ArrowLeft,
  Send,
  LifeBuoy,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
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

export function TicketDetailPage() {
  const { id } = useParams();
  const { data: ticket, isLoading } = useTicket(id);
  const { user } = useAuth();
  const reply = useReplyTicket();
  const updateStatus = useUpdateTicketStatus();
  const navigate = useNavigate();
  const [body, setBody] = useState("");

  if (isLoading) {
    return (
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back
        </Button>
        <LoadingState label="Loading ticket…" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back
        </Button>
        <EmptyState
          icon={LifeBuoy}
          title="Ticket not found"
          action={
            <Button asChild>
              <Link to="/app/tickets">View all tickets</Link>
            </Button>
          }
        />
      </div>
    );
  }

  // const isStaff = user.role === "support" || user.role === "admin";
  const isStaff = user?.role === "support_agent" || user?.role === "admin";

  const handleReply = async () => {
    if (!body.trim()) return;
    await reply.mutateAsync({
      id: ticket.id,
      body,
      author: user.name ?? user.firstName,
    });
    setBody("");
    toast.success("Reply sent");
  };

  const handleStatusChange = async (status) => {
    await updateStatus.mutateAsync({
      id: ticket.id,
      status,
    });
    toast.success(`Ticket marked as ${statusMeta[status].label}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
            className="mt-0.5"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-bold">{ticket.subject}</h1>
              <span
                className={cn(
                  "rounded-md px-2 py-0.5 text-[11px] font-medium",
                  statusMeta[ticket.status].class,
                )}
              >
                {statusMeta[ticket.status].label}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {ticket.reference} · opened {timeAgo(ticket.createdAt)}
            </p>
          </div>
        </div>
        {isStaff && (
          <Select
            value={ticket.status}
            onValueChange={(v) => handleStatusChange(v)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">
                <AlertCircle className="mr-2 h-4 w-4" />
                Open
              </SelectItem>
              <SelectItem value="in_progress">
                <Clock className="mr-2 h-4 w-4" />
                In Progress
              </SelectItem>
              <SelectItem value="resolved">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Resolved
              </SelectItem>
              <SelectItem value="closed">
                <XCircle className="mr-2 h-4 w-4" />
                Closed
              </SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Conversation</CardTitle>
              <CardDescription>
                {ticket.messages.length} messages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {ticket.messages.map((m) => {
                // const isMe = m.author === user.name;
                const isMe = m.author === (user.name ?? user.firstName);
                return (
                  <div
                    key={m.id}
                    className={cn("flex gap-3", isMe && "flex-row-reverse")}
                  >
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarFallback
                        className={cn(
                          "text-xs font-semibold",
                          isMe
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {initials(m.author)}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-2.5",
                        isMe
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted",
                      )}
                    >
                      <p className="text-xs font-semibold opacity-80">
                        {m.author}
                      </p>
                      <p className="mt-0.5 text-sm">{m.body}</p>
                      <p
                        className={cn(
                          "mt-1 text-[10px]",
                          isMe
                            ? "text-primary-foreground/60"
                            : "text-muted-foreground",
                        )}
                      >
                        {formatDateTime(m.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {ticket.status !== "closed" && (
            <Card className="mt-4">
              <CardContent className="p-4">
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Type your reply…"
                  className="min-h-[100px] resize-none border-0 p-0 focus-visible:ring-0"
                />
                <Separator className="my-3" />
                <div className="flex justify-end">
                  <Button
                    onClick={handleReply}
                    disabled={!body.trim() || reply.isPending}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {reply.isPending ? "Sending…" : "Send reply"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Ticket Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <InfoRow label="Customer" value={ticket.customer} />
              <InfoRow
                label="Channel"
                value={<span className="capitalize">{ticket.channel}</span>}
              />
              <InfoRow
                label="Priority"
                value={
                  <Badge variant="outline" className="capitalize">
                    {ticket.priority}
                  </Badge>
                }
              />
              <InfoRow label="Assignee" value={ticket.assignee} />
              <InfoRow
                label="Created"
                value={formatDateTime(ticket.createdAt)}
              />
              <InfoRow label="Updated" value={timeAgo(ticket.updatedAt)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Customer</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <Avatar className="h-11 w-11">
                <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                  {initials(ticket.customer)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{ticket.customer}</p>
                <p className="text-xs text-muted-foreground">
                  Customer account
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}