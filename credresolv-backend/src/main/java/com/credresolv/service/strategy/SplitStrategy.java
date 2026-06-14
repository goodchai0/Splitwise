package com.credresolv.service.strategy;

import com.credresolv.entity.Expense;
import com.credresolv.entity.User;

import java.util.List;
import java.util.Map;

public interface SplitStrategy {
    void split(Expense expense, List<User> participants, Map<Long, Double> splitData);
}
