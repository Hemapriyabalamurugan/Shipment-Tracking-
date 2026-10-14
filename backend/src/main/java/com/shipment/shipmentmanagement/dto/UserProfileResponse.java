package com.shipment.shipmentmanagement.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserProfileResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String role;
}