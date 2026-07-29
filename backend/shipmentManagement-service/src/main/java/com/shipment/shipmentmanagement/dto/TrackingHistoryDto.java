package com.shipment.shipmentmanagement.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class TrackingHistoryDto {

    private String title;

    private String description;

    private String location;

    private String status;

    private LocalDateTime time;
}