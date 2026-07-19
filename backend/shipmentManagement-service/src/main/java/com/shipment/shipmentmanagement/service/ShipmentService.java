
package com.shipment.shipmentmanagement.service;

import com.shipment.shipmentmanagement.entity.Shipment;
import com.shipment.shipmentmanagement.repository.ShipmentRepository;
import org.springframework.stereotype.Service;
import com.shipment.shipmentmanagement.dto.ShipmentAnalyticsDto;
import com.shipment.shipmentmanagement.entity.enums.ShipmentStatus;
import com.shipment.shipmentmanagement.dto.CustomerShipmentAnalyticsDto;
import com.shipment.shipmentmanagement.dto.BusinessShipmentAnalyticsDto;


import java.util.List;
import java.time.Duration;
@Service
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;

    public ShipmentService(ShipmentRepository shipmentRepository) {
        this.shipmentRepository = shipmentRepository;
    }

    // Create Shipment
    public Shipment saveShipment(Shipment shipment) {
        return shipmentRepository.save(shipment);
    }

    // Get All Shipments
    public List<Shipment> getAllShipments() {
        return shipmentRepository.findAll();
    }

    // Get Shipment By Id
    public Shipment getShipmentById(Long id) {
        return shipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shipment not found with id: " + id));
    }

    // Update Shipment
    public Shipment updateShipment(Long id, Shipment shipmentDetails) {

        Shipment shipment = getShipmentById(id);

        shipment.setTrackingNumber(shipmentDetails.getTrackingNumber());
        shipment.setSenderName(shipmentDetails.getSenderName());
        shipment.setSenderPhone(shipmentDetails.getSenderPhone());

        shipment.setReceiverName(shipmentDetails.getReceiverName());
        shipment.setReceiverPhone(shipmentDetails.getReceiverPhone());

//        shipment.setDeliveryAddress(shipmentDetails.getDeliveryAddress());
//        shipment.setDeliveryCity(shipmentDetails.getDeliveryCity());
//        shipment.setDeliveryState(shipmentDetails.getDeliveryState());
//        shipment.setDeliveryZip(shipmentDetails.getDeliveryZip());
//        shipment.setDeliveryCountry(shipmentDetails.getDeliveryCountry());
        shipment.setReceiverAddress(shipmentDetails.getReceiverAddress());
        shipment.setReceiverCity(shipmentDetails.getReceiverCity());
        shipment.setReceiverState(shipmentDetails.getReceiverState());
        shipment.setReceiverPostalCode(shipmentDetails.getReceiverPostalCode());
        shipment.setReceiverCountry(shipmentDetails.getReceiverCountry());

        shipment.setPackageWeightKg(shipmentDetails.getPackageWeightKg());
        shipment.setPackageDescription(shipmentDetails.getPackageDescription());
        shipment.setPackageType(shipmentDetails.getPackageType());

        shipment.setStatus(shipmentDetails.getStatus());

        return shipmentRepository.save(shipment);
    }

    // Delete Shipment
    public void deleteShipment(Long id) {
        shipmentRepository.deleteById(id);
    }


