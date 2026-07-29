package com.shipment.shipmentmanagement.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class HubLocationDto {

    private String hubName;

    private Double latitude;

    private Double longitude;
}