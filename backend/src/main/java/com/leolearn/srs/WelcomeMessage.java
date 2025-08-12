package com.leolearn.srs;


import org.springframework.stereotype.Component;

@Component
public class WelcomeMessage {
    
    public String getWelcomeMessage() {
        return "Welcome to the Foo Bar application!";

    }
}
