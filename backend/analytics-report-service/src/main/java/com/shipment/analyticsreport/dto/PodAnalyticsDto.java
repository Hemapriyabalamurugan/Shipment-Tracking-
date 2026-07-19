package com.shipment.analyticsreport.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PodAnalyticsDto {

    private Long totalProofs;

    private Long verifiedProofs;

    private Long pendingProofs;

    private Double verificationRate;
}