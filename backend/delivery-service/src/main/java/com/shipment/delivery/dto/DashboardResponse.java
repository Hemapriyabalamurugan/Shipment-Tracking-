package com.shipment.delivery.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class DashboardResponse {

    private Long shipmentId;

    private String currentStatus;

    private String lastEvent;

    private BigDecimal latitude;

    private BigDecimal longitude;

    private BigDecimal speedKmh;

    private String startLocation;

    private String endLocation;

    private BigDecimal distanceKm;

    private Integer trafficDelayMinutes;
}