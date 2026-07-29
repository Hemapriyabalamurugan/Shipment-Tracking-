package com.shipment.shipmentmanagement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hub_connection")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HubConnection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_hub_id")
    private Hub fromHub;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_hub_id")
    private Hub toHub;

    @Column(name = "distance_km")
    private Integer distanceKm;
}