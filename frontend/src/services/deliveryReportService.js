import api from "@/lib/api";

export const deliveryReportService = {
  async getWeeklyReport() {
    const response = await api.get("/delivery-reports/week");
    return response.data;
  },

  async getMonthlyReport() {
    const response = await api.get("/delivery-reports/month");
    return response.data;
  },

  async getYearlyReport() {
    const response = await api.get("/delivery-reports/year");
    return response.data;
  },

  async downloadWeeklyPdf() {
    const response = await api.get("/delivery-reports/week/pdf", {
      responseType: "blob",
    });
    return response.data;
  },

  async downloadMonthlyPdf() {
    const response = await api.get("/delivery-reports/month/pdf", {
      responseType: "blob",
    });
    return response.data;
  },

  async downloadYearlyPdf() {
    const response = await api.get("/delivery-reports/year/pdf", {
      responseType: "blob",
    });
    return response.data;
  },
};

export default deliveryReportService;
