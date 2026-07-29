

import { Link } from "react-router-dom";
import { cn, formatDateTime, relativeDay } from "@/lib/utils";
import { StatusBadge, PriorityBadge } from "./status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plane, Ship, Train, Truck, ArrowRight } from "lucide-react";

const modeIcon = {
  road: Truck,
  rail: Train,
  air: Plane,
 
};

export function ShipmentTable({
  shipments,
  emptyLabel = "No shipments found",
  showCustomer = true,
}) {
  if (shipments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card scrollbar-thin">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-[160px]">Tracking #</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Route</TableHead>
            {showCustomer && (
              <TableHead className="hidden lg:table-cell">Customer</TableHead>
            )}
            <TableHead className="hidden md:table-cell">ETA</TableHead>
            <TableHead className="hidden sm:table-cell">Priority</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {shipments.map((s) => {
            // const ModeIcon = modeIcon[s.mode];
            const ModeIcon =  Truck;
            return (
              <TableRow key={s.id} className="group">
                <TableCell>
                  <Link
                    to={`/app/shipments/${s.id}`}
                    className="flex items-center gap-2.5"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground transition group-hover:bg-primary/10 group-hover:text-primary">
                      <ModeIcon className="h-4 w-4" />
                    </span>
                    <span className="flex flex-col">
                      <span className="font-mono text-xs font-semibold text-foreground">
                        {s.trackingNumber}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {"ShipTrack"}
                      </span>
                    </span>
                  </Link>
                </TableCell>
                <TableCell>
                  <StatusBadge status={s.status} size="sm" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="max-w-[120px] truncate text-foreground">
                      {s.senderCity}
                    </span>
                    <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
                    <span className="max-w-[120px] truncate text-foreground">
                      {s.receiverCity}
                    </span>
                  </div>
                </TableCell>
                {showCustomer && (
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                    {s.senderName}
                  </TableCell>
                )}
                <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                  {relativeDay(s.estimatedDeliveryAt)}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <PriorityBadge priority={s.priority} />
                </TableCell>
                <TableCell>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export function ShipmentListItem({ shipment }) {
  const ModeIcon = Truck;
  return (
    <Link
      to={`/app/shipments/${shipment.id}`}
      className={cn(
        "flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 transition hover:border-primary/30 hover:shadow-sm",
      )}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <ModeIcon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-semibold">
            {shipment.trackingNumber}
          </span>
          <StatusBadge status={shipment.status} size="sm" />
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {shipment.senderCity} → {shipment.receiverCity}
        </p>
      </div>
      <div className="text-right">
        <p className="text-xs font-medium text-foreground">
          {relativeDay(shipment.estimatedDeliveryAt)}
        </p>
        <p className="text-[11px] text-muted-foreground">
          {formatDateTime(shipment.estimatedDeliveryAt)}
        </p>
      </div>
    </Link>
  );
}