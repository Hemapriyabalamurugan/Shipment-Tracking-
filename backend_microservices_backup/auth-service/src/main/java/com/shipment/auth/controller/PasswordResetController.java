package com.shipment.auth.controller;

import com.shipment.auth.dto.request.ForgotPasswordRequest;
import com.shipment.auth.dto.request.ResetPasswordRequest;

import com.shipment.auth.dto.response.ApiResponse;
import com.shipment.auth.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/password")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    @PostMapping("/forgot")
    public ResponseEntity<ApiResponse> forgotPassword(
            @Valid @RequestBody
            ForgotPasswordRequest request
    ) {

        passwordResetService.forgotPassword(request);

        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .message("Password reset link sent to your registered email")
                        .build()
        );
    }



    @PostMapping("/reset")
    public ResponseEntity<ApiResponse> resetPassword(
            @Valid @RequestBody
            ResetPasswordRequest request
    ) {

        passwordResetService.resetPassword(request);

        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .message("Password reset successful")
                        .build()
        );
    }
}