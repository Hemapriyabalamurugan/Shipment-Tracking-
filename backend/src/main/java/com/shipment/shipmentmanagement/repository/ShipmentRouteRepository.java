package com.shipment.shipmentmanagement.repository;

import com.shipment.shipmentmanagement.entity.ShipmentRoute;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShipmentRouteRepository
        extends JpaRepository<ShipmentRoute, Long> {

    List<ShipmentRoute> findByShipmentIdOrderByStopOrder(
            Long shipmentId
    );
    ShipmentRoute findFirstByShipmentIdAndReachedFalseOrderByStopOrder(
            Long shipmentId
    );
}