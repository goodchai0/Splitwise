package com.credresolv.service;

import com.credresolv.entity.Expense;
import com.credresolv.entity.Group;
import com.credresolv.entity.User;
import com.credresolv.repository.ExpenseRepository;
import com.credresolv.repository.GroupRepository;
import com.credresolv.repository.UserRepository;
import com.credresolv.service.strategy.SplitStrategy;
import com.credresolv.service.strategy.SplitStrategyFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional
public class ExpenseService {
    
    @Autowired
    private ExpenseRepository expenseRepository;
    
    @Autowired
    private GroupRepository groupRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SplitStrategyFactory splitStrategyFactory;
    
    public Expense addExpense(Long groupId, Long paidByUserId, String description, 
                             Double amount, Expense.SplitType splitType, Map<Long, Double> splitData) {
        
        // Group is optional - can be null for personal expenses
        Group group = null;
        if (groupId != null) {
            group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        }
        
        User paidBy = userRepository.findById(paidByUserId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Only check membership if group exists
        if (group != null && !group.isMember(paidByUserId)) {
            throw new RuntimeException("User is not a member of this group");
        }
        
        Expense expense = new Expense();
        expense.setDescription(description);
        expense.setAmount(amount);
        expense.setGroup(group);
        expense.setPaidBy(paidBy);
        expense.setSplitType(splitType);
        
        expense = expenseRepository.save(expense);
        
        SplitStrategy strategy = splitStrategyFactory.getStrategy(splitType);
        List<User> participants = splitData.keySet().stream()
            .map(userId -> userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId)))
            .toList();
        
        strategy.split(expense, participants, splitData);
        
        return expenseRepository.save(expense);
    }
    
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }
    
    public Expense getExpense(Long id) {
        return expenseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Expense not found"));
    }
    
    public List<Expense> getGroupExpenses(Long groupId) {
        Group group = groupRepository.findById(groupId)
            .orElseThrow(() -> new RuntimeException("Group not found"));
        return expenseRepository.findByGroup(group);
    }
    
    public List<Expense> getUserExpenses(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return expenseRepository.findByPaidBy(user);
    }
    
    public void deleteExpense(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new RuntimeException("Expense not found");
        }
        expenseRepository.deleteById(id);
    }
}
