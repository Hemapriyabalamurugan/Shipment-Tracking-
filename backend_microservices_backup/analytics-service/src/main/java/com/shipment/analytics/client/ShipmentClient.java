package com.shipment.analytics.client;

import com.shipment.analytics.dto.response.ShipmentAnalyticsDataResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.format.annotation.DateTimeFormat;





import com.shipment.analytics.config.FeignClientConfig;

@FeignClient(name = "SHIPMENTMANAGEMENT-SERVICE", configuration = FeignClientConfig.class)
public interface ShipmentClient {

    @GetMapping("/api/shipments/analytics")
    List<ShipmentAnalyticsDataResponse> getAllShipmentsForAnalytics();

    @GetMapping("/api/shipments/analytics/business/{businessClientId}/shipments")
    List<ShipmentAnalyticsDataResponse> getBusinessShipmentsForAnalytics(
            @PathVariable Long businessClientId
    );

    @GetMapping("/api/shipments/analytics/range")
    List<ShipmentAnalyticsDataResponse> getAllShipmentsForAnalyticsByDateRange(

            @RequestParam("startDate")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime startDate,

            @RequestParam("endDate")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime endDate
    );


    @GetMapping("/api/shipments/analytics/business/{businessClientId}/shipments/range")
    List<ShipmentAnalyticsDataResponse> getBusinessShipmentsForAnalyticsByDateRange(

            @PathVariable("businessClientId")
            Long businessClientId,

            @RequestParam("startDate")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime startDate,

            @RequestParam("endDate")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime endDate
    );

    @GetMapping("/api/shipments/analytics/customer/{customerId}/shipments/range")
    List<ShipmentAnalyticsDataResponse> getCustomerShipmentsForAnalyticsByDateRange(

            @PathVariable("customerId")
            Long customerId,

            @RequestParam("startDate")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime startDate,

            @RequestParam("endDate")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime endDate
    );

    @GetMapping("/api/shipments/analytics/driver/{driverId}/shipments/range")
    List<ShipmentAnalyticsDataResponse> getDriverShipmentsForAnalyticsByDateRange(

            @PathVariable("driverId")
            Long driverId,

            @RequestParam("startDate")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime startDate,

            @RequestParam("endDate")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime endDate
    );
}