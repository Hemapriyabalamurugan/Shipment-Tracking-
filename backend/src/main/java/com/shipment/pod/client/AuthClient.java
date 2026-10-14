package com.shipment.pod.client;

import com.shipment.pod.dto.UserProfileResponse;

public interface AuthClient {

    UserProfileResponse getCurrentUser();
}