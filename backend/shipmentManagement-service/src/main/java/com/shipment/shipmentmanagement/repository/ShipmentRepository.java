package com.shipment.shipmentmanagement.repository;

import com.shipment.shipmentmanagement.entity.Shipment;
import com.shipment.shipmentmanagement.entity.enums.ShipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;


public interface ShipmentRepository extends JpaRepository<Shipment, Long> {

    Optional<Shipment> findByTrackingNumber(String trackingNumber);

    long countByStatus(ShipmentStatus status);


    long countByCustomerId(Long customerId);

    long countByCustomerIdAndStatus(
            Long customerId,
            ShipmentStatus status
    );
    long countByBusinessClientId(Long businessClientId);

    long countByBusinessClientIdAndStatus(
            Long businessClientId,
            ShipmentStatus status
    );
    List<Shipment> findByStatus(
            ShipmentStatus status
    );

}