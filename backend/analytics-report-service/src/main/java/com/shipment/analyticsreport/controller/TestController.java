//package com.shipment.analyticsreport.controller;
//
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//public class TestController {
//
//    @GetMapping("/api/analytics/test")
//    public String test() {
//        return "Analytics Service Working";
//    }
//}
package com.shipment.analyticsreport.controller;

import com.shipment.analyticsreport.dto.DeliveryAnalyticsDto;
import com.shipment.analyticsreport.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TestController {

    private final DashboardService dashboardService;

    @GetMapping("/api/analytics/test")
    public String test() {
        return "Analytics Service Working";
    }

    @GetMapping("/api/analytics/test/delivery")
    public DeliveryAnalyticsDto testDeliveryAnalytics() {

        return dashboardService.getDeliveryAnalytics();
    }
}