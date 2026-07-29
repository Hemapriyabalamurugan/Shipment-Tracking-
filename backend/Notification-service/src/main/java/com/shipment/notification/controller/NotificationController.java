//package com.shipment.notification.controller;
//
//import com.shipment.notification.dto.NotificationRequest;
//import com.shipment.notification.entity.Notification;
//import com.shipment.notification.service.NotificationService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/notifications")
//@RequiredArgsConstructor
//public class NotificationController {
//
//    private final NotificationService service;
//
//    @PostMapping
//    public Notification create(
//            @RequestBody NotificationRequest request) {
//
//        return service.create(request);
//    }
//
//    @GetMapping("/user/{userId}")
//    public List<Notification> getUserNotifications(
//            @PathVariable Long userId) {
//
//        return service.getUserNotifications(userId);
//    }
//
//    @GetMapping("/unread")
//    public List<Notification> getUnreadNotifications() {
//
//        return service.getUnreadNotifications();
//    }
//
//    @PutMapping("/{id}/read")
//    public Notification markAsRead(
//            @PathVariable Long id) {
//
//        return service.markAsRead(id);
//    }
//
//    @GetMapping("/unread-count/{userId}")
//    public long getUnreadNotificationCount(
//            @PathVariable Long userId
//    ) {
//
//        return service.getUnreadNotificationCount(
//                userId
//        );
//    }
//}

package com.shipment.notification.controller;

import com.shipment.notification.dto.NotificationRequest;
import com.shipment.notification.entity.Notification;
import com.shipment.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService service;

    @PostMapping
    public Notification create(
            @RequestBody NotificationRequest request) {

        return service.create(request);
    }

    @GetMapping("/user/{userId}")
    public List<Notification> getUserNotifications(
            @PathVariable Long userId) {

        return service.getUserNotifications(userId);
    }

    @GetMapping("/user/{userId}/unread")
    public List<Notification> getUnreadNotifications(
            @PathVariable Long userId) {

        return service.getUnreadNotifications(userId);
    }

    @PutMapping("/{id}/read")
    public Notification markAsRead(
            @PathVariable Long id) {

        return service.markAsRead(id);
    }

    @GetMapping("/user/{userId}/unread-count")
    public long getUnreadNotificationCount(
            @PathVariable Long userId) {

        return service.getUnreadNotificationCount(userId);
    }

    @PutMapping("/shipment/{shipmentId}/accepted/{operatorId}")
    public void markShipmentAccepted(
            @PathVariable Long shipmentId,
            @PathVariable Long operatorId
    ) {

        service.markShipmentAccepted(
                shipmentId,
                operatorId
        );
    }
}