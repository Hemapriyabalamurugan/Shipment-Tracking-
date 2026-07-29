package com.shipment.analytics.service.impl;

import com.shipment.analytics.client.ShipmentClient;
import com.shipment.analytics.dto.response.*;
import com.shipment.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.shipment.analytics.dto.response.OnTimePerformanceResponse;

import java.time.Month;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

import java.time.Duration;
import java.util.Comparator;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;

import java.io.ByteArrayOutputStream;
@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final ShipmentClient shipmentClient;

    @Override
    public DashboardAnalyticsResponse getAdminDashboard() {

        List<ShipmentAnalyticsDataResponse> shipments =
                shipmentClient.getAllShipmentsForAnalytics();
        System.out.println("Shipments received: " + shipments);
        System.out.println("Admin shipment count = " + shipments.size());
        return DashboardAnalyticsResponse.builder()
                .volumeByMonth(getVolumeByMonth(shipments))
                .averageDeliveryTime(getAverageDeliveryTime(shipments))
                .deliveryActivity24h(getDeliveryActivity24h(shipments))
                .onTimePerformance(getOnTimePerformance(shipments))
                .build();
    }

    @Override
    public DashboardAnalyticsResponse getBusinessDashboard(Long businessClientId) {

        List<ShipmentAnalyticsDataResponse> shipments =
                shipmentClient.getBusinessShipmentsForAnalytics(
                        businessClientId
                );

        return DashboardAnalyticsResponse.builder()
                .volumeByMonth(getVolumeByMonth(shipments))
                .averageDeliveryTime(getAverageDeliveryTime(shipments))
                .deliveryActivity24h(getDeliveryActivity24h(shipments))
                .onTimePerformance(getOnTimePerformance(shipments))
                .build();
    }

    private List<VolumeByMonthResponse> getVolumeByMonth(
            List<ShipmentAnalyticsDataResponse> shipments
    ) {

        Map<Month, List<ShipmentAnalyticsDataResponse>> grouped =
                shipments.stream()
                        .collect(Collectors.groupingBy(
                                shipment -> shipment.getCreatedAt().getMonth(),
                                TreeMap::new,
                                Collectors.toList()
                        ));

        return grouped.entrySet()
                .stream()
                .map(entry -> {

                    long delivered =
                            entry.getValue()
                                    .stream()
                                    .filter(s -> "DELIVERED".equals(s.getStatus()))
                                    .count();

                    return VolumeByMonthResponse.builder()
                            .month(entry.getKey()
                                    .getDisplayName(TextStyle.SHORT, Locale.ENGLISH))
                            .shipments((long) entry.getValue().size())
                            .delivered(delivered)
                            .build();
                })
                .toList();
    }


    private List<AverageDeliveryTimeResponse> getAverageDeliveryTime(
            List<ShipmentAnalyticsDataResponse> shipments
    ) {

        Map<Month, List<ShipmentAnalyticsDataResponse>> grouped =
                shipments.stream()
                        .filter(s -> s.getPickedUpAt() != null)
                        .filter(s -> s.getDeliveredAt() != null)
                        .collect(Collectors.groupingBy(
                                s -> s.getDeliveredAt().getMonth()
                        ));

        return grouped.entrySet()
                .stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> {

                    double avgDays = entry.getValue()
                            .stream()
                            .mapToLong(s ->
                                    Duration.between(
                                            s.getPickedUpAt(),
                                            s.getDeliveredAt()
                                    ).toHours()
                            )
                            .average()
                            .orElse(0) / 24.0;

                    return AverageDeliveryTimeResponse.builder()
                            .month(entry.getKey().getDisplayName(
                                    TextStyle.SHORT,
                                    Locale.ENGLISH
                            ))
                            .avgDays(Math.round(avgDays * 10.0) / 10.0)
                            .build();
                })
                .toList();
    }

    private List<DeliveryActivity24hResponse> getDeliveryActivity24h(
            List<ShipmentAnalyticsDataResponse> shipments
    ) {

        return java.util.stream.IntStream.range(0, 24)
                .mapToObj(hour -> {

                    long pickups = shipments.stream()
                            .filter(s -> s.getPickedUpAt() != null)
                            .filter(s -> s.getPickedUpAt().getHour() == hour)
                            .count();

                    long deliveries = shipments.stream()
                            .filter(s -> s.getDeliveredAt() != null)
                            .filter(s -> s.getDeliveredAt().getHour() == hour)
                            .count();
                    System.out.println("Shipments for activity: " + shipments.size());
                    return DeliveryActivity24hResponse.builder()
                            .hour(hour)
                            .pickups(pickups)
                            .deliveries(deliveries)
                            .build();
                })
                .peek(item -> System.out.println(item))
                .toList();
    }

    private List<OnTimePerformanceResponse> getOnTimePerformance(
            List<ShipmentAnalyticsDataResponse> shipments
    ) {

        long totalDelivered = shipments.stream()
                .filter(s -> s.getDeliveredAt() != null)
                .count();

        long onTime = shipments.stream()
                .filter(s -> s.getDeliveredAt() != null)
                .filter(s -> s.getEstimatedDeliveryAt() != null)
                .filter(s -> !s.getDeliveredAt().isAfter(s.getEstimatedDeliveryAt()))
                .count();

        double rate = totalDelivered == 0
                ? 0
                : (onTime * 100.0) / totalDelivered;

        return List.of(
                OnTimePerformanceResponse.builder()
                        .week("W1")
                        .rate(Math.round(rate * 10.0) / 10.0)
                        .build()
        );
    }


    @Override
    public ResponseEntity<byte[]> exportAdminDashboardPdf() {

        List<ShipmentAnalyticsDataResponse> shipments =
                shipmentClient.getAllShipmentsForAnalytics();

        DashboardAnalyticsResponse dashboard =
                getAdminDashboard();

        try {

            ByteArrayOutputStream out = new ByteArrayOutputStream();

            Document document = new Document();

            PdfWriter.getInstance(document, out);

            document.open();

            document.add(new Paragraph("Shipment Analytics Report"));
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Total Shipments : " + shipments.size()));

            document.add(new Paragraph(
                    "Delivered : " +
                            shipments.stream()
                                    .filter(s -> "DELIVERED".equals(s.getStatus()))
                                    .count()
            ));

            document.add(new Paragraph(
                    "Average Delivery Records : "
                            + dashboard.getAverageDeliveryTime().size()
            ));

            document.add(new Paragraph(
                    "On-Time Performance : "
                            + dashboard.getOnTimePerformance().get(0).getRate()
                            + "%"
            ));

            document.close();

            return ResponseEntity.ok()
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=analytics-report.pdf"
                    )
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(out.toByteArray());

        } catch (DocumentException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public ResponseEntity<byte[]> exportBusinessDashboardPdf(
            Long businessClientId
    ) {

        List<ShipmentAnalyticsDataResponse> shipments =
                shipmentClient.getBusinessShipmentsForAnalytics(
                        businessClientId
                );

        DashboardAnalyticsResponse dashboard =
                getBusinessDashboard(businessClientId);

        try {

            ByteArrayOutputStream out = new ByteArrayOutputStream();

            Document document = new Document();

            PdfWriter.getInstance(document, out);

            document.open();

            document.add(new Paragraph("Business Shipment Analytics Report"));
            document.add(new Paragraph(" "));

            document.add(new Paragraph(
                    "Total Shipments : " + shipments.size()
            ));

            document.add(new Paragraph(
                    "Delivered : " +
                            shipments.stream()
                                    .filter(s -> "DELIVERED".equals(s.getStatus()))
                                    .count()
            ));

            document.add(new Paragraph(
                    "Average Delivery Records : "
                            + dashboard.getAverageDeliveryTime().size()
            ));

            document.add(new Paragraph(
                    "On-Time Performance : "
                            + dashboard.getOnTimePerformance().get(0).getRate()
                            + "%"
            ));

            document.close();

            return ResponseEntity.ok()
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=business-analytics-report.pdf"
                    )
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(out.toByteArray());

        } catch (DocumentException e) {
            throw new RuntimeException(e);
        }
    }
}