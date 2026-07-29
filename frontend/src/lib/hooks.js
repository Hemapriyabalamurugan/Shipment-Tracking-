import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  shipmentsApi,
  vehiclesApi,
  driversApi,
  notificationsApi,
  ticketsApi,
  teamApi,
  invoicesApi,
  analyticsApi,
} from "./api";
import { queryKeys } from "./query-client";
import { useAuth } from "@/context/auth-context";
export function useShipments() {
  return useQuery({
    queryKey: queryKeys.shipments,
    queryFn: shipmentsApi.list,
  });
}
export function useShipment(id) {
  return useQuery({
    queryKey: id ? queryKeys.shipment(id) : ["shipments", "none"],
    queryFn: () => shipmentsApi.getById(id),
    enabled: !!id,
  });
}
// ===============================================================
export function useNavigation(shipmentId) {
  return useQuery({
    queryKey: ["shipments", shipmentId, "navigation"],
    queryFn: () => shipmentsApi.getNavigation(shipmentId),
    enabled: !!shipmentId,
  });
}
// ===================================================================
export function useMyShipments(customerId) {
  return useQuery({
    queryKey: customerId
      ? queryKeys.myShipments(customerId)
      : ["shipments", "mine", "none"],
    queryFn: () => shipmentsApi.getByCustomer(customerId),
    enabled: !!customerId,
  });
}
export function useTrackByNumber(trackingNumber) {
  return useQuery({
    queryKey: ["shipments", "track", trackingNumber],
    queryFn: () => shipmentsApi.getByTracking(trackingNumber),
    enabled: trackingNumber.trim().length > 0,
  });
}
export function useCreateShipment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: shipmentsApi.create,
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: queryKeys.shipments,
      }),
  });
}
export function useVehicles() {
  return useQuery({
    queryKey: queryKeys.vehicles,
    queryFn: vehiclesApi.list,
  });
}
export function useDrivers() {
  return useQuery({
    queryKey: queryKeys.drivers,
    queryFn: driversApi.list,
  });
}
export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications,
    queryFn: notificationsApi.list,
  });
}
export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.markRead,
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: queryKeys.notifications,
      }),
  });
}
export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.markAllRead,
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: queryKeys.notifications,
      }),
  });
}
export function useTickets() {
  return useQuery({
    queryKey: queryKeys.tickets,
    queryFn: ticketsApi.list,
  });
}
export function useTicket(id) {
  return useQuery({
    queryKey: id ? queryKeys.ticket(id) : ["tickets", "none"],
    queryFn: () => ticketsApi.getById(id),
    enabled: !!id,
  });
}
export function useReplyTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body, author }) => ticketsApi.reply(id, body, author),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: queryKeys.tickets,
      });
    },
  });
}
export function useUpdateTicketStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => ticketsApi.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: queryKeys.tickets,
      });
    },
  });
}
export function useTeam() {
  return useQuery({
    queryKey: queryKeys.team,
    queryFn: teamApi.list,
  });
}
export function useInviteMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: teamApi.invite,
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: queryKeys.team,
      }),
  });
}
export function useUpdateMemberStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => teamApi.updateStatus(id, status),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: queryKeys.team,
      }),
  });
}
export function useInvoices() {
  return useQuery({
    queryKey: queryKeys.invoices,
    queryFn: invoicesApi.list,
  });
}
export function useAnalytics() {
  return useQuery({
    queryKey: queryKeys.analytics,
    queryFn: analyticsApi.get,
  });
}
// export function useAnalytics() {
//   const { user } = useAuth();

//   return useQuery({
//     queryKey: ["analytics", user.role, user.id],
//     queryFn: () => {
//       if (user.role === "ADMIN") {
//         return analyticsApi.get();
//       }

//       return analyticsApi.getBusinessDashboard(user.id);
//     },
//     enabled: !!user,
//   });
// }
export function useActivity() {
  return useQuery({
    queryKey: queryKeys.activity,
    queryFn: analyticsApi.activity,
  });
}

