package com.regioninvest.controller;

import com.regioninvest.dto.ArticleDTO;
import com.regioninvest.dto.ApiResponse;
import com.regioninvest.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/articles")
@CrossOrigin(origins = "${app.cors.allowed-origins:http://localhost:3000}")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    /**
     * GET /api/articles - Récupérer tous les articles d'investissement
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ArticleDTO>>> getAllArticles(
            @RequestParam(required = false) String sector,
            @RequestParam(required = false) String search) {

        try {
            List<ArticleDTO> articles;

            if (search != null && !search.trim().isEmpty()) {
                articles = articleService.searchArticles(search.trim());
            } else if (sector != null && !sector.trim().isEmpty()) {
                articles = articleService.getArticlesBySector(sector.trim());
            } else {
                articles = articleService.getAllInvestmentArticles();
            }

            return ResponseEntity.ok(
                    ApiResponse.success(articles, "Articles récupérés avec succès")
            );

        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    ApiResponse.error("Erreur lors de la récupération des articles: " + e.getMessage())
            );
        }
    }

    /**
     * GET /api/articles/featured - Récupérer les articles vedettes
     */
    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<ArticleDTO>>> getFeaturedArticles() {
        try {
            List<ArticleDTO> featuredArticles = articleService.getFeaturedArticles();
            return ResponseEntity.ok(
                    ApiResponse.success(featuredArticles, "Articles vedettes récupérés avec succès")
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    ApiResponse.error("Erreur lors de la récupération des articles vedettes: " + e.getMessage())
            );
        }
    }

    /**
     * GET /api/articles/sectors - Récupérer les secteurs disponibles
     */
    @GetMapping("/sectors")
    public ResponseEntity<ApiResponse<List<String>>> getAvailableSectors() {
        try {
            List<String> sectors = articleService.getAvailableSectors();
            return ResponseEntity.ok(
                    ApiResponse.success(sectors, "Secteurs récupérés avec succès")
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    ApiResponse.error("Erreur lors de la récupération des secteurs: " + e.getMessage())
            );
        }
    }

    /**
     * GET /api/articles/tags - Récupérer les tags populaires
     */
    @GetMapping("/tags")
    public ResponseEntity<ApiResponse<List<String>>> getPopularTags() {
        try {
            List<String> tags = articleService.getPopularTags();
            return ResponseEntity.ok(
                    ApiResponse.success(tags, "Tags populaires récupérés avec succès")
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    ApiResponse.error("Erreur lors de la récupération des tags: " + e.getMessage())
            );
        }
    }

    /**
     * GET /api/articles/stats - Récupérer les statistiques des articles
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getArticleStatistics() {
        try {
            Map<String, Object> stats = articleService.getArticleStatistics();
            return ResponseEntity.ok(
                    ApiResponse.success(stats, "Statistiques récupérées avec succès")
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    ApiResponse.error("Erreur lors de la récupération des statistiques: " + e.getMessage())
            );
        }
    }

    /**
     * GET /api/articles/search - Rechercher des articles
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ArticleDTO>>> searchArticles(
            @RequestParam String keyword) {

        try {
            if (keyword == null || keyword.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(
                        ApiResponse.badRequest("Le mot-clé de recherche est requis")
                );
            }

            List<ArticleDTO> articles = articleService.searchArticles(keyword.trim());
            return ResponseEntity.ok(
                    ApiResponse.success(articles,
                            "Recherche effectuée avec succès pour: " + keyword)
            );

        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    ApiResponse.error("Erreur lors de la recherche: " + e.getMessage())
            );
        }
    }

    /**
     * GET /api/articles/by-sector/{sector} - Récupérer articles par secteur
     */
    @GetMapping("/by-sector/{sector}")
    public ResponseEntity<ApiResponse<List<ArticleDTO>>> getArticlesBySector(
            @PathVariable String sector) {

        try {
            List<ArticleDTO> articles = articleService.getArticlesBySector(sector);
            return ResponseEntity.ok(
                    ApiResponse.success(articles,
                            "Articles du secteur " + sector + " récupérés avec succès")
            );

        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    ApiResponse.error("Erreur lors de la récupération des articles par secteur: " + e.getMessage())
            );
        }
    }

    /**
     * GET /api/articles/refresh - Forcer le rafraîchissement du cache
     */
    @GetMapping("/refresh")
    public ResponseEntity<ApiResponse<String>> refreshArticles() {
        try {
            // Force le rafraîchissement en récupérant de nouveaux articles
            List<ArticleDTO> articles = articleService.getAllInvestmentArticles();

            return ResponseEntity.ok(
                    ApiResponse.success(
                            "Cache rafraîchi avec succès",
                            articles.size() + " articles disponibles"
                    )
            );

        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    ApiResponse.error("Erreur lors du rafraîchissement: " + e.getMessage())
            );
        }
    }

    /**
     * GET /api/articles/test - Endpoint de test
     */
    @GetMapping("/test")
    public ResponseEntity<ApiResponse<String>> testArticles() {
        try {
            List<ArticleDTO> articles = articleService.getAllInvestmentArticles();

            return ResponseEntity.ok(
                    ApiResponse.success(
                            "Service d'articles fonctionnel",
                            "Nombre d'articles disponibles: " + articles.size()
                    )
            );

        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    ApiResponse.error("Erreur de test: " + e.getMessage())
            );
        }
    }
}