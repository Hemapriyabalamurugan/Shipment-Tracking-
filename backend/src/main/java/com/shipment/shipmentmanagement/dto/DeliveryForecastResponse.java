package com.shipment.shipmentmanagement.dto;

import com.shipment.shipmentmanagement.entity.enums.ForecastStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class DeliveryForecastResponse {

    private ForecastStatus forecastStatus;

    private String reason;

    private Integer confidencePercentage;

    private Integer expectedDelayMinutes;

    private Integer expectedEarlyMinutes;
}