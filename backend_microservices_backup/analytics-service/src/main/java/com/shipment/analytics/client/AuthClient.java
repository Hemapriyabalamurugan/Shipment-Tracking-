package com.shipment.analytics.client;

import com.shipment.analytics.config.FeignClientConfig;
import com.shipment.analytics.dto.response.UserProfileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "Auth-service", configuration = FeignClientConfig.class)
public interface AuthClient {

    @GetMapping("/api/users/profile")
    UserProfileResponse getCurrentUser();
}
