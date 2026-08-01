package com.shipment.analytics.controller;

import com.shipment.analytics.dto.response.DashboardAnalyticsResponse;
import com.shipment.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

//    @GetMapping("/admin/dashboard")
//    public DashboardAnalyticsResponse getAdminDashboard() {
//        return analyticsService.getAdminDashboard();
//    }

    @GetMapping("/admin/dashboard")
    public DashboardAnalyticsResponse getAdminDashboard(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate
    ) {
        return analyticsService.getAdminDashboard(
                startDate,
                endDate
        );
    }

//    @GetMapping("/business/{businessClientId}/dashboard")
//    public DashboardAnalyticsResponse getBusinessDashboard(
//            @PathVariable Long businessClientId
//    ) {
//        return analyticsService.getBusinessDashboard(businessClientId);
//    }

    @GetMapping("/business/{businessClientId}/dashboard")
    public DashboardAnalyticsResponse getBusinessDashboard(
            @PathVariable Long businessClientId,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate
    ) {
        return analyticsService.getBusinessDashboard(
                businessClientId,
                startDate,
                endDate
        );
    }

//    @GetMapping("/admin/dashboard/pdf")
//    public ResponseEntity<byte[]> exportAdminDashboardPdf() {
//        return analyticsService.exportAdminDashboardPdf();
//    }
@GetMapping("/admin/dashboard/pdf")
public ResponseEntity<byte[]> exportAdminDashboardPdf(
        @RequestParam
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate startDate,

        @RequestParam
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate endDate
) {
    return analyticsService.exportAdminDashboardPdf(
            startDate,
            endDate
    );
}

//    @GetMapping("/business/{businessClientId}/dashboard/pdf")
//    public ResponseEntity<byte[]> exportBusinessDashboardPdf(
//            @PathVariable Long businessClientId
//    ) {
//        return analyticsService.exportBusinessDashboardPdf(
//                businessClientId
//        );
//    }
@GetMapping("/business/{businessClientId}/dashboard/pdf")
public ResponseEntity<byte[]> exportBusinessDashboardPdf(
        @PathVariable Long businessClientId,

        @RequestParam
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate startDate,

        @RequestParam
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate endDate
) {
    return analyticsService.exportBusinessDashboardPdf(
            businessClientId,
            startDate,
            endDate
    );
}
}