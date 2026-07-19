
import { cn } from "@/lib/utils";
import { STATUS_META } from "@/types";

export function StatusBadge({ status, className, size = "default" }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        meta.bg,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}

export function PriorityBadge({ priority, className }) {
  const styles = {
    standard: "bg-muted text-muted-foreground",
    express: "bg-primary/10 text-primary",
    critical: "bg-destructive/10 text-destructive",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        styles[priority],
        className,
      )}
    >
      {priority}
    </span>
  );
}