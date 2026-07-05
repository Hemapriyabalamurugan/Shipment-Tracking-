package com.shiptrack.auth.service;

import com.shiptrack.auth.entity.PasswordResetToken;
import com.shiptrack.auth.entity.User;
import com.shiptrack.auth.exception.InvalidTokenException;
import com.shiptrack.auth.exception.ResourceNotFoundException;
import com.shiptrack.auth.repository.PasswordResetTokenRepository;
import com.shiptrack.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Service for password reset flow:
 * 1. User requests reset → token generated + email sent
 * 2. User clicks link → token validated → password updated
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    @Value("${app.password-reset.base-url}")
    private String resetBaseUrl;

    @Value("${app.password-reset.token-expiry-minutes}")
    private int tokenExpiryMinutes;

    @Value("${spring.mail.username:noreply@shiptrack.com}")
    private String fromEmail;

    /**
     * Generate a password-reset token and send it via email.
     * Does NOT reveal whether the email exists (security best practice).
     */
    @Transactional
    public void initiatePasswordReset(String email) {
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            // Silently return to prevent email enumeration attacks
            log.warn("Password reset requested for non-existent email: {}", email);
            return;
        }

        if (user.getOauthProvider() != null && user.getPasswordHash() == null) {
            log.warn("Password reset requested for OAuth2-only account: {}", email);
            return;
        }

        // Generate unique token
        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiresAt(LocalDateTime.now().plusMinutes(tokenExpiryMinutes))
                .used(false)
                .build();

        tokenRepository.save(resetToken);

        // Send email
        sendResetEmail(user.getEmail(), user.getFirstName(), token);

        log.info("Password reset token generated for user: {}", email);
    }

    /**
     * Validate the reset token and set the new password.
     */
    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new InvalidTokenException("Invalid password reset token"));

        if (resetToken.getUsed()) {
            throw new InvalidTokenException("This password reset token has already been used");
        }

        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new InvalidTokenException("This password reset token has expired");
        }

        // Update password
        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Mark token as used
        resetToken.setUsed(true);
        tokenRepository.save(resetToken);

        log.info("Password reset successful for user: {}", user.getEmail());
    }

    private void sendResetEmail(String toEmail, String firstName, String token) {
        try {
            String resetLink = resetBaseUrl + "?token=" + token;

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("ShipTrack Pro — Password Reset Request");
            message.setText(
                    "Hi " + firstName + ",\n\n" +
                    "You requested a password reset for your ShipTrack Pro account.\n\n" +
                    "Click the link below to reset your password:\n" +
                    resetLink + "\n\n" +
                    "This link will expire in " + tokenExpiryMinutes + " minutes.\n\n" +
                    "If you did not request this, please ignore this email.\n\n" +
                    "— ShipTrack Pro Team"
            );

            mailSender.send(message);
            log.info("Password reset email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send password reset email to {}: {}", toEmail, e.getMessage());
            // Don't throw — the token is still valid, user can retry
        }
    }
}
