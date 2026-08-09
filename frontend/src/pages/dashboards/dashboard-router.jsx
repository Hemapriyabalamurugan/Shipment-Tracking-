
import { useAuth } from "@/context/auth-context";
import  AdminDashboard  from "./admin-dashboard";
import  OperatorDashboard  from "./operator-dashboard";
import  BusinessDashboard  from "./business-dashboard";
import  CustomerDashboard  from "./customer-dashboard";
import  SupportDashboard  from "./support-dashboard";

export default function DashboardRouter() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "logistics_operator":
      return <OperatorDashboard />;
    case "business_client":
      return <BusinessDashboard />;
    case "customer":
      return <CustomerDashboard />;
    case "support_agent":
      return <SupportDashboard />;
    default:
    // return <AdminDashboard />;
      return <div>Unauthorized</div>;
  }

  
}