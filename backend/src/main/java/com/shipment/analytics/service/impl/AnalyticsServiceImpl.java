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
import java.time.LocalDate;

import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final ShipmentClient shipmentClient;

//    @Override
//    public DashboardAnalyticsResponse getAdminDashboard() {
//
//        List<ShipmentAnalyticsDataResponse> shipments =
//                shipmentClient.getAllShipmentsForAnalytics();

    @Override
    public DashboardAnalyticsResponse getAdminDashboard(
            LocalDate startDate,
            LocalDate endDate
    ) {

        validateDateRange(startDate, endDate);

        LocalDateTime startDateTime =
                startDate.atStartOfDay();

        LocalDateTime endDateTime =
                endDate.atTime(
                        23,
                        59,
                        59,
                        999999999
                );

        List<ShipmentAnalyticsDataResponse> shipments =
                shipmentClient.getAllShipmentsForAnalyticsByDateRange(
                        startDateTime,
                        endDateTime
                );

        return DashboardAnalyticsResponse.builder()
                .overview(getOverview(shipments))
                .deliveryActivity24h(getDeliveryActivity24h(shipments))
                .deliveryPerformance(getDeliveryPerformance(shipments))
                .shipmentStatus(getShipmentStatus(shipments))
                .topRoutes(getTopRoutes(shipments))
                .deliveryVolumeTrend(getDeliveryVolumeTrend(shipments))
                .build();
    }
//        System.out.println("Shipments received: " + shipments);
//        System.out.println("Admin shipment count = " + shipments.size());
//        return DashboardAnalyticsResponse.builder()
//                .volumeByMonth(getVolumeByMonth(shipments))
//                .averageDeliveryTime(getAverageDeliveryTime(shipments))
//                .deliveryActivity24h(getDeliveryActivity24h(shipments))
//                .onTimePerformance(getOnTimePerformance(shipments))
//                .build();
//        return DashboardAnalyticsResponse.builder()
//                .overview(getOverview(shipments))
//                .deliveryActivity24h(getDeliveryActivity24h(shipments))
//                .deliveryPerformance(getDeliveryPerformance(shipments))
//                .shipmentStatus(getShipmentStatus(shipments))
//                .topRoutes(getTopRoutes(shipments))
////                .deliveryVolumeTrend(getVolumeByMonth(shipments))
//                .deliveryVolumeTrend(getDeliveryVolumeTrend(shipments))
//                .build();


//    @Override
//    public DashboardAnalyticsResponse getBusinessDashboard(Long businessClientId) {
//
//        List<ShipmentAnalyticsDataResponse> shipments =
//                shipmentClient.getBusinessShipmentsForAnalytics(
//                        businessClientId
//                );
//
////        return DashboardAnalyticsResponse.builder()
////                .volumeByMonth(getVolumeByMonth(shipments))
////                .averageDeliveryTime(getAverageDeliveryTime(shipments))
////                .deliveryActivity24h(getDeliveryActivity24h(shipments))
////                .onTimePerformance(getOnTimePerformance(shipments))
////                .build();
//
//        return DashboardAnalyticsResponse.builder()
//                .overview(getOverview(shipments))
//                .deliveryActivity24h(getDeliveryActivity24h(shipments))
//                .deliveryPerformance(getDeliveryPerformance(shipments))
//                .shipmentStatus(getShipmentStatus(shipments))
//                .topRoutes(getTopRoutes(shipments))
////                .deliveryVolumeTrend(getVolumeByMonth(shipments))
//                .deliveryVolumeTrend(getDeliveryVolumeTrend(shipments))
//                .build();
//    }

