
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
    <Card className={cn("relative overflow-hidden p-5", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl",
            iconClass ?? "bg-primary/10 text-primary",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {(trend || footer) && (
        <div className="mt-4 flex items-center gap-2">
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 text-xs font-semibold",
                trend.direction === "up" &&
                  (trend.positive ? "text-success" : "text-destructive"),
                trend.direction === "down" &&
                  (trend.positive ? "text-success" : "text-destructive"),
                trend.direction === "neutral" && "text-muted-foreground",
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
            <span className="text-xs text-muted-foreground">{footer}</span>
          )}
        </div>
      )}
    </Card>
  );
}