package com.shipment.shipmentmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HubDropdownResponse {

    private Long id;

    private String city;

    private String state;

    private String pincode;
}