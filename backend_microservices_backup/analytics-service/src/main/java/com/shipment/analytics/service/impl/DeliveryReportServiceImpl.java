package com.shipment.analytics.service.impl;

import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.shipment.analytics.client.AuthClient;
import com.shipment.analytics.client.ShipmentClient;
import com.shipment.analytics.dto.response.*;
import com.shipment.analytics.service.DeliveryReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeliveryReportServiceImpl implements DeliveryReportService {

    private final ShipmentClient shipmentClient;
    private final AuthClient authClient;

    @Override
    public DeliveryReportResponse getWeeklyReport() {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(6);
        return buildReport("WEEKLY", startDate, endDate);
    }

    @Override
    public DeliveryReportResponse getMonthlyReport() {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.withDayOfMonth(1);
        return buildReport("MONTHLY", startDate, endDate);
    }

    @Override
    public DeliveryReportResponse getYearlyReport() {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.withDayOfYear(1);
        return buildReport("YEARLY", startDate, endDate);
    }

    @Override
    public ResponseEntity<byte[]> exportWeeklyPdf() {
        DeliveryReportResponse report = getWeeklyReport();
        byte[] pdf = generatePdf(report);
        return createPdfResponse(pdf, "delivery-report-weekly.pdf");
    }

    @Override
    public ResponseEntity<byte[]> exportMonthlyPdf() {
        DeliveryReportResponse report = getMonthlyReport();
        byte[] pdf = generatePdf(report);
        return createPdfResponse(pdf, "delivery-report-monthly.pdf");
    }

    @Override
    public ResponseEntity<byte[]> exportYearlyPdf() {
        DeliveryReportResponse report = getYearlyReport();
        byte[] pdf = generatePdf(report);
        return createPdfResponse(pdf, "delivery-report-yearly.pdf");
    }

    private DeliveryReportResponse buildReport(String period, LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59, 999999999);

        UserProfileResponse currentUser = null;
        try {
            currentUser = authClient.getCurrentUser();
        } catch (Exception e) {
            // Log or fallback if auth client fails
        }

        String role = currentUser != null && currentUser.getRole() != null ? currentUser.getRole().toUpperCase() : "ADMIN";
        Long userId = currentUser != null ? currentUser.getId() : null;

        List<ShipmentAnalyticsDataResponse> shipments = fetchShipmentsForUser(role, userId, startDateTime, endDateTime);

        long totalShipments = shipments.size();

        long delivered = shipments.stream()
                .filter(s -> "DELIVERED".equalsIgnoreCase(s.getStatus()))
                .count();

        long inTransit = shipments.stream()
                .filter(s -> "IN_TRANSIT".equalsIgnoreCase(s.getStatus()) || "PICKED_UP".equalsIgnoreCase(s.getStatus()))
                .count();

        long outForDelivery = shipments.stream()
                .filter(s -> "OUT_FOR_DELIVERY".equalsIgnoreCase(s.getStatus()))
                .count();

        long failed = shipments.stream()
                .filter(s -> "FAILED_DELIVERY".equalsIgnoreCase(s.getStatus()))
                .count();

        long cancelled = shipments.stream()
                .filter(s -> "CANCELLED".equalsIgnoreCase(s.getStatus()))
                .count();

        long pending = shipments.stream()
                .filter(s -> "CREATED".equalsIgnoreCase(s.getStatus()))
                .count();

        long attempts = delivered + failed;
        double successRate = attempts == 0 ? 0.0 : Math.round((delivered * 100.0 / attempts) * 10.0) / 10.0;

        long onTimeCount = shipments.stream()
                .filter(s -> "DELIVERED".equalsIgnoreCase(s.getStatus()))
                .filter(s -> s.getDeliveredAt() != null && s.getEstimatedDeliveryAt() != null)
                .filter(s -> !s.getDeliveredAt().isAfter(s.getEstimatedDeliveryAt()))
                .count();

        double onTimeRate = delivered == 0 ? 0.0 : Math.round((onTimeCount * 100.0 / delivered) * 10.0) / 10.0;

        double avgMinutes = shipments.stream()
                .filter(s -> "DELIVERED".equalsIgnoreCase(s.getStatus()))
                .filter(s -> s.getPickedUpAt() != null && s.getDeliveredAt() != null)
                .mapToLong(s -> Duration.between(s.getPickedUpAt(), s.getDeliveredAt()).toMinutes())
                .filter(m -> m >= 0)
                .average()
                .orElse(0.0);

        List<ShipmentStatusResponse> statusDistribution = List.of(
                ShipmentStatusResponse.builder().status("DELIVERED").count(delivered).build(),
                ShipmentStatusResponse.builder().status("IN_TRANSIT").count(inTransit).build(),
                ShipmentStatusResponse.builder().status("OUT_FOR_DELIVERY").count(outForDelivery).build(),
                ShipmentStatusResponse.builder().status("FAILED_DELIVERY").count(failed).build(),
                ShipmentStatusResponse.builder().status("CANCELLED").count(cancelled).build(),
                ShipmentStatusResponse.builder().status("PENDING").count(pending).build()
        );

        List<TopRouteResponse> topRoutes = shipments.stream()
                .filter(s -> s.getOriginCity() != null && !s.getOriginCity().isBlank()
                        && s.getDestinationCity() != null && !s.getDestinationCity().isBlank())
                .collect(Collectors.groupingBy(
                        s -> s.getOriginCity().trim() + " -> " + s.getDestinationCity().trim(),
                        Collectors.counting()
                ))
                .entrySet().stream()
                .map(entry -> {
                    String[] route = entry.getKey().split(" -> ", 2);
                    return TopRouteResponse.builder()
                            .origin(route[0])
                            .destination(route[1])
                            .shipments(entry.getValue())
                            .build();
                })
                .sorted(Comparator.comparingLong(TopRouteResponse::getShipments).reversed())
                .limit(5)
                .toList();

        List<DeliveryVolumeTrendResponse> trendData = buildTrendData(shipments, startDate, endDate);

        return DeliveryReportResponse.builder()
                .period(period)
                .startDate(startDate)
                .endDate(endDate)
                .userRole(role)
                .totalShipments(totalShipments)
                .deliveredShipments(delivered)
                .inTransitShipments(inTransit)
                .outForDeliveryShipments(outForDelivery)
                .failedDeliveries(failed)
                .cancelledShipments(cancelled)
                .pendingShipments(pending)
                .deliverySuccessRate(successRate)
                .onTimeDeliveryRate(onTimeRate)
                .averageDeliveryTimeMinutes(Math.round(avgMinutes))
                .statusDistribution(statusDistribution)
                .topRoutes(topRoutes)
                .dailyVolumeTrend(trendData)
                .build();
    }

    private List<ShipmentAnalyticsDataResponse> fetchShipmentsForUser(String role, Long userId, LocalDateTime startDateTime, LocalDateTime endDateTime) {
        if (userId != null) {
            if ("CUSTOMER".equalsIgnoreCase(role)) {
                return shipmentClient.getCustomerShipmentsForAnalyticsByDateRange(userId, startDateTime, endDateTime);
            } else if ("BUSINESS_CLIENT".equalsIgnoreCase(role)) {
                return shipmentClient.getBusinessShipmentsForAnalyticsByDateRange(userId, startDateTime, endDateTime);
            } else if ("LOGISTICS_OPERATOR".equalsIgnoreCase(role)) {
                return shipmentClient.getDriverShipmentsForAnalyticsByDateRange(userId, startDateTime, endDateTime);
            }
        }
        return shipmentClient.getAllShipmentsForAnalyticsByDateRange(startDateTime, endDateTime);
    }

    private List<DeliveryVolumeTrendResponse> buildTrendData(List<ShipmentAnalyticsDataResponse> shipments, LocalDate startDate, LocalDate endDate) {
        Map<String, Long> volumeMap = shipments.stream()
                .filter(s -> s.getCreatedAt() != null)
                .collect(Collectors.groupingBy(
                        s -> s.getCreatedAt().toLocalDate().toString(),
                        Collectors.counting()
                ));

        Map<String, Long> deliveredMap = shipments.stream()
                .filter(s -> "DELIVERED".equalsIgnoreCase(s.getStatus()) && s.getDeliveredAt() != null)
                .collect(Collectors.groupingBy(
                        s -> s.getDeliveredAt().toLocalDate().toString(),
                        Collectors.counting()
                ));

        List<DeliveryVolumeTrendResponse> list = new ArrayList<>();
        LocalDate curr = startDate;
        while (!curr.isAfter(endDate)) {
            String dateKey = curr.toString();
            list.add(DeliveryVolumeTrendResponse.builder()
                    .date(curr)
                    .volume(volumeMap.getOrDefault(dateKey, 0L))
                    .delivered(deliveredMap.getOrDefault(dateKey, 0L))
                    .shipments(volumeMap.getOrDefault(dateKey, 0L))
                    .build());
            curr = curr.plusDays(1);
        }
        return list;
    }

    private byte[] generatePdf(DeliveryReportResponse report) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 36, 36, 36, 36);
            PdfWriter.getInstance(document, out);

            document.open();

            // Colors
            Color primaryColor = new Color(30, 41, 59);
            Color accentColor = new Color(37, 99, 235);
            Color tableHeaderBg = new Color(241, 245, 249);

            // Header Title
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, primaryColor);
            Paragraph title = new Paragraph("SHIPTRACKPRO - DELIVERY REPORT", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            // Subtitle / Period info
            Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA, 11, Color.GRAY);
            Paragraph sub = new Paragraph("Report Period: " + report.getPeriod() + " (" + report.getStartDate() + " to " + report.getEndDate() + ") | Role: " + report.getUserRole(), subTitleFont);
            sub.setAlignment(Element.ALIGN_CENTER);
            sub.setSpacingAfter(20);
            document.add(sub);

            // Overview Section Header
            Font secFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, accentColor);
            Paragraph sec1 = new Paragraph("1. Key Performance Summary", secFont);
            sec1.setSpacingAfter(10);
            document.add(sec1);

            // Overview Table
            PdfPTable overviewTable = new PdfPTable(2);
            overviewTable.setWidthPercentage(100);

            addTableCell(overviewTable, "Total Shipments", String.valueOf(report.getTotalShipments()), tableHeaderBg);
            addTableCell(overviewTable, "Delivered Shipments", String.valueOf(report.getDeliveredShipments()), tableHeaderBg);
            addTableCell(overviewTable, "In-Transit Shipments", String.valueOf(report.getInTransitShipments()), tableHeaderBg);
            addTableCell(overviewTable, "Out for Delivery", String.valueOf(report.getOutForDeliveryShipments()), tableHeaderBg);
            addTableCell(overviewTable, "Failed Deliveries", String.valueOf(report.getFailedDeliveries()), tableHeaderBg);
            addTableCell(overviewTable, "Cancelled Shipments", String.valueOf(report.getCancelledShipments()), tableHeaderBg);
            addTableCell(overviewTable, "Delivery Success Rate", report.getDeliverySuccessRate() + "%", tableHeaderBg);
            addTableCell(overviewTable, "On-Time Delivery Rate", report.getOnTimeDeliveryRate() + "%", tableHeaderBg);
            addTableCell(overviewTable, "Avg Delivery Duration", report.getAverageDeliveryTimeMinutes() + " mins", tableHeaderBg);

            document.add(overviewTable);
            document.add(new Paragraph(" "));

            // Status Distribution Section Header
            Paragraph sec2 = new Paragraph("2. Status Breakdown", secFont);
            sec2.setSpacingAfter(10);
            document.add(sec2);

            PdfPTable statusTable = new PdfPTable(2);
            statusTable.setWidthPercentage(100);

            PdfPCell h1 = new PdfPCell(new Phrase("Status", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11)));
            h1.setBackgroundColor(tableHeaderBg);
            PdfPCell h2 = new PdfPCell(new Phrase("Count", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11)));
            h2.setBackgroundColor(tableHeaderBg);
            statusTable.addCell(h1);
            statusTable.addCell(h2);

            for (ShipmentStatusResponse item : report.getStatusDistribution()) {
                statusTable.addCell(new Phrase(item.getStatus(), FontFactory.getFont(FontFactory.HELVETICA, 10)));
                statusTable.addCell(new Phrase(String.valueOf(item.getCount()), FontFactory.getFont(FontFactory.HELVETICA, 10)));
            }

            document.add(statusTable);
            document.add(new Paragraph(" "));

            // Top Routes Section Header
            if (report.getTopRoutes() != null && !report.getTopRoutes().isEmpty()) {
                Paragraph sec3 = new Paragraph("3. Top Delivery Routes", secFont);
                sec3.setSpacingAfter(10);
                document.add(sec3);

                PdfPTable routeTable = new PdfPTable(3);
                routeTable.setWidthPercentage(100);

                PdfPCell r1 = new PdfPCell(new Phrase("Origin", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11)));
                r1.setBackgroundColor(tableHeaderBg);
                PdfPCell r2 = new PdfPCell(new Phrase("Destination", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11)));
                r2.setBackgroundColor(tableHeaderBg);
                PdfPCell r3 = new PdfPCell(new Phrase("Shipment Count", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11)));
                r3.setBackgroundColor(tableHeaderBg);

                routeTable.addCell(r1);
                routeTable.addCell(r2);
                routeTable.addCell(r3);

                for (TopRouteResponse route : report.getTopRoutes()) {
                    routeTable.addCell(new Phrase(route.getOrigin(), FontFactory.getFont(FontFactory.HELVETICA, 10)));
                    routeTable.addCell(new Phrase(route.getDestination(), FontFactory.getFont(FontFactory.HELVETICA, 10)));
                    routeTable.addCell(new Phrase(String.valueOf(route.getShipments()), FontFactory.getFont(FontFactory.HELVETICA, 10)));
                }

                document.add(routeTable);
            }

            // Footer Timestamp
            Font footerFont = FontFactory.getFont(FontFactory.HELVETICA, 9, Font.ITALIC, Color.GRAY);
            Paragraph footer = new Paragraph("\nGenerated by ShipTrackPro Delivery Reports Engine at " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")), footerFont);
            footer.setAlignment(Element.ALIGN_RIGHT);
            document.add(footer);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating Delivery Report PDF", e);
        }
    }

    private void addTableCell(PdfPTable table, String label, String value, Color headerBg) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10)));
        labelCell.setBackgroundColor(headerBg);
        labelCell.setPadding(6);

        PdfPCell valCell = new PdfPCell(new Phrase(value, FontFactory.getFont(FontFactory.HELVETICA, 10)));
        valCell.setPadding(6);

        table.addCell(labelCell);
        table.addCell(valCell);
    }

    private ResponseEntity<byte[]> createPdfResponse(byte[] pdfBytes, String filename) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
