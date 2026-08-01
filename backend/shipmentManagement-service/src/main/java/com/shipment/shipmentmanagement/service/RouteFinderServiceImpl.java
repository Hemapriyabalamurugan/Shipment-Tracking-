package com.shipment.shipmentmanagement.service;

import com.shipment.shipmentmanagement.dto.RouteFinderResponse;
import com.shipment.shipmentmanagement.dto.RouteHubDto;
import com.shipment.shipmentmanagement.entity.Hub;
import com.shipment.shipmentmanagement.entity.HubConnection;
import com.shipment.shipmentmanagement.repository.HubConnectionRepository;
import com.shipment.shipmentmanagement.repository.HubRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class RouteFinderServiceImpl implements RouteFinderService {

    private final HubRepository hubRepository;
    private final HubConnectionRepository hubConnectionRepository;

    @Override
    public RouteFinderResponse findRoute(
            Long originHubId,
            Long destinationHubId
    ) {

        if (originHubId.equals(destinationHubId)) {
            throw new IllegalArgumentException(
                    "Origin and destination cannot be the same."
            );
        }

        List<HubConnection> connections = hubConnectionRepository.findAll();

        Map<Long, List<HubConnection>> graph = new HashMap<>();

        for (HubConnection connection : connections) {

            graph.computeIfAbsent(
                    connection.getFromHub().getId(),
                    k -> new ArrayList<>()
            ).add(connection);

            // Undirected graph
            HubConnection reverse = HubConnection.builder()
                    .fromHub(connection.getToHub())
                    .toHub(connection.getFromHub())
                    .distanceKm(connection.getDistanceKm())
                    .build();

            graph.computeIfAbsent(
                    reverse.getFromHub().getId(),
                    k -> new ArrayList<>()
            ).add(reverse);
        }

        Map<Long, Integer> distance = new HashMap<>();
        Map<Long, Long> previous = new HashMap<>();

        PriorityQueue<long[]> queue =
                new PriorityQueue<>(Comparator.comparingLong(a -> a[1]));

        distance.put(originHubId, 0);
        queue.add(new long[]{originHubId, 0});

        while (!queue.isEmpty()) {

            long[] current = queue.poll();

            Long currentHub = current[0];

            if (!graph.containsKey(currentHub)) {
                continue;
            }

            for (HubConnection edge : graph.get(currentHub)) {

                Long neighbour = edge.getToHub().getId();

                int newDistance =
                        distance.get(currentHub)
                                + edge.getDistanceKm();

                if (newDistance <
                        distance.getOrDefault(
                                neighbour,
                                Integer.MAX_VALUE
                        )) {

                    distance.put(neighbour, newDistance);

                    previous.put(neighbour, currentHub);

                    queue.add(new long[]{
                            neighbour,
                            newDistance
                    });
                }
            }
        }

        List<Long> hubIds = new ArrayList<>();

        Long current = destinationHubId;

        while (current != null) {

            hubIds.add(current);

            current = previous.get(current);
        }

        Collections.reverse(hubIds);

        List<RouteHubDto> hubs = new ArrayList<>();

        for (int i = 0; i < hubIds.size(); i++) {

            Hub hub = hubRepository.findById(hubIds.get(i))
                    .orElseThrow();

            int distanceToNext = 0;

            if (i < hubIds.size() - 1) {

                Long next = hubIds.get(i + 1);

                for (HubConnection edge : graph.get(hub.getId())) {

                    if (edge.getToHub().getId().equals(next)) {

                        distanceToNext = edge.getDistanceKm();
                        break;
                    }
                }
            }

            hubs.add(
                    RouteHubDto.builder()
                            .hubId(hub.getId())
                            .hubName(hub.getHubName())
                            .city(hub.getCity())
                            .latitude(hub.getLatitude())
                            .longitude(hub.getLongitude())
                            .distanceToNextKm(distanceToNext)
                            .build()
            );
        }

//        additional
//        if (!distance.containsKey(destinationHubId)) {
//            throw new RuntimeException("No route found.");
//        }

        int totalDistance =
                distance.get(destinationHubId);

        int totalMinutes =
                (int) Math.ceil(totalDistance * 60.0 / 45);

        Hub origin =
                hubRepository.findById(originHubId).orElseThrow();

        Hub destination =
                hubRepository.findById(destinationHubId).orElseThrow();

        return RouteFinderResponse.builder()
                .originHub(origin.getHubName())
                .destinationHub(destination.getHubName())
                .totalDistanceKm(totalDistance)
                .estimatedHours(totalMinutes / 60)
                .estimatedMinutes(totalMinutes % 60)
                .totalHubs(hubs.size())
                .route(hubs)
                .build();
    }
}