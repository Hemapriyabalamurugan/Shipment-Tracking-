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
                        "cloud_name", "your cloud app name will be here ",
                        "api_key", "your api ket will be here ",
                        "api_secret", "push your api secret",
                        "secure", true
                )
        );
    }
}
