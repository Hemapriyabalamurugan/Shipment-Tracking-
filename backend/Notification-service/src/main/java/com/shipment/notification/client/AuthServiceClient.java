package com.shipment.notification.client;

import com.shipment.notification.dto.UserProfileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "AUTH-SERVICE")
public interface AuthServiceClient {

    @GetMapping("/api/auth/users/{id}")
    UserProfileResponse getUserById(
            @PathVariable Long id
    );
}