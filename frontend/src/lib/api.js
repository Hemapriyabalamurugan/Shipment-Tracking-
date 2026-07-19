import axios from "axios";
import {
  shipments as mockShipments,
  vehicles as mockVehicles,
  drivers as mockDrivers,
  notifications as mockNotifications,
  tickets as mockTickets,
  teamMembers as mockTeamMembers,
  invoices as mockInvoices,
  analytics as mockAnalytics,
  activityFeed as mockActivityFeed,
  demoUsers,
  roles as mockRoles,
  microservices as mockMicroservices,
  auditLogs as mockAuditLogs,
  etaPredictions as mockEtaPredictions,
  deliveryRoutes as mockDeliveryRoutes,
  podRecords as mockPodRecords,
  systemMetrics as mockSystemMetrics,
  notificationMetrics as mockNotificationMetrics,
  reportTemplates as mockReportTemplates,
  trafficIncidents as mockTrafficIncidents,
  driverPerformance as mockDriverPerformance,
} from "./mock-data";

const STORAGE_KEY = "shiptrack.session";
const TOKEN_KEY = "shiptrack.token";

const latency = (min = 250, max = 650) =>
  new Promise((resolve) =>
    setTimeout(resolve, Math.random() * (max - min) + min),
  );

const clone = (data) =>
  typeof structuredClone !== "undefined"
    ? structuredClone(data)
    : JSON.parse(JSON.stringify(data));

const api = axios.create({
  baseURL: "/api",
  timeout: 8000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let db = {
  shipments: clone(mockShipments),
  vehicles: clone(mockVehicles),
  drivers: clone(mockDrivers),
  notifications: clone(mockNotifications),
  tickets: clone(mockTickets),
  teamMembers: clone(mockTeamMembers),
  invoices: clone(mockInvoices),
  analytics: clone(mockAnalytics),
  activityFeed: clone(mockActivityFeed),
  roles: clone(mockRoles),
  microservices: clone(mockMicroservices),
  auditLogs: clone(mockAuditLogs),
  etaPredictions: clone(mockEtaPredictions),
  deliveryRoutes: clone(mockDeliveryRoutes),
  podRecords: clone(mockPodRecords),
  systemMetrics: clone(mockSystemMetrics),
  notificationMetrics: clone(mockNotificationMetrics),
  reportTemplates: clone(mockReportTemplates),
  trafficIncidents: clone(mockTrafficIncidents),
  driverPerformance: clone(mockDriverPerformance),
};

// --- Auth ---
export const authApi = {
  async login(email, role) {
    await latency();
    const user = demoUsers[role];
    if (!user || email.trim().length === 0) {
      throw new Error("Invalid credentials");
    }
    const token = `mock.${btoa(user.id)}.${Date.now()}`;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
    return { user, token };
  },
  // async me() {
  //   await latency(80, 200);
  //   const raw = localStorage.getItem(STORAGE_KEY);
  //   if (!raw) return null;
  //   try {
  //     const { user } = JSON.parse(raw);
  //     return user;
  //   } catch {
  //     return null;
  //   }
  // },
  
  // async me() {
  // try {
  //   const raw = localStorage.getItem(STORAGE_KEY);
  //
  //   if (!raw) return null;
  //
  //   const session = JSON.parse(raw);
  //
  //   if (!session?.user?.role) {
  //     throw new Error();
  //   }
  //
  //   return session.user;
  // } catch {
  //   localStorage.removeItem("shiptrack.session");
  //   localStorage.removeItem("shiptrack.token");
  //   return null;
  // }
  //},
  async me() {
  try {
    const token = localStorage.getItem("shiptrack.token");

    // console.log("shiptrack.token =", token);

    if (!token) {
      return null;
    }

    const response = await api.get("/auth/me");

    // console.log("authApi.me response =", response.data);

    return {
      id: response.data.id,
      email: response.data.email,
      role: response.data.role.toLowerCase(),
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      phone: response.data.phone,
    };
  } catch (error) {
    console.error("authApi.me error =", error);

    localStorage.removeItem("shiptrack.token");
    localStorage.removeItem("shiptrack.session");
    localStorage.removeItem("refreshToken");

    return null;
  }
},
  
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STORAGE_KEY);
  },
  async updateProfile(updates) {
    await latency();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("Not authenticated");
    const { user, token } = JSON.parse(raw);
    const updated = { ...user, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: updated, token }));
    return updated;
  },
};

// --- Shipments ---
export const shipmentsApi = {
  async list() {
    await latency();
    return clone(db.shipments);
  },
  async getById(id) {
    await latency();
    return clone(
      db.shipments.find((s) => s.id === id || s.trackingNumber === id),
    );
  },
  async getByTracking(trackingNumber) {
    await latency();
    return clone(
      db.shipments.find(
        (s) => s.trackingNumber.toLowerCase() === trackingNumber.toLowerCase(),
      ),
    );
  },
  async getByCustomer(customerId) {
    await latency();
    return clone(db.shipments.filter((s) => s.customerId === customerId));
  },
  async create(payload) {
    await latency();
    const newShipment = {
      id: `shp-${Date.now()}`,
      trackingNumber: `STP-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random()
        .toString(36)
        .slice(2, 6)
        .toUpperCase()}`,
      status: "pending",
      mode: payload.mode ?? "road",
      priority: payload.priority ?? "standard",
      origin: payload.origin,
      destination: payload.destination,
      carrier: payload.carrier ?? "ShipTrack Express",
      service: payload.service ?? "Ground Economy",
      customer: payload.customer ?? "Unknown",
      customerId: payload.customerId ?? "u-business",
      weightKg: payload.weightKg ?? 0,
      pieces: payload.pieces ?? 1,
      declaredValue: payload.declaredValue ?? 0,
      estimatedDelivery: payload.estimatedDelivery ?? new Date().toISOString(),
      pickupAt: new Date().toISOString(),
      currentLocation: {
        lat: payload.origin.lat,
        lng: payload.origin.lng,
        name: payload.origin.name,
      },
      progress: 0,
      events: [
        {
          id: `ev-${Date.now()}`,
          status: "pending",
          label: "Shipment created",
          description: "Shipment booked in system",
          location: payload.origin.name,
          lat: payload.origin.lat,
          lng: payload.origin.lng,
          timestamp: new Date().toISOString(),
          completed: true,
        },
      ],
      createdAt: new Date().toISOString(),
    };
    db.shipments.unshift(newShipment);
    return clone(newShipment);
  },
};

