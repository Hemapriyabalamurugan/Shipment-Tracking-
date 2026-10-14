package com.shipment.auth.repository;

import com.shipment.auth.entity.RefreshToken;
import com.shipment.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository
        extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(
            String token
    );

    Optional<RefreshToken> findByUser(
            User user
    );

    void deleteByUser(
            User user
    );
}