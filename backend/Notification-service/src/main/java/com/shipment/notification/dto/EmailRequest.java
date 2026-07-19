package com.shipment.notification.dto;

import lombok.Data;

@Data
public class EmailRequest {

    private String email;

    private String customerName;

    private String trackingNumber;

    private String deliveryDate;
}