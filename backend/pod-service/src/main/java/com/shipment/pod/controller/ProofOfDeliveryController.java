package com.shipment.pod.controller;

import com.shipment.pod.dto.ProofOfDeliveryRequest;
import com.shipment.pod.entity.ProofOfDelivery;
import com.shipment.pod.service.ProofOfDeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.shipment.pod.dto.PodAnalyticsDto;

import java.util.List;

@RestController
@RequestMapping("/api/pod")
@RequiredArgsConstructor
public class ProofOfDeliveryController {

    private final ProofOfDeliveryService service;

    @PostMapping
    public ProofOfDelivery create(
            @RequestBody ProofOfDeliveryRequest request) {

        return service.create(request);
    }

    @GetMapping("/shipment/{shipmentId}")
    public List<ProofOfDelivery> getByShipment(
            @PathVariable Long shipmentId) {

        return service.getByShipment(shipmentId);
    }

//    @GetMapping("/driver/{driverId}")
//    public List<ProofOfDelivery> getByDriver(
//            @PathVariable Long driverId) {
//
//        return service.getByDriver(driverId);
//    }

    @GetMapping("/pending")
    public List<ProofOfDelivery> pending() {

        return service.getPendingVerification();
    }

    @PutMapping("/{id}/verify")
    public ProofOfDelivery verify(
            @PathVariable Long id) {

        return service.verify(id);
    }

    @GetMapping("/analytics")
    public PodAnalyticsDto analytics() {

        return service.getAnalytics();
    }
}