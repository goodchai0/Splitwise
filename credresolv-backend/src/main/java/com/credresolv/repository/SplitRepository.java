package com.credresolv.repository;

import com.credresolv.entity.Split;
import com.credresolv.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SplitRepository extends JpaRepository<Split, Long> {
    List<Split> findByUser(User user);
    List<Split> findByUserAndSettledFalse(User user);
}
