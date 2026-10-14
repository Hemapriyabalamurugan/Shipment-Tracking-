package com.shipment.shipmentmanagement.controller;

import com.shipment.shipmentmanagement.dto.RouteFinderResponse;
import com.shipment.shipmentmanagement.service.RouteFinderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
public class RouteFinderController {

    private final RouteFinderService routeFinderService;

    @GetMapping("/find")
    public RouteFinderResponse findRoute(
            @RequestParam Long originHubId,
            @RequestParam Long destinationHubId
    ) {
        return routeFinderService.findRoute(
                originHubId,
                destinationHubId
        );
    }

//    adding somthing new from moulika
//@GetMapping("/hubs")
//public List<HubResponseDTO> getAllHubs() {
//    return routeFinderService.getAllHubs();
//}
//
////same here also from moulika
//@GetMapping("/network")
//public NetworkGraphDTO getNetwork() {
//    return routeFinderService.getNetwork();
//}
}