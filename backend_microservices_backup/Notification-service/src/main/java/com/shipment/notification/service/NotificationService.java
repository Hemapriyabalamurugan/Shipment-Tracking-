package com.shipment.notification.service;

import com.shipment.notification.dto.NotificationRequest;
import com.shipment.notification.entity.Notification;
import com.shipment.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.shipment.notification.client.ShipmentServiceClient;
import com.shipment.notification.dto.ShipmentResponse;
import java.time.LocalDateTime;
import java.util.List;
import com.shipment.notification.client.AuthServiceClient;
import com.shipment.notification.dto.UserProfileResponse;
import java.util.HashMap;
import java.util.Map;
import com.shipment.notification.email.EmailService;
import com.shipment.notification.email.EmailTemplateService;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository repository;
    private final SimpMessagingTemplate messagingTemplate;

    private final AuthServiceClient authServiceClient;
    private final ShipmentServiceClient shipmentServiceClient;

    private final EmailService emailService;
    private final EmailTemplateService templateService;
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
                        .eventType(request.getEventType())
                        .isRead(false)
                        .sentAt(LocalDateTime.now())
                        .build();

//        return repository.save(notification);
        Notification saved = repository.save(notification);
        try {

            UserProfileResponse user =
                    authServiceClient.getUserById(saved.getUserId());
            ShipmentResponse shipment =
                    shipmentServiceClient.getShipment(
                            saved.getShipmentId()
                    );

            if ("CUSTOMER".equals(user.getRole())) {


                System.out.println("=================================");
                System.out.println("Event Type = " + saved.getEventType());
                System.out.println("Title = " + saved.getTitle());
                System.out.println("User = " + user.getEmail());
                System.out.println("=================================");

                String templateName = null;
                String subject = null;

                switch (saved.getEventType()) {

                    case "CREATED" -> {
                        templateName = "shipment-created.html";
                        subject = "Shipment Created";
                    }

                    case "PICKED_UP" -> {
                        templateName = "shipment-pickedup.html";
                        subject = "Shipment Picked Up";
                    }

                    case "IN_TRANSIT" -> {
                        templateName = "shipment-in-transit.html";
                        subject = "Shipment In Transit";
                    }

                    case "OUT_FOR_DELIVERY" -> {
                        templateName = "out-for-delivery.html";
                        subject = "Out For Delivery";
                    }

                    case "DELIVERED" -> {
                        templateName = "shipment-delivered.html";
                        subject = "Shipment Delivered";
                    }

                    case "FAILED_DELIVERY" -> {
                        templateName = "shipment-failed-delivery.html";
                        subject = "Delivery Failed";
                    }

                    default -> {
                        templateName = null;
                        subject = null;
                    }
                }
                if (templateName != null) {

                    String html =
                            templateService.loadTemplate(templateName);

                    Map<String, String> values =
                            new HashMap<>();

                    values.put(
                            "customerName",
                            user.getFirstName() + " " + user.getLastName());

                    values.put(
                            "trackingNumber",
                            shipment.getTrackingNumber());

                    values.put(
                            "deliveryDate",
                            LocalDateTime.now().toLocalDate().toString());

//                    values.put(
//                            "eta",
//                            LocalDateTime.now().plusDays(2).toLocalDate().toString());

                    values.put(
                            "eta",
                            shipment.getEstimatedDelivery() == null
                                    ? "-"
                                    : shipment.getEstimatedDelivery().toLocalDate().toString());
                    values.put(
                            "driverName",
                            "ShipTrack Pro Driver");

                    values.put(
                            "currentLocation",
                            "In Transit");

                    html =
                            templateService.replacePlaceholders(
                                    html,
                                    values);

                    try {
                        emailService.sendHtmlEmail(
                                user.getEmail(),
                                subject,
                                html);

                        System.out.println("EMAIL SENT SUCCESSFULLY");
                    } catch (Exception e) {
                        System.out.println("EMAIL FAILED");
                        e.printStackTrace();
                    }
                }
            }

        } catch (Exception ex) {

            ex.printStackTrace();
        }
        messagingTemplate.convertAndSend(
                "/topic/notifications/" + saved.getUserId(),
                saved
        );

        return saved;
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

    public void markShipmentAccepted(
            Long shipmentId,
            Long acceptedOperatorId
    ) {

        List<Notification> notifications =
                repository.findByShipmentId(shipmentId);

        for (Notification notification : notifications) {

            // Skip Business Client and Customer notifications
            if (!"New Shipment Created".equals(notification.getTitle())) {
                continue;
            }

            if (notification.getUserId().equals(acceptedOperatorId)) {

                notification.setTitle("Shipment Accepted");

                notification.setMessage(
                        "You accepted this shipment."
                );

            } else {

                notification.setTitle("Shipment Already Accepted");

                notification.setMessage(
                        "This shipment has already been accepted by another operator."
                );
            }

            repository.save(notification);
        }
    }
}