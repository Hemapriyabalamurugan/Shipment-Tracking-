//package com.shipment.delivery.repository;
//
//import com.shipment.delivery.entity.TrackingEvent;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//public interface TrackingEventRepository extends JpaRepository<TrackingEvent, Long> {
//
//    // All tracking events for a shipment
//    List<TrackingEvent> findByShipmentIdOrderByEventTimestampDesc(Long shipmentId);
//
//    // Latest event for a shipment
//    TrackingEvent findTopByShipmentIdOrderByEventTimestampDesc(Long shipmentId);
//
//    // Events by status
//    List<TrackingEvent> findByStatus(String status);
//
//    // Events created by a specific user/driver/operator
//    List<TrackingEvent> findByCreatedBy(Long createdBy);
//}

package com.shipment.delivery.repository;

import com.shipment.delivery.entity.TrackingEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrackingEventRepository
        extends JpaRepository<TrackingEvent, Long> {

    // All tracking events for a shipment (latest first)
    List<TrackingEvent> findByShipmentIdOrderByEventTimeDesc(Long shipmentId);

    // Latest tracking event for a shipment
    TrackingEvent findTopByShipmentIdOrderByEventTimeDesc(Long shipmentId);

    // Events by shipment status
    List<TrackingEvent> findByShipmentStatus(String shipmentStatus);

    // Events by event type
    List<TrackingEvent> findByEventType(String eventType);

    // Events recorded by a user/driver
    List<TrackingEvent> findByRecordedBy(Long recordedBy);

    // Events created by a user
    List<TrackingEvent> findByCreatedBy(Long createdBy);
}