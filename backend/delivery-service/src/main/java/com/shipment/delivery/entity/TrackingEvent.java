//package com.shipment.delivery.entity;
//
//import jakarta.persistence.*;
//import lombok.*;
//
//import java.math.BigDecimal;
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "tracking_events")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class TrackingEvent {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(name = "shipment_id", nullable = false)
//    private Long shipmentId;
//
//    @Column(nullable = false, length = 50)
//    private String status;
//
//    @Column(name = "location_lat", precision = 10, scale = 8)
//    private BigDecimal locationLat;
//
//    @Column(name = "location_lng", precision = 11, scale = 8)
//    private BigDecimal locationLng;
//
//    @Column(name = "location_address")
//    private String locationAddress;
//
//    @Column(name = "event_description")
//    private String eventDescription;
//
//    @Column(name = "created_by")
//    private Long createdBy;
//
//    @Column(name = "event_timestamp")
//    private LocalDateTime eventTimestamp;
//}
package com.shipment.delivery.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "tracking_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrackingEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "shipment_id", nullable = false)
    private Long shipmentId;

    @Column(name = "recorded_by")
    private Long recordedBy;

    @Column(name = "event_type", nullable = false)
    private String eventType;

    @Column(name = "shipment_status", nullable = false)
    private String shipmentStatus;

    @Column(name = "latitude", precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(name = "longitude", precision = 11, scale = 8)
    private BigDecimal longitude;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "event_time", insertable = false, updatable = false)
    private LocalDateTime eventTime;
}