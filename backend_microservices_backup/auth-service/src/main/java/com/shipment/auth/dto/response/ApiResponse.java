package com.shipment.auth.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse {

    private boolean success;

    private String message;
}