package com.regioninvest.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * DTO principal pour les projets
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProjectDTO {

    private Long id;

    @NotBlank(message = "Le titre est requis")
    @Size(max = 255, message = "Le titre ne peut pas dépasser 255 caractères")
    private String title;

    @NotBlank(message = "La description est requise")
    private String description;

    private String sector;
    private Long sectorId;

    @NotBlank(message = "La localisation est requise")
    private String location;

    @NotBlank(message = "La province est requise")
    private String province;

    @NotNull(message = "Le budget est requis")
    @DecimalMin(value = "0.1", message = "Le budget doit être supérieur à 0")
    private BigDecimal budget;

    @DecimalMin(value = "0.0", message = "Le chiffre d'affaires ne peut pas être négatif")
    private BigDecimal revenue;

    @Min(value = 0, message = "Le nombre d'emplois ne peut pas être négatif")
    private Integer jobs;

    @DecimalMin(value = "0.0", message = "Le ratio de rentabilité ne peut pas être négatif")
    private BigDecimal profitability;

    private String goal;
    private String technology;
    private String impact;
    private String incentives;
    private String partners;
    private String imageUrl;
    private String pdfUrl; // 🆕 ADD PDF SUPPORT
    private String publishTime;
    private String status;
    private String category;
    private Integer views;

    // Informations du porteur
    private Long porteurId;
    private String porteurName;
    private String porteurEmail;

    // Dates
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    // Données formatées pour l'affichage
    private String formattedBudget;
    private String formattedRevenue;
    private String fullLocation;
    private String publishedDate;

    // Données économiques pour les détails
    private List<EconomicDataItem> economicData;

    // Informations clés pour la sidebar
    private KeyInformation keyInfo;

    // Liste des incitations (pour les détails)
    private List<String> incentivesList;

    // Constructeurs
    public ProjectDTO() {}

    public ProjectDTO(Long id, String title, String description) {
        this.id = id;
        this.title = title;
        this.description = description;
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Long getSectorId() {
        return sectorId;
    }

    public void setSectorId(Long sectorId) {
        this.sectorId = sectorId;
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    // 🆕 PDF URL getter/setter
    public String getPdfUrl() {
        return pdfUrl;
    }

    public void setPdfUrl(String pdfUrl) {
        this.pdfUrl = pdfUrl;
    }

    public String getPublishTime() {
        return publishTime;
    }

    public void setPublishTime(String publishTime) {
        this.publishTime = publishTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getViews() {
        return views;
    }

    public void setViews(Integer views) {
        this.views = views;
    }

    public Long getPorteurId() {
        return porteurId;
    }

    public void setPorteurId(Long porteurId) {
        this.porteurId = porteurId;
    }

    public String getPorteurName() {
        return porteurName;
    }

    public void setPorteurName(String porteurName) {
        this.porteurName = porteurName;
    }

    public String getPorteurEmail() {
        return porteurEmail;
    }

    public void setPorteurEmail(String porteurEmail) {
        this.porteurEmail = porteurEmail;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getFormattedBudget() {
        return formattedBudget;
    }

    public void setFormattedBudget(String formattedBudget) {
        this.formattedBudget = formattedBudget;
    }

    public String getFormattedRevenue() {
        return formattedRevenue;
    }

    public void setFormattedRevenue(String formattedRevenue) {
        this.formattedRevenue = formattedRevenue;
    }

    public String getFullLocation() {
        return fullLocation;
    }

    public void setFullLocation(String fullLocation) {
        this.fullLocation = fullLocation;
    }

    public String getPublishedDate() {
        return publishedDate;
    }

    public void setPublishedDate(String publishedDate) {
        this.publishedDate = publishedDate;
    }

    public List<EconomicDataItem> getEconomicData() {
        return economicData;
    }

    public void setEconomicData(List<EconomicDataItem> economicData) {
        this.economicData = economicData;
    }

    public KeyInformation getKeyInfo() {
        return keyInfo;
    }

    public void setKeyInfo(KeyInformation keyInfo) {
        this.keyInfo = keyInfo;
    }

    public List<String> getIncentivesList() {
        return incentivesList;
    }

    public void setIncentivesList(List<String> incentivesList) {
        this.incentivesList = incentivesList;
    }

    // Classes internes pour les données structurées
    public static class EconomicDataItem {
        private String label;
        private String value;
        private String icon;
        private Object rawValue;

        public EconomicDataItem() {}

        public EconomicDataItem(String label, String value, String icon, Object rawValue) {
            this.label = label;
            this.value = value;
            this.icon = icon;
            this.rawValue = rawValue;
        }

        // Getters et Setters
        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        public String getValue() { return value; }
        public void setValue(String value) { this.value = value; }
        public String getIcon() { return icon; }
        public void setIcon(String icon) { this.icon = icon; }
        public Object getRawValue() { return rawValue; }
        public void setRawValue(Object rawValue) { this.rawValue = rawValue; }
    }

    public static class KeyInformation {
        private String location;
        private String sector;
        private String investment;
        private String expectedJobs;
        private String expectedRevenue;

        public KeyInformation() {}

        public KeyInformation(String location, String sector, String investment,
                              String expectedJobs, String expectedRevenue) {
            this.location = location;
            this.sector = sector;
            this.investment = investment;
            this.expectedJobs = expectedJobs;
            this.expectedRevenue = expectedRevenue;
        }

        // Getters et Setters
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        public String getSector() { return sector; }
        public void setSector(String sector) { this.sector = sector; }
        public String getInvestment() { return investment; }
        public void setInvestment(String investment) { this.investment = investment; }
        public String getExpectedJobs() { return expectedJobs; }
        public void setExpectedJobs(String expectedJobs) { this.expectedJobs = expectedJobs; }
        public String getExpectedRevenue() { return expectedRevenue; }
        public void setExpectedRevenue(String expectedRevenue) { this.expectedRevenue = expectedRevenue; }
    }
}