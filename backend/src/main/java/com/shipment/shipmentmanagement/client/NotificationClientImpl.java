package com.shipment.shipmentmanagement.client;

import com.shipment.notification.service.NotificationService;
import com.shipment.shipmentmanagement.dto.NotificationRequest;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

@Component("shipmentNotificationClient")
public class NotificationClientImpl implements NotificationClient {

    private final NotificationService notificationService;

    public NotificationClientImpl(@Lazy NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Override
    public void createNotification(NotificationRequest notificationRequest) {
        if (notificationRequest == null) return;
        com.shipment.notification.dto.NotificationRequest target =
                new com.shipment.notification.dto.NotificationRequest();
        target.setUserId(notificationRequest.getUserId());
        target.setShipmentId(notificationRequest.getShipmentId());
        target.setChannel(notificationRequest.getChannel());
        target.setTitle(notificationRequest.getTitle());
        target.setMessage(notificationRequest.getMessage());
        target.setPriority(notificationRequest.getPriority());
        target.setEventType(notificationRequest.getEventType());

        notificationService.create(target);
    }

    @Override
    public void markShipmentAccepted(Long shipmentId, Long operatorId) {
        notificationService.markShipmentAccepted(shipmentId, operatorId);
    }
}
