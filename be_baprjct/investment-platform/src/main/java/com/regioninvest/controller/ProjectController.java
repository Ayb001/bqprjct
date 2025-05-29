package com.regioninvest.controller;

import com.regioninvest.dto.ProjectDTO;
import com.regioninvest.dto.ProjectCreateRequest;
import com.regioninvest.dto.ProjectResponse;
import com.regioninvest.dto.ApiResponse;
import com.regioninvest.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "${app.cors.allowed-origins:http://localhost:3000}")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    /**
     * GET /api/projects - Récupérer tous les projets avec filtrage et pagination
     */
    @GetMapping
    public ResponseEntity<ApiResponse<ProjectResponse>> getAllProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String province,
            @RequestParam(required = false) String sector,
            @RequestParam(required = false) String budgetRange,
            @RequestParam(defaultValue = "ACTIVE") String status) {

        try {
            // Validation des paramètres
            if (page < 0) page = 0;
            if (size <= 0 || size > 50) size = 6;

            Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ?
                    Sort.Direction.DESC : Sort.Direction.ASC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

            ProjectResponse response = projectService.getAllProjectsWithFilters(
                    search, province, sector, budgetRange, status, pageable);

            return ResponseEntity.ok(ApiResponse.success(response, "Projets récupérés avec succès"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erreur lors de la récupération des projets: " + e.getMessage()));
        }
    }

    /**
     * GET /api/projects/{id} - Récupérer un projet spécifique
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectDTO>> getProjectById(@PathVariable Long id) {
        try {
            ProjectDTO project = projectService.getProjectById(id);
            return ResponseEntity.ok(ApiResponse.success(project, "Projet récupéré avec succès"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Projet non trouvé: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erreur lors de la récupération du projet: " + e.getMessage()));
        }
    }

    /**
     * GET /api/projects/{id}/similar - Récupérer des projets similaires
     */
    @GetMapping("/{id}/similar")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSimilarProjects(
            @PathVariable Long id,
            @RequestParam(defaultValue = "3") int limit) {

        try {
            Map<String, Object> similarProjects = projectService.getSimilarProjects(id, limit);
            return ResponseEntity.ok(ApiResponse.success(similarProjects, "Projets similaires récupérés avec succès"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erreur lors de la récupération des projets similaires: " + e.getMessage()));
        }
    }

    /**
     * POST /api/projects - Créer un nouveau projet (Porteur seulement)
     */
    @PostMapping
    @PreAuthorize("hasRole('PORTEUR')")
    public ResponseEntity<ApiResponse<ProjectDTO>> createProject(
            @Valid @RequestPart("project") ProjectCreateRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image,
            Authentication authentication) {

        try {
            String username = authentication.getName();
            ProjectDTO createdProject = projectService.createProject(request, image, username);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(createdProject, "Projet créé avec succès"));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Données invalides: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erreur lors de la création du projet: " + e.getMessage()));
        }
    }

    /**
     * PUT /api/projects/{id} - Modifier un projet (Porteur propriétaire seulement)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PORTEUR')")
    public ResponseEntity<ApiResponse<ProjectDTO>> updateProject(
            @PathVariable Long id,
            @Valid @RequestPart("project") ProjectCreateRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image,
            Authentication authentication) {

        try {
            String username = authentication.getName();
            ProjectDTO updatedProject = projectService.updateProject(id, request, image, username);

            return ResponseEntity.ok(ApiResponse.success(updatedProject, "Projet mis à jour avec succès"));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Projet non trouvé ou accès refusé: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erreur lors de la mise à jour du projet: " + e.getMessage()));
        }
    }

    /**
     * DELETE /api/projects/{id} - Supprimer un projet (Porteur propriétaire seulement)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PORTEUR')")
    public ResponseEntity<ApiResponse<String>> deleteProject(@PathVariable Long id, Authentication authentication) {
        try {
            String username = authentication.getName();
            projectService.deleteProject(id, username);

            return ResponseEntity.ok(ApiResponse.success(null, "Projet supprimé avec succès"));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Projet non trouvé ou accès refusé: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erreur lors de la suppression du projet: " + e.getMessage()));
        }
    }

    /**
     * GET /api/projects/search - Recherche de projets
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<ProjectResponse>> searchProjects(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {

        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "views"));
            ProjectResponse response = projectService.searchProjects(keyword, pageable);

            return ResponseEntity.ok(ApiResponse.success(response, "Recherche effectuée avec succès"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erreur lors de la recherche: " + e.getMessage()));
        }
    }

    /**
     * GET /api/projects/stats - Statistiques des projets
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProjectStats() {
        try {
            Map<String, Object> stats = projectService.getProjectStatistics();
            return ResponseEntity.ok(ApiResponse.success(stats, "Statistiques récupérées avec succès"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erreur lors de la récupération des statistiques: " + e.getMessage()));
        }
    }

    /**
     * GET /api/projects/my - Projets du porteur connecté
     */
    @GetMapping("/my")
    @PreAuthorize("hasRole('PORTEUR')")
    public ResponseEntity<ApiResponse<ProjectResponse>> getMyProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        try {
            String username = authentication.getName();
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
            ProjectResponse response = projectService.getProjectsByPorteur(username, pageable);

            return ResponseEntity.ok(ApiResponse.success(response, "Vos projets récupérés avec succès"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erreur lors de la récupération de vos projets: " + e.getMessage()));
        }
    }

    /**
     * POST /api/projects/{id}/view - Incrémenter le compteur de vues
     */
    @PostMapping("/{id}/view")
    public ResponseEntity<ApiResponse<String>> incrementViews(@PathVariable Long id) {
        try {
            projectService.incrementProjectViews(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Vue incrémentée"));
        } catch (Exception e) {
            // Ignorer les erreurs pour ne pas affecter l'expérience utilisateur
            return ResponseEntity.ok(ApiResponse.success(null, "OK"));
        }
    }
}