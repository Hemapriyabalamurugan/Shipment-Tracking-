package com.shipment.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyResetOtpRequest {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String otp;
}