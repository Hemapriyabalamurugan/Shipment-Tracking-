//package com.shipment.auth.service.impl;
//
//import com.shipment.auth.dto.response.UserProfileResponse;
//import com.shipment.auth.entity.User;
//import com.shipment.auth.repository.UserRepository;
//import com.shipment.auth.service.UserService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Service;
//import com.shipment.auth.dto.request.UpdateProfileRequest;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import com.shipment.auth.dto.request.ChangePasswordRequest;
//
//@Service
//@RequiredArgsConstructor
//public class UserServiceImpl implements UserService {
//
//    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;
//
//    @Override
//    public UserProfileResponse getCurrentUser() {
//
//        Authentication authentication =
//                SecurityContextHolder
//                        .getContext()
//                        .getAuthentication();
//
//        String email = authentication.getName();
//
//        User user = userRepository
//                .findByEmail(email)
//                .orElseThrow(() ->
//                        new IllegalArgumentException(
//                                "User not found"
//                        )
//                );
//
//        return UserProfileResponse.builder()
//                .id(user.getId())
//                .firstName(user.getFirstName())
//                .lastName(user.getLastName())
//                .email(user.getEmail())
//                .phone(user.getPhone())
//                .role(user.getRole().name())
//                .build();
//    }
//
//    @Override
//    public UserProfileResponse updateProfile(
//            UpdateProfileRequest request
//    ) {
//
//        Authentication authentication =
//                SecurityContextHolder
//                        .getContext()
//                        .getAuthentication();
//
//        String email = authentication.getName();
//
//        User user = userRepository
//                .findByEmail(email)
//                .orElseThrow(() ->
//                        new IllegalArgumentException(
//                                "User not found"
//                        )
//                );
//
//        user.setFirstName(request.getFirstName());
//        user.setLastName(request.getLastName());
//        user.setPhone(request.getPhone());
//        user.setAddress(request.getAddress());
//        user.setCompanyName(request.getCompanyName());
//
//        userRepository.save(user);
//
//        return UserProfileResponse.builder()
//                .id(user.getId())
//                .firstName(user.getFirstName())
//                .lastName(user.getLastName())
//                .email(user.getEmail())
//                .phone(user.getPhone())
//                .role(user.getRole().name())
//                .build();
//    }
//
//    @Override
//    public void changePassword(
//            ChangePasswordRequest request
//    ) {
//
//        Authentication authentication =
//                SecurityContextHolder
//                        .getContext()
//                        .getAuthentication();
//
//        String email = authentication.getName();
//
//        User user = userRepository
//                .findByEmail(email)
//                .orElseThrow(() ->
//                        new IllegalArgumentException(
//                                "User not found"
//                        )
//                );
//
//        if (!passwordEncoder.matches(
//                request.getCurrentPassword(),
//                user.getPasswordHash()
//        )) {
//            throw new IllegalArgumentException(
//                    "Current password is incorrect"
//            );
//        }
//
//        if (!request.getNewPassword()
//                .equals(request.getConfirmPassword())) {
//
//            throw new IllegalArgumentException(
//                    "New password and confirm password do not match"
//            );
//        }
//
//        if (passwordEncoder.matches(
//                request.getNewPassword(),
//                user.getPasswordHash()
//        )) {
//
//            throw new IllegalArgumentException(
//                    "New password must be different from current password"
//            );
//        }
//
//        user.setPasswordHash(
//                passwordEncoder.encode(
//                        request.getNewPassword()
//                )
//        );
//
//        userRepository.save(user);
//    }
//}
package com.shipment.auth.service.impl;

import com.shipment.auth.dto.request.ChangePasswordRequest;
import com.shipment.auth.dto.request.UpdateProfileRequest;
import com.shipment.auth.dto.response.OperatorResponse;
import com.shipment.auth.dto.response.UserProfileResponse;
import com.shipment.auth.entity.User;
import com.shipment.auth.enums.UserRole;
import com.shipment.auth.repository.UserRepository;
import com.shipment.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.shipment.auth.dto.response.CustomerLookupResponse;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserProfileResponse getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );

        return UserProfileResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .build();
    }

    @Override
    public UserProfileResponse updateProfile(
            UpdateProfileRequest request
    ) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setCompanyName(request.getCompanyName());

        userRepository.save(user);

        return UserProfileResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .build();
    }

    @Override
    public void changePassword(
            ChangePasswordRequest request
    ) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPasswordHash()
        )) {
            throw new IllegalArgumentException(
                    "Current password is incorrect"
            );
        }

        if (!request.getNewPassword()
                .equals(request.getConfirmPassword())) {

            throw new IllegalArgumentException(
                    "New password and confirm password do not match"
            );
        }

        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPasswordHash()
        )) {

            throw new IllegalArgumentException(
                    "New password must be different from current password"
            );
        }

        user.setPasswordHash(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);
    }

    @Override
    public List<OperatorResponse> getOperators() {

        return userRepository
                .findByRole(UserRole.LOGISTICS_OPERATOR)
                .stream()
                .map(user ->
                        OperatorResponse.builder()
                                .id(user.getId())
                                .firstName(user.getFirstName())
                                .lastName(user.getLastName())
                                .build()
                )
                .toList();
    }

//    @Override
//    public CustomerLookupResponse findCustomer(
//            String phone,
//            String receiverName
//    ) {
//
//        String[] names = receiverName.trim().split("\\s+", 2);
//
//        String firstName = names[0];
//        String lastName = names.length > 1 ? names[1] : "";
//
//        User customer = userRepository
//                .findByPhoneAndFirstNameAndLastNameAndRole(
//                        phone,
//                        firstName,
//                        lastName,
//                        UserRole.CUSTOMER
//                )
//                .orElseThrow(() ->
//                        new RuntimeException("Customer not found"));
//
//        return CustomerLookupResponse.builder()
//                .id(customer.getId())
//                .build();
//    }
@Override
public CustomerLookupResponse findCustomer(
        String phone,
        String receiverName
) {

    User customer = userRepository
            .findCustomer(
                    phone,
                    receiverName,
                    UserRole.CUSTOMER
            )
            .orElseThrow(() ->
                    new RuntimeException("Customer not found"));

    return CustomerLookupResponse.builder()
            .id(customer.getId())
            .build();
}
}