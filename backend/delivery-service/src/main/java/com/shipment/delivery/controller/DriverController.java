//package com.shipment.delivery.controller;
//
//import com.shipment.delivery.dto.LocationUpdateRequest;
//import com.shipment.delivery.entity.DriverLocation;
//import com.shipment.delivery.service.DriverService;
//import jakarta.validation.Valid;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/drivers")
//@RequiredArgsConstructor
//@CrossOrigin
//public class DriverController {
//
//    private final DriverService driverService;
//
//    /**
//     * Update driver live location
//     */
//    @PostMapping("/location")
//    public ResponseEntity<DriverLocation> updateLocation(
//            @Valid @RequestBody LocationUpdateRequest request) {
//
//        DriverLocation location =
//                driverService.updateLocation(request);
//
//        return ResponseEntity.ok(location);
//    }
//
//    /**
//     * Get latest driver location
//     */
//    @GetMapping("/{driverId}/location")
//    public ResponseEntity<DriverLocation> getLatestLocation(
//            @PathVariable Long driverId) {
//
//        DriverLocation location =
//                driverService.getLatestLocation(driverId);
//
//        if (location == null) {
//            return ResponseEntity.notFound().build();
//        }
//
//        return ResponseEntity.ok(location);
//    }
//
//    /**
//     * Get driver location history
//     */
//    @GetMapping("/{driverId}/history")
//    public ResponseEntity<List<DriverLocation>> getLocationHistory(
//            @PathVariable Long driverId) {
//
//        return ResponseEntity.ok(
//                driverService.getLocationHistory(driverId)
//        );
//    }
//}

package com.shipment.delivery.controller;

import com.shipment.delivery.dto.LocationUpdateRequest;
import com.shipment.delivery.entity.DriverLocation;
import com.shipment.delivery.service.DriverService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
@RequiredArgsConstructor
@CrossOrigin
public class DriverController {

    private final DriverService driverService;

    /**
     * Update driver live location
     */
    @PostMapping("/location")
    public ResponseEntity<DriverLocation> updateLocation(
            @Valid @RequestBody LocationUpdateRequest request) {

        return ResponseEntity.ok(
                driverService.updateLocation(request)
        );
    }

    /**
     * Get latest driver location
     */
    @GetMapping("/{driverId}/location")
    public ResponseEntity<DriverLocation> getLatestLocation(
            @PathVariable Long driverId) {

        DriverLocation location =
                driverService.getLatestLocation(driverId);

        if (location == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(location);
    }

    /**
     * Get driver location history
     */
    @GetMapping("/{driverId}/history")
    public ResponseEntity<List<DriverLocation>> getLocationHistory(
            @PathVariable Long driverId) {

        return ResponseEntity.ok(
                driverService.getLocationHistory(driverId)
        );
    }

    /**
     * Get latest vehicle location
     */
    @GetMapping("/vehicle/{vehicleId}/location")
    public ResponseEntity<DriverLocation> getLatestVehicleLocation(
            @PathVariable Long vehicleId) {

        DriverLocation location =
                driverService.getLatestVehicleLocation(vehicleId);

        if (location == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(location);
    }

    /**
     * Get vehicle location history
     */
    @GetMapping("/vehicle/{vehicleId}/history")
    public ResponseEntity<List<DriverLocation>> getVehicleLocationHistory(
            @PathVariable Long vehicleId) {

        return ResponseEntity.ok(
                driverService.getVehicleLocationHistory(vehicleId)
        );
    }
}