public ShipmentAnalyticsDto getShipmentAnalytics() {

    long totalShipments = shipmentRepository.count();

    long deliveredShipments =
            shipmentRepository.countByStatus(
                    ShipmentStatus.DELIVERED
            );

    double deliverySuccessRate = 0.0;

    if (totalShipments > 0) {
        deliverySuccessRate =
                ((double) deliveredShipments / totalShipments) * 100;
    }

    List<Shipment> deliveredShipmentList =
            shipmentRepository.findByStatus(
                    ShipmentStatus.DELIVERED
            );

    List<Shipment> validDeliveredShipments =
            deliveredShipmentList.stream()
                    .filter(s ->
                            s.getCreatedAt() != null
                                    && s.getDeliveredAt() != null
                    )
                    .toList();

    double averageDeliveryTimeDays = 0.0;

    if (!validDeliveredShipments.isEmpty()) {

        double totalDays =
                validDeliveredShipments.stream()
                        .mapToLong(s ->
                                Duration.between(
                                        s.getCreatedAt(),
                                        s.getDeliveredAt()
                                ).toDays()
                        )
                        .sum();

        averageDeliveryTimeDays =
                totalDays / validDeliveredShipments.size();
    }

    return ShipmentAnalyticsDto.builder()
            .totalShipments(totalShipments)

            .createdShipments(
                    shipmentRepository.countByStatus(
                            ShipmentStatus.CREATED
                    )
            )

            .pickedUpShipments(
                    shipmentRepository.countByStatus(
                            ShipmentStatus.PICKED_UP
                    )
            )

            .inTransitShipments(
                    shipmentRepository.countByStatus(
                            ShipmentStatus.IN_TRANSIT
                    )
            )

            .outForDeliveryShipments(
                    shipmentRepository.countByStatus(
                            ShipmentStatus.OUT_FOR_DELIVERY
                    )
            )

            .deliveredShipments(deliveredShipments)

            .failedDeliveries(
                    shipmentRepository.countByStatus(
                            ShipmentStatus.FAILED_DELIVERY
                    )
            )

            .cancelledShipments(
                    shipmentRepository.countByStatus(
                            ShipmentStatus.CANCELLED
                    )
            )

            .deliverySuccessRate(
                    deliverySuccessRate
            )

            .averageDeliveryTimeDays(
                    averageDeliveryTimeDays
            )

            .build();
}

    public CustomerShipmentAnalyticsDto getCustomerAnalytics(
            Long customerId
    ) {

        long totalShipments =
                shipmentRepository.countByCustomerId(customerId);

        long deliveredShipments =
                shipmentRepository.countByCustomerIdAndStatus(
                        customerId,
                        ShipmentStatus.DELIVERED
                );

        long inTransitShipments =
                shipmentRepository.countByCustomerIdAndStatus(
                        customerId,
                        ShipmentStatus.IN_TRANSIT
                );

        long activeShipments =
                totalShipments - deliveredShipments;

        long pendingShipments =
                shipmentRepository.countByCustomerIdAndStatus(
                        customerId,
                        ShipmentStatus.CREATED
                );

//        return CustomerShipmentAnalyticsDto.builder()
//                .totalShipments(totalShipments)
//                .deliveredShipments(deliveredShipments)
//                .inTransitShipments(inTransitShipments)
//                .activeShipments(activeShipments)
//                .build();
        return CustomerShipmentAnalyticsDto.builder()
                .totalShipments(totalShipments)
                .deliveredShipments(deliveredShipments)
                .inTransitShipments(inTransitShipments)
                .activeShipments(activeShipments)
                .pendingShipments(pendingShipments)
                .build();
    }

    public BusinessShipmentAnalyticsDto getBusinessAnalytics(
            Long businessClientId
    ) {

        long totalShipments =
                shipmentRepository.countByBusinessClientId(
                        businessClientId
                );

        long deliveredShipments =
                shipmentRepository.countByBusinessClientIdAndStatus(
                        businessClientId,
                        ShipmentStatus.DELIVERED
                );

        long inTransitShipments =
                shipmentRepository.countByBusinessClientIdAndStatus(
                        businessClientId,
                        ShipmentStatus.IN_TRANSIT
                );

        long pendingShipments =
                shipmentRepository.countByBusinessClientIdAndStatus(
                        businessClientId,
                        ShipmentStatus.CREATED
                );

        long failedDeliveries =
                shipmentRepository.countByBusinessClientIdAndStatus(
                        businessClientId,
                        ShipmentStatus.FAILED_DELIVERY
                );

        double deliverySuccessRate =
                totalShipments > 0
                        ? ((double) deliveredShipments / totalShipments) * 100
                        : 0.0;

        return BusinessShipmentAnalyticsDto.builder()
                .totalShipments(totalShipments)
                .deliveredShipments(deliveredShipments)
                .inTransitShipments(inTransitShipments)
                .pendingShipments(pendingShipments)
                .failedDeliveries(failedDeliveries)
                .deliverySuccessRate(deliverySuccessRate)
                .build();
    }


}