@Override
public DashboardAnalyticsResponse getBusinessDashboard(
        Long businessClientId,
        LocalDate startDate,
        LocalDate endDate
) {

    validateDateRange(startDate, endDate);

    LocalDateTime startDateTime =
            startDate.atStartOfDay();

    LocalDateTime endDateTime =
            endDate.atTime(
                    23,
                    59,
                    59,
                    999999999
            );

    List<ShipmentAnalyticsDataResponse> shipments =
            shipmentClient.getBusinessShipmentsForAnalyticsByDateRange(
                    businessClientId,
                    startDateTime,
                    endDateTime
            );

    return DashboardAnalyticsResponse.builder()
            .overview(getOverview(shipments))
            .deliveryActivity24h(getDeliveryActivity24h(shipments))
            .deliveryPerformance(getDeliveryPerformance(shipments))
            .shipmentStatus(getShipmentStatus(shipments))
            .topRoutes(getTopRoutes(shipments))
            .deliveryVolumeTrend(getDeliveryVolumeTrend(shipments))
            .build();
}

private void validateDateRange(
        LocalDate startDate,
        LocalDate endDate
) {

    if (startDate == null || endDate == null) {
        throw new IllegalArgumentException(
                "startDate and endDate are required"
        );
    }

    if (startDate.isAfter(endDate)) {
        throw new IllegalArgumentException(
                "startDate cannot be after endDate"
        );
    }
}


//
//    =========================================================================adding new thing

    private OverviewResponse getOverview(
            List<ShipmentAnalyticsDataResponse> shipments
    ) {

        long totalShipments = shipments.size();

        long delivered = shipments.stream()
                .filter(s -> "DELIVERED".equals(s.getStatus()))
                .count();

        long inTransit = shipments.stream()
                .filter(s ->
                        "IN_TRANSIT".equals(s.getStatus()) ||
                                "OUT_FOR_DELIVERY".equals(s.getStatus()) ||
                                "PICKED_UP".equals(s.getStatus())
                )
                .count();

        long failedDeliveries = shipments.stream()
                .filter(s -> "FAILED_DELIVERY".equals(s.getStatus()))
                .count();

//        long onTime = shipments.stream()
//                .filter(s -> s.getDeliveredAt() != null)
//                .filter(s -> s.getEstimatedDeliveryAt() != null)
//                .filter(s -> !s.getDeliveredAt().isAfter(s.getEstimatedDeliveryAt()))
//                .count();
        long onTime = shipments.stream()
                .filter(s -> "DELIVERED".equals(s.getStatus()))
                .filter(s -> s.getDeliveredAt() != null)
                .filter(s -> s.getEstimatedDeliveryAt() != null)
                .filter(s ->
                        !s.getDeliveredAt()
                                .isAfter(s.getEstimatedDeliveryAt())
                )
                .count();

        double onTimeRate = delivered == 0
                ? 0
                : (onTime * 100.0) / delivered;

        return OverviewResponse.builder()
                .totalShipments(totalShipments)
                .delivered(delivered)
                .inTransit(inTransit)
                .failedDeliveries(failedDeliveries)
                .onTimeRate(Math.round(onTimeRate * 10.0) / 10.0)
                .build();

    }


