package com.regioninvest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class InvestmentRequest {

    @NotBlank(message = "Symbol is required")
    private String symbol;

    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    @NotNull(message = "Shares is required")
    @Positive(message = "Shares must be positive")
    private Integer shares;

    @NotNull(message = "Price per share is required")
    @Positive(message = "Price per share must be positive")
    private BigDecimal pricePerShare;

    @NotBlank(message = "Investment type is required")
    private String investmentType;

    private String notes;

    // Constructors
    public InvestmentRequest() {}

    public InvestmentRequest(String symbol, String companyName, BigDecimal amount,
                             Integer shares, BigDecimal pricePerShare, String investmentType, String notes) {
        this.symbol = symbol;
        this.companyName = companyName;
        this.amount = amount;
        this.shares = shares;
        this.pricePerShare = pricePerShare;
        this.investmentType = investmentType;
        this.notes = notes;
    }

    // Getters and Setters
    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public Integer getShares() { return shares; }
    public void setShares(Integer shares) { this.shares = shares; }

    public BigDecimal getPricePerShare() { return pricePerShare; }
    public void setPricePerShare(BigDecimal pricePerShare) { this.pricePerShare = pricePerShare; }

    public String getInvestmentType() { return investmentType; }
    public void setInvestmentType(String investmentType) { this.investmentType = investmentType; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}