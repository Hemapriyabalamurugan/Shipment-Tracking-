package com.shipment.auth.service;

import com.shipment.auth.dto.response.UserProfileResponse;
import com.shipment.auth.dto.request.UpdateProfileRequest;
import com.shipment.auth.dto.request.ChangePasswordRequest;
import com.shipment.auth.dto.response.OperatorResponse;
import com.shipment.auth.dto.response.CustomerLookupResponse;

import java.util.List;

public interface UserService {

    UserProfileResponse getCurrentUser();
    UserProfileResponse updateProfile(
            UpdateProfileRequest request
    );

    void changePassword(
            ChangePasswordRequest request
    );


    List<OperatorResponse> getOperators();

    CustomerLookupResponse findCustomer(
            String phone,
            String receiverName
    );
}