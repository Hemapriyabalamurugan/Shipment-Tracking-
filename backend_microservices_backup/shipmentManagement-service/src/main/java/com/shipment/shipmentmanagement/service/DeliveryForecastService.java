package com.shipment.shipmentmanagement.service;

import com.shipment.shipmentmanagement.dto.DeliveryForecastResponse;

public interface DeliveryForecastService {

    DeliveryForecastResponse generateForecast(
            Long shipmentId
    );
}