//        private DeliveryPerformanceResponse getDeliveryPerformance(
//                List<ShipmentAnalyticsDataResponse> shipments
//        ) {
//
//            long onTime = shipments.stream()
//                    .filter(s -> "DELIVERED".equals(s.getStatus()))
//                    .filter(s -> s.getDeliveredAt() != null)
//                    .filter(s -> s.getEstimatedDeliveryAt() != null)
//                    .filter(s -> !s.getDeliveredAt().isAfter(s.getEstimatedDeliveryAt()))
//                    .count();
//
//            long delayed = shipments.stream()
//                    .filter(s -> "DELIVERED".equals(s.getStatus()))
//                    .filter(s -> s.getDeliveredAt() != null)
//                    .filter(s -> s.getEstimatedDeliveryAt() != null)
//                    .filter(s -> s.getDeliveredAt().isAfter(s.getEstimatedDeliveryAt()))
//                    .count();
//
//            long failed = shipments.stream()
//                    .filter(s -> "FAILED_DELIVERY".equals(s.getStatus()))
//                    .count();
//
//            return DeliveryPerformanceResponse.builder()
//                    .onTime(onTime)
//                    .delayed(delayed)
//                    .failed(failed)
//                    .build();
//        }

    private DeliveryPerformanceResponse getDeliveryPerformance(
            List<ShipmentAnalyticsDataResponse> shipments
    ) {

        long onTime = shipments.stream()
                .filter(s -> "DELIVERED".equals(s.getStatus()))
                .filter(s -> s.getDeliveredAt() != null)
                .filter(s -> s.getEstimatedDeliveryAt() != null)
                .filter(s ->
                        !s.getDeliveredAt()
                                .isAfter(s.getEstimatedDeliveryAt())
                )
                .count();

        long delayed = shipments.stream()
                .filter(s -> "DELIVERED".equals(s.getStatus()))
                .filter(s -> s.getDeliveredAt() != null)
                .filter(s -> s.getEstimatedDeliveryAt() != null)
                .filter(s ->
                        s.getDeliveredAt()
                                .isAfter(s.getEstimatedDeliveryAt())
                )
                .count();

        long failed = shipments.stream()
                .filter(s -> "FAILED_DELIVERY".equals(s.getStatus()))
                .count();


        // Average time from actual pickup to actual delivery
        double averageMinutes = shipments.stream()
                .filter(s -> "DELIVERED".equals(s.getStatus()))
                .filter(s -> s.getPickedUpAt() != null)
                .filter(s -> s.getDeliveredAt() != null)
                .mapToLong(s ->
                        Duration.between(
                                s.getPickedUpAt(),
                                s.getDeliveredAt()
                        ).toMinutes()
                )
                .filter(minutes -> minutes >= 0)
                .average()
                .orElse(0);


        long averageDeliveryMinutes =
                Math.round(averageMinutes);


        /*
         * Delivery success rate:
         *
         * successful completed deliveries
         * -------------------------------- × 100
         * delivered + failed deliveries
         *
         * Active/pending shipments are not counted because their
         * delivery outcome is not known yet.
         */
        long completedDeliveries = onTime + delayed;

        long deliveryAttempts =
                completedDeliveries + failed;

        double successRate =
                deliveryAttempts == 0
                        ? 0
                        : (completedDeliveries * 100.0)
                          / deliveryAttempts;

        successRate =
                Math.round(successRate * 10.0) / 10.0;


        return DeliveryPerformanceResponse.builder()
                .onTime(onTime)
                .delayed(delayed)
                .failed(failed)
                .averageDeliveryMinutes(averageDeliveryMinutes)
                .successRate(successRate)
                .build();
    }





//    private List<ShipmentStatusResponse> getShipmentStatus(
//            List<ShipmentAnalyticsDataResponse> shipments
//    ) {
//
//        return shipments.stream()
//                .collect(Collectors.groupingBy(
//                        ShipmentAnalyticsDataResponse::getStatus,
//                        Collectors.counting()
//                ))
//                .entrySet()
//                .stream()
//                .map(entry -> ShipmentStatusResponse.builder()
//                        .status(entry.getKey())
//                        .count(entry.getValue())
//                        .build())
//                .sorted(Comparator.comparingLong(ShipmentStatusResponse::getCount).reversed())
//                .toList();
//    }
private List<ShipmentStatusResponse> getShipmentStatus(
        List<ShipmentAnalyticsDataResponse> shipments
) {

    long delivered = shipments.stream()
            .filter(s -> "DELIVERED".equals(s.getStatus()))
            .count();

    long inTransit = shipments.stream()
            .filter(s ->
                    "PICKED_UP".equals(s.getStatus()) ||
                            "IN_TRANSIT".equals(s.getStatus()) ||
                            "OUT_FOR_DELIVERY".equals(s.getStatus())
            )
            .count();

    long failed = shipments.stream()
            .filter(s ->
                    "FAILED_DELIVERY".equals(s.getStatus())
            )
            .count();

    long pending = shipments.stream()
            .filter(s ->
                    "CREATED".equals(s.getStatus())
            )
            .count();

    return List.of(
            ShipmentStatusResponse.builder()
                    .status("DELIVERED")
                    .count(delivered)
                    .build(),

            ShipmentStatusResponse.builder()
                    .status("IN_TRANSIT")
                    .count(inTransit)
                    .build(),

            ShipmentStatusResponse.builder()
                    .status("FAILED")
                    .count(failed)
                    .build(),

            ShipmentStatusResponse.builder()
                    .status("PENDING")
                    .count(pending)
                    .build()
    );
}

