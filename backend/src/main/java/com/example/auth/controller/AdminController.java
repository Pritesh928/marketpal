package com.example.auth.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.auth.entity.OrderEntity;
import com.example.auth.entity.UserEntity;
import com.example.auth.service.AdminService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private static final String ADMIN_USERNAME = "admin";
    private static final String ADMIN_PASSWORD = "admin123";

    @Autowired
    private AdminService adminService;

    // 🔐 Admin Login
    @PostMapping("/login")
    public String login(@RequestBody AdminLoginRequest request) {
        if (ADMIN_USERNAME.equals(request.getUsername()) &&
            ADMIN_PASSWORD.equals(request.getPassword())) {
            return "SUCCESS";
        } else {
            return "FAILURE";
        }
    }

    // 📊 Dashboard stats
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    // 👥 User Management
    @GetMapping("/users")
    public ResponseEntity<List<UserEntity>> getUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    // 🧾 Order Management
    @GetMapping("/orders")
    public ResponseEntity<List<OrderEntity>> getOrders() {
        return ResponseEntity.ok(adminService.getAllOrders());
    }

    // DTO inside or move to dto/AdminLoginRequest.java
    public static class AdminLoginRequest {
        private String username;
        private String password;
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
