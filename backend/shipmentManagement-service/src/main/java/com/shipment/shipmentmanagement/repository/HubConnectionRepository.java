package com.shipment.shipmentmanagement.repository;

import com.shipment.shipmentmanagement.entity.Hub;
import com.shipment.shipmentmanagement.entity.HubConnection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


//additional moulika
import org.springframework.data.jpa.repository.Query;

public interface HubConnectionRepository
        extends JpaRepository<HubConnection, Long> {

    List<HubConnection> findByFromHub(Hub fromHub);
    Optional<HubConnection> findByFromHubAndToHub(
            Hub fromHub,
            Hub toHub
    );
//    List<HubConnection> findAll();

//    additional moulika
//@Query("SELECT hc FROM HubConnection hc WHERE hc.fromHub.active = true AND hc.toHub.active = true")
//List<HubConnection> findAllActiveConnections();
}