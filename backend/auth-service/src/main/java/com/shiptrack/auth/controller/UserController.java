package com.shiptrack.auth.controller;

import com.shiptrack.auth.dto.request.ChangePasswordRequest;
import com.shiptrack.auth.dto.request.UpdateProfileRequest;
import com.shiptrack.auth.dto.response.ApiResponse;
import com.shiptrack.auth.dto.response.UserProfileResponse;
import com.shiptrack.auth.entity.UserActivityLog;
import com.shiptrack.auth.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * User management controller for profile and account operations.
 *
 * Endpoints:
 *   GET  /users/profile    — Get authenticated user's profile
 *   PUT  /users/profile    — Update profile (name, phone, image)
 *   PUT  /users/settings   — Change password
 *   GET  /users/activity   — Get login/logout activity log
 */
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Get the authenticated user's profile.
     */
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(Authentication authentication) {
        UserProfileResponse profile = userService.getProfile(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved", profile));
    }

    /**
     * Update the authenticated user's profile.
     * Allows partial updates — only non-null fields are updated.
     */
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        UserProfileResponse profile = userService.updateProfile(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", profile));
    }

    /**
     * Change the authenticated user's password.
     * Requires the current password for verification.
     */
    @PutMapping("/settings")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request,
            HttpServletRequest httpRequest
    ) {
        String ipAddress = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");

        userService.changePassword(authentication.getName(), request, ipAddress, userAgent);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully"));
    }

    /**
     * Get paginated activity log for the authenticated user.
     * Shows login, logout, password change events.
     */
    @GetMapping("/activity")
    public ResponseEntity<ApiResponse<Page<UserActivityLog>>> getActivityLog(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<UserActivityLog> activityLog = userService.getActivityLog(authentication.getName(), page, size);
        return ResponseEntity.ok(ApiResponse.success("Activity log retrieved", activityLog));
    }

    // ── RBAC demo endpoints ──

    /**
     * Admin-only endpoint example.
     * Only users with ADMIN role can access this.
     */
    @GetMapping("/admin/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> adminDashboard() {
        return ResponseEntity.ok(ApiResponse.success("Admin dashboard access granted", "Welcome, Admin!"));
    }

    /**
     * Support agent endpoint example.
     * Accessible by SUPPORT_AGENT and ADMIN roles.
     */
    @GetMapping("/support/tickets")
    @PreAuthorize("hasAnyRole('SUPPORT_AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<String>> supportTickets() {
        return ResponseEntity.ok(ApiResponse.success("Support tickets access granted", "Support agent view"));
    }

    /**
     * Logistics operator endpoint example.
     * Accessible by LOGISTICS_OPERATOR, SUPPORT_AGENT, and ADMIN roles.
     */
    @GetMapping("/logistics/operations")
    @PreAuthorize("hasAnyRole('LOGISTICS_OPERATOR', 'SUPPORT_AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<String>> logisticsOperations() {
        return ResponseEntity.ok(ApiResponse.success("Logistics access granted", "Logistics operator view"));
    }
}
