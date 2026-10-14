package com.shipment.shipmentmanagement.config;

public final class ShipmentConstants {

    private ShipmentConstants() {
    }

    public static final int AVERAGE_SPEED_KMH = 50;

    public static final int HUB_DELAY_MINUTES = 30;

    public static final int TRAFFIC_LOW_DELAY = 0;
    public static final int TRAFFIC_MODERATE_DELAY = 20;
    public static final int TRAFFIC_HEAVY_DELAY = 60;

    public static final int WEATHER_CLEAR_DELAY = 0;
    public static final int WEATHER_RAIN_DELAY = 30;
    public static final int WEATHER_FOG_DELAY = 45;
    public static final int WEATHER_STORM_DELAY = 90;

    public static final int ROAD_GOOD_DELAY = 0;
    public static final int ROAD_UNDER_CONSTRUCTION_DELAY = 20;
    public static final int ROAD_ACCIDENT_DELAY = 45;
    public static final int ROAD_BLOCKED_DELAY = 120;
}