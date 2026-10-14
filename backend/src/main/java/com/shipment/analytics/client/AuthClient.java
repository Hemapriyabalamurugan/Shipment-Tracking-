package com.shipment.analytics.client;

import com.shipment.analytics.dto.response.UserProfileResponse;

public interface AuthClient {

    UserProfileResponse getCurrentUser();
}
