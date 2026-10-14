//package com.shipment.delivery.entity;
//
//import jakarta.persistence.*;
//import lombok.*;
//
//import java.math.BigDecimal;
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "driver_locations")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class DriverLocation {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(name = "driver_id", nullable = false)
//    private Long driverId;
//
//    @Column(name = "latitude", nullable = false, precision = 10, scale = 8)
//    private BigDecimal latitude;
//
//    @Column(name = "longitude", nullable = false, precision = 11, scale = 8)
//    private BigDecimal longitude;
//
//    @Column(name = "speed_kmh", precision = 5, scale = 2)
//    private BigDecimal speedKmh;
//
//    @Column(name = "recorded_at")
//    private LocalDateTime recordedAt;
//}
package com.shipment.delivery.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "driver_locations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "driver_id", nullable = false)
    private Long driverId;

    @Column(name = "vehicle_id")
    private Long vehicleId;

    @Column(name = "latitude", nullable = false, precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(name = "longitude", nullable = false, precision = 11, scale = 8)
    private BigDecimal longitude;

    @Column(name = "speed_kmh", precision = 6, scale = 2)
    private BigDecimal speedKmh;

    @Column(name = "heading", precision = 6, scale = 2)
    private BigDecimal heading;

    @Column(name = "accuracy", precision = 8, scale = 2)
    private BigDecimal accuracy;

    @Column(name = "battery_level", precision = 5, scale = 2)
    private BigDecimal batteryLevel;

    @Column(name = "recorded_at", insertable = false, updatable = false)
    private LocalDateTime recordedAt;
}