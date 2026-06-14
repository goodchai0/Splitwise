package com.credresolv.repository;

import com.credresolv.entity.Expense;
import com.credresolv.entity.Group;
import com.credresolv.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByPaidBy(User user);
    List<Expense> findByGroup(Group group);
    List<Expense> findByGroupAndPaidBy(Group group, User user);
}
