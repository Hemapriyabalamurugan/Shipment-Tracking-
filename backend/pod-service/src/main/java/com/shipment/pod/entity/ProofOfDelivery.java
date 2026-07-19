//package com.shipment.pod.entity;
//
//import jakarta.persistence.*;
//import lombok.*;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "proofs_of_delivery")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class ProofOfDelivery {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//
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

package com.shipment.pod.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "proofs_of_delivery")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProofOfDelivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "shipment_id", nullable = false, unique = true)
    private Long shipmentId;

    @Column(name = "signature_data")
    private String signatureData;

    @Column(name = "recipient_name")
    private String recipientName;

    @Column(name = "recipient_phone")
    private String recipientPhone;

    @Column(name = "photo_url")
    private String photoUrl;

    @Column(name = "delivery_notes")
    private String deliveryNotes;

    @Column(name = "verified_by")
    private Long verifiedBy;

    @Column(name = "verification_status")
    private String verificationStatus;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "captured_at", insertable = false, updatable = false)
    private LocalDateTime capturedAt;
}