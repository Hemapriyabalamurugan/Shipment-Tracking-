//package com.shipment.auth.controller;
//
//import com.shipment.auth.dto.response.UserProfileResponse;
//import com.shipment.auth.service.UserService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//import com.shipment.auth.dto.request.UpdateProfileRequest;
//import jakarta.validation.Valid;
//import org.springframework.web.bind.annotation.PutMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import com.shipment.auth.dto.request.ChangePasswordRequest;
//import org.springframework.web.bind.annotation.PostMapping;
//
//@RestController
//@RequestMapping("/api/users")
//@RequiredArgsConstructor
//public class UserController {
//
//    private final UserService userService;
//
//    @GetMapping("/profile")
//    public ResponseEntity<UserProfileResponse> getProfile() {
//
//        return ResponseEntity.ok(
//                userService.getCurrentUser()
//        );
//    }
//
//    @PutMapping("/profile")
//    public ResponseEntity<UserProfileResponse> updateProfile(
//            @Valid @RequestBody
//            UpdateProfileRequest request
//    ) {
//
//        return ResponseEntity.ok(
//                userService.updateProfile(request)
//        );
//    }
//
//    @PostMapping("/change-password")
//    public ResponseEntity<String> changePassword(
//            @Valid
//            @RequestBody
//            ChangePasswordRequest request
//    ) {
//
//        userService.changePassword(request);
//
//        return ResponseEntity.ok(
//                "Password changed successfully"
//        );
//    }
//}
package com.shipment.auth.controller;

import com.shipment.auth.dto.request.ChangePasswordRequest;
import com.shipment.auth.dto.request.UpdateProfileRequest;
import com.shipment.auth.dto.response.OperatorResponse;
import com.shipment.auth.dto.response.UserProfileResponse;
import com.shipment.auth.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.shipment.auth.dto.response.CustomerLookupResponse;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile() {

        return ResponseEntity.ok(
                userService.getCurrentUser()
        );
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @Valid
            @RequestBody
            UpdateProfileRequest request
    ) {

        return ResponseEntity.ok(
                userService.updateProfile(request)
        );
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @Valid
            @RequestBody
            ChangePasswordRequest request
    ) {

        userService.changePassword(request);

        return ResponseEntity.ok(
                "Password changed successfully"
        );
    }

    @GetMapping("/operators")
    public ResponseEntity<List<OperatorResponse>> getOperators() {

        return ResponseEntity.ok(
                userService.getOperators()
        );
    }

    @PostMapping("/internal/customers/lookup")
    public ResponseEntity<CustomerLookupResponse> findCustomer(
            @RequestParam String phone,
            @RequestParam String receiverName
    ) {

        return ResponseEntity.ok(
                userService.findCustomer(
                        phone,
                        receiverName
                )
        );
    }
}