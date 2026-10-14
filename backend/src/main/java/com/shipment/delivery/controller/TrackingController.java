//package com.shipment.delivery.controller;
//
//import com.shipment.delivery.entity.TrackingEvent;
//import com.shipment.delivery.service.TrackingService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/tracking")
//@RequiredArgsConstructor
//@CrossOrigin
//public class TrackingController {
//
//    private final TrackingService trackingService;
//
//    /**
//     * Create tracking event
//     */
//    @PostMapping
//    public ResponseEntity<TrackingEvent> createTrackingEvent(
//            @RequestBody TrackingEvent trackingEvent) {
//
//        return ResponseEntity.ok(
//                trackingService.addTrackingEvent(trackingEvent)
//        );
//    }
//
//    /**
//     * Get complete tracking history
//     */
//    @GetMapping("/shipment/{shipmentId}")
//    public ResponseEntity<List<TrackingEvent>> getTrackingHistory(
//            @PathVariable Long shipmentId) {
//
//        return ResponseEntity.ok(
//                trackingService.getTrackingHistory(shipmentId)
//        );
//    }
//
//    /**
//     * Get latest tracking event
//     */
//    @GetMapping("/shipment/{shipmentId}/latest")
//    public ResponseEntity<TrackingEvent> getLatestTrackingEvent(
//            @PathVariable Long shipmentId) {
//
//        TrackingEvent event =
//                trackingService.getLatestTrackingEvent(shipmentId);
//
//        if (event == null) {
//            return ResponseEntity.notFound().build();
//        }
//
//        return ResponseEntity.ok(event);
//    }
//
//    /**
//     * Get tracking events by status
//     */
//    @GetMapping("/status/{status}")
//    public ResponseEntity<List<TrackingEvent>> getByStatus(
//            @PathVariable String status) {
//
//        return ResponseEntity.ok(
//                trackingService.getEventsByStatus(status)
//        );
//    }
//
//    /**
//     * Get events created by user/driver
//     */
//    @GetMapping("/user/{userId}")
//    public ResponseEntity<List<TrackingEvent>> getByUser(
//            @PathVariable Long userId) {
//
//        return ResponseEntity.ok(
//                trackingService.getEventsByUser(userId)
//        );
//    }
//}

package com.shipment.delivery.controller;

import com.shipment.delivery.entity.TrackingEvent;
import com.shipment.delivery.service.TrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tracking")
@RequiredArgsConstructor
@CrossOrigin
public class TrackingController {

    private final TrackingService trackingService;

    /**
     * Create Tracking Event
     */
    @PostMapping
    public ResponseEntity<TrackingEvent> createTrackingEvent(
            @RequestBody TrackingEvent trackingEvent) {

        return ResponseEntity.ok(
                trackingService.addTrackingEvent(trackingEvent)
        );
    }

    /**
     * Get complete tracking history
     */
    @GetMapping("/shipment/{shipmentId}")
    public ResponseEntity<List<TrackingEvent>> getTrackingHistory(
            @PathVariable Long shipmentId) {

        return ResponseEntity.ok(
                trackingService.getTrackingHistory(shipmentId)
        );
    }

    /**
     * Get latest tracking event
     */
    @GetMapping("/shipment/{shipmentId}/latest")
    public ResponseEntity<TrackingEvent> getLatestTrackingEvent(
            @PathVariable Long shipmentId) {

        TrackingEvent event =
                trackingService.getLatestTrackingEvent(shipmentId);

        if (event == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(event);
    }

    /**
     * Get events by shipment status
     */
    @GetMapping("/status/{shipmentStatus}")
    public ResponseEntity<List<TrackingEvent>> getByShipmentStatus(
            @PathVariable String shipmentStatus) {

        return ResponseEntity.ok(
                trackingService.getEventsByShipmentStatus(shipmentStatus)
        );
    }

    /**
     * Get events by event type
     */
    @GetMapping("/type/{eventType}")
    public ResponseEntity<List<TrackingEvent>> getByEventType(
            @PathVariable String eventType) {

        return ResponseEntity.ok(
                trackingService.getEventsByEventType(eventType)
        );
    }

    /**
     * Get events recorded by driver/user
     */
    @GetMapping("/recorded-by/{userId}")
    public ResponseEntity<List<TrackingEvent>> getByRecordedBy(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                trackingService.getEventsByRecordedBy(userId)
        );
    }

    /**
     * Get events created by user
     */
    @GetMapping("/created-by/{userId}")
    public ResponseEntity<List<TrackingEvent>> getByCreatedBy(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                trackingService.getEventsByCreatedBy(userId)
        );
    }
}