//    private List<TopRouteResponse> getTopRoutes(
//            List<ShipmentAnalyticsDataResponse> shipments
//    ) {
//
//        return shipments.stream()
//                .filter(s -> s.getOriginHub() != null && s.getDestinationHub() != null)
//                .collect(Collectors.groupingBy(
//                        s -> s.getOriginHub() + " -> " + s.getDestinationHub(),
//                        Collectors.counting()
//                ))
//                .entrySet()
//                .stream()
//                .map(entry -> {
//                    String[] route = entry.getKey().split(" -> ", 2);
//
//                    return TopRouteResponse.builder()
//                            .origin(route[0])
//                            .destination(route[1])
//                            .shipments(entry.getValue())
//                            .build();
//                })
//                .sorted(Comparator.comparingLong(TopRouteResponse::getShipments).reversed())
//                .limit(5)
//                .toList();
//    }

    private List<TopRouteResponse> getTopRoutes(
            List<ShipmentAnalyticsDataResponse> shipments
    ) {

        return shipments.stream()

                // Ignore shipments where route information is unavailable
                .filter(s ->
                        s.getOriginCity() != null &&
                                !s.getOriginCity().isBlank() &&
                                s.getDestinationCity() != null &&
                                !s.getDestinationCity().isBlank()
                )

                // Group shipments having the same origin → destination
                .collect(Collectors.groupingBy(
                        s -> s.getOriginCity().trim()
                                + " -> "
                                + s.getDestinationCity().trim(),
                        Collectors.counting()
                ))

                .entrySet()
                .stream()

                .map(entry -> {

                    String[] route =
                            entry.getKey().split(" -> ", 2);

                    return TopRouteResponse.builder()
                            .origin(route[0])
                            .destination(route[1])
                            .shipments(entry.getValue())
                            .build();
                })

                // Highest-volume routes first
                .sorted(
                        Comparator.comparingLong(
                                TopRouteResponse::getShipments
                        ).reversed()
                )

                // Target UI shows the top five routes
                .limit(5)

                .toList();
    }
//    ===========================================================================
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
//                    System.out.println("Shipments for activity: " + shipments.size());
                    return DeliveryActivity24hResponse.builder()
                            .hour(hour)
                            .pickups(pickups)
                            .deliveries(deliveries)
                            .build();
                })
//                .peek(item -> System.out.println(item))
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


