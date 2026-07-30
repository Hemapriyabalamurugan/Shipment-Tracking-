package com.shipment.shipmentmanagement.controller;

import com.shipment.shipmentmanagement.dto.HubResponse;
import com.shipment.shipmentmanagement.repository.HubRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/hubs")
@RequiredArgsConstructor
public class HubController {

    private final HubRepository hubRepository;

    @GetMapping
    public List<HubResponse> getAllHubs() {

        return hubRepository.findByActiveTrueOrderByCityAsc()
                .stream()
                .map(hub -> HubResponse.builder()
                        .id(hub.getId())
                        .hubName(hub.getHubName())
                        .city(hub.getCity())
                        .latitude(hub.getLatitude())
                        .longitude(hub.getLongitude())
                        .build())
                .toList();
    }
}