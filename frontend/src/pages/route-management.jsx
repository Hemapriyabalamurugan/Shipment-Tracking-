
import { useState } from "react";
import { useRoutes } from "@/lib/hooks";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { MapView } from "@/components/shared/map-view";
import { LoadingState } from "@/components/shared/states";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";



import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Route, MapPinned, Map, Navigation,ArrowDownUp } from "lucide-react";

import { useHubs, useFindRoute } from "@/lib/hooks";


export function RouteManagementPage() {
 


  const { data: hubs, isLoading } = useHubs();
 

  const [originHubId, setOriginHubId] = useState("");
  const [destinationHubId, setDestinationHubId] = useState("");

  // const [search, setSearch] = useState(false);

  // const { data: route } = useFindRoute(
  //   originHubId,
  //   destinationHubId,
  //   search
  // );
  // const [searchParams, setSearchParams] = useState(null);

  // const { data: route } = useFindRoute(
  //   searchParams?.originHubId,
  //   searchParams?.destinationHubId,
  // );
  const [request, setRequest] = useState(null);

  const { data: route } = useFindRoute(
    request?.originHubId,
    request?.destinationHubId,
  );

const selectedPoints =
  route?.route?.map((hub) => ({
    lat: hub.latitude,
    lng: hub.longitude,
    name: hub.hubName,
    status: "active",
  })) ?? [];

const selectedRoute =
  route?.route?.map((hub) => ({
    lat: hub.latitude,
    lng: hub.longitude,
  })) ?? [];

const totalRoutes = route ? 1 : 0;

const totalDistance = route?.totalDistanceKm ?? 0;

const totalHubs = route?.totalHubs ?? 0;

const eta = route ? `${route.estimatedHours}h ${route.estimatedMinutes}m` : "-";


   if (isLoading) {
     return (
       <div>
         <PageHeader
           title="Route Management"
           description="Plan, optimize & monitor delivery routes"
           icon={Route}
         />
         <LoadingState />
       </div>
     );
   }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Route Management"
        description="Plan, optimize & monitor delivery routes"
        icon={Route}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Route Found"
          value={totalRoutes}
          icon={Route}
          iconClass="bg-primary/10 text-primary"
        />

        <StatCard
          label="Total Distance"
          value={`${totalDistance} km`}
          icon={Navigation}
          iconClass="bg-success/10 text-success"
        />

        <StatCard
          label="Total Hubs"
          value={totalHubs}
          icon={MapPinned}
          iconClass="bg-chart-3/10 text-chart-3"
        />

        <StatCard
          label="Estimated Time"
          value={eta}
          icon={Map}
          iconClass="bg-warning/10 text-warning"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
        <Card className="lg:col-span-2 overflow-hidden p-0">
          <div className="border-b border-border p-4 space-y-4">
            <div>
              <CardTitle className="text-sm">Route Finder</CardTitle>

              <CardDescription className="text-xs">
                Select origin and destination hub
              </CardDescription>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Select value={originHubId} onValueChange={setOriginHubId}>
                <SelectTrigger>
                  <SelectValue placeholder="Origin Hub" />
                </SelectTrigger>

                <SelectContent className="z-[9999]">
                  {hubs?.map((hub) => (
                    <SelectItem key={hub.id} value={String(hub.id)}>
                      {hub.hubName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/*  ======================================================================from moulika*/}
                {/* <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                        const temp = originHubId;
                        setOriginHubId(destinationHubId);
                        setDestinationHubId(temp);
                    }}
                >
                    <ArrowDownUp className="h-4 w-4" />
                </Button> */}
              {/*  ================================================================================*/}

              <Select
                value={destinationHubId}
                onValueChange={setDestinationHubId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Destination Hub" />
                </SelectTrigger>

                <SelectContent className="z-[9999]">
                  {hubs?.map((hub) => (
                    <SelectItem key={hub.id} value={String(hub.id)}>
                      {hub.hubName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* <Button
                onClick={() => setSearch(true)}
                disabled={!originHubId || !destinationHubId}
              >
                Show Route
              </Button> */}
              <Button
                onClick={() =>
                  setRequest({
                    originHubId,
                    destinationHubId,
                  })
                }
                disabled={!originHubId || !destinationHubId}
              >
                Show Route
              </Button>
            </div>
          </div>
          <div className="h-[420px]">
            {/* <MapView
              points={selectedPoints}
              route={selectedRoute}
              zoom={selected ? 5 : 4}
              className="!rounded-none h-[420px]"
            /> */}
            <MapView
              points={selectedPoints}
              route={selectedRoute}
              zoom={route ? 5 : 4}
              className="!rounded-none h-[420px]"
            />
          </div>
        </Card>
        {/*================================================================*/}
        <div className="space-y-3 max-h-[480px] overflow-y-auto scrollbar-thin">
         {route && (
           <Card>
             <CardContent className="p-5">
                <CardTitle className="mb-4">Route Details</CardTitle>

               <div className="space-y-4">
                  {route?.route?.map((hub, index) => (
                    <div key={hub.hubId} className="flex flex-col items-center">
                      <div className="w-full rounded-lg border p-3">
                        <div className="font-semibold">{hub.hubName}</div>

                      <div className="text-xs text-muted-foreground">
                         {hub.city}
                       </div>
                     </div>

                     {index !== route.route.length - 1 && (
                       <div className="flex flex-col items-center py-2">
                         <div className="h-8 border-l-2 border-dashed border-primary" />

                         <div className="text-xs font-medium text-primary">
                           {hub.distanceToNextKm} km
                         </div>
                       </div>
                     )}
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>
          )}
        </div>


      {/*    ========================== from moulika*/}
          {/* Calculated Route Results Section */}
          {/* {route && ( */}
               {/* <div className="glass-card result-card"> */}
                  {/* Total Distance & Route Banner */}
                  {/* <div className="summary-banner">
                      <div>
                          <div className="banner-subtitle">Calculated Shortest Route (Dijkstra Algorithm)</div>
                          <div className="banner-title">
                              {route.sourceHub.city} <ArrowRight className="inline-icon" size={20} /> {route.destinationHub.city}
                          </div>
                      </div>

                      <div className="distance-badge">
                          <span className="distance-val">{route.totalDistanceKm}</span>
                          <span className="distance-unit">km Total Distance</span>
                      </div>
                  </div> */}

                  {/* Logistics Metrics Grid */}
                  {/* <div className="vehicle-metrics-grid">
                      <div className="metric-card">
                          <div className="metric-icon vehicle-icon">
                              <Truck size={20} />
                          </div>
                          <div className="metric-info">
                              <span className="metric-label">Vehicle Selected</span>
                              <span className="metric-value">{route.selectedVehicle || vehicleType}</span>
                          </div>
                      </div>

                      <div className="metric-card">
                          <div className="metric-icon time-icon">
                              <Clock size={20} />
                          </div>
                          <div className="metric-info">
                              <span className="metric-label">Est. Travel Time</span>
                              <span className="metric-value">{route.estimatedTravelTime}</span>
                          </div>
                      </div>

                      <div className="metric-card">
                          <div className={`metric-icon ${isNotRecommended ? 'warning-status-icon' : 'success-status-icon'}`}>
                              {isNotRecommended ? <AlertOctagon size={20} /> : <ShieldCheck size={20} />}
                          </div>
                          <div className="metric-info">
                              <span className="metric-label">Vehicle Suitability</span>
                              <span className={`status-tag ${isNotRecommended ? 'not-recommended' : 'recommended'}`}>
                  {isNotRecommended ? 'Not Recommended' : 'Recommended'}
                </span>
                          </div>
                      </div>
                  </div> */}

                  {/* Recommendation Warning Banner */}
                  {/* {isNotRecommended && (
                      <div className="warning-recommendation-banner">
                          <AlertTriangle className="warning-icon" size={22} />
                          <div className="warning-content">
                              <h4 className="warning-title">Vehicle Distance Warning</h4>
                              <p className="warning-message">{routeResult.vehicleMessage}</p>
                          </div>
                      </div>
                  )} */}
              {/* // </div> */}
          {/* // )} */}
      {/*    ============================================================*/}
      </div>
    </div>
  );
}