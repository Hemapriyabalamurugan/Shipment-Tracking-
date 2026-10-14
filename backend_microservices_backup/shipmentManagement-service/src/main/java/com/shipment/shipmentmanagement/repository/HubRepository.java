package com.shipment.shipmentmanagement.repository;

import com.shipment.shipmentmanagement.entity.Hub;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HubRepository extends JpaRepository<Hub, Long> {

    Optional<Hub> findByCityIgnoreCase(String city);

    List<Hub> findByActiveTrueOrderByCityAsc();

//    additional moulika
//Optional<Hub> findByIdAndActiveTrue(Long id);

}