package com.shipment.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyPhoneOtpRequest {

    @NotBlank
    private String phone;

    @NotBlank
    private String otp;
}