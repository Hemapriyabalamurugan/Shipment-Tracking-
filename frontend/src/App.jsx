
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { queryClient } from "@/lib/query-client";
import { AuthProvider } from "@/context/auth-context";
import { RequireAuth, RequireGuest } from "@/components/layouts/route-guards";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import  LoginPage  from "@/pages/login";
// import { LandingPage } from "@/pages/landingPage";
import  DashboardRouter  from "@/pages/dashboards/dashboard-router";
import { ShipmentsPage } from "@/pages/shipments";
import { ShipmentDetailPage } from "@/pages/shipment-detail";
import { LiveMapPage } from "@/pages/live-map";
import { TrackPage } from "@/pages/track";
import { AnalyticsPage } from "@/pages/analytics";
import { NotificationsPage } from "@/pages/notifications";
import { SettingsPage } from "@/pages/settings";
import { ProfilePage } from "@/pages/profile";
import { TeamPage } from "@/pages/team";
import { FleetPage } from "@/pages/fleet";
import { TicketsPage } from "@/pages/tickets";
import { TicketDetailPage } from "@/pages/ticket-detail";
import { BillingPage } from "@/pages/billing";
import { NotFoundPage } from "@/pages/not-found";
import { RoleManagementPage } from "@/pages/role-management";
import { EtaPredictionPage } from "@/pages/eta-prediction";
import { RouteManagementPage } from "@/pages/route-management";
import { PodPage } from "@/pages/pod";
import { ReportsPage } from "@/pages/reports";
import { SystemMonitoringPage } from "@/pages/system-monitoring";
import { AuditLogsPage } from "@/pages/audit-logs";
import { LiveDriversPage } from "@/pages/live-drivers";
import { CreateShipmentPage } from "@/pages/create-shipment";
import { BulkUploadPage } from "@/pages/bulk-upload";
import { ShipmentHistoryPage } from "@/pages/shipment-history";
import { BusinessReportsPage } from "@/pages/business-reports";
import { MyDeliveriesPage } from "@/pages/my-deliveries";
import LandingPage from "./pages/landingPage";
import RegisterPage from "./pages/registerPage";
import AdminDashboard from "./pages/dashboards/admin-dashboard";
import CustomerDashboard from "./pages/dashboards/customer-dashboard";
import BusinessDashboard from "./pages/dashboards/business-dashboard";
import OperatorDashboard from "./pages/dashboards/operator-dashboard";
import SupportDashboard from "./pages/dashboards/support-dashboard";
import OperatorNavigationPage from "@/pages/navigation";


export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Guest-only routes */}
            <Route element={<RequireGuest />}>
              <Route path="/landingPage" element={<LandingPage />} />

              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Route>

            {/* Authenticated routes */}
            <Route element={<RequireAuth />}>
              <Route path="/app" element={<DashboardLayout />}>
                <Route
                  index
                  element={<Navigate to="/app/dashboard" replace />}
                />
                <Route path="dashboard" element={<DashboardRouter />} />

                <Route path="admin/dashboard" element={<AdminDashboard />} />
                <Route
                  path="customer/dashboard"
                  element={<CustomerDashboard />}
                />
                <Route
                  path="business_client/dashboard"
                  element={<BusinessDashboard />}
                />
                <Route
                  path="logistics_operator/dashboard"
                  element={<OperatorDashboard />}
                />
                <Route
                  path="support_agent/dashboard"
                  element={<SupportDashboard />}
                />

                <Route path="shipments" element={<ShipmentsPage />} />
                <Route path="shipments/:id" element={<ShipmentDetailPage />} />

                <Route
                  path="operator/navigation/:id"
                  element={<OperatorNavigationPage />}
                />

                

                <Route path="live-map" element={<LiveMapPage />} />
                <Route path="track" element={<TrackPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="team" element={<TeamPage />} />
                <Route path="roles" element={<RoleManagementPage />} />
                {/* <Route path="fleet" element={<FleetPage />} /> */}
                <Route path="drivers" element={<FleetPage />} />
                <Route path="live-drivers" element={<LiveDriversPage />} />
                <Route path="tickets" element={<TicketsPage />} />
                <Route path="tickets/:id" element={<TicketDetailPage />} />
                <Route path="billing" element={<BillingPage />} />
                <Route path="eta-prediction" element={<EtaPredictionPage />} />
                <Route path="routes" element={<RouteManagementPage />} />
                <Route path="pod" element={<PodPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route
                  path="system-monitoring"
                  element={<SystemMonitoringPage />}
                />
                <Route path="audit-logs" element={<AuditLogsPage />} />
                <Route
                  path="create-shipment"
                  element={<CreateShipmentPage />}
                />
                <Route path="bulk-upload" element={<BulkUploadPage />} />
                <Route
                  path="shipment-history"
                  element={<ShipmentHistoryPage />}
                />
                <Route
                  path="business-reports"
                  element={<BusinessReportsPage />}
                />
                <Route path="deliveries" element={<MyDeliveriesPage />} />
              </Route>
            </Route>

            {/* Catch-all routes */}
            {/* <Route
              path="/"
              element={<Navigate to="/app/dashboard" replace />}
            /> */}
            <Route path="/" element={<LandingPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors closeButton />
      </AuthProvider>
    </QueryClientProvider>
  );
}