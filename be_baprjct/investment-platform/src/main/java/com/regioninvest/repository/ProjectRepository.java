package com.regioninvest.repository;

import com.regioninvest.entity.Project;
import com.regioninvest.entity.ProjectStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    // Recherche de base par statut
    Page<Project> findByStatus(ProjectStatus status, Pageable pageable);

    // Recherche avec filtres multiples
    @Query("SELECT p FROM Project p WHERE " +
            "(:status IS NULL OR p.status = :status) AND " +
            "(:searchTerm IS NULL OR :searchTerm = '' OR " +
            " LOWER(p.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            " LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
            "(:province IS NULL OR :province = '' OR p.province = :province) AND " +
            "(:sectorName IS NULL OR :sectorName = '' OR p.sector.name LIKE %:sectorName%) AND " +
            "(:minBudget IS NULL OR p.budget >= :minBudget) AND " +
            "(:maxBudget IS NULL OR p.budget <= :maxBudget)")
    Page<Project> findProjectsWithFilters(
            @Param("status") ProjectStatus status,
            @Param("searchTerm") String searchTerm,
            @Param("province") String province,
            @Param("sectorName") String sectorName,
            @Param("minBudget") BigDecimal minBudget,
            @Param("maxBudget") BigDecimal maxBudget,
            Pageable pageable
    );

    // Recherche par secteur pour projets similaires
    @Query("SELECT p FROM Project p WHERE p.sector.id = :sectorId AND p.id != :excludeId AND p.status = :status ORDER BY p.views DESC")
    List<Project> findSimilarProjectsBySector(@Param("sectorId") Long sectorId,
                                              @Param("excludeId") Long excludeId,
                                              @Param("status") ProjectStatus status,
                                              Pageable pageable);

    // Recherche par province pour projets similaires
    @Query("SELECT p FROM Project p WHERE p.province = :province AND p.id != :excludeId AND p.status = :status ORDER BY p.views DESC")
    List<Project> findSimilarProjectsByProvince(@Param("province") String province,
                                                @Param("excludeId") Long excludeId,
                                                @Param("status") ProjectStatus status,
                                                Pageable pageable);

    // Projets par utilisateur (porteur)
    Page<Project> findByPorteurIdAndStatus(Long porteurId, ProjectStatus status, Pageable pageable);

    // Recherche par ID avec porteur
    @Query("SELECT p FROM Project p LEFT JOIN FETCH p.porteur LEFT JOIN FETCH p.sector WHERE p.id = :id")
    Optional<Project> findByIdWithDetails(@Param("id") Long id);

    // Statistiques par secteur
    @Query("SELECT p.sector.name, COUNT(p), SUM(p.budget), SUM(p.jobs) FROM Project p WHERE p.status = :status GROUP BY p.sector.name")
    List<Object[]> getProjectStatsBySector(@Param("status") ProjectStatus status);

    // Top projets les plus vus
    Page<Project> findByStatusOrderByViewsDesc(ProjectStatus status, Pageable pageable);

    // Projets récents
    Page<Project> findByStatusOrderByCreatedAtDesc(ProjectStatus status, Pageable pageable);

    // Compter projets par statut
    long countByStatus(ProjectStatus status);

    // Compter projets par porteur
    long countByPorteurIdAndStatus(Long porteurId, ProjectStatus status);

    // Recherche full-text dans titre et description
    @Query("SELECT p FROM Project p WHERE p.status = :status AND " +
            "(LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            " LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            " LOWER(p.location) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Project> searchByKeyword(@Param("keyword") String keyword,
                                  @Param("status") ProjectStatus status,
                                  Pageable pageable);

    // Projets par budget range
    Page<Project> findByStatusAndBudgetBetween(ProjectStatus status,
                                               BigDecimal minBudget,
                                               BigDecimal maxBudget,
                                               Pageable pageable);

    // Projets par province
    Page<Project> findByStatusAndProvince(ProjectStatus status, String province, Pageable pageable);

    // Projets par secteur
    @Query("SELECT p FROM Project p WHERE p.status = :status AND p.sector.name = :sectorName")
    Page<Project> findByStatusAndSectorName(@Param("status") ProjectStatus status,
                                            @Param("sectorName") String sectorName,
                                            Pageable pageable);

    // Recherche avancée avec tous les critères
    @Query("SELECT DISTINCT p FROM Project p " +
            "LEFT JOIN p.sector s " +
            "WHERE (:status IS NULL OR p.status = :status) " +
            "AND (:searchTerm IS NULL OR :searchTerm = '' OR " +
            "     LOWER(p.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "     LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "     LOWER(p.location) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
            "AND (:province IS NULL OR :province = '' OR p.province = :province) " +
            "AND (:sectorName IS NULL OR :sectorName = '' OR s.name = :sectorName) " +
            "AND (:minBudget IS NULL OR p.budget >= :minBudget) " +
            "AND (:maxBudget IS NULL OR p.budget <= :maxBudget)")
    Page<Project> findProjectsWithAdvancedFilters(
            @Param("status") ProjectStatus status,
            @Param("searchTerm") String searchTerm,
            @Param("province") String province,
            @Param("sectorName") String sectorName,
            @Param("minBudget") BigDecimal minBudget,
            @Param("maxBudget") BigDecimal maxBudget,
            Pageable pageable
    );

    // Projets populaires (par nombre de vues)
    @Query("SELECT p FROM Project p WHERE p.status = :status AND p.views > :minViews ORDER BY p.views DESC")
    List<Project> findPopularProjects(@Param("status") ProjectStatus status,
                                      @Param("minViews") Integer minViews,
                                      Pageable pageable);

    // Projets par plage de dates
    @Query("SELECT p FROM Project p WHERE p.status = :status AND p.createdAt BETWEEN :startDate AND :endDate")
    Page<Project> findByStatusAndCreatedAtBetween(@Param("status") ProjectStatus status,
                                                  @Param("startDate") java.time.LocalDateTime startDate,
                                                  @Param("endDate") java.time.LocalDateTime endDate,
                                                  Pageable pageable);

    // Rechercher projets par porteur username
    @Query("SELECT p FROM Project p WHERE p.porteur.username = :username AND p.status = :status")
    Page<Project> findByPorteurUsernameAndStatus(@Param("username") String username,
                                                 @Param("status") ProjectStatus status,
                                                 Pageable pageable);

    // Compter projets par porteur username
    @Query("SELECT COUNT(p) FROM Project p WHERE p.porteur.username = :username AND p.status = :status")
    long countByPorteurUsernameAndStatus(@Param("username") String username,
                                         @Param("status") ProjectStatus status);

    // Récupérer toutes les provinces distinctes
    @Query("SELECT DISTINCT p.province FROM Project p WHERE p.status = :status ORDER BY p.province")
    List<String> findDistinctProvincesByStatus(@Param("status") ProjectStatus status);

    // Récupérer tous les secteurs distincts avec projets actifs
    @Query("SELECT DISTINCT s.name FROM Project p JOIN p.sector s WHERE p.status = :status ORDER BY s.name")
    List<String> findDistinctSectorNamesByStatus(@Param("status") ProjectStatus status);