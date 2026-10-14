package com.shipment.analytics.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VolumeByMonthResponse {

    private String month;

    private Long shipments;

    private Long delivered;

}