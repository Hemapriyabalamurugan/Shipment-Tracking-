package com.shiptrack.auth.controller;

import com.shiptrack.auth.dto.request.LoginRequest;
import com.shiptrack.auth.dto.request.RegisterRequest;
import com.shiptrack.auth.dto.response.ApiResponse;
import com.shiptrack.auth.dto.response.AuthResponse;
import com.shiptrack.auth.dto.response.UserProfileResponse;
import com.shiptrack.auth.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication controller handling registration, login, and current-user retrieval.
 *
 * Endpoints:
 *   POST /auth/register   — Create a new user account
 *   POST /auth/login      — Authenticate and receive JWT tokens
 *   GET  /auth/me          — Get the currently authenticated user's profile
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Register a new user.
     * Public endpoint — no authentication required.
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse authResponse = authService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", authResponse));
    }

    /**
     * Login with email and password.
     * Public endpoint — returns JWT access + refresh tokens.
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest
    ) {
        String ipAddress = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");

        AuthResponse authResponse = authService.login(request, ipAddress, userAgent);
        return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
    }

    /**
     * Get the currently authenticated user's profile.
     * Requires valid JWT in Authorization header.
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getCurrentUser(Authentication authentication) {
        UserProfileResponse profile = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("User profile retrieved", profile));
    }
}
