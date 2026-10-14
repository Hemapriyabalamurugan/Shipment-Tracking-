package com.shipment.shipmentmanagement.service;

import com.shipment.shipmentmanagement.config.ShipmentConstants;
import com.shipment.shipmentmanagement.dto.EtaResponse;
import com.shipment.shipmentmanagement.entity.JourneyUpdate;
import com.shipment.shipmentmanagement.entity.Shipment;
import com.shipment.shipmentmanagement.entity.ShipmentRoute;
import com.shipment.shipmentmanagement.repository.JourneyUpdateRepository;
import com.shipment.shipmentmanagement.repository.ShipmentRepository;
import com.shipment.shipmentmanagement.repository.ShipmentRouteRepository;
import com.shipment.shipmentmanagement.util.DistanceCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.shipment.shipmentmanagement.util.ConfidenceCalculator;
import com.shipment.shipmentmanagement.util.EtaCalculator;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EtaServiceImpl implements EtaService {

    private final ShipmentRepository shipmentRepository;
    private final ShipmentRouteRepository shipmentRouteRepository;
    private final JourneyUpdateRepository journeyUpdateRepository;
    private final DistanceCalculator distanceCalculator;

    @Override
    public EtaResponse calculateEta(Long shipmentId) {

        Shipment shipment = shipmentRepository
                .findById(shipmentId)
                .orElseThrow(() ->
                        new RuntimeException("Shipment not found")
                );

        List<ShipmentRoute> routes =
                shipmentRouteRepository
                        .findByShipmentIdOrderByStopOrder(
                                shipmentId
                        );

        int remainingDistance =
                distanceCalculator.calculateRemainingDistance(
                        routes
                );

//        int totalMinutes =
//                (remainingDistance * 60)
//                        / ShipmentConstants.AVERAGE_SPEED_KMH;
//
//        JourneyUpdate update =
//                journeyUpdateRepository
//                        .findByShipmentId(shipmentId)
//                        .orElse(null);
//
//        if (update != null) {
//
//            switch (update.getTrafficCondition()) {
//
//                case MODERATE ->
//                        totalMinutes += ShipmentConstants.TRAFFIC_MODERATE_DELAY;
//
//                case HEAVY ->
//                        totalMinutes += ShipmentConstants.TRAFFIC_HEAVY_DELAY;
//            }
//
//            switch (update.getWeatherCondition()) {
//
//                case RAIN ->
//                        totalMinutes += ShipmentConstants.WEATHER_RAIN_DELAY;
//
//                case FOG ->
//                        totalMinutes += ShipmentConstants.WEATHER_FOG_DELAY;
//
//                case STORM ->
//                        totalMinutes += ShipmentConstants.WEATHER_STORM_DELAY;
//            }
//
//            switch (update.getRoadCondition()) {
//
//                case UNDER_CONSTRUCTION ->
//                        totalMinutes += ShipmentConstants.ROAD_UNDER_CONSTRUCTION_DELAY;
//
//                case ACCIDENT ->
//                        totalMinutes += ShipmentConstants.ROAD_ACCIDENT_DELAY;
//
//                case BLOCKED ->
//                        totalMinutes += ShipmentConstants.ROAD_BLOCKED_DELAY;
//            }
//        }
//
//        int remainingHubs = (int) routes.stream()
//                .filter(r -> !r.getReached())
//                .count();
//
//        totalMinutes += remainingHubs
//                * ShipmentConstants.HUB_DELAY_MINUTES;

        JourneyUpdate update =
                journeyUpdateRepository
                        .findByShipmentId(shipmentId)
                        .orElse(null);

        int remainingHubs = (int) routes.stream()
                .filter(r -> !r.getReached())
                .count();

        int totalMinutes = EtaCalculator.calculateMinutes(
                remainingDistance,
                remainingHubs,
                shipment.getPriority(),
                update
        );

        int confidence = ConfidenceCalculator.calculate(update);
        return EtaResponse.builder()
                .remainingDistanceKm(remainingDistance)
                .estimatedHours(totalMinutes / 60)
                .estimatedMinutes(totalMinutes % 60)
                .estimatedArrival(
                        LocalDateTime.now()
                                .plusMinutes(totalMinutes)
                )
                .build();
    }
}