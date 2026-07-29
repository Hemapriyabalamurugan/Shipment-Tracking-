package com.shipment.auth.service;

import com.shipment.auth.dto.request.RegisterRequest;
import com.shipment.auth.dto.request.VerifyEmailOtpRequest;
import com.shipment.auth.dto.request.VerifyPhoneOtpRequest;
import com.shipment.auth.dto.response.ApiResponse;
import com.shipment.auth.dto.request.LoginRequest;
import com.shipment.auth.dto.response.LoginResponse;
import com.shipment.auth.dto.request.RefreshTokenRequest;
import com.shipment.auth.dto.response.RefreshTokenResponse;
import com.shipment.auth.dto.request.LogoutRequest;
import com.shipment.auth.dto.request.ChangeRoleRequest;
import com.shipment.auth.dto.request.UserAnalyticsDto;
import com.shipment.auth.dto.response.UserProfileResponse;

import com.shipment.auth.dto.request.SendLoginOtpRequest;
import com.shipment.auth.dto.request.VerifyLoginOtpRequest;

import com.shipment.auth.dto.response.LoginOtpResponse;


public interface AuthService {

    ApiResponse register(RegisterRequest request);


//    ===================
LoginOtpResponse sendLoginOtp(
        SendLoginOtpRequest request
);

    LoginResponse verifyLoginOtp(
            VerifyLoginOtpRequest request
    );
//    ========================================

//    ApiResponse verifyEmailOtp(
//            VerifyEmailOtpRequest request
//    );
//
//    ApiResponse verifyPhoneOtp(
//            VerifyPhoneOtpRequest request
//    );

    LoginResponse login(LoginRequest request);

    RefreshTokenResponse refreshToken(
            RefreshTokenRequest request
    );

    ApiResponse logout(
            LogoutRequest request
    );

    ApiResponse changeUserRole(
            Long userId,
            ChangeRoleRequest request
    );
    UserAnalyticsDto getUserAnalytics();

    UserProfileResponse getCurrentUser(String email);
    UserProfileResponse getUserById(Long id);
}