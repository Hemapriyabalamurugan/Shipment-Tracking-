package com.shipment.pod.client;

import com.shipment.pod.dto.ShipmentAnalyticsDataResponse;

public interface ShipmentClient {

    ShipmentAnalyticsDataResponse getShipmentForVerification(Long shipmentId);
}