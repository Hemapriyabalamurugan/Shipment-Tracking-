//package com.shipment.delivery.repository;
//
//import com.shipment.delivery.entity.Route;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//public interface RouteRepository extends JpaRepository<Route, Long> {
//
//    // Find route by shipment
//    List<Route> findByShipmentId(Long shipmentId);
//
//    // Get latest route for a shipment
//    Route findTopByShipmentIdOrderByCreatedAtDesc(Long shipmentId);
//}
package com.shipment.delivery.repository;

import com.shipment.delivery.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {

    Route findByShipmentId(Long shipmentId);
}