package com.shipment.notification.client;

import com.shipment.notification.dto.ShipmentResponse;

public interface ShipmentServiceClient {

    ShipmentResponse getShipment(Long id);
}