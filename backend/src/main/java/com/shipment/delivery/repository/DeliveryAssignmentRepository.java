package com.shipment.delivery.repository;

import com.shipment.delivery.entity.DeliveryAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeliveryAssignmentRepository
        extends JpaRepository<DeliveryAssignment, Long> {

    List<DeliveryAssignment> findByDriverId(Long driverId);

    List<DeliveryAssignment> findByShipmentId(Long shipmentId);

    List<DeliveryAssignment> findByStatus(String status);

    List<DeliveryAssignment> findByDriverIdAndStatus(Long driverId, String status);

    long countByStatus(String status);
}