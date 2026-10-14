package com.shipment.delivery.controller;

import com.shipment.delivery.dto.DashboardResponse;
import com.shipment.delivery.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/shipment/{shipmentId}/driver/{driverId}")
    public ResponseEntity<DashboardResponse> getDashboard(
            @PathVariable Long shipmentId,
            @PathVariable Long driverId) {

        DashboardResponse response =
                dashboardService.getShipmentDashboard(
                        shipmentId,
                        driverId
                );

        return ResponseEntity.ok(response);
    }
}