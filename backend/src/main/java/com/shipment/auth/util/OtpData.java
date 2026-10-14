package com.shipment.auth.util;


import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class OtpData {

    private final String otp;

    private final LocalDateTime expiry;
}