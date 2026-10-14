package com.shipment.pod.repository;

import com.shipment.pod.entity.ProofOfDelivery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProofOfDeliveryRepository
        extends JpaRepository<ProofOfDelivery, Long> {

    Optional<ProofOfDelivery> findByShipmentId(Long shipmentId);

//    List<ProofOfDelivery> findByDriverId(Long driverId);

//    List<ProofOfDelivery> findByVerified(Boolean verified);
//    long countByVerified(Boolean verified);
List<ProofOfDelivery> findByVerificationStatus(String verificationStatus);
}