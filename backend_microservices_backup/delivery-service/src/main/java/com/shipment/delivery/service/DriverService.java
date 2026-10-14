//package com.shipment.delivery.service;
//
//import com.shipment.delivery.dto.LocationUpdateRequest;
//import com.shipment.delivery.entity.DriverLocation;
//import com.shipment.delivery.repository.DriverLocationRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import com.shipment.delivery.websocket.DriverLocationPublisher;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class DriverService {
//
//    private final DriverLocationRepository driverLocationRepository;
//    private final DriverLocationPublisher locationPublisher;
//    /**
//     * Save live driver location
//     */
//    public DriverLocation updateLocation(LocationUpdateRequest request) {
//
//        DriverLocation location = DriverLocation.builder()
//                .driverId(request.getDriverId())
//                .latitude(request.getLatitude())
//                .longitude(request.getLongitude())
//                .speedKmh(request.getSpeedKmh())
//                .recordedAt(LocalDateTime.now())
//                .build();
//
//        DriverLocation saved =
//                driverLocationRepository.save(location);
//
//        locationPublisher.publishLocation(saved);
//
//        return saved;
//    }
//
//    /**
//     * Get latest driver location
//     */
//    public DriverLocation getLatestLocation(Long driverId) {
//
//        return driverLocationRepository
//                .findByDriverIdOrderByRecordedAtDesc(driverId)
//                .stream()
//                .findFirst()
//                .orElse(null);
//    }
//
//    /**
//     * Get driver location history
//     */
//    public List<DriverLocation> getLocationHistory(Long driverId) {
//
//        return driverLocationRepository.findByDriverId(driverId);
//    }
//}

package com.shipment.delivery.service;

import com.shipment.delivery.dto.LocationUpdateRequest;
import com.shipment.delivery.entity.DriverLocation;
import com.shipment.delivery.repository.DriverLocationRepository;
import com.shipment.delivery.websocket.DriverLocationPublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DriverService {

    private final DriverLocationRepository driverLocationRepository;
    private final DriverLocationPublisher locationPublisher;

    /**
     * Save live driver location
     */
    public DriverLocation updateLocation(LocationUpdateRequest request) {

        DriverLocation location = DriverLocation.builder()
                .driverId(request.getDriverId())
                .vehicleId(request.getVehicleId())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .speedKmh(request.getSpeedKmh())
                .heading(request.getHeading())
                .accuracy(request.getAccuracy())
                .batteryLevel(request.getBatteryLevel())
                .build();

        DriverLocation saved = driverLocationRepository.save(location);

        locationPublisher.publishLocation(saved);

        return saved;
    }

    /**
     * Get latest driver location
     */
    public DriverLocation getLatestLocation(Long driverId) {

        return driverLocationRepository
                .findTopByDriverIdOrderByRecordedAtDesc(driverId);
    }

    /**
     * Get driver location history
     */
    public List<DriverLocation> getLocationHistory(Long driverId) {

        return driverLocationRepository
                .findByDriverIdOrderByRecordedAtDesc(driverId);
    }

    /**
     * Get latest vehicle location
     */
    public DriverLocation getLatestVehicleLocation(Long vehicleId) {

        return driverLocationRepository
                .findTopByVehicleIdOrderByRecordedAtDesc(vehicleId);
    }

    /**
     * Get vehicle location history
     */
    public List<DriverLocation> getVehicleLocationHistory(Long vehicleId) {

        return driverLocationRepository
                .findByVehicleIdOrderByRecordedAtDesc(vehicleId);
    }
}