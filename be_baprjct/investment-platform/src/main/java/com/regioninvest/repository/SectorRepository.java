package com.regioninvest.repository;

import com.regioninvest.entity.Sector;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SectorRepository extends JpaRepository<Sector, Long> {

    // Trouver secteur par nom
    Optional<Sector> findByName(String name);

    // Secteurs actifs seulement
    List<Sector> findByIsActiveTrue();

    // Secteurs avec nombre de projets
    @Query("SELECT s, COUNT(p) FROM Sector s LEFT JOIN s.projects p WHERE s.isActive = true GROUP BY s ORDER BY s.name")
    List<Object[]> findActiveSectorsWithProjectCount();

    // Vérifier existence par nom (pour éviter doublons)
    boolean existsByNameIgnoreCase(String name);
}