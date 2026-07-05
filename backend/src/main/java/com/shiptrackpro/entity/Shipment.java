package com.shiptrackpro.entity;

import com.shiptrackpro.entity.enums.ShipmentStatus;
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

    public String getTrackingNumber() {
        return trackingNumber;
    }

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private User customer;

    @ManyToOne
    @JoinColumn(name = "business_client_id")
    private User businessClient;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private User driver;

    @Column(name = "sender_name")
    private String senderName;

    @Column(name = "sender_phone")
    private String senderPhone;

    @Column(name = "receiver_name")
    private String receiverName;

    @Column(name = "receiver_phone")
    private String receiverPhone;

    @Column(name = "delivery_address")
    private String deliveryAddress;

    @Column(name = "delivery_city")
    private String deliveryCity;

    @Column(name = "delivery_state")
    private String deliveryState;

    @Column(name = "delivery_zip")
    private String deliveryZip;

    @Column(name = "delivery_country")
    private String deliveryCountry;

    @Column(name = "package_weight_kg")
    private BigDecimal packageWeightKg;

    @Column(name = "package_description")
    private String packageDescription;

    @Column(name = "package_type")
    private String packageType;

    @Enumerated(EnumType.STRING)
    private ShipmentStatus status;

    @Column(name = "current_location_lat")
    private BigDecimal currentLocationLat;

    @Column(name = "current_location_lng")
    private BigDecimal currentLocationLng;

    @Column(name = "estimated_delivery_date")
    private LocalDateTime estimatedDeliveryDate;

    @Column(name = "actual_delivery_date")
    private LocalDateTime actualDeliveryDate;

    @Column(name = "scheduled_date")
    private LocalDateTime scheduledDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}