package com.shipment.pod.client;

import com.shipment.auth.service.UserService;
import com.shipment.pod.dto.UserProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component("podAuthClient")
@RequiredArgsConstructor
public class PodAuthClientImpl implements AuthClient {

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
