package com.shipment.shipmentmanagement.client;

import com.shipment.shipmentmanagement.dto.NotificationRequest;

public interface NotificationClient {

    void createNotification(NotificationRequest notificationRequest);

    void markShipmentAccepted(Long shipmentId, Long operatorId);
}