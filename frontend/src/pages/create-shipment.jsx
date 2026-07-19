
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateShipment } from "@/lib/hooks";
import { useAuth } from "@/context/auth-context";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import {
  Package,
  ArrowRight,
  ArrowLeft,
  Check,
  MapPin,
  Truck,
  Plane,
  Ship,
  Train,
  FileText,
  Boxes,
  Sparkles,
} from "lucide-react";

const STEPS = [
  { id: 0, label: "Shipment Details", icon: Package },
  { id: 1, label: "Origin & Destination", icon: MapPin },
  { id: 2, label: "Service & Priority", icon: Truck },
  { id: 3, label: "Review & Confirm", icon: Check },
];

const MODES = [
  {
    value: "road",
    label: "Road Freight",
    icon: Truck,
    desc: "2-5 business days",
    baseCost: 180,
  },
  {
    value: "air",
    label: "Air Freight",
    icon: Plane,
    desc: "1-2 business days",
    baseCost: 520,
  },
  // {
  //   value: "ocean",
  //   label: "Ocean Freight",
  //   icon: Ship,
  //   desc: "7-14 business days",
  //   baseCost: 340,
  // },
  {
    value: "rail",
    label: "Rail Freight",
    icon: Train,
    desc: "4-7 business days",
    baseCost: 240,
  },
];

const PRIORITIES = [
  {
    value: "standard",
    label: "Standard",
    multiplier: 1,
    class: "border-muted",
  },
  {
    value: "express",
    label: "Express",
    multiplier: 1.5,
    class: "border-warning/40",
  },
  {
    value: "critical",
    label: "Critical",
    multiplier: 2,
    class: "border-destructive/40",
  },
];

const CITIES = [
  {
    name: "Mumbai",
    lat: 19.076,
    lng: 72.8777,
    address: "Andheri East, Mumbai, Maharashtra 400069",
  },
  {
    name: "Delhi",
    lat: 28.6139,
    lng: 77.209,
    address: "Connaught Place, New Delhi, Delhi 110001",
  },
  {
    name: "Bengaluru",
    lat: 12.9716,
    lng: 77.5946,
    address: "MG Road, Bengaluru, Karnataka 560001",
  },
  {
    name: "Hyderabad",
    lat: 17.385,
    lng: 78.4867,
    address: "Hitech City, Hyderabad, Telangana 500081",
  },
  {
    name: "Chennai",
    lat: 13.0827,
    lng: 80.2707,
    address: "Guindy, Chennai, Tamil Nadu 600032",
  },
  {
    name: "Kolkata",
    lat: 22.5726,
    lng: 88.3639,
    address: "Salt Lake City, Kolkata, West Bengal 700091",
  },
  {
    name: "Pune",
    lat: 18.5204,
    lng: 73.8567,
    address: "Hinjewadi, Pune, Maharashtra 411057",
  },
  {
    name: "Ahmedabad",
    lat: 23.0225,
    lng: 72.5714,
    address: "SG Highway, Ahmedabad, Gujarat 380015",
  },
  {
    name: "Jaipur",
    lat: 26.9124,
    lng: 75.7873,
    address: "Vaishali Nagar, Jaipur, Rajasthan 302021",
  },
  {
    name: "Lucknow",
    lat: 26.8467,
    lng: 80.9462,
    address: "Hazratganj, Lucknow, Uttar Pradesh 226001",
  },
];


const INITIAL = {
  description: "",
  weightKg: 100,
  pieces: 1,
  declaredValue: 1000,
  originCity: "Mumbai",
  originAddress: "Andheri East, Mumbai, Maharashtra 400069",
  destinationCity: "Delhi",
  destinationAddress: "Connaught Place, New Delhi, Delhi 110001",
  mode: "road",
  priority: "standard",
  carrier: "ShipTrack Express",
};


