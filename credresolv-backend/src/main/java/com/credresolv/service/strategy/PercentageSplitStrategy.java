package com.credresolv.service.strategy;

import com.credresolv.entity.Expense;
import com.credresolv.entity.Split;
import com.credresolv.entity.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class PercentageSplitStrategy implements SplitStrategy {
    
    @Override
    public void split(Expense expense, List<User> participants, Map<Long, Double> splitData) {
        if (splitData == null || splitData.isEmpty()) {
            throw new RuntimeException("Split data required for percentage split");
        }
        
        double totalPercentage = splitData.values().stream().mapToDouble(Double::doubleValue).sum();
        
        if (Math.abs(totalPercentage - 100.0) > 0.01) {
            throw new RuntimeException("Percentages must sum to 100");
        }
        
        for (User user : participants) {
            Double percentage = splitData.get(user.getId());
            if (percentage == null || percentage <= 0) {
                throw new RuntimeException("Invalid percentage for user: " + user.getName());
            }
            
            double amount = (expense.getAmount() * percentage) / 100.0;
            
            Split split = new Split();
            split.setExpense(expense);
            split.setUser(user);
            split.setAmount(amount);
            split.setSettled(false);
            
            expense.getSplits().add(split);
        }
    }
}
