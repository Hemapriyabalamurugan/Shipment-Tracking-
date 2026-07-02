package com.shiptrackpro;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class Demo {
    @GetMapping("/hello")
    public String sayHello() {
        return " hey i am manoj";
    }
}
