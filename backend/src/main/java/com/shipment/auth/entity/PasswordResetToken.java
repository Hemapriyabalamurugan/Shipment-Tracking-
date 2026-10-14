package com.shipment.auth.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "password_reset_tokens")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Builder.Default
    private String otp = "";

    private LocalDateTime expiryTime;

    @Builder.Default
    private Boolean verified = false;

    private String resetToken;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}