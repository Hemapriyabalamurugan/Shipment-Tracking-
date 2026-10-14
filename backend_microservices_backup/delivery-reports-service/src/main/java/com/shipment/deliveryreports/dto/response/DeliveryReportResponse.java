package com.shipment.deliveryreports.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryReportResponse {

    private String period; // WEEKLY, MONTHLY, YEARLY
    private LocalDate startDate;
    private LocalDate endDate;
    private String userRole;

    private long totalShipments;
    private long deliveredShipments;
    private long inTransitShipments;
    private long outForDeliveryShipments;
    private long failedDeliveries;
    private long cancelledShipments;
    private long pendingShipments;

    private double deliverySuccessRate;
    private double onTimeDeliveryRate;
    private long averageDeliveryTimeMinutes;

    private List<ShipmentStatusResponse> statusDistribution;
    private List<TopRouteResponse> topRoutes;
    private List<DeliveryVolumeTrendResponse> dailyVolumeTrend;
}
