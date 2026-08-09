

import { useParams } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import SignaturePad from "signature_pad";
import { toast } from "sonner";
import { CheckCircle2, ImagePlus, PenLine } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useNavigation,
  useReachNextHub,
  useUpdateShipmentStatus,
} from "@/lib/hooks";

import { shipmentsApi, podApi } from "@/lib/api";

export default function OperatorNavigationPage() {
  const { id } = useParams();

  const { data: navigation, isLoading } = useNavigation(id);

  const reachNextHub = useReachNextHub();
  const updateStatus = useUpdateShipmentStatus();

  const currentStatus = navigation?.shipmentStatus;

  const isAtDestination =
    navigation?.currentHub?.hubName === navigation?.destinationHub?.hubName;

  // =========================================================
  // STATUS
  // =========================================================

  const [selectedStatus, setSelectedStatus] = useState("");

  // =========================================================
  // POD
  // =========================================================

  const [podImage, setPodImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [isCompletingDelivery, setIsCompletingDelivery] = useState(false);

  const sigRef = useRef(null);
  const signaturePad = useRef(null);

  const showPodSection = currentStatus === "OUT_FOR_DELIVERY";

  // =========================================================
  // JOURNEY UPDATE
  // =========================================================

  const [trafficCondition, setTrafficCondition] = useState("LOW");

  const [weatherCondition, setWeatherCondition] = useState("CLEAR");

  const [roadCondition, setRoadCondition] = useState("GOOD");

  const [remarks, setRemarks] = useState("");

  const TRAFFIC_OPTIONS = ["LOW", "MODERATE", "HEAVY"];

  const WEATHER_OPTIONS = ["CLEAR", "RAIN", "FOG", "STORM"];

  const ROAD_OPTIONS = ["GOOD", "UNDER_CONSTRUCTION", "ACCIDENT", "BLOCKED"];

  // =========================================================
  // CLEAN IMAGE PREVIEW
  // =========================================================

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // =========================================================
  // POD IMAGE
  // =========================================================

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPodImage(file);
    setPreview(URL.createObjectURL(file));
  }

  // =========================================================
  // STATUS OPTIONS
  // =========================================================

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

  // =========================================================
  // NORMAL STATUS UPDATE + DELIVERED WITH POD
  // =========================================================

  async function handleStatusUpdate() {
    if (!selectedStatus) {
      return;
    }

    // Normal status updates work exactly as before
    if (selectedStatus !== "DELIVERED") {
      updateStatus.mutate({
        id: Number(id),
        status: selectedStatus,
      });

      return;
    }

    // =====================================================
    // DELIVERED REQUIRES POD
    // =====================================================

    if (!customerName.trim()) {
      toast.error("Please enter the recipient name.");
      return;
    }

    if (!podImage) {
      toast.error("Please upload the Proof of Delivery image.");
      return;
    }

    if (!signaturePad.current || signaturePad.current.isEmpty()) {
      toast.error("Please provide the customer signature.");
      return;
    }

    try {
      setIsCompletingDelivery(true);

      const signature = signaturePad.current.toDataURL();

      const formData = new FormData();

      formData.append(
        "request",
        JSON.stringify({
          shipmentId: Number(id),
          recipientName: customerName.trim(),
          signatureUrl: signature,
        }),
      );

      formData.append("photo", podImage);

      // STEP 1: CREATE POD
      await podApi.create(formData);

      // STEP 2: MARK SHIPMENT DELIVERED
      await updateStatus.mutateAsync({
        id: Number(id),
        status: "DELIVERED",
      });

      toast.success(
        "Delivery completed and Proof of Delivery submitted successfully.",
      );

      setSelectedStatus("");
    } catch (error) {
      console.error("Complete delivery failed:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to complete delivery.";

      toast.error(message);
    } finally {
      setIsCompletingDelivery(false);
    }
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* =====================================================
          ROUTE
      ===================================================== */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-center">
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

      {/* =====================================================
          CURRENT / NEXT HUB
      ===================================================== */}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="mb-2 text-sm text-muted-foreground">Current Hub</p>

          <h2 className="text-2xl font-semibold">
            {navigation?.currentHub?.hubName}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="mb-2 text-sm text-muted-foreground">Next Hub</p>

          <h2 className="text-2xl font-semibold">
            {navigation?.nextHub?.hubName ?? "Destination"}
          </h2>
        </div>
      </div>

      <div className="space-y-6">
        {/* ===================================================
            JOURNEY UPDATE
        =================================================== */}

        <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Journey Update</h3>

          <div className="grid gap-4 md:grid-cols-3">
            {/* TRAFFIC */}

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

            {/* WEATHER */}

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

            {/* ROAD */}

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

          {/* REMARKS */}

          <div>
            <Label>Remarks</Label>

            <Input
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Optional remarks"
            />
          </div>
        </div>

        {/* ===================================================
            POD
            ONLY SHOW WHEN OUT FOR DELIVERY
        =================================================== */}

        {showPodSection && (
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="space-y-8">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  Submit Proof of Delivery
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Upload delivery proof and collect the recipient signature
                  before marking the shipment as delivered.
                </p>
              </div>

              {/* =============================================
                  POD IMAGE
              ============================================= */}

              <div className="space-y-3">
                <Label className="mr-4">Proof of Delivery Image</Label>

                <input
                  id="operator-pod-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />

                <label htmlFor="operator-pod-upload">
                  <Button type="button" asChild variant="outline">
                    <span className="cursor-pointer">
                      <ImagePlus className="mr-2 h-4 w-4" />

                      {podImage ? "Change Image" : "Upload Image"}
                    </span>
                  </Button>
                </label>

                {preview && (
                  <div className="mt-4 overflow-hidden rounded-xl border">
                    <img
                      src={preview}
                      alt="Proof of Delivery preview"
                      className="max-h-[420px] w-full object-contain"
                    />
                  </div>
                )}
              </div>

              {/* =============================================
                  SIGNATURE
              ============================================= */}

              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <PenLine className="h-4 w-4" />
                  Customer Signature
                </Label>

                <canvas
                  ref={(canvas) => {
                    if (!canvas) return;

                    sigRef.current = canvas;

                    if (!signaturePad.current) {
                      signaturePad.current = new SignaturePad(canvas, {
                        penColor: "black",
                        minWidth: 1,
                        maxWidth: 2,
                      });
                    }
                  }}
                  style={{
                    width: "100%",
                    height: "180px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    background: "#fff",
                    touchAction: "none",
                  }}
                />

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => signaturePad.current?.clear()}
                >
                  Clear Signature
                </Button>
              </div>

              {/* =============================================
                  RECIPIENT NAME
              ============================================= */}

              <div className="space-y-2">
                <Label>Recipient Name</Label>

                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter recipient name"
                />
              </div>
            </div>
          </div>
        )}

        {/* ===================================================
            STATUS + REACHED HUB
        =================================================== */}

        <div className="flex justify-center gap-10">
          {/* STATUS */}

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
              disabled={
                !selectedStatus ||
                currentStatus === "DELIVERED" ||
                isCompletingDelivery
              }
              onClick={handleStatusUpdate}
            >
              {isCompletingDelivery
                ? "Completing..."
                : selectedStatus === "DELIVERED"
                  ? "Complete Delivery"
                  : "Update"}
            </Button>
          </div>

          {/* CONFIRM HUB */}

          <Button
            onClick={async () => {
              try {
                await shipmentsApi.updateJourney({
                  shipmentId: Number(id),
                  trafficCondition,
                  weatherCondition,
                  roadCondition,
                  remarks,
                });

                await reachNextHub.mutateAsync(Number(id));
              } catch (error) {
                console.error("Journey update failed:", error);

                toast.error(
                  error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    "Failed to update journey.",
                );
              }
            }}
            disabled={currentStatus === "DELIVERED"}
            className="bg-green-600"
          >
            Confirm Reached Hub
          </Button>
        </div>
      </div>
    </div>
  );
}