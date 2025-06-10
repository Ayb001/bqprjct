package com.regioninvest.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.regioninvest.dto.ProjectDTO;
import com.regioninvest.dto.ProjectCreateRequest;
import com.regioninvest.dto.ProjectResponse;
import com.regioninvest.dto.ApiResponse;
import com.regioninvest.service.ProjectService;

import com.regioninvest.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserService userService;

    private static final Logger logger = LoggerFactory.getLogger(ProjectController.class);
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
     * 🆕 NEW: GET /api/projects/{id}/pdf - Download project PDF file
     */
    @GetMapping("/{id}/pdf")
    public ResponseEntity<Resource> downloadProjectPDF(@PathVariable Long id) {
        try {
            ProjectDTO project = projectService.getProjectById(id);

            if (project.getPdfUrl() == null || project.getPdfUrl().isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Get the file from uploads directory
            Path filePath = Paths.get("uploads", project.getPdfUrl());
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=\"" + project.getTitle() + "_fiche.pdf\"")
                        .header(HttpHeaders.CONTENT_TYPE, "application/pdf")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * POST /api/projects - Créer un nouveau projet sans fichiers (ADMIN et PORTEUR seulement)
     */
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN') or hasRole('PORTEUR')")
    public ResponseEntity<ApiResponse<ProjectDTO>> createProject(
            @Valid @RequestBody ProjectCreateRequest request,
            Authentication authentication) {

        try {
            String username = authentication.getName();
            System.out.println("📝 Creating project without files for user: " + username);

            ProjectDTO createdProject = projectService.createProject(request, null, null, username);

            System.out.println("✅ Project created: " + createdProject.getTitle() + " by " + username);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(createdProject, "Projet créé avec succès"));

        } catch (IllegalArgumentException e) {
            System.err.println("❌ Validation error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Données invalides: " + e.getMessage()));
        } catch (Exception e) {
            System.err.println("❌ Unexpected error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erreur lors de la création du projet: " + e.getMessage()));
        }
    }

    /**
     * POST /api/projects/upload - Upload project with files (ADMIN et PORTEUR seulement)
     * 🆕 UPDATED: Now handles both image and PDF files
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN') or hasRole('PORTEUR')")
    public ResponseEntity<ApiResponse<ProjectDTO>> createProjectWithImage(
            @RequestParam("project") String projectJson,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "pdfFile", required = false) MultipartFile pdfFile,
            Authentication authentication) {

        try {
            String username = authentication.getName();
            System.out.println("🔥 Creating project with files for user: " + username);
            System.out.println("📝 Received project JSON: " + projectJson);

            // Parse JSON string to ProjectCreateRequest object
            ProjectCreateRequest request;
            try {
                request = objectMapper.readValue(projectJson, ProjectCreateRequest.class);
                System.out.println("✅ Successfully parsed project data: " + request.getTitle());
            } catch (JsonProcessingException e) {
                System.err.println("❌ JSON parsing error: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Format JSON invalide: " + e.getMessage()));
            }

            // Validate required fields
            if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Le titre du projet est requis"));
            }

            if (request.getDescription() == null || request.getDescription().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("La description du projet est requise"));
            }

            if (request.getSector() == null || request.getSector().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Le secteur est requis"));
            }

            if (request.getBudget() == null || request.getBudget().compareTo(java.math.BigDecimal.ZERO) <= 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Le budget doit être supérieur à 0"));
            }

            // Log file information and validate
            if (image != null && !image.isEmpty()) {
                System.out.println("📷 Image file: " + image.getOriginalFilename() + " (" + image.getSize() + " bytes)");

                // Validate image file
                if (image.getContentType() == null || !image.getContentType().startsWith("image/")) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(ApiResponse.error("Le fichier image doit être de type image"));
                }

                if (image.getSize() > 5 * 1024 * 1024) { // 5MB
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(ApiResponse.error("La taille de l'image ne doit pas dépasser 5MB"));
                }
            }

            // 🆕 NEW: PDF file validation
            if (pdfFile != null && !pdfFile.isEmpty()) {
                System.out.println("📄 PDF file: " + pdfFile.getOriginalFilename() + " (" + pdfFile.getSize() + " bytes)");

                // Validate PDF file
                if (!"application/pdf".equals(pdfFile.getContentType())) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(ApiResponse.error("Le fichier doit être un PDF"));
                }

                if (pdfFile.getSize() > 10 * 1024 * 1024) { // 10MB
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(ApiResponse.error("La taille du PDF ne doit pas dépasser 10MB"));
                }
            }

            // 🆕 UPDATED: Create project with both image and PDF files
            ProjectDTO createdProject = projectService.createProject(request, image, pdfFile, username);

            System.out.println("✅ Project with files created: " + createdProject.getTitle() + " by " + username);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(createdProject, "Projet créé avec succès"));

        } catch (IllegalArgumentException e) {
            System.err.println("❌ Validation error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Données invalides: " + e.getMessage()));
        } catch (Exception e) {
            System.err.println("❌ Unexpected error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erreur lors de la création du projet: " + e.getMessage()));
        }
    }

    /**
     * 🧪 TEST ENDPOINT - Remove in production
     */
    @PostMapping("/test-upload")
    @CrossOrigin(origins = "*")
    public ResponseEntity<Map<String, Object>> testUpload(
            @RequestParam(value = "project", required = false) String projectJson,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "pdfFile", required = false) MultipartFile pdfFile,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        Map<String, Object> response = new HashMap<>();

        try {
            System.out.println("🧪 TEST UPLOAD ENDPOINT CALLED");
            System.out.println("📝 Project JSON: " + projectJson);
            System.out.println("🔑 Auth Header: " + (authHeader != null ? "Present" : "Missing"));

            if (image != null) {
                System.out.println("📸 Image: " + image.getOriginalFilename() + " (" + image.getSize() + " bytes)");
            }
            if (pdfFile != null) {
                System.out.println("📄 PDF: " + pdfFile.getOriginalFilename() + " (" + pdfFile.getSize() + " bytes)");
            }

            // Try to parse project JSON
            if (projectJson != null) {
                try {
                    ProjectCreateRequest project = objectMapper.readValue(projectJson, ProjectCreateRequest.class);
                    System.out.println("✅ Successfully parsed project: " + project.getTitle());
                    response.put("projectParsed", true);
                    response.put("projectTitle", project.getTitle());
                } catch (Exception e) {
                    System.err.println("❌ Failed to parse project JSON: " + e.getMessage());
                    response.put("projectParsed", false);
                    response.put("parseError", e.getMessage());
                }
            }

            response.put("success", true);
            response.put("message", "Test upload successful");
            response.put("hasImage", image != null);
            response.put("hasPdf", pdfFile != null);
            response.put("hasAuth", authHeader != null);
            response.put("timestamp", System.currentTimeMillis());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * PUT /api/projects/{id} - Modifier un projet (ADMIN ou propriétaire PORTEUR)
     * 🆕 UPDATED: Now handles PDF files too
     */
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN') or hasRole('PORTEUR')")
    public ResponseEntity<ApiResponse<ProjectDTO>> updateProject(
            @PathVariable Long id,
            @RequestParam("project") String projectJson,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "pdfFile", required = false) MultipartFile pdfFile,
            Authentication authentication) {

        try {
            String username = authentication.getName();

            // Parse JSON string to ProjectCreateRequest object
            ProjectCreateRequest request = objectMapper.readValue(projectJson, ProjectCreateRequest.class);

            ProjectDTO updatedProject = projectService.updateProject(id, request, image, pdfFile, username);

            System.out.println("✅ Project updated: " + updatedProject.getTitle() + " by " + username);

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
     * DELETE /api/projects/{id} - Supprimer un projet (ADMIN ou propriétaire PORTEUR)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PORTEUR')")
    public ResponseEntity<ApiResponse<String>> deleteProject(
            @PathVariable Long id,
            Authentication authentication) {

        try {
            String username = authentication.getName();
            String projectTitle = projectService.getProjectById(id).getTitle();

            projectService.deleteProject(id, username);

            System.out.println("✅ Project deleted: " + projectTitle + " by " + username);

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
     * GET /api/projects/my - Projets du porteur connecté (ADMIN et PORTEUR)
     */
    @GetMapping("/my")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PORTEUR')")
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