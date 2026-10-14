package com.shipment.shipmentmanagement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hub")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hub {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "hub_name")
    private String hubName;

    private String city;

    private String state;
    private String pincode;

    private String region;

    private Double latitude;

    private Double longitude;

    private Boolean active;
}