import { useNavigate } from "react-router-dom";
import landingImage from "../assets/landingpage.png";
import { Logo } from "@/components/shared/logo";
import { ArrowRight, Truck, ShieldCheck, BarChart3, Clock, MapPin, Globe } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col grid-bg selection:bg-primary/30 selection:text-primary">
      {/* Header Navbar */}
      <header className="sticky top-0 z-50 glass-dark border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo variant="dark" />

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="gradient-brand px-5 py-2 rounded-xl text-xs font-bold text-white shadow-lg shadow-primary/25 hover:opacity-95 transition cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero Container */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-7xl mx-auto px-6 py-12 lg:py-16 space-y-12">
        {/* Hero Copy */}
        <div className="text-center space-y-6 max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1.5 text-xs font-semibold text-primary shadow-xs">
            <Truck className="h-4 w-4 animate-pulse text-primary" />
            ShipTrackPro v2.0 Enterprise Release
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Next-Gen Global <span className="text-transparent bg-clip-text gradient-brand">Logistics Management</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
            Streamline end-to-end shipment tracking, automated ETA predictions, driver telemetry, proof of delivery, and analytics in one unified platform.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate("/register")}
              className="gradient-brand text-white px-8 py-3.5 rounded-xl text-sm font-bold shadow-xl shadow-primary/25 hover:opacity-95 transition flex items-center gap-2 cursor-pointer"
            >
              Start Tracking Now
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="glass-dark border border-slate-800 text-slate-300 hover:text-white px-7 py-3.5 rounded-xl text-sm font-semibold hover:border-slate-700 transition"
            >
              Portal Login
            </button>
          </div>
        </div>

        {/* Hero Graphic Preview Card */}
        <div className="w-full max-w-5xl rounded-2xl border border-slate-800 bg-slate-900/60 p-3 shadow-2xl overflow-hidden glass-dark">
          <img
            src={landingImage}
            alt="ShipTrackPro Dashboard Preview"
            className="w-full h-auto rounded-xl object-cover shadow-lg border border-slate-800/80"
          />
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-8 border-t border-slate-800/80">
          <div className="glass-dark p-6 rounded-2xl border border-slate-800 space-y-2">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 mb-3">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Live Vehicle Telemetry</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Real-time driver location updates, route history logs, and instant exception alerts.</p>
          </div>

          <div className="glass-dark p-6 rounded-2xl border border-slate-800 space-y-2">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 mb-3">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Verified Proof of Delivery</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Digital signature capture, photo upload, and tamper-proof POD records for complete auditability.</p>
          </div>

          <div className="glass-dark p-6 rounded-2xl border border-slate-800 space-y-2">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 mb-3">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Enterprise Analytics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Deep operational insights, carrier performance metrics, on-time delivery rates, and cost reports.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500 glass-dark">
        <p>© {new Date().getFullYear()} ShipTrackPro Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
