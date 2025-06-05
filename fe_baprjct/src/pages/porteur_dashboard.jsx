import React, { useState, useEffect } from 'react';

const PorteurDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [userIssues, setUserIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserRole, setSelectedUserRole] = useState('');
  const [selectedProjectStatus, setSelectedProjectStatus] = useState('');

  // Mock data - Same as admin but with limited access
  const mockUsers = [
    {
      id: 1,
      name: "Ahmed Benali",
      email: "ahmed.benali@email.com",
      role: "Entrepreneur",
      status: "Active",
      joinDate: "2024-01-15",
      lastLogin: "2025-06-03",
      projects: 3,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
    },
    {
      id: 2,
      name: "Fatima Zarrouk",
      email: "fatima.zarrouk@email.com",
      role: "Investisseur",
      status: "Active",
      joinDate: "2024-02-20",
      lastLogin: "2025-06-04",
      projects: 0,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100"
    },
    {
      id: 3,
      name: "Youssef Alami",
      email: "youssef.alami@email.com",
      role: "Admin",
      status: "Active",
      joinDate: "2023-12-10",
      lastLogin: "2025-06-04",
      projects: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
    },
    {
      id: 4,
      name: "Leila Fassi",
      email: "leila.fassi@email.com",
      role: "Entrepreneur",
      status: "Pending",
      joinDate: "2025-05-30",
      lastLogin: "2025-06-02",
      projects: 1,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100"
    }
  ];

  const mockProjects = [
    {
      id: 1,
      title: "Plateforme E-commerce Bio",
      owner: "Ahmed Benali",
      sector: "Commerce électronique",
      status: "En cours",
      budget: "50,000 DH",
      startDate: "2025-03-01",
      progress: 65,
      investors: 2,
      description: "Marketplace pour produits biologiques locaux"
    },
    {
      id: 2,
      title: "Application de Covoiturage",
      owner: "Fatima Zarrouk",
      sector: "Transport",
      status: "En attente",
      budget: "120,000 DH",
      startDate: "2025-04-15",
      progress: 25,
      investors: 0,
      description: "Solution de transport partagé pour les villes marocaines"
    },
    {
      id: 3,
      title: "Centre de Formation Digital",
      owner: "Youssef Alami",
      sector: "Éducation",
      status: "Complété",
      budget: "200,000 DH",
      startDate: "2024-10-01",
      progress: 100,
      investors: 5,
      description: "Formation en ligne pour les compétences digitales"
    }
  ];

  const mockAppointments = [
    {
      id: 1,
      title: "Présentation Projet E-commerce",
      client: "Ahmed Benali",
      date: "2025-06-05",
      time: "14:00",
      status: "Confirmé",
      type: "Présentation",
      location: "Bureau principal"
    },
    {
      id: 2,
      title: "Entretien Investisseur",
      client: "Fatima Zarrouk",
      date: "2025-06-06",
      time: "10:30",
      status: "En attente",
      type: "Entretien",
      location: "Salle de réunion A"
    },
    {
      id: 3,
      title: "Suivi Projet Formation",
      client: "Youssef Alami",
      date: "2025-06-07",
      time: "16:00",
      status: "Confirmé",
      type: "Suivi",
      location: "Visioconférence"
    }
  ];

  const mockUserIssues = [
    {
      id: 1,
      user: "Ahmed Benali",
      email: "ahmed.benali@email.com",
      issue: "Problème de connexion",
      description: "Impossible de se connecter depuis 2 jours",
      priority: "Haute",
      status: "En cours",
      date: "2025-06-03",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
    },
    {
      id: 2,
      user: "Leila Fassi",
      email: "leila.fassi@email.com",
      issue: "Erreur lors du téléchargement",
      description: "Fichiers ne se téléchargent pas correctement",
      priority: "Moyenne",
      status: "Nouveau",
      date: "2025-06-04",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100"
    },
    {
      id: 3,
      user: "Omar Bennani",
      email: "omar.bennani@email.com",
      issue: "Problème de paiement",
      description: "Transaction échouée lors du paiement",
      priority: "Haute",
      status: "Résolu",
      date: "2025-06-02",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100"
    }
  ];

  useEffect(() => {
    // Simulate API loading
    setLoading(true);
    setTimeout(() => {
      setUsers(mockUsers);
      setProjects(mockProjects);
      setAppointments(mockAppointments);
      setUserIssues(mockUserIssues);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !selectedUserRole || user.role === selectedUserRole;
    return matchesSearch && matchesRole;
  });

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedProjectStatus || project.status === selectedProjectStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'confirmé':
      case 'complété':
        return '#28a745';
      case 'pending':
      case 'en attente':
        return '#ffc107';
      case 'en cours':
        return '#007bff';
      default:
        return '#6c757d';
    }
  };

  const DashboardOverview = () => (
    <div style={styles.dashboardGrid}>
      <div style={styles.statCard}>
        <div style={styles.statIcon}>👥</div>
        <div style={styles.statContent}>
          <h3 style={styles.statNumber}>{users.length}</h3>
          <p style={styles.statLabel}>Utilisateurs totaux</p>
          <small style={styles.statSubtext}>+{users.filter(u => u.status === 'Active').length} actifs</small>
        </div>
      </div>

      <div style={styles.statCard}>
        <div style={styles.statIcon}>📋</div>
        <div style={styles.statContent}>
          <h3 style={styles.statNumber}>{projects.length}</h3>
          <p style={styles.statLabel}>Projets</p>
          <small style={styles.statSubtext}>{projects.filter(p => p.status === 'En cours').length} en cours</small>
        </div>
      </div>

      <div style={styles.statCard}>
        <div style={styles.statIcon}>📅</div>
        <div style={styles.statContent}>
          <h3 style={styles.statNumber}>{appointments.length}</h3>
          <p style={styles.statLabel}>Rendez-vous</p>
          <small style={styles.statSubtext}>{appointments.filter(a => a.status === 'Confirmé').length} confirmés</small>
        </div>
      </div>

      <div style={styles.statCard}>
        <div style={styles.statIcon}>🛠️</div>
        <div style={styles.statContent}>
          <h3 style={styles.statNumber}>{userIssues.filter(i => i.status !== 'Résolu').length}</h3>
          <p style={styles.statLabel}>Problèmes ouverts</p>
          <small style={styles.statSubtext}>{userIssues.filter(i => i.priority === 'Haute').length} haute priorité</small>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={styles.activityCard}>
        <h3 style={styles.cardTitle}>🔔 Activité récente</h3>
        <div style={styles.activityList}>
          <div style={styles.activityItem}>
            <span style={styles.activityDot}></span>
            <div>
              <p><strong>Ahmed Benali</strong> a soumis un nouveau projet</p>
              <small>Il y a 2 heures</small>
            </div>
          </div>
          <div style={styles.activityItem}>
            <span style={styles.activityDot}></span>
            <div>
              <p><strong>Fatima Zarrouk</strong> a confirmé un rendez-vous</p>
              <small>Il y a 4 heures</small>
            </div>
          </div>
          <div style={styles.activityItem}>
            <span style={styles.activityDot}></span>
            <div>
              <p>Nouveau problème utilisateur signalé</p>
              <small>Il y a 6 heures</small>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.actionsCard}>
        <h3 style={styles.cardTitle}>⚡ Actions rapides</h3>
        <div style={styles.actionButtons}>
          <button style={styles.actionButton} onClick={() => setActiveSection('users')}>
            👥 Voir utilisateurs
          </button>
          <button style={styles.actionButton} onClick={() => setActiveSection('projects')}>
            📋 Voir projets
          </button>
          <button style={styles.actionButton} onClick={() => setActiveSection('appointments')}>
            📅 Gérer rendez-vous
          </button>
          <button style={styles.actionButton} onClick={() => setActiveSection('issues')}>
            🛠️ Problèmes utilisateurs
          </button>
        </div>
      </div>
    </div>
  );

  const UsersView = () => (
    <div style={styles.managementContainer}>
      <div style={styles.managementHeader}>
        <h2 style={styles.managementTitle}>👥 Consultation des utilisateurs</h2>
        <div style={styles.accessNote}>
          <span style={styles.accessText}>👁️ Accès en lecture seule</span>
        </div>
      </div>

      <div style={styles.filtersSection}>
        <div style={styles.filterGroup}>
          <input
            type="text"
            placeholder="🔍 Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <div style={styles.filterGroup}>
          <select
            value={selectedUserRole}
            onChange={(e) => setSelectedUserRole(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">Tous les rôles</option>
            <option value="Admin">Admin</option>
            <option value="Entrepreneur">Entrepreneur</option>
            <option value="Investisseur">Investisseur</option>
          </select>
        </div>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.tableHeaderCell}>Utilisateur</th>
              <th style={styles.tableHeaderCell}>Rôle</th>
              <th style={styles.tableHeaderCell}>Statut</th>
              <th style={styles.tableHeaderCell}>Projets</th>
              <th style={styles.tableHeaderCell}>Dernière connexion</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} style={styles.tableRow}>
                <td style={styles.tableCell}>
                  <div style={styles.userInfo}>
                    <img src={user.avatar} alt={user.name} style={styles.userAvatar} />
                    <div>
                      <p style={styles.userName}>{user.name}</p>
                      <p style={styles.userEmail}>{user.email}</p>
                    </div>
                  </div>
                </td>
                <td style={styles.tableCell}>
                  <span style={styles.roleTag}>{user.role}</span>
                </td>
                <td style={styles.tableCell}>
                  <span style={{...styles.statusTag, backgroundColor: getStatusColor(user.status)}}>
                    {user.status}
                  </span>
                </td>
                <td style={styles.tableCell}>{user.projects}</td>
                <td style={styles.tableCell}>{user.lastLogin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ProjectsView = () => (
    <div style={styles.managementContainer}>
      <div style={styles.managementHeader}>
        <h2 style={styles.managementTitle}>📋 Consultation des projets</h2>
        <div style={styles.accessNote}>
          <span style={styles.accessText}>👁️ Accès en lecture seule</span>
        </div>
      </div>

      <div style={styles.filtersSection}>
        <div style={styles.filterGroup}>
          <input
            type="text"
            placeholder="🔍 Rechercher un projet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <div style={styles.filterGroup}>
          <select
            value={selectedProjectStatus}
            onChange={(e) => setSelectedProjectStatus(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">Tous les statuts</option>
            <option value="En cours">En cours</option>
            <option value="En attente">En attente</option>
            <option value="Complété">Complété</option>
          </select>
        </div>
      </div>

      <div style={styles.projectsGrid}>
        {filteredProjects.map(project => (
          <div key={project.id} style={styles.projectCard}>
            <div style={styles.projectHeader}>
              <h3 style={styles.projectTitle}>{project.title}</h3>
              <span style={{...styles.statusTag, backgroundColor: getStatusColor(project.status)}}>
                {project.status}
              </span>
            </div>
            
            <p style={styles.projectOwner}>👤 {project.owner}</p>
            <p style={styles.projectSector}>🏢 {project.sector}</p>
            <p style={styles.projectDescription}>{project.description}</p>
            
            <div style={styles.projectProgress}>
              <div style={styles.progressLabel}>
                <span>Progression: {project.progress}%</span>
                <span>{project.budget}</span>
              </div>
              <div style={styles.progressBar}>
                <div style={{...styles.progressFill, width: `${project.progress}%`}}></div>
              </div>
            </div>

            <div style={styles.projectFooter}>
              <span style={styles.projectInvestors}>💰 {project.investors} investisseurs</span>
              <div style={styles.actionButtons}>
                <button style={styles.viewButton}>
                  👁️ Consulter
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const AppointmentsManagement = () => (
    <div style={styles.managementContainer}>
      <div style={styles.managementHeader}>
        <h2 style={styles.managementTitle}>📅 Gestion des rendez-vous</h2>
        <button style={styles.addButton}>+ Nouveau rendez-vous</button>
      </div>

      <div style={styles.appointmentsGrid}>
        {appointments.map(appointment => (
          <div key={appointment.id} style={styles.appointmentCard}>
            <div style={styles.appointmentHeader}>
              <h3 style={styles.appointmentTitle}>{appointment.title}</h3>
              <span style={{...styles.statusTag, backgroundColor: getStatusColor(appointment.status)}}>
                {appointment.status}
              </span>
            </div>
            
            <div style={styles.appointmentInfo}>
              <p><strong>👤 Client:</strong> {appointment.client}</p>
              <p><strong>📅 Date:</strong> {appointment.date}</p>
              <p><strong>🕐 Heure:</strong> {appointment.time}</p>
              <p><strong>📍 Lieu:</strong> {appointment.location}</p>
              <p><strong>🎯 Type:</strong> {appointment.type}</p>
            </div>

            <div style={styles.appointmentActions}>
              <button style={styles.confirmButton}>✅ Confirmer</button>
              <button style={styles.rescheduleButton}>📅 Reporter</button>
              <button style={styles.editButton}>✏️ Modifier</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const UserIssuesView = () => (
    <div style={styles.managementContainer}>
      <div style={styles.managementHeader}>
        <h2 style={styles.managementTitle}>🛠️ Problèmes des utilisateurs</h2>
        <div style={styles.issueStats}>
          <span style={styles.issueStat}>
            🔥 {userIssues.filter(i => i.priority === 'Haute').length} Haute priorité
          </span>
          <span style={styles.issueStat}>
            ⏳ {userIssues.filter(i => i.status === 'En cours').length} En cours
          </span>
        </div>
      </div>

      <div style={styles.issuesGrid}>
        {userIssues.map(issue => (
          <div key={issue.id} style={styles.issueCard}>
            <div style={styles.issueHeader}>
              <div style={styles.userInfo}>
                <img src={issue.avatar} alt={issue.user} style={styles.userAvatar} />
                <div>
                  <p style={styles.userName}>{issue.user}</p>
                  <p style={styles.userEmail}>{issue.email}</p>
                </div>
              </div>
              <span style={{
                ...styles.priorityTag,
                backgroundColor: issue.priority === 'Haute' ? '#dc3545' : 
                                issue.priority === 'Moyenne' ? '#ffc107' : '#28a745'
              }}>
                {issue.priority}
              </span>
            </div>
            
            <h3 style={styles.issueTitle}>{issue.issue}</h3>
            <p style={styles.issueDescription}>{issue.description}</p>
            
            <div style={styles.issueFooter}>
              <span style={{...styles.statusTag, backgroundColor: getStatusColor(issue.status)}}>
                {issue.status}
              </span>
              <span style={styles.issueDate}>📅 {issue.date}</span>
            </div>

            <div style={styles.issueActions}>
              <button style={styles.resolveButton}>✅ Résoudre</button>
              <button style={styles.contactButton}>💬 Contacter</button>
              <button style={styles.viewButton}>👁️ Détails</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div style={styles.loadingContainer}>
          <div style={styles.loader}></div>
          <p>Chargement du tableau de bord...</p>
        </div>
      );
    }

    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'users':
        return <UsersView />;
      case 'projects':
        return <ProjectsView />;
      case 'appointments':
        return <AppointmentsManagement />;
      case 'issues':
        return <UserIssuesView />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <div style={styles.navBrand}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>🏛️</div>
            </div>
            <span style={styles.brandText}>Porteur Dashboard</span>
          </div>
          <div style={styles.navLinks}>
            <span style={styles.welcomeText}>Bienvenue, Porteur</span>
            <button style={styles.logoutButton}>🚪 Déconnexion</button>
          </div>
        </div>
      </nav>

      <div style={styles.mainContainer}>
        <div style={styles.contentLayout}>
          {/* Sidebar */}
          <aside style={styles.sidebar}>
            <div style={styles.sidebarCard}>
              <h3 style={styles.sidebarTitle}>📊 Navigation</h3>
              
              <nav style={styles.sidebarNav}>
                <button
                  style={{
                    ...styles.sidebarButton,
                    ...(activeSection === 'dashboard' ? styles.sidebarButtonActive : {})
                  }}
                  onClick={() => setActiveSection('dashboard')}
                >
                  🏠 Tableau de bord
                </button>
                
                <button
                  style={{
                    ...styles.sidebarButton,
                    ...(activeSection === 'users' ? styles.sidebarButtonActive : {})
                  }}
                  onClick={() => setActiveSection('users')}
                >
                  👥 Utilisateurs
                </button>
                
                <button
                  style={{
                    ...styles.sidebarButton,
                    ...(activeSection === 'projects' ? styles.sidebarButtonActive : {})
                  }}
                  onClick={() => setActiveSection('projects')}
                >
                  📋 Projets
                </button>
                
                <button
                  style={{
                    ...styles.sidebarButton,
                    ...(activeSection === 'appointments' ? styles.sidebarButtonActive : {})
                  }}
                  onClick={() => setActiveSection('appointments')}
                >
                  📅 Rendez-vous
                </button>
                
                <button
                  style={{
                    ...styles.sidebarButton,
                    ...(activeSection === 'issues' ? styles.sidebarButtonActive : {})
                  }}
                  onClick={() => setActiveSection('issues')}
                >
                  🛠️ Problèmes utilisateurs
                </button>
              </nav>
            </div>

            {/* Porteur Info */}
            <div style={styles.sidebarCard}>
              <h3 style={styles.sidebarTitle}>👤 Informations Porteur</h3>
              <div style={styles.adminInfo}>
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80" 
                  alt="Porteur" 
                  style={styles.adminAvatar} 
                />
                <div>
                  <p style={styles.adminName}>Ahmed Porteur</p>
                  <p style={styles.adminRole}>Porteur de Projets</p>
                  <p style={styles.adminLastLogin}>Connecté depuis 10:15</p>
                </div>
              </div>
            </div>

            {/* Access Rights */}
            <div style={styles.sidebarCard}>
              <h3 style={styles.sidebarTitle}>🔐 Droits d'accès</h3>
              <div style={styles.accessRights}>
                <div style={styles.accessItem}>
                  <span style={styles.accessIcon}>👁️</span>
                  <span style={styles.accessLabel}>Consultation utilisateurs</span>
                </div>
                <div style={styles.accessItem}>
                  <span style={styles.accessIcon}>👁️</span>
                  <span style={styles.accessLabel}>Consultation projets</span>
                </div>
                <div style={styles.accessItem}>
                  <span style={styles.accessIcon}>✏️</span>
                  <span style={styles.accessLabel}>Modification rendez-vous</span>
                </div>
                <div style={styles.accessItem}>
                  <span style={styles.accessIcon}>🛠️</span>
                  <span style={styles.accessLabel}>Gestion problèmes</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main style={styles.mainContent}>
            {renderContent()}
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
    maxWidth: '1400px',
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
    gap: '1rem',
    alignItems: 'center'
  },
  welcomeText: {
    color: 'white',
    fontSize: '0.9rem'
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  mainContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem 1rem'
  },
  contentLayout: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
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
  sidebarNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  sidebarButton: {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '0.9rem',
    color: '#666',
    transition: 'all 0.3s'
  },
  sidebarButtonActive: {
    backgroundColor: '#8B4513',
    color: 'white'
  },
  adminInfo: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center'
  },
  adminAvatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  adminName: {
    fontWeight: 'bold',
    margin: '0',
    fontSize: '0.9rem'
  },
  adminRole: {
    color: '#666',
    margin: '0',
    fontSize: '0.8rem'
  },
  adminLastLogin: {
    color: '#999',
    margin: '0',
    fontSize: '0.7rem'
  },
  accessRights: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  accessItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    border: '1px solid #e9ecef'
  },
  accessIcon: {
    fontSize: '1rem'
  },
  accessLabel: {
    fontSize: '0.8rem',
    color: '#333'
  },
  mainContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    minHeight: '600px'
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem'
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    border: '1px solid #e9ecef'
  },
  statIcon: {
    fontSize: '2rem',
    backgroundColor: '#8B4513',
    color: 'white',
    padding: '1rem',
    borderRadius: '12px'
  },
  statContent: {
    flex: 1
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: '0',
    color: '#333'
  },
  statLabel: {
    color: '#666',
    margin: '0',
    fontSize: '0.9rem'
  },
  statSubtext: {
    color: '#999',
    fontSize: '0.8rem'
  },
  activityCard: {
    gridColumn: 'span 2',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid #e9ecef'
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#333'
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  activityItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem'
  },
  activityDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#8B4513',
    borderRadius: '50%',
    marginTop: '0.5rem',
    flexShrink: 0
  },
  actionsCard: {
    gridColumn: 'span 2',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid #e9ecef'
  },
  actionButtons: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  actionButton: {
    padding: '0.75rem 1rem',
    backgroundColor: '#8B4513',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'background-color 0.3s'
  },
  managementContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  managementHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  managementTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    margin: '0'
  },
  accessNote: {
    padding: '0.5rem 1rem',
    backgroundColor: '#e3f2fd',
    borderRadius: '6px',
    border: '1px solid #bbdefb'
  },
  accessText: {
    fontSize: '0.8rem',
    color: '#1565c0',
    fontWeight: '500'
  },
  addButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  filtersSection: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem'
  },
  filterGroup: {
    flex: 1
  },
  searchInput: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '0.9rem',
    boxSizing: 'border-box'
  },
  filterSelect: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '0.9rem',
    backgroundColor: 'white',
    boxSizing: 'border-box'
  },
  tableContainer: {
    overflowX: 'auto',
    border: '1px solid #ddd',
    borderRadius: '8px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white'
  },
  tableHeader: {
    backgroundColor: '#f8f9fa'
  },
  tableHeaderCell: {
    padding: '1rem',
    textAlign: 'left',
    fontWeight: 'bold',
    color: '#333',
    borderBottom: '2px solid #dee2e6'
  },
  tableRow: {
    borderBottom: '1px solid #dee2e6',
    transition: 'background-color 0.3s'
  },
  tableCell: {
    padding: '1rem',
    verticalAlign: 'middle'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  userName: {
    margin: '0',
    fontWeight: 'bold',
    fontSize: '0.9rem'
  },
  userEmail: {
    margin: '0',
    color: '#666',
    fontSize: '0.8rem'
  },
  roleTag: {
    backgroundColor: '#e9ecef',
    color: '#495057',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '500'
  },
  statusTag: {
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '500'
  },
  projectsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '1.5rem'
  },
  projectCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid #e9ecef'
  },
  projectHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem'
  },
  projectTitle: {
    margin: '0',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#333',
    flex: 1
  },
  projectOwner: {
    margin: '0.25rem 0',
    fontSize: '0.9rem',
    color: '#666'
  },
  projectSector: {
    margin: '0.25rem 0',
    fontSize: '0.9rem',
    color: '#666'
  },
  projectDescription: {
    margin: '0.5rem 0 1rem 0',
    fontSize: '0.9rem',
    color: '#555',
    lineHeight: '1.4'
  },
  projectProgress: {
    marginBottom: '1rem'
  },
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
    fontSize: '0.8rem',
    color: '#666'
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e9ecef',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B4513',
    transition: 'width 0.3s'
  },
  projectFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  projectInvestors: {
    fontSize: '0.8rem',
    color: '#666'
  },
  viewButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem'
  },
  appointmentsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  appointmentCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid #e9ecef'
  },
  appointmentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem'
  },
  appointmentTitle: {
    margin: '0',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#333',
    flex: 1
  },
  appointmentInfo: {
    marginBottom: '1.5rem'
  },
  appointmentActions: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  confirmButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '0.5rem 0.75rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem'
  },
  rescheduleButton: {
    backgroundColor: '#ffc107',
    color: '#212529',
    border: 'none',
    padding: '0.5rem 0.75rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem'
  },
  editButton: {
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    padding: '0.5rem 0.75rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem'
  },
  issueStats: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },
  issueStat: {
    fontSize: '0.9rem',
    color: '#666',
    padding: '0.5rem 1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    border: '1px solid #e9ecef'
  },
  issuesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '1.5rem'
  },
  issueCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid #e9ecef'
  },
  issueHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  priorityTag: {
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '500'
  },
  issueTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#333'
  },
  issueDescription: {
    margin: '0 0 1rem 0',
    fontSize: '0.9rem',
    color: '#555',
    lineHeight: '1.4'
  },
  issueFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  issueDate: {
    fontSize: '0.8rem',
    color: '#666'
  },
  issueActions: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  resolveButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '0.5rem 0.75rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem'
  },
  contactButton: {
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    padding: '0.5rem 0.75rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '1rem'
  },
  loader: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f4f6',
    borderTop: '4px solid #8B4513',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }
};

export default PorteurDashboard;