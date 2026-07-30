package com.shipment.shipmentmanagement.service;

import com.shipment.shipmentmanagement.dto.DeliveryForecastResponse;
import com.shipment.shipmentmanagement.dto.EtaResponse;
import com.shipment.shipmentmanagement.entity.Shipment;
import com.shipment.shipmentmanagement.entity.enums.ForecastStatus;
import com.shipment.shipmentmanagement.repository.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.shipment.shipmentmanagement.entity.JourneyUpdate;
import com.shipment.shipmentmanagement.repository.JourneyUpdateRepository;
import com.shipment.shipmentmanagement.util.ConfidenceCalculator;
import com.shipment.shipmentmanagement.util.ForecastCalculator;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DeliveryForecastServiceImpl
        implements DeliveryForecastService {

    private final ShipmentRepository shipmentRepository;
    private final EtaService etaService;
    private final JourneyUpdateRepository journeyUpdateRepository;

    @Override
    public DeliveryForecastResponse generateForecast(
            Long shipmentId
    ) {

        Shipment shipment =
                shipmentRepository.findById(shipmentId)
                        .orElseThrow(() ->
                                new RuntimeException("Shipment not found")
                        );

        EtaResponse eta =
                etaService.calculateEta(shipmentId);

        LocalDateTime estimatedDelivery =
                shipment.getEstimatedDeliveryAt();

        LocalDateTime predictedArrival =
                eta.getEstimatedArrival();
        JourneyUpdate update =
                journeyUpdateRepository
                        .findByShipmentId(shipmentId)
                        .orElse(null);

        int confidence =
                ConfidenceCalculator.calculate(update);

        return ForecastCalculator.calculate(
                estimatedDelivery,
                predictedArrival,
                confidence
        );

//        long difference =
//                Duration.between(
//                        estimatedDelivery,
//                        predictedArrival
//                ).toMinutes();
//
//        ForecastStatus status;
//        String reason;
//        int confidence = 85;
//
//        int earlyMinutes = 0;
//        int delayMinutes = 0;
//
//        if (difference > 30) {
//
//            status = ForecastStatus.DELAYED;
//            delayMinutes = (int) difference;
//            confidence = 70;
//            reason = "Shipment is expected to be delayed.";
//
//        } else if (difference < -30) {
//
//            status = ForecastStatus.EARLY;
//            earlyMinutes = (int) Math.abs(difference);
//            confidence = 90;
//            reason = "Shipment is expected to arrive early.";
//
//        } else {
//
//            status = ForecastStatus.ON_TIME;
//            confidence = 85;
//            reason = "Shipment is expected to arrive on time.";
//        }
//
//        return DeliveryForecastResponse.builder()
//                .forecastStatus(status)
//                .reason(reason)
//                .confidencePercentage(confidence)
//                .expectedDelayMinutes(delayMinutes)
//                .expectedEarlyMinutes(earlyMinutes)
//                .build();
    }
}