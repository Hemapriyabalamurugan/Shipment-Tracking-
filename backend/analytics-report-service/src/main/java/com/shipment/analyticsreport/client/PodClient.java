package com.shipment.analyticsreport.client;

import com.shipment.analyticsreport.dto.PodAnalyticsDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "POD-SERVICE")
public interface PodClient {

    @GetMapping("/api/pod/analytics")
    PodAnalyticsDto getAnalytics();
}