package com.shipment.shipmentmanagement.repository;

import com.shipment.shipmentmanagement.entity.JourneyUpdate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JourneyUpdateRepository extends JpaRepository<JourneyUpdate, Long> {

    Optional<JourneyUpdate> findByShipmentId(Long shipmentId);
}