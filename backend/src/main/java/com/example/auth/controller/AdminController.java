package com.example.auth.controller;

import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000") // Allow React app
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private static final String ADMIN_USERNAME = "admin";
    private static final String ADMIN_PASSWORD = "admin123";

    @PostMapping("/login")
    public String login(@RequestBody AdminLoginRequest request) {
        if (ADMIN_USERNAME.equals(request.getUsername()) &&
            ADMIN_PASSWORD.equals(request.getPassword())) {
            return "SUCCESS";
        } else {
            return "FAILURE";
        }
    }

    // Simple DTO class inside the same file or separate
    public static class AdminLoginRequest {
        private String username;
        private String password;

        // getters and setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
