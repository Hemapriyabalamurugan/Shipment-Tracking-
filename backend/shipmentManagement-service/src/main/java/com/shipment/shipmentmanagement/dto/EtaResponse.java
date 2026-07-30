package com.shipment.shipmentmanagement.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class EtaResponse {

    private Integer remainingDistanceKm;

    private Integer estimatedHours;

    private Integer estimatedMinutes;

    private LocalDateTime estimatedArrival;
}