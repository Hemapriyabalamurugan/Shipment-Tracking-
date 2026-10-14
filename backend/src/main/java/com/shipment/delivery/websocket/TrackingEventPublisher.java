package com.shipment.delivery.websocket;

import com.shipment.delivery.entity.TrackingEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TrackingEventPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    public void publishTrackingEvent(TrackingEvent event) {

        messagingTemplate.convertAndSend(
                "/topic/tracking",
                event
        );
    }
}