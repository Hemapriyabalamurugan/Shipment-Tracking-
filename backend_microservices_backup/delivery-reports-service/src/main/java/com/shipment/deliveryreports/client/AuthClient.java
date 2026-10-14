package com.shipment.deliveryreports.client;

import com.shipment.deliveryreports.config.FeignClientConfig;
import com.shipment.deliveryreports.dto.response.UserProfileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "Auth-service", configuration = FeignClientConfig.class)
public interface AuthClient {

    @GetMapping("/api/users/profile")
    UserProfileResponse getCurrentUser();
}
