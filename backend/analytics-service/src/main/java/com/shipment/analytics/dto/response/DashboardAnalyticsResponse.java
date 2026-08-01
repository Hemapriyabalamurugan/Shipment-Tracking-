package com.shipment.analytics.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
//
//@Data
//@Builder
//@NoArgsConstructor
//@AllArgsConstructor
//public class DashboardAnalyticsResponse {
//
//    private List<VolumeByMonthResponse> volumeByMonth;
//
//    private List<AverageDeliveryTimeResponse> averageDeliveryTime;
//
//    private List<DeliveryActivity24hResponse> deliveryActivity24h;
//
//    private List<OnTimePerformanceResponse> onTimePerformance;
//
//}
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardAnalyticsResponse {

    private OverviewResponse overview;

    private List<DeliveryActivity24hResponse> deliveryActivity24h;

    private DeliveryPerformanceResponse deliveryPerformance;

    private List<ShipmentStatusResponse> shipmentStatus;

    private List<TopRouteResponse> topRoutes;

//    private List<VolumeByMonthResponse> deliveryVolumeTrend;

    private List<DeliveryVolumeTrendResponse> deliveryVolumeTrend;

}