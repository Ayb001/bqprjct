package com.regioninvest.dto;

import java.util.List;

/**
 * DTO pour les articles d'investissement
 */
public class ArticleDTO {

    private Long id;
    private String title;
    private String content;
    private String sector;
    private String date;
    private String readingTime;
    private Integer views;
    private List<String> tags;
    private String image;
    private boolean featured;

    // 🔥 NEW FIELDS FOR REAL ARTICLES
    private String sourceUrl;    // Real link to original article
    private String sourceName;   // Name of news source

    // Constructeur par défaut
    public ArticleDTO() {}

    // Constructeur avec tous les paramètres
    public ArticleDTO(Long id, String title, String content, String sector,
                      String date, String readingTime, Integer views,
                      List<String> tags, String image, boolean featured,
                      String sourceUrl, String sourceName) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.sector = sector;
        this.date = date;
        this.readingTime = readingTime;
        this.views = views;
        this.tags = tags;
        this.image = image;
        this.featured = featured;
        this.sourceUrl = sourceUrl;
        this.sourceName = sourceName;
    }

    // Builder pattern
    public static ArticleDTOBuilder builder() {
        return new ArticleDTOBuilder();
    }

    public static class ArticleDTOBuilder {
        private Long id;
        private String title;
        private String content;
        private String sector;
        private String date;
        private String readingTime;
        private Integer views;
        private List<String> tags;
        private String image;
        private boolean featured;
        private String sourceUrl;
        private String sourceName;

        public ArticleDTOBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ArticleDTOBuilder title(String title) {
            this.title = title;
            return this;
        }

        public ArticleDTOBuilder content(String content) {
            this.content = content;
            return this;
        }

        public ArticleDTOBuilder sector(String sector) {
            this.sector = sector;
            return this;
        }

        public ArticleDTOBuilder date(String date) {
            this.date = date;
            return this;
        }

        public ArticleDTOBuilder readingTime(String readingTime) {
            this.readingTime = readingTime;
            return this;
        }

        public ArticleDTOBuilder views(Integer views) {
            this.views = views;
            return this;
        }

        public ArticleDTOBuilder tags(List<String> tags) {
            this.tags = tags;
            return this;
        }

        public ArticleDTOBuilder image(String image) {
            this.image = image;
            return this;
        }

        public ArticleDTOBuilder featured(boolean featured) {
            this.featured = featured;
            return this;
        }

        public ArticleDTOBuilder sourceUrl(String sourceUrl) {
            this.sourceUrl = sourceUrl;
            return this;
        }

        public ArticleDTOBuilder sourceName(String sourceName) {
            this.sourceName = sourceName;
            return this;
        }

        public ArticleDTO build() {
            return new ArticleDTO(id, title, content, sector, date, readingTime,
                    views, tags, image, featured, sourceUrl, sourceName);
        }
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSector() {
        return sector;
    }

    public void setSector(String sector) {
        this.sector = sector;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getReadingTime() {
        return readingTime;
    }

    public void setReadingTime(String readingTime) {
        this.readingTime = readingTime;
    }

    public Integer getViews() {
        return views;
    }

    public void setViews(Integer views) {
        this.views = views;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public boolean isFeatured() {
        return featured;
    }

    public void setFeatured(boolean featured) {
        this.featured = featured;
    }

    public String getSourceUrl() {
        return sourceUrl;
    }

    public void setSourceUrl(String sourceUrl) {
        this.sourceUrl = sourceUrl;
    }

    public String getSourceName() {
        return sourceName;
    }

    public void setSourceName(String sourceName) {
        this.sourceName = sourceName;
    }

    @Override
    public String toString() {
        return "ArticleDTO{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", sector='" + sector + '\'' +
                ", date='" + date + '\'' +
                ", featured=" + featured +
                '}';
    }
}