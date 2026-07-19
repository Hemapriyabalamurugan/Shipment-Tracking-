package com.shipment.analyticsreport.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "NOTIFICATION-SERVICE")
public interface NotificationClient {

    @GetMapping("/api/notifications/unread-count/{userId}")
    long getUnreadNotificationCount(
            @PathVariable Long userId
    );
}