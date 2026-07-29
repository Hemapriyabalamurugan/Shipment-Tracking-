package com.shipment.shipmentmanagement.repository;

import com.shipment.shipmentmanagement.entity.Hub;
import com.shipment.shipmentmanagement.entity.HubConnection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HubConnectionRepository
        extends JpaRepository<HubConnection, Long> {

    List<HubConnection> findByFromHub(Hub fromHub);
}