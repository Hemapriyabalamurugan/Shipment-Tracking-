package com.shipment.pod.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

//@Data
//@Builder
//public class ProofOfDeliveryResponse {
//
//    private Long id;
//
//    private Long shipmentId;
//
//    private Long driverId;
//
//    private String recipientName;
//
//    private String signatureUrl;
//
//    private String photoUrl;
//
//    private String notes;
//
//    private String deliveryStatus;
//
//    private LocalDateTime deliveredAt;
//
//    private Boolean verified;
//}
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProofOfDeliveryResponse {

    private Long id;

    private Long shipmentId;
    private String trackingNumber;
    private String recipientName;

    private String recipientPhone;

    private String signatureUrl;

    private String photoUrl;

    private String deliveryNotes;

    private String verificationStatus;

    private Long verifiedBy;

    private LocalDateTime verifiedAt;

    private LocalDateTime capturedAt;
}