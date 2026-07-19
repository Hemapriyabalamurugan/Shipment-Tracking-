//package com.shipment.delivery.service;
//
//import com.shipment.delivery.entity.Route;
//import com.shipment.delivery.repository.RouteRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class RouteService {
//
//    private final RouteRepository routeRepository;
//
//    /**
//     * Create or update a route
//     */
//    public Route saveRoute(Route route) {
//        return routeRepository.save(route);
//    }
//
//    /**
//     * Get all routes for a shipment
//     */
//    public List<Route> getRoutesByShipment(Long shipmentId) {
//        return routeRepository.findByShipmentId(shipmentId);
//    }
//
//    /**
//     * Get latest route for a shipment
//     */
//    public Route getLatestRoute(Long shipmentId) {
//        return routeRepository
//                .findTopByShipmentIdOrderByCreatedAtDesc(shipmentId);
//    }
//
//    /**
//     * Get route by ID
//     */
//    public Route getRouteById(Long routeId) {
//        return routeRepository.findById(routeId)
//                .orElseThrow(() ->
//                        new RuntimeException("Route not found: " + routeId));
//    }
//
//    /**
//     * Delete route
//     */
//    public void deleteRoute(Long routeId) {
//        routeRepository.deleteById(routeId);
//    }
//}

package com.shipment.delivery.service;

import com.shipment.delivery.entity.Route;
import com.shipment.delivery.repository.RouteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RouteService {

    private final RouteRepository routeRepository;

    /**
     * Create or Update Route
     */
    public Route saveRoute(Route route) {
        return routeRepository.save(route);
    }

    /**
     * Get Route by Shipment
     */
    public Route getRouteByShipment(Long shipmentId) {

        return routeRepository.findByShipmentId(shipmentId);
    }

    /**
     * Get Route by ID
     */
    public Route getRouteById(Long routeId) {

        return routeRepository.findById(routeId)
                .orElseThrow(() ->
                        new RuntimeException("Route not found"));
    }

    /**
     * Delete Route
     */
    public void deleteRoute(Long routeId) {

        routeRepository.deleteById(routeId);
    }
}