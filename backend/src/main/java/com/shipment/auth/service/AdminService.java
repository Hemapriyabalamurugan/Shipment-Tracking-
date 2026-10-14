package com.shipment.auth.service;

import com.shipment.auth.dto.request.CreateAdminRequest;
import com.shipment.auth.dto.response.AdminUserResponse;

import java.util.List;

public interface AdminService {

    AdminUserResponse createAdmin(
            CreateAdminRequest request
    );

    List<AdminUserResponse> getAllUsers();

    AdminUserResponse getUserById(
            Long userId
    );

    void activateUser(
            Long userId
    );

    void deactivateUser(
            Long userId
    );
}