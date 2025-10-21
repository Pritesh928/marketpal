package com.example.auth.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String category;

    // ✅ Allow null temporarily to prevent 500 if frontend sends empty price
    @Column
    private Double price;

    private String conditionType;

    // ✅ Optional image (no null restriction)
    private String imageUrl;
}
