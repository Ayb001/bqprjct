import React, { useState } from 'react';
import { ArrowLeft, MapPin, Users, DollarSign, TrendingUp, Calendar, Eye, Share2, Download, ExternalLink } from 'lucide-react';


const ProjectDetailsPage = () => {
  // Mock project ID - replace with actual useParams() when integrating with React Router
  const id = '1';
  
  const [activeTab, setActiveTab] = useState('description');

  // Mock project data that matches the structure from your images
  const project = {
    id: id || '1',
    title: 'Centrale solaire photovoltaïque',
    publishedDate: '2023-10-15',
    views: 245,
    image: '/api/placeholder/800/400',
    
    // Key information (from sidebar in your images)
    keyInfo: {
      location: 'Ouarzazate, Drâa-Tafilalet',
      sector: 'EnR/Énergie renouvelable - Énergie solaire',
      investment: '12.5 millions Dhs',
      expectedJobs: '45 emplois',
      expectedRevenue: '28.7 millions Dhs'
    },

    // Economic data (from your second image)
    economicData: [
      { label: 'Investissement', value: '12.5 M Dhs', icon: DollarSign },
      { label: 'Chiffre d\'affaires', value: '28.7 M Dhs', icon: TrendingUp },
      { label: 'Emplois', value: '45', icon: Users },
      { label: 'Ratio de rentabilité', value: '2.3', icon: TrendingUp }
    ],

    // Description (from your third image)
    description: `Ce projet vise à étendre la capacité solaire dans la région d'Ouarzazate, déjà reconnue mondialement pour le complexe Noor. Profitant de l'ensoleillement exceptionnel de la région (plus de 3000 heures par an), cette centrale photovoltaïque de 20 MW viendra compléter les installations existantes.

La technologie photovoltaïque choisie est particulièrement adaptée aux conditions climatiques locales, avec des panneaux résistants aux hautes températures et à la poussière. Le projet inclut également un système de stockage par batteries pour assurer une production stable même après le coucher du soleil.

Cette centrale contribuera à l'indépendance énergétique de la région tout en créant des emplois locaux, tant pour la construction que pour l'exploitation. Elle s'inscrit parfaitement dans la stratégie nationale de transition énergétique du Maroc et dans le développement durable de la région Drâa-Tafilalet.`,

    // Incentives (from your fourth image)
    incentives: [
      'Subvention du Fonds de Développement Énergétique jusqu\'à 20% de l\'investissement',
      'Exonération de TVA sur les équipements solaires',
      'Facilités administratives pour l\'acquisition de terrain dans la zone dédiée aux énergies renouvelables',
      'Tarifs préférentiels pour le raccordement au réseau national'
    ]
  };

  // Similar projects (from your second image)
  const similarProjects = [
    {
      id: 1,
      title: 'Centrale solaire photovoltaïque',
      location: 'Ouarzazate',
      image: '/api/placeholder/300/200'
    },
    {
      id: 2,
      title: 'Complexe écotouristique dans les oasis',
      location: 'Zagora',
      image: '/api/placeholder/300/200'
    },
    {
      id: 3,
      title: 'Réhabilitation et valorisation des kasbahs historiques',
      location: 'Kelaat M\'Gouna',
      image: '/api/placeholder/300/200'
    }
  ];

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="container">
          <nav className="breadcrumb">
            <a href="#" className="breadcrumb-item">
              Accueil
            </a>
            <span>&gt;</span>

            <a href="#" className="breadcrumb-item">
              Projets
            </a>
            <span>&gt;</span>

            <span className="breadcrumb-current">
              Centrale solaire photovoltaïque
            </span>
          </nav>
        </div>
      </header>

      <div className="container">
        {/* Project Header */}
        <div className="main-content">
          <div className="project-header">
            <div className="project-title-section">
              <div className="project-info">
                <div className="title-meta">
                  <h1 className="project-title">{project.title}</h1>
                  <div className="meta-info">
                    <div className="meta-item">
                      <Calendar size={16} />
                      <span>Publié le {project.publishedDate}</span>
                    </div>
                    <div className="meta-item">
                      <Eye size={16} />
                      <span>{project.views} vues</span>
                    </div>
                  </div>
                </div>
                <div className="actions">
                  <button className="btn">
                    <Download size={16} />
                    Télécharger la fiche projet
                  </button>
                  <button className="btn">
                    <Share2 size={16} />
                    Partager
                  </button>
                  <button className="btn">
                    Imprimer
                  </button>
                </div>
              </div>
            </div>

            {/* Project Image */}
            <div className="project-image-section">
              <img 
                src={project.image} 
                alt={project.title}
                className="project-image"
              />
              <div className="image-overlay">
                <p>Cliquez sur l'image pour l'agrandir</p>
              </div>
            </div>
          </div>

          <div className="content-layout">
            {/* Main Content */}
            <div className="main-section">
              {/* Economic Data */}
              <div className="economic-data">
                <h2 className="section-title">Données économiques</h2>
                <div className="economic-grid">
                  {project.economicData.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="economic-item">
                        <div className="economic-icon">
                          <Icon size={20} />
                        </div>
                        <div className="economic-content">
                          <h3>{item.label}</h3>
                          <p>{item.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tabs */}
              <div className="tabs">
                <div className="tab-list">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`tab ${activeTab === 'description' ? 'active' : ''}`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab('incentives')}
                    className={`tab ${activeTab === 'incentives' ? 'active' : ''}`}
                  >
                    Régimes incitatifs
                  </button>
                  <button
                    onClick={() => setActiveTab('economic')}
                    className={`tab ${activeTab === 'economic' ? 'active' : ''}`}
                  >
                    Données économiques
                  </button>
                </div>

                <div className="tab-content">
                  {activeTab === 'description' && (
                    <div>
                      <h2>Description du projet</h2>
                      <div>
                        {project.description.split('\n\n').map((paragraph, index) => (
                          <p key={index}>
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'incentives' && (
                    <div>
                      <h2>Régimes incitatifs</h2>
                      <ul className="incentive-list">
                        {project.incentives.map((incentive, index) => (
                          <li key={index} className="incentive-item">
                            <div className="incentive-bullet"></div>
                            <p>{incentive}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeTab === 'economic' && (
                    <div>
                      <h2>Données économiques détaillées</h2>
                      <div>
                        {project.economicData.map((item, index) => (
                          <div key={index} className="economic-detail">
                            <h3>{item.label}</h3>
                            <p>{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="sidebar">
              {/* Request to Invest */}
              <div className="sidebar-card">
                <div className="sidebar-content">
                  <button className="btn btn-primary" style={{width: '100%', justifyContent: 'center'}}>
                    Demander à investir
                  </button>
                  <p className="invest-placeholder">Fonctionnalité bientôt disponible</p>
                </div>
              </div>

              {/* Key Information */}
              <div className="sidebar-card">
                <div className="sidebar-header">
                  <span>ℹ️</span>
                  Informations clés
                </div>
                <div className="sidebar-content">
                  <div className="info-item">
                    <div className="info-label">
                      <MapPin size={16} />
                      Localisation
                    </div>
                    <div className="info-value">{project.keyInfo.location}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Secteur</div>
                    <div className="info-value">{project.keyInfo.sector}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">
                      <DollarSign size={16} />
                      Investissement
                    </div>
                    <div className="info-value">{project.keyInfo.investment}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">
                      <Users size={16} />
                      Emplois prévus
                    </div>
                    <div className="info-value">{project.keyInfo.expectedJobs}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">
                      <TrendingUp size={16} />
                      Chiffre d'affaires prévisionnel
                    </div>
                    <div className="info-value">{project.keyInfo.expectedRevenue}</div>
                  </div>
                </div>
              </div>

              {/* Partners Placeholder */}
              <div className="sidebar-card">
                <div className="sidebar-header">Partenaires</div>
                <div className="sidebar-content">
                  <p className="partners-placeholder">Les partenaires du projet seront affichés ici.</p>
                </div>
              </div>

              {/* Related Articles Placeholder */}
              <div className="sidebar-card">
                <div className="sidebar-header">Articles connexes</div>
                <div className="sidebar-content">
                  <div className="article-item">
                    <h4 className="article-title">L'avenir du solaire au Maroc</h4>
                    <p className="article-meta">2023-11-20 • 5 min de lecture</p>
                  </div>
                  <div className="article-item">
                    <h4 className="article-title">Investir dans les énergies renouvelables</h4>
                    <p className="article-meta">2023-11-15 • 8 min de lecture</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Projects */}
          <div className="similar-projects">
            <h2 className="section-title">Projets similaires</h2>
            <div className="projects-grid">
              {similarProjects.map((project) => (
                <div key={project.id} className="project-card">
                  <img src={project.image} alt={project.title} className="project-card-image" />
                  <div className="project-card-content">
                    <h3 className="project-card-title">{project.title}</h3>
                    <div className="project-card-location">
                      <MapPin size={16} />
                      <span>{project.location}</span>
                    </div>
                    <a href="#" className="project-card-link">
                      Voir le projet
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Back to Projects */}
          <a href="#" className="back-to-projects">
            <ArrowLeft size={16} />
            Retour à la liste des projets
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;