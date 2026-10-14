package com.shipment.deliveryreports.client;

import com.shipment.deliveryreports.dto.response.UserProfileResponse;

public interface AuthClient {

    UserProfileResponse getCurrentUser();
}
