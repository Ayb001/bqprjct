import React, { useState, useMemo } from 'react';

const ArticlesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Mock articles data
  const mockArticles = [
    {
      id: 1,
      title: "L'avenir de l'énergie solaire au Maroc : Perspectives et défis",
      content: "Le Maroc continue de développer ses capacités en énergie solaire avec des projets ambitieux comme le complexe solaire Noor à Ouarzazate. Cette initiative représente un tournant majeur dans la stratégie énergétique du royaume...",
      sector: "Énergie renouvelable – Énergie solaire",
      author: "Dr. Amina Benali",
      date: "2025-05-25",
      readingTime: "8 min",
      views: 1234,
      tags: ["énergie solaire", "Maroc", "Noor", "développement durable"],
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400",
      featured: true
    },
    {
      id: 2,
      title: "Digitalisation de l'agriculture marocaine : Opportunités et innovations",
      content: "L'agriculture marocaine connaît une transformation digitale sans précédent. Des capteurs IoT aux drones, en passant par l'intelligence artificielle, découvrez comment la technologie révolutionne ce secteur traditionnel...",
      sector: "Agriculture",
      author: "Prof. Hassan Alami",
      date: "2025-05-20",
      readingTime: "12 min",
      views: 987,
      tags: ["agriculture", "digitalisation", "IoT", "innovation"],
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400",
      featured: false
    },
    {
      id: 3,
      title: "Tourisme durable : Les nouvelles tendances au Maroc",
      content: "Le secteur touristique marocain s'oriente vers des pratiques plus durables. Entre écotourisme et tourisme culturel responsable, explorez les initiatives qui redéfinissent l'expérience touristique...",
      sector: "Tourisme",
      author: "Leila Fassi",
      date: "2025-05-18",
      readingTime: "6 min",
      views: 756,
      tags: ["tourisme", "durable", "écotourisme", "culture"],
      image: "https://images.unsplash.com/photo-1539650116574-75c0c6d68488?w=400",
      featured: true
    },
    {
      id: 4,
      title: "L'énergie éolienne offshore : Nouveau potentiel pour le Maroc",
      content: "Avec plus de 3000 km de côtes, le Maroc explore le potentiel de l'énergie éolienne offshore. Cette technologie pourrait révolutionner le mix énergétique national et renforcer l'indépendance énergétique...",
      sector: "Énergie renouvelable – Énergie éolienne",
      author: "Dr. Youssef Benomar",
      date: "2025-05-15",
      readingTime: "10 min",
      views: 1456,
      tags: ["éolien", "offshore", "énergie", "côtes"],
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400",
      featured: false
    },
    {
      id: 5,
      title: "Fintech au Maroc : Révolution des services financiers",
      content: "Le secteur financier marocain connaît une transformation majeure avec l'émergence des fintechs. Paiements mobiles, crédit alternatif, blockchain : découvrez les innovations qui changent la donne...",
      sector: "Technologie",
      author: "Karima Ziadi",
      date: "2025-05-12",
      readingTime: "9 min",
      views: 2103,
      tags: ["fintech", "technologie", "finance", "innovation"],
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400",
      featured: false
    },
    {
      id: 6,
      title: "Télémédecine au Maroc : Défis et opportunités post-COVID",
      content: "La pandémie a accéléré l'adoption de la télémédecine au Maroc. Entre réglementation, infrastructure et acceptation sociale, analysons les enjeux de cette révolution sanitaire...",
      sector: "Santé",
      author: "Dr. Rachid Ouali",
      date: "2025-05-10",
      readingTime: "7 min",
      views: 834,
      tags: ["télémédecine", "santé", "digital", "COVID"],
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400",
      featured: false
    },
    {
      id: 7,
      title: "L'artisanat marocain à l'ère du e-commerce",
      content: "L'artisanat traditionnel marocain trouve de nouveaux débouchés grâce au commerce électronique. Comment les artisans s'adaptent-ils aux nouvelles technologies pour préserver et promouvoir leur savoir-faire ?",
      sector: "Artisanat",
      author: "Fatima Benali",
      date: "2025-05-08",
      readingTime: "5 min",
      views: 567,
      tags: ["artisanat", "e-commerce", "tradition", "digital"],
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
      featured: true
    },
    {
      id: 8,
      title: "Éducation numérique : Transformation du système éducatif marocain",
      content: "Le Maroc investit massivement dans la digitalisation de son système éducatif. Plateformes d'apprentissage, tablettes numériques, formation des enseignants : point sur cette révolution pédagogique...",
      sector: "Éducation",
      author: "Prof. Aicha Lamrani",
      date: "2025-05-05",
      readingTime: "11 min",
      views: 1678,
      tags: ["éducation", "numérique", "formation", "enseignement"],
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400",
      featured: false
    }
  ];

  const sectors = [
    'Énergie renouvelable – Énergie solaire',
    'Énergie renouvelable – Énergie éolienne',
    'Agriculture',
    'Tourisme',
    'Technologie',
    'Santé',
    'Éducation',
    'Artisanat',
    'Industrie'
  ];

  const authors = [...new Set(mockArticles.map(article => article.author))];

  // Filter and sort articles
  const filteredAndSortedArticles = useMemo(() => {
    let filtered = mockArticles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesSector = !selectedSector || article.sector === selectedSector;
      const matchesAuthor = !selectedAuthor || article.author === selectedAuthor;
      
      return matchesSearch && matchesSector && matchesAuthor;
    });

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

    return filtered;
  }, [mockArticles, searchTerm, selectedSector, selectedAuthor, sortBy]);

  const featuredArticles = mockArticles.filter(article => article.featured);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSector('');
    setSelectedAuthor('');
    setSortBy('date-desc');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const ArticleCard = ({ article, isCompact = false }) => (
    <div style={isCompact ? styles.compactCard : styles.articleCard}>
      <div style={styles.imageContainer}>
        <img 
          src={article.image} 
          alt={article.title}
          style={styles.articleImage}
        />
        {article.featured && (
          <div style={styles.featuredBadge}>
            ⭐ À la une
          </div>
        )}
      </div>
      
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
            <span style={styles.author}>{article.author}</span>
            <span style={styles.date}>{formatDate(article.date)}</span>
          </div>
          <div style={styles.articleStats}>
            <span style={styles.views}>👁️ {article.views}</span>
          </div>
        </div>
        
        <div style={styles.tagsContainer}>
          {article.tags.slice(0, 3).map((tag, index) => (
            <span key={index} style={styles.tag}>#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );

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

              {/* Author Filter */}
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Auteur</label>
                <select
                  value={selectedAuthor}
                  onChange={(e) => setSelectedAuthor(e.target.value)}
                  style={styles.filterSelect}
                >
                  <option value="">Tous les auteurs</option>
                  {authors.map((author, index) => (
                    <option key={index} value={author}>{author}</option>
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
                  <span style={styles.statNumber}>{mockArticles.length}</span>
                  <span style={styles.statLabel}>Articles totaux</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statNumber}>{filteredAndSortedArticles.length}</span>
                  <span style={styles.statLabel}>Résultats trouvés</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statNumber}>{sectors.length}</span>
                  <span style={styles.statLabel}>Secteurs couverts</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statNumber}>{authors.length}</span>
                  <span style={styles.statLabel}>Contributeurs</span>
                </div>
              </div>
            </div>

            {/* Popular Tags */}
            <div style={styles.sidebarCard}>
              <h3 style={styles.sidebarTitle}>🏷️ Tags populaires</h3>
              <div style={styles.popularTags}>
                {['énergie solaire', 'innovation', 'digital', 'durable', 'technologie', 'agriculture'].map((tag, index) => (
                  <button
                    key={index}
                    style={styles.popularTag}
                    onClick={() => setSearchTerm(tag)}
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
                  Tous les articles ({filteredAndSortedArticles.length})
                </h2>
                {(searchTerm || selectedSector || selectedAuthor) && (
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
                    {selectedAuthor && (
                      <span style={styles.activeFilter}>
                        Auteur: {selectedAuthor}
                        <button onClick={() => setSelectedAuthor('')} style={styles.removeFilter}>×</button>
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
              {filteredAndSortedArticles.map(article => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                  isCompact={viewMode === 'list'}
                />
              ))}
            </div>

            {filteredAndSortedArticles.length === 0 && (
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
    height: '200px'
  },
  imageContainer: {
    position: 'relative',
    height: '200px',
    overflow: 'hidden'
  },
  articleImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  featuredBadge: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    backgroundColor: '#8B4513',
    color: 'white',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 'bold'
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
  author: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#333'
  },
  date: {
    fontSize: '0.8rem',
    color: '#666'
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
    gap: '0.5rem'
  },
  tag: {
    backgroundColor: '#f8f9fa',
    color: '#495057',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '500'
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
  }
};

export default ArticlesPage;