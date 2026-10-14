//package com.shipment.auth.entity;
//
//import com.shipment.auth.enums.UserRole;
//import jakarta.persistence.*;
//import lombok.*;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "users")
//@Getter
//@Setter
//@Builder
//@NoArgsConstructor
//@AllArgsConstructor
//public class User {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
////    @Column(nullable = false)
////    private String fullName;
//    private String firstName;
//    private String lastName;
//
//    @Column(unique = true)
//    private String username;
//
//    @Column(nullable = false, unique = true)
//    private String email;
//
//    @Column(nullable = false, unique = true)
//    private String phone;
//
//    @Column(nullable = false)
//    private String address;
//
//    private String companyName;
//
//    @Column(nullable = false)
//    private String passwordHash;
//
//    @Enumerated(EnumType.STRING)
//    @Column(nullable = false)
//    private UserRole role;
//
////    new thing added
//    private String loginOtp;
//
//    private LocalDateTime loginOtpExpiry;
//
////    ================================
//
//    @Builder.Default
//    private Boolean emailVerified = false;
//
//    @Builder.Default
//    private Boolean phoneVerified = false;
//
//    @Builder.Default
//    private Boolean active = false;
//
//    private LocalDateTime createdAt;
//
//    private LocalDateTime updatedAt;
//
//    @PrePersist
//    public void prePersist() {
//        createdAt = LocalDateTime.now();
//        updatedAt = LocalDateTime.now();
//    }
//
//    @PreUpdate
//    public void preUpdate() {
//        updatedAt = LocalDateTime.now();
//    }
//
//}
package com.shipment.auth.entity;

import com.shipment.auth.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "phone")
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Column(name = "profile_image")
    private String profileImage;

    @Column(name = "company_id")
    private Long companyId;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean active = true;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    @Column(name = "address")
    private String address;
    @Column(name = "company_name")
    private String companyName;

    @PrePersist
    public void prePersist() {
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}