package com.shipment.auth.entity;

import com.shipment.auth.enums.VerificationType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "verification_tokens")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String otp;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationType type;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiryTime;

    @Column(nullable = false)
    private Boolean used;
}