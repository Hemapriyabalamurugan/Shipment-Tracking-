//package com.shipment.shipmentmanagement.config;
//
//import feign.RequestInterceptor;
//import jakarta.servlet.http.HttpServletRequest;
//import lombok.RequiredArgsConstructor;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//@Configuration
//@RequiredArgsConstructor
//public class FeignClientConfig {
//
//    private final HttpServletRequest request;
//
//    @Bean
//    public RequestInterceptor requestInterceptor() {
//
//        return template -> {
//
//            String authorization =
//                    request.getHeader("Authorization");
//
//            if (authorization != null &&
//                    authorization.startsWith("Bearer ")) {
//
//                template.header(
//                        "Authorization",
//                        authorization
//                );
//            }
//        };
//    }
//}
package com.shipment.shipmentmanagement.config;

import feign.RequestInterceptor;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Configuration
public class FeignClientConfig {

    @Bean
    public RequestInterceptor requestInterceptor() {

        return requestTemplate -> {

            RequestAttributes attributes =
                    RequestContextHolder.getRequestAttributes();

            if (attributes instanceof ServletRequestAttributes servletAttributes) {

                HttpServletRequest request =
                        servletAttributes.getRequest();

                String token =
                        request.getHeader("Authorization");

                if (token != null) {

                    requestTemplate.header(
                            "Authorization",
                            token
                    );
                }
            }
        };
    }
}