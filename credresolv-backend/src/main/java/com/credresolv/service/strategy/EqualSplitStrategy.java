package com.credresolv.service.strategy;

import com.credresolv.entity.Expense;
import com.credresolv.entity.Split;
import com.credresolv.entity.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class EqualSplitStrategy implements SplitStrategy {
    
    @Override
    public void split(Expense expense, List<User> participants, Map<Long, Double> splitData) {
        if (participants.isEmpty()) {
            throw new RuntimeException("No participants for expense split");
        }
        
        double amountPerPerson = expense.getAmount() / participants.size();
        
        for (User user : participants) {
            Split split = new Split();
            split.setExpense(expense);
            split.setUser(user);
            split.setAmount(amountPerPerson);
            split.setSettled(false);
            
            expense.getSplits().add(split);
        }
    }
}
