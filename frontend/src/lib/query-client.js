import { QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
export const queryKeys = {
  shipments: ["shipments"],
  shipment: (id) => ["shipments", id],
  myShipments: (customerId) => ["shipments", "mine", customerId],
  vehicles: ["vehicles"],
  drivers: ["drivers"],
  notifications: ["notifications"],
  tickets: ["tickets"],
  ticket: (id) => ["tickets", id],
  team: ["team"],
  invoices: ["invoices"],
  analytics: ["analytics"],
  activity: ["activity"],
  roles: ["roles"],
  microservices: ["microservices"],
  auditLogs: ["auditLogs"],
  etaPredictions: ["etaPredictions"],
  routes: ["routes"],
  podRecords: ["podRecords"],
  systemMetrics: ["systemMetrics"],
  notificationMetrics: ["notificationMetrics"],
  reports: ["reports"],
  trafficIncidents: ["trafficIncidents"],
  driverPerformance: ["driverPerformance"],
};
