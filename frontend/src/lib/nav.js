import {
  LayoutDashboard,
  Package,
  Truck,
  Map,
  BarChart3,
  Users,
  User,
  LifeBuoy,
  Settings,
  CreditCard,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Route,
  ClipboardCheck,
  FileText,
  Activity,
  ScrollText,
  Clock,
  Upload,
  History,
  Navigation,
  Camera,
  PenLine,
} from "lucide-react";

export const NAV_BY_ROLE = {
  admin: [
    {
      label: "Command Center",
      items: [
      // changes done here to section add role like admin 
        { label: "Dashboard", to: "/app/admin/dashboard", icon: LayoutDashboard },
        // {
        //   label: "Live Delivery Monitoring",
        //   to: "/app/live-map",
        //   icon: Activity,
        // },
        { label: "Analytics", to: "/app/analytics", icon: BarChart3 },
      ],
    },
    {
      label: "Operations",
      items: [
        {
          label: "Shipments",
          to: "/app/shipments",
          icon: Package,
          badge: "shipments",
        },
        // { label: "Tracking", to: "/app/track", icon: MapPin },
        // { label: "ETA Prediction", to: "/app/eta-prediction", icon: Clock },
        { label: "Route Management", to: "/app/routes", icon: Route },
        {
          label: "Proof of Delivery",
          to: "/app/pod",
          icon: ClipboardCheck,
          badge: "pod",
        },
        // { label: "Fleet", to: "/app/fleet", icon: Truck },
      ],
    },
    {
      label: "Administration",
      items: [
        { label: "User Management", to: "/app/team", icon: Users },
        { label: "Role Management", to: "/app/roles", icon: ShieldCheck },
        // {
        //   label: "Notifications",
        //   to: "/app/notifications",
        //   icon: MessageSquare,
        // },
        // { label: "Reports", to: "/app/reports", icon: FileText },
        // {
        //   label: "System Monitoring",
        //   to: "/app/system-monitoring",
        //   icon: Activity,
        // },
        // { label: "Audit Logs", to: "/app/audit-logs", icon: ScrollText },
        // { label: "Settings", to: "/app/settings", icon: Settings },
      ],
    },
  ],
  logistics_operator: [
    {
      label: "Deliveries",
      items: [
        { label: "Dashboard", to: "/app/logistics_operator/dashboard", icon: LayoutDashboard },
        {
          label: "My Assignments",
          to: "/app/shipments",
          icon: Package,
          badge: "shipments",
        },
        {
          label: "Proof of Delivery",
          to: "/app/pod",
          icon: ClipboardCheck,
          badge: "pod",
        },
      ],
    },
    {
      label: "Account",
      items: [
        {
          label: "Notifications",
          to: "/app/notifications",
          icon: MessageSquare,
        },
        // { label: "Settings", to: "/app/settings", icon: Settings },
      ],
    },
  ],
  business_client: [
    {
      label: "Overview",
      items: [
        { label: "Dashboard", to: "/app/business_client/dashboard", icon: LayoutDashboard },
        { label: "Analytics", to: "/app/analytics", icon: BarChart3 },
      ],
    },
    {
      label: "Shipments",
      items: [
        {
          label: "My Shipments",
          to: "/app/shipments",
          icon: Package,
          badge: "shipments",
        },
        { label: "Create Shipment", to: "/app/create-shipment", icon: Upload },
        // { label: "Bulk Upload", to: "/app/bulk-upload", icon: Upload },
        // {
        //   label: "Shipment History",
        //   to: "/app/shipment-history",
        //   icon: History,
        // },
        // { label: "Tracking", to: "/app/track", icon: MapPin },
        {
          label: "Proof of Delivery",
          to: "/app/pod",
          icon: ClipboardCheck,
          badge: "pod",
        },
      ],
    },
    // {
    //   label: "Account",
    //   items: [
    //     // { label: "Invoices", to: "/app/billing", icon: CreditCard },
    //     // { label: "Reports", to: "/app/business-reports", icon: FileText },
    //     // {
    //     //   label: "Notifications",
    //     //   to: "/app/notifications",
    //     //   icon: MessageSquare,
    //     // },
    //     // { label: "Settings", to: "/app/settings", icon: Settings },
    //   ],
    // },
  ],
  customer: [
    {
      label: "Personal",
      items: [
        { label: "Dashboard", to: "/app/customer/dashboard", icon: LayoutDashboard },
        // { label: "Track Shipment", to: "/app/track", icon: MapPin },
        { label: "My Deliveries", to: "/app/deliveries", icon: Package },
        {
          label: "Notifications",
          to: "/app/notifications",
          icon: MessageSquare,
        },
        { label: "Profile", to: "/app/profile", icon: User },
      ],
    },
    {
      label: "Support",
      items: [
        {
          label: "Help Center",
          to: "/app/tickets",
          icon: LifeBuoy,
          badge: "tickets",
        },
      ],
    },
  ],
  support_agent: [
    {
      label: "Support",
      items: [
        { label: "Dashboard", to: "/app/support_agent/dashboard", icon: LayoutDashboard },
        {
          label: "Tickets",
          to: "/app/tickets",
          icon: LifeBuoy,
          badge: "tickets",
        },
        {
          label: "Shipments",
          to: "/app/shipments",
          icon: Package,
          badge: "shipments",
        },
        // { label: "Live Map", to: "/app/live-map", icon: Map },
        // {
        //   label: "Proof of Delivery",
        //   to: "/app/pod",
        //   icon: ClipboardCheck,
        //   badge: "pod",
        // },
      ],
    },
    // {
    //   label: "Account",
    //   items: [{ label: "Settings", to: "/app/settings", icon: Settings }],
    // },
  ],
};

