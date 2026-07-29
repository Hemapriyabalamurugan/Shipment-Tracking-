package com.shipment.analytics.controller;

import com.shipment.analytics.dto.response.DashboardAnalyticsResponse;
import com.shipment.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/admin/dashboard")
    public DashboardAnalyticsResponse getAdminDashboard() {
        return analyticsService.getAdminDashboard();
    }

    @GetMapping("/business/{businessClientId}/dashboard")
    public DashboardAnalyticsResponse getBusinessDashboard(
            @PathVariable Long businessClientId
    ) {
        return analyticsService.getBusinessDashboard(businessClientId);
    }

    @GetMapping("/admin/dashboard/pdf")
    public ResponseEntity<byte[]> exportAdminDashboardPdf() {
        return analyticsService.exportAdminDashboardPdf();
    }

    @GetMapping("/business/{businessClientId}/dashboard/pdf")
    public ResponseEntity<byte[]> exportBusinessDashboardPdf(
            @PathVariable Long businessClientId
    ) {
        return analyticsService.exportBusinessDashboardPdf(
                businessClientId
        );
    }
}