package com.shipment.analyticsreport.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryAnalyticsDto {
    // Assignment Statistics
    private Long totalAssignments;
    private Long assignedDeliveries;
    private Long acceptedDeliveries;
    private Long completedDeliveries;
    private Long rejectedDeliveries;
    private Long cancelledDeliveries;

    // Performance
    private Double completionRate;

    // Delay Analysis
    private Long delayedDeliveries;
    private Double averageDelayMinutes;
}