package com.shipment.shipmentmanagement.service;

import com.shipment.shipmentmanagement.dto.JourneyUpdateRequest;
import com.shipment.shipmentmanagement.dto.JourneyUpdateResponse;
import com.shipment.shipmentmanagement.entity.JourneyUpdate;

import com.shipment.shipmentmanagement.entity.ShipmentRoute;
import com.shipment.shipmentmanagement.repository.JourneyUpdateRepository;

import com.shipment.shipmentmanagement.repository.ShipmentRouteRepository;
import org.springframework.stereotype.Service;

@Service
public class JourneyUpdateServiceImpl implements JourneyUpdateService {

    private final JourneyUpdateRepository journeyUpdateRepository;
    private final ShipmentRouteRepository shipmentRouteRepository;

    public JourneyUpdateServiceImpl(
            JourneyUpdateRepository journeyUpdateRepository,
            ShipmentRouteRepository shipmentRouteRepository
    ) {
        this.journeyUpdateRepository = journeyUpdateRepository;
        this.shipmentRouteRepository = shipmentRouteRepository;
    }

    @Override
    public JourneyUpdateResponse updateJourney(
            JourneyUpdateRequest request
    ) {

        ShipmentRoute currentStep =
                shipmentRouteRepository
                        .findFirstByShipmentIdAndReachedFalseOrderByStopOrder(
                                request.getShipmentId()
                        );

        if (currentStep == null) {
            throw new RuntimeException("Current hub not found");
        }

        JourneyUpdate journeyUpdate = journeyUpdateRepository
                .findByShipmentId(request.getShipmentId())
                .orElse(new JourneyUpdate());

        journeyUpdate.setShipmentId(request.getShipmentId());
        journeyUpdate.setCurrentHubId(currentStep.getHub().getId());
        journeyUpdate.setTrafficCondition(request.getTrafficCondition());
        journeyUpdate.setWeatherCondition(request.getWeatherCondition());
        journeyUpdate.setRoadCondition(request.getRoadCondition());
        journeyUpdate.setRemarks(request.getRemarks());

        journeyUpdateRepository.save(journeyUpdate);

        return JourneyUpdateResponse.builder()
                .shipmentId(request.getShipmentId())
                .message("Journey updated successfully.")
                .updatedAt(journeyUpdate.getUpdatedAt())
                .build();
    }
}