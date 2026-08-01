package com.shipment.analytics.service;


import com.shipment.analytics.dto.response.DashboardAnalyticsResponse;
import org.springframework.http.ResponseEntity;
import java.time.LocalDate;
public interface AnalyticsService {

//    DashboardAnalyticsResponse getAdminDashboard();
DashboardAnalyticsResponse getAdminDashboard(
        LocalDate startDate,
        LocalDate endDate
);

//    DashboardAnalyticsResponse getBusinessDashboard(Long businessClientId);
DashboardAnalyticsResponse getBusinessDashboard(
        Long businessClientId,
        LocalDate startDate,
        LocalDate endDate
);
//    ResponseEntity<byte[]> exportAdminDashboardPdf();
//    ResponseEntity<byte[]> exportBusinessDashboardPdf(Long businessClientId);

    ResponseEntity<byte[]> exportAdminDashboardPdf(
            LocalDate startDate,
            LocalDate endDate
    );

    ResponseEntity<byte[]> exportBusinessDashboardPdf(
            Long businessClientId,
            LocalDate startDate,
            LocalDate endDate
    );
}