export function useBusinessAnalytics(businessClientId) {
  return useQuery({
    queryKey: ["business-analytics", businessClientId],
    queryFn: () => analyticsApi.getBusinessDashboard(businessClientId),
    enabled: !!businessClientId,
  });
}

// --- Admin hooks ---
import {
  rolesApi,
  microservicesApi,
  auditLogsApi,
  etaPredictionsApi,
  routesApi,
  podApi,
  systemMetricsApi,
  notificationMetricsApi,
  reportsApi,
} from "./api";
export function useRoles() {
  return useQuery({
    queryKey: queryKeys.roles,
    queryFn: rolesApi.list,
  });
}
export function useMicroservices() {
  return useQuery({
    queryKey: queryKeys.microservices,
    queryFn: microservicesApi.list,
  });
}
export function useAuditLogs() {
  return useQuery({
    queryKey: queryKeys.auditLogs,
    queryFn: auditLogsApi.list,
  });
}
export function useEtaPredictions() {
  return useQuery({
    queryKey: queryKeys.etaPredictions,
    queryFn: etaPredictionsApi.list,
  });
}
export function useRoutes() {
  return useQuery({
    queryKey: queryKeys.routes,
    queryFn: routesApi.list,
  });
}
export function usePodRecords() {
  return useQuery({
    queryKey: queryKeys.podRecords,
    queryFn: podApi.list,
    refetchInterval: 5000,
  });
}
export function useVerifyPod() {
  const qc = useQueryClient();
  return useMutation({
    // mutationFn: podApi.verify,
    mutationFn: ({ id, businessClientId }) =>
      podApi.verify(id, businessClientId),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: queryKeys.podRecords,
      }),
  });
}
export function useSystemMetrics() {
  return useQuery({
    queryKey: queryKeys.systemMetrics,
    queryFn: systemMetricsApi.list,
    refetchInterval: 5000,
  });
}
export function useNotificationMetrics() {
  return useQuery({
    queryKey: queryKeys.notificationMetrics,
    queryFn: notificationMetricsApi.list,
  });
}
export function useReports() {
  return useQuery({
    queryKey: queryKeys.reports,
    queryFn: reportsApi.list,
  });
}

// --- Operator hooks ---
import { trafficApi, driverPerformanceApi } from "./api";
export function useTrafficIncidents() {
  return useQuery({
    queryKey: queryKeys.trafficIncidents,
    queryFn: trafficApi.list,
    refetchInterval: 10000,
  });
}
export function useDriverPerformance() {
  return useQuery({
    queryKey: queryKeys.driverPerformance,
    queryFn: driverPerformanceApi.list,
  });
}
// export function useAcceptShipment() {
//   const qc = useQueryClient();

//   return useMutation({
//     mutationFn: ({ id, operatorId }) => shipmentsApi.accept(id, operatorId),

//     onSuccess: () => {
//       qc.invalidateQueries({
//         queryKey: queryKeys.shipments,
//       });

//       qc.invalidateQueries({
//         queryKey: queryKeys.notifications,
//       });
//     },
//   });
// }
export function useAcceptShipment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, operatorId }) => shipmentsApi.accept(id, operatorId),

    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: queryKeys.shipments,
      });

      await qc.refetchQueries({
        queryKey: queryKeys.shipments,
      });

      await qc.invalidateQueries({
        queryKey: queryKeys.notifications,
      });
    },
  });
}
export function useUpdateShipmentStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => shipmentsApi.updateStatus(id, status),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: queryKeys.shipments,
      });

      qc.invalidateQueries({
        queryKey: queryKeys.notifications,
      });
    },
  });
}
export function useReachNextHub() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (shipmentId) => shipmentsApi.reachNextHub(shipmentId),

    onSuccess: (_, shipmentId) => {
      qc.invalidateQueries({
        queryKey: ["shipments", shipmentId, "navigation"],
      });

      qc.invalidateQueries({
        queryKey: ["shipments", shipmentId, "tracking"],
      });

      qc.invalidateQueries({
        queryKey: queryKeys.shipments,
      });
    },
  });
}