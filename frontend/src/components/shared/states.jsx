import { cn } from "@/lib/utils";
import { AlertTriangle, PackageSearch } from "lucide-react";

export function LoadingState({ label = "Loading data…", className }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16",
        className,
      )}
    >
      <div className="relative flex h-12 w-12 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-primary/10" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-primary border-t-transparent shadow-sm" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">{label}</p>
    </div>
  );
}

export function EmptyState({
  icon: Icon = PackageSearch,
  title = "No data found",
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/80 bg-card/40 p-12 text-center shadow-2xs",
        className,
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
        <Icon className="h-7 w-7" />
      </div>
      <div className="space-y-1">
        <p className="text-base font-bold text-foreground">{title}</p>
        {description && (
          <p className="mx-auto max-w-sm text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function ErrorState({ title = "Failed to load data", message, retry, className }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center",
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-bold text-foreground">{title}</p>
        {message && <p className="text-xs text-muted-foreground max-w-md">{message}</p>}
      </div>
      {retry && (
        <button
          onClick={retry}
          className="mt-2 rounded-lg bg-destructive px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-destructive/90 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}