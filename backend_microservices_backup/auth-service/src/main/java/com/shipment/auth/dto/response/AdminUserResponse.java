package com.shipment.auth.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
@Getter
@Setter
@Builder
public class AdminUserResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String role;
    private Boolean active;
    private Boolean emailVerified;
    private Boolean phoneVerified;
    private LocalDateTime lastLogin;
}