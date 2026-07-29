package com.shipment.analytics.service;


import com.shipment.analytics.dto.response.DashboardAnalyticsResponse;
import org.springframework.http.ResponseEntity;

public interface AnalyticsService {

    DashboardAnalyticsResponse getAdminDashboard();

    DashboardAnalyticsResponse getBusinessDashboard(Long businessClientId);
    ResponseEntity<byte[]> exportAdminDashboardPdf();
    ResponseEntity<byte[]> exportBusinessDashboardPdf(Long businessClientId);
}