package com.credresolv.controller;

import com.credresolv.service.BalanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/balances")
@CrossOrigin(origins = "http://localhost:3000")
public class BalanceController {
    
    @Autowired
    private BalanceService balanceService;
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Double>> getUserBalances(@PathVariable Long userId) {
        try {
            Map<String, Double> balances = balanceService.getUserBalances(userId);
            return ResponseEntity.ok(balances);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/group/{groupId}/user/{userId}")
    public ResponseEntity<Map<String, Double>> getGroupBalances(
            @PathVariable Long groupId,
            @PathVariable Long userId) {
        try {
            Map<String, Double> balances = balanceService.getGroupBalances(groupId, userId);
            return ResponseEntity.ok(balances);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/settle")
    public ResponseEntity<?> settleBalance(@RequestBody Map<String, Object> request) {
        try {
            System.out.println("=== Received settle request: " + request);
            
            // Safely extract required fields
            Object fromUserIdObj = request.get("fromUserId");
            Object toUserIdObj = request.get("toUserId");
            Object amountObj = request.get("amount");
            Object groupIdObj = request.get("groupId");
            
            if (fromUserIdObj == null || toUserIdObj == null || amountObj == null) {
                throw new RuntimeException("Missing required fields: fromUserId, toUserId, or amount");
            }
            
            Long fromUserId = Long.valueOf(fromUserIdObj.toString());
            Long toUserId = Long.valueOf(toUserIdObj.toString());
            Double amount = Double.valueOf(amountObj.toString());
            
            // Handle optional groupId
            Long groupId = null;
            if (groupIdObj != null && !groupIdObj.toString().isEmpty() && !"null".equals(groupIdObj.toString())) {
                groupId = Long.valueOf(groupIdObj.toString());
            }
            
            System.out.println("=== Parsed: from=" + fromUserId + ", to=" + toUserId + ", amount=" + amount + ", group=" + groupId);
            
            balanceService.settleBalance(fromUserId, toUserId, groupId, amount);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Balance settled successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("=== ERROR settling balance ===");
            e.printStackTrace();
            
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
