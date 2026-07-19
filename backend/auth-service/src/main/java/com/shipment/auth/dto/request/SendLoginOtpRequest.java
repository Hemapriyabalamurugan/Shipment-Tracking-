package com.shipment.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SendLoginOtpRequest {

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;
}