package com.example.auth.service;

import com.example.auth.entity.Admin;
import com.example.auth.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    public Admin registerAdmin(Admin admin) {
        // Optional: hash password here with BCryptPasswordEncoder
        return adminRepository.save(admin);
    }

    public boolean authenticate(String username, String password) {
        Optional<Admin> adminOpt = adminRepository.findByUsername(username);
        return adminOpt.map(admin -> admin.getPassword().equals(password)).orElse(false);
    }
}
