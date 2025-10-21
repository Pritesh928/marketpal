package com.example.auth.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:3000") // Allow React dev server
public class PaymentController {

    @PostMapping("/create-order")
    public Map<String, Object> createOrder(@RequestBody Map<String, Object> data) {
        Map<String, Object> response = new HashMap<>();

        try {
            
            String keyId = "rzp_test_RVdaZ7GpzFReUR";
            String keySecret = "cgeLbSQJDW58ICkQbk1bVbu5"; 

            // ✅ Validate amount
            Object amountObj = data.get("amount");
            if (amountObj == null) {
                response.put("error", "Amount is required");
                return response;
            }

            // ✅ Convert ₹ → paise (Razorpay expects integer)
            double amountInRupees = Double.parseDouble(amountObj.toString());
            int amountInPaise = (int) Math.round(amountInRupees * 100);

            // ✅ Create Razorpay client
            RazorpayClient client = new RazorpayClient(keyId, keySecret);

            // ✅ Prepare order data
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

            // ✅ Create order
            Order order = client.orders.create(orderRequest);

            // ✅ Return response to frontend
            response.put("id", order.get("id"));
            response.put("amount", order.get("amount"));
            response.put("currency", order.get("currency"));
            response.put("status", order.get("status"));
            response.put("key", keyId); // Optional: for client-side prefill

        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", "Failed to create Razorpay order: " + e.getMessage());
        }

        return response;
    }
}
