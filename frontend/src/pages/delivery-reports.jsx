import React, { useState, useEffect } from "react";
import deliveryReportService from "@/services/deliveryReportService";
import {
  FileText,
  Download,
  Package,
  CheckCircle2,
  Truck,
  AlertTriangle,
  Clock,
  TrendingUp,
  RefreshCw,
  MapPin,
  Calendar,
  XCircle,
  BarChart2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { toast } from "sonner";

export function DeliveryReportsPage() {
  const [activeTab, setActiveTab] = useState("week"); // 'week' | 'month' | 'year'
  const [loading, setLoading] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);

  const fetchReport = async (tab) => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (tab === "week") {
        data = await deliveryReportService.getWeeklyReport();
      } else if (tab === "month") {
        data = await deliveryReportService.getMonthlyReport();
      } else if (tab === "year") {
        data = await deliveryReportService.getYearlyReport();
      }
      setReportData(data);
    } catch (err) {
      console.error("Failed to fetch delivery report:", err);
      setError(err.response?.data?.message || err.message || "Failed to load report data from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(activeTab);
  }, [activeTab]);

  const handlePdfDownload = async () => {
    setDownloadingPdf(true);
    try {
      let blob;
      let filename = `delivery-report-${activeTab}.pdf`;
      if (activeTab === "week") {
        blob = await deliveryReportService.downloadWeeklyPdf();
      } else if (activeTab === "month") {
        blob = await deliveryReportService.downloadMonthlyPdf();
      } else if (activeTab === "year") {
        blob = await deliveryReportService.downloadYearlyPdf();
      }

      const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`${activeTab.toUpperCase()} Delivery Report PDF downloaded successfully`);
    } catch (err) {
      console.error("Failed to download PDF:", err);
      toast.error("Failed to download PDF report from server");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const statusColors = {
    DELIVERED: "bg-emerald-500",
    IN_TRANSIT: "bg-blue-500",
    OUT_FOR_DELIVERY: "bg-indigo-500",
    FAILED_DELIVERY: "bg-rose-500",
    CANCELLED: "bg-slate-400",
    PENDING: "bg-amber-500",
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-xl text-blue-600 dark:text-blue-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Delivery Reports
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Calculated dynamically from real database shipment records
              </p>
            </div>
          </div>
        </div>

        {/* Period Tabs & PDF Download */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setActiveTab("week")}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeTab === "week"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setActiveTab("month")}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeTab === "month"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setActiveTab("year")}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeTab === "year"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Yearly
            </button>
          </div>

          <button
            onClick={handlePdfDownload}
            disabled={loading || downloadingPdf || !reportData}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors shadow-sm"
          >
            {downloadingPdf ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download PDF
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl"
              />
            ))}
          </div>
          <div className="h-96 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl" />
        </div>
      )}

      {/* Error Display */}
      {error && !loading && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 p-6 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            <div>
              <h3 className="font-semibold text-rose-900 dark:text-rose-200">
                Failed to load delivery report
              </h3>
              <p className="text-sm text-rose-700 dark:text-rose-300">{error}</p>
            </div>
          </div>
          <button
            onClick={() => fetchReport(activeTab)}
            className="px-4 py-2 bg-rose-600 text-white font-medium rounded-lg text-sm hover:bg-rose-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && reportData && (
        <>
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Total Shipments
                </span>
                <div className="p-2.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl">
                  <Package className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {reportData.totalShipments}
                </span>
                <span className="text-xs text-slate-500 ml-2">
                  {reportData.period} period
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Delivered
                </span>
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {reportData.deliveredShipments}
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold ml-2">
                  {reportData.deliverySuccessRate}% success rate
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  In-Transit & Out for Delivery
                </span>
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <Truck className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {reportData.inTransitShipments + reportData.outForDeliveryShipments}
                </span>
                <span className="text-xs text-slate-500 ml-2">
                  ({reportData.outForDeliveryShipments} out for delivery)
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Avg Delivery Time
                </span>
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-xl">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {reportData.averageDeliveryTimeMinutes}
                </span>
                <span className="text-xs text-slate-500 ml-1">mins</span>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold ml-2">
                  {reportData.onTimeDeliveryRate}% on-time
                </span>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {reportData.totalShipments === 0 && (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
              <Package className="w-12 h-12 text-slate-400 mx-auto mb-3 stroke-1" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                No shipments found for this period
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                There are no shipment database records recorded for the chosen {activeTab} date range.
              </p>
            </div>
          )}

          {/* Report Analytics Sections */}
          {reportData.totalShipments > 0 && (
            <>
              {/* Volume Trend & Status Breakdown Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Volume Trend Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        Delivery Activity Trend
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Volume of total shipments created vs delivered over period
                      </p>
                    </div>
                  </div>

                  <div className="h-72 w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={reportData.dailyVolumeTrend || []}>
                        <defs>
                          <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorDel" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(15, 23, 42, 0.9)",
                            borderColor: "#334155",
                            borderRadius: "12px",
                            color: "#fff",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="volume"
                          name="Total Volume"
                          stroke="#3b82f6"
                          fillOpacity={1}
                          fill="url(#colorVol)"
                        />
                        <Area
                          type="monotone"
                          dataKey="delivered"
                          name="Delivered"
                          stroke="#10b981"
                          fillOpacity={1}
                          fill="url(#colorDel)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Status Breakdown */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      Status Breakdown
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Distribution of shipments across statuses
                    </p>
                  </div>

                  <div className="space-y-3.5 pt-2">
                    {reportData.statusDistribution?.map((item) => {
                      const percentage =
                        reportData.totalShipments > 0
                          ? Math.round((item.count / reportData.totalShipments) * 100)
                          : 0;

                      return (
                        <div key={item.status} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-700 dark:text-slate-300">
                              {item.status.replace(/_/g, " ")}
                            </span>
                            <span className="text-slate-500">
                              {item.count} ({percentage}%)
                            </span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                statusColors[item.status] || "bg-blue-500"
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Top Routes Table */}
              {reportData.topRoutes && reportData.topRoutes.length > 0 && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      Top Delivery Routes
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Highest volume origin to destination pairs
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 uppercase text-xs">
                        <tr>
                          <th className="px-4 py-3 rounded-l-xl">Origin</th>
                          <th className="px-4 py-3">Destination</th>
                          <th className="px-4 py-3 text-right rounded-r-xl">Shipments</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {reportData.topRoutes.map((route, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                            <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-slate-100">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-blue-500" />
                                {route.origin}
                              </div>
                            </td>
                            <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-slate-100">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-emerald-500" />
                                {route.destination}
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-right font-bold text-slate-900 dark:text-slate-100">
                              {route.shipments}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default DeliveryReportsPage;
