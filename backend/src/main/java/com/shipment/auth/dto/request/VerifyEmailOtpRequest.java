package com.shipment.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyEmailOtpRequest {

    @NotBlank
    private String email;

    @NotBlank
    private String otp;
}