///

package com.shipment.delivery.service;

import com.shipment.delivery.entity.TrackingEvent;
import com.shipment.delivery.repository.TrackingEventRepository;
import com.shipment.delivery.websocket.TrackingEventPublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TrackingService {

    private final TrackingEventRepository trackingEventRepository;
    private final TrackingEventPublisher trackingEventPublisher;

    /**
     * Create a new tracking event
     */
    public TrackingEvent addTrackingEvent(TrackingEvent trackingEvent) {

        TrackingEvent saved =
                trackingEventRepository.save(trackingEvent);

        trackingEventPublisher.publishTrackingEvent(saved);

        return saved;
    }

    /**
     * Get complete tracking history for a shipment
     */
    public List<TrackingEvent> getTrackingHistory(Long shipmentId) {

        return trackingEventRepository
                .findByShipmentIdOrderByEventTimeDesc(shipmentId);
    }

    /**
     * Get latest tracking event
     */
    public TrackingEvent getLatestTrackingEvent(Long shipmentId) {

        return trackingEventRepository
                .findTopByShipmentIdOrderByEventTimeDesc(shipmentId);
    }

    /**
     * Get events by shipment status
     */
    public List<TrackingEvent> getEventsByShipmentStatus(
            String shipmentStatus) {

        return trackingEventRepository
                .findByShipmentStatus(shipmentStatus);
    }

    /**
     * Get events by event type
     */
    public List<TrackingEvent> getEventsByEventType(
            String eventType) {

        return trackingEventRepository
                .findByEventType(eventType);
    }

    /**
     * Get events recorded by a driver/user
     */
    public List<TrackingEvent> getEventsByRecordedBy(
            Long recordedBy) {

        return trackingEventRepository
                .findByRecordedBy(recordedBy);
    }

    /**
     * Get events created by a user
     */
    public List<TrackingEvent> getEventsByCreatedBy(
            Long createdBy) {

        return trackingEventRepository
                .findByCreatedBy(createdBy);
    }
}