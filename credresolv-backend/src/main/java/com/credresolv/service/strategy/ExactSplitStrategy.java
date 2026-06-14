package com.credresolv.service.strategy;

import com.credresolv.entity.Expense;
import com.credresolv.entity.Split;
import com.credresolv.entity.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class ExactSplitStrategy implements SplitStrategy {
    
    @Override
    public void split(Expense expense, List<User> participants, Map<Long, Double> splitData) {
        if (splitData == null || splitData.isEmpty()) {
            throw new RuntimeException("Split data required for exact split");
        }
        
        double totalSplit = splitData.values().stream().mapToDouble(Double::doubleValue).sum();
        
        if (Math.abs(totalSplit - expense.getAmount()) > 0.01) {
            throw new RuntimeException("Split amounts must equal total expense amount");
        }
        
        for (User user : participants) {
            Double amount = splitData.get(user.getId());
            if (amount == null || amount <= 0) {
                throw new RuntimeException("Invalid split amount for user: " + user.getName());
            }
            
            Split split = new Split();
            split.setExpense(expense);
            split.setUser(user);
            split.setAmount(amount);
            split.setSettled(false);
            
            expense.getSplits().add(split);
        }
    }
}
