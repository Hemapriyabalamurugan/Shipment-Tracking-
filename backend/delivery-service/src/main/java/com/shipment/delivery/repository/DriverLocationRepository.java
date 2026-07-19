//package com.shipment.delivery.repository;
//
//import com.shipment.delivery.entity.DriverLocation;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//public interface DriverLocationRepository extends JpaRepository<DriverLocation, Long> {
//
//    // Get latest locations for a driver
//    List<DriverLocation> findByDriverIdOrderByRecordedAtDesc(Long driverId);
//
//    // Get all location history of a driver
//    List<DriverLocation> findByDriverId(Long driverId);
//
//}

//package com.shipment.delivery.repository;
//
//import com.shipment.delivery.entity.DriverLocation;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//public interface DriverLocationRepository
//        extends JpaRepository<DriverLocation, Long> {
//
//    /**
//     * Driver location history (newest first)
//     */
//    List<DriverLocation> findByDriverIdOrderByRecordedAtDesc(Long driverId);
//
//    /**
//     * Driver location history
//     */
//    List<DriverLocation> findByDriverId(Long driverId);
//}

package com.shipment.delivery.repository;

import com.shipment.delivery.entity.DriverLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DriverLocationRepository
        extends JpaRepository<DriverLocation, Long> {

    List<DriverLocation> findByDriverId(Long driverId);

    List<DriverLocation> findByDriverIdOrderByRecordedAtDesc(Long driverId);

    DriverLocation findTopByDriverIdOrderByRecordedAtDesc(Long driverId);

    List<DriverLocation> findByVehicleIdOrderByRecordedAtDesc(Long vehicleId);

    DriverLocation findTopByVehicleIdOrderByRecordedAtDesc(Long vehicleId);
}