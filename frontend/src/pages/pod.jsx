
import { usePodRecords, useVerifyPod } from "@/lib/hooks";
import { useAuth } from "@/context/auth-context";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { LoadingState, EmptyState } from "@/components/shared/states";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, formatDateTime, timeAgo } from "@/lib/utils";
import {
  ClipboardCheck,
  CheckCircle2,
  Clock,
  XCircle,
  FileSearch,
  PenLine,
  Check,
  MapPin,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const statusMeta = {
  verified: {
    label: "Verified",
    class: "bg-success/10 text-success",
    icon: CheckCircle2,
  },
  pending: {
    label: "Pending",
    class: "bg-warning/15 text-warning",
    icon: Clock,
  },
  rejected: {
    label: "Rejected",
    class: "bg-destructive/10 text-destructive",
    icon: XCircle,
  },
  missing: {
    label: "Missing",
    class: "bg-muted text-muted-foreground",
    icon: FileSearch,
  },
};

export function PodPage() {
  const { data: records, isLoading } = usePodRecords();
  const verify = useVerifyPod();
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");

  const canVerify = user?.role === "business_client";
  const canUpload = user?.role === "logistics_operator";

const filtered =
  records?.filter(
    (r) => filter === "all" || r.verificationStatus.toLowerCase() === filter,
  ) ?? [];

const verified =
  records?.filter((r) => r.verificationStatus === "VERIFIED") ?? [];

const pending =
  records?.filter((r) => r.verificationStatus === "PENDING") ?? [];

const missing = [];

  // const handleVerify = async (id) => {
  //   await verify.mutateAsync(id);
  //   toast.success("POD verified successfully");
  // };

  const handleVerify = async (id) => {
    await verify.mutateAsync({
      id,
      businessClientId: user.id,
    });

    toast.success("POD verified successfully");
  };

  const handleReject = async (id) => {
    await verify.mutateAsync(id);
    toast.success("POD rejected");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Proof of Delivery"
        description="Verify and manage delivery confirmations"
        icon={ClipboardCheck}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total POD Records"
          value={records?.length ?? 0}
          icon={ClipboardCheck}
          iconClass="bg-primary/10 text-primary"
        />
        <StatCard
          label="Verified"
          value={verified.length}
          icon={CheckCircle2}
          iconClass="bg-success/10 text-success"
        />
        <StatCard
          label="Pending"
          value={pending.length}
          icon={Clock}
          iconClass="bg-warning/10 text-warning"
        />
        {/* <StatCard
          label="Missing"
          value={missing.length}
          icon={FileSearch}
          iconClass="bg-destructive/10 text-destructive"
        /> */}
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v)}>
        <TabsList>
          <TabsTrigger value="all">All ({records?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="verified">
            Verified ({verified.length})
          </TabsTrigger>
          {/* <TabsTrigger value="missing">Missing ({missing.length})</TabsTrigger> */}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <LoadingState />
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((rec) => {
            // const StatusIcon = statusMeta[rec.status].icon;
            const status = rec.verificationStatus.toLowerCase();
            const StatusIcon = statusMeta[status].icon;
            return (
              <Card key={rec.id} className="transition hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg",
                          statusMeta[status].class,
                        )}
                      >
                        <StatusIcon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-mono text-sm font-semibold">
                          {/* {rec.trackingNumber} */}
                          {rec.trackingNumber}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {/* {rec.recipient} */}
                          {rec.recipientName}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium",
                        statusMeta[status].class,
                      )}
                    >
                      {statusMeta[status].label}
                    </span>
                  </div>

                  {/* <div className="mt-4 flex h-24 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
                    {rec.verificationStatus === "VERIFIED" ? (
                      <div className="flex flex-col items-center gap-1 text-success">
                        <PenLine className="h-6 w-6" />
                        <span className="text-xs font-medium">
                          Signed by {rec.signedBy}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-muted-foreground">
                        <PenLine className="h-6 w-6 opacity-40" />
                        <span className="text-xs">No signature captured</span>
                      </div>
                    )}
                  </div> */}
                  <div className="mt-4 space-y-3">
                    <img
                      src={rec.photoUrl}
                      alt="Proof of Delivery"
                      className="h-40 w-full rounded-lg border object-cover"
                    />

                    <img
                      src={rec.signatureUrl}
                      alt="Recipient Signature"
                      className="h-20 w-full rounded-lg border bg-white object-contain"
                    />
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" /> Location
                      </span>
                      <span className="font-medium">{rec.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Delivery time
                      </span>
                      <span className="font-medium">
                        {formatDateTime(rec.capturedAt)}
                      </span>
                    </div>
                  </div>

                  {rec.deliveryNotes && (
                    <p className="mt-3 rounded-lg bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                      {rec.deliveryNotes}
                    </p>
                  )}

                  {rec.verificationStatus === "PENDING" && canVerify && (
                    <div className="mt-4 flex gap-2">
                      <Button
                        onClick={() => handleVerify(rec.id)}
                        disabled={verify.isPending}
                        className="flex-1"
                        size="sm"
                      >
                        <Check className="mr-1.5 h-4 w-4" />
                        Verify
                      </Button>
                      {/* <Button
                        onClick={() => handleReject(rec.id)}
                        disabled={verify.isPending}
                        variant="outline"
                        className="flex-1"
                        size="sm"
                      >
                        <X className="mr-1.5 h-4 w-4" />
                        Reject
                      </Button> */}
                    </div>
                  )}

                  {rec.verificationStatus === "PENDING" && canVerify && (
                    <div className="mt-4 flex items-center justify-center gap-1.5 rounded-lg bg-warning/5 py-2 text-xs font-medium text-warning">
                      <Clock className="h-3.5 w-3.5" />
                      Awaiting verification
                    </div>
                  )}

                  {/* {rec.status === "rejected" && (
                    <div className="mt-4 flex items-center justify-center gap-1.5 rounded-lg bg-destructive/5 py-2 text-xs font-medium text-destructive">
                      <X className="h-3.5 w-3.5" />
                      Rejected
                    </div>
                  )} */}

                  {rec.verificationStatus === "VERIFIED" && (
                    <div className="mt-4 flex items-center justify-center gap-1.5 rounded-lg bg-success/5 py-2 text-xs font-medium text-success">
                      <Check className="h-3.5 w-3.5" />
                      Verified {timeAgo(rec.verifiedAt)}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={ClipboardCheck}
          title="No POD records"
          description="Proof of delivery records will appear here."
        />
      )}
    </div>
  );
}