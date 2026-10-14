package com.shipment.pod.client;

import com.shipment.pod.dto.ShipmentAnalyticsDataResponse;
import com.shipment.shipmentmanagement.service.ShipmentService;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

@Component("podShipmentClient")
public class PodShipmentClientImpl implements ShipmentClient {

    private final ShipmentService shipmentService;

    public PodShipmentClientImpl(@Lazy ShipmentService shipmentService) {
        this.shipmentService = shipmentService;
    }

    @Override
    public ShipmentAnalyticsDataResponse getShipmentForVerification(Long shipmentId) {
        var s = shipmentService.getShipmentForVerification(shipmentId);
        if (s == null) return null;
        return ShipmentAnalyticsDataResponse.builder()
                .shipmentId(s.getShipmentId())
                .trackingNumber(s.getTrackingNumber())
                .businessClientId(s.getBusinessClientId())
                .status(s.getStatus())
                .createdAt(s.getCreatedAt())
                .pickedUpAt(s.getPickedUpAt())
                .estimatedDeliveryAt(s.getEstimatedDeliveryAt())
                .deliveredAt(s.getDeliveredAt())
                .customerId(s.getCustomerId())
                .driverId(s.getDriverId())
                .build();
    }
}
