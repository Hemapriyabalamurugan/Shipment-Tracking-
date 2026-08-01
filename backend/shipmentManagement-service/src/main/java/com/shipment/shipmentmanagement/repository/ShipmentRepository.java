package com.shipment.shipmentmanagement.repository;

import com.shipment.shipmentmanagement.entity.Shipment;
import com.shipment.shipmentmanagement.entity.enums.ShipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;


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
//    List<Shipment> findByCustomerId(Long customerId);
List<Shipment> findByCustomerIdOrderByCreatedAtDesc(
        Long customerId
);
    List<Shipment> findAllByOrderByCreatedAtDesc();

    //    extra feature


    List<Shipment> findByBusinessClientId(Long businessClientId);

    List<Shipment> findByStatusInOrderByCreatedAtDesc(
            List<ShipmentStatus> statuses
    );


    List<Shipment> findByCreatedAtBetweenOrderByCreatedAtDesc(
            LocalDateTime startDate,
            LocalDateTime endDate
    );

    List<Shipment> findByBusinessClientIdAndCreatedAtBetweenOrderByCreatedAtDesc(
            Long businessClientId,
            LocalDateTime startDate,
            LocalDateTime endDate
    );

}