//package com.shipment.delivery.service;
//
//import com.shipment.delivery.dto.DashboardResponse;
//import com.shipment.delivery.entity.DriverLocation;
//import com.shipment.delivery.entity.Route;
//import com.shipment.delivery.entity.TrackingEvent;
//import com.shipment.delivery.repository.DriverLocationRepository;
//import com.shipment.delivery.repository.RouteRepository;
//import com.shipment.delivery.repository.TrackingEventRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//@Service
//@RequiredArgsConstructor
//public class DashboardService {
//
//    private final DriverLocationRepository driverLocationRepository;
//    private final TrackingEventRepository trackingEventRepository;
//    private final RouteRepository routeRepository;
//
//    public DashboardResponse getShipmentDashboard(Long shipmentId, Long driverId) {
//
//        DriverLocation latestLocation =
//                driverLocationRepository
//                        .findByDriverIdOrderByRecordedAtDesc(driverId)
//                        .stream()
//                        .findFirst()
//                        .orElse(null);
//
//        TrackingEvent latestTracking =
//                trackingEventRepository
//                        .findTopByShipmentIdOrderByEventTimestampDesc(shipmentId);
//
//        Route latestRoute =
//                routeRepository
//                        .findTopByShipmentIdOrderByCreatedAtDesc(shipmentId);
//
//        DashboardResponse response = new DashboardResponse();
//
//        response.setShipmentId(shipmentId);
//
//        if (latestTracking != null) {
//            response.setCurrentStatus(latestTracking.getStatus());
//            response.setLastEvent(latestTracking.getEventDescription());
//        }
//
//        if (latestLocation != null) {
//            response.setLatitude(latestLocation.getLatitude());
//            response.setLongitude(latestLocation.getLongitude());
//            response.setSpeedKmh(latestLocation.getSpeedKmh());
//        }
//
//        if (latestRoute != null) {
//            response.setStartLocation(latestRoute.getStartLocation());
//            response.setEndLocation(latestRoute.getEndLocation());
//            response.setDistanceKm(latestRoute.getDistanceKm());
//            response.setTrafficDelayMinutes(
//                    latestRoute.getTrafficDelayMinutes()
//            );
//        }
//
//        return response;
//    }
//}

package com.shipment.delivery.service;

import com.shipment.delivery.dto.DashboardResponse;
import com.shipment.delivery.entity.DriverLocation;
import com.shipment.delivery.entity.Route;
import com.shipment.delivery.entity.TrackingEvent;
import com.shipment.delivery.repository.DriverLocationRepository;
import com.shipment.delivery.repository.RouteRepository;
import com.shipment.delivery.repository.TrackingEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DriverLocationRepository driverLocationRepository;
    private final TrackingEventRepository trackingEventRepository;
    private final RouteRepository routeRepository;

    public DashboardResponse getShipmentDashboard(Long shipmentId, Long driverId) {

        DriverLocation latestLocation =
                driverLocationRepository
                        .findTopByDriverIdOrderByRecordedAtDesc(driverId);

        TrackingEvent latestTracking =
                trackingEventRepository
                        .findTopByShipmentIdOrderByEventTimeDesc(shipmentId);

        Route route =
                routeRepository
                        .findByShipmentId(shipmentId);

        DashboardResponse response = new DashboardResponse();

        response.setShipmentId(shipmentId);

        if (latestTracking != null) {
            response.setCurrentStatus(latestTracking.getShipmentStatus());

            // or latestTracking.getEventType() depending on what you want displayed
            response.setLastEvent(latestTracking.getRemarks());
        }

        if (latestLocation != null) {
            response.setLatitude(latestLocation.getLatitude());
            response.setLongitude(latestLocation.getLongitude());
            response.setSpeedKmh(latestLocation.getSpeedKmh());
        }

        if (route != null) {
            response.setStartLocation(route.getStartLocation());
            response.setEndLocation(route.getEndLocation());
            response.setDistanceKm(route.getDistanceKm());
            response.setTrafficDelayMinutes(route.getTrafficDelayMin());
        }

        return response;
    }
}