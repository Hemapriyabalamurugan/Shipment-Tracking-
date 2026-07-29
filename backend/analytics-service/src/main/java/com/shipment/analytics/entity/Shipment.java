//package com.shipment.analytics.entity;
//
//import jakarta.persistence.*;
//import lombok.*;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "shipments")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class Shipment {
//
//    @Id
//    private Long id;
//
//    @Column(name = "business_client_id")
//    private Long businessClientId;
//
//    @Column(name = "status")
//    private String status;
//
//    @Column(name = "created_at")
//    private LocalDateTime createdAt;
//
//    @Column(name = "picked_up_at")
//    private LocalDateTime pickedUpAt;
//
//    @Column(name = "estimated_delivery_at")
//    private LocalDateTime estimatedDeliveryAt;
//
//    @Column(name = "delivered_at")
//    private LocalDateTime deliveredAt;
//}