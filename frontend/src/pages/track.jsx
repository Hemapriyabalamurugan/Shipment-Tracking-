
import { useState } from "react";
// import { useTrackByNumber } from "@/lib/hooks";
import { useEffect } from "react";
import { shipmentsApi } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/shared/page-header";
import { MapView } from "@/components/shared/map-view";
import { TrackingTimeline } from "@/components/shared/tracking-timeline";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  Package,
  ArrowRight,
  Clock,
  Map as MapIcon,
} from "lucide-react";
import { relativeDay } from "@/lib/utils";

export function TrackPage() {
  const [trackingInput, setTrackingInput] = useState("");
  const [submitted, setSubmitted] = useState("");
  // =================================================
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(false);
  // const trackQuery = useTrackByNumber(submitted);
  // ==================================================
  useEffect(() => {
    if (!submitted) {
      setTracking(null);
      return;
    }

    async function loadTracking() {
      try {
        setLoading(true);

        const data = await shipmentsApi.getTracking(submitted);

        setTracking(data);
      } catch (error) {
        console.error(error);

        setTracking(null);
      } finally {
        setLoading(false);
      }
    }

    loadTracking();
  }, [submitted]);
  // ======================================================================
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(trackingInput.trim());
  };

  // const tracking = trackQuery.data;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Track a Package"
        description="Enter a tracking number for live status"
        icon={MapPin}
      />

      <Card className="overflow-hidden">
        <div className="relative grid-bg p-6 sm:p-8">
          <div className="mx-auto max-w-xl space-y-4">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl gradient-brand text-white shadow-lg shadow-primary/20">
                <Package className="h-7 w-7" />
              </div>
              <h2 className="mt-3 text-xl font-bold">Where's my package?</h2>
              <p className="text-sm text-muted-foreground">
                Enter your tracking number to see real-time updates
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-2 sm:flex-row"
            >
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={trackingInput}
                  onChange={(e) =>
                    setTrackingInput(e.target.value.toUpperCase())
                  }
                  placeholder="e.g. STP-9F4K-8821"
                  className="h-11 pl-9 font-mono"
                />
              </div>
              <Button type="submit" size="lg" disabled={!trackingInput.trim()}>
                Track <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </form>
{/* ===================================================================== */}
            {/* <p className="text-center text-xs text-muted-foreground">
              Try: STP-9F4K-8821 · STP-2H7M-4410 · STP-5C2P-7733
            </p> */}
            {/* ========================================================= */}
          </div>
        </div>
      </Card>

      {submitted && trackQuery.isLoading && (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Searching for {submitted}…
          </CardContent>
        </Card>
      )}

      {submitted && !trackQuery.isLoading && !shipment && (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-sm font-semibold text-foreground">
              No shipment found
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              We couldn't find a shipment with tracking number "{submitted}".
              Please check and try again.
            </p>
          </CardContent>
        </Card>
      )}

      {tracking && (
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-lg font-bold">
                      {shipment.trackingNumber}
                    </p>
                    <StatusBadge status={shipment.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {shipment.origin.name} → {shipment.destination.name}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> ETA
                    </p>
                    <p className="text-sm font-semibold">
                      {relativeDay(shipment.estimatedDelivery)}
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate(`/app/shipments/${shipment.id}`)}
                  >
                    Full details <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full gradient-brand"
                  style={{ width: `${shipment.progress}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {shipment.progress}% complete · currently at{" "}
                {shipment.currentLocation.name}
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <MapIcon className="h-4 w-4 text-primary" />
                  Live Location
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[320px]">
                  <MapView
                    shipment={shipment}
                    className="!rounded-none h-[320px]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Status Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <TrackingTimeline events={shipment.events} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}