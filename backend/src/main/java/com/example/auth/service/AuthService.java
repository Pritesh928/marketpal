package com.example.auth.service;

import com.example.auth.dto.LoginRequest;
import com.example.auth.dto.RegisterRequest;
import com.example.auth.entity.LoginRecord;
import com.example.auth.entity.UserEntity;
import com.example.auth.repository.LoginRecordRepository;
import com.example.auth.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;


@Service
public class AuthService {

    private final UserRepository userRepository;
    private final LoginRecordRepository loginRecordRepository;

    public AuthService(UserRepository userRepository, LoginRecordRepository loginRecordRepository) {
        this.userRepository = userRepository;
        this.loginRecordRepository = loginRecordRepository;
    }

    public void register(RegisterRequest req) {
        String username = req.getUsername();
        if (username == null || username.isBlank()) throw new RuntimeException("Username required");
        UserEntity existing = userRepository.findByUsername(username);
        if (existing != null) throw new RuntimeException("Username already taken");

        UserEntity u = new UserEntity();
        u.setUsername(username);
        u.setFullName(req.getFullName());
        String hashed = BCrypt.hashpw(req.getPassword() == null ? "" : req.getPassword(), BCrypt.gensalt(12));
        u.setPassword(hashed);
        userRepository.save(u);
    }
    public Long login(LoginRequest req) {
        UserEntity user = userRepository.findByUsername(req.getUsername());
        if (user == null) throw new RuntimeException("Invalid credentials");
        boolean ok = BCrypt.checkpw(req.getPassword() == null ? "" : req.getPassword(), user.getPassword());
        if (!ok) throw new RuntimeException("Invalid credentials");

        // record login
        LoginRecord record = new LoginRecord();
        record.setUserId(user.getId());
        loginRecordRepository.save(record);

        return user.getId();
    }
    }
