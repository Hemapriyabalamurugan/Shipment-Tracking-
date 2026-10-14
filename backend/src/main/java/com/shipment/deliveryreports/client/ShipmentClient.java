package com.shipment.deliveryreports.client;

import com.shipment.deliveryreports.dto.response.ShipmentAnalyticsDataResponse;

import java.time.LocalDateTime;
import java.util.List;

public interface ShipmentClient {

    List<ShipmentAnalyticsDataResponse> getAllShipmentsForAnalyticsByDateRange(
            LocalDateTime startDate,
            LocalDateTime endDate
    );

    List<ShipmentAnalyticsDataResponse> getBusinessShipmentsForAnalyticsByDateRange(
            Long businessClientId,
            LocalDateTime startDate,
            LocalDateTime endDate
    );

    List<ShipmentAnalyticsDataResponse> getCustomerShipmentsForAnalyticsByDateRange(
            Long customerId,
            LocalDateTime startDate,
            LocalDateTime endDate
    );

    List<ShipmentAnalyticsDataResponse> getDriverShipmentsForAnalyticsByDateRange(
            Long driverId,
            LocalDateTime startDate,
            LocalDateTime endDate
    );
}
