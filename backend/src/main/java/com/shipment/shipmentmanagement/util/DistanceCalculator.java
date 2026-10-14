package com.shipment.shipmentmanagement.util;

import com.shipment.shipmentmanagement.entity.HubConnection;
import com.shipment.shipmentmanagement.entity.ShipmentRoute;
import com.shipment.shipmentmanagement.repository.HubConnectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DistanceCalculator {

    private final HubConnectionRepository hubConnectionRepository;

    public int calculateRemainingDistance(
            List<ShipmentRoute> routes
    ) {

        int distance = 0;

        for (int i = 0; i < routes.size() - 1; i++) {

            ShipmentRoute current = routes.get(i);
            ShipmentRoute next = routes.get(i + 1);

            if (current.getReached()) {
                continue;
            }

            HubConnection connection =
                    hubConnectionRepository
                            .findByFromHubAndToHub(
                                    current.getHub(),
                                    next.getHub()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Hub connection not found."
                                    )
                            );

            distance += connection.getDistanceKm();
        }

        return distance;
    }
}