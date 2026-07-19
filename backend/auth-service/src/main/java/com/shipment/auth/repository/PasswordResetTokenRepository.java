package com.shipment.auth.repository;

import com.shipment.auth.entity.PasswordResetToken;
import com.shipment.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository
        extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByUser(User user);

    Optional<PasswordResetToken> findByUserAndOtp(
            User user,
            String otp
    );

    void deleteByUser(User user);
}