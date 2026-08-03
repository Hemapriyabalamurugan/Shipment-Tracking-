import { cn, formatDateTime } from "@/lib/utils";
import { STATUS_META } from "@/types";
import { Check, MapPin } from "lucide-react";

export function TrackingTimeline({ events = [] }) {
  const sorted = [...events].sort(
    (a, b) => new Date(b.time || b.timestamp || 0).getTime() - new Date(a.time || a.timestamp || 0).getTime(),
  );

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        <MapPin className="mb-2 h-8 w-8 text-muted-foreground/50" />
        No tracking history available yet.
      </div>
    );
  }

  return (
    <ol className="relative space-y-6 pl-2">
      {sorted.map((event, i) => {
        const meta = STATUS_META[event.status] ?? {
          label: event.status || "Update",
          bg: "bg-muted text-muted-foreground",
          dot: "bg-slate-400",
        };
        const isLatest = i === 0;
        return (
          <li key={i} className="relative flex gap-4">
            {i < sorted.length - 1 && (
              <span
                className="absolute left-[15px] top-9 h-[calc(100%+8px)] w-0.5 bg-border/80"
                aria-hidden="true"
              />
            )}
            <span
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-background transition-transform",
                isLatest
                  ? "bg-primary text-white shadow-md shadow-primary/20 ring-primary/20"
                  : "bg-muted/80 text-muted-foreground border border-border/80",
              )}
            >
              {isLatest ? (
                <Check className="h-4 w-4 stroke-[3]" />
              ) : (
                <span className={cn("h-2 w-2 rounded-full", meta.dot)} />
              )}
            </span>
            <div className="flex-1 rounded-xl border border-border/60 bg-card/60 p-3.5 shadow-2xs transition-all hover:bg-card">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      isLatest ? "text-foreground font-bold" : "text-foreground/90",
                    )}
                  >
                    {event.title}
                  </p>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border border-black/5",
                      meta.bg,
                    )}
                  >
                    {meta.label}
                  </span>
                </div>
                {event.time && (
                  <span className="text-[11px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                    {formatDateTime(event.time)}
                  </span>
                )}
              </div>
              {event.description && (
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              )}
              {event.location && (
                <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-muted-foreground/80">
                  <MapPin className="h-3 w-3 text-primary/70" />
                  {event.location}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}