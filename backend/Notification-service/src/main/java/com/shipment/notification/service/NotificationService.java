package com.shipment.notification.service;

import com.shipment.notification.dto.NotificationRequest;
import com.shipment.notification.entity.Notification;
import com.shipment.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository repository;

    public Notification create(NotificationRequest request) {

        Notification notification =
                Notification.builder()
                        .userId(request.getUserId())
                        .shipmentId(request.getShipmentId())
                        .channel(request.getChannel())
                        .title(request.getTitle())
                        .message(request.getMessage())
                        .priority(
                                request.getPriority() == null
                                        ? "NORMAL"
                                        : request.getPriority())
                        .isRead(false)
                        .sentAt(LocalDateTime.now())
                        .build();

        return repository.save(notification);
    }

//    public List<Notification> getUserNotifications(Long userId) {
//        return repository.findByUserId(userId);
//    }
//
//    public List<Notification> getUnreadNotifications() {
//        return repository.findByIsRead(false);
//    }

    public List<Notification> getUserNotifications(Long userId) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        return repository.findByUserIdAndIsReadFalse(userId);
    }

    public Notification markAsRead(Long id) {

//        Notification notification =
//                repository.findById(id)
//                        .orElseThrow();
        Notification notification = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Notification not found"));

        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());

        return repository.save(notification);
    }
    public long getUnreadNotificationCount(
            Long userId
    ) {

        return repository.countByUserIdAndIsReadFalse(
                userId
        );
    }
}