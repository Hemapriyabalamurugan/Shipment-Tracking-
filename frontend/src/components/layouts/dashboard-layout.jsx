
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { NAV_BY_ROLE, ROLE_HOME } from "@/lib/nav";
import { ROLE_LABELS as ROLE_NAMES } from "@/types";
import { Logo } from "@/components/shared/logo";
import { cn, initials } from "@/lib/utils";
import {
  useNotifications,
  useShipments,
  useTickets,
  usePodRecords,
} from "@/lib/hooks";
import {
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  LogOut,

  User as UserIcon,
  Settings,
  CheckCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { timeAgo } from "@/lib/utils";
import { useMarkAllNotificationsRead } from "@/lib/hooks";

export function DashboardLayout() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const navSections = NAV_BY_ROLE[user.role] || [];
  
  // console.log("USER ROLE =", user.role);
  // console.log("NAV =", NAV_BY_ROLE[user.role]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-[260px] shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:flex">
        <SidebarContent sections={navSections} />
      </aside>

      {/* Mobile overlay + sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-[280px] flex-col bg-sidebar text-sidebar-foreground animate-slide-in-right">
            <button
              className="absolute right-3 top-3.5 flex h-8 w-8 items-center justify-center rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent/20"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent
              sections={navSections}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ sections, onNavigate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <div className="flex h-16 items-center px-5">
        <Link to={ROLE_HOME[user.role]} onClick={onNavigate}>
          <Logo />
        </Link>
      </div>

      {/* <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4 scrollbar-thin">
        {sections.map((section) => ( */}

      {/* new changes here  */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4 scrollbar-thin">
        {(sections || []).map((section) => (
          // ==========================================
          
          
          <div key={section.label}>
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/40">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-lg shadow-primary/20"
                        : "text-sidebar-foreground/75 hover:bg-white/5 hover:text-white",
                    )
                  }
                >
                  <item.icon className="h-[18px] w-[18px] shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && <NavBadge type={item.badge} />}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg p-2">
          <Avatar className="h-9 w-9 border border-white/10">
            <AvatarFallback className="bg-sidebar-accent/20 text-xs font-semibold text-white">
              {initials(user.name)}
            </AvatarFallback>
          </Avatar>
          {/* <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {user.name}
            </p>
            <p className="truncate text-[11px] text-sidebar-foreground/60">
              {ROLE_NAMES[user.role]}
            </p>
          </div> */}
          {/* <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sidebar-foreground/60 transition hover:bg-white/5 hover:text-white"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button> */}
        {/* </div>
      </div> */} 
    </>
  );
}

function NavBadge({ type }) {
  const shipments = useShipments();
  const tickets = useTickets();
  const notifications = useNotifications();
  const pod = usePodRecords();

  let count = 0;
  if (type === "shipments") {
    count =
      shipments.data?.filter((s) => ["delayed", "exception"].includes(s.status))
        .length ?? 0;
  } else if (type === "tickets") {
    count =
      tickets.data?.filter((t) => ["open", "in_progress"].includes(t.status))
        .length ?? 0;
  } else if (type === "pod") {
    count =
      pod.data?.filter((p) => p.status === "pending" || p.status === "missing")
        .length ?? 0;
  } else {
    count = notifications.data?.filter((n) => !n.read).length ?? 0;
  }

  if (count === 0) return null;

  return (
    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-white">
      {count}
    </span>
  );
}

function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data: notifications } = useNotifications();
  const markAllRead = useMarkAllNotificationsRead();

  const unread = notifications?.filter((n) => !n.read) ?? [];

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border glass px-4 sm:px-6">
      <button
        onClick={onMenuClick}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* <div className="relative hidden flex-1 max-w-md md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search shipments, tracking #, customers…"
          className="h-9 w-full rounded-lg border border-border bg-background/60 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const q = e.target.value.trim();
              if (q) navigate(`/app/shipments?q=${encodeURIComponent(q)}`);
            }
          }}
        />
      </div> */}

      <div className="ml-auto flex items-center gap-1.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted">
              <Bell className="h-[18px] w-[18px]" />
              {unread.length > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
              <p className="text-sm font-semibold">Notifications</p>
              {unread.length > 0 && (
                <button
                  onClick={() => markAllRead.mutate()}
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto scrollbar-thin">
              {notifications && notifications.length > 0 ? (
                notifications.slice(0, 6).map((n) => (
                  <Link
                    key={n.id}
                    to="/app/notifications"
                    className={cn(
                      "flex flex-col gap-0.5 border-b border-border/60 px-3 py-2.5 text-sm transition hover:bg-muted/50",
                      !n.read && "bg-primary/[0.03]",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "h-2 w-2 shrink-0 rounded-full",
                          n.severity === "success" && "bg-success",
                          n.severity === "warning" && "bg-warning",
                          n.severity === "error" && "bg-destructive",
                          n.severity === "info" && "bg-info",
                        )}
                      />
                      <p className="flex-1 font-medium text-foreground">
                        {n.title}
                      </p>
                      {!n.read && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="line-clamp-2 pl-4 text-xs text-muted-foreground">
                      {n.message}
                    </p>
                    <p className="pl-4 text-[10px] text-muted-foreground/70">
                      {timeAgo(n.timestamp)}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No notifications
                </p>
              )}
            </div>

            <div className="border-t border-border p-2">
              <Link
                to="/app/notifications"
                className="block rounded-md px-2 py-1.5 text-center text-xs font-medium text-primary hover:bg-primary/5"
              >
                View all notifications
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg p-1 pl-1.5 pr-2 transition hover:bg-muted">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary/10 text-[11px] font-semibold text-primary">
                  {initials(user.name)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-left sm:block">
                <span className="block text-xs font-semibold leading-tight text-foreground">
                  {user.name}
                </span>
                <span className="block text-[10px] leading-tight text-muted-foreground">
                  {ROLE_NAMES[user.role]}
                </span>
              </span>
              <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/app/profile")}>
              <UserIcon className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/app/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}