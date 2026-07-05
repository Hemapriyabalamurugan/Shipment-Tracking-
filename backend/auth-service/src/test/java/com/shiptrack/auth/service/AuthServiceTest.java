package com.shiptrack.auth.service;

import com.shiptrack.auth.dto.request.LoginRequest;
import com.shiptrack.auth.dto.request.RegisterRequest;
import com.shiptrack.auth.dto.response.AuthResponse;
import com.shiptrack.auth.entity.User;
import com.shiptrack.auth.entity.enums.UserRole;
import com.shiptrack.auth.exception.UserAlreadyExistsException;
import com.shiptrack.auth.repository.UserActivityLogRepository;
import com.shiptrack.auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserActivityLogRepository activityLogRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User testUser;

    @BeforeEach
    void setUp() {
        registerRequest = RegisterRequest.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .password("password123")
                .build();

        loginRequest = LoginRequest.builder()
                .email("john@example.com")
                .password("password123")
                .build();

        testUser = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .passwordHash("$2a$10$encodedPassword")
                .role(UserRole.CUSTOMER)
                .isActive(true)
                .build();
    }

    @Test
    @DisplayName("Register — happy path, new user created successfully")
    void register_ShouldCreateUser_WhenEmailIsNew() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtService.generateAccessToken(any(), anyString(), anyString())).thenReturn("access-token");
        when(jwtService.generateRefreshToken(any(), anyString())).thenReturn("refresh-token");
        when(jwtService.getAccessTokenExpirySeconds()).thenReturn(900L);

        AuthResponse response = authService.register(registerRequest);

        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isEqualTo("access-token");
        assertThat(response.getRefreshToken()).isEqualTo("refresh-token");
        assertThat(response.getUser().getEmail()).isEqualTo("john@example.com");
        assertThat(response.getUser().getRole()).isEqualTo("CUSTOMER");

        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("Register — should throw when email already exists")
    void register_ShouldThrow_WhenEmailAlreadyExists() {
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(UserAlreadyExistsException.class)
                .hasMessageContaining("already exists");

        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Login — happy path, returns JWT tokens")
    void login_ShouldReturnTokens_WhenCredentialsAreValid() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(new UsernamePasswordAuthenticationToken("john@example.com", null));
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtService.generateAccessToken(any(), anyString(), anyString())).thenReturn("access-token");
        when(jwtService.generateRefreshToken(any(), anyString())).thenReturn("refresh-token");
        when(jwtService.getAccessTokenExpirySeconds()).thenReturn(900L);
        when(activityLogRepository.save(any())).thenReturn(null);

        AuthResponse response = authService.login(loginRequest, "127.0.0.1", "PostmanRuntime/7.0");

        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isEqualTo("access-token");
        assertThat(response.getTokenType()).isEqualTo("Bearer");
    }

    @Test
    @DisplayName("Login — should throw on invalid credentials")
    void login_ShouldThrow_WhenCredentialsAreInvalid() {
        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThatThrownBy(() -> authService.login(loginRequest, "127.0.0.1", "PostmanRuntime"))
                .isInstanceOf(BadCredentialsException.class);
    }
}
