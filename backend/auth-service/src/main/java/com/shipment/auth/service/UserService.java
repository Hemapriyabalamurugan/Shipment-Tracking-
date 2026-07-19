package com.shipment.auth.service;

import com.shipment.auth.dto.response.UserProfileResponse;
import com.shipment.auth.dto.request.UpdateProfileRequest;
import com.shipment.auth.dto.request.ChangePasswordRequest;

public interface UserService {

    UserProfileResponse getCurrentUser();
    UserProfileResponse updateProfile(
            UpdateProfileRequest request
    );

    void changePassword(
            ChangePasswordRequest request
    );
}