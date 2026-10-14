package com.shipment.notification.client;

import com.shipment.auth.repository.UserRepository;
import com.shipment.notification.dto.UserProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthServiceClientImpl implements AuthServiceClient {

    private final UserRepository userRepository;

    @Override
    public UserProfileResponse getUserById(Long id) {
        return userRepository.findById(id)
                .map(u -> {
                    UserProfileResponse res = new UserProfileResponse();
                    res.setId(u.getId());
                    res.setFirstName(u.getFirstName());
                    res.setLastName(u.getLastName());
                    res.setEmail(u.getEmail());
                    res.setRole(u.getRole() != null ? u.getRole().name() : null);
                    res.setPhone(u.getPhone());
                    return res;
                })
                .orElse(null);
    }
}
