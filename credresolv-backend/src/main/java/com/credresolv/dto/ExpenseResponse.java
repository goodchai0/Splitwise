package com.credresolv.dto;

import com.credresolv.entity.SplitType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseResponse {
    private Long id;
    private String description;
    private Double totalAmount;
    private UserDTO paidBy;
    private GroupDTO group;
    private SplitType splitType;
    private List<SplitDTO> splits;
    private LocalDateTime createdAt;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SplitDTO {
        private Long id;
        private UserDTO user;
        private Double amount;
    }
}
