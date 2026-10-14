package com.shipment.analytics.client;

import com.shipment.analytics.dto.response.ShipmentAnalyticsDataResponse;

import java.time.LocalDateTime;
import java.util.List;

public interface ShipmentClient {

    List<ShipmentAnalyticsDataResponse> getAllShipmentsForAnalytics();

    List<ShipmentAnalyticsDataResponse> getBusinessShipmentsForAnalytics(Long businessClientId);

    List<ShipmentAnalyticsDataResponse> getAllShipmentsForAnalyticsByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    List<ShipmentAnalyticsDataResponse> getBusinessShipmentsForAnalyticsByDateRange(Long businessClientId, LocalDateTime startDate, LocalDateTime endDate);

    List<ShipmentAnalyticsDataResponse> getCustomerShipmentsForAnalyticsByDateRange(Long customerId, LocalDateTime startDate, LocalDateTime endDate);

    List<ShipmentAnalyticsDataResponse> getDriverShipmentsForAnalyticsByDateRange(Long driverId, LocalDateTime startDate, LocalDateTime endDate);
}