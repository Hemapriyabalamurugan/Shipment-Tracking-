package com.shipment.shipmentmanagement.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class RouteFinderResponse {

    private String originHub;

    private String destinationHub;

    private Integer totalDistanceKm;

    private Integer estimatedHours;

    private Integer estimatedMinutes;

    private Integer totalHubs;

    private List<RouteHubDto> route;
}