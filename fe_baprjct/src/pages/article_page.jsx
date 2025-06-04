import React, { useState, useEffect } from 'react';

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sectors, setSectors] = useState([]);
  const [tags, setTags] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('date-desc');

  useEffect(() => {
    loadArticles();
    loadSectors();
    loadTags();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchTerm, selectedSector, selectedTag]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading articles from API...');
      
      // Try different API URLs in case of configuration issues
      const apiUrls = [
        'http://localhost:8080/api/articles',
        '/api/articles'
      ];
      
      let response = null;
      let data = null;
      
      for (const url of apiUrls) {
        try {
          console.log(`🌐 Trying URL: ${url}`);
          response = await fetch(url);
          
          if (response.ok) {
            data = await response.json();
            console.log('✅ API Response:', data);
            break;
          }
        } catch (urlError) {
          console.log(`❌ Failed with URL ${url}:`, urlError.message);
          continue;
        }
      }
      
      if (!response || !response.ok) {
        throw new Error(`HTTP error! status: ${response?.status || 'No response'}`);
      }
      
      if (data && data.success) {
        setArticles(data.data);
        setError(null);
        console.log(`✅ Loaded ${data.data.length} articles`);
      } else {
        setError(data?.message || 'Erreur lors du chargement des articles');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur. Vérifiez que le backend Spring Boot est démarré sur localhost:8080');
      console.error('❌ Articles loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSectors = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/articles/sectors');
      const data = await response.json();
      if (data.success) {
        setSectors(data.data);
      }
    } catch (err) {
      console.error('Erreur secteurs:', err);
    }
  };

  const loadTags = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/articles/tags');
      const data = await response.json();
      if (data.success) {
        setTags(data.data);
      }
    } catch (err) {
      console.error('Erreur tags:', err);
    }
  };

  const filterArticles = () => {
    let filtered = [...articles];

    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedSector) {
      filtered = filtered.filter(article =>
        article.sector.toLowerCase().includes(selectedSector.toLowerCase())
      );
    }

    if (selectedTag) {
      filtered = filtered.filter(article =>
        article.tags.some(tag => tag.toLowerCase().includes(selectedTag.toLowerCase()))
      );
    }

    // Sort articles
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'views-desc':
          return b.views - a.views;
        case 'views-asc':
          return a.views - b.views;
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    setFilteredArticles(filtered);
  };

  const handleTagClick = (tag) => {
    setSelectedTag(selectedTag === tag ? '' : tag);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSector('');
    setSelectedTag('');
    setSortBy('date-desc');
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const featuredArticles = articles.filter(article => article.featured);

  const ArticleCard = ({ article, isCompact = false }) => (
    <div 
      style={isCompact ? styles.compactCard : styles.articleCard}
      onClick={() => {
        // 🔥 REAL REDIRECT - Go directly to original article
        if (article.sourceUrl) {
          window.open(article.sourceUrl, '_blank');
        }
      }}
    >
      <div style={styles.cardContent}>
        <div style={styles.cardHeader}>
          <span style={styles.sectorTag}>{article.sector}</span>
          <span style={styles.readingTime}>📖 {article.readingTime}</span>
        </div>
        
        <h3 style={isCompact ? styles.compactTitle : styles.cardTitle}>
          {article.title}
        </h3>
        
        <p style={styles.cardExcerpt}>
          {article.content.substring(0, isCompact ? 80 : 150)}...
        </p>
        
        <div style={styles.cardFooter}>
          <div style={styles.authorInfo}>
            <span style={styles.date}>{formatDate(article.date)}</span>
            {article.sourceName && (
              <span style={styles.source}>📰 {article.sourceName}</span>
            )}
          </div>
          <div style={styles.articleStats}>
            <span style={styles.views}>👁️ {article.views}</span>
          </div>
        </div>
        
        <div style={styles.tagsContainer}>
          {(article.tags || []).slice(0, 3).map((tag, index) => (
            <button
              key={index}
              style={styles.tag}
              onClick={(e) => {
                e.stopPropagation();
                handleTagClick(tag);
              }}
            >
              #{tag}
            </button>
          ))}
        </div>

        <div style={styles.linkIndicator}>
          <span>🔗 Cliquez pour lire l'article complet</span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loader}></div>
          <p>Chargement des articles d'investissement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <h2>⚠️ Erreur</h2>
          <p>{error}</p>
          <button style={styles.retryButton} onClick={loadArticles}>
            🔄 Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <div style={styles.navBrand}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>🏛️</div>
            </div>
            <span style={styles.brandText}>Banque de projets</span>
          </div>
          <div style={styles.navLinks}>
            <a href="#" style={styles.navLink}>Accueil</a>
            <a href="#" style={{...styles.navLink, ...styles.activeLink}}>Articles</a>
            <a href="#" style={styles.navLink}>Projets</a>
            <a href="#" style={styles.navLink}>À propos</a>
            <a href="#" style={styles.navLink}>Contact</a>
          </div>
        </div>
      </nav>

      <div style={styles.mainContainer}>
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Centre de ressources</h1>
          <p style={styles.pageSubtitle}>
            Découvrez les dernières analyses, tendances et innovations dans tous les secteurs d'activité
          </p>
        </div>

        {/* Featured Articles */}
        <section style={styles.featuredSection}>
          <h2 style={styles.sectionTitle}>Articles à la une</h2>
          <div style={styles.featuredGrid}>
            {featuredArticles.slice(0, 3).map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        <div style={styles.contentLayout}>
          {/* Sidebar */}
          <aside style={styles.sidebar}>
            <div style={styles.sidebarCard}>
              <h3 style={styles.sidebarTitle}>🔍 Recherche et filtres</h3>
              
              {/* Search */}
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Rechercher</label>
                <input
                  type="text"
                  placeholder="Mot-clé, titre, tag..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={styles.searchInput}
                />
              </div>

              {/* Sector Filter */}
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Secteur</label>
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  style={styles.filterSelect}
                >
                  <option value="">Tous les secteurs</option>
                  {sectors.map((sector, index) => (
                    <option key={index} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Trier par</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={styles.filterSelect}
                >
                  <option value="date-desc">Plus récent</option>
                  <option value="date-asc">Plus ancien</option>
                  <option value="views-desc">Plus populaire</option>
                  <option value="views-asc">Moins populaire</option>
                  <option value="title-asc">Titre A-Z</option>
                  <option value="title-desc">Titre Z-A</option>
                </select>
              </div>

              <button 
                onClick={clearFilters}
                style={styles.clearButton}
              >
                🗑️ Effacer les filtres
              </button>
            </div>

            {/* Quick Stats */}
            <div style={styles.sidebarCard}>
              <h3 style={styles.sidebarTitle}>📊 Statistiques</h3>
              <div style={styles.statsGrid}>
                <div style={styles.statItem}>
                  <span style={styles.statNumber}>{articles.length}</span>
                  <span style={styles.statLabel}>Articles totaux</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statNumber}>{filteredArticles.length}</span>
                  <span style={styles.statLabel}>Résultats trouvés</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statNumber}>{sectors.length}</span>
                  <span style={styles.statLabel}>Secteurs couverts</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statNumber}>{new Set(articles.map(a => a.sourceName)).size}</span>
                  <span style={styles.statLabel}>Sources</span>
                </div>
              </div>
            </div>

            {/* Popular Tags */}
            <div style={styles.sidebarCard}>
              <h3 style={styles.sidebarTitle}>🏷️ Tags populaires</h3>
              <div style={styles.popularTags}>
                {tags.slice(0, 6).map((tag, index) => (
                  <button
                    key={index}
                    style={{
                      ...styles.popularTag,
                      ...(selectedTag === tag ? styles.popularTagActive : {})
                    }}
                    onClick={() => handleTagClick(tag)}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main style={styles.mainContent}>
            <div style={styles.contentHeader}>
              <div style={styles.contentInfo}>
                <h2 style={styles.contentTitle}>
                  Tous les articles ({filteredArticles.length})
                </h2>
                {(searchTerm || selectedSector || selectedTag) && (
                  <div style={styles.activeFilters}>
                    <span style={styles.filterInfo}>Filtres actifs:</span>
                    {searchTerm && (
                      <span style={styles.activeFilter}>
                        Recherche: "{searchTerm}"
                        <button onClick={() => setSearchTerm('')} style={styles.removeFilter}>×</button>
                      </span>
                    )}
                    {selectedSector && (
                      <span style={styles.activeFilter}>
                        Secteur: {selectedSector}
                        <button onClick={() => setSelectedSector('')} style={styles.removeFilter}>×</button>
                      </span>
                    )}
                    {selectedTag && (
                      <span style={styles.activeFilter}>
                        Tag: {selectedTag}
                        <button onClick={() => setSelectedTag('')} style={styles.removeFilter}>×</button>
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div style={styles.viewControls}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    ...styles.viewButton,
                    ...(viewMode === 'grid' ? styles.activeViewButton : {})
                  }}
                >
                  ⊞ Grille
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    ...styles.viewButton,
                    ...(viewMode === 'list' ? styles.activeViewButton : {})
                  }}
                >
                  ☰ Liste
                </button>
              </div>
            </div>

            {/* Articles Grid/List */}
            <div style={viewMode === 'grid' ? styles.articlesGrid : styles.articlesList}>
              {filteredArticles.map(article => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                  isCompact={viewMode === 'list'}
                />
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div style={styles.noResults}>
                <div style={styles.noResultsIcon}>🔍</div>
                <h3>Aucun article trouvé</h3>
                <p>Essayez de modifier vos critères de recherche ou de supprimer certains filtres.</p>
                <button onClick={clearFilters} style={styles.clearButton}>
                  Effacer tous les filtres
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif'
  },
  nav: {
    backgroundColor: '#8B4513',
    color: 'white',
    padding: '1rem 1.5rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  navBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  logo: {
    display: 'flex',
    alignItems: 'center'
  },
  logoIcon: {
    fontSize: '1.5rem',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: '0.5rem',
    borderRadius: '8px'
  },
  brandText: {
    fontSize: '1.25rem',
    fontWeight: 'bold'
  },
  navLinks: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap'
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    transition: 'background-color 0.3s'
  },
  activeLink: {
    backgroundColor: 'rgba(255,255,255,0.2)'
  },
  mainContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem 1rem'
  },
  pageHeader: {
    textAlign: 'center',
    marginBottom: '3rem'
  },
  pageTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '0.5rem'
  },
  pageSubtitle: {
    fontSize: '1.1rem',
    color: '#666',
    maxWidth: '600px',
    margin: '0 auto'
  },
  featuredSection: {
    marginBottom: '3rem'
  },
  sectionTitle: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '1.5rem',
    borderBottom: '2px solid #8B4513',
    paddingBottom: '0.5rem'
  },
  featuredGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  contentLayout: {
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    gap: '2rem'
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  sidebarCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  sidebarTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '1rem',
    borderBottom: '1px solid #ddd',
    paddingBottom: '0.5rem'
  },
  filterGroup: {
    marginBottom: '1rem'
  },
  filterLabel: {
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#333',
    marginBottom: '0.5rem'
  },
  searchInput: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '0.95rem',
    boxSizing: 'border-box'
  },
  filterSelect: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '0.95rem',
    backgroundColor: 'white',
    boxSizing: 'border-box'
  },
  clearButton: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },
  statItem: {
    textAlign: 'center',
    padding: '0.75rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px'
  },
  statNumber: {
    display: 'block',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#8B4513'
  },
  statLabel: {
    fontSize: '0.8rem',
    color: '#666'
  },
  popularTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  popularTag: {
    padding: '0.25rem 0.5rem',
    backgroundColor: '#e9ecef',
    border: 'none',
    borderRadius: '12px',
    fontSize: '0.8rem',
    color: '#666',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  popularTagActive: {
    backgroundColor: '#8B4513',
    color: 'white'
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  contentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  contentInfo: {
    flex: 1
  },
  contentTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '0.5rem'
  },
  activeFilters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    alignItems: 'center'
  },
  filterInfo: {
    fontSize: '0.9rem',
    color: '#666',
    fontWeight: '500'
  },
  activeFilter: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.25rem 0.5rem',
    backgroundColor: '#8B4513',
    color: 'white',
    borderRadius: '12px',
    fontSize: '0.8rem'
  },
  removeFilter: {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '1rem',
    marginLeft: '0.25rem'
  },
  viewControls: {
    display: 'flex',
    gap: '0.5rem'
  },
  viewButton: {
    padding: '0.5rem 1rem',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    borderRadius: '6px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  activeViewButton: {
    backgroundColor: '#8B4513',
    color: 'white',
    borderColor: '#8B4513'
  },
  articlesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  articlesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  articleCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer'
  },
  compactCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    height: '200px',
    cursor: 'pointer'
  },
  cardContent: {
    padding: '1.5rem',
    flex: 1
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  sectorTag: {
    backgroundColor: '#e9ecef',
    color: '#495057',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '500'
  },
  readingTime: {
    fontSize: '0.8rem',
    color: '#666'
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '0.75rem',
    lineHeight: '1.4'
  },
  compactTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '0.5rem',
    lineHeight: '1.3'
  },
  cardExcerpt: {
    fontSize: '0.95rem',
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '1rem'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  authorInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  date: {
    fontSize: '0.8rem',
    color: '#666'
  },
  source: {
    fontSize: '0.8rem',
    color: '#666',
    fontStyle: 'italic'
  },
  articleStats: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  views: {
    fontSize: '0.8rem',
    color: '#666'
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  tag: {
    backgroundColor: '#f8f9fa',
    color: '#495057',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  linkIndicator: {
    padding: '0.5rem',
    backgroundColor: '#f0f8ff',
    borderRadius: '6px',
    textAlign: 'center',
    fontSize: '0.8rem',
    color: '#0066cc',
    border: '1px solid #e0e8f0'
  },
  noResults: {
    textAlign: 'center',
    padding: '3rem 1rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  noResultsIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '1rem'
  },
  loader: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f4f6',
    borderTop: '4px solid #8B4513',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  errorContainer: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    maxWidth: '500px',
    margin: '0 auto'
  },
  retryButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#8B4513',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '1rem'
  }
};

export default ArticlesPage;