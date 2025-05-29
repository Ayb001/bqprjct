package com.regioninvest.service;

import com.regioninvest.dto.InvestmentRequest;
import com.regioninvest.entity.Investment;
import com.regioninvest.entity.User;
import com.regioninvest.repository.InvestmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class InvestmentService {

    @Autowired
    private InvestmentRepository investmentRepository;

    public Investment createInvestment(User user, InvestmentRequest request) {
        Investment investment = new Investment();
        investment.setUser(user);
        investment.setSymbol(request.getSymbol().toUpperCase());
        investment.setCompanyName(request.getCompanyName());
        investment.setAmount(request.getAmount());
        investment.setShares(request.getShares());
        investment.setPricePerShare(request.getPricePerShare());
        investment.setInvestmentType(request.getInvestmentType().toUpperCase());
        investment.setNotes(request.getNotes());

        return investmentRepository.save(investment);
    }

    public List<Investment> getUserInvestments(User user) {
        return investmentRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public Investment getInvestmentById(Long id, User user) {
        Investment investment = investmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Investment not found"));

        if (!investment.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        return investment;
    }

    public Investment updateInvestment(Long id, User user, InvestmentRequest request) {
        Investment investment = getInvestmentById(id, user);

        investment.setSymbol(request.getSymbol().toUpperCase());
        investment.setCompanyName(request.getCompanyName());
        investment.setAmount(request.getAmount());
        investment.setShares(request.getShares());
        investment.setPricePerShare(request.getPricePerShare());
        investment.setInvestmentType(request.getInvestmentType().toUpperCase());
        investment.setNotes(request.getNotes());

        return investmentRepository.save(investment);
    }

    public void deleteInvestment(Long id, User user) {
        Investment investment = getInvestmentById(id, user);
        investmentRepository.delete(investment);
    }

    public BigDecimal getTotalInvestmentValue(User user) {
        BigDecimal total = investmentRepository.getTotalInvestmentByUser(user);
        return total != null ? total : BigDecimal.ZERO;
    }

    public Map<String, BigDecimal> getInvestmentsByType(User user) {
        List<Object[]> results = investmentRepository.getInvestmentsByTypeForUser(user);
        Map<String, BigDecimal> investmentsByType = new HashMap<>();

        for (Object[] result : results) {
            String type = (String) result[0];
            BigDecimal amount = (BigDecimal) result[1];
            investmentsByType.put(type, amount);
        }

        return investmentsByType;
    }
}