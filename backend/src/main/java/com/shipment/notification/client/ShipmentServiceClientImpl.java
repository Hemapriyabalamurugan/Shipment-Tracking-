package com.shipment.notification.client;

import com.shipment.notification.dto.ShipmentResponse;
import com.shipment.shipmentmanagement.service.ShipmentService;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

@Component
public class ShipmentServiceClientImpl implements ShipmentServiceClient {

    private final ShipmentService shipmentService;

    public ShipmentServiceClientImpl(@Lazy ShipmentService shipmentService) {
        this.shipmentService = shipmentService;
    }

    @Override
    public ShipmentResponse getShipment(Long id) {
        var s = shipmentService.getShipmentByIdInternal(id);
        if (s == null) return null;
        ShipmentResponse res = new ShipmentResponse();
        res.setId(s.getId());
        res.setTrackingNumber(s.getTrackingNumber());
        res.setStatus(s.getStatus() != null ? s.getStatus().name() : null);
        res.setSenderName(s.getSenderName());
        res.setReceiverName(s.getReceiverName());
        res.setOrigin(s.getSenderCity());
        res.setDestination(s.getReceiverCity());
        res.setEstimatedDelivery(s.getEstimatedDeliveryAt());
        res.setCustomerId(s.getCustomerId());
        res.setOperatorId(s.getDriverId());
        return res;
    }
}
