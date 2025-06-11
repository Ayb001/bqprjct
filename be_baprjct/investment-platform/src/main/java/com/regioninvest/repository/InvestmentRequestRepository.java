package com.regioninvest.repository;

import com.regioninvest.entity.InvestmentRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvestmentRequestRepository extends JpaRepository<InvestmentRequest, Long> {
}