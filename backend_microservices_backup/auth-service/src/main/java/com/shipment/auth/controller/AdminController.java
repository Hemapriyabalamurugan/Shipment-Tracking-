package com.shipment.auth.controller;

import com.shipment.auth.dto.request.CreateAdminRequest;
import com.shipment.auth.dto.response.AdminUserResponse;
import com.shipment.auth.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import com.shipment.auth.dto.request.ChangeRoleRequest;
import com.shipment.auth.dto.response.ApiResponse;
import com.shipment.auth.service.AuthService;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final AuthService authService;

    @PostMapping("/create-admin")
    public ResponseEntity<AdminUserResponse> createAdmin(
            @Valid @RequestBody CreateAdminRequest request
    ) {

        return ResponseEntity.ok(
                adminService.createAdmin(request)
        );
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {

        return ResponseEntity.ok(
                adminService.getAllUsers()
        );
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<AdminUserResponse> getUserById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                adminService.getUserById(id)
        );
    }

    @PutMapping("/users/{id}/activate")
    public ResponseEntity<String> activateUser(
            @PathVariable Long id
    ) {

        adminService.activateUser(id);

        return ResponseEntity.ok(
                "User activated successfully"
        );
    }

    @PutMapping("/users/{id}/deactivate")
    public ResponseEntity<String> deactivateUser(
            @PathVariable Long id
    ) {

        adminService.deactivateUser(id);

        return ResponseEntity.ok(
                "User deactivated successfully"
        );
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse> changeUserRole(
            @PathVariable Long id,
            @Valid
            @RequestBody
            ChangeRoleRequest request
    ) {

        return ResponseEntity.ok(
                authService.changeUserRole(
                        id,
                        request
                )
        );
    }
}