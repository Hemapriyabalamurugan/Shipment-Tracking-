package com.shipment.shipmentmanagement.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class RouteHubDto {

    private Long hubId;

    private String hubName;

    private String city;

    private Double latitude;

    private Double longitude;

    // Distance from this hub to the next hub.
    // Last hub will have 0.
    private Integer distanceToNextKm;
}