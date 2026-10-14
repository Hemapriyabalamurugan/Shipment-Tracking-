
package com.shipment.shipmentmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private Double deliverySuccessRate;

    private Double averageDeliveryTimeDays;
}