package com.shipment.shipmentmanagement.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class JourneyUpdateResponse {

    private Long shipmentId;

    private String message;

    private LocalDateTime updatedAt;
}