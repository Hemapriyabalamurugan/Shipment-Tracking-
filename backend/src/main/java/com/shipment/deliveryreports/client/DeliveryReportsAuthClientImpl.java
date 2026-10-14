package com.shipment.deliveryreports.client;

import com.shipment.auth.service.UserService;
import com.shipment.deliveryreports.dto.response.UserProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component("deliveryReportsAuthClient")
@RequiredArgsConstructor
public class DeliveryReportsAuthClientImpl implements AuthClient {

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
