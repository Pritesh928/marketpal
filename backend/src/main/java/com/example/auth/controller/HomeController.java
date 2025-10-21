package com.example.auth.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Rough home endpoint to be expanded later.
 */
@RestController
public class HomeController {

    @GetMapping("/home")
    public ResponseEntity<?> home(HttpSession session) {
        Object uid = session.getAttribute("userId");
        if (uid == null) {
            return ResponseEntity.status(401).body("Not logged in");
        }
        return ResponseEntity.ok().body("Welcome to your home page, user id: " + uid);
    }
}
