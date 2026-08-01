package com.shipment.analytics.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OverviewResponse {

    private long totalShipments;

    private long delivered;

    private long inTransit;

    private long failedDeliveries;

    private double onTimeRate;
}