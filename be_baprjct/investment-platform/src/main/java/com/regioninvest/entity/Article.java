package com.regioninvest.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "articles")
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "Le titre est requis")
    @Size(max = 500, message = "Le titre ne peut pas dépasser 500 caractères")
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    @NotBlank(message = "Le contenu est requis")
    private String content;

    @Column(columnDefinition = "TEXT")
    private String excerpt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sector_id", nullable = false)
    private Sector sector;

    @Column(nullable = false)
    @NotBlank(message = "L'auteur est requis")
    private String author;

    @Column(name = "source_name")
    private String sourceName;

    @Column(name = "source_url", columnDefinition = "TEXT")
    private String sourceUrl;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(name = "reading_time")
    private Integer readingTime; // in minutes

    @Column(nullable = false)
    private Integer views = 0;

    @Column(nullable = false)
    private Boolean featured = false;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ArticleLanguage language = ArticleLanguage.FRENCH;

    // Tags stored as comma-separated string for simplicity
    @Column(columnDefinition = "TEXT")
    private String tags;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public Article() {}

    public Article(String title, String content, Sector sector, String author) {
        this.title = title;
        this.content = content;
        this.sector = sector;
        this.author = author;
        this.publishedAt = LocalDateTime.now();
    }

    // Utility methods
    public void incrementViews() {
        this.views = (this.views == null) ? 1 : this.views + 1;
    }

    public List<String> getTagsList() {
        if (tags == null || tags.trim().isEmpty()) {
            return new ArrayList<>();
        }
        return List.of(tags.split(","));
    }

    public void setTagsList(List<String> tagsList) {
        if (tagsList == null || tagsList.isEmpty()) {
            this.tags = "";
        } else {
            this.tags = String.join(",", tagsList);
        }
    }

    // Getters and Setters
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getExcerpt() {
        return excerpt;
    }

    public void setExcerpt(String excerpt) {
        this.excerpt = excerpt;
    }

    public Sector getSector() {
        return sector;
    }

    public void setSector(Sector sector) {
        this.sector = sector;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getSourceName() {
        return sourceName;
    }

    public void setSourceName(String sourceName) {
        this.sourceName = sourceName;
    }

    public String getSourceUrl() {
        return sourceUrl;
    }

    public void setSourceUrl(String sourceUrl) {
        this.sourceUrl = sourceUrl;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public LocalDateTime getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(LocalDateTime publishedAt) {
        this.publishedAt = publishedAt;
    }

    public Integer getReadingTime() {
        return readingTime;
    }

    public void setReadingTime(Integer readingTime) {
        this.readingTime = readingTime;
    }

    public Integer getViews() {
        return views;
    }

    public void setViews(Integer views) {
        this.views = views;
    }

    public Boolean getFeatured() {
        return featured;
    }

    public void setFeatured(Boolean featured) {
        this.featured = featured;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public ArticleLanguage getLanguage() {
        return language;
    }

    public void setLanguage(ArticleLanguage language) {
        this.language = language;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
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
        return "Article{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", author='" + author + '\'' +
                ", sector=" + (sector != null ? sector.getName() : "null") +
                ", language=" + language +
                ", views=" + views +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Article)) return false;
        Article article = (Article) o;
        return id != null && id.equals(article.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}

