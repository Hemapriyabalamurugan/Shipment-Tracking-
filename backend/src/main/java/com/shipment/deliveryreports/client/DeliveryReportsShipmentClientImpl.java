package com.shipment.deliveryreports.client;

import com.shipment.deliveryreports.dto.response.ShipmentAnalyticsDataResponse;
import com.shipment.shipmentmanagement.service.ShipmentService;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Component("deliveryReportsShipmentClient")
public class DeliveryReportsShipmentClientImpl implements ShipmentClient {

    private final ShipmentService shipmentService;

    public DeliveryReportsShipmentClientImpl(@Lazy ShipmentService shipmentService) {
        this.shipmentService = shipmentService;
    }

    private ShipmentAnalyticsDataResponse map(com.shipment.shipmentmanagement.dto.ShipmentAnalyticsDataResponse s) {
        if (s == null) return null;
        return ShipmentAnalyticsDataResponse.builder()
                .shipmentId(s.getShipmentId())
                .businessClientId(s.getBusinessClientId())
                .status(s.getStatus())
                .createdAt(s.getCreatedAt())
                .pickedUpAt(s.getPickedUpAt())
                .estimatedDeliveryAt(s.getEstimatedDeliveryAt())
                .deliveredAt(s.getDeliveredAt())
                .originCity(s.getOriginCity())
                .destinationCity(s.getDestinationCity())
                .build();
    }

    private List<ShipmentAnalyticsDataResponse> mapList(List<com.shipment.shipmentmanagement.dto.ShipmentAnalyticsDataResponse> list) {
        if (list == null) return Collections.emptyList();
        return list.stream().map(this::map).toList();
    }

    @Override
    public List<ShipmentAnalyticsDataResponse> getAllShipmentsForAnalyticsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return mapList(shipmentService.getAllShipmentsForAnalyticsByDateRange(startDate, endDate));
    }

    @Override
    public List<ShipmentAnalyticsDataResponse> getBusinessShipmentsForAnalyticsByDateRange(Long businessClientId, LocalDateTime startDate, LocalDateTime endDate) {
        return mapList(shipmentService.getBusinessShipmentsForAnalyticsByDateRange(businessClientId, startDate, endDate));
    }

    @Override
    public List<ShipmentAnalyticsDataResponse> getCustomerShipmentsForAnalyticsByDateRange(Long customerId, LocalDateTime startDate, LocalDateTime endDate) {
        return mapList(shipmentService.getCustomerShipmentsForAnalyticsByDateRange(customerId, startDate, endDate));
    }

    @Override
    public List<ShipmentAnalyticsDataResponse> getDriverShipmentsForAnalyticsByDateRange(Long driverId, LocalDateTime startDate, LocalDateTime endDate) {
        return mapList(shipmentService.getDriverShipmentsForAnalyticsByDateRange(driverId, startDate, endDate));
    }
}
