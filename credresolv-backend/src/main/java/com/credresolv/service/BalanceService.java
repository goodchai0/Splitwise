package com.credresolv.service;

import com.credresolv.entity.*;
import com.credresolv.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class BalanceService {
    
    @Autowired
    private ExpenseRepository expenseRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private GroupRepository groupRepository;
    
    public Map<String, Double> getUserBalances(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Map<String, Double> balances = new HashMap<>();
        
        List<Expense> paidExpenses = expenseRepository.findByPaidBy(user);
        for (Expense expense : paidExpenses) {
            for (Split split : expense.getSplits()) {
                if (!split.getUser().getId().equals(userId) && !split.getSettled()) {
                    String otherUser = split.getUser().getName();
                    balances.put(otherUser, balances.getOrDefault(otherUser, 0.0) + split.getAmount());
                }
            }
        }
        
        List<Expense> allExpenses = expenseRepository.findAll();
        for (Expense expense : allExpenses) {
            if (!expense.getPaidBy().getId().equals(userId)) {
                for (Split split : expense.getSplits()) {
                    if (split.getUser().getId().equals(userId) && !split.getSettled()) {
                        String payer = expense.getPaidBy().getName();
                        balances.put(payer, balances.getOrDefault(payer, 0.0) - split.getAmount());
                    }
                }
            }
        }
        
        return balances;
    }
    
    public Map<String, Double> getGroupBalances(Long groupId, Long userId) {
        Group group = groupRepository.findById(groupId)
            .orElseThrow(() -> new RuntimeException("Group not found"));
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Map<String, Double> balances = new HashMap<>();
        List<Expense> groupExpenses = expenseRepository.findByGroup(group);
        
        for (Expense expense : groupExpenses) {
            if (expense.getPaidBy().getId().equals(userId)) {
                for (Split split : expense.getSplits()) {
                    if (!split.getUser().getId().equals(userId) && !split.getSettled()) {
                        String otherUser = split.getUser().getName();
                        balances.put(otherUser, balances.getOrDefault(otherUser, 0.0) + split.getAmount());
                    }
                }
            } else {
                for (Split split : expense.getSplits()) {
                    if (split.getUser().getId().equals(userId) && !split.getSettled()) {
                        String payer = expense.getPaidBy().getName();
                        balances.put(payer, balances.getOrDefault(payer, 0.0) - split.getAmount());
                    }
                }
            }
        }
        
        return balances;
    }
    
    public void settleBalance(Long fromUserId, Long toUserId, Long groupId, Double amount) {
        User fromUser = userRepository.findById(fromUserId)
            .orElseThrow(() -> new RuntimeException("From user not found"));
        
        User toUser = userRepository.findById(toUserId)
            .orElseThrow(() -> new RuntimeException("To user not found"));
        
        Group group = groupRepository.findById(groupId)
            .orElseThrow(() -> new RuntimeException("Group not found"));
        
        List<Expense> toUserExpenses = expenseRepository.findByPaidBy(toUser);
        
        double remainingAmount = amount;
        for (Expense expense : toUserExpenses) {
            if (remainingAmount <= 0) break;
            
            for (Split split : expense.getSplits()) {
                if (split.getUser().getId().equals(fromUserId) && !split.getSettled()) {
                    if (split.getAmount() <= remainingAmount) {
                        split.setSettled(true);
                        remainingAmount -= split.getAmount();
                    }
                }
            }
        }
        
        Expense settlement = new Expense();
        settlement.setDescription("Settlement: " + fromUser.getName() + " → " + toUser.getName());
        settlement.setAmount(amount);
        settlement.setGroup(group);
        settlement.setPaidBy(fromUser);
        settlement.setSplitType(Expense.SplitType.EXACT);
        
        expenseRepository.save(settlement);
        expenseRepository.saveAll(toUserExpenses);
    }
}
