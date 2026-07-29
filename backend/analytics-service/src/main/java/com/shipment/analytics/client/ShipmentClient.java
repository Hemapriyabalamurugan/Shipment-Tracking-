package com.shipment.analytics.client;

import com.shipment.analytics.dto.response.ShipmentAnalyticsDataResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "SHIPMENTMANAGEMENT-SERVICE")
public interface ShipmentClient {

    @GetMapping("/api/shipments/analytics")
    List<ShipmentAnalyticsDataResponse> getAllShipmentsForAnalytics();

    @GetMapping("/api/shipments/analytics/business/{businessClientId}/shipments")
    List<ShipmentAnalyticsDataResponse> getBusinessShipmentsForAnalytics(
            @PathVariable Long businessClientId
    );
}