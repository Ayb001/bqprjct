// entity/Sector.java
package com.regioninvest.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sectors")
public class Sector {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    @NotBlank(message = "Le nom du secteur est requis")
    private String name;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "sector", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Project> projects = new ArrayList<>();

    // Constructeurs
    public Sector() {}

    public Sector(String name) {
        this.name = name;
        this.isActive = true;
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<Project> getProjects() { return projects; }
    public void setProjects(List<Project> projects) { this.projects = projects; }

    @Override
    public String toString() {
        return "Sector{id=" + id + ", name='" + name + "', isActive=" + isActive + '}';
    }
}

// entity/InvestmentRequest.java
package com.regioninvest.entity;

import jakarta.persistence.*;
        import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "investment_requests")
public class InvestmentRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "investor_id", nullable = false)
    private User investor;

    @Column(name = "full_name", nullable = false)
    @NotBlank(message = "Le nom complet est requis")
    private String fullName;

    @Column(nullable = false)
    @NotBlank(message = "L'email est requis")
    private String email;

    @Column(nullable = false)
    @NotBlank(message = "Le téléphone est requis")
    private String phone;

    @Column(name = "investment_amount", precision = 12, scale = 2)
    private BigDecimal investmentAmount;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String responseMessage;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructeurs
    public InvestmentRequest() {}

    public InvestmentRequest(Project project, User investor, String fullName, String email, String phone) {
        this.project = project;
        this.investor = investor;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public User getInvestor() { return investor; }
    public void setInvestor(User investor) { this.investor = investor; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public BigDecimal getInvestmentAmount() { return investmentAmount; }
    public void setInvestmentAmount(BigDecimal investmentAmount) { this.investmentAmount = investmentAmount; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }

    public String getResponseMessage() { return responseMessage; }
    public void setResponseMessage(String responseMessage) { this.responseMessage = responseMessage; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

// entity/ProjectStatus.java
package com.regioninvest.entity;

public enum ProjectStatus {
    DRAFT("Brouillon"),
    ACTIVE("Actif"),
    PAUSED("En pause"),
    COMPLETED("Terminé"),
    CANCELLED("Annulé");

    private final String displayName;

    ProjectStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}

// entity/ProjectCategory.java
package com.regioninvest.entity;

public enum ProjectCategory {
    TRADITIONAL_CRAFTS("traditional-crafts", "Artisanat traditionnel"),
    RENEWABLE_ENERGY("renewable-energy", "Énergie renouvelable"),
    EDUCATION("education", "Éducation"),
    TOURISM("tourism", "Tourisme"),
    AGRICULTURE("agriculture", "Agriculture"),
    HEALTH("health", "Santé"),
    HERITAGE("heritage", "Patrimoine"),
    TECHNOLOGY("technology", "Technologie"),
    INDUSTRY("industry", "Industrie");

    private final String key;
    private final String displayName;

    ProjectCategory(String key, String displayName) {
        this.key = key;
        this.displayName = displayName;
    }

    public String getKey() {
        return key;
    }

    public String getDisplayName() {
        return displayName;
    }
}

// entity/RequestStatus.java
package com.regioninvest.entity;

public enum RequestStatus {
    PENDING("En attente"),
    APPROVED("Approuvée"),
    REJECTED("Rejetée"),
    CANCELLED("Annulée");

    private final String displayName;

    RequestStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}