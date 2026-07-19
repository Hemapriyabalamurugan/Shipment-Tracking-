package com.shipment.delivery.websocket;

import com.shipment.delivery.entity.Notification;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    public void publishNotification(Notification notification) {

        messagingTemplate.convertAndSend(
                "/topic/notifications",
                notification
        );
    }
}