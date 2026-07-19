package com.shipment.auth.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String email;
    private String role;
    private String token;
    private String refreshToken;
    private String message;

}