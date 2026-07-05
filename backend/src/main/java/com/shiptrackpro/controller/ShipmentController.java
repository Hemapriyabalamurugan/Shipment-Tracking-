package com.training.controller;

import com.training.entity.Shipment;
import com.training.service.ShipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shipments")
public class ShipmentController {

    @Autowired
    private ShipmentService shipmentService;

    // Create Shipment
    @PostMapping
    public Shipment saveShipment(@RequestBody Shipment shipment) {
        return shipmentService.saveShipment(shipment);
    }

    // Get All Shipments
    @GetMapping
    public List<Shipment> getAllShipments() {
        return shipmentService.getAllShipments();
    }

    // Get Shipment By Id
    @GetMapping("/{id}")
    public Shipment getShipmentById(@PathVariable Long id) {
        return shipmentService.getShipmentById(id);
    }

    // Update Shipment
    @PutMapping("/{id}")
    public Shipment updateShipment(@PathVariable Long id,
                                   @RequestBody Shipment shipment) {
        return shipmentService.updateShipment(id, shipment);
    }

    // Delete Shipment
    @DeleteMapping("/{id}")
    public String deleteShipment(@PathVariable Long id) {
        shipmentService.deleteShipment(id);
        return "Shipment deleted successfully";
    }
}
