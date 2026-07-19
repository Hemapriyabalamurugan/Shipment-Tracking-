package com.shipment.delivery.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class RouteResponse {

    private Long routeId;

    private Long shipmentId;

    private String startLocation;

    private String endLocation;

    private BigDecimal distanceKm;

    private Integer trafficDelayMinutes;

    private String plannedRouteJson;

    private String actualRouteJson;

    private LocalDateTime startedAt;

    private LocalDateTime completedAt;
}