package com.shipment.shipmentmanagement.dto;

import com.shipment.shipmentmanagement.entity.enums.ShipmentStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class NavigationResponse {

    private Long shipmentId;

    private String trackingNumber;

    private HubLocationDto currentHub;

    private HubLocationDto nextHub;
    private HubLocationDto originHub;

    private HubLocationDto destinationHub;
    private ShipmentStatus shipmentStatus;
}