package com.shipment.auth.repository;

import com.shipment.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import com.shipment.auth.enums.UserRole;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByPhone(String phone);



    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);


    long countByRole(UserRole role);

    long countByActive(Boolean active);
    List<User> findByRole(UserRole role);

    @Query("""
SELECT u
FROM User u
WHERE CONCAT(u.firstName, ' ', u.lastName) = :receiverName
AND u.phone = :phone
AND u.role = :role
""")
    Optional<User> findCustomer(
            @Param("phone") String phone,
            @Param("receiverName") String receiverName,
            @Param("role") UserRole role
    );
}