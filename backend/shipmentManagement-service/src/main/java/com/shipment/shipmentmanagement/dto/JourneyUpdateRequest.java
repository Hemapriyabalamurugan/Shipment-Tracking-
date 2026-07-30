package com.shipment.shipmentmanagement.dto;

import com.shipment.shipmentmanagement.entity.enums.RoadCondition;
import com.shipment.shipmentmanagement.entity.enums.TrafficCondition;
import com.shipment.shipmentmanagement.entity.enums.WeatherCondition;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JourneyUpdateRequest {

    private Long shipmentId;

    private TrafficCondition trafficCondition;

    private WeatherCondition weatherCondition;

    private RoadCondition roadCondition;

    private String remarks;
}