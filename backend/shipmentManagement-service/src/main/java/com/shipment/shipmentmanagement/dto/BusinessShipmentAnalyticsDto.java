package com.shipment.shipmentmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BusinessShipmentAnalyticsDto {

    private Long totalShipments;

    private Long deliveredShipments;

    private Long inTransitShipments;

    private Long pendingShipments;

    private Long failedDeliveries;

    private Double deliverySuccessRate;
}