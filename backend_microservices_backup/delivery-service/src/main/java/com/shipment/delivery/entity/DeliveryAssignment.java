//package com.shipment.delivery.entity;
//
//import jakarta.persistence.*;
//import lombok.*;
//import java.time.LocalDateTime;
//@Entity
//@Table(name = "delivery_assignments")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class DeliveryAssignment {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private Long shipmentId;
//
//    private Long driverId;
//
//    private LocalDateTime assignedAt;
//
//    private LocalDateTime acceptedAt;
//
//    private LocalDateTime completedAt;
//
//    private String status;
//}
package com.shipment.delivery.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "delivery_assignments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "shipment_id", nullable = false)
    private Long shipmentId;

    @Column(name = "driver_id", nullable = false)
    private Long driverId;

    @Column(name = "vehicle_id")
    private Long vehicleId;

    @Column(name = "assigned_by")
    private Long assignedBy;

    @Column(name = "assigned_at", insertable = false, updatable = false)
    private LocalDateTime assignedAt;

    @Column(name = "accepted_at")
    private LocalDateTime acceptedAt;

    @Column(name = "rejected_at")
    private LocalDateTime rejectedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "cancellation_reason", columnDefinition = "TEXT")
    private String cancellationReason;

    @Column(name = "status")
    private String status;
}