package com.regioninvest.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

/**
 * DTO pour la création et modification de projets
 */
public class ProjectCreateRequest {

    @NotBlank(message = "Le titre est requis")
    @Size(max = 255, message = "Le titre ne peut pas dépasser 255 caractères")
    private String title;

    @NotBlank(message = "La description est requise")
    @Size(max = 5000, message = "La description ne peut pas dépasser 5000 caractères")
    private String description;

    @NotBlank(message = "Le secteur est requis")
    private String sector;

    @NotBlank(message = "La localisation est requise")
    @Size(max = 255, message = "La localisation ne peut pas dépasser 255 caractères")
    private String location;

    @NotBlank(message = "La province est requise")
    private String province;

    @NotNull(message = "Le budget est requis")
    @DecimalMin(value = "0.1", message = "Le budget doit être supérieur à 0")
    @DecimalMax(value = "999999.99", message = "Le budget ne peut pas dépasser 999999.99 M Dhs")
    private BigDecimal budget;

    @DecimalMin(value = "0.0", message = "Le chiffre d'affaires ne peut pas être négatif")
    @DecimalMax(value = "999999.99", message = "Le chiffre d'affaires ne peut pas dépasser 999999.99 M Dhs")
    private BigDecimal revenue;

    @Min(value = 0, message = "Le nombre d'emplois ne peut pas être négatif")
    @Max(value = 999999, message = "Le nombre d'emplois ne peut pas dépasser 999999")
    private Integer jobs;

    @DecimalMin(value = "0.0", message = "Le ratio de rentabilité ne peut pas être négatif")
    @DecimalMax(value = "999.99", message = "Le ratio de rentabilité ne peut pas dépasser 999.99")
    private BigDecimal profitability;

    @Size(max = 2000, message = "L'objectif ne peut pas dépasser 2000 caractères")
    private String goal;

    @Size(max = 2000, message = "La technologie ne peut pas dépasser 2000 caractères")
    private String technology;

    @Size(max = 2000, message = "L'impact ne peut pas dépasser 2000 caractères")
    private String impact;

    @Size(max = 2000, message = "Les incitations ne peuvent pas dépasser 2000 caractères")
    private String incentives;

    @Size(max = 2000, message = "Les partenaires ne peuvent pas dépasser 2000 caractères")
    private String partners;

    @Pattern(regexp = "^([01]?[0-9]|2[0-3]):[0-5][0-9]$", message = "Format d'heure invalide (HH:mm)")
    private String publishTime;

    private String category;

    // Constructeurs
    public ProjectCreateRequest() {
        this.jobs = 0;
        this.revenue = BigDecimal.ZERO;
        this.profitability = BigDecimal.ZERO;
        this.goal = "";
        this.technology = "";
        this.impact = "";
        this.incentives = "";
        this.partners = "";
        this.publishTime = "";
        this.category = "GENERAL";
    }

    // Getters et Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSector() {
        return sector;
    }

    public void setSector(String sector) {
        this.sector = sector;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public BigDecimal getBudget() {
        return budget;
    }

    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }

    public Integer getJobs() {
        return jobs;
    }

    public void setJobs(Integer jobs) {
        this.jobs = jobs;
    }

    public BigDecimal getProfitability() {
        return profitability;
    }

    public void setProfitability(BigDecimal profitability) {
        this.profitability = profitability;
    }

    public String getGoal() {
        return goal;
    }

    public void setGoal(String goal) {
        this.goal = goal;
    }

    public String getTechnology() {
        return technology;
    }

    public void setTechnology(String technology) {
        this.technology = technology;
    }

    public String getImpact() {
        return impact;
    }

    public void setImpact(String impact) {
        this.impact = impact;
    }

    public String getIncentives() {
        return incentives;
    }

    public void setIncentives(String incentives) {
        this.incentives = incentives;
    }

    public String getPartners() {
        return partners;
    }

    public void setPartners(String partners) {
        this.partners = partners;
    }

    public String getPublishTime() {
        return publishTime;
    }

    public void setPublishTime(String publishTime) {
        this.publishTime = publishTime;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    @Override
    public String toString() {
        return "ProjectCreateRequest{" +
                "title='" + title + '\'' +
                ", sector='" + sector + '\'' +
                ", location='" + location + '\'' +
                ", province='" + province + '\'' +
                ", budget=" + budget +
                ", jobs=" + jobs +
                '}';
    }
}