package com.shipment.pod;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients
@SpringBootApplication
public class PodServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(PodServiceApplication.class, args);
    }

}
