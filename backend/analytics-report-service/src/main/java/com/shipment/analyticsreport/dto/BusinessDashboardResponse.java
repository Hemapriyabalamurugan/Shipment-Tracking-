package com.shipment.analyticsreport.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
    public class BusinessDashboardResponse {

    // Shipment Analytics
    private Long totalShipments;
    private Long deliveredShipments;
    private Long inTransitShipments;
    private Long pendingShipments;
    private Long failedDeliveries;

    // Delivery Performance
    private Double deliverySuccessRate;
    private Double averageDeliveryTimeDays;

    // Delay Analysis
    private Long delayedShipments;
    private Double averageDelayMinutes;

    // Logistics Overview
    private Long activeDrivers;
    private Long activeVehicles;

    // Customer Activity
    private Long notificationCount;
    }