//    @Override
//    public ResponseEntity<byte[]> exportAdminDashboardPdf() {
//
//        List<ShipmentAnalyticsDataResponse> shipments =
//                shipmentClient.getAllShipmentsForAnalytics();
//
//        DashboardAnalyticsResponse dashboard =
//                getAdminDashboard();
//
//        try {
//
//            ByteArrayOutputStream out = new ByteArrayOutputStream();
//
//            Document document = new Document();
//
//            PdfWriter.getInstance(document, out);
//
//            document.open();
//
//            document.add(new Paragraph("Shipment Analytics Report"));
//            document.add(new Paragraph(" "));
//
//            document.add(new Paragraph("Total Shipments : " + shipments.size()));
//
//            document.add(new Paragraph(
//                    "Delivered : " +
//                            shipments.stream()
//                                    .filter(s -> "DELIVERED".equals(s.getStatus()))
//                                    .count()
//            ));
//
////            document.add(new Paragraph(
////                    "Average Delivery Records : "
////                            + dashboard.getAverageDeliveryTime().size()
////            ));
//
////            document.add(new Paragraph(
////                    "On-Time Performance : "
////                            + dashboard.getOnTimePerformance().get(0).getRate()
////                            + "%"
////            ));
//
//            document.close();
//
//            return ResponseEntity.ok()
//                    .header(
//                            HttpHeaders.CONTENT_DISPOSITION,
//                            "attachment; filename=analytics-report.pdf"
//                    )
//                    .contentType(MediaType.APPLICATION_PDF)
//                    .body(out.toByteArray());
//
//        } catch (DocumentException e) {
//            throw new RuntimeException(e);
//        }
//    }

