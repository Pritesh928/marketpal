package com.example.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.auth.entity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    UserEntity findByUsername(String username);
}
