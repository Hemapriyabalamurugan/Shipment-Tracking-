package com.shipment.delivery.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "routes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "shipment_id", nullable = false)
    private Long shipmentId;

    @Column(name = "start_location", nullable = false)
    private String startLocation;

    @Column(name = "end_location", nullable = false)
    private String endLocation;

    @Column(name = "distance_km", precision = 10, scale = 2)
    private BigDecimal distanceKm;

//    @Column(name = "planned_route_json", columnDefinition = "jsonb")
//    private String plannedRouteJson;
//
//    @Column(name = "actual_route_json", columnDefinition = "jsonb")
//    private String actualRouteJson;

    @Column(name = "planned_route_json", columnDefinition = "jsonb")
    private String plannedRouteJson;

    @Column(name = "actual_route_json", columnDefinition = "jsonb")
    private String actualRouteJson;

    @Column(name = "traffic_delay_min")
    private Integer trafficDelayMin;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "estimated_duration_min")
    private Integer estimatedDurationMin;
}