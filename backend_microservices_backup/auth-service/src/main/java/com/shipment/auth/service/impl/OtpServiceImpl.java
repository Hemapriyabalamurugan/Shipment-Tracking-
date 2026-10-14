package com.shipment.auth.service.impl;

import com.shipment.auth.service.OtpService;
import com.shipment.auth.util.OtpGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

    private final OtpGenerator otpGenerator;

    @Override
    public String generateOtp() {

        return otpGenerator.generateOtp();
    }
}