@Override
public ResponseEntity<byte[]> exportAdminDashboardPdf(
        LocalDate startDate,
        LocalDate endDate
) {

    validateDateRange(startDate, endDate);

//    LocalDateTime startDateTime =
//            startDate.atStartOfDay();
//
//    LocalDateTime endDateTime =
//            endDate.atTime(
//                    23,
//                    59,
//                    59,
//                    999999999
//            );
//
//    List<ShipmentAnalyticsDataResponse> shipments =
//            shipmentClient.getAllShipmentsForAnalyticsByDateRange(
//                    startDateTime,
//                    endDateTime
//            );

    DashboardAnalyticsResponse dashboard =
            getAdminDashboard(
                    startDate,
                    endDate
            );

    try {

        ByteArrayOutputStream out =
                new ByteArrayOutputStream();

        Document document =
                new Document();

        PdfWriter.getInstance(
                document,
                out
        );

        document.open();

        document.add(
                new Paragraph("Shipment Analytics Report")
        );

        document.add(new Paragraph(" "));

        document.add(
                new Paragraph(
                        "Period : "
                                + startDate
                                + " to "
                                + endDate
                )
        );

        document.add(new Paragraph(" "));

        document.add(
                new Paragraph(
                        "Total Shipments : "
                                + dashboard.getOverview()
                                .getTotalShipments()
                )
        );

        document.add(
                new Paragraph(
                        "Delivered : "
                                + dashboard.getOverview()
                                .getDelivered()
                )
        );

        document.add(
                new Paragraph(
                        "In Transit : "
                                + dashboard.getOverview()
                                .getInTransit()
                )
        );

        document.add(
                new Paragraph(
                        "Failed Deliveries : "
                                + dashboard.getOverview()
                                .getFailedDeliveries()
                )
        );

        document.add(
                new Paragraph(
                        "On-Time Delivery : "
                                + dashboard.getOverview()
                                .getOnTimeRate()
                                + "%"
                )
        );

        document.add(
                new Paragraph(
                        "Average Delivery Time : "
                                + dashboard.getDeliveryPerformance()
                                .getAverageDeliveryMinutes()
                                + " minutes"
                )
        );

        document.add(
                new Paragraph(
                        "Success Rate : "
                                + dashboard.getDeliveryPerformance()
                                .getSuccessRate()
                                + "%"
                )
        );

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

//    @Override
//    public ResponseEntity<byte[]> exportBusinessDashboardPdf(
//            Long businessClientId
//    ) {
//
//        List<ShipmentAnalyticsDataResponse> shipments =
//                shipmentClient.getBusinessShipmentsForAnalytics(
//                        businessClientId
//                );
//
//        DashboardAnalyticsResponse dashboard =
//                getBusinessDashboard(businessClientId);
//
//        try {
//
//            ByteArrayOutputStream out = new ByteArrayOutputStream();
//
//            Document document = new Document();
//
//            PdfWriter.getInstance(document, out);
//
//            document.open();
//
//            document.add(new Paragraph("Business Shipment Analytics Report"));
//            document.add(new Paragraph(" "));
//
//            document.add(new Paragraph(
//                    "Total Shipments : " + shipments.size()
//            ));
//
//            document.add(new Paragraph(
//                    "Delivered : " +
//                            shipments.stream()
//                                    .filter(s -> "DELIVERED".equals(s.getStatus()))
//                                    .count()
//            ));
//
////            document.add(new Paragraph(
////                    "Average Delivery Records : "
////                            + dashboard.getAverageDeliveryTime().size()
////            ));
//
////            document.add(new Paragraph(
////                    "On-Time Performance : "
////                            + dashboard.getOnTimePerformance().get(0).getRate()
////                            + "%"
////            ));
//
//            document.close();
//
//            return ResponseEntity.ok()
//                    .header(
//                            HttpHeaders.CONTENT_DISPOSITION,
//                            "attachment; filename=business-analytics-report.pdf"
//                    )
//                    .contentType(MediaType.APPLICATION_PDF)
//                    .body(out.toByteArray());
//
//        } catch (DocumentException e) {
//            throw new RuntimeException(e);
//        }
//    }

@Override
public ResponseEntity<byte[]> exportBusinessDashboardPdf(
        Long businessClientId,
        LocalDate startDate,
        LocalDate endDate
) {

    validateDateRange(startDate, endDate);

    DashboardAnalyticsResponse dashboard =
            getBusinessDashboard(
                    businessClientId,
                    startDate,
                    endDate
            );

    try {

        ByteArrayOutputStream out =
                new ByteArrayOutputStream();

        Document document =
                new Document();

        PdfWriter.getInstance(
                document,
                out
        );

        document.open();

        document.add(
                new Paragraph("Business Shipment Analytics Report")
        );

        document.add(new Paragraph(" "));

        document.add(
                new Paragraph(
                        "Period : "
                                + startDate
                                + " to "
                                + endDate
                )
        );

        document.add(new Paragraph(" "));

        document.add(
                new Paragraph(
                        "Total Shipments : "
                                + dashboard.getOverview()
                                .getTotalShipments()
                )
        );

        document.add(
                new Paragraph(
                        "Delivered : "
                                + dashboard.getOverview()
                                .getDelivered()
                )
        );

        document.add(
                new Paragraph(
                        "In Transit : "
                                + dashboard.getOverview()
                                .getInTransit()
                )
        );

        document.add(
                new Paragraph(
                        "Failed Deliveries : "
                                + dashboard.getOverview()
                                .getFailedDeliveries()
                )
        );

        document.add(
                new Paragraph(
                        "On-Time Delivery : "
                                + dashboard.getOverview()
                                .getOnTimeRate()
                                + "%"
                )
        );

        document.add(
                new Paragraph(
                        "Average Delivery Time : "
                                + dashboard.getDeliveryPerformance()
                                .getAverageDeliveryMinutes()
                                + " minutes"
                )
        );

        document.add(
                new Paragraph(
                        "Success Rate : "
                                + dashboard.getDeliveryPerformance()
                                .getSuccessRate()
                                + "%"
                )
        );

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


    private List<DeliveryVolumeTrendResponse> getDeliveryVolumeTrend(
            List<ShipmentAnalyticsDataResponse> shipments
    ) {

        Map<LocalDate, Long> shipmentsByDate =
                shipments.stream()
                        .filter(s -> s.getCreatedAt() != null)
                        .collect(Collectors.groupingBy(
                                s -> s.getCreatedAt().toLocalDate(),
                                TreeMap::new,
                                Collectors.counting()
                        ));

        return shipmentsByDate.entrySet()
                .stream()
                .map(entry ->
                        DeliveryVolumeTrendResponse.builder()
                                .date(entry.getKey())
                                .shipments(entry.getValue())
                                .build()
                )
                .toList();
    }
}