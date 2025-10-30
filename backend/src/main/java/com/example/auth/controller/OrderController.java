package com.example.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.auth.entity.OrderEntity;
import com.example.auth.repository.OrderRepository;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepo;

    // ✅ GET all orders
    @GetMapping
    public List<OrderEntity> getAllOrders() {
        return orderRepo.findAll();
    }

    // ✅ POST create new order
    @PostMapping
    public OrderEntity createOrder(@RequestBody OrderEntity order) {
        return orderRepo.save(order);
    }

    // ✅ GET order by ID
    @GetMapping("/{id}")
    public ResponseEntity<OrderEntity> getOrderById(@PathVariable Long id) {
        return orderRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
