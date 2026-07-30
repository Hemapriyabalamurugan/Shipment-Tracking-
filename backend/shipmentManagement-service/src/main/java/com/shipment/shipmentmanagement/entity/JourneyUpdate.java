package com.shipment.shipmentmanagement.entity;

import com.shipment.shipmentmanagement.entity.enums.RoadCondition;
import com.shipment.shipmentmanagement.entity.enums.TrafficCondition;
import com.shipment.shipmentmanagement.entity.enums.WeatherCondition;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "journey_update")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JourneyUpdate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "shipment_id", nullable = false)
    private Long shipmentId;

    @Column(name = "current_hub_id", nullable = false)
    private Long currentHubId;

    @Enumerated(EnumType.STRING)
    @Column(name = "traffic_condition", nullable = false)
    private TrafficCondition trafficCondition;

    @Enumerated(EnumType.STRING)
    @Column(name = "weather_condition", nullable = false)
    private WeatherCondition weatherCondition;

    @Enumerated(EnumType.STRING)
    @Column(name = "road_condition", nullable = false)
    private RoadCondition roadCondition;

    @Column(name = "remarks")
    private String remarks;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}