import axios from "axios";


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
  const token = sessionStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});



// --- Auth ---
export const authApi = {
  async login(email, role) {
    await latency();
    const user = demoUsers[role];
    if (!user || email.trim().length === 0) {
      throw new Error("Invalid credentials");
    }
  
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
    return { user, token };
  },
  

  async me() {
    
    try {
      
const token = sessionStorage.getItem(TOKEN_KEY);
      

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

      
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem("refreshToken");

      return null;
    }
  },
 
  async register(payload) {
    const response = await api.post("/auth/register", payload);
    return response.data;
  },
 

  logout() {
    
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

  
  async cancelByCustomer(id, reason) {
    const response = await api.post(`/shipments/${id}/customer-cancel`, {
      reason,
    });

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



// --- Analytics ---




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