export function CreateShipmentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const createShipment = useCreateShipment();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL);

  const selectedMode = MODES.find((m) => m.value === form.mode);
  const selectedPriority = PRIORITIES.find((p) => p.value === form.priority);
  const estimatedCost = Math.round(
    selectedMode.baseCost * selectedPriority.multiplier * (form.weightKg / 100),
  );
  const origin = CITIES.find((c) => c.name === form.originCity);
  const destination = CITIES.find((c) => c.name === form.destinationCity);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCityChange = (field, city) => {
    const c = CITIES.find((city2) => city2.name === city);
    setForm((prev) => ({
      ...prev,
      [field]: city,
      [field === "originCity" ? "originAddress" : "destinationAddress"]:
        c.address,
    }));
  };

  const handleSubmit = async () => {
    await createShipment.mutateAsync({
      origin: {
        name: origin.name,
        address: form.originAddress,
        lat: origin.lat,
        lng: origin.lng,
      },
      destination: {
        name: destination.name,
        address: form.destinationAddress,
        lat: destination.lat,
        lng: destination.lng,
      },
      mode: form.mode,
      priority: form.priority,
      carrier: form.carrier,
      service: selectedMode.label,
      customer: user.company ?? user.name,
      customerId: user.id,
      weightKg: form.weightKg,
      pieces: form.pieces,
      declaredValue: form.declaredValue,
      estimatedDelivery: new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    });
    toast.success("Shipment created successfully", {
      description: `Cost: ${formatCurrency(estimatedCost)} · ${selectedMode.label}`,
    });
    navigate("/app/shipments");
  };

  const canProceed = () => {
    if (step === 0) return form.weightKg > 0 && form.pieces > 0;
    if (step === 1)
      return (
        form.originCity &&
        form.destinationCity &&
        form.originCity !== form.destinationCity
      );
    return true;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Create Shipment"
        description="Book a new shipment in a few simple steps"
        icon={Package}
      />

      <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
        {STEPS.map((s, i) => {
          const StepIcon = s.icon;
          const isDone = step > s.id;
          const isCurrent = step === s.id;
          return (
            <div key={s.id} className="flex flex-1 items-center">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition",
                    isDone && "bg-success text-white",
                    isCurrent && "gradient-brand text-white",
                    !isDone && !isCurrent && "bg-muted text-muted-foreground",
                  )}
                >
                  {isDone ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <StepIcon className="h-5 w-5" />
                  )}
                </div>
                <div className="hidden sm:block">
                  <p
                    className={cn(
                      "text-xs font-semibold",
                      isCurrent ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    Step {s.id + 1}
                  </p>
                  <p
                    className={cn(
                      "text-xs",
                      isCurrent ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {s.label}
                  </p>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-3 h-0.5 flex-1 rounded-full",
                    isDone ? "bg-success" : "bg-border",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold">Shipment Details</h3>
                  <p className="text-sm text-muted-foreground">
                    Tell us what you're shipping
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="desc">Description</Label>
                  <Textarea
                    id="desc"
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    placeholder="e.g. Electronics components for distribution"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={form.weightKg}
                      onChange={(e) =>
                        update("weightKg", Number(e.target.value))
                      }
                      min={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pieces">Pieces</Label>
                    <Input
                      id="pieces"
                      type="number"
                      value={form.pieces}
                      onChange={(e) => update("pieces", Number(e.target.value))}
                      min={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="value">Declared Value (₹)</Label>
                    <Input
                      id="value"
                      type="number"
                      value={form.declaredValue}
                      onChange={(e) =>
                        update("declaredValue", Number(e.target.value))
                      }
                      min={0}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold">
                    Origin & Destination
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Where is it going?
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Origin City</Label>
                    <Select
                      value={form.originCity}
                      onValueChange={(v) => handleCityChange("originCity", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CITIES.map((c) => (
                          <SelectItem key={c.name} value={c.name}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Destination City</Label>
                    <Select
                      value={form.destinationCity}
                      onValueChange={(v) =>
                        handleCityChange("destinationCity", v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CITIES.map((c) => (
                          <SelectItem key={c.name} value={c.name}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="origin-addr">Origin Address</Label>
                    <Input
                      id="origin-addr"
                      value={form.originAddress}
                      onChange={(e) => update("originAddress", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dest-addr">Destination Address</Label>
                    <Input
                      id="dest-addr"
                      value={form.destinationAddress}
                      onChange={(e) =>
                        update("destinationAddress", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">
                      {form.originCity} → {form.destinationCity}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Route distance will be calculated automatically
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold">Service & Priority</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose how fast and how to ship
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Transport Mode</Label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {MODES.map((m) => {
                      const ModeIcon = m.icon;
                      const selected = form.mode === m.value;
                      return (
                        <button
                          key={m.value}
                          onClick={() => update("mode", m.value)}
                          className={cn(
                            "flex items-center gap-3 rounded-xl border p-4 text-left transition",
                            selected
                              ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                              : "border-border hover:bg-muted/30",
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-lg",
                              selected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground",
                            )}
                          >
                            <ModeIcon className="h-5 w-5" />
                          </span>
                          <div>
                            <p className="text-sm font-semibold">{m.label}</p>
                            <p className="text-xs text-muted-foreground">
                              {m.desc} · {formatCurrency(m.baseCost)}+
                            </p>
                          </div>
                          {selected && (
                            <Check className="ml-auto h-4 w-4 text-primary" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Priority Level</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {PRIORITIES.map((p) => {
                      const selected = form.priority === p.value;
                      return (
                        <button
                          key={p.value}
                          onClick={() => update("priority", p.value)}
                          className={cn(
                            "rounded-xl border p-4 text-center transition",
                            selected
                              ? cn(
                                  p.class,
                                  "ring-1 ring-primary/20 bg-primary/5",
                                )
                              : "border-border hover:bg-muted/30",
                          )}
                        >
                          <p className="text-sm font-semibold">{p.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {p.multiplier === 1
                              ? "Base price"
                              : `${p.multiplier}x price`}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* <div className="space-y-2">
                  <Label>Carrier</Label>
                  <Select
                    value={form.carrier}
                    onValueChange={(v) => update("carrier", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ShipTrack Express">
                        ShipTrack Express
                      </SelectItem>
                      <SelectItem value="SkyCargo">SkyCargo</SelectItem>
                      <SelectItem value="ColdChain Logistics">
                        ColdChain Logistics
                      </SelectItem>
                      <SelectItem value="Continental Rail">
                        Continental Rail
                      </SelectItem>
                      <SelectItem value="Pacific Maritime">
                        Pacific Maritime
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold">Review & Confirm</h3>
                  <p className="text-sm text-muted-foreground">
                    Verify your shipment details before booking
                  </p>
                </div>
                <div className="space-y-3">
                  <ReviewRow
                    label="Description"
                    value={form.description || "—"}
                  />
                  <ReviewRow label="Weight" value={`${form.weightKg} kg`} />
                  <ReviewRow label="Pieces" value={String(form.pieces)} />
                  <ReviewRow
                    label="Declared Value"
                    value={formatCurrency(form.declaredValue)}
                  />
                  <ReviewRow
                    label="Origin"
                    value={`${form.originCity} — ${form.originAddress}`}
                  />
                  <ReviewRow
                    label="Destination"
                    value={`${form.destinationCity} — ${form.destinationAddress}`}
                  />
                  <ReviewRow label="Mode" value={selectedMode.label} />
                  <ReviewRow label="Priority" value={selectedPriority.label} />
                  <ReviewRow label="Carrier" value={form.carrier} />
                </div>
                <div className="rounded-xl border border-success/30 bg-success/5 p-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-semibold text-success">
                      <Sparkles className="h-4 w-4" />
                      Estimated Cost
                    </span>
                    <span className="text-2xl font-bold text-success">
                      {formatCurrency(estimatedCost)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Final cost calculated after booking confirmation
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <Button
                variant="outline"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Back
              </Button>
              {step < 3 ? (
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canProceed()}
                >
                  Continue
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={createShipment.isPending}
                >
                  <Check className="mr-1.5 h-4 w-4" />
                  {createShipment.isPending ? "Creating..." : "Confirm & Book"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-primary" />
                Shipment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <SummaryRow
                label="Route"
                value={`${form.originCity.split(",")[0]} → ${form.destinationCity.split(",")[0]}`}
              />
              <SummaryRow label="Mode" value={selectedMode.label} />
              <SummaryRow label="Priority" value={selectedPriority.label} />
              <SummaryRow label="Weight" value={`${form.weightKg} kg`} />
              <SummaryRow label="Pieces" value={String(form.pieces)} />
              <SummaryRow label="Carrier" value={form.carrier} />
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Est. Cost
                  </span>
                  <span className="text-xl font-bold text-success">
                    {formatCurrency(estimatedCost)}
                  </span>
                </div>
              </div>
              <div className="rounded-lg bg-primary/5 p-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Boxes className="h-3.5 w-3.5" />
                  Step {step + 1} of {STEPS.length}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex items-start justify-between rounded-lg border border-border p-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="max-w-[60%] text-right text-sm font-medium">
        {value}
      </span>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}