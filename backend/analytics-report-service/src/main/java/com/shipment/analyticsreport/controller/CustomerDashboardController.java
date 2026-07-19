package com.shipment.analyticsreport.controller;

import com.shipment.analyticsreport.dto.CustomerDashboardResponse;
import com.shipment.analyticsreport.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics/customer")
@RequiredArgsConstructor
public class CustomerDashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/dashboard/{customerId}")
    public CustomerDashboardResponse getDashboard(
            @PathVariable Long customerId
    ) {
        return dashboardService.getCustomerDashboard(customerId);
    }
}