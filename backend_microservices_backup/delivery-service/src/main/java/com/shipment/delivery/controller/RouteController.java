//package com.shipment.delivery.controller;
//
//import com.shipment.delivery.entity.Route;
//import com.shipment.delivery.service.RouteService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/routes")
//@RequiredArgsConstructor
//@CrossOrigin
//public class RouteController {
//
//    private final RouteService routeService;
//
//    /**
//     * Create or update route
//     */
//    @PostMapping
//    public ResponseEntity<Route> saveRoute(
//            @RequestBody Route route) {
//
//        return ResponseEntity.ok(
//                routeService.saveRoute(route)
//        );
//    }
//
//    /**
//     * Get all routes for a shipment
//     */
//    @GetMapping("/shipment/{shipmentId}")
//    public ResponseEntity<List<Route>> getRoutesByShipment(
//            @PathVariable Long shipmentId) {
//
//        return ResponseEntity.ok(
//                routeService.getRoutesByShipment(shipmentId)
//        );
//    }
//
//    /**
//     * Get latest route for a shipment
//     */
//    @GetMapping("/shipment/{shipmentId}/latest")
//    public ResponseEntity<Route> getLatestRoute(
//            @PathVariable Long shipmentId) {
//
//        Route route = routeService.getLatestRoute(shipmentId);
//
//        if (route == null) {
//            return ResponseEntity.notFound().build();
//        }
//
//        return ResponseEntity.ok(route);
//    }
//
//    /**
//     * Get route by ID
//     */
//    @GetMapping("/{routeId}")
//    public ResponseEntity<Route> getRouteById(
//            @PathVariable Long routeId) {
//
//        return ResponseEntity.ok(
//                routeService.getRouteById(routeId)
//        );
//    }
//
//    /**
//     * Delete route
//     */
//    @DeleteMapping("/{routeId}")
//    public ResponseEntity<Void> deleteRoute(
//            @PathVariable Long routeId) {
//
//        routeService.deleteRoute(routeId);
//
//        return ResponseEntity.noContent().build();
//    }
//}

package com.shipment.delivery.controller;

import com.shipment.delivery.entity.Route;
import com.shipment.delivery.service.RouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
@CrossOrigin
public class RouteController {

    private final RouteService routeService;

    /**
     * Create or Update Route
     */
    @PostMapping
    public ResponseEntity<Route> saveRoute(
            @RequestBody Route route) {

        return ResponseEntity.ok(
                routeService.saveRoute(route)
        );
    }

    /**
     * Get Route by Shipment
     */
    @GetMapping("/shipment/{shipmentId}")
    public ResponseEntity<Route> getRouteByShipment(
            @PathVariable Long shipmentId) {

        Route route = routeService.getRouteByShipment(shipmentId);

        if (route == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(route);
    }

    /**
     * Get Route by ID
     */
    @GetMapping("/{routeId}")
    public ResponseEntity<Route> getRouteById(
            @PathVariable Long routeId) {

        return ResponseEntity.ok(
                routeService.getRouteById(routeId)
        );
    }

    /**
     * Delete Route
     */
    @DeleteMapping("/{routeId}")
    public ResponseEntity<Void> deleteRoute(
            @PathVariable Long routeId) {

        routeService.deleteRoute(routeId);

        return ResponseEntity.noContent().build();
    }
}