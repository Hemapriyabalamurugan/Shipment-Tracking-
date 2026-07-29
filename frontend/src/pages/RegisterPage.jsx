
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // make sure react-router-dom is installed
import { authApi } from "@/lib/api";
const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword:"",
    address:"",
    companyName: "",
    role: "",
    termsAccepted: false,
  });

  // Mapping of roles to dashboard routes
  // const roleRouteMap = {
  //   customer: "/customer-dashboard",
  //   businessclient: "/business-dashboard",
  //   support: "/support-dashboard",
  //   // add more mappings as needed, e.g.:
  //   // shipper: '/shipper-dashboard',
  //   // carrier: '/carrier-dashboard',
  //   // freight_forwarder: '/freight-dashboard',
  //   // warehouse_manager: '/warehouse-dashboard',
  //   // logistics_manager: '/logistics-dashboard',
    
  // };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  //   const handleSubmit = (e) => {
  //     e.preventDefault();

  //     // Validate terms
  //     if (!formData.termsAccepted) {
  //       alert("Please accept the Terms & Conditions and Privacy Policy");
  //       return;
  //     }

  //     // Simulate account creation (replace with actual API call)
  //     console.log("Account created with:", formData);

  //     // Determine redirect path based on selected role
  //     const selectedRole = formData.role;
  //     const redirectPath = roleRouteMap[selectedRole] || "/dashboard"; // fallback

  //     // Redirect to the appropriate dashboard
  //     navigate(redirectPath);
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.termsAccepted) {
      alert("Please accept the Terms & Conditions and Privacy Policy");
      return;
    }

    try {
      // ================================ changes done here =================
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      setLoading(true);
// =======================================================================
      // const response = await axios.post(
      //   "http://localhost:8080/api/auth/register",
      //   {
      //     firstName: formData.firstName,
      //     lastName: formData.lastName,
      //     email: formData.email,
      //     phone: formData.phone,
      //     password: formData.password,
      //     confirmPassword:formData.confirmPassword,
      //     address: formData.address,
      //     companyName: formData.companyName,
      //     role: formData.role,
      //   },
      // );
// =================================================================
      const response = await authApi.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        address: formData.address,
        companyName: formData.companyName,
        role: formData.role,
      });

      // console.log("Registration Success:", response.data);

      alert("Account created successfully!");

      navigate("/login");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle "Login" link click
  const handleLoginRedirect = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-2xl transition-transform duration-300">
          {/* Brand Header */}
          <div className="text-center mb-7">
            <div className="flex items-center justify-center gap-2.5">
              <span className="text-3xl"></span>
              {/* <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                ShipTrack
              </h1> */}
            </div>
            {/* <p className="text-sm text-slate-500 mt-0.5 tracking-wide font-medium">
              Shipment Tracking System
            </p> */}
            {/* <div className="mt-2.5 text-sm text-slate-800 bg-slate-100 py-1.5 px-4 rounded-full inline-flex items-center gap-1">
              
              
            </div> */}
          </div>

          {/* Form Content */}
          <div className="form-content">
            <h2 className="text-3xl text-center font-bold text-slate-900 mb-5">
              Create Your Account
            </h2>
            {/* <p className="text-sm text-slate-500 mb-6">
              Join ShipTrack and simplify your shipping experience.
            </p> */}

            <form onSubmit={handleSubmit}>
              {/* First & Last Name */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-semibold text-slate-800 mb-1 mt-3"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:bg-white outline-none transition placeholder:text-slate-400"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-semibold text-slate-800 mb-1 mt-3"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:bg-white outline-none transition placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-800 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:bg-white outline-none transition placeholder:text-slate-400"
                />
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-slate-800 mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:bg-white outline-none transition placeholder:text-slate-400"
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-800 mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:bg-white outline-none transition placeholder:text-slate-400"
                />
              </div>
              {/* Password */}
              <div className="mb-4">
                <label
                  htmlFor="confirm Password"
                  className="block text-sm font-semibold text-slate-800 mb-1"
                >
                  confirmPassword
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:bg-white outline-none transition placeholder:text-slate-400"
                />
              </div>
              {/* Username */}
              <div className="mb-4">
                <label
                  htmlFor="address"
                  className="block text-sm font-semibold text-slate-800 mb-1"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="write your address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:bg-white outline-none transition placeholder:text-slate-400"
                />
              </div>

              {/* Company (optional) */}
              <div className="mb-4">
                <label
                  htmlFor="companyName"
                  className="block text-sm font-semibold text-slate-800 mb-1"
                >
                  Company Name (Optional)
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  placeholder="Enter your company name"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:bg-white outline-none transition placeholder:text-slate-400"
                />
              </div>

              {/* Role */}
              <div className="mb-4">
                <label
                  htmlFor="role"
                  className="block text-sm font-semibold text-slate-800 mb-1"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:bg-white outline-none transition"
                >
                  <option value="">Select your role</option>
                  <option value="CUSTOMER">Customer</option>
                  <option value="BUSINESS_CLIENT">Business Client</option>
                  <option value="LOGISTICS_OPERATOR">Logistics Manager</option>
                  <option value="SUPPORT_AGENT">Support</option>
                  
                </select>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2.5 mt-1">
                <input
                  type="checkbox"
                  id="termsAccepted"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="w-4.5 h-4.5 mt-0.5 accent-blue-600 shrink-0 cursor-pointer"
                />
                <label
                  htmlFor="termsAccepted"
                  className="text-sm text-slate-700 cursor-pointer"
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Terms &amp; Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-base tracking-wide transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/30 active:translate-y-0 active:shadow-none"
              >
                {/* Create Account */}
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Login link with navigation */}
            <div className="text-center mt-5 text-sm text-slate-600">
              Already have an account?{" "}
              <a
                href="#"
                onClick={handleLoginRedirect}
                className="text-blue-600 font-semibold hover:underline"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
