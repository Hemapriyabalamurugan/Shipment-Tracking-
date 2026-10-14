package com.shipment.notification.client;

import com.shipment.notification.dto.UserProfileResponse;

public interface AuthServiceClient {

    UserProfileResponse getUserById(Long id);
}