package com.shipment.pod.controller;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shipment.pod.dto.ProofOfDeliveryRequest;
import com.shipment.pod.dto.ProofOfDeliveryResponse;
import com.shipment.pod.entity.ProofOfDelivery;
import com.shipment.pod.service.ProofOfDeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestPart;

import java.util.List;

@RestController
@RequestMapping("/api/pod")
@RequiredArgsConstructor
public class ProofOfDeliveryController {

    private final ProofOfDeliveryService service;

//    @PostMapping
//    public ProofOfDelivery create(
//            @RequestBody ProofOfDeliveryRequest request) {
//
//        return service.create(request);
//    }

//    @PostMapping(consumes = "multipart/form-data")
//    public ProofOfDelivery create(
//            @RequestPart("request") ProofOfDeliveryRequest request,
//            @RequestPart("photo") MultipartFile photo) throws Exception {
//
//        return service.create(request, photo);
//    }
@PostMapping(consumes = "multipart/form-data")
public ProofOfDelivery create(
        @RequestPart("request") String request,
        @RequestPart("photo") MultipartFile photo) throws Exception {

    ObjectMapper mapper = new ObjectMapper();

    ProofOfDeliveryRequest podRequest =
            mapper.readValue(request, ProofOfDeliveryRequest.class);

    return service.create(podRequest, photo);
}

    @GetMapping("/shipment/{shipmentId}")
    public ProofOfDelivery getByShipment(
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

//    @PutMapping("/{id}/verify/{businessClientId}")
//    public ProofOfDelivery verify(
//            @PathVariable Long id,
//            @PathVariable Long businessClientId
//    ) {
//
//        return service.verify(id, businessClientId);
//    }
@PutMapping("/{id}/verify")
public ProofOfDelivery verify(
        @PathVariable Long id
) {
    return service.verify(id);
}

    @GetMapping
    public List<ProofOfDeliveryResponse> getAll() {
        return service.getAll();
    }
}