package com.shipment.shipmentmanagement.util;

import com.shipment.shipmentmanagement.entity.JourneyUpdate;
import com.shipment.shipmentmanagement.entity.enums.RoadCondition;
import com.shipment.shipmentmanagement.entity.enums.TrafficCondition;
import com.shipment.shipmentmanagement.entity.enums.WeatherCondition;

public final class EtaCalculator {



    private EtaCalculator() {
    }

    public static int calculateMinutes(
            int remainingDistanceKm,
            int remainingHubs,
            String priority,
            JourneyUpdate update

    ) {

        int minutes = TimeCalculator.calculateBaseMinutes(
                remainingDistanceKm,
                remainingHubs,
                priority
        );

        if (update == null) {
            return minutes;
        }
//
//        // Traffic
//
//        if (update.getTrafficCondition() == TrafficCondition.MODERATE) {
//            minutes += 20;
//        } else if (update.getTrafficCondition() == TrafficCondition.HEAVY) {
//            minutes += 45;
//        }
//
//        // Weather
//
//        if (update.getWeatherCondition() == WeatherCondition.RAIN) {
//            minutes += 15;
//        } else if (update.getWeatherCondition() == WeatherCondition.FOG) {
//            minutes += 30;
//        } else if (update.getWeatherCondition() == WeatherCondition.STORM) {
//            minutes += 60;
//        }
//
//        // Road
//
//        if (update.getRoadCondition() == RoadCondition.UNDER_CONSTRUCTION) {
//            minutes += 20;
//        } else if (update.getRoadCondition() == RoadCondition.ACCIDENT) {
//            minutes += 40;
//        } else if (update.getRoadCondition() == RoadCondition.BLOCKED) {
//            minutes += 90;
//        }

        // Traffic

        if (update.getTrafficCondition() == TrafficCondition.MODERATE) {
            minutes += (int) (minutes * 0.10);
        } else if (update.getTrafficCondition() == TrafficCondition.HEAVY) {
            minutes += (int) (minutes * 0.25);
        }

// Weather

        if (update.getWeatherCondition() == WeatherCondition.RAIN) {
            minutes += (int) (minutes * 0.05);
        } else if (update.getWeatherCondition() == WeatherCondition.FOG) {
            minutes += (int) (minutes * 0.10);
        } else if (update.getWeatherCondition() == WeatherCondition.STORM) {
            minutes += (int) (minutes * 0.20);
        }

// Road

        if (update.getRoadCondition() == RoadCondition.UNDER_CONSTRUCTION) {
            minutes += (int) (minutes * 0.05);
        } else if (update.getRoadCondition() == RoadCondition.ACCIDENT) {
            minutes += (int) (minutes * 0.15);
        } else if (update.getRoadCondition() == RoadCondition.BLOCKED) {
            minutes += (int) (minutes * 0.30);
        }

        return minutes;
    }
}