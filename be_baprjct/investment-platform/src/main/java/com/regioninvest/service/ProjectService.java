package com.regioninvest.service;

import com.regioninvest.dto.*;
import com.regioninvest.entity.*;
import com.regioninvest.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private SectorRepository sectorRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${app.upload.dir:uploads/projects}")
    private String uploadDir;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    /**
     * Récupérer tous les projets avec filtres et pagination
     */
    public ProjectResponse getAllProjectsWithFilters(String searchTerm, String province,
                                                     String sector, String budgetRange,
                                                     String status, Pageable pageable) {

        // Convertir le statut en enum
        ProjectStatus projectStatus = ProjectStatus.valueOf(status.toUpperCase());

        // Convertir budgetRange en min/max
        BigDecimal minBudget = null;
        BigDecimal maxBudget = null;

        if (budgetRange != null && !budgetRange.isEmpty() && !budgetRange.equals("Tous les budgets")) {
            switch (budgetRange) {
                case "< 2M Dhs":
                    maxBudget = new BigDecimal("2.0");
                    break;
                case "2-5M Dhs":
                    minBudget = new BigDecimal("2.0");
                    maxBudget = new BigDecimal("5.0");
                    break;
                case "5-10M Dhs":
                    minBudget = new BigDecimal("5.0");
                    maxBudget = new BigDecimal("10.0");
                    break;
                case "> 10M Dhs":
                    minBudget = new BigDecimal("10.0");
                    break;
            }
        }

        // Nettoyer les paramètres
        String cleanSearchTerm = (searchTerm != null && !searchTerm.trim().isEmpty()) ? searchTerm.trim() : null;
        String cleanProvince = (province != null && !province.isEmpty() && !province.equals("Toutes les provinces")) ? province : null;
        String cleanSector = (sector != null && !sector.isEmpty() && !sector.equals("Tous les secteurs")) ? sector : null;

        // Recherche avec filtres
        Page<Project> projectPage = projectRepository.findProjectsWithFilters(
                projectStatus, cleanSearchTerm, cleanProvince, cleanSector,
                minBudget, maxBudget, pageable);

        // Convertir en DTOs
        List<ProjectDTO> projectDTOs = projectPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        // Informations de pagination
        ProjectResponse.PaginationInfo paginationInfo = new ProjectResponse.PaginationInfo(
                projectPage.getNumber(),
                projectPage.getTotalPages(),
                projectPage.getTotalElements(),
                projectPage.getSize()
        );

        // Options de filtrage
        ProjectResponse.FilterOptions filters = createFilterOptions();

        // Créer la réponse
        ProjectResponse response = new ProjectResponse(projectDTOs, paginationInfo);
        response.setFilters(filters);

        return response;
    }

    /**
     * Récupérer un projet par ID
     */
    @Transactional(readOnly = true)
    public ProjectDTO getProjectById(Long id) {
        Project project = projectRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé avec l'ID: " + id));

        // Incrémenter les vues de manière asynchrone
        incrementProjectViews(id);

        return convertToDetailDTO(project);
    }

    /**
     * 🆕 UPDATED: Créer un nouveau projet avec support PDF
     */
    public ProjectDTO createProject(ProjectCreateRequest request, MultipartFile image, MultipartFile pdfFile, String username) {
        // Vérifier que l'utilisateur existe et est un porteur ou admin
        User porteur = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé: " + username));

        // Vérifier le rôle - permettre ADMIN et PORTEUR
        if (!hasRole(porteur, "PORTEUR") && !hasRole(porteur, "ADMIN")) {
            throw new RuntimeException("Seuls les porteurs et administrateurs peuvent créer des projets");
        }

        // Trouver ou créer le secteur
        Sector sector = findOrCreateSector(request.getSector());

        // Créer le projet
        Project project = new Project();
        mapRequestToProject(request, project);
        project.setSector(sector);
        project.setPorteur(porteur);

        // Gérer l'upload d'image
        if (image != null && !image.isEmpty()) {
            String imageUrl = saveProjectImage(image, project.getTitle());
            project.setImageUrl(imageUrl);
        }

        // 🆕 NEW: Gérer l'upload de PDF
        if (pdfFile != null && !pdfFile.isEmpty()) {
            String pdfUrl = saveProjectPDF(pdfFile, project.getTitle());
            project.setPdfUrl(pdfUrl);
        }

        // Sauvegarder
        Project savedProject = projectRepository.save(project);

        return convertToDTO(savedProject);
    }

    /**
     * 🆕 UPDATED: Mettre à jour un projet avec support PDF
     */
    public ProjectDTO updateProject(Long id, ProjectCreateRequest request, MultipartFile image, MultipartFile pdfFile, String username) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé"));

        // Vérifier que l'utilisateur est le propriétaire OU admin
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (!project.getPorteur().getUsername().equals(username) && !hasRole(currentUser, "ADMIN")) {
            throw new RuntimeException("Vous n'êtes pas autorisé à modifier ce projet");
        }

        // Trouver ou créer le secteur
        Sector sector = findOrCreateSector(request.getSector());

        // Mettre à jour les champs
        mapRequestToProject(request, project);
        project.setSector(sector);

        // Gérer l'upload d'image
        if (image != null && !image.isEmpty()) {
            String imageUrl = saveProjectImage(image, project.getTitle());
            project.setImageUrl(imageUrl);
        }

        // 🆕 NEW: Gérer l'upload de PDF
        if (pdfFile != null && !pdfFile.isEmpty()) {
            String pdfUrl = saveProjectPDF(pdfFile, project.getTitle());
            project.setPdfUrl(pdfUrl);
        }

        Project updatedProject = projectRepository.save(project);
        return convertToDTO(updatedProject);
    }

    /**
     * Supprimer un projet
     */
    public void deleteProject(Long id, String username) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé"));

        // Vérifier les permissions - propriétaire OU admin
        if (username != null) {
            User currentUser = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            if (!project.getPorteur().getUsername().equals(username) && !hasRole(currentUser, "ADMIN")) {
                throw new RuntimeException("Vous n'êtes pas autorisé à supprimer ce projet");
            }
            System.out.println("Project " + id + " deleted by authenticated user: " + username);
        } else {
            // Allow deletion when username is null (testing/public access)
            System.out.println("Project " + id + " deleted via public access (testing mode)");
        }

        // Supprimer l'image si elle existe
        if (project.getImageUrl() != null) {
            deleteProjectImage(project.getImageUrl());
        }

        // 🆕 NEW: Supprimer le PDF si il existe
        if (project.getPdfUrl() != null) {
            deleteProjectPDF(project.getPdfUrl());
        }

        projectRepository.delete(project);
        System.out.println("Project with ID " + id + " has been successfully deleted");
    }

    /**
     * Rechercher des projets
     */
    @Transactional(readOnly = true)
    public ProjectResponse searchProjects(String keyword, Pageable pageable) {
        Page<Project> projectPage = projectRepository.searchByKeyword(
                keyword, ProjectStatus.ACTIVE, pageable);

        List<ProjectDTO> projectDTOs = projectPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        ProjectResponse.PaginationInfo paginationInfo = new ProjectResponse.PaginationInfo(
                projectPage.getNumber(),
                projectPage.getTotalPages(),
                projectPage.getTotalElements(),
                projectPage.getSize()
        );

        return new ProjectResponse(projectDTOs, paginationInfo);
    }

    /**
     * Récupérer des projets similaires
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getSimilarProjects(Long projectId, int limit) {
        Project currentProject = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé"));

        Pageable pageable = PageRequest.of(0, limit);

        // Chercher par secteur d'abord
        List<Project> similarProjects = projectRepository.findSimilarProjectsBySector(
                currentProject.getSector().getId(), projectId, ProjectStatus.ACTIVE, pageable);

        // Si pas assez, compléter avec des projets de la même province
        if (similarProjects.size() < limit) {
            int remaining = limit - similarProjects.size();
            List<Project> provinceProjects = projectRepository.findSimilarProjectsByProvince(
                    currentProject.getProvince(), projectId, ProjectStatus.ACTIVE,
                    PageRequest.of(0, remaining));

            // Éviter les doublons
            provinceProjects.stream()
                    .filter(p -> !similarProjects.contains(p))
                    .forEach(similarProjects::add);
        }

        List<Map<String, Object>> formattedProjects = similarProjects.stream()
                .map(this::convertToSimilarProjectMap)
                .collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("projects", formattedProjects);
        result.put("total", formattedProjects.size());

        return result;
    }

    /**
     * Récupérer les projets d'un porteur
     */
    @Transactional(readOnly = true)
    public ProjectResponse getProjectsByPorteur(String username, Pageable pageable) {
        User porteur = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Page<Project> projectPage = projectRepository.findByPorteurIdAndStatus(
                porteur.getId(), ProjectStatus.ACTIVE, pageable);

        List<ProjectDTO> projectDTOs = projectPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        ProjectResponse.PaginationInfo paginationInfo = new ProjectResponse.PaginationInfo(
                projectPage.getNumber(),
                projectPage.getTotalPages(),
                projectPage.getTotalElements(),
                projectPage.getSize()
        );

        return new ProjectResponse(projectDTOs, paginationInfo);
    }

    /**
     * Incrémenter les vues d'un projet
     */
    @Transactional
    public void incrementProjectViews(Long projectId) {
        try {
            projectRepository.findById(projectId).ifPresent(project -> {
                project.incrementViews();
                projectRepository.save(project);
            });
        } catch (Exception e) {
            // Ignorer les erreurs pour ne pas affecter l'expérience utilisateur
        }
    }

    /**
     * Récupérer les statistiques des projets
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getProjectStatistics() {
        Map<String, Object> stats = new HashMap<>();

        // Statistiques générales
        long totalProjects = projectRepository.countByStatus(ProjectStatus.ACTIVE);

        // Calculer les totaux
        List<Project> allActiveProjects = projectRepository.findByStatus(ProjectStatus.ACTIVE, Pageable.unpaged()).getContent();

        BigDecimal totalInvestment = allActiveProjects.stream()
                .map(Project::getBudget)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalRevenue = allActiveProjects.stream()
                .map(Project::getRevenue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Integer totalJobs = allActiveProjects.stream()
                .mapToInt(Project::getJobs)
                .sum();

        Long totalViews = allActiveProjects.stream()
                .mapToLong(Project::getViews)
                .sum();

        stats.put("totalProjects", totalProjects);
        stats.put("totalInvestment", totalInvestment);
        stats.put("totalRevenue", totalRevenue);
        stats.put("totalJobs", totalJobs);
        stats.put("totalViews", totalViews);

        // Statistiques par secteur
        List<Object[]> sectorStats = projectRepository.getProjectStatsBySector(ProjectStatus.ACTIVE);
        List<Map<String, Object>> formattedSectorStats = sectorStats.stream()
                .map(stat -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("sector", stat[0]);
                    map.put("count", stat[1]);
                    map.put("totalInvestment", stat[2]);
                    map.put("totalJobs", stat[3]);
                    return map;
                })
                .collect(Collectors.toList());

        stats.put("bySector", formattedSectorStats);

        return stats;
    }

    // ============= MÉTHODES PRIVÉES =============

    /**
     * 🆕 UPDATED: Convertir Project en ProjectDTO pour le catalogue avec PDF URL
     */
    private ProjectDTO convertToDTO(Project project) {
        ProjectDTO dto = new ProjectDTO();

        dto.setId(project.getId());
        dto.setTitle(project.getTitle());
        dto.setDescription(truncateDescription(project.getDescription(), 150));
        dto.setSector(project.getSector().getName());
        dto.setSectorId(project.getSector().getId());
        dto.setLocation(project.getLocation());
        dto.setProvince(project.getProvince());
        dto.setBudget(project.getBudget());
        dto.setRevenue(project.getRevenue());
        dto.setJobs(project.getJobs());
        dto.setProfitability(project.getProfitability());
        dto.setImageUrl(formatImageUrl(project.getImageUrl()));
        dto.setPdfUrl(project.getPdfUrl()); // 🆕 NEW: Include PDF URL
        dto.setStatus(project.getStatus().name());
        dto.setCategory(project.getCategory() != null ? project.getCategory().name() : null);
        dto.setViews(project.getViews());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setUpdatedAt(project.getUpdatedAt());

        // Informations du porteur (adapté à votre structure User)
        if (project.getPorteur() != null) {
            dto.setPorteurId(project.getPorteur().getId());
            dto.setPorteurName(project.getPorteur().getUsername()); // Utiliser username comme nom
            dto.setPorteurEmail(project.getPorteur().getEmail());
        }

        // Données formatées
        dto.setFormattedBudget(project.getBudget() + " M Dhs");
        dto.setFormattedRevenue(project.getRevenue() + " M Dhs");
        dto.setFullLocation(project.getLocation() + ", " + project.getProvince());
        dto.setPublishedDate(project.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));

        return dto;
    }

    /**
     * 🆕 UPDATED: Convertir Project en ProjectDTO avec tous les détails y compris PDF
     */
    private ProjectDTO convertToDetailDTO(Project project) {
        ProjectDTO dto = convertToDTO(project);

        // Ajouter tous les champs détaillés
        dto.setDescription(project.getDescription()); // Description complète
        dto.setGoal(project.getGoal());
        dto.setTechnology(project.getTechnology());
        dto.setImpact(project.getImpact());
        dto.setIncentives(project.getIncentives());
        dto.setPartners(project.getPartners());
        dto.setPublishTime(project.getPublishTime());

        // Données économiques pour les détails
        List<ProjectDTO.EconomicDataItem> economicData = Arrays.asList(
                new ProjectDTO.EconomicDataItem("Investissement", project.getBudget() + " M Dhs", "DollarSign", project.getBudget()),
                new ProjectDTO.EconomicDataItem("Chiffre d'affaires", project.getRevenue() + " M Dhs", "TrendingUp", project.getRevenue()),
                new ProjectDTO.EconomicDataItem("Emplois", project.getJobs().toString(), "Users", project.getJobs()),
                new ProjectDTO.EconomicDataItem("Ratio de rentabilité", project.getProfitability().toString(), "TrendingUp", project.getProfitability())
        );
        dto.setEconomicData(economicData);

        // Informations clés pour la sidebar
        ProjectDTO.KeyInformation keyInfo = new ProjectDTO.KeyInformation(
                dto.getFullLocation(),
                project.getSector().getName(),
                project.getBudget() + " millions Dhs",
                project.getJobs() + " emplois",
                project.getRevenue() + " millions Dhs"
        );
        dto.setKeyInfo(keyInfo);

        // Liste des incitations
        if (project.getIncentives() != null && !project.getIncentives().trim().isEmpty()) {
            List<String> incentivesList = Arrays.stream(project.getIncentives().split("\\n"))
                    .map(line -> line.trim().replaceFirst("^•\\s*", "")) // Enlever les puces
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
            dto.setIncentivesList(incentivesList);
        }

        return dto;
    }

    /**
     * Convertir Project en Map pour projets similaires
     */
    private Map<String, Object> convertToSimilarProjectMap(Project project) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", project.getId());
        map.put("title", project.getTitle());
        map.put("location", project.getProvince());
        map.put("sector", project.getSector().getName());
        map.put("image", formatImageUrl(project.getImageUrl()));
        map.put("views", project.getViews());
        return map;
    }

    /**
     * Mapper les données de la requête vers l'entité Project
     */
    private void mapRequestToProject(ProjectCreateRequest request, Project project) {
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setLocation(request.getLocation());
        project.setProvince(request.getProvince());
        project.setBudget(request.getBudget());
        project.setRevenue(request.getRevenue() != null ? request.getRevenue() : BigDecimal.ZERO);
        project.setJobs(request.getJobs() != null ? request.getJobs() : 0);
        project.setProfitability(request.getProfitability() != null ? request.getProfitability() : BigDecimal.ZERO);
        project.setGoal(request.getGoal());
        project.setTechnology(request.getTechnology());
        project.setImpact(request.getImpact());
        project.setIncentives(request.getIncentives());
        project.setPartners(request.getPartners());
        project.setPublishTime(request.getPublishTime());

        // Mapper la catégorie
        if (request.getCategory() != null) {
            try {
                project.setCategory(ProjectCategory.valueOf(request.getCategory().toUpperCase()));
            } catch (IllegalArgumentException e) {
                project.setCategory(ProjectCategory.TRADITIONAL_CRAFTS); // Par défaut
            }
        }
    }

    /**
     * Trouver ou créer un secteur
     */
    private Sector findOrCreateSector(String sectorName) {
        return sectorRepository.findByName(sectorName)
                .orElseGet(() -> {
                    Sector newSector = new Sector();
                    newSector.setName(sectorName);
                    newSector.setIsActive(true);
                    return sectorRepository.save(newSector);
                });
    }

    /**
     * Sauvegarder une image de projet
     */
    private String saveProjectImage(MultipartFile file, String projectTitle) {
        try {
            // Créer le répertoire s'il n'existe pas
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Générer un nom de fichier unique
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null ?
                    originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";

            String filename = "project_" + System.currentTimeMillis() + "_" +
                    cleanFilename(projectTitle) + extension;

            Path filePath = uploadPath.resolve(filename);

            // Copier le fichier
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return filename;

        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de la sauvegarde de l'image: " + e.getMessage());
        }
    }

    /**
     * 🆕 NEW: Sauvegarder un fichier PDF de projet
     */
    private String saveProjectPDF(MultipartFile file, String projectTitle) {
        try {
            // Créer le répertoire s'il n'existe pas
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Générer un nom de fichier unique pour le PDF
            String filename = "project_pdf_" + System.currentTimeMillis() + "_" +
                    cleanFilename(projectTitle) + ".pdf";

            Path filePath = uploadPath.resolve(filename);

            // Copier le fichier
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return filename;

        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de la sauvegarde du PDF: " + e.getMessage());
        }
    }

    /**
     * Supprimer une image de projet
     */
    private void deleteProjectImage(String imageUrl) {
        try {
            Path filePath = Paths.get(uploadDir, imageUrl);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Log l'erreur mais ne pas échouer
            System.err.println("Erreur lors de la suppression de l'image: " + e.getMessage());
        }
    }

    /**
     * 🆕 NEW: Supprimer un fichier PDF de projet
     */
    private void deleteProjectPDF(String pdfUrl) {
        try {
            Path filePath = Paths.get(uploadDir, pdfUrl);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Log l'erreur mais ne pas échouer
            System.err.println("Erreur lors de la suppression du PDF: " + e.getMessage());
        }
    }

    /**
     * Créer les options de filtrage
     */
    private ProjectResponse.FilterOptions createFilterOptions() {
        List<String> provinces = Arrays.asList(
                "Toutes les provinces", "Ouarzazate", "Errachidia", "Midelt", "Tinghir", "Zagora"
        );

        List<String> sectors = new ArrayList<>();
        sectors.add("Tous les secteurs");
        sectors.addAll(sectorRepository.findByIsActiveTrue().stream()
                .map(Sector::getName)
                .collect(Collectors.toList()));

        List<String> budgetRanges = Arrays.asList(
                "Tous les budgets", "< 2M Dhs", "2-5M Dhs", "5-10M Dhs", "> 10M Dhs"
        );

        return new ProjectResponse.FilterOptions(provinces, sectors, budgetRanges);
    }

    /**
     * Vérifier si un utilisateur a un rôle spécifique (adapté à votre structure ManyToOne)
     */
    private boolean hasRole(User user, String roleName) {
        return user.getRole() != null && user.getRole().getName().equals(roleName);
    }

    /**
     * Tronquer la description
     */
    private String truncateDescription(String description, int maxLength) {
        if (description == null || description.length() <= maxLength) {
            return description;
        }
        return description.substring(0, maxLength) + "...";
    }

    /**
     * Formater l'URL de l'image
     */
    private String formatImageUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            return "/api/placeholder/400/250";
        }

        if (imageUrl.startsWith("http")) {
            return imageUrl;
        }

        return baseUrl + "/uploads/" + imageUrl;
    }

    /**
     * Nettoyer le nom de fichier
     */
    private String cleanFilename(String filename) {
        return filename.replaceAll("[^a-zA-Z0-9._-]", "_").toLowerCase();
    }
}