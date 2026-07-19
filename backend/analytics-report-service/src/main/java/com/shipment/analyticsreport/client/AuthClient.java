package com.shipment.analyticsreport.client;

import com.shipment.analyticsreport.dto.UserAnalyticsDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "AUTH-SERVICE")
public interface AuthClient {

    @GetMapping("/api/auth/analytics")
    UserAnalyticsDto getUserAnalytics();
}