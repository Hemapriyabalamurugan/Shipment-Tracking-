package com.shipment.deliveryreports.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentAnalyticsDataResponse {

    private Long shipmentId;
    private String trackingNumber;
    private Long businessClientId;
    private Long customerId;
    private Long driverId;

    private String status;

    private LocalDateTime createdAt;
    private LocalDateTime pickedUpAt;
    private LocalDateTime estimatedDeliveryAt;
    private LocalDateTime deliveredAt;

    private String originCity;
    private String destinationCity;
}
