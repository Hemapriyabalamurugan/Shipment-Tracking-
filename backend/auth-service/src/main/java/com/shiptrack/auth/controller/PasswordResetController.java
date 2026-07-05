package com.shiptrack.auth.controller;

import com.shiptrack.auth.dto.request.ForgotPasswordRequest;
import com.shiptrack.auth.dto.request.ResetPasswordRequest;
import com.shiptrack.auth.dto.response.ApiResponse;
import com.shiptrack.auth.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Password reset controller.
 *
 * Endpoints:
 *   POST /auth/forgot-password  — Request a password reset email
 *   POST /auth/reset-password   — Reset password using the emailed token
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    /**
     * Initiate password reset — sends an email with a reset link.
     * Always returns success to prevent email enumeration.
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        passwordResetService.initiatePasswordReset(request.getEmail());
        return ResponseEntity.ok(
                ApiResponse.success("If an account with that email exists, a password reset link has been sent")
        );
    }

    /**
     * Reset password using the token from the email link.
     */
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok(ApiResponse.success("Password has been reset successfully"));
    }
}
