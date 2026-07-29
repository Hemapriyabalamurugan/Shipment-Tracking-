package com.shipment.pod.config;



import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {

        return new Cloudinary(
                ObjectUtils.asMap(
                        "cloud_name", "dy9brdeew",
                        "api_key", "561136737869783",
                        "api_secret", "kyYK7ErS_h9F8Z_NY1ldYU6gALc",
                        "secure", true
                )
        );
    }
}
