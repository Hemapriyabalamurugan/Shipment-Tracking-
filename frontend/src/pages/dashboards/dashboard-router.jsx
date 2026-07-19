// import { useAuth } from "@/context/auth-context";
// import { AdminDashboard } from "./admin-dashboard";
// import { OperatorDashboard } from "./operator-dashboard";
// import { BusinessDashboard } from "./business-dashboard";
// import { CustomerDashboard } from "./customer-dashboard";
// import { SupportDashboard } from "./support-dashboard";
// import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
// export function DashboardRouter() {
//   const { user } = useAuth();
//   if (!user) return null;
//   switch (user.role) {
//     case "admin":
//       return /*#__PURE__*/ _jsxDEV(AdminDashboard, {}, void 0, false);
//     case "operator":
//       return /*#__PURE__*/ _jsxDEV(OperatorDashboard, {}, void 0, false);
//     case "business":
//       return /*#__PURE__*/ _jsxDEV(BusinessDashboard, {}, void 0, false);
//     case "customer":
//       return /*#__PURE__*/ _jsxDEV(CustomerDashboard, {}, void 0, false);
//     case "support":
//       return /*#__PURE__*/ _jsxDEV(SupportDashboard, {}, void 0, false);
//     default:
//       return /*#__PURE__*/ _jsxDEV(AdminDashboard, {}, void 0, false);
//   }
// }
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

  //  const { user } = useAuth();

  //  return <Navigate to={ROLE_HOME[user.role]} replace />;
}