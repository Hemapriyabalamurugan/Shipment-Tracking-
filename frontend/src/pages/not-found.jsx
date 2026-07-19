
import { Link } from "react-router-dom";
import { Logo } from "@/components/shared/logo";
import { BrandBackdrop } from "@/components/shared/brand-backdrop";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-sidebar p-6 text-center">
      <BrandBackdrop />
      <div className="relative z-10 space-y-6">
        <Logo variant="dark" className="justify-center" />
        <div>
          <p className="text-[120px] font-extrabold leading-none text-white/10 sm:text-[160px]">
            404
          </p>
          <h1 className="mt-2 text-2xl font-bold text-white">Page not found</h1>
          <p className="mt-1 max-w-sm text-sm text-sidebar-foreground/60">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <Button asChild className="bg-white text-sidebar hover:bg-white/90">
          <Link to="/app/dashboard">
            <Compass className="mr-2 h-4 w-4" />
            Back to dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}