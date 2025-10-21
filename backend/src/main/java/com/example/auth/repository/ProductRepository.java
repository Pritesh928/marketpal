package com.example.auth.repository;

import com.example.auth.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // 🔍 Search by title OR description (case-insensitive)
    List<Product> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);

    // 📦 Find by category (case-insensitive)
    List<Product> findByCategoryIgnoreCase(String category);
}
