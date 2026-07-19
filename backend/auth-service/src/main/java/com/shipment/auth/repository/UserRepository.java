package com.shipment.auth.repository;

import com.shipment.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import com.shipment.auth.enums.UserRole;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByPhone(String phone);



    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);


    long countByRole(UserRole role);

    long countByActive(Boolean active);
}