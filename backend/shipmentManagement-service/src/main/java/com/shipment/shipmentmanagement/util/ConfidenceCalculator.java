package com.shipment.shipmentmanagement.util;

import com.shipment.shipmentmanagement.entity.JourneyUpdate;
import com.shipment.shipmentmanagement.entity.enums.RoadCondition;
import com.shipment.shipmentmanagement.entity.enums.TrafficCondition;
import com.shipment.shipmentmanagement.entity.enums.WeatherCondition;

public final class ConfidenceCalculator {

    private ConfidenceCalculator() {
    }

    public static int calculate(JourneyUpdate update) {

        int confidence = 100;

        if (update == null) {
            return confidence;
        }

        if (update.getTrafficCondition() == TrafficCondition.MODERATE) {
            confidence -= 5;
        } else if (update.getTrafficCondition() == TrafficCondition.HEAVY) {
            confidence -= 15;
        }

        if (update.getWeatherCondition() == WeatherCondition.RAIN) {
            confidence -= 5;
        } else if (update.getWeatherCondition() == WeatherCondition.FOG) {
            confidence -= 10;
        } else if (update.getWeatherCondition() == WeatherCondition.STORM) {
            confidence -= 20;
        }

        if (update.getRoadCondition() == RoadCondition.UNDER_CONSTRUCTION) {
            confidence -= 5;
        } else if (update.getRoadCondition() == RoadCondition.ACCIDENT) {
            confidence -= 15;
        } else if (update.getRoadCondition() == RoadCondition.BLOCKED) {
            confidence -= 25;
        }

        return Math.max(confidence, 20);
    }
}