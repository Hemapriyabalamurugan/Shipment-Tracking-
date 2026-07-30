package com.shipment.shipmentmanagement.service;

import com.shipment.shipmentmanagement.dto.RouteFinderResponse;

public interface RouteFinderService {

    RouteFinderResponse findRoute(
            Long originHubId,
            Long destinationHubId
    );
}