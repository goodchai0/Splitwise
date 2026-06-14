package com.credresolv.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BalanceDTO {
    private Long userId;
    private String userName;
    private Long otherUserId;
    private String otherUserName;
    private Double amount; // Positive: they owe you, Negative: you owe them
    
    public String getBalanceDescription() {
        if (amount > 0) {
            return otherUserName + " owes you ₹" + String.format("%.2f", amount);
        } else {
            return "You owe " + otherUserName + " ₹" + String.format("%.2f", Math.abs(amount));
        }
    }
}
