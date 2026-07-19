package com.shipment.analyticsreport.controller;

import com.shipment.analyticsreport.dto.AdminDashboardResponse;
import com.shipment.analyticsreport.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/analytics/admin")
public class AdminDashboardController {

    private final DashboardService dashboardService;

//    @GetMapping("/api/analytics/admin/dashboard")
//    public AdminDashboardResponse getAdminDashboard() {
//
//        return dashboardService.getAdminDashboard();
//    }
@GetMapping("/dashboard")
public AdminDashboardResponse getAdminDashboard() {
    return dashboardService.getAdminDashboard();
}
}