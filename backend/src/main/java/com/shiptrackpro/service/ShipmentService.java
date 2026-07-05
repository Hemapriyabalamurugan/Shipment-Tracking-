package com.shiptrackpro.service;

import com.shiptrackpro.entity.Shipment;
import com.shiptrackpro.exception.ResourceNotFoundException;
import com.shiptrackpro.repository.ShipmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;

    public ShipmentService(ShipmentRepository shipmentRepository) {
        this.shipmentRepository = shipmentRepository;
    }

    public Shipment saveShipment(Shipment shipment) {
        return shipmentRepository.save(shipment);
    }

    public List<Shipment> getAllShipments() {
        return shipmentRepository.findAll();
    }

    public Shipment getShipmentById(Long id) {
        return shipmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Shipment not found with id: " + id));
    }

    public Shipment updateShipment(Long id, Shipment shipment) {

        Shipment existing = shipmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Shipment not found with id: " + id));

        existing.setTrackingNumber(shipment.getTrackingNumber());

        existing.setCustomer(shipment.getCustomer());
        existing.setBusinessClient(shipment.getBusinessClient());
        existing.setDriver(shipment.getDriver());

        existing.setSenderName(shipment.getSenderName());
        existing.setSenderPhone(shipment.getSenderPhone());

        existing.setReceiverName(shipment.getReceiverName());
        existing.setReceiverPhone(shipment.getReceiverPhone());

        existing.setDeliveryAddress(shipment.getDeliveryAddress());
        existing.setDeliveryCity(shipment.getDeliveryCity());
        existing.setDeliveryState(shipment.getDeliveryState());
        existing.setDeliveryZip(shipment.getDeliveryZip());
        existing.setDeliveryCountry(shipment.getDeliveryCountry());

        existing.setPackageWeightKg(shipment.getPackageWeightKg());
        existing.setPackageDescription(shipment.getPackageDescription());
        existing.setPackageType(shipment.getPackageType());

        existing.setStatus(shipment.getStatus());

        existing.setCurrentLocationLat(shipment.getCurrentLocationLat());
        existing.setCurrentLocationLng(shipment.getCurrentLocationLng());

        existing.setEstimatedDeliveryDate(shipment.getEstimatedDeliveryDate());
        existing.setActualDeliveryDate(shipment.getActualDeliveryDate());
        existing.setScheduledDate(shipment.getScheduledDate());

        return shipmentRepository.save(existing);
    }

    public void deleteShipment(Long id) {
        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Shipment not found with id: " + id));

        shipmentRepository.delete(shipment);
    }
}
