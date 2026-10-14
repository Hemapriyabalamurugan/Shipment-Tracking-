package com.shipment.deliveryreports;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class DeliveryReportsServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(DeliveryReportsServiceApplication.class, args);
    }
}
