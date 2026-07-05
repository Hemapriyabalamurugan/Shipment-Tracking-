package com.shiptrack.auth.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    // Base64-encoded 256-bit test secret
    private static final String TEST_SECRET = "VGhpc0lzQVRlc3RTZWNyZXRLZXlGb3JKV1RTaWduaW5nSXRNdXN0QmVBdExlYXN0MjU2Qml0cw==";

    private UUID testUserId;
    private String testEmail;
    private String testRole;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "jwtSecret", TEST_SECRET);
        ReflectionTestUtils.setField(jwtService, "accessTokenExpiry", 900000L);   // 15 min
        ReflectionTestUtils.setField(jwtService, "refreshTokenExpiry", 604800000L); // 7 days

        testUserId = UUID.randomUUID();
        testEmail = "test@example.com";
        testRole = "CUSTOMER";
    }

    @Test
    @DisplayName("Should generate a valid access token")
    void generateAccessToken_ShouldReturnValidToken() {
        String token = jwtService.generateAccessToken(testUserId, testEmail, testRole);

        assertThat(token).isNotNull().isNotEmpty();
        assertThat(jwtService.extractEmail(token)).isEqualTo(testEmail);
        assertThat(jwtService.extractUserId(token)).isEqualTo(testUserId.toString());
        assertThat(jwtService.extractRole(token)).isEqualTo(testRole);
    }

    @Test
    @DisplayName("Should generate a valid refresh token")
    void generateRefreshToken_ShouldReturnValidToken() {
        String token = jwtService.generateRefreshToken(testUserId, testEmail);

        assertThat(token).isNotNull().isNotEmpty();
        assertThat(jwtService.extractEmail(token)).isEqualTo(testEmail);
        assertThat(jwtService.extractUserId(token)).isEqualTo(testUserId.toString());
    }

    @Test
    @DisplayName("Should validate token against matching UserDetails")
    void isTokenValid_ShouldReturnTrue_WhenTokenMatchesUser() {
        String token = jwtService.generateAccessToken(testUserId, testEmail, testRole);

        UserDetails userDetails = new User(
                testEmail, "password",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_CUSTOMER"))
        );

        assertThat(jwtService.isTokenValid(token, userDetails)).isTrue();
    }

    @Test
    @DisplayName("Should reject token with wrong email")
    void isTokenValid_ShouldReturnFalse_WhenEmailDoesNotMatch() {
        String token = jwtService.generateAccessToken(testUserId, testEmail, testRole);

        UserDetails userDetails = new User(
                "different@example.com", "password",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_CUSTOMER"))
        );

        assertThat(jwtService.isTokenValid(token, userDetails)).isFalse();
    }

    @Test
    @DisplayName("Should detect expired token")
    void isTokenExpired_ShouldReturnTrue_WhenTokenIsExpired() {
        // Set expiry to -1ms (immediately expired)
        ReflectionTestUtils.setField(jwtService, "accessTokenExpiry", -1L);
        String token = jwtService.generateAccessToken(testUserId, testEmail, testRole);

        assertThat(jwtService.isTokenExpired(token)).isTrue();
    }

    @Test
    @DisplayName("Should return correct expiry in seconds")
    void getAccessTokenExpirySeconds_ShouldReturnCorrectValue() {
        assertThat(jwtService.getAccessTokenExpirySeconds()).isEqualTo(900L);
    }
}
