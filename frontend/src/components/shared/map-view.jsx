

import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { cn } from "@/lib/utils";

// Fix default marker icon in leaflet bundling
const blueIcon = L.divIcon({
  className: "",
  html: `<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:hsl(217 91% 50%);border:3px solid white;box-shadow:0 4px 10px rgba(0,0,0,0.25)"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

const greenIcon = L.divIcon({
  className: "",
  html: `<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:hsl(142 71% 45%);border:3px solid white;box-shadow:0 4px 10px rgba(0,0,0,0.25)"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

const amberIcon = L.divIcon({
  className: "",
  html: `<div style="width:24px;height:24px;border-radius:50%;background:hsl(38 92% 50%);border:3px solid white;box-shadow:0 4px 10px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center"><div style="width:10px;height:10px;border-radius:50%;background:white;animation:pulse 1.6s infinite"></div></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 6);
    } else {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, {
        padding: [60, 60],
      });
    }
  }, [map, points]);
  return null;
}

export function MapView({
  // shipment,
  points,
  route,
  className,
  // ============
  // showCurrent = true,
  tracking,
  // ==================
  zoom = 5,
}) {
  const mapRef = useRef(null);
// =====================================================================
  // let allPoints = [];
  // let polyline = [];

  // if (shipment) {
  //   allPoints = [
  //     [shipment.origin.lat, shipment.origin.lng],
  //     [shipment.destination.lat, shipment.destination.lng],
  //   ];
  //   if (showCurrent)
  //     allPoints.push([
  //       shipment.currentLocation.lat,
  //       shipment.currentLocation.lng,
  //     ]);
  //   polyline = [
  //     [shipment.origin.lat, shipment.origin.lng],
  //     [shipment.currentLocation.lat, shipment.currentLocation.lng],
  //     [shipment.destination.lat, shipment.destination.lng],
  //   ];
  // } else if (points && points.length > 0) {
  //   allPoints = points.map((p) => [p.lat, p.lng]);
  // }



  // let allPoints = [];
  // let polyline = [];

  // if (tracking) {
  //   if (tracking.origin) {
  //     allPoints.push([tracking.origin.latitude, tracking.origin.longitude]);
  //   }

  //   if (tracking.currentLocation) {
  //     allPoints.push([
  //       tracking.currentLocation.latitude,
  //       tracking.currentLocation.longitude,
  //     ]);
  //   }

  //   if (tracking.destination) {
  //     allPoints.push([
  //       tracking.destination.latitude,
  //       tracking.destination.longitude,
  //     ]);
  //   }

  //   if (tracking.route) {
  //     polyline = tracking.route.map((hub) => [hub.latitude, hub.longitude]);
  //   }
  // }


  let allPoints = [];
  let polyline = [];

  if (tracking) {
    if (tracking.origin) {
      allPoints.push([tracking.origin.latitude, tracking.origin.longitude]);
    }

    if (tracking.currentLocation) {
      allPoints.push([
        tracking.currentLocation.latitude,
        tracking.currentLocation.longitude,
      ]);
    }

    if (tracking.destination) {
      allPoints.push([
        tracking.destination.latitude,
        tracking.destination.longitude,
      ]);
    }

    if (tracking.route) {
      polyline = tracking.route.map((hub) => [hub.latitude, hub.longitude]);
    }
  } else if (points?.length) {
    allPoints = points.map((p) => [p.lat, p.lng]);

    polyline = route?.map((p) => [p.lat, p.lng]) ?? [];
  }
  // =================================================================================

  // if (route && route.length > 0) {
  //   polyline = route.map((p) => [p.lat, p.lng]);
  // }

  return (
    <MapContainer
      center={allPoints[0] ?? [20.5937, 78.9629]}
      zoom={zoom}
      scrollWheelZoom={false}
      className={cn("h-full w-full rounded-xl", className)}
      ref={(m) => {
        if (m) mapRef.current = m;
      }}
    >
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <FitBounds points={allPoints} />

      {/* ================================================================================================= */}
      {/* {shipment && (
        <> */}
      {/* <Marker
            position={[shipment.origin.lat, shipment.origin.lng]}
            icon={blueIcon}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">Origin</p>
                <p className="text-muted-foreground">{shipment.senderCity}</p>
              </div>
            </Popup>
          </Marker> */}

      {/* <Marker
            position={[shipment.destination.lat, shipment.destination.lng]}
            icon={greenIcon}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">Destination</p>
                <p className="text-muted-foreground">{shipment.receiverCity}</p>
              </div>
            </Popup>
          </Marker> */}

      {/* {showCurrent && (
            <Marker
              position={[
                shipment.currentLocation.lat,
                shipment.currentLocation.lng,
              ]}
              icon={amberIcon}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">Current location</p>
                  <p className="text-muted-foreground">
                    {shipment.currentLocation.name}
                  </p>
                </div>
              </Popup>
            </Marker>
          )} */}

      {/* <Polyline
            positions={polyline}
            pathOptions={{
              color: "hsl(217, 91%, 50%)",
              weight: 3,
              opacity: 0.7,
              dashArray: showCurrent ? undefined : "8 8",
            }}
          /> */}
      {/* </>
      )} */}

      {tracking && (
        <>
          {/* Origin */}
          {tracking.origin && (
            <Marker
              position={[tracking.origin.latitude, tracking.origin.longitude]}
              icon={blueIcon}
            >
              <Popup>
                <strong>Origin</strong>
                <br />
                {tracking.origin.hubName}
              </Popup>
            </Marker>
          )}

          {/* Destination */}
          {tracking.destination && (
            <Marker
              position={[
                tracking.destination.latitude,
                tracking.destination.longitude,
              ]}
              icon={greenIcon}
            >
              <Popup>
                <strong>Destination</strong>
                <br />
                {tracking.destination.hubName}
              </Popup>
            </Marker>
          )}

          {/* Current Package Location */}
          {tracking.currentLocation && (
            <Marker
              position={[
                tracking.currentLocation.latitude,
                tracking.currentLocation.longitude,
              ]}
              icon={amberIcon}
            >
              <Popup>
                <strong>Current Location</strong>
                <br />
                {tracking.currentLocation.hubName}
              </Popup>
            </Marker>
          )}

          <Polyline
            positions={polyline}
            pathOptions={{
              color: "hsl(217, 91%, 50%)",
              weight: 4,
            }}
          />
        </>
      )}
      {/* ==================================================================================================== */}

      {points?.map((p, i) => (
        <Marker
          key={i}
          position={[p.lat, p.lng]}
          icon={L.divIcon({
            className: "",
            html: `<div style="width:22px;height:22px;border-radius:50%;background:${
              p.status === "active"
                ? "hsl(142 71% 45%)"
                : p.status === "maintenance"
                  ? "hsl(0 72% 51%)"
                  : p.status === "idle"
                    ? "hsl(38 92% 50%)"
                    : "hsl(215 16% 60%)"
            };border:2.5px solid white;box-shadow:0 3px 8px rgba(0,0,0,0.25)"></div>`,
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          })}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{p.name}</p>
            </div>
          </Popup>
        </Marker>
      ))}
      {!tracking && polyline.length > 0 && (
        <Polyline
          positions={polyline}
          pathOptions={{
            color: "hsl(217, 91%, 50%)",
            weight: 4,
          }}
        />
      )}
    </MapContainer>
  );
}