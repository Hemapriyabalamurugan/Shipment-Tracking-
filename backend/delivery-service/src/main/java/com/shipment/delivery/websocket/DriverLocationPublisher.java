package com.shipment.delivery.websocket;

import com.shipment.delivery.entity.DriverLocation;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DriverLocationPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    public void publishLocation(
            DriverLocation location) {

        messagingTemplate.convertAndSend(
                "/topic/driver-location",
                location
        );
    }
}