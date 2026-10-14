package com.shipment.shipmentmanagement.repository;

import com.shipment.shipmentmanagement.entity.Shipment;
import com.shipment.shipmentmanagement.entity.enums.ShipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Shipment> findWithLockById(Long id);
    Optional<Shipment> findByTrackingNumber(String trackingNumber);

    long countByStatus(ShipmentStatus status);


    long countByCustomerId(Long customerId);

    long countByCustomerIdAndStatus(
            Long customerId,
            ShipmentStatus status
    );
    long countByBusinessClientId(Long businessClientId);

    long countByBusinessClientIdAndStatus(
            Long businessClientId,
            ShipmentStatus status
    );
    List<Shipment> findByStatus(
            ShipmentStatus status
    );
//    List<Shipment> findByCustomerId(Long customerId);
List<Shipment> findByCustomerIdOrderByCreatedAtDesc(
        Long customerId
);
    List<Shipment> findAllByOrderByCreatedAtDesc();

    //    extra feature


    List<Shipment> findByBusinessClientId(Long businessClientId);

    List<Shipment> findByStatusInOrderByCreatedAtDesc(
            List<ShipmentStatus> statuses
    );


    List<Shipment> findByCreatedAtBetweenOrderByCreatedAtDesc(
            LocalDateTime startDate,
            LocalDateTime endDate
    );

    List<Shipment> findByBusinessClientIdAndCreatedAtBetweenOrderByCreatedAtDesc(
            Long businessClientId,
            LocalDateTime startDate,
            LocalDateTime endDate
    );

    List<Shipment> findByCustomerIdAndCreatedAtBetweenOrderByCreatedAtDesc(
            Long customerId,
            LocalDateTime startDate,
            LocalDateTime endDate
    );

    List<Shipment> findByDriverIdAndCreatedAtBetweenOrderByCreatedAtDesc(
            Long driverId,
            LocalDateTime startDate,
            LocalDateTime endDate
    );

    @Query("""
    SELECT s
    FROM Shipment s
    WHERE (s.status = :createdStatus AND s.driverId IS NULL)
       OR s.driverId = :operatorId
    ORDER BY s.createdAt DESC
""")
    List<Shipment> findShipmentsForOperator(
            @Param("operatorId") Long operatorId,
            @Param("createdStatus") ShipmentStatus createdStatus
    );

}