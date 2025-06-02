import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Users, Download, Calendar, Eye, Edit, Trash2 } from 'lucide-react';

const ProjectCatalogPorteur = () => {
  // Backend data states
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  
  // UI states
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(false);
  
  // Backend pagination data
  const [totalPages, setTotalPages] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  
  // Filter options from backend
  const [filterOptions, setFilterOptions] = useState({
    provinces: ["Toutes les provinces"],
    sectors: ["Tous les secteurs"],
    budgetRanges: ["Tous les budgets"]
  });

  // Fetch projects from backend
  const fetchProjects = async (page = 0) => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        size: '6',
        sortBy: 'createdAt',
        sortDir: 'desc'
      });

      // Add filters if selected
      if (searchTerm && searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }
      if (selectedProvince && selectedProvince !== "Toutes les provinces") {
        params.append('province', selectedProvince);
      }
      if (selectedSector && selectedSector !== "Tous les secteurs") {
        params.append('sector', selectedSector);
      }
      if (selectedBudget && selectedBudget !== "Tous les budgets") {
        params.append('budgetRange', selectedBudget);
      }

      const response = await fetch(`http://localhost:8080/api/projects?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiResponse = await response.json();
      
      if (apiResponse.success && apiResponse.data) {
        const { projects: projectsList, pagination, filters } = apiResponse.data;
        
        // Transform backend data to match project structure
        const transformedProjects = (projectsList || []).map(project => ({
          id: project.id,
          title: project.title,
          location: project.fullLocation || `${project.location}, ${project.province}`,
          sector: project.sector,
          budget: project.formattedBudget || `${project.budget} M Dhs`,
          jobs: project.jobs || 0,
          image: project.imageUrl || "/api/placeholder/400/250",
          description: project.description,
          category: project.category?.toLowerCase().replace('_', '-') || 'other',
          views: project.views || 0,
          createdAt: project.createdAt,
          // Keep backend data for potential future use
          rawProject: project
        }));
        
        setProjects(transformedProjects);
        
        // Update pagination info
        if (pagination) {
          setCurrentPage(pagination.currentPage + 1);
          setTotalPages(pagination.totalPages);
          setTotalProjects(pagination.totalProjects);
        }
        
        // Update filter options
        if (filters) {
          setFilterOptions({
            provinces: filters.provinces || ["Toutes les provinces"],
            sectors: filters.sectors || ["Tous les secteurs"],
            budgetRanges: filters.budgetRanges || ["Tous les budgets"]
          });
        }
      } else {
        throw new Error(apiResponse.error || 'Failed to fetch projects');
      }
      
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError(error.message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete project function
  const deleteProject = async (projectId) => {
    try {
      setDeletingProject(true);
      
      // Get JWT token from localStorage (adjust based on your auth implementation)
      const token = localStorage.getItem('token') || localStorage.getItem('jwt');
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add Authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`http://localhost:8080/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: headers
      });

      if (response.ok) {
        // Success - refresh the projects list
        await fetchProjects(currentPage - 1);
        setShowDeleteModal(false);
        setSelectedProject(null);
        
        // Show success message
        alert('✅ Projet supprimé avec succès!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
    } catch (error) {
      console.error('Error deleting project:', error);
      alert(`❌ Erreur lors de la suppression: ${error.message}`);
    } finally {
      setDeletingProject(false);
    }
  };

  // Handle delete button click
  const handleDeleteClick = (project) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
  };

  // Handle modify button click
  const handleModifyClick = (project) => {
    // For now, we'll just alert - you can implement the modify functionality later
    alert(`🔧 Modification du projet: ${project.title}\n\n(Fonctionnalité à implémenter)`);
  };

  // Initial load
  useEffect(() => {
    fetchProjects(0);
  }, []);

  // Handle filter changes
  useEffect(() => {
    if (!loading) {
      setCurrentPage(1);
      fetchProjects(0);
    }
  }, [searchTerm, selectedProvince, selectedSector, selectedBudget]);

  // Handle page changes
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchProjects(newPage - 1);
    }
  };

  const filteredProjects = projects;
  const paginatedProjects = filteredProjects;

  const handleInvestmentRequest = (project) => {
    setSelectedProject(project);
    setShowInvestmentModal(true);
  };

  const submitInvestmentRequest = async () => {
    alert(`Demande d'investissement soumise pour: ${selectedProject.title}`);
    setShowInvestmentModal(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="catalog-container">
        <style>{catalogStyles}</style>
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Chargement des projets...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="catalog-container">
        <style>{catalogStyles}</style>
        <div className="error-content">
          <h2 className="error-title">Erreur de chargement</h2>
          <p className="error-message">{error}</p>
          <button className="retry-btn" onClick={() => fetchProjects(0)}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="catalog-container">
      <style>{catalogStyles}</style>
      
      {/* Header */}
      <header className="catalog-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">🏛️</div>
            <h1>Banque de projets - Porteur</h1>
          </div>
          <nav className="main-nav">
            <a href="/project_catalog" className="nav-link">Catalogue Public</a>
            <a href="/project_catalog_porteur" className="nav-link active">Mes Projets</a>
            <a href="/submit_page" className="nav-link">Nouveau Projet</a>
            <a href="#" className="nav-link">Profil</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h2>Gérer Mes Projets</h2>
          <p>Modifiez et gérez vos projets d'investissement dans la région Drâa-Tafilalet</p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="search-section">
        <div className="search-container">
          <div className="search-bar">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher parmi mes projets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filters-row">
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="filter-select"
            >
              <option value="">📍 Province</option>
              {filterOptions.provinces.map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>

            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="filter-select"
            >
              <option value="">🏢 Secteur</option>
              {filterOptions.sectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>

            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="filter-select"
            >
              <option value="">💰 Budget</option>
              {filterOptions.budgetRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>

            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                ⚏
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                ☰
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results Count */}
      <div className="results-info">
        <span className="results-count">
          {totalProjects} projet(s) trouvé(s)
        </span>
      </div>

      {/* Projects Grid */}
      <section className="projects-section">
        <div className={`projects-container ${viewMode}`}>
          {paginatedProjects.map(project => (
            <div key={project.id} className="project-card">
              <div className="project-image">
                <img src={project.image} alt={project.title} />
                <div className="sector-badge">{project.sector}</div>
              </div>
              
              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                
                <div className="project-location">
                  <MapPin size={16} />
                  <span>{project.location}</span>
                </div>
                
                <p className="project-description">{project.description}</p>
                
                <div className="project-stats">
                  <div className="stat">
                    <DollarSign size={16} />
                    <span className="budget">{project.budget}</span>
                  </div>
                  <div className="stat">
                    <Users size={16} />
                    <span>{project.jobs} emplois</span>
                  </div>
                  <div className="stat">
                    <Eye size={16} />
                    <span>{project.views} vues</span>
                  </div>
                </div>
                
                <div className="project-actions">
                  <button className="btn btn-primary">
                    <Eye size={16} />
                    Détails
                  </button>
                  <button className="btn btn-secondary">
                    <Download size={16} />
                    Fiche
                  </button>
                  <button 
                    className="btn btn-warning"
                    onClick={() => handleModifyClick(project)}
                  >
                    <Edit size={16} />
                    Modifier
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDeleteClick(project)}
                  >
                    <Trash2 size={16} />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Suivant
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirmer la suppression</h3>
              <button 
                className="modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="delete-warning">
                <div className="warning-icon">⚠️</div>
                <h4>Êtes-vous sûr de vouloir supprimer ce projet ?</h4>
                <p><strong>{selectedProject?.title}</strong></p>
                <p className="warning-text">
                  Cette action est irréversible. Le projet sera définitivement supprimé 
                  de la base de données.
                </p>
              </div>
              
              <div className="form-actions">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deletingProject}
                >
                  Annuler
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={() => deleteProject(selectedProject.id)}
                  disabled={deletingProject}
                >
                  {deletingProject ? 'Suppression...' : 'Supprimer définitivement'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Investment Modal (keeping the existing one) */}
      {showInvestmentModal && (
        <div className="modal-overlay" onClick={() => setShowInvestmentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Demande d'Investissement</h3>
              <button 
                className="modal-close"
                onClick={() => setShowInvestmentModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <h4>{selectedProject?.title}</h4>
              <p>Soumettez votre demande d'investissement pour ce projet.</p>
              
              <div className="investment-form">
                <div className="form-group">
                  <label>Nom complet *</label>
                  <input type="text" required />
                </div>
                
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" required />
                </div>
                
                <div className="form-group">
                  <label>Téléphone *</label>
                  <input type="tel" required />
                </div>
                
                <div className="form-group">
                  <label>Montant d'investissement souhaité</label>
                  <input type="text" placeholder="Ex: 500,000 Dhs" />
                </div>
                
                <div className="form-group">
                  <label>Message</label>
                  <textarea rows="4" placeholder="Décrivez votre intérêt pour ce projet..."></textarea>
                </div>
                
                <div className="form-actions">
                  <button className="btn btn-secondary" onClick={() => setShowInvestmentModal(false)}>
                    Annuler
                  </button>
                  <button className="btn btn-primary" onClick={submitInvestmentRequest}>
                    Soumettre la demande
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles (keeping all existing styles + adding new ones for delete/modify buttons)
const catalogStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f8f9fa;
  }

  .catalog-container {
    min-height: 100vh;
  }

  /* Loading and Error States */
  .loading-content, .error-content {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    max-width: 500px;
    margin: 2rem auto;
  }

  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #8B4513;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-title {
    color: #dc3545;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .error-message {
    color: #6c757d;
    margin-bottom: 1.5rem;
  }

  .retry-btn {
    background: #8B4513;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
  }

  .retry-btn:hover {
    background: #A0522D;
  }

  /* Header Styles */
  .catalog-header {
    background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
    box-shadow: 0 2px 20px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo-section {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .logo {
    font-size: 2rem;
    background: rgba(255,255,255,0.2);
    padding: 0.5rem;
    border-radius: 12px;
    backdrop-filter: blur(10px);
  }

  .logo-section h1 {
    color: white;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .main-nav {
    display: flex;
    gap: 2rem;
  }

  .nav-link {
    color: rgba(255,255,255,0.9);
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    font-weight: 500;
  }

  .nav-link:hover,
  .nav-link.active {
    background: rgba(255,255,255,0.2);
    color: white;
    backdrop-filter: blur(10px);
  }

  /* Hero Section */
  .hero-section {
    background: linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #CD853F 100%);
    padding: 4rem 2rem;
    text-align: center;
    color: white;
  }

  .hero-content h2 {
    font-size: 3rem;
    margin-bottom: 1rem;
    font-weight: 700;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  }

  .hero-content p {
    font-size: 1.2rem;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto;
  }

  /* Search Section */
  .search-section {
    background: white;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    margin: -2rem 2rem 2rem;
    border-radius: 20px;
    position: relative;
    z-index: 10;
  }

  .search-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .search-bar {
    position: relative;
    margin-bottom: 1.5rem;
  }

  .search-bar input {
    width: 100%;
    padding: 1rem 1rem 1rem 3rem;
    border: 2px solid #e9ecef;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: #f8f9fa;
  }

  .search-bar input:focus {
    outline: none;
    border-color: #8B4513;
    background: white;
    box-shadow: 0 0 0 3px rgba(139, 69, 19, 0.1);
  }

  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6c757d;
  }

  .filters-row {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .filter-select {
    padding: 0.75rem 1rem;
    border: 2px solid #e9ecef;
    border-radius: 10px;
    background: white;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 150px;
  }

  .filter-select:focus {
    outline: none;
    border-color: #8B4513;
    box-shadow: 0 0 0 3px rgba(139, 69, 19, 0.1);
  }

  .view-toggle {
    display: flex;
    margin-left: auto;
    background: #f8f9fa;
    border-radius: 10px;
    padding: 0.25rem;
  }

  .view-btn {
    padding: 0.5rem 1rem;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.3s ease;
    font-size: 1.2rem;
  }

  .view-btn.active {
    background: #8B4513;
    color: white;
  }

  /* Results Info */
  .results-info {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem 1rem;
  }

  .results-count {
    color: #6c757d;
    font-weight: 500;
  }

  /* Projects Section */
  .projects-section {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem 2rem;
  }

  .projects-container.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 2rem;
  }

  .projects-container.list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .projects-container.list .project-card {
    display: flex;
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
  }

  .projects-container.list .project-image {
    width: 300px;
    flex-shrink: 0;
  }

  .projects-container.list .project-content {
    flex: 1;
    padding: 2rem;
  }

  /* Project Card */
  .project-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    border: 1px solid #f1f3f4;
  }

  .project-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.15);
  }

  .project-image {
    position: relative;
    height: 200px;
    overflow: hidden;
  }

  .project-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .project-card:hover .project-image img {
    transform: scale(1.05);
  }

  .sector-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(139, 69, 19, 0.9);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
    backdrop-filter: blur(10px);
  }

  .project-content {
    padding: 1.5rem;
  }

  .project-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: #2c3e50;
    line-height: 1.4;
  }

  .project-location {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #6c757d;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }

  .project-description {
    color: #555;
    margin-bottom: 1.5rem;
    line-height: 1.6;
    font-size: 0.95rem;
  }

  .project-stats {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 12px;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .stat {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #555;
    font-size: 0.9rem;
  }

  .budget {
    font-weight: 600;
    color: #8B4513;
  }

  .project-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  /* Buttons */
  .btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    justify-content: center;
    min-width: fit-content;
  }

  .btn-primary {
    background: #8B4513;
    color: white;
  }

  .btn-primary:hover {
    background: #A0522D;
    transform: translateY(-2px);
  }

  .btn-secondary {
    background: #6c757d;
    color: white;
  }

  .btn-secondary:hover {
    background: #545b62;
    transform: translateY(-2px);
  }

  .btn-accent {
    background: #28a745;
    color: white;
  }

  .btn-accent:hover {
    background: #218838;
    transform: translateY(-2px);
  }

  .btn-warning {
    background: #ffc107;
    color: #212529;
  }

  .btn-warning:hover {
    background: #e0a800;
    transform: translateY(-2px);
  }

  .btn-danger {
    background: #dc3545;
    color: white;
  }

  .btn-danger:hover {
    background: #c82333;
    transform: translateY(-2px);
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  /* Pagination */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin: 3rem 0;
  }

  .pagination-btn {
    padding: 0.75rem 1rem;
    border: 2px solid #e9ecef;
    background: white;
    color: #6c757d;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
    min-width: 45px;
  }

  .pagination-btn:hover:not(:disabled) {
    border-color: #8B4513;
    color: #8B4513;
    transform: translateY(-2px);
  }

  .pagination-btn.active {
    background: #8B4513;
    border-color: #8B4513;
    color: white;
  }

  .pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 2rem;
    backdrop-filter: blur(5px);
  }

  .modal-content {
    background: white;
    border-radius: 20px;
    max-width: 500px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    transform: scale(0.9);
    animation: modalAppear 0.3s ease forwards;
  }

  @keyframes modalAppear {
    to {
      transform: scale(1);
    }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem 2rem 1rem;
    border-bottom: 1px solid #e9ecef;
  }

  .modal-header h3 {
    color: #2c3e50;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .modal-close {
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: #6c757d;
    padding: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
  }

  .modal-close:hover {
    background: #f8f9fa;
    color: #333;
  }

  .modal-body {
    padding: 2rem;
  }

  .modal-body h4 {
    color: #8B4513;
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
  }

  .modal-body p {
    color: #6c757d;
    margin-bottom: 2rem;
  }

  /* Delete Modal Specific Styles */
  .delete-warning {
    text-align: center;
    margin-bottom: 2rem;
  }

  .warning-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .delete-warning h4 {
    color: #dc3545;
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }

  .delete-warning p {
    margin-bottom: 0.5rem;
  }

  .delete-warning p strong {
    color: #2c3e50;
    font-weight: 600;
  }

  .warning-text {
    color: #6c757d;
    font-size: 0.95rem;
    background: #fff3cd;
    padding: 1rem;
    border-radius: 8px;
    border-left: 4px solid #ffc107;
    margin-top: 1rem;
  }

  /* Investment Form */
  .investment-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group label {
    font-weight: 600;
    color: #2c3e50;
    font-size: 0.95rem;
  }

  .form-group input,
  .form-group textarea {
    padding: 0.75rem;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: #f8f9fa;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #8B4513;
    background: white;
    box-shadow: 0 0 0 3px rgba(139, 69, 19, 0.1);
  }

  .form-group textarea {
    resize: vertical;
    min-height: 100px;
    font-family: inherit;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e9ecef;
  }

  .form-actions .btn {
    flex: none;
    min-width: 120px;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .header-content {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .main-nav {
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .hero-content h2 {
      font-size: 2rem;
    }

    .search-section {
      margin: -1rem 1rem 1rem;
      padding: 1.5rem;
    }

    .filters-row {
      flex-direction: column;
      align-items: stretch;
    }

    .filter-select {
      min-width: auto;
    }

    .view-toggle {
      margin-left: 0;
      align-self: center;
    }

    .projects-container.grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .projects-container.list .project-card {
      flex-direction: column;
    }

    .projects-container.list .project-image {
      width: 100%;
      height: 200px;
    }

    .project-actions {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }

    .project-stats {
      flex-direction: column;
      gap: 0.5rem;
      text-align: center;
    }

    .pagination {
      flex-wrap: wrap;
      gap: 0.25rem;
    }

    .pagination-btn {
      padding: 0.5rem 0.75rem;
      font-size: 0.9rem;
      min-width: 40px;
    }

    .modal-overlay {
      padding: 1rem;
    }

    .modal-header,
    .modal-body {
      padding: 1.5rem;
    }

    .form-actions {
      flex-direction: column;
    }
  }

  @media (max-width: 480px) {
    .hero-content h2 {
      font-size: 1.75rem;
    }

    .hero-content p {
      font-size: 1rem;
    }

    .search-section {
      margin: -0.5rem 0.5rem 0.5rem;
      padding: 1rem;
    }

    .projects-section {
      padding: 0 1rem 1rem;
    }

    .project-card {
      border-radius: 12px;
    }

    .project-content {
      padding: 1rem;
    }

    .project-title {
      font-size: 1.1rem;
    }
  }

  /* Animation enhancements */
  .project-card {
    animation: fadeInUp 0.6s ease forwards;
    opacity: 0;
    transform: translateY(30px);
  }

  .project-card:nth-child(1) { animation-delay: 0.1s; }
  .project-card:nth-child(2) { animation-delay: 0.2s; }
  .project-card:nth-child(3) { animation-delay: 0.3s; }
  .project-card:nth-child(4) { animation-delay: 0.4s; }
  .project-card:nth-child(5) { animation-delay: 0.5s; }
  .project-card:nth-child(6) { animation-delay: 0.6s; }

  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Focus states for accessibility */
  .nav-link:focus,
  .btn:focus,
  .filter-select:focus {
    outline: 2px solid #8B4513;
    outline-offset: 2px;
  }
`;

export default ProjectCatalogPorteur;