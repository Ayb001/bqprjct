package com.regioninvest.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;
import java.util.Map;

/**
 * DTO pour les réponses paginées des projets
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProjectResponse {

    private List<ProjectDTO> projects;
    private PaginationInfo pagination;
    private FilterOptions filters;
    private Map<String, Object> metadata;

    // Constructeurs
    public ProjectResponse() {}

    public ProjectResponse(List<ProjectDTO> projects, PaginationInfo pagination) {
        this.projects = projects;
        this.pagination = pagination;
    }

    // Getters et Setters
    public List<ProjectDTO> getProjects() {
        return projects;
    }

    public void setProjects(List<ProjectDTO> projects) {
        this.projects = projects;
    }

    public PaginationInfo getPagination() {
        return pagination;
    }

    public void setPagination(PaginationInfo pagination) {
        this.pagination = pagination;
    }

    public FilterOptions getFilters() {
        return filters;
    }

    public void setFilters(FilterOptions filters) {
        this.filters = filters;
    }

    public Map<String, Object> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, Object> metadata) {
        this.metadata = metadata;
    }

    // Classe interne pour la pagination
    public static class PaginationInfo {
        private int currentPage;
        private int totalPages;
        private long totalProjects;
        private int pageSize;
        private boolean hasNextPage;
        private boolean hasPrevPage;

        public PaginationInfo() {}

        public PaginationInfo(int currentPage, int totalPages, long totalProjects, int pageSize) {
            this.currentPage = currentPage;
            this.totalPages = totalPages;
            this.totalProjects = totalProjects;
            this.pageSize = pageSize;
            this.hasNextPage = currentPage < totalPages - 1;
            this.hasPrevPage = currentPage > 0;
        }

        // Getters et Setters
        public int getCurrentPage() { return currentPage; }
        public void setCurrentPage(int currentPage) { this.currentPage = currentPage; }
        public int getTotalPages() { return totalPages; }
        public void setTotalPages(int totalPages) { this.totalPages = totalPages; }
        public long getTotalProjects() { return totalProjects; }
        public void setTotalProjects(long totalProjects) { this.totalProjects = totalProjects; }
        public int getPageSize() { return pageSize; }
        public void setPageSize(int pageSize) { this.pageSize = pageSize; }
        public boolean isHasNextPage() { return hasNextPage; }
        public void setHasNextPage(boolean hasNextPage) { this.hasNextPage = hasNextPage; }
        public boolean isHasPrevPage() { return hasPrevPage; }
        public void setHasPrevPage(boolean hasPrevPage) { this.hasPrevPage = hasPrevPage; }
    }

    // Classe interne pour les options de filtrage
    public static class FilterOptions {
        private List<String> provinces;
        private List<String> sectors;
        private List<String> budgetRanges;
        private List<String> categories;

        public FilterOptions() {}

        public FilterOptions(List<String> provinces, List<String> sectors, List<String> budgetRanges) {
            this.provinces = provinces;
            this.sectors = sectors;
            this.budgetRanges = budgetRanges;
        }

        // Getters et Setters
        public List<String> getProvinces() { return provinces; }
        public void setProvinces(List<String> provinces) { this.provinces = provinces; }
        public List<String> getSectors() { return sectors; }
        public void setSectors(List<String> sectors) { this.sectors = sectors; }
        public List<String> getBudgetRanges() { return budgetRanges; }
        public void setBudgetRanges(List<String> budgetRanges) { this.budgetRanges = budgetRanges; }
        public List<String> getCategories() { return categories; }
        public void setCategories(List<String> categories) { this.categories = categories; }
    }
}

