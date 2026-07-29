package com.shipment.shipmentmanagement.service;

import com.shipment.shipmentmanagement.dto.HubLocationDto;
import com.shipment.shipmentmanagement.dto.NavigationResponse;
import com.shipment.shipmentmanagement.dto.TrackingHistoryDto;
import com.shipment.shipmentmanagement.entity.Shipment;
import com.shipment.shipmentmanagement.entity.enums.ShipmentStatus;
import com.shipment.shipmentmanagement.repository.HubConnectionRepository;
import com.shipment.shipmentmanagement.repository.HubRepository;
import com.shipment.shipmentmanagement.repository.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.shipment.shipmentmanagement.entity.Hub;
import com.shipment.shipmentmanagement.entity.HubConnection;

import com.shipment.shipmentmanagement.repository.ShipmentRouteRepository;
import com.shipment.shipmentmanagement.entity.ShipmentRoute;
import java.time.LocalDateTime;

import com.shipment.shipmentmanagement.dto.TrackingResponse;

import java.util.stream.Collectors;

import java.util.*;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RouteService {

    private final HubRepository hubRepository;
    private final HubConnectionRepository hubConnectionRepository;
    private final ShipmentRouteRepository shipmentRouteRepository;
    private final ShipmentRepository shipmentRepository;


    public Hub findHubByCity(String city) {

        return hubRepository
                .findByCityIgnoreCase(city)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Hub not found for city: " + city
                        )
                );
    }

    public List<HubConnection> getNextConnections(Hub hub) {

        return hubConnectionRepository.findByFromHub(hub);
    }

    public List<Hub> generateRoute(
            String originCity,
            String destinationCity
    ) {

        Hub origin = findHubByCity(originCity);

        Hub destination = findHubByCity(destinationCity);

        Queue<Hub> queue = new LinkedList<>();

        Map<Hub, Hub> previous = new HashMap<>();

        Set<Hub> visited = new HashSet<>();

        queue.add(origin);

        visited.add(origin);

        while (!queue.isEmpty()) {

            Hub current = queue.poll();

            if (current.equals(destination)) {
                break;
            }

            List<HubConnection> connections =
                    getNextConnections(current);

            for (HubConnection connection : connections) {

                Hub nextHub = connection.getToHub();

                if (!visited.contains(nextHub)) {

                    visited.add(nextHub);

                    previous.put(nextHub, current);

                    queue.add(nextHub);
                }
            }
        }

//        return new ArrayList<>();
        List<Hub> route = new ArrayList<>();

        Hub current = destination;

        while (current != null) {

            route.add(current);

            current = previous.get(current);
        }

        Collections.reverse(route);

        return route;
    }
    public void saveRoute(
            Long shipmentId,
            List<Hub> route
    ) {

        int order = 1;

        for (Hub hub : route) {

            ShipmentRoute shipmentRoute =
                    ShipmentRoute.builder()
                            .shipmentId(shipmentId)
                            .hub(hub)
                            .stopOrder(order++)
                            .reached(order == 1)
                            .reachedAt(order == 1 ? LocalDateTime.now() : null)
                            .build();

            shipmentRouteRepository.save(
                    shipmentRoute
            );
            System.out.println(
                    "Saved Hub : "
                            + hub.getHubName()
                            + " Order : "
                            + shipmentRoute.getStopOrder()
            );
        }
    }
    public void markCurrentHubReached(Long shipmentId) {

        ShipmentRoute currentStop =
                shipmentRouteRepository
                        .findFirstByShipmentIdAndReachedFalseOrderByStopOrder(
                                shipmentId
                        );

        if (currentStop == null) {
            throw new RuntimeException("Shipment already reached destination.");
        }

        currentStop.setReached(true);
        currentStop.setReachedAt(LocalDateTime.now());

        shipmentRouteRepository.save(currentStop);
    }

    public TrackingResponse getTrackingDetails(
//            Long shipmentId
            Shipment shipment
    ) {

        List<ShipmentRoute> routes =
                shipmentRouteRepository
                        .findByShipmentIdOrderByStopOrder(
                                shipment.getId()
                        );

//        to represent the origin and destination
        Hub originHub = findHubByCity(
                shipment.getSenderCity()
        );

        Hub destinationHub = findHubByCity(
                shipment.getReceiverCity()
        );

        HubLocationDto origin =
                HubLocationDto.builder()
                        .hubName(originHub.getHubName())
                        .latitude(originHub.getLatitude())
                        .longitude(originHub.getLongitude())
                        .build();

        HubLocationDto destination =
                HubLocationDto.builder()
                        .hubName(destinationHub.getHubName())
                        .latitude(destinationHub.getLatitude())
                        .longitude(destinationHub.getLongitude())
                        .build();

        List<HubLocationDto> completed =
                routes.stream()
                        .filter(ShipmentRoute::getReached)
                        .map(r -> HubLocationDto.builder()
                                .hubName(r.getHub().getHubName())
                                .latitude(r.getHub().getLatitude())
                                .longitude(r.getHub().getLongitude())
                                .build())
                        .collect(Collectors.toList());

        List<HubLocationDto> remaining =
                routes.stream()
                        .filter(r -> !r.getReached())
                        .map(r -> HubLocationDto.builder()
                                .hubName(r.getHub().getHubName())
                                .latitude(r.getHub().getLatitude())
                                .longitude(r.getHub().getLongitude())
                                .build())
                        .collect(Collectors.toList());

        List<HubLocationDto> route =
                routes.stream()
                        .map(r -> HubLocationDto.builder()
                                .hubName(r.getHub().getHubName())
                                .latitude(r.getHub().getLatitude())
                                .longitude(r.getHub().getLongitude())
                                .build())
                        .toList();

        ShipmentRoute current =

                shipmentRouteRepository
                        .findFirstByShipmentIdAndReachedFalseOrderByStopOrder(
                                shipment.getId()
                        );

        HubLocationDto currentHub;

        if (current != null) {

            currentHub = HubLocationDto.builder()
                    .hubName(current.getHub().getHubName())
                    .latitude(current.getHub().getLatitude())
                    .longitude(current.getHub().getLongitude())
                    .build();

        } else {

            ShipmentRoute lastStop = routes.get(routes.size() - 1);

            currentHub = HubLocationDto.builder()
                    .hubName(lastStop.getHub().getHubName())
                    .latitude(lastStop.getHub().getLatitude())
                    .longitude(lastStop.getHub().getLongitude())
                    .build();
        }


        HubLocationDto nextHub = null;

        if (current != null) {

            int index = routes.indexOf(current);

            if (index + 1 < routes.size()) {

                Hub hub = routes.get(index + 1).getHub();

                nextHub = HubLocationDto.builder()
                        .hubName(hub.getHubName())
                        .latitude(hub.getLatitude())
                        .longitude(hub.getLongitude())
                        .build();
            }

        } else {

            nextHub = currentHub;
        }

        int progress =
                (int) (((double) completed.size()
                        / routes.size()) * 100);

//        ===========================================================
        List<TrackingHistoryDto> history = new ArrayList<>();

        history.add(
                TrackingHistoryDto.builder()
                        .title("Shipment Created")
                        .description("Shipment created successfully")
                        .location(shipment.getSenderCity())
                        .status("CREATED")
                        .time(shipment.getCreatedAt())
                        .build()
        );

        if (shipment.getPickedUpAt() != null) {

            history.add(
                    TrackingHistoryDto.builder()
                            .title("Shipment Picked Up")
                            .description("Package collected from sender")
                            .location(shipment.getSenderCity())
                            .status("PICKED_UP")
                            .time(shipment.getPickedUpAt())
                            .build()
            );
        }

//        for (ShipmentRoute r : routes) {
//
//            if (r.getReached()) {
//
//                history.add(
//                        TrackingHistoryDto.builder()
//                                .title("Reached " + r.getHub().getHubName())
//                                .description("Shipment reached " + r.getHub().getHubName())
//                                .location(r.getHub().getCity())
//                                .status("REACHED")
//                                .time(r.getReachedAt())
//                                .build()
//                );
//            }
//        }
        for (ShipmentRoute r : routes) {

            if (!r.getReached()) {
                continue;
            }

            history.add(
                    TrackingHistoryDto.builder()
                            .title("Reached " + r.getHub().getHubName())
                            .description("Shipment arrived at " + r.getHub().getHubName())
                            .location(r.getHub().getCity())
                            .status("REACHED_HUB")
                            .time(r.getReachedAt())
                            .build()
            );

            if (!r.getHub().equals(destinationHub)) {

                history.add(
                        TrackingHistoryDto.builder()
                                .title("Departed " + r.getHub().getHubName())
                                .description("Shipment departed from " + r.getHub().getHubName())
                                .location(r.getHub().getCity())
                                .status("IN_TRANSIT")
                                .time(r.getReachedAt())
                                .build()
                );
            }
        }

        if (shipment.getStatus() == ShipmentStatus.OUT_FOR_DELIVERY) {

            history.add(
                    TrackingHistoryDto.builder()
                            .title("Out For Delivery")
                            .description("Shipment is out for delivery")
                            .location(shipment.getReceiverCity())
                            .status("OUT_FOR_DELIVERY")
                            .time(shipment.getUpdatedAt())
                            .build()
            );
        }

        if (shipment.getStatus() == ShipmentStatus.DELIVERED) {

            history.add(
                    TrackingHistoryDto.builder()
                            .title("Delivered")
                            .description("Shipment delivered successfully")
                            .location(shipment.getReceiverCity())
                            .status("DELIVERED")
                            .time(shipment.getDeliveredAt())
                            .build()
            );
        }
////        ===============================================================

        return TrackingResponse.builder()
                .trackingNumber(
                        shipment.getTrackingNumber()
                )
                .shipmentStatus(
                        shipment.getStatus().name()
                )
                .origin(origin)
                .destination(destination)
                .currentLocation(currentHub)
                .route(route)
                .completedHubs(completed)
                .remainingHubs(remaining)
                .progressPercentage(progress)
                .trackingHistory(history)
                .build();
    }

    public NavigationResponse getNavigation(Long shipmentId) {

        Shipment shipment =
                shipmentRepository
                        .findById(shipmentId)
                        .orElseThrow(() ->
                                new RuntimeException("Shipment not found")
                        );

        List<ShipmentRoute> routes =
                shipmentRouteRepository
                        .findByShipmentIdOrderByStopOrder(shipmentId);

        ShipmentRoute current =
                shipmentRouteRepository
                        .findFirstByShipmentIdAndReachedFalseOrderByStopOrder(
                                shipmentId
                        );

        HubLocationDto currentHub;

        HubLocationDto nextHub = null;

        if (current != null) {

            currentHub = HubLocationDto.builder()
                    .hubName(current.getHub().getHubName())
                    .latitude(current.getHub().getLatitude())
                    .longitude(current.getHub().getLongitude())
                    .build();

            int index = routes.indexOf(current);

            if (index + 1 < routes.size()) {

                Hub hub = routes.get(index + 1).getHub();

                nextHub = HubLocationDto.builder()
                        .hubName(hub.getHubName())
                        .latitude(hub.getLatitude())
                        .longitude(hub.getLongitude())
                        .build();
            }

        } else {

            ShipmentRoute last = routes.get(routes.size() - 1);

            currentHub = HubLocationDto.builder()
                    .hubName(last.getHub().getHubName())
                    .latitude(last.getHub().getLatitude())
                    .longitude(last.getHub().getLongitude())
                    .build();
        }
        Hub origin = findHubByCity(
                shipment.getSenderCity()
        );

        Hub destination = findHubByCity(
                shipment.getReceiverCity()
        );

        HubLocationDto originHub = HubLocationDto.builder()
                .hubName(origin.getHubName())
                .latitude(origin.getLatitude())
                .longitude(origin.getLongitude())
                .build();

        HubLocationDto destinationHub = HubLocationDto.builder()
                .hubName(destination.getHubName())
                .latitude(destination.getLatitude())
                .longitude(destination.getLongitude())
                .build();

        return NavigationResponse.builder()
                .shipmentId(shipmentId)
                .trackingNumber(shipment.getTrackingNumber())
                .originHub(originHub)
                .currentHub(currentHub)
                .nextHub(nextHub)
                .destinationHub(destinationHub)
                .shipmentStatus(shipment.getStatus())
                .build();
    }
}
