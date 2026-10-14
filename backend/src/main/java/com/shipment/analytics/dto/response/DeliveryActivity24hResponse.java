package com.shipment.analytics.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryActivity24hResponse {

    private Integer hour;
    private Long deliveries;

    private Long pickups;

}