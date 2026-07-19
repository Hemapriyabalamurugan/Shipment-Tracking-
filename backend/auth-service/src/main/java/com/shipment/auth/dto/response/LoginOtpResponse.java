package com.shipment.auth.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginOtpResponse {

    private boolean success;

    private String message;
}