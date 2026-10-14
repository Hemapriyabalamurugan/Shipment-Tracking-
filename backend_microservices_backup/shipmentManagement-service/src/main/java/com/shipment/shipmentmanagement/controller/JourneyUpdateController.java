package com.shipment.shipmentmanagement.controller;

import com.shipment.shipmentmanagement.dto.JourneyUpdateRequest;
import com.shipment.shipmentmanagement.dto.JourneyUpdateResponse;
import com.shipment.shipmentmanagement.service.JourneyUpdateService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/journey")
@RequiredArgsConstructor
public class JourneyUpdateController {

    private final JourneyUpdateService journeyUpdateService;

    @PostMapping("/update")
    public JourneyUpdateResponse updateJourney(
            @RequestBody JourneyUpdateRequest request
    ) {
        return journeyUpdateService.updateJourney(request);
    }

    @GetMapping("/test")
    public String test() {
        return "Journey Controller Working";
    }
}