package com.shipment.analyticsreport.controller;


import com.shipment.analyticsreport.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.shipment.analyticsreport.dto.BusinessDashboardResponse;
import org.springframework.web.bind.annotation.PathVariable;
@RestController
@RequestMapping("/api/analytics/business")
@RequiredArgsConstructor
public class BusinessDashboardController {

    private final DashboardService dashboardService;

//    @GetMapping("/shipment-summary")
//    public ShipmentAnalyticsDto getShipmentSummary() {
//        return dashboardService.getShipmentAnalytics();
//    }

    @GetMapping("/dashboard/{businessClientId}")
    public BusinessDashboardResponse getBusinessDashboard(
            @PathVariable Long businessClientId
    ) {
        return dashboardService.getBusinessDashboard(
                businessClientId
        );
    }
}