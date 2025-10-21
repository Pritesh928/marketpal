package com.example.auth.service;

import com.example.auth.entity.Product;
import com.example.auth.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    // ✅ Get all products
    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    // ✅ Search by title OR description
    public List<Product> searchProducts(String keyword) {
        return repo.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword);
    }

    // ✅ Get by category
    public List<Product> getByCategory(String category) {
        return repo.findByCategoryIgnoreCase(category);
    }

    // ✅ Get product by ID
    public Product getProduct(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("❌ Product not found with ID: " + id));
    }

    // ✅ Add product
    public Product addProduct(Product product) {
        if (product.getTitle() == null || product.getTitle().isBlank()) {
            throw new RuntimeException("❌ Title is required");
        }
        if (product.getCategory() == null || product.getCategory().isBlank()) {
            throw new RuntimeException("❌ Category is required");
        }

        // ✅ Safe default image
        if (product.getImageUrl() == null || product.getImageUrl().isBlank()) {
            product.setImageUrl("https://via.placeholder.com/300x300.png?text=No+Image");
        }

        // ✅ Safe price
        if (product.getPrice() == null) {
            product.setPrice(0.0);
        }

        return repo.save(product);
    }

    // ✅ Update product safely
    public Product updateProduct(Long id, Product updated) {
        return repo.findById(id)
                .map(existing -> {
                    if (updated.getTitle() != null && !updated.getTitle().isBlank()) {
                        existing.setTitle(updated.getTitle());
                    }
                    if (updated.getDescription() != null && !updated.getDescription().isBlank()) {
                        existing.setDescription(updated.getDescription());
                    }
                    if (updated.getCategory() != null && !updated.getCategory().isBlank()) {
                        existing.setCategory(updated.getCategory());
                    }
                    if (updated.getConditionType() != null && !updated.getConditionType().isBlank()) {
                        existing.setConditionType(updated.getConditionType());
                    }
                    if (updated.getPrice() != null) {
                        existing.setPrice(updated.getPrice());
                    }

                    // ✅ Always update image if provided
                    if (updated.getImageUrl() != null) {
                        existing.setImageUrl(
                                updated.getImageUrl().isBlank()
                                        ? "https://via.placeholder.com/300x300.png?text=No+Image"
                                        : updated.getImageUrl()
                        );
                    }

                    return repo.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("❌ Cannot update. Product not found with ID: " + id));
    }

    // ✅ Delete
    public void deleteProduct(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("❌ Product not found with ID: " + id);
        }
        repo.deleteById(id);
    }
}
