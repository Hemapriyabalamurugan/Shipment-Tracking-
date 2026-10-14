package com.shipment.shipmentmanagement.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "shipment_route")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShipmentRoute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "shipment_id")
    private Long shipmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hub_id")
    private Hub hub;

    @Column(name = "stop_order")
    private Integer stopOrder;

    private Boolean reached;

    @Column(name = "reached_at")
    private LocalDateTime reachedAt;
}