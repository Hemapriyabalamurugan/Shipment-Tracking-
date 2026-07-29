package com.shipment.notification.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
//
//    private Long userId;
//
//    private Long shipmentId;
//
//    private String channel;
//
//    private String title;
//
//    private String message;
//
//    private Boolean isRead;
//
//    private LocalDateTime readAt;
//
//    private LocalDateTime sentAt;
//
//    private LocalDateTime createdAt;
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "shipment_id")
    private Long shipmentId;

    @Column(name = "channel", nullable = false)
    private String channel;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "message", columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(name = "priority")
    private String priority;

    @Column(name = "is_read")
    private Boolean isRead;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
    @Column(name = "event_type")
    private String eventType;
}