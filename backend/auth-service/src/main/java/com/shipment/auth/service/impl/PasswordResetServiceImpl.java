package com.shipment.auth.service.impl;

import com.shipment.auth.dto.request.ForgotPasswordRequest;
import com.shipment.auth.dto.request.ResetPasswordRequest;
import com.shipment.auth.entity.PasswordResetToken;
import com.shipment.auth.entity.User;
import com.shipment.auth.repository.PasswordResetTokenRepository;
import com.shipment.auth.repository.UserRepository;
import com.shipment.auth.service.EmailService;
import com.shipment.auth.service.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PasswordResetServiceImpl
        implements PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Override
    public void forgotPassword(
            ForgotPasswordRequest request
    ) {

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );

        // Generate a new token every time the user
        // requests a password reset.
        String resetToken = UUID.randomUUID().toString();

        PasswordResetToken token =
                passwordResetTokenRepository
                        .findByUser(user)
                        .orElse(
                                PasswordResetToken.builder()
                                        .user(user)
                                        .build()
                        );

        token.setResetToken(resetToken);
        token.setExpiryTime(
                LocalDateTime.now().plusMinutes(15)
        );

        passwordResetTokenRepository.save(token);

        // For local development.
        // Later this URL should come from application configuration.
        String resetLink =
                "http://localhost:5173/reset-password?token="
                        + resetToken;

        String userName =
                user.getFirstName() != null
                        ? user.getFirstName()
                        : "User";

//        String emailBody =
//                "Hello " + userName + ",\n\n"
//                        + "We received a request to reset your ShipTrack Pro password.\n\n"
//                        + "Use the link below to create a new password:\n\n"
//                        + resetLink
//                        + "\n\nThis link will expire in 15 minutes."
//                        + "\n\nIf you did not request a password reset, "
//                        + "you can safely ignore this email."
//                        + "\n\nRegards,\n"
//                        + "ShipTrack Pro Team";
//
//        emailService.sendEmail(
//                user.getEmail(),
//                "Reset your ShipTrack Pro password",
//                emailBody
//        );

        String emailBody =
                """
                <!DOCTYPE html>
                <html>
                <body style="
                    margin: 0;
                    padding: 0;
                    background-color: #f4f6f8;
                    font-family: Arial, sans-serif;
                ">
        
                    <div style="
                        max-width: 600px;
                        margin: 40px auto;
                        background-color: #ffffff;
                        border-radius: 12px;
                        padding: 40px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                    ">
        
                        <h2 style="
                            color: #0f172a;
                            margin-bottom: 20px;
                        ">
                            Reset Your Password
                        </h2>
        
                        <p style="
                            color: #475569;
                            font-size: 15px;
                            line-height: 1.6;
                        ">
                            Hello %s,
                        </p>
        
                        <p style="
                            color: #475569;
                            font-size: 15px;
                            line-height: 1.6;
                        ">
                            We received a request to reset your
                            ShipTrack Pro password.
                        </p>
        
                        <p style="
                            color: #475569;
                            font-size: 15px;
                            line-height: 1.6;
                        ">
                            Click the button below to create a new password.
                        </p>
        
                        <div style="
                            text-align: center;
                            margin: 32px 0;
                        ">
        
                            <a href="%s"
                               style="
                                   display: inline-block;
                                   background-color: #2563eb;
                                   color: #ffffff;
                                   text-decoration: none;
                                   padding: 14px 28px;
                                   border-radius: 8px;
                                   font-size: 15px;
                                   font-weight: bold;
                               ">
                                Reset Password
                            </a>
        
                        </div>
        
                        <p style="
                            color: #64748b;
                            font-size: 13px;
                            line-height: 1.6;
                        ">
                            This password reset link will expire in
                            <strong>15 minutes</strong>.
                        </p>
        
                        <p style="
                            color: #64748b;
                            font-size: 13px;
                            line-height: 1.6;
                        ">
                            If you did not request a password reset,
                            you can safely ignore this email.
                        </p>
        
                        <hr style="
                            border: none;
                            border-top: 1px solid #e2e8f0;
                            margin: 30px 0;
                        ">
        
                        <p style="
                            color: #94a3b8;
                            font-size: 12px;
                        ">
                            Regards,<br>
                            ShipTrack Pro Team
                        </p>
        
                    </div>
        
                </body>
                </html>
                """.formatted(
                        userName,
                        resetLink
                );

        emailService.sendHtmlEmail(
                user.getEmail(),
                "Reset your ShipTrack Pro password",
                emailBody
        );
    }

    @Override
    public void resetPassword(
            ResetPasswordRequest request
    ) {

        if (!request.getNewPassword().equals(
                request.getConfirmPassword()
        )) {
            throw new IllegalArgumentException(
                    "Passwords do not match"
            );
        }

        PasswordResetToken token =
                passwordResetTokenRepository
                        .findByResetToken(
                                request.getToken().trim()
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Invalid password reset link"
                                )
                        );

        if (token.getExpiryTime() == null ||
                token.getExpiryTime()
                        .isBefore(LocalDateTime.now())) {

            passwordResetTokenRepository.delete(token);

            throw new IllegalArgumentException(
                    "Password reset link has expired"
            );
        }

        User user = token.getUser();

        user.setPasswordHash(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);

        // Token can only be used once.
        passwordResetTokenRepository.delete(token);
    }
}