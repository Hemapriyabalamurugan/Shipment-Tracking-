import { useParams } from "react-router-dom";
import { useRef } from "react";
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
import SignaturePad from "signature_pad";
import { shipmentsApi } from "@/lib/api";


export default function OperatorNavigationPage() {
  const { id } = useParams();

    const { data: navigation, isLoading } = useNavigation(id);
    const isAtDestination =
      navigation?.currentHub?.hubName === navigation?.destinationHub?.hubName;
    const reachNextHub = useReachNextHub();
    const updateStatus = useUpdateShipmentStatus();
    const [podImage, setPodImage] = useState(null);
    const [preview, setPreview] = useState(null);
  const currentStatus = navigation?.shipmentStatus;
  const navigate = useNavigate();

  const [selectedStatus, setSelectedStatus] = useState("");
  const [customerName, setCustomerName] = useState("");
  
  const sigRef = useRef(null);
  const signaturePad = useRef(null);

  


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

   
  //   const [selectedStatus, setSelectedStatus] = useState("");
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
          <Button
            onClick={() => reachNextHub.mutate(Number(id))}
            disabled={currentStatus === "DELIVERED"}
            className="bg-green-600"
          >
            Confirm Reached Hub
          </Button>
        </div>

        {isAtDestination && (
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-semibold">Proof of Delivery</h3>

            {/* <div className="space-y-2">
              <Label>Upload POD Image</Label>

              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setPodImage(e.target.files?.[0])}
              />
            </div> */}
            {/* <div className="space-y-2">
              <Label>Proof of Delivery (POD)</Label>

              <input
                id="pod-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setPodImage(e.target.files?.[0])}
              />

              <label htmlFor="pod-upload">
                <Button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                  asChild
                >
                  <span>Upload POD Image</span>
                </Button>
              </label>

              {podImage && (
                <p className="text-sm text-green-600 mt-2">✓ {podImage.name}</p>
              )}
            </div> */}
            <div className="space-y-3">
              {/* <Label>Proof of Delivery (POD)</Label> */}

              <input
                id="pod-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    setPodImage(file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />

              <label htmlFor="pod-upload">
                <Button
                  type="button"
                  asChild
                  className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  <span> Upload Proof of DeliveryImage</span>
                </Button>
              </label>

              {preview && (
                <div className="mt-4">
                  <img
                    src={preview}
                    alt="POD Preview"
                    className="w-full max-w-md h-64 object-cover rounded-lg border shadow"
                  />
                </div>
              )}
            </div>

            {/* <div className="space-y-2">
              <Label>Customer Signature</Label>

              <canvas
                ref={sigRef}
                width={700}
                height={180}
                className="border rounded-lg w-full"
              />

              <Button
                type="button"
                variant="outline"
                onClick={() => signaturePad.current.clear()}
              >
                Clear Signature
              </Button>
            </div> */}
            <div className="space-y-2">
              <Label>Customer Signature</Label>

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

                    console.log("SignaturePad initialized");
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
                onClick={() => {
                  if (signaturePad.current) {
                    signaturePad.current.clear();
                  }
                }}
              >
                Clear Signature
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Customer Name</Label>

              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>

            <div className="flex items-end gap-3">
              {/* <div className="w-72">
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
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
              </div> */}

              <Button
                disabled={!customerName || !podImage}
                // onClick={() => {
                //   const signature = sigRef.current
                //     .getTrimmedCanvas()
                //     .toDataURL("image/png");

                //   updateStatus.mutate({
                //     id: Number(id),
                //     status: selectedStatus,
                //     customerName,
                //     podImage,
                //     signature,
                //   });
                // }}
                onClick={async () => {
                  const signature = signaturePad.current.toDataURL();

                  // ADD THESE LINES HERE
                  if (signaturePad.current.isEmpty()) {
                    alert("Please capture the customer's signature.");
                    return;
                  }

                  const formData = new FormData();

                  formData.append(
                    "request",
                    JSON.stringify({
                      shipmentId: Number(id),
                      recipientName: customerName,
                      recipientPhone: "",
                      signatureUrl: signature,
                      deliveryNotes: "",
                    }),
                  );

                  formData.append("photo", podImage);
console.log("Photo size:", podImage.size);
console.log("Signature length:", signature.length);
                  await shipmentsApi.createPod(formData);

                  updateStatus.mutate({
                    id: Number(id),
                    status: selectedStatus,
                  });
                }}
              >
                Complete Delivery
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* <div className="flex justify-end gap-4"></div> */}
    </div>
  );
}
