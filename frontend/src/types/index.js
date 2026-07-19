export const ROLE_LABELS = {
  admin: "Administrator",
  operator: "Logistics Operator",
  business: "Business Client",
  customer: "Customer",
  support: "Support Agent",
};

export const ROLE_DESCRIPTIONS = {
  admin: "Manage platform, users, security, monitoring & audits",
  operator: "Delivery personnel responsible for shipment execution",
  business: "Company client that sends goods through the platform",
  customer: "Track your packages & get real-time delivery updates",
  support: "Assist customers and investigate shipment issues",
};

export const STATUS_META = {
  pending: {
    label: "Pending",
    color: "text-muted-foreground",
    bg: "bg-muted",
    dot: "bg-slate-400",
  },
  picked_up: {
    label: "Picked Up",
    color: "text-info-foreground",
    bg: "bg-info/10 text-info",
    dot: "bg-info",
  },
  in_transit: {
    label: "In Transit",
    color: "text-primary",
    bg: "bg-primary/10 text-primary",
    dot: "bg-primary",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "text-chart-2",
    bg: "bg-success/10 text-success",
    dot: "bg-success",
  },
  delivered: {
    label: "Delivered",
    color: "text-success",
    bg: "bg-success/10 text-success",
    dot: "bg-success",
  },
  delayed: {
    label: "Delayed",
    color: "text-warning-foreground",
    bg: "bg-warning/15 text-warning",
    dot: "bg-warning",
  },
  exception: {
    label: "Exception",
    color: "text-destructive",
    bg: "bg-destructive/10 text-destructive",
    dot: "bg-destructive",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-muted-foreground",
    bg: "bg-muted text-muted-foreground",
    dot: "bg-slate-400",
  },
};
