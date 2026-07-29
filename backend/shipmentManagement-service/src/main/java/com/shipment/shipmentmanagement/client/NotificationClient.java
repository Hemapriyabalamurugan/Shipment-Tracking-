package com.shipment.shipmentmanagement.client;

import com.shipment.shipmentmanagement.dto.NotificationRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
@FeignClient(name = "Notification-service")
public interface NotificationClient {

    @PostMapping("/api/notifications")
    void createNotification(
            @RequestBody NotificationRequest notificationRequest
    );
    @PutMapping("/api/notifications/shipment/{shipmentId}/accepted/{operatorId}")
    void markShipmentAccepted(
            @PathVariable("shipmentId") Long shipmentId,
            @PathVariable("operatorId") Long operatorId
    );
}