// export const ROLE_HOME = {
//   admin: "/app/dashboard",
//   operator: "/app/dashboard",
//   business: "/app/dashboard",
//   customer: "/app/dashboard",
//   support: "/app/dashboard",
// };
export const ROLE_HOME = {
  admin: "/app/admin/dashboard",
  customer: "/app/customer/dashboard",
  business_client: "/app/business_client/dashboard",
  logistics_operator: "/app/logistics_operator/dashboard",
  support_agent: "/app/support_agent/dashboard",
};

export const PAGE_ACCESS = {
  // "/app/dashboard": ["admin", "logistics_operator", "business_client", "customer", "support_agent"],

  // Dashboards
  "/app/admin/dashboard": ["admin"],
  "/app/customer/dashboard": ["customer"],
  "/app/business_client/dashboard": ["business_client"],
  "/app/logistics_operator/dashboard": ["logistics_operator"],
  "/app/support_agent/dashboard": ["support_agent"],
  "/app/analytics": ["admin", "business_client"],
  "/app/shipments": [
    "admin",
    "logistics_operator",
    "business_client",
    "customer",
    "support_agent",
  ],

  // shared pages
  "/app/live-map": ["admin", "support_agent"],
  "/app/track": ["admin", "business_client", "customer"],
  // "/app/fleet": ["admin"],
  "/app/drivers": ["admin"],
  "/app/live-drivers": ["admin"],
  "/app/team": ["admin"],
  "/app/roles": ["admin"],
  "/app/tickets": ["admin", "customer", "support_agent"],
  "/app/billing": ["admin", "business_client"],
  // "/app/settings": [
  //   "admin",
  //   "logistics_operator",
  //   "business_client",
  //   "customer",
  //   "support_agent",
  // ],
  "/app/profile": [
    "admin",
    "logistics_operator",
    "business_client",
    "customer",
    "support_agent",
  ],
  "/app/notifications": [
    "admin",
    "logistics_operator",
    "business_client",
    "customer",
    "support_agent",
  ],
  "/app/eta-prediction": ["admin"],
  "/app/routes": ["admin"],
  "/app/pod": [
    "admin",
    "logistics_operator",
    "business_client",
    // "support_agent",
  ],
  "/app/reports": ["admin"],
  "/app/system-monitoring": ["admin"],
  "/app/audit-logs": ["admin"],
  "/app/create-shipment": ["business_client"],
  // "/app/bulk-upload": ["business_client"],
  "/app/shipment-history": ["business_client"],
  "/app/business-reports": ["business_client"],
  "/app/deliveries": ["customer"],
};

export function canAccess(path, role) {
  const allowed = PAGE_ACCESS[path];
  if (!allowed) {
    if (path.startsWith("/app/shipments/"))
      return PAGE_ACCESS["/app/shipments"].includes(role);
    if (path.startsWith("/app/tickets/"))
      return PAGE_ACCESS["/app/tickets"].includes(role);
    return true;
  }
  return allowed.includes(role);
}
