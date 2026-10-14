package com.shipment.auth.repository;

import com.shipment.auth.entity.VerificationToken;
import com.shipment.auth.enums.VerificationType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VerificationTokenRepository
        extends JpaRepository<VerificationToken, Long> {

    Optional<VerificationToken> findByUserIdAndOtpAndType(
            Long userId,
            String otp,
            VerificationType type
    );
}