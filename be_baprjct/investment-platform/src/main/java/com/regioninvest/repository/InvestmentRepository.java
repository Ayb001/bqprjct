package com.regioninvest.repository;

import com.regioninvest.entity.Investment;
import com.regioninvest.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface InvestmentRepository extends JpaRepository<Investment, Long> {

    List<Investment> findByUser(User user);

    List<Investment> findByUserOrderByCreatedAtDesc(User user);

    List<Investment> findByUserAndSymbol(User user, String symbol);

    @Query("SELECT SUM(i.amount) FROM Investment i WHERE i.user = ?1")
    BigDecimal getTotalInvestmentByUser(User user);

    @Query("SELECT i.investmentType, SUM(i.amount) FROM Investment i WHERE i.user = ?1 GROUP BY i.investmentType")
    List<Object[]> getInvestmentsByTypeForUser(User user);
}