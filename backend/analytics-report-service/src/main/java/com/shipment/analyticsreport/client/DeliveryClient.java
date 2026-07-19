package com.shipment.analyticsreport.client;

import com.shipment.analyticsreport.dto.DeliveryAnalyticsDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "DELIVERY-SERVICE")
public interface DeliveryClient {

    @GetMapping("/api/deliveries/analytics")
    DeliveryAnalyticsDto getAnalytics();
}