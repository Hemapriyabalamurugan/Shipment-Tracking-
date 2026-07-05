package com.shiptrack.auth.service;

import com.shiptrack.auth.dto.request.ChangePasswordRequest;
import com.shiptrack.auth.dto.request.UpdateProfileRequest;
import com.shiptrack.auth.dto.response.UserProfileResponse;
import com.shiptrack.auth.entity.User;
import com.shiptrack.auth.entity.UserActivityLog;
import com.shiptrack.auth.exception.ResourceNotFoundException;
import com.shiptrack.auth.repository.UserActivityLogRepository;
import com.shiptrack.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for user profile management, account settings, and activity log retrieval.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final UserActivityLogRepository activityLogRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Get a user's profile by email.
     */
    public UserProfileResponse getProfile(String email) {
        User user = findByEmail(email);
        return AuthService.mapToProfileResponse(user);
    }

    /**
     * Update the authenticated user's profile (first name, last name, phone, image).
     */
    @Transactional
    public UserProfileResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = findByEmail(email);

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getProfileImageUrl() != null) {
            user.setProfileImageUrl(request.getProfileImageUrl());
        }

        user = userRepository.save(user);
        log.info("Profile updated for user: {}", email);

        return AuthService.mapToProfileResponse(user);
    }

    /**
     * Change the authenticated user's password.
     * Requires the current password for verification.
     */
    @Transactional
    public void changePassword(String email, ChangePasswordRequest request, String ipAddress, String userAgent) {
        User user = findByEmail(email);

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        // Update to new password
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Log the activity
        activityLogRepository.save(UserActivityLog.builder()
                .userId(user.getId())
                .action("PASSWORD_CHANGE")
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .build());

        log.info("Password changed for user: {}", email);
    }

    /**
     * Get paginated activity log for the authenticated user.
     */
    public Page<UserActivityLog> getActivityLog(String email, int page, int size) {
        User user = findByEmail(email);
        return activityLogRepository.findByUserIdOrderByTimestampDesc(
                user.getId(), PageRequest.of(page, size));
    }

    private User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}
