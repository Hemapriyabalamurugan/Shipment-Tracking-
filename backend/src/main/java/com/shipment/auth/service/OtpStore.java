package com.shipment.auth.service;


import com.shipment.auth.util.OtpData;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
@Service
public class OtpStore {

    private final Map<String, OtpData> store =
            new ConcurrentHashMap<>();

    public void save(String email,
                     String otp,
                     LocalDateTime expiry) {

        store.put(email,
                new OtpData(otp, expiry));
    }

    public OtpData get(String email) {
        return store.get(email);
    }

    public void remove(String email) {
        store.remove(email);
    }
}
