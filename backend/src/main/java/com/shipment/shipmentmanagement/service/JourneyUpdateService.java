package com.shipment.shipmentmanagement.service;

import com.shipment.shipmentmanagement.dto.JourneyUpdateRequest;
import com.shipment.shipmentmanagement.dto.JourneyUpdateResponse;

public interface JourneyUpdateService {

    JourneyUpdateResponse updateJourney(
            JourneyUpdateRequest request
    );
}