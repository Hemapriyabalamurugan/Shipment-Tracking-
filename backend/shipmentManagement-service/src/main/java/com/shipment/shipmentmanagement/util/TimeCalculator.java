package com.shipment.shipmentmanagement.util;

public final class TimeCalculator {

    private static final int DRIVER_SPEED_KMH = 45;

    private static final int DRIVER_REST_AFTER_HOURS = 8;
    private static final int DRIVER_REST_MINUTES = 45;

    private static final int FUEL_STOP_EVERY_KM = 500;
    private static final int FUEL_STOP_MINUTES = 20;

    private static final int MEAL_BREAK_AFTER_HOURS = 6;
    private static final int MEAL_BREAK_MINUTES = 30;

    private static final int HUB_PROCESSING_MINUTES = 30;

    private TimeCalculator() {
    }

    public static int calculateBaseMinutes(
            int distanceKm,
            int remainingHubs,
            String priority
    ) {

        int drivingMinutes =
                (int) Math.ceil(
                        (distanceKm * 60.0)
                                / DRIVER_SPEED_KMH
                );

        int drivingHours = drivingMinutes / 60;

        int restBreaks =
                drivingHours / DRIVER_REST_AFTER_HOURS;

        int mealBreaks =
                drivingHours / MEAL_BREAK_AFTER_HOURS;

        int fuelStops =
                distanceKm / FUEL_STOP_EVERY_KM;

        int overnightStops =
                drivingHours / 12;

        int overnightRestMinutes =
                overnightStops * 480; // 8 hours

//        if ("EXPRESS".equalsIgnoreCase(priority)) {
//
//            drivingMinutes = (int) (drivingMinutes * 0.80);
//
//        } else if ("SAME_DAY".equalsIgnoreCase(priority)) {
//
//            drivingMinutes = (int) (drivingMinutes * 0.60);
//        }

        return drivingMinutes
                + (restBreaks * DRIVER_REST_MINUTES)
                + (mealBreaks * MEAL_BREAK_MINUTES)
                + (fuelStops * FUEL_STOP_MINUTES)
                + overnightRestMinutes
                + (remainingHubs * HUB_PROCESSING_MINUTES);
    }

}