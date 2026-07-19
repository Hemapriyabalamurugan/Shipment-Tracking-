// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Mail, Lock, Shield } from "lucide-react";

// export default function LoginPage() {

// // it is previously here if you want can remove the upper one because before that email otp varification working
//   const [otpSent, setOtpSent] = useState(false);

//   const handleGetOtp = () => {
//     // API call here
//     setOtpSent(true);
//   };

//   return (
//     <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
//         {/* Logo / Title */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-slate-800">ShipTrackPro</h1>
//           <p className="text-slate-500 mt-2">Sign in to your account</p>
//         </div>

//         <form className="space-y-5">
//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               Email Address
//             </label>

//             <div className="relative">
//               <Mail
//                 size={18}
//                 className="absolute left-3 top-3.5 text-slate-400"
//               />

//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               Password
//             </label>

//             <div className="relative">
//               <Lock
//                 size={18}
//                 className="absolute left-3 top-3.5 text-slate-400"
//               />

//               <input
//                 type="password"
//                 placeholder="Enter your password"
//                 className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           {/* OTP */}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               OTP Verification
//             </label>

//             <div className="flex gap-3">
//               <div className="relative flex-1">
//                 <Shield
//                   size={18}
//                   className="absolute left-3 top-3.5 text-slate-400"
//                 />

//                 <input
//                   type="text"
//                   placeholder="Enter OTP"
//                   className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <button
//                 type="button"
//                 onClick={handleGetOtp}
//                 className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//               >
//                 Get OTP
//               </button>
//             </div>

//             {otpSent && (
//               <p className="text-green-600 text-sm mt-2 font-medium">
//                 OTP sent to your mail ✓
//               </p>
//             )}
//           </div>

//           {/* Remember Me */}
//           <div className="flex justify-between items-center text-sm">
//             <label className="flex items-center gap-2">
//               <input type="checkbox" />
//               Remember me
//             </label>

//             <a href="#" className="text-blue-600 hover:text-blue-700">
//               Forgot Password?
//             </a>
//           </div>

//           {/* Login Button */}
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
//           >
//             Login
//           </button>
//         </form>

//         {/* Footer */}
//         <div className="text-center mt-6 text-sm text-slate-600">
//           Don't have an account?{" "}
//           <a
//             href="/register"
//             className="text-blue-600 font-medium hover:text-blue-700"
//           >
//             Register
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import { Mail, Lock, Shield } from "lucide-react";

// export default function LoginPage() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [otp, setOtp] = useState("");

//   const [otpSent, setOtpSent] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Send OTP
//   const handleGetOtp = async () => {
//     if (!email) {
//       alert("Please enter your email first");
//       return;
//     }

//     try {
//       await axios.post("http://localhost:8080/api/auth/verify-email", {
//         email,
//       });

//       setOtpSent(true);
//     } catch (error) {
//       console.error(error);
//       alert("Failed to send OTP");
//     }
//   };

//   // Login
//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);

//       const response = await axios.post(
//         "http://localhost:8080/api/auth/login",
//         {
//           email,
//           password,
//           otp,
//         },
//       );

//       localStorage.setItem("token", response.data.token);

//       localStorage.setItem("role", response.data.role);

//       const role = response.data.role;

//       switch (role) {
//         case "ADMIN":
//           navigate("/admin/dashboard");
//           break;

//         case "SUPPORT":
//           navigate("/support/dashboard");
//           break;

//         case "LOGISTICS_OPERATOR":
//           navigate("/operator/dashboard");
//           break;

//         case "BUSINESSCLIENT":
//           navigate("/business/dashboard");
//           break;

//         case "CUSTOMER":
//           navigate("/customer/dashboard");
//           break;

//         default:
//           navigate("/");
//       }
//     } catch (error) {
//       console.error(error);
//       alert("Invalid email, password, or OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-slate-800">ShipTrackPro</h1>
//           <p className="text-slate-500 mt-2">Sign in to your account</p>
//         </div>

//         <form onSubmit={handleLogin} className="space-y-5">
//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               Email Address
//             </label>

//             <div className="relative">
//               <Mail
//                 size={18}
//                 className="absolute left-3 top-3.5 text-slate-400"
//               />

//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter your email"
//                 required
//                 className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               Password
//             </label>

//             <div className="relative">
//               <Lock
//                 size={18}
//                 className="absolute left-3 top-3.5 text-slate-400"
//               />

