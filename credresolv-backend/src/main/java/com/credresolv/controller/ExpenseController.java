package com.credresolv.controller;

import com.credresolv.entity.Expense;
import com.credresolv.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "http://localhost:3000")
public class ExpenseController {
    
    @Autowired
    private ExpenseService expenseService;
    
    @PostMapping
    public ResponseEntity<?> addExpense(@RequestBody Map<String, Object> request) {
        try {
            System.out.println("=== Received expense request: " + request);
            
            // Handle optional groupId (can be null or empty string)
            Long groupId = null;
            Object groupIdObj = request.get("groupId");
            if (groupIdObj != null && !groupIdObj.toString().isEmpty() && !"null".equals(groupIdObj.toString())) {
                groupId = Long.valueOf(groupIdObj.toString());
            }
            
            Long paidByUserId = Long.valueOf(request.get("paidByUserId").toString());
            String description = request.get("description").toString();
            Double amount = Double.valueOf(request.get("amount").toString());
            Expense.SplitType splitType = Expense.SplitType.valueOf(request.get("splitType").toString());
            
            // Convert splitData - handle String keys from JSON
            Map<Long, Double> splitData = new HashMap<>();
            
            Object splitDataObj = request.get("splitData");
            if (splitDataObj != null && splitDataObj instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> rawSplitData = (Map<String, Object>) splitDataObj;
                
                for (Map.Entry<String, Object> entry : rawSplitData.entrySet()) {
                    // Convert String key to Long
                    Long userId = Long.valueOf(entry.getKey());
                    // Convert value to Double (handle Integer, String, Double, etc.)
                    Double value = 0.0;
                    if (entry.getValue() != null) {
                        if (entry.getValue() instanceof Number) {
                            value = ((Number) entry.getValue()).doubleValue();
                        } else {
                            value = Double.valueOf(entry.getValue().toString());
                        }
                    }
                    splitData.put(userId, value);
                }
            }
            
            System.out.println("=== Parsed - GroupId: " + groupId + ", SplitData: " + splitData);
            
            Expense expense = expenseService.addExpense(
                groupId, paidByUserId, description, amount, splitType, splitData
            );
            
            return ResponseEntity.status(HttpStatus.CREATED).body(expense);
        } catch (Exception e) {
            System.err.println("=== ERROR adding expense ===");
            e.printStackTrace();
            
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses() {
        List<Expense> expenses = expenseService.getAllExpenses();
        return ResponseEntity.ok(expenses);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getExpense(@PathVariable Long id) {
        try {
            Expense expense = expenseService.getExpense(id);
            return ResponseEntity.ok(expense);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<Expense>> getGroupExpenses(@PathVariable Long groupId) {
        try {
            List<Expense> expenses = expenseService.getGroupExpenses(groupId);
            return ResponseEntity.ok(expenses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Expense>> getUserExpenses(@PathVariable Long userId) {
        try {
            List<Expense> expenses = expenseService.getUserExpenses(userId);
            return ResponseEntity.ok(expenses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExpense(@PathVariable Long id) {
        try {
            expenseService.deleteExpense(id);
            return ResponseEntity.ok("Expense deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Expense not found");
        }
    }
}
