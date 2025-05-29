package com.regioninvest.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "Le titre est requis")
    @Size(max = 255, message = "Le titre ne peut pas dépasser 255 caractères")
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    @NotBlank(message = "La description est requise")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sector_id", nullable = false)
    private Sector sector;

    @Column(nullable = false)
    @NotBlank(message = "La localisation est requise")
    private String location;

    @Column(nullable = false)
    @NotBlank(message = "La province est requise")
    private String province;

    @Column(nullable = false, precision = 10, scale = 2)
    @NotNull(message = "Le budget est requis")
    @DecimalMin(value = "0.1", message = "Le budget doit être supérieur à 0")
    private BigDecimal budget;

    @Column(precision = 10, scale = 2)
    @DecimalMin(value = "0.0", message = "Le chiffre d'affaires ne peut pas être négatif")
    private BigDecimal revenue = BigDecimal.ZERO;

    @Column
    @Min(value = 0, message = "Le nombre d'emplois ne peut pas être négatif")
    private Integer jobs = 0;

    @Column(precision = 5, scale = 2)
    @DecimalMin(value = "0.0", message = "Le ratio de rentabilité ne peut pas être négatif")
    private BigDecimal profitability = BigDecimal.ZERO;

    @Column(columnDefinition = "TEXT")
    private String goal;

    @Column(columnDefinition = "TEXT")
    private String technology;

    @Column(columnDefinition = "TEXT")
    private String impact;

    @Column(columnDefinition = "TEXT")
    private String incentives;

    @Column(columnDefinition = "TEXT")
    private String partners;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "publish_time")
    private String publishTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectStatus status = ProjectStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectCategory category = ProjectCategory.TRADITIONAL_CRAFTS;

    @Column(nullable = false)
    private Integer views = 0;

    // Relation avec User (le porteur du projet)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "porteur_id", nullable = false)
    private User porteur;

    // Relations avec les demandes d'investissement
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InvestmentRequest> investmentRequests = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructeurs
    public Project() {}

    public Project(String title, String description, Sector sector, String location,
                   String province, BigDecimal budget, User porteur) {
        this.title = title;
        this.description = description;
        this.sector = sector;
        this.location = location;
        this.province = province;
        this.budget = budget;
        this.porteur = porteur;
    }

    // Méthodes utilitaires
    public void incrementViews() {
        this.views = (this.views == null) ? 1 : this.views + 1;
    }

    public String getFullLocation() {
        return location + ", " + province;
    }

    public boolean isOwnedBy(User user) {
        return this.porteur != null && this.porteur.getId().equals(user.getId());
    }

    public boolean isOwnedBy(String username) {
        return this.porteur != null && this.porteur.getUsername().equals(username);
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

    public Sector getSector() {
        return sector;
    }

    public void setSector(Sector sector) {
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getPublishTime() {
        return publishTime;
    }

    public void setPublishTime(String publishTime) {
        this.publishTime = publishTime;
    }

    public ProjectStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectStatus status) {
        this.status = status;
    }

    public ProjectCategory getCategory() {
        return category;
    }

    public void setCategory(ProjectCategory category) {
        this.category = category;
    }

    public Integer getViews() {
        return views;
    }

    public void setViews(Integer views) {
        this.views = views;
    }

    public User getPorteur() {
        return porteur;
    }

    public void setPorteur(User porteur) {
        this.porteur = porteur;
    }

    public List<InvestmentRequest> getInvestmentRequests() {
        return investmentRequests;
    }

    public void setInvestmentRequests(List<InvestmentRequest> investmentRequests) {
        this.investmentRequests = investmentRequests;
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

    @Override
    public String toString() {
        return "Project{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", location='" + location + '\'' +
                ", province='" + province + '\'' +
                ", budget=" + budget +
                ", status=" + status +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Project)) return false;
        Project project = (Project) o;
        return id != null && id.equals(project.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}