//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter your password"
//                 required
//                 className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           {/* OTP Section */}
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               OTP Verification
//             </label>

//             <div className="flex gap-3">
//               <div className="relative flex-1">
//                 <Shield
//                   size={18}
//                   className="absolute left-3 top-3.5 text-slate-400"
//                 />

//                 <input
//                   type="text"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   placeholder="Enter OTP"
//                   className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <button
//                 type="button"
//                 onClick={handleGetOtp}
//                 className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//               >
//                 Get OTP
//               </button>
//             </div>

//             {otpSent && (
//               <p className="text-green-600 text-sm mt-2 font-medium">
//                 OTP sent to your mail ✓
//               </p>
//             )}
//           </div>

//           {/* Remember Me */}
//           <div className="flex justify-between items-center text-sm">
//             <label className="flex items-center gap-2">
//               <input type="checkbox" />
//               Remember me
//             </label>

//             <Link
//               to="/forgot-password"
//               className="text-blue-600 hover:text-blue-700"
//             >
//               Forgot Password?
//             </Link>
//           </div>

//           {/* Login Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-400"
//           >
//             {loading ? "Signing In..." : "Login"}
//           </button>
//         </form>

//         {/* Footer */}
//         <div className="text-center mt-6 text-sm text-slate-600">
//           Don't have an account?{" "}
//           <Link
//             to="/register"
//             className="text-blue-600 font-medium hover:text-blue-700"
//           >
//             Register
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8080/api/auth/login/send-otp",
        {
          email,
          password,
        },
      );

      setOtpSent(true);

      setSuccessMessage(
        response.data.message || "OTP has been sent to your email",
      );
    } catch (error) {
      console.error(error);

      alert(error?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8080/api/auth/login/verify-otp",
        {
          email,
          otp,
        },
      );
      

      // localStorage.setItem("token", response.data.token);

      localStorage.setItem("refreshToken", response.data.refreshToken);

      //    changes done here
      localStorage.setItem("shiptrack.token", response.data.token);
      
      // localStorage.setItem("role", response.data.role);

     const roleMap = {
       ADMIN: "admin",
       CUSTOMER: "customer",
       BUSINESS_CLIENT: "business_client",
       LOGISTICS_OPERATOR: "logistics_operator",
       SUPPORT_AGENT: "support_agent",
     };

     localStorage.setItem(
       "shiptrack.session",
       JSON.stringify({
         user: {
           name: response.data.email,
           email: response.data.email,
           role: roleMap[response.data.role],
         },
         token: response.data.token,
       }),
      );
      console.log(
        "AFTER SAVE TOKEN =",
        localStorage.getItem("shiptrack.token"),
      );
      // console.log(JSON.parse(localStorage.getItem("shiptrack.session")));

      // ========================================================================

      // window.location.href = `/app/${response.data.role.toLowerCase()}/dashboard`;

      // console.log("TOKEN:", response.data.token);
      // console.log("ROLE:", response.data.role);
// =================================================================================
      const role = response.data.role;

      switch (role) {
        case "ADMIN":
          window.location.href = ("/app/admin/dashboard");
          break;

        case "CUSTOMER":
          window.location.href=("/app/customer/dashboard");
          break;

        case "BUSINESS_CLIENT":
          window.location.href = "/app/business_client/dashboard";
          break;

        case "LOGISTICS_OPERATOR":
          window.location.href = "/app/logistics_operator/dashboard";
          break;

        case "SUPPORT_AGENT":
          window.location.href = "/app/support_agent/dashboard";
          break;

        default:
          window.location.href = "/";
      }
    } catch (error) {
      console.error(error);

      alert(error?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">ShipTrackPro</h1>

          <p className="text-slate-500 mt-2">Sign in to your account</p>
        </div>

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-3.5 text-slate-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-3.5 text-slate-400"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-400"
            >
              {loading ? "Sending OTP..." : "Get OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="bg-green-100 border border-green-300 text-green-700 rounded-lg p-3 text-sm">
              {successMessage}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Enter OTP
              </label>

              <div className="relative">
                <ShieldCheck
                  size={18}
                  className="absolute left-3 top-3.5 text-slate-400"
                />

                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-green-400"
            >
              {loading ? "Verifying..." : "Verify OTP & Login"}
            </button>
          </form>
        )}

        <div className="text-center mt-6 text-sm text-slate-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:text-blue-700"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}