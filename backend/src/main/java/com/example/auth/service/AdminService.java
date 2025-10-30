package com.example.auth.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.auth.entity.OrderEntity;
import com.example.auth.entity.UserEntity;
import com.example.auth.repository.OrderRepository;
import com.example.auth.repository.ProductRepository;
import com.example.auth.repository.UserRepository;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private OrderRepository orderRepo;

    // 📊 Dashboard stats
    public Map<String, Long> getDashboardStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userRepo.count());
        stats.put("totalProducts", productRepo.count());
        stats.put("totalOrders", orderRepo.count());
        return stats;
    }

    // 👥 Fetch all users
    public List<UserEntity> getAllUsers() {
        return userRepo.findAll();
    }

    // 🧾 Fetch all orders
    public List<OrderEntity> getAllOrders() {
        return orderRepo.findAll();
    }

    // ❌ Delete a user by ID (optional for admin management)
    public void deleteUser(Long id) {
        if (userRepo.existsById(id)) {
            userRepo.deleteById(id);
        } else {
            throw new RuntimeException("User not found with ID: " + id);
        }
    }

    // ❌ Delete an order by ID (optional)
    public void deleteOrder(Long id) {
        if (orderRepo.existsById(id)) {
            orderRepo.deleteById(id);
        } else {
            throw new RuntimeException("Order not found with ID: " + id);
        }
    }
}
