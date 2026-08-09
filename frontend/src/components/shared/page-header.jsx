import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  icon: Icon,
  actions,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 pb-2 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-5 mb-6",
        className,
      )}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {Icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
            <Icon className="h-5.5 w-5.5" />
          </div>
        )}
        <div className="space-y-0.5 min-w-0">
          <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl truncate">
            {title}
          </h1>
          {description && (
            <p className="text-xs sm:text-sm text-muted-foreground/90 truncate">{description}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2.5">{actions}</div>
      )}
    </div>
  );
}
