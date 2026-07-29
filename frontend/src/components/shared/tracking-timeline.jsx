import { cn, formatDateTime } from "@/lib/utils";
import { STATUS_META } from "@/types";
import { Check } from "lucide-react";

// export function TrackingTimeline({ events }) {
//   const sorted = [...events].sort(
//     (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
//   );
export function TrackingTimeline({ events = [] }) {
  const sorted = [...events].sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
  );

  if (sorted.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No tracking history available yet.
      </div>
    );
  }

  return (
    <ol className="relative space-y-6">
      {sorted.map((event, i) => {
        // const meta = STATUS_META[event.status];
        const meta = STATUS_META[event.status] ?? {
          label: event.status,
          bg: "bg-muted text-muted-foreground",
          dot: "bg-slate-400",
        };
        const isLast = i === 0;
        return (
          <li key={i} className="relative flex gap-4">
            {i < sorted.length - 1 && (
              <span
                className={cn(
                  "absolute left-[15px] top-8 h-[calc(100%+0px)] w-0.5",
                  true ? "bg-primary/30" : "bg-border",
                )}
                aria-hidden="true"
              />
            )}
            <span
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-card",
                // event.completed
                true
                  ? isLast
                    ? "bg-primary text-white"
                    : "bg-primary/15 text-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {true ? (
                isLast ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className={cn("h-2 w-2 rounded-full", meta.dot)} />
                )
              ) : (
                <span className="h-2 w-2 rounded-full bg-current opacity-50" />
              )}
            </span>
            <div className="flex-1 space-y-1 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    isLast ? "text-foreground" : "text-foreground/80",
                  )}
                >
                  {event.title}
                </p>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                    meta.bg,
                  )}
                >
                  {meta.label}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {event.description}
              </p>
              <p className="text-xs text-muted-foreground/80">
                {event.location} · {formatDateTime(event.time)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}