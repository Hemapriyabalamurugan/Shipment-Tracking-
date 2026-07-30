package com.shipment.shipmentmanagement.util;

import com.shipment.shipmentmanagement.dto.DeliveryForecastResponse;

import java.time.Duration;
import java.time.LocalDateTime;
import com.shipment.shipmentmanagement.entity.enums.ForecastStatus;
public final class ForecastCalculator {

    private ForecastCalculator() {
    }

    public static DeliveryForecastResponse calculate(
            LocalDateTime plannedDelivery,
            LocalDateTime estimatedArrival,
            int confidence
    ) {

        long difference =
                Duration.between(
                        plannedDelivery,
                        estimatedArrival
                ).toMinutes();

        ForecastStatus status;

        int delayMinutes = 0;
        int earlyMinutes = 0;

        if (difference > 30) {

            status = ForecastStatus.DELAYED;
            delayMinutes = (int) difference;

        } else if (difference < -30) {

            status = ForecastStatus.EARLY;
            earlyMinutes = (int) Math.abs(difference);

        } else {

            status = ForecastStatus.ON_TIME;
        }

        return DeliveryForecastResponse.builder()
                .forecastStatus(status)
                .reason(buildReason(status))
                .confidencePercentage(confidence)
                .expectedDelayMinutes(delayMinutes)
                .expectedEarlyMinutes(earlyMinutes)
                .build();
    }

    private static String buildReason(ForecastStatus status) {

        return switch (status) {

            case EARLY ->
                    "Shipment is expected to arrive early.";

            case DELAYED ->
                    "Shipment may be delayed due to current journey conditions.";

            case ON_TIME ->
                    "Shipment is expected to arrive on time.";
        };
    }
}