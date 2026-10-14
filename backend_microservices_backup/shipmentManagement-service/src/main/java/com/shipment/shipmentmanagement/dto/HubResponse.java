package com.shipment.shipmentmanagement.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class HubResponse {

    private Long id;

    private String hubName;

    private String city;

    private Double latitude;

    private Double longitude;

//    additional moulika
//private String state;
}