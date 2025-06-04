package com.regioninvest.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;
import java.util.Map;

/**
 * DTO for paginated article responses
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ArticleResponse {

    private List<ArticleDTO> articles;
    private PaginationInfo pagination;
    private FilterOptions filters;
    private Map<String, Object> metadata;

    // Constructors
    public ArticleResponse() {}

    public ArticleResponse(List<ArticleDTO> articles, PaginationInfo pagination) {
        this.articles = articles;
        this.pagination = pagination;
    }

    // Getters and Setters
    public List<ArticleDTO> getArticles() { return articles; }
    public void setArticles(List<ArticleDTO> articles) { this.articles = articles; }

    public PaginationInfo getPagination() { return pagination; }
    public void setPagination(PaginationInfo pagination) { this.pagination = pagination; }

    public FilterOptions getFilters() { return filters; }
    public void setFilters(FilterOptions filters) { this.filters = filters; }

    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }

    // Inner classes for pagination and filters
    public static class PaginationInfo {
        private int currentPage;
        private int totalPages;
        private long totalArticles;
        private int pageSize;
        private boolean hasNextPage;
        private boolean hasPrevPage;

        public PaginationInfo() {}

        public PaginationInfo(int currentPage, int totalPages, long totalArticles, int pageSize) {
            this.currentPage = currentPage;
            this.totalPages = totalPages;
            this.totalArticles = totalArticles;
            this.pageSize = pageSize;
            this.hasNextPage = currentPage < totalPages - 1;
            this.hasPrevPage = currentPage > 0;
        }

        // Getters and setters
        public int getCurrentPage() { return currentPage; }
        public void setCurrentPage(int currentPage) { this.currentPage = currentPage; }
        public int getTotalPages() { return totalPages; }
        public void setTotalPages(int totalPages) { this.totalPages = totalPages; }
        public long getTotalArticles() { return totalArticles; }
        public void setTotalArticles(long totalArticles) { this.totalArticles = totalArticles; }
        public int getPageSize() { return pageSize; }
        public void setPageSize(int pageSize) { this.pageSize = pageSize; }
        public boolean isHasNextPage() { return hasNextPage; }
        public void setHasNextPage(boolean hasNextPage) { this.hasNextPage = hasNextPage; }
        public boolean isHasPrevPage() { return hasPrevPage; }
        public void setHasPrevPage(boolean hasPrevPage) { this.hasPrevPage = hasPrevPage; }
    }

    public static class FilterOptions {
        private List<String> sectors;
        private List<String> authors;
        private List<String> languages;
        private List<String> tags;

        public FilterOptions() {}

        public FilterOptions(List<String> sectors, List<String> authors, List<String> languages) {
            this.sectors = sectors;
            this.authors = authors;
            this.languages = languages;
        }

        // Getters and setters
        public List<String> getSectors() { return sectors; }
        public void setSectors(List<String> sectors) { this.sectors = sectors; }
        public List<String> getAuthors() { return authors; }
        public void setAuthors(List<String> authors) { this.authors = authors; }
        public List<String> getLanguages() { return languages; }
        public void setLanguages(List<String> languages) { this.languages = languages; }
        public List<String> getTags() { return tags; }
        public void setTags(List<String> tags) { this.tags = tags; }
    }
}