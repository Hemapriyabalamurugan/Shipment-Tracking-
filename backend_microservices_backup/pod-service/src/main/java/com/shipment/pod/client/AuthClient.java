package com.shipment.pod.client;

import com.shipment.pod.config.FeignClientConfig;
import com.shipment.pod.dto.UserProfileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(
        name = "Auth-service",
        configuration = FeignClientConfig.class
)
public interface AuthClient {

    @GetMapping("/api/users/profile")
    UserProfileResponse getCurrentUser();
}