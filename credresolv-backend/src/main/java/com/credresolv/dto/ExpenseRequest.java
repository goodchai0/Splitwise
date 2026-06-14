package com.credresolv.dto;

import com.credresolv.entity.SplitType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseRequest {
    
    @NotNull(message = "Description is required")
    @Size(min = 1, max = 200, message = "Description must be between 1 and 200 characters")
    private String description;
    
    @NotNull(message = "Total amount is required")
    @Positive(message = "Total amount must be positive")
    private Double totalAmount;
    
    @NotNull(message = "Paid by user ID is required")
    private Long paidByUserId;
    
    private Long groupId; // Optional for individual expenses
    
    @NotNull(message = "Split type is required")
    private SplitType splitType;
    
    @NotNull(message = "User IDs are required")
    @Size(min = 1, message = "At least one user must be included")
    private List<Long> userIds;
    
    private List<Double> splitValues; // For EXACT or PERCENTAGE
}
