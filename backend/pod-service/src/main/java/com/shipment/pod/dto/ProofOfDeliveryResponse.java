package com.shipment.pod.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ProofOfDeliveryResponse {

    private Long id;

    private Long shipmentId;

    private Long driverId;

    private String recipientName;

    private String signatureUrl;

    private String photoUrl;

    private String notes;

    private String deliveryStatus;

    private LocalDateTime deliveredAt;

    private Boolean verified;
}