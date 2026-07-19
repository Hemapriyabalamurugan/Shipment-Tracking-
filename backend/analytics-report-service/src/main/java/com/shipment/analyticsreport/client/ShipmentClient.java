//package com.shipment.analyticsreport.client;
//
//import org.springframework.cloud.openfeign.FeignClient;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//
//@FeignClient(name = "SHIPMENTMANAGEMENT-SERVICE")
//public interface ShipmentClient {
//
//    @GetMapping("/api/shipments/customer/{customerId}/count")
//    Long getShipmentCount(
//            @PathVariable Long customerId
//    );
//
//}
package com.shipment.analyticsreport.client;

import com.shipment.analyticsreport.dto.ShipmentAnalyticsDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import com.shipment.analyticsreport.dto.CustomerShipmentAnalyticsDto;
import org.springframework.web.bind.annotation.PathVariable;
import com.shipment.analyticsreport.dto.BusinessShipmentAnalyticsDto;

@FeignClient(name = "SHIPMENTMANAGEMENT-SERVICE")
public interface ShipmentClient {

    @GetMapping("/api/shipments/analytics/summary")
    ShipmentAnalyticsDto getShipmentAnalytics();

    @GetMapping("/api/shipments/analytics/customer/{customerId}")
    CustomerShipmentAnalyticsDto getCustomerAnalytics(
            @PathVariable Long customerId
    );

    @GetMapping("/api/shipments/analytics/business/{businessClientId}")
    BusinessShipmentAnalyticsDto getBusinessAnalytics(
            @PathVariable Long businessClientId
    );
}