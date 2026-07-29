package com.shipment.pod.client;

import com.shipment.pod.dto.ShipmentAnalyticsDataResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "SHIPMENTMANAGEMENT-SERVICE")
public interface ShipmentClient {

    @GetMapping("/api/shipments/analytics/{shipmentId}")
    ShipmentAnalyticsDataResponse getShipmentForVerification(
            @PathVariable Long shipmentId
    );
}