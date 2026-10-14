package com.shipment.shipmentmanagement.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.time.LocalDateTime;


@Getter
@Setter
@Builder
public class TrackingResponse {

    private String trackingNumber;

    private String shipmentStatus;

    // Sender city (Origin)
    private HubLocationDto origin;

    // Receiver city (Destination)
    private HubLocationDto destination;

    // Current package location
    private HubLocationDto currentLocation;

    // Complete route
    private List<HubLocationDto> route;

    // Tracking history
    private List<HubLocationDto> completedHubs;

    private List<HubLocationDto> remainingHubs;
    private List<TrackingHistoryDto> trackingHistory;

    private int progressPercentage;

    private Integer remainingDistanceKm;

    private Integer estimatedHours;

    private Integer estimatedMinutes;

    private LocalDateTime estimatedArrival;

    private DeliveryForecastResponse deliveryForecast;
}