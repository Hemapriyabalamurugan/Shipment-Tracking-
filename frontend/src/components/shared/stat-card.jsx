import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  iconClass,
  className,
  footer,
}) {
  return (
    <Card className={cn("relative overflow-hidden p-5 transition-all duration-200 hover:shadow-card-hover group", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">{label}</p>
          <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {value}
          </p>
        </div>
        {Icon && (
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105",
              iconClass ?? "bg-primary/10 text-primary border border-primary/20",
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      {(trend || footer) && (
        <div className="mt-4 flex items-center gap-2 border-t border-border/40 pt-3">
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold",
                trend.direction === "up" &&
                  (trend.positive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-destructive/10 text-destructive"),
                trend.direction === "down" &&
                  (trend.positive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-destructive/10 text-destructive"),
                trend.direction === "neutral" && "bg-muted text-muted-foreground",
              )}
            >
              {trend.direction === "up" && (
                <ArrowUpRight className="h-3.5 w-3.5" />
              )}
              {trend.direction === "down" && (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {trend.value}
            </span>
          )}
          {footer && (
            <span className="text-xs text-muted-foreground/80 truncate">{footer}</span>
          )}
        </div>
      )}
    </Card>
  );
}