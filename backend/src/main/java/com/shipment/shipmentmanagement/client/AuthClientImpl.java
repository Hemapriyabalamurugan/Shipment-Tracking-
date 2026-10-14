package com.shipment.shipmentmanagement.client;

import com.shipment.auth.service.UserService;
import com.shipment.shipmentmanagement.dto.CustomerLookupResponse;
import com.shipment.shipmentmanagement.dto.OperatorResponse;
import com.shipment.shipmentmanagement.dto.UserProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component("shipmentManagementAuthClient")
@RequiredArgsConstructor
public class AuthClientImpl implements AuthClient {

    private final UserService userService;

    @Override
    public List<OperatorResponse> getOperators() {
        var ops = userService.getOperators();
        if (ops == null) {
            return Collections.emptyList();
        }
        return ops.stream()
                .map(o -> OperatorResponse.builder()
                        .id(o.getId())
                        .firstName(o.getFirstName())
                        .lastName(o.getLastName())
                        .build())
                .toList();
    }

    @Override
    public CustomerLookupResponse findCustomer(String phone, String receiverName) {
        var res = userService.findCustomer(phone, receiverName);
        CustomerLookupResponse lookup = new CustomerLookupResponse();
        if (res != null) {
            lookup.setId(res.getId());
        }
        return lookup;
    }

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
