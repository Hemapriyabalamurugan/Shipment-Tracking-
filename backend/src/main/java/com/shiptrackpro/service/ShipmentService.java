
package com.shiptrackpro.service;

import com.shiptrackpro.entity.Shipment;
import com.shiptrackpro.repository.ShipmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;

    public ShipmentService(ShipmentRepository shipmentRepository) {
        this.shipmentRepository = shipmentRepository;
    }

    // Create Shipment
    public Shipment saveShipment(Shipment shipment) {
        return shipmentRepository.save(shipment);
    }

    // Get All Shipments
    public List<Shipment> getAllShipments() {
        return shipmentRepository.findAll();
    }

    // Get Shipment By Id
    public Shipment getShipmentById(Long id) {
        return shipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shipment not found with id: " + id));
    }

    // Update Shipment
    public Shipment updateShipment(Long id, Shipment shipmentDetails) {

        Shipment shipment = getShipmentById(id);

        shipment.setTrackingNumber(shipmentDetails.getTrackingNumber());
        shipment.setSenderName(shipmentDetails.getSenderName());
        shipment.setSenderPhone(shipmentDetails.getSenderPhone());

        shipment.setReceiverName(shipmentDetails.getReceiverName());
        shipment.setReceiverPhone(shipmentDetails.getReceiverPhone());

        shipment.setDeliveryAddress(shipmentDetails.getDeliveryAddress());
        shipment.setDeliveryCity(shipmentDetails.getDeliveryCity());
        shipment.setDeliveryState(shipmentDetails.getDeliveryState());
        shipment.setDeliveryZip(shipmentDetails.getDeliveryZip());
        shipment.setDeliveryCountry(shipmentDetails.getDeliveryCountry());

        shipment.setPackageWeightKg(shipmentDetails.getPackageWeightKg());
        shipment.setPackageDescription(shipmentDetails.getPackageDescription());
        shipment.setPackageType(shipmentDetails.getPackageType());

        shipment.setStatus(shipmentDetails.getStatus());

        return shipmentRepository.save(shipment);
    }

    // Delete Shipment
    public void deleteShipment(Long id) {
        shipmentRepository.deleteById(id);
    }
}

