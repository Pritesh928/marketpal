package com.example.auth.repository;

import com.example.auth.entity.LoginRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoginRecordRepository extends JpaRepository<LoginRecord, Long> {
}
