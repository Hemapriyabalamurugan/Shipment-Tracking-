package com.shipment.notification.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ShipmentResponse {

    private Long id;

    private String trackingNumber;

    private String status;

    private String senderName;

    private String receiverName;

    private String origin;

    private String destination;

    private LocalDateTime estimatedDelivery;

    private Long customerId;

    private Long operatorId;
}