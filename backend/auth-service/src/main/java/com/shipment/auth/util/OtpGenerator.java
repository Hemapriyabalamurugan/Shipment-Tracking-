package com.shipment.auth.util;

import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class OtpGenerator {

    public String generateOtp() {

        return String.valueOf(
                100000 + new Random().nextInt(900000)
        );
    }
}