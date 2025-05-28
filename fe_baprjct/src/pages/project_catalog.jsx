import React, { useState } from 'react';
import { Search, MapPin, DollarSign, Users, Download, Calendar, Eye } from 'lucide-react';

const ProjectCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      id: 1,
      title: "Atelier de production de tapis berbères traditionnels",
      location: "Rissani, Drâa-Tafilalet",
      sector: "Artisanat",
      budget: "1.4 M Dhs",
      jobs: 35,
      image: "/api/placeholder/400/250",
      description: "Création d'un atelier de production et de formation aux techniques traditionnelles de tissage des tapis",
      category: "traditional-crafts"
    },
    {
      id: 2,
      title: "Centrale solaire photovoltaïque",
      location: "Ouarzazate, Drâa-Tafilalet",
      sector: "Énergie renouvelable",
      budget: "12.5 M Dhs",
      jobs: 45,
      image: "/api/placeholder/400/250",
      description: "Extension de la capacité solaire dans la région d'Ouarzazate, profitant de l'ensoleillement exceptionnel",
      category: "renewable-energy"
    },
    {
      id: 3,
      title: "Centre de formation aux métiers du tourisme",
      location: "Midelt, Drâa-Tafilalet",
      sector: "Éducation",
      budget: "5.5 M Dhs",
      jobs: 30,
      image: "/api/placeholder/400/250",
      description: "Création d'un centre de formation professionnelle spécialisé dans les métiers du tourisme",
      category: "education"
    },
    {
      id: 4,
      title: "Clinique médicale mobile pour zones rurales",
      location: "Erfoud, Drâa-Tafilalet",
      sector: "Santé",
      budget: "2.7 M Dhs",
      jobs: 18,
      image: "/api/placeholder/400/250",
      description: "Mise en place d'un service de clinique mobile pour desservir les zones rurales isolées",
      category: "health"
    },
    {
      id: 5,
      title: "Complexe écotouristique dans les oasis",
      location: "Zagora, Drâa-Tafilalet",
      sector: "Tourisme",
      budget: "8.3 M Dhs",
      jobs: 75,
      image: "/api/placeholder/400/250",
      description: "Développement d'un complexe touristique écologique intégré dans les palmeraies",
      category: "tourism"
    },
    {
      id: 6,
      title: "Réhabilitation des kasbahs historiques",
      location: "Kelaat M'Gouna, Drâa-Tafilalet",
      sector: "Patrimoine",
      budget: "6.9 M Dhs",
      jobs: 40,
      image: "/api/placeholder/400/250",
      description: "Projet de restauration et de valorisation touristique des kasbahs historiques",
      category: "heritage"
    },
    {
      id: 7,
      title: "Système d'irrigation goutte-à-goutte",
      location: "Tinghir, Drâa-Tafilalet",
      sector: "Agriculture",
      budget: "3.2 M Dhs",
      jobs: 25,
      image: "/api/placeholder/400/250",
      description: "Mise en place d'un système d'irrigation moderne et économe en eau pour les palmeraies",
      category: "agriculture"
    },
    {
      id: 8,
      title: "Unité de conditionnement des dattes",
      location: "Errachidia, Drâa-Tafilalet",
      sector: "Agriculture",
      budget: "4.8 M Dhs",
      jobs: 60,
      image: "/api/placeholder/400/250",
      description: "Création d'une unité moderne de conditionnement et de transformation des dattes",
      category: "agriculture"
    }
  ];

  const provinces = ["Toutes les provinces", "Ouarzazate", "Errachidia", "Midelt", "Tinghir", "Zagora"];
  const sectors = ["Tous les secteurs", "Agriculture", "Tourisme", "Artisanat", "Énergie renouvelable", "Santé", "Éducation", "Patrimoine"];
  const budgetRanges = ["Tous les budgets", "< 2M Dhs", "2-5M Dhs", "5-10M Dhs", "> 10M Dhs"];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvince = !selectedProvince || selectedProvince === "Toutes les provinces" || 
                           project.location.includes(selectedProvince);
    const matchesSector = !selectedSector || selectedSector === "Tous les secteurs" || 
                         project.sector.includes(selectedSector);
    
    let matchesBudget = true;
    if (selectedBudget && selectedBudget !== "Tous les budgets") {
      const budget = parseFloat(project.budget.replace(/[^\d.]/g, ''));
      switch (selectedBudget) {
        case "< 2M Dhs":
          matchesBudget = budget < 2;
          break;
        case "2-5M Dhs":
          matchesBudget = budget >= 2 && budget <= 5;
          break;
        case "5-10M Dhs":
          matchesBudget = budget > 5 && budget <= 10;
          break;
        case "> 10M Dhs":
          matchesBudget = budget > 10;
          break;
      }
    }
    
    return matchesSearch && matchesProvince && matchesSector && matchesBudget;
  });

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  const handleInvestmentRequest = (project) => {
    setSelectedProject(project);
    setShowInvestmentModal(true);
  };

  const submitInvestmentRequest = () => {
    // Handle investment request submission
    alert(`Demande d'investissement soumise pour: ${selectedProject.title}`);
    setShowInvestmentModal(false);
  };

  return (
    <div className="catalog-container">
      <style>{`
        /* Project Catalog Styles */
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
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
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
          flex: 1;
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
            flex-direction: column;
          }

          .project-actions .btn {
            flex: none;
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

          .project-stats {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
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

        /* Loading states */
        .filter-select:disabled,
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Focus states for accessibility */
        .nav-link:focus,
        .btn:focus,
        .filter-select:focus {
          outline: 2px solid #8B4513;
          outline-offset: 2px;
        }
      `}</style>
      {/* Header */}
      <header className="catalog-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">🏛️</div>
            <h1>Banque de projets</h1>
          </div>
          <nav className="main-nav">
            <a href="#" className="nav-link">Accueil</a>
            <a href="#" className="nav-link active">Rechercher</a>
            <a href="#" className="nav-link">À propos</a>
            <a href="#" className="nav-link">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h2>Rechercher des Projets</h2>
          <p>Découvrez des opportunités d'investissement dans la région Drâa-Tafilalet</p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="search-section">
        <div className="search-container">
          <div className="search-bar">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher par mot-clé..."
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
              {provinces.map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>

            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="filter-select"
            >
              <option value="">🏢 Secteur</option>
              {sectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>

            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="filter-select"
            >
              <option value="">💰 Budget</option>
              {budgetRanges.map(range => (
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
          {filteredProjects.length} projet(s) trouvé(s)
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
                </div>
                
                <div className="project-actions">
                  <button className="btn btn-primary">
                    <Eye size={16} />
                    Voir les détails
                  </button>
                  <button className="btn btn-secondary">
                    <Download size={16} />
                    Fiche
                  </button>
                  <button 
                    className="btn btn-accent"
                    onClick={() => handleInvestmentRequest(project)}
                  >
                    <Calendar size={16} />
                    Rendez-vous
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
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Suivant
          </button>
        </div>
      )}

      {/* Investment Modal */}
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

export default ProjectCatalog;