

import { cn } from "@/lib/utils";
import { Truck } from "lucide-react";

export function Logo({ className, showText = true, variant = "dark" }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl gradient-brand shadow-lg shadow-primary/20">
        <Truck className="h-5 w-5 text-white" />
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-sidebar" />
      </div>
      {showText && (
        <div className="leading-tight">
          <p
            className={cn(
              "text-base font-extrabold tracking-tight",
              variant === "dark" ? "text-white" : "text-foreground",
            )}
          >
            ShipTrack
            <span
              className={variant === "dark" ? "text-chart-6" : "text-primary"}
            >
              Pro
            </span>
          </p>
          <p
            className={cn(
              "text-[10px] font-medium uppercase tracking-[0.18em]",
              variant === "dark"
                ? "text-sidebar-foreground/70"
                : "text-muted-foreground",
            )}
          >
            Logistics Platform
          </p>
        </div>
      )}
    </div>
  );
}