// --- Vehicles ---
export const vehiclesApi = {
  async list() {
    await latency();
    return clone(db.vehicles);
  },
};

// --- Drivers ---
export const driversApi = {
  async list() {
    await latency();
    return clone(db.drivers);
  },
};

// --- Notifications ---
export const notificationsApi = {
  async list() {
    await latency();
    return clone(db.notifications);
  },
  async markRead(id) {
    await latency(100, 250);
    db.notifications = db.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n,
    );
    return clone(db.notifications);
  },
  async markAllRead() {
    await latency(100, 250);
    db.notifications = db.notifications.map((n) => ({ ...n, read: true }));
    return clone(db.notifications);
  },
};

// --- Tickets ---
export const ticketsApi = {
  async list() {
    await latency();
    return clone(db.tickets);
  },
  async getById(id) {
    await latency();
    return clone(db.tickets.find((t) => t.id === id || t.reference === id));
  },
  async reply(id, body, author) {
    await latency();
    const ticket = db.tickets.find((t) => t.id === id);
    if (!ticket) throw new Error("Ticket not found");
    ticket.messages.push({
      id: `m-${Date.now()}`,
      author,
      body,
      timestamp: new Date().toISOString(),
    });
    ticket.updatedAt = new Date().toISOString();
    if (ticket.status === "open") ticket.status = "in_progress";
    return clone(ticket);
  },
  async updateStatus(id, status) {
    await latency();
    const ticket = db.tickets.find((t) => t.id === id);
    if (!ticket) throw new Error("Ticket not found");
    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();
    return clone(ticket);
  },
};

// --- Team ---
export const teamApi = {
  async list() {
    await latency();
    return clone(db.teamMembers);
  },
  async invite(payload) {
    await latency();
    const member = {
      id: `tm-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      status: "invited",
      lastActive: "—",
      joinedAt: new Date().toISOString(),
      company: "ShipTrack Pro",
      jobTitle: ROLE_TITLE[payload.role],
    };
    db.teamMembers.push(member);
    return clone(member);
  },
  async updateStatus(id, status) {
    await latency();
    const m = db.teamMembers.find((t) => t.id === id);
    if (!m) throw new Error("Member not found");
    m.status = status;
    return clone(m);
  },
};

const ROLE_TITLE = {
  admin: "Administrator",
  operator: "Logistics Operator",
  business: "Business Client",
  customer: "Customer",
  support: "Support Agent",
};

// --- Invoices ---
export const invoicesApi = {
  async list() {
    await latency();
    return clone(db.invoices);
  },
};

// --- Analytics ---
export const analyticsApi = {
  async get() {
    await latency();
    return clone(db.analytics);
  },
  async activity() {
    await latency(150, 350);
    return clone(db.activityFeed);
  },
};

export default api;

// --- Admin: Roles ---
export const rolesApi = {
  async list() {
    await latency();
    return clone(db.roles);
  },
};

// --- Admin: Microservices ---
export const microservicesApi = {
  async list() {
    await latency();
    return clone(db.microservices);
  },
};

// --- Admin: Audit Logs ---
export const auditLogsApi = {
  async list() {
    await latency();
    return clone(db.auditLogs);
  },
};

// --- Admin: ETA Predictions ---
export const etaPredictionsApi = {
  async list() {
    await latency();
    return clone(db.etaPredictions);
  },
};

// --- Admin: Routes ---
export const routesApi = {
  async list() {
    await latency();
    return clone(db.deliveryRoutes);
  },
};

// --- Admin: POD ---
export const podApi = {
  async list() {
    await latency();
    return clone(db.podRecords);
  },
  async verify(id) {
    await latency();
    const rec = db.podRecords.find((p) => p.id === id);
    if (!rec) throw new Error("POD record not found");
    rec.status = "verified";
    return clone(rec);
  },
};

// --- Admin: System Metrics ---
export const systemMetricsApi = {
  async list() {
    await latency(150, 350);
    return clone(db.systemMetrics);
  },
};

// --- Admin: Notification Metrics ---
export const notificationMetricsApi = {
  async list() {
    await latency();
    return clone(db.notificationMetrics);
  },
};

// --- Admin: Reports ---
export const reportsApi = {
  async list() {
    await latency();
    return clone(db.reportTemplates);
  },
};

// --- Operator: Traffic Incidents ---
export const trafficApi = {
  async list() {
    await latency(150, 350);
    return clone(db.trafficIncidents);
  },
};

// --- Operator: Driver Performance ---
export const driverPerformanceApi = {
  async list() {
    await latency();
    return clone(db.driverPerformance);
  },
};
