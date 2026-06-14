package com.credresolv.service.strategy;

import com.credresolv.entity.Expense;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SplitStrategyFactory {
    
    @Autowired
    private EqualSplitStrategy equalSplitStrategy;
    
    @Autowired
    private ExactSplitStrategy exactSplitStrategy;
    
    @Autowired
    private PercentageSplitStrategy percentageSplitStrategy;
    
    public SplitStrategy getStrategy(Expense.SplitType splitType) {
        return switch (splitType) {
            case EQUAL -> equalSplitStrategy;
            case EXACT -> exactSplitStrategy;
            case PERCENTAGE -> percentageSplitStrategy;
        };
    }
}
