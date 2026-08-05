import { useParams } from "react-router-dom";
// import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useNavigation,
  useReachNextHub,
  useUpdateShipmentStatus,
} from "@/lib/hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
// import SignaturePad from "signature_pad";
import { shipmentsApi } from "@/lib/api";


export default function OperatorNavigationPage() {
  const { id } = useParams();

    const { data: navigation, isLoading } = useNavigation(id);
    const isAtDestination =
      navigation?.currentHub?.hubName === navigation?.destinationHub?.hubName;
    const reachNextHub = useReachNextHub();
    const updateStatus = useUpdateShipmentStatus();
    // const [podImage, setPodImage] = useState(null);
    // const [preview, setPreview] = useState(null);
  const currentStatus = navigation?.shipmentStatus;
  const navigate = useNavigate();

  const [selectedStatus, setSelectedStatus] = useState("");
  // const [customerName, setCustomerName] = useState("");
  
  // const sigRef = useRef(null);
  // const signaturePad = useRef(null);

 

  const [trafficCondition, setTrafficCondition] = useState("LOW");
  const [weatherCondition, setWeatherCondition] = useState("CLEAR");
  const [roadCondition, setRoadCondition] = useState("GOOD");
  const [remarks, setRemarks] = useState("");

  const TRAFFIC_OPTIONS = ["LOW", "MODERATE", "HEAVY"];

  const WEATHER_OPTIONS = ["CLEAR", "RAIN", "FOG", "STORM"];

  const ROAD_OPTIONS = ["GOOD", "UNDER_CONSTRUCTION", "ACCIDENT", "BLOCKED"];


    let statusOptions = [];

    if (currentStatus === "PICKED_UP") {
      statusOptions = ["IN_TRANSIT"];
    } else if (currentStatus === "IN_TRANSIT") {
      statusOptions = isAtDestination ? ["OUT_FOR_DELIVERY"] : [];
    } else if (currentStatus === "OUT_FOR_DELIVERY") {
      statusOptions = ["DELIVERED", "FAILED_DELIVERY"];
    } else if (currentStatus === "DELIVERED") {
      statusOptions = ["DELIVERED"];
    }

   
  
  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-800">
            {navigation?.originHub?.hubName}
          </span>

          <span className="mx-6 text-2xl text-gray-500">
            ------------------------------→
          </span>

          <span className="text-lg font-semibold text-gray-800">
            {navigation?.destinationHub?.hubName}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-2">Current Hub</p>

          <h2 className="text-2xl font-semibold">
            {navigation?.currentHub?.hubName}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-2">Next Hub</p>

          <h2 className="text-2xl font-semibold">
            {navigation?.nextHub?.hubName ?? "Destination"}
          </h2>
        </div>
      </div>

      <div className="space-y-6">
        {/* newline added */}

        <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold">Journey Update</h3>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>Traffic</Label>

              <Select
                value={trafficCondition}
                onValueChange={setTrafficCondition}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {TRAFFIC_OPTIONS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item.replaceAll("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Weather</Label>

              <Select
                value={weatherCondition}
                onValueChange={setWeatherCondition}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {WEATHER_OPTIONS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item.replaceAll("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Road</Label>

              <Select value={roadCondition} onValueChange={setRoadCondition}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {ROAD_OPTIONS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item.replaceAll("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Remarks</Label>

            <Input
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Optional remarks"
            />
          </div>
        </div>

        {/* ==================================================== */}
        <div className="flex justify-center gap-10">
          <div className="flex items-end gap-3">
            <div className="w-64">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>

                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replaceAll("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              disabled={!selectedStatus || currentStatus === "DELIVERED"}
              onClick={() =>
                updateStatus.mutate({
                  id: Number(id),
                  status: selectedStatus,
                })
              }
            >
              Update
            </Button>
          </div>
          {/* <Button
            onClick={() => reachNextHub.mutate(Number(id))}
            disabled={currentStatus === "DELIVERED"}
            className="bg-green-600"
          >
            Confirm Reached Hub
          </Button> */}

          <Button
            onClick={async () => {
              await shipmentsApi.updateJourney({
                shipmentId: Number(id),
                trafficCondition,
                weatherCondition,
                roadCondition,
                remarks,
              });

              reachNextHub.mutate(Number(id));
            }}
            disabled={currentStatus === "DELIVERED"}
            className="bg-green-600"
          >
            Confirm Reached Hub
          </Button>
        </div>

        
      </div>

      {/* <div className="flex justify-end gap-4"></div> */}
    </div>
  );
}
