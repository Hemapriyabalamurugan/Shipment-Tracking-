package com.shipment.analytics.client;

import com.shipment.analytics.dto.response.UserProfileResponse;
import com.shipment.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component("analyticsAuthClient")
@RequiredArgsConstructor
public class AnalyticsAuthClientImpl implements AuthClient {

    private final UserService userService;

    @Override
    public UserProfileResponse getCurrentUser() {
        var u = userService.getCurrentUser();
        if (u == null) return null;
        UserProfileResponse res = new UserProfileResponse();
        res.setId(u.getId());
        res.setFirstName(u.getFirstName());
        res.setLastName(u.getLastName());
        res.setEmail(u.getEmail());
        res.setRole(u.getRole());
        res.setPhone(u.getPhone());
        return res;
    }
}
