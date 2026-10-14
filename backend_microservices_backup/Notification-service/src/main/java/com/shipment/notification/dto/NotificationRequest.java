package com.shipment.notification.dto;

import lombok.Data;

@Data
public class NotificationRequest {

    private Long userId;

    private Long shipmentId;

    private String channel;

    private String title;

    private String message;
    private String priority;
    private String eventType;
}