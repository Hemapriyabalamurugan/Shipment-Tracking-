package com.shipment.shipmentmanagement.client;

import com.shipment.shipmentmanagement.dto.OperatorResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import com.shipment.shipmentmanagement.config.FeignClientConfig;
import java.util.List;
import com.shipment.shipmentmanagement.dto.CustomerLookupResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import com.shipment.shipmentmanagement.dto.UserProfileResponse;

@FeignClient(name = "Auth-service",configuration = FeignClientConfig.class)
public interface AuthClient {

    @GetMapping("/api/users/operators")
    List<OperatorResponse> getOperators();

    @PostMapping("/api/users/internal/customers/lookup")
    CustomerLookupResponse findCustomer(
            @RequestParam String phone,
            @RequestParam String receiverName
    );
    @GetMapping("/api/users/profile")
    UserProfileResponse getCurrentUser();
}