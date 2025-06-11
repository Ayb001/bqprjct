package com.regioninvest.repository;

import com.regioninvest.entity.Investment;
import com.regioninvest.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface InvestmentRepository extends JpaRepository<Investment, Long> {

    List<Investment> findByUserOrderByCreatedAtDesc(User user);

    @Query("SELECT SUM(i.amount) FROM Investment i WHERE i.user = :user")
    BigDecimal getTotalInvestmentByUser(@Param("user") User user);

    @Query("SELECT i.investmentType, SUM(i.amount) FROM Investment i WHERE i.user = :user GROUP BY i.investmentType")
    List<Object[]> getInvestmentsByTypeForUser(@Param("user") User user);
}