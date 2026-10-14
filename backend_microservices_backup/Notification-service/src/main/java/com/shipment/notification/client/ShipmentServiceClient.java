package com.shipment.notification.client;

import com.shipment.notification.dto.ShipmentResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "SHIPMENTMANAGEMENT-SERVICE")
public interface ShipmentServiceClient {

//    @GetMapping("/api/shipments/{id}")
//    ShipmentResponse getShipment(
//            @PathVariable Long id
//    );
@GetMapping("/api/shipments/internal/{id}")
ShipmentResponse getShipment(
        @PathVariable Long id
);
}