import React, { useState, useEffect } from 'react';
import { Download, Eye, Calendar, MapPin, Building, Users, TrendingUp, Target, Cpu, Leaf, Gift, Handshake, FileText, ArrowLeft } from 'lucide-react';

const ProjectDetailsPage = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [viewCount, setViewCount] = useState(0);

  // Get project ID from URL parameters
  const getProjectIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
  };

  // Handle logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    window.location.href = '/';
  };

  // PDF Download Handler
  const handlePdfDownload = async () => {
    try {
      if (!project?.id) {
        alert('❌ Aucun fichier PDF disponible pour ce projet');
        return;
      }

      const token = localStorage.getItem('token') || localStorage.getItem('jwt');

      const response = await fetch(`http://localhost:8080/api/projects/${project.id}/pdf`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${project.title}_fiche.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        alert('✅ Téléchargement réussi!');
      } else {
        alert('❌ Impossible de télécharger le fichier PDF');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('❌ Erreur lors du téléchargement');
    }
  };

  // Fetch project details
  const fetchProjectDetails = async (projectId) => {
    try {
      setLoading(true);

      const token = localStorage.getItem('token') || localStorage.getItem('jwt');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:8080/api/projects/${projectId}`, {
        headers: headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();

      if (apiResponse.success && apiResponse.data) {
        setProject(apiResponse.data);
        setViewCount(apiResponse.data.views || 0);
      } else {
        throw new Error(apiResponse.error || 'Failed to fetch project details');
      }

    } catch (error) {
      console.error('Error fetching project details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    const projectId = getProjectIdFromUrl();
    if (projectId) {
      fetchProjectDetails(projectId);
    } else {
      setError('Aucun ID de projet fourni');
      setLoading(false);
    }
  }, []);

  const formatNumber = (num) => {
    if (!num) return '0';
    return parseFloat(num).toLocaleString('fr-FR');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date non disponible';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Chargement du projet...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>Erreur: {error}</p>
          <button style={styles.backButton} onClick={() => window.history.back()}>
            Retour aux projets
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>Projet non trouvé</p>
          <button style={styles.backButton} onClick={() => window.history.back()}>
            Retour aux projets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Navigation Header */}
      <header style={styles.catalogHeader}>
        <div style={styles.headerContent}>
          <div style={styles.logoSection}>
            <div style={styles.logo}>🏛️</div>
            <h1 style={styles.headerTitle}>Banque de projets</h1>
          </div>
          <nav style={styles.mainNav}>
            <a href="/project_catalog_porteur" style={styles.navLink}>📊 Projets</a>
            <a href="/submit_page" style={styles.navLink}>➕ Nouveau Projet</a>
            <a href="/article_page" style={styles.navLink}>📰 Articles</a>
            <a href="/porteur_dashboard" style={styles.navLink}>📈 Dashboard</a>
            <button onClick={handleLogout} style={styles.logoutBtn}>🚪 Déconnexion</button>
          </nav>
        </div>
      </header>

      <div style={styles.mainContainer}>
        {/* Back Button */}
        <div style={styles.backButtonContainer}>
          <button style={styles.backButton} onClick={() => window.history.back()}>
            <ArrowLeft size={20} />
            <span>Retour aux projets</span>
          </button>
        </div>

        <div style={styles.projectContainer}>
          {/* Project Header */}
          <div style={styles.projectHeader}>
            <h1 style={styles.projectTitle}>{project.title}</h1>
            
            <div style={styles.projectMeta}>
              <div style={styles.metaItem}>
                <Calendar size={16} />
                <span>Publié le {formatDate(project.createdAt)}</span>
                {project.createdAt && <span> à {formatTime(project.createdAt)}</span>}
              </div>
              <div style={styles.metaItem}>
                <Eye size={16} />
                <span>{viewCount} vues</span>
              </div>
              <div style={styles.metaItem}>
                <MapPin size={16} />
                <span>{project.fullLocation || `${project.location}, ${project.province}`}</span>
              </div>
              <div style={styles.metaItem}>
                <Building size={16} />
                <span>{project.sector}</span>
              </div>
            </div>
          </div>

          {/* Project Image */}
          <div style={styles.imageSection}>
            <div 
              style={styles.imageContainer}
              onClick={() => setShowImageModal(true)}
              className="project-image-container"
            >
              <img 
                src={project.imageUrl || "/api/placeholder/800/400"} 
                alt={project.title}
                style={styles.projectImage}
              />
              <div style={styles.imageOverlay} className="image-overlay">
                <FileText size={24} />
                <span>Cliquer pour agrandir</span>
              </div>
            </div>
          </div>

          <div style={styles.contentGrid}>
            {/* Main Content */}
            <div style={styles.mainContent}>
              {/* PDF Download Section */}
              <div style={styles.pdfSection}>
                <h3 style={styles.sectionTitle}>📄 Documentation du projet</h3>
                <div style={styles.pdfDownloadCard} onClick={handlePdfDownload} className="pdf-download-card">
                  <div style={styles.pdfIcon}>
                    <FileText size={32} />
                  </div>
                  <div style={styles.pdfDetails}>
                    <h4 style={styles.pdfFileName}>{project.title}_fiche.pdf</h4>
                    <p style={styles.pdfDescription}>Fiche technique complète du projet</p>
                  </div>
                  <div style={styles.downloadButton}>
                    <Download size={20} />
                    <span>Télécharger</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={styles.descriptionSection}>
                <h3 style={styles.sectionTitle}>Description du projet</h3>
                <p style={styles.descriptionText}>{project.description || 'Aucune description disponible.'}</p>
              </div>

              {/* Project Goals */}
              {project.goals && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>
                    <Target size={20} />
                    Objectif du projet
                  </h3>
                  <p style={styles.sectionText}>{project.goals}</p>
                </div>
              )}

              {/* Technology */}
              {project.technology && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>
                    <Cpu size={20} />
                    Technologie utilisée
                  </h3>
                  <p style={styles.sectionText}>{project.technology}</p>
                </div>
              )}

              {/* Environmental Impact */}
              {project.impact && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>
                    <Leaf size={20} />
                    Impact environnemental et économique
                  </h3>
                  <p style={styles.sectionText}>{project.impact}</p>
                </div>
              )}

              {/* Incentives */}
              {project.incentives && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>
                    <Gift size={20} />
                    Régimes incitatifs
                  </h3>
                  <p style={styles.sectionText}>{project.incentives}</p>
                </div>
              )}

              {/* Partners */}
              {project.partners && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>
                    <Handshake size={20} />
                    Partenaires du projet
                  </h3>
                  <p style={styles.sectionText}>{project.partners}</p>
                </div>
              )}
            </div>

            {/* Sidebar with Economic Data */}
            <div style={styles.sidebar}>
              <div style={styles.economicCard}>
                <h3 style={styles.economicTitle}>Données économiques</h3>
                
                <div style={styles.economicGrid}>
                  <div style={styles.economicItem}>
                    <div style={styles.economicHeader}>
                      <span style={styles.economicIcon}>💰</span>
                      <span>Investissement</span>
                    </div>
                    <p style={styles.economicValue}>
                      {project.formattedBudget || `${formatNumber(project.budget || 0)} Dhs`}
                    </p>
                  </div>
                  
                  <div style={styles.economicItem}>
                    <div style={styles.economicHeader}>
                      <TrendingUp size={16} />
                      <span>Chiffre d'affaires</span>
                    </div>
                    <p style={styles.economicValue}>
                      {formatNumber(project.revenue || 0)} Dhs
                    </p>
                  </div>
                  
                  <div style={styles.economicItem}>
                    <div style={styles.economicHeader}>
                      <Users size={16} />
                      <span>Emplois créés</span>
                    </div>
                    <p style={styles.economicValue}>
                      {formatNumber(project.jobs || 0)}
                    </p>
                  </div>
                  
                  <div style={styles.economicItem}>
                    <div style={styles.economicHeader}>
                      <span style={styles.economicIcon}>📊</span>
                      <span>Ratio de rentabilité</span>
                    </div>
                    <p style={styles.economicValue}>
                      {project.profitability || 0}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Project Details Card */}
              <div style={styles.detailsCard}>
                <h3 style={styles.detailsTitle}>Détails du projet</h3>
                
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Secteur</span>
                  <span style={styles.detailValue}>{project.sector}</span>
                </div>
                
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Localisation</span>
                  <span style={styles.detailValue}>{project.location}</span>
                </div>
                
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Province</span>
                  <span style={styles.detailValue}>{project.province}</span>
                </div>
                
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Catégorie</span>
                  <span style={styles.detailValue}>{project.category ? project.category.replace('_', ' ') : 'Non spécifiée'}</span>
                </div>
              </div>

              {/* Contact Card */}
              <div style={styles.contactCard}>
                <h3 style={styles.contactTitle}>Intéressé par ce projet ?</h3>
                <p style={styles.contactText}>
                  Contactez notre équipe pour plus d'informations ou pour exprimer votre intérêt.
                </p>
                <button style={styles.contactButton} className="contact-button">
                  📞 Prendre rendez-vous
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div 
          style={styles.modal}
          onClick={() => setShowImageModal(false)}
        >
          <div style={styles.modalContent}>
            <img 
              src={project.imageUrl || "/api/placeholder/800/400"} 
              alt={project.title}
              style={styles.modalImage}
            />
            <button 
              style={styles.modalCloseButton}
              onClick={() => setShowImageModal(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .project-image-container:hover .image-overlay {
          opacity: 1 !important;
        }
        
        .pdf-download-card:hover {
          background-color: #e9ecef !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .back-button:hover {
          background-color: #f8f9fa !important;
          border-color: #8B4513 !important;
          color: #8B4513 !important;
        }
        
        .contact-button:hover {
          background-color: #f8f9fa !important;
          transform: translateY(-1px);
        }
        
        .nav-link:hover {
          background: rgba(255,255,255,0.15) !important;
          color: white !important;
        }
        
        .logout-btn:hover {
          background: rgba(220, 53, 69, 0.3) !important;
          border-color: rgba(220, 53, 69, 0.5) !important;
        }

        @media (max-width: 768px) {
          .content-grid {
            grid-template-columns: 1fr !important;
          }
          
          .project-title {
            font-size: 2rem !important;
          }
          
          .header-content {
            flex-direction: column !important;
            gap: 1rem;
            text-align: center;
          }
          
          .main-nav {
            gap: 0.5rem !important;
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
  },

  catalogHeader: {
    background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
    boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    padding: '1rem 0'
  },

  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },

  logo: {
    fontSize: '2rem',
    background: 'rgba(255,255,255,0.2)',
    padding: '0.5rem',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)'
  },

  headerTitle: {
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: '600',
    margin: 0
  },

  mainNav: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },

  navLink: {
    color: 'rgba(255,255,255,0.9)',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    fontWeight: '500',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 'inherit'
  },

  logoutBtn: {
    color: 'rgba(255,255,255,0.9)',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    fontWeight: '500',
    border: '1px solid rgba(220, 53, 69, 0.3)',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    background: 'rgba(220, 53, 69, 0.2)'
  },

  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    gap: '1rem'
  },

  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #8B4513',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },

  loadingText: {
    fontSize: '1.1rem',
    color: '#666'
  },

  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    gap: '1rem'
  },

  errorText: {
    fontSize: '1.2rem',
    color: '#dc3545'
  },

  mainContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem 1rem'
  },

  backButtonContainer: {
    marginBottom: '1.5rem'
  },

  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    color: '#666',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit'
  },

  projectContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },

  projectHeader: {
    padding: '2rem',
    borderBottom: '1px solid #e9ecef'
  },

  projectTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '1rem',
    lineHeight: '1.2'
  },

  projectMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.5rem'
  },

  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.95rem',
    color: '#666'
  },

  imageSection: {
    position: 'relative',
    height: '400px',
    overflow: 'hidden'
  },

  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    cursor: 'pointer',
    transition: 'transform 0.3s ease'
  },

  projectImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },

  imageOverlay: {
    position: 'absolute',
    bottom: '1rem',
    right: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    opacity: 0,
    transition: 'opacity 0.3s ease'
  },

  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '2rem',
    padding: '2rem'
  },

  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },

  pdfSection: {
    marginBottom: '1rem'
  },

  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },

  pdfDownloadCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    border: '2px dashed #8B4513',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },

  pdfIcon: {
    color: '#8B4513',
    padding: '1rem',
    backgroundColor: 'rgba(139, 69, 19, 0.1)',
    borderRadius: '8px'
  },

  pdfDetails: {
    flex: 1
  },

  pdfFileName: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 0.25rem 0'
  },

  pdfDescription: {
    fontSize: '0.9rem',
    color: '#666',
    margin: 0
  },

  downloadButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#8B4513',
    color: 'white',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    fontWeight: '500',
    fontSize: '0.9rem'
  },

  descriptionSection: {
    marginBottom: '1rem'
  },

  descriptionText: {
    fontSize: '1.1rem',
    lineHeight: '1.8',
    color: '#333',
    margin: 0
  },

  section: {
    marginBottom: '1rem'
  },

  sectionText: {
    fontSize: '1rem',
    lineHeight: '1.7',
    color: '#333',
    margin: 0
  },

  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },

  economicCard: {
    backgroundColor: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid #e9ecef'
  },

  economicTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '1rem'
  },

  economicGrid: {
    display: 'grid',
    gap: '1rem'
  },

  economicItem: {
    padding: '1rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e9ecef'
  },

  economicHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    color: '#666'
  },

  economicIcon: {
    fontSize: '1rem'
  },

  economicValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#8B4513',
    margin: 0
  },

  detailsCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid #e9ecef'
  },

  detailsTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '1rem'
  },

  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0',
    borderBottom: '1px solid #f1f3f4'
  },

  detailLabel: {
    fontSize: '0.9rem',
    color: '#666',
    fontWeight: '500'
  },

  detailValue: {
    fontSize: '0.9rem',
    color: '#333',
    fontWeight: '600'
  },

  contactCard: {
    backgroundColor: '#8B4513',
    color: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    textAlign: 'center'
  },

  contactTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.75rem'
  },

  contactText: {
    fontSize: '0.95rem',
    marginBottom: '1rem',
    opacity: 0.9,
    lineHeight: '1.5'
  },

  contactButton: {
    backgroundColor: 'white',
    color: '#8B4513',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit'
  },

  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    cursor: 'pointer'
  },

  modalContent: {
    position: 'relative',
    maxWidth: '95%',
    maxHeight: '95%'
  },

  modalImage: {
    width: '100%',
    height: 'auto',
    maxHeight: '95vh',
    objectFit: 'contain',
    borderRadius: '8px'
  },

  modalCloseButton: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    fontSize: '1.5rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default ProjectDetailsPage;