
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/lib/hooks";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState, EmptyState } from "@/components/shared/states";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, timeAgo } from "@/lib/utils";
import {
  Bell,
  CheckCheck,
  Package,
  AlertTriangle,
  Server,
  CreditCard,
  Inbox,
} from "lucide-react";
import { useState } from "react";




const typeIcon = {
  shipment: Package,
  alert: AlertTriangle,
  system: Server,
  billing: CreditCard,
};

const severityClass = {
  info: "bg-info/10 text-info",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
  error: "bg-destructive/10 text-destructive",
};

export function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const [filter, setFilter] = useState("all");
  // const queryClient = useQueryClient();

  const unread = notifications?.filter((n) => !n.read) ?? [];
  const filtered = filter === "unread" ? unread : (notifications ?? []);
// ======================================================================
// useEffect(() => {
//   let cleanup = null;

//   async function connect() {
//     const user = await authApi.me();

//     if (!user) return;

//     connectNotificationSocket(user.id, () => {
//       queryClient.invalidateQueries({
//         queryKey: queryKeys.notifications,
//       });
//     });

//     cleanup = () => disconnectNotificationSocket();
//   }

//   connect();

//   return () => {
//     if (cleanup) cleanup();
//   };
// }, [queryClient]);
  // =====================================================================


  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Notifications"
        description="Stay on top of shipment and system events"
        icon={Bell}
        actions={
          unread.length > 0 ? (
            <Button
              variant="outline"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
            >
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark all read
            </Button>
          ) : undefined
        }
      />

      <Tabs value={filter} onValueChange={(v) => setFilter(v)}>
        <TabsList>
          <TabsTrigger value="all">
            All ({notifications?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="unread">Unread ({unread.length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <LoadingState />
      ) : filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((n) => {
            const Icon = typeIcon[n.type];
            return (
              <Card
                key={n.id}
                className={cn(
                  "transition hover:shadow-sm",
                  !n.read && "border-primary/30 bg-primary/[0.02]",
                )}
              >
                <CardContent className="flex items-start gap-3 p-4">
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                      severityClass[n.severity],
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        {n.title}
                      </p>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {timeAgo(n.timestamp)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {n.message}
                    </p>
                  </div>
                  {!n.read && (
                    <button
                      onClick={() => markRead.mutate(n.id)}
                      className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-primary/5"
                    >
                      Mark read
                    </button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Inbox}
          title={
            filter === "unread" ? "No unread notifications" : "No notifications"
          }
          description="You're all caught up. New shipment and system events will appear here."
        />
      )}
    </div>
  );
}