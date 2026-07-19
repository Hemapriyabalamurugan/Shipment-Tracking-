package com.shipment.analyticsreport.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDashboardResponse {

    private Long activeShipments;

    private Long shipmentHistory;

    private Long deliveredShipments;

    private Long inTransitShipments;

    private Long pendingShipments;

    private Long notificationCount;

    private Double averageDeliveryTimeDays;
    private Long cancelledShipments;

    private Double deliverySuccessRate;
}