package com.shiptrack.auth.service;

import com.shiptrack.auth.dto.request.LoginRequest;
import com.shiptrack.auth.dto.request.RegisterRequest;
import com.shiptrack.auth.dto.response.AuthResponse;
import com.shiptrack.auth.dto.response.UserProfileResponse;
import com.shiptrack.auth.entity.User;
import com.shiptrack.auth.entity.UserActivityLog;
import com.shiptrack.auth.entity.enums.UserRole;
import com.shiptrack.auth.exception.ResourceNotFoundException;
import com.shiptrack.auth.exception.UserAlreadyExistsException;
import com.shiptrack.auth.repository.UserActivityLogRepository;
import com.shiptrack.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Core authentication service handling registration, login, and OAuth2 flows.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final UserActivityLogRepository activityLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    /**
     * Register a new user with email and BCrypt-hashed password.
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check for duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("An account with email '" + request.getEmail() + "' already exists");
        }

        // Determine role — default to CUSTOMER
        UserRole role = UserRole.CUSTOMER;
        if (request.getRole() != null && !request.getRole().isBlank()) {
            try {
                role = UserRole.valueOf(request.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid role: " + request.getRole());
            }
        }

        // Build and save user
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(role)
                .isActive(true)
                .build();

        user = userRepository.save(user);
        log.info("New user registered: {} ({})", user.getEmail(), user.getRole());

        // Generate tokens
        return buildAuthResponse(user);
    }

    /**
     * Authenticate a user with email/password and return JWT tokens.
     */
    @Transactional
    public AuthResponse login(LoginRequest request, String ipAddress, String userAgent) {
        // Authenticate via Spring Security's AuthenticationManager
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Update last login timestamp
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        // Log the login activity
        logActivity(user.getId(), "LOGIN", ipAddress, userAgent);

        log.info("User logged in: {}", user.getEmail());
        return buildAuthResponse(user);
    }

    /**
     * Get the currently authenticated user's profile.
     */
    public UserProfileResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return mapToProfileResponse(user);
    }

    /**
     * Handle Google OAuth2 login. Creates a new user if first-time, otherwise logs in.
     */
    @Transactional
    public AuthResponse handleOAuth2Login(String email, String name, String oauthProviderId,
                                           String profileImageUrl, String ipAddress, String userAgent) {
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            // First-time OAuth2 user — create account
            // Split the name into first/last (best effort)
            String firstName = name;
            String lastName = "";
            if (name != null && name.contains(" ")) {
                int spaceIndex = name.indexOf(" ");
                firstName = name.substring(0, spaceIndex);
                lastName = name.substring(spaceIndex + 1);
            }

            user = User.builder()
                    .firstName(firstName)
                    .lastName(lastName)
                    .email(email.toLowerCase().trim())
                    .role(UserRole.CUSTOMER)
                    .oauthProvider("GOOGLE")
                    .oauthProviderId(oauthProviderId)
                    .profileImageUrl(profileImageUrl)
                    .isActive(true)
                    .build();
            user = userRepository.save(user);
            log.info("New OAuth2 user registered: {} via GOOGLE", user.getEmail());
        } else {
            // Existing user — update OAuth2 details if needed
            if (user.getOauthProvider() == null) {
                user.setOauthProvider("GOOGLE");
                user.setOauthProviderId(oauthProviderId);
                userRepository.save(user);
            }
        }

        // Update last login timestamp
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        logActivity(user.getId(), "OAUTH2_LOGIN", ipAddress, userAgent);

        return buildAuthResponse(user);
    }

    // ── Helpers ──

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());
        String refreshToken = jwtService.generateRefreshToken(user.getId(), user.getEmail());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtService.getAccessTokenExpirySeconds())
                .user(mapToProfileResponse(user))
                .build();
    }

    public static UserProfileResponse mapToProfileResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .profileImageUrl(user.getProfileImageUrl())
                .isActive(user.getIsActive())
                .lastLogin(user.getLastLogin())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    private void logActivity(Long userId, String action, String ipAddress, String userAgent) {
        UserActivityLog logEntry = UserActivityLog.builder()
                .userId(userId)
                .action(action)
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .build();
        activityLogRepository.save(logEntry);
    }
}
