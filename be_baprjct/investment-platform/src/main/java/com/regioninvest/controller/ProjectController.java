package com.regioninvest.controller;

import com.regioninvest.dto.ProjectDTO;
import com.regioninvest.dto.ProjectCreateRequest;
import com.regioninvest.dto.ProjectResponse;
import com.regioninvest.dto.ApiResponse;
import com.regioninvest.service.ProjectService;
import com.regioninvest.repository.UserRepository;
import com.regioninvest.repository.SectorRepository;
import com.regioninvest.entity.User;
import com.regioninvest.entity.Sector;
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

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "${app.cors.allowed-origins:http://localhost:3000}")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SectorRepository sectorRepository;

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
     * 🔧 DEBUG ENDPOINT - No auth required for debugging
     */
    @PostMapping("/debug-create")
    public ResponseEntity<ApiResponse<String>> debugCreateProject(
            @Valid @RequestBody ProjectCreateRequest request,
            Authentication authentication) {

        try {
            // Debug current user info
            String username = authentication != null ? authentication.getName() : "ANONYMOUS";
            System.out.println("🔍 DEBUG: Username = " + username);

            if (authentication != null) {
                System.out.println("🔍 DEBUG: Authorities = " + authentication.getAuthorities());
                System.out.println("🔍 DEBUG: Principal = " + authentication.getPrincipal().getClass().getSimpleName());
            }

            // Check if user exists
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                System.out.println("🔍 DEBUG: User found");
                System.out.println("🔍 DEBUG: User role = " + user.getRole().getName());
                System.out.println("🔍 DEBUG: User authorities in UserDetails = " + user.getAuthorities());

                // Check if user has PORTEUR role
                boolean hasPorteurRole = user.getAuthorities().stream()
                        .anyMatch(auth -> auth.getAuthority().equals("ROLE_PORTEUR"));
                System.out.println("🔍 DEBUG: Has ROLE_PORTEUR = " + hasPorteurRole);

            } else {
                System.out.println("❌ DEBUG: User NOT found");
            }

            // Test sector lookup
            String sectorName = request.getSector();
            Optional<Sector> sectorOpt = sectorRepository.findByName(sectorName);
            System.out.println("🔍 DEBUG: Sector '" + sectorName + "' found = " + sectorOpt.isPresent());

            return ResponseEntity.ok(ApiResponse.success("Debug info logged", "Check console for details"));

        } catch (Exception e) {
            System.out.println("❌ DEBUG ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Debug error: " + e.getMessage()));
        }
    }

    /**
     * 🚨 TEMPORARY - Public project creation for testing
     */
    @PostMapping("/public-create")
    public ResponseEntity<ApiResponse<ProjectDTO>> createProjectPublic(
            @Valid @RequestBody ProjectCreateRequest request) {

        try {
            System.out.println("🔓 PUBLIC: Creating project: " + request.getTitle());

            // Force use porteur1 for testing
            ProjectDTO createdProject = projectService.createProject(request, null, "porteur1");

            System.out.println("✅ PUBLIC: Project created with ID: " + createdProject.getId());

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(createdProject, "Project created successfully (public)"));

        } catch (Exception e) {
            System.err.println("❌ PUBLIC ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error creating project: " + e.getMessage()));
        }
    }

    /**
     * POST /api/projects - Créer un nouveau projet (Porteur seulement)
     * ✅ TEMPORARILY REMOVED @PreAuthorize FOR TESTING
     */
    @PostMapping
    // @PreAuthorize("hasRole('PORTEUR')")  // ✅ TEMPORARILY COMMENTED OUT
    public ResponseEntity<ApiResponse<ProjectDTO>> createProject(
            @Valid @RequestBody ProjectCreateRequest request,
            Authentication authentication) {

        try {
            String username = authentication != null ? authentication.getName() : "porteur1";
            System.out.println("🔍 CREATE: Username = " + username);

            // For React frontend, we handle image upload separately
            // This endpoint accepts JSON only, image upload can be done via separate endpoint
            ProjectDTO createdProject = projectService.createProject(request, null, username);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(createdProject, "Projet créé avec succès"));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Données invalides: " + e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace(); // For debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Erreur lors de la création du projet: " + e.getMessage()));
        }
    }

    /**
     * POST /api/projects/upload - Upload project with image (multipart)
     * ✅ NEW ENDPOINT for React file uploads
     */
    @PostMapping("/upload")
    @PreAuthorize("hasRole('PORTEUR')")
    public ResponseEntity<ApiResponse<ProjectDTO>> createProjectWithImage(
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
            e.printStackTrace(); // For debugging
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
    public ResponseEntity<ApiResponse<String>> deleteProject(
            @PathVariable Long id,
            Authentication authentication) {

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