import { cn } from "@/lib/utils";
import { STATUS_META } from "@/types";

export function StatusBadge({ status, className, size = "default" }) {
  const meta = STATUS_META[status] || {
    label: status || "Unknown",
    bg: "bg-muted text-muted-foreground",
    dot: "bg-slate-400",
  };

  const isLive = status === "IN_TRANSIT" || status === "OUT_FOR_DELIVERY";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium border border-black/5 shadow-2xs whitespace-nowrap",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        meta.bg,
        className,
      )}
    >
      <span className="relative flex h-2 w-2 items-center justify-center">
        {isLive && (
          <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", meta.dot)} />
        )}
        <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", meta.dot)} />
      </span>
      {meta.label}
    </span>
  );
}

export function PriorityBadge({ priority, className }) {
  const styles = {
    standard: "bg-slate-100 text-slate-700 border-slate-200/80",
    express: "bg-blue-50 text-blue-700 border-blue-200/80",
    critical: "bg-rose-50 text-rose-700 border-rose-200/80",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        styles[priority] || "bg-muted text-muted-foreground border-border",
        className,
      )}
    >
      {priority}
    </span>
  );
}