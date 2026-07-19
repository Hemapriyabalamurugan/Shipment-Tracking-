package com.shipment.analyticsreport.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentAnalyticsDto {

    private Long totalShipments;
    private Long createdShipments;
    private Long pickedUpShipments;
    private Long inTransitShipments;
    private Long outForDeliveryShipments;
    private Long deliveredShipments;
    private Long failedDeliveries;
    private Long cancelledShipments;
    private Long pendingShipments;

    private Double deliverySuccessRate;

    private Double averageDeliveryTimeDays;
}