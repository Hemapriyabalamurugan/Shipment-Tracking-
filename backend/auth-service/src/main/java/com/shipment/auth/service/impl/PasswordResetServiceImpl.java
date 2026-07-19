package com.shipment.auth.service.impl;

import com.shipment.auth.dto.request.ForgotPasswordRequest;
import com.shipment.auth.dto.request.ResetPasswordRequest;
import com.shipment.auth.dto.request.VerifyResetOtpRequest;
import com.shipment.auth.entity.PasswordResetToken;
import com.shipment.auth.entity.User;
import com.shipment.auth.repository.PasswordResetTokenRepository;
import com.shipment.auth.repository.UserRepository;
import com.shipment.auth.service.PasswordResetService;
import com.shipment.auth.util.OtpGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.shipment.auth.service.EmailService;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class PasswordResetServiceImpl
        implements PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpGenerator otpGenerator;
    private final EmailService emailService;
    @Override
    public void forgotPassword(
            ForgotPasswordRequest request
    ) {

        User user = userRepository.findByEmail(
                request.getEmail().trim().toLowerCase()
        ).orElseThrow(() ->
                new IllegalArgumentException(
                        "User not found"
                )
        );

//        passwordResetTokenRepository.deleteByUser(user);
//
//        String otp = otpGenerator.generateOtp();
//
//        PasswordResetToken token =
//                PasswordResetToken.builder()
//                        .user(user)
//                        .otp(otp)
//                        .expiryTime(
//                                LocalDateTime.now()
//                                        .plusMinutes(10)
//                        )
//                        .verified(false)
//                        .build();
//
//        passwordResetTokenRepository.save(token);

        String otp = otpGenerator.generateOtp();

        PasswordResetToken token =
                passwordResetTokenRepository
                        .findByUser(user)
                        .orElse(
                                PasswordResetToken.builder()
                                        .user(user)
                                        .build()
                        );

        token.setOtp(otp);
        token.setExpiryTime(
                LocalDateTime.now().plusMinutes(10)
        );
        token.setVerified(false);

        passwordResetTokenRepository.save(token);

//        System.out.println(
//                "PASSWORD RESET OTP = " + otp
//        );
        System.out.println("RESET OTP = " + otp);
        System.out.println("EMAIL = " + user.getEmail());
        emailService.sendEmail(
                user.getEmail(),
                "Password Reset OTP",
                "Your password reset OTP is: "
                        + otp
                        + "\n\nThis OTP will expire in 10 minutes."
        );
    }

    @Override
    public void verifyResetOtp(
            VerifyResetOtpRequest request
    ) {

        User user = userRepository.findByEmail(
                request.getEmail().trim().toLowerCase()
        ).orElseThrow(() ->
                new IllegalArgumentException(
                        "User not found"
                )
        );

        PasswordResetToken token =
                passwordResetTokenRepository
                        .findByUserAndOtp(
                                user,
                                request.getOtp().trim()
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Invalid OTP"
                                )
                        );

        if (token.getExpiryTime()
                .isBefore(LocalDateTime.now())) {

            throw new IllegalArgumentException(
                    "OTP has expired"
            );
        }

        token.setVerified(true);

        passwordResetTokenRepository.save(token);
    }

    @Override
    public void resetPassword(
            ResetPasswordRequest request
    ) {

        User user = userRepository.findByEmail(
                request.getEmail().trim().toLowerCase()
        ).orElseThrow(() ->
                new IllegalArgumentException(
                        "User not found"
                )
        );

        PasswordResetToken token =
                passwordResetTokenRepository
                        .findByUser(user)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Reset OTP not verified"
                                )
                        );

        if (!Boolean.TRUE.equals(
                token.getVerified()
        )) {

            throw new IllegalArgumentException(
                    "Reset OTP not verified"
            );
        }

        user.setPasswordHash(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);

        passwordResetTokenRepository.delete(token);
    }
}