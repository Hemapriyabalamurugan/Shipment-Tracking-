//package com.shipment.analyticsreport;
//
//public class AnalyticsReportingServiceApplication {
//}
//import org.springframework.boot.SpringApplication;
//import org.springframework.boot.autoconfigure.SpringBootApplication;
//
//@SpringBootApplication
//public class AnalyticsReportServiceApplication {
//
//    public static void main(String[] args) {
//        SpringApplication.run(AnalyticsReportServiceApplication.class, args);
//    }
//
//}
package com.shipment.analyticsreport;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class AnalyticsReportingServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(
                AnalyticsReportingServiceApplication.class,
                args
        );
    }
}
