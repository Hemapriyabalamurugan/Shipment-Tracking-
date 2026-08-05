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

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem(TOKEN_KEY);
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(TOKEN_KEY);

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
    // const token = `mock.${btoa(user.id)}.${Date.now()}`;
    // localStorage.setItem(TOKEN_KEY, token);
    // localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
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
      // const token = localStorage.getItem("shiptrack.token");
const token = sessionStorage.getItem(TOKEN_KEY);
      // console.log("shiptrack.token =", token);

      if (!token) {
        return null;
      }

      const response = await api.get("/auth/me");
     
      return {
        id: response.data.id,
        name: `${response.data.firstName} ${response.data.lastName}`.trim(),
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        role: response.data.role.toLowerCase(),
        phone: response.data.phone,
      };
    } catch (error) {
      console.error("authApi.me error =", error);

      // localStorage.removeItem("shiptrack.token");
      // localStorage.removeItem("shiptrack.session");
      // localStorage.removeItem("refreshToken");
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem("refreshToken");

      return null;
    }
  },
  // ==========================================
  async register(payload) {
    const response = await api.post("/auth/register", payload);
    return response.data;
  },
  // ===============================================

  logout() {
    // localStorage.removeItem(TOKEN_KEY);
    // localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem("refreshToken");
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
    const response = await api.get("/shipments");
    return response.data;
  },
  async getById(id) {
    const response = await api.get(`/shipments/${id}`);
    return response.data;
  },
  async getByTracking(trackingNumber) {
    await latency();
    return clone(
      db.shipments.find(
        (s) => s.trackingNumber.toLowerCase() === trackingNumber.toLowerCase(),
      ),
    );
  },
  async getByCustomer() {
    const response = await api.get("/shipments/customer/me");
    return response.data;
  },
  async getTracking(id) {
    const response = await api.get(`/shipments/${id}/tracking`);
    return response.data;
  },
  async getNavigation(id) {
    const response = await api.get(`/shipments/${id}/navigation`);
    return response.data;
  },
  async getHubs() {
    const response = await api.get("/shipments/hubs");
    return response.data;
  },

  async create(payload) {
    const response = await api.post("/shipments", payload);
    return response.data;
  },

  // accept: async (id, operatorId) => {
  //   const response = await api.post(`/shipments/${id}/accept`, {
  //     operatorId,
  //   });

  //   return response.data;
  // },
  accept: async (id) => {
    const response = await api.post(`/shipments/${id}/accept`);

    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/shipments/${id}/status`, null, {
      params: {
        status,
      },
    });

    return response.data;
  },

  async updateJourney(payload) {
    const response = await api.post("/journey/update", payload);
    return response.data;
  },

  async reachNextHub(id) {
    const response = await api.put(`/shipments/${id}/reach-next-hub`);
    return response.data;
  },
  async createPod(formData) {
    const response = await api.post("/pod", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
  // ==========================================================
  getRouteHubs: async () => {
    const { data } = await api.get("/hubs");
    return data;
  },
  findRoute: async (originHubId, destinationHubId) => {
    const { data } = await api.get(
      `/routes/find?originHubId=${originHubId}&destinationHubId=${destinationHubId}`,
    );
    return data;
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
// export const notificationsApi = {
//   async list() {
//     await latency();
//     return clone(db.notifications);
//   },
//   async markRead(id) {
//     await latency(100, 250);
//     db.notifications = db.notifications.map((n) =>
//       n.id === id ? { ...n, read: true } : n,
//     );
//     return clone(db.notifications);
//   },
//   async markAllRead() {
//     await latency(100, 250);
//     db.notifications = db.notifications.map((n) => ({ ...n, read: true }));
//     return clone(db.notifications);
//   },
// };
export const notificationsApi = {
  async list() {
    const user = await authApi.me();

    const response = await api.get(`/notifications/user/${user.id}`);

    return response.data.map((notification) => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,

      read: notification.isRead,

      timestamp: notification.createdAt,

      type: "shipment",

      severity: notification.priority === "HIGH" ? "warning" : "info",

      shipmentId: notification.shipmentId,
    }));
  },

  async markRead(id) {
    const response = await api.put(`/notifications/${id}/read`);

    return response.data;
  },

 
  
  async markAllRead() {
    const user = await authApi.me();

    const unread = await api.get(`/notifications/user/${user.id}/unread`);

    await Promise.all(
      unread.data.map((n) => api.put(`/notifications/${n.id}/read`)),
    );

    return true;
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
// export const teamApi = {
//   async list() {
//     await latency();
//     return clone(db.teamMembers);
//   },
//   async invite(payload) {
//     await latency();
//     const member = {
//       id: `tm-${Date.now()}`,
//       name: payload.name,
//       email: payload.email,
//       role: payload.role,
//       status: "invited",
//       lastActive: "—",
//       joinedAt: new Date().toISOString(),
//       company: "ShipTrack Pro",
//       jobTitle: ROLE_TITLE[payload.role],
//     };
//     db.teamMembers.push(member);
//     return clone(member);
//   },
//   async updateStatus(id, status) {
//     await latency();
//     const m = db.teamMembers.find((t) => t.id === id);
//     if (!m) throw new Error("Member not found");
//     m.status = status;
//     return clone(m);
//   },
// };
export const teamApi = {
  async list() {
    const response = await api.get("/admin/users");

    return response.data
      .filter((user) => user.role?.toUpperCase() !== "ADMIN")
      .map((user) => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        role: user.role.toLowerCase(),
        status: user.active ? "active" : "suspended",
        lastActive: user.lastLogin ?? "—",
      }));
  },

  async updateStatus(id, status) {
    if (status === "active") {
      await api.put(`/admin/users/${id}/activate`);
    } else if (status === "suspended") {
      await api.put(`/admin/users/${id}/deactivate`);
    } else {
      throw new Error(`Unsupported status: ${status}`);
    }

    return { id, status };
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


// this is for specific business client
// export const analyticsApi = {
//   async get() {
//     const response = await api.get("/analytics/admin/dashboard");
//     return response.data;
//   },

//   async getBusinessDashboard(businessClientId) {
//     const response = await api.get(
//       `/analytics/business/${businessClientId}/dashboard`,
//     );
//     return response.data;
//   },

//   async activity() {
//     await latency(150, 350);
//     return clone(db.activityFeed);
//   },

//   async exportPdf() {
//     const response = await api.get("/analytics/admin/dashboard/pdf", {
//       responseType: "blob",
//     });

//     return response.data;
//   },

//   async exportBusinessPdf(businessClientId) {
//     const response = await api.get(
//       `/analytics/business/${businessClientId}/dashboard/pdf`,
//       {
//         responseType: "blob",
//       },
//     );

//     return response.data;
//   },
// };

export const analyticsApi = {
  async get(startDate, endDate) {
    const response = await api.get("/analytics/admin/dashboard", {
      params: {
        startDate,
        endDate,
      },
    });

    return response.data;
  },

  async getBusinessDashboard(businessClientId, startDate, endDate) {
    const response = await api.get(
      `/analytics/business/${businessClientId}/dashboard`,
      {
        params: {
          startDate,
          endDate,
        },
      },
    );

    return response.data;
  },

  async activity() {
    await latency(150, 350);
    return clone(db.activityFeed);
  },

  async exportPdf(startDate, endDate) {
    const response = await api.get("/analytics/admin/dashboard/pdf", {
      params: {
        startDate,
        endDate,
      },
      responseType: "blob",
    });

    return response.data;
  },

  async exportBusinessPdf(businessClientId, startDate, endDate) {
    const response = await api.get(
      `/analytics/business/${businessClientId}/dashboard/pdf`,
      {
        params: {
          startDate,
          endDate,
        },
        responseType: "blob",
      },
    );

    return response.data;
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
// export const etaPredictionsApi = {
//   async list() {
//     await latency();
//     return clone(db.etaPredictions);
//   },
// };
export const etaPredictionsApi = {
  async list() {
    try {
      const res = await api.get("/analytics/eta");
      if (Array.isArray(res.data)) return res.data;
      return [];
    } catch {
      return [];
    }
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
// export const podApi = {
//   // async list() {
//   //   await latency();
//   //   return clone(db.podRecords);
//   // },
//   async list() {
//   const response = await api.get("/pod");
//   return response.data;
// },
//   async verify(id, businessClientId) {
//     const response = await api.put(`/pod/${id}/verify/${businessClientId}`);

//     return response.data;
//   },
// };

export const podApi = {
  async list() {
    const response = await api.get("/pod");
    return response.data;
  },

  async create(formData) {
    const response = await api.post("/pod", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  async verify(id) {
    const response = await api.put(`/pod/${id}/verify`);
    return response.data;
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
