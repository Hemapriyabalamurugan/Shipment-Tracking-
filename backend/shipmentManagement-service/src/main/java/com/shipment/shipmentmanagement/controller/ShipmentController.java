//package com.shipment.shipmentmanagement.controller;
//
//import com.shipment.shipmentmanagement.entity.Shipment;
//import com.shipment.shipmentmanagement.service.ShipmentService;
//import org.springframework.web.bind.annotation.*;
//import com.shipment.shipmentmanagement.dto.ShipmentAnalyticsDto;
//import com.shipment.shipmentmanagement.dto.CustomerShipmentAnalyticsDto;
//import com.shipment.shipmentmanagement.dto.BusinessShipmentAnalyticsDto;
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/shipments")
//public class ShipmentController {
//
//    private final ShipmentService shipmentService;
//
//    public ShipmentController(ShipmentService shipmentService) {
//        this.shipmentService = shipmentService;
//    }
//
//    @PostMapping
//    public Shipment saveShipment(@RequestBody Shipment shipment) {
//        return shipmentService.saveShipment(shipment);
//    }
//
//    @GetMapping
//    public List<Shipment> getAllShipments() {
//        return shipmentService.getAllShipments();
//    }
//
//    @GetMapping("/{id}")
//    public Shipment getShipmentById(@PathVariable Long id) {
//        return shipmentService.getShipmentById(id);
//    }
//
//    @PutMapping("/{id}")
//    public Shipment updateShipment(@PathVariable Long id,
//                                   @RequestBody Shipment shipment) {
//        return shipmentService.updateShipment(id, shipment);
//    }
//
//    @DeleteMapping("/{id}")
//    public String deleteShipment(@PathVariable Long id) {
//        shipmentService.deleteShipment(id);
//        return "Shipment deleted successfully";
//    }
//
//    @GetMapping("/analytics/summary")
//    public ShipmentAnalyticsDto getShipmentAnalytics() {
//
//        return shipmentService.getShipmentAnalytics();
//    }
//
//    @GetMapping("/analytics/customer/{customerId}")
//    public CustomerShipmentAnalyticsDto getCustomerAnalytics(
//            @PathVariable Long customerId
//    ) {
//
//        return shipmentService.getCustomerAnalytics(
//                customerId
//        );
//    }
//
//    @GetMapping("/analytics/business/{businessClientId}")
//    public BusinessShipmentAnalyticsDto getBusinessAnalytics(
//            @PathVariable Long businessClientId
//    ) {
//        return shipmentService.getBusinessAnalytics(
//                businessClientId
//        );
//    }
//}
//

package com.shipment.shipmentmanagement.controller;

import com.shipment.shipmentmanagement.dto.BusinessShipmentAnalyticsDto;
import com.shipment.shipmentmanagement.dto.CustomerShipmentAnalyticsDto;
import com.shipment.shipmentmanagement.dto.ShipmentAnalyticsDto;
import com.shipment.shipmentmanagement.entity.Shipment;
import com.shipment.shipmentmanagement.service.ShipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/shipments")
@RequiredArgsConstructor
public class ShipmentController {

    private final ShipmentService shipmentService;

    @PostMapping
    public Shipment saveShipment(@RequestBody Shipment shipment) {
        return shipmentService.saveShipment(shipment);
    }

    @GetMapping
    public List<Shipment> getAllShipments() {
        return shipmentService.getAllShipments();
    }

    @GetMapping("/{id}")
    public Shipment getShipmentById(@PathVariable Long id) {
        return shipmentService.getShipmentById(id);
    }

    @PutMapping("/{id}")
    public Shipment updateShipment(
            @PathVariable Long id,
            @RequestBody Shipment shipment
    ) {
        return shipmentService.updateShipment(id, shipment);
    }

    @DeleteMapping("/{id}")
    public String deleteShipment(@PathVariable Long id) {
        shipmentService.deleteShipment(id);
        return "Shipment deleted successfully";
    }

    @GetMapping("/analytics/summary")
    public ShipmentAnalyticsDto getShipmentAnalytics() {
        return shipmentService.getShipmentAnalytics();
    }

    @GetMapping("/analytics/customer/{customerId}")
    public CustomerShipmentAnalyticsDto getCustomerAnalytics(
            @PathVariable Long customerId
    ) {
        return shipmentService.getCustomerAnalytics(customerId);
    }

    @GetMapping("/analytics/business/{businessClientId}")
    public BusinessShipmentAnalyticsDto getBusinessAnalytics(
            @PathVariable Long businessClientId
    ) {
        return shipmentService.getBusinessAnalytics(businessClientId);
    }
}
