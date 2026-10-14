package com.shipment.deliveryreports.service;

import com.shipment.deliveryreports.dto.response.DeliveryReportResponse;
import org.springframework.http.ResponseEntity;

public interface DeliveryReportService {

    DeliveryReportResponse getWeeklyReport();

    DeliveryReportResponse getMonthlyReport();

    DeliveryReportResponse getYearlyReport();

    ResponseEntity<byte[]> exportWeeklyPdf();

    ResponseEntity<byte[]> exportMonthlyPdf();

    ResponseEntity<byte[]> exportYearlyPdf();
}
