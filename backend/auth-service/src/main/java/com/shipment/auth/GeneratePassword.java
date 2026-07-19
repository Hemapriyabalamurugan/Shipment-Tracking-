package com.shipment.auth;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
public class GeneratePassword {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String password = "Manoj123!@#";

        System.out.println("Password : " + password);
        System.out.println("BCrypt   : " + encoder.encode(password));
    }

}
