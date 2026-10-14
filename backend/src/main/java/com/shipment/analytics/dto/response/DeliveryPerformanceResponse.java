package com.shipment.analytics.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryPerformanceResponse {

    private long onTime;

    private long delayed;

    private long failed;

    private long averageDeliveryMinutes;

    private double successRate;
}