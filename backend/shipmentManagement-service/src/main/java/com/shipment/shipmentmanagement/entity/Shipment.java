

package com.shipment.shipmentmanagement.entity;

import com.shipment.shipmentmanagement.entity.enums.ShipmentStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "shipments")
@Getter
@Setter
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tracking_number", nullable = false, unique = true)
    private String trackingNumber;

//    @ManyToOne
//    @JoinColumn(name = "customer_id", nullable = false)
//    private User customer;
//
//    @ManyToOne
//    @JoinColumn(name = "business_client_id")
//    private User businessClient;
//
//    @ManyToOne
//    @JoinColumn(name = "driver_id")
//    private User driver;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "business_client_id")
    private Long businessClientId;

    @Column(name = "driver_id")
    private Long driverId;
//    @ManyToOne
//    @JoinColumn(name = "vehicle_id")
//    private Vehicle vehicle;

    // =====================================================
    // Sender Information
    // =====================================================

    @Column(name = "sender_name")
    private String senderName;

    @Column(name = "sender_phone")
    private String senderPhone;

    @Column(name = "sender_email")
    private String senderEmail;

    @Column(name = "sender_address")
    private String senderAddress;

    @Column(name = "sender_city")
    private String senderCity;

    @Column(name = "sender_state")
    private String senderState;

    @Column(name = "sender_postal_code")
    private String senderPostalCode;

    @Column(name = "sender_country")
    private String senderCountry;

    // =====================================================
    // Receiver Information
    // =====================================================

    @Column(name = "receiver_name")
    private String receiverName;

    @Column(name = "receiver_phone")
    private String receiverPhone;

    @Column(name = "receiver_email")
    private String receiverEmail;

    @Column(name = "receiver_address")
    private String receiverAddress;

    @Column(name = "receiver_city")
    private String receiverCity;

    @Column(name = "receiver_state")
    private String receiverState;

    @Column(name = "receiver_postal_code")
    private String receiverPostalCode;

    @Column(name = "receiver_country")
    private String receiverCountry;

    // =====================================================
    // Package Information
    // =====================================================

    @Column(name = "package_type")
    private String packageType;

    @Column(name = "package_description")
    private String packageDescription;

    @Column(name = "package_weight_kg")
    private BigDecimal packageWeightKg;

    @Column(name = "declared_value")
    private BigDecimal declaredValue;

    @Column(name = "fragile")
    private Boolean fragile;

    @Column(name = "insured")
    private Boolean insured;

    @Column(name = "cod_amount")
    private BigDecimal codAmount;

    // =====================================================
    // Shipment Details
    // =====================================================

    @Column(name = "shipment_type")
    private String shipmentType;

    @Column(name = "priority")
    private String priority;

    @Enumerated(EnumType.STRING)
    @Column(name = "status",nullable = false)
    private ShipmentStatus status;

    @Column(name = "delivery_attempts")
    private Integer deliveryAttempts;

    // =====================================================
    // Live Location
    // =====================================================

    @Column(name = "current_latitude")
    private BigDecimal currentLatitude;

    @Column(name = "current_longitude")
    private BigDecimal currentLongitude;

    // =====================================================
    // Timeline
    // =====================================================

    @Column(name = "scheduled_pickup_at")
    private LocalDateTime scheduledPickupAt;

    @Column(name = "picked_up_at")
    private LocalDateTime pickedUpAt;

    @Column(name = "estimated_delivery_at")
    private LocalDateTime estimatedDeliveryAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    // =====================================================
    // Audit Fields
    // =====================================================

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false)
    private LocalDateTime updatedAt;


}