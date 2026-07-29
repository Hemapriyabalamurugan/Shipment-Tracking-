package com.shipment.shipmentmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients
@SpringBootApplication
public class ShipmentManagementServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShipmentManagementServiceApplication.class, args);
    }

}
