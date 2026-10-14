package com.shipment.deliveryreports.controller;

import com.shipment.deliveryreports.dto.response.DeliveryReportResponse;
import com.shipment.deliveryreports.service.DeliveryReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/delivery-reports")
@RequiredArgsConstructor
public class DeliveryReportController {

    private final DeliveryReportService deliveryReportService;

    @GetMapping("/week")
    public ResponseEntity<DeliveryReportResponse> getWeeklyReport() {
        return ResponseEntity.ok(deliveryReportService.getWeeklyReport());
    }

    @GetMapping("/month")
    public ResponseEntity<DeliveryReportResponse> getMonthlyReport() {
        return ResponseEntity.ok(deliveryReportService.getMonthlyReport());
    }

    @GetMapping("/year")
    public ResponseEntity<DeliveryReportResponse> getYearlyReport() {
        return ResponseEntity.ok(deliveryReportService.getYearlyReport());
    }

    @GetMapping("/week/pdf")
    public ResponseEntity<byte[]> exportWeeklyPdf() {
        return deliveryReportService.exportWeeklyPdf();
    }

    @GetMapping("/month/pdf")
    public ResponseEntity<byte[]> exportMonthlyPdf() {
        return deliveryReportService.exportMonthlyPdf();
    }

    @GetMapping("/year/pdf")
    public ResponseEntity<byte[]> exportYearlyPdf() {
        return deliveryReportService.exportYearlyPdf();
    }
}
