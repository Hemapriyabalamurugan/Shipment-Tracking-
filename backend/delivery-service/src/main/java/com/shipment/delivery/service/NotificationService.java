package com.shipment.delivery.service;

import com.shipment.delivery.entity.Notification;
import com.shipment.delivery.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.shipment.delivery.websocket.NotificationPublisher;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationPublisher notificationPublisher;

    /**
     * Create notification
     */
    public Notification createNotification(Notification notification) {

        if (notification.getCreatedAt() == null) {
            notification.setCreatedAt(LocalDateTime.now());
        }

        if (notification.getIsRead() == null) {
            notification.setIsRead(false);
        }

        Notification saved =
                notificationRepository.save(notification);

        notificationPublisher.publishNotification(saved);

        return saved;
    }

    /**
     * Get all notifications for a user
     */
    public List<Notification> getUserNotifications(Long userId) {

        return notificationRepository.findByUserId(userId);
    }

    /**
     * Get unread notifications
     */
    public List<Notification> getUnreadNotifications(Long userId) {

        return notificationRepository
                .findByUserIdAndIsReadFalse(userId);
    }

    /**
     * Mark notification as read
     */
    public Notification markAsRead(Long notificationId) {

        Notification notification =
                notificationRepository.findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found: "
                                                + notificationId));

        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());

        return notificationRepository.save(notification);
    }

    /**
     * Get notifications related to a shipment
     */
    public List<Notification> getShipmentNotifications(Long shipmentId) {

        return notificationRepository.findByShipmentId(shipmentId);
    }

    /**
     * Delete notification
     */
    public void deleteNotification(Long notificationId) {

        notificationRepository.deleteById(notificationId);
    }
}