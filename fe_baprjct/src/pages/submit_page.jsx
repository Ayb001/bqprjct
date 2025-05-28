import React, { useState } from 'react';

const SubmitProject = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sector: '',
    budget: '',
    revenue: '',
    location: '',
    jobs: '',
    profitability: '',
    goal: '',
    technology: '',
    impact: '',
    incentives: '',
    partners: '',
    image: null,
    publishTime: ''
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Le titre est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (!formData.sector) newErrors.sector = 'Le secteur est requis';
    if (!formData.budget.trim()) newErrors.budget = 'Le budget est requis';
    if (!formData.location.trim()) newErrors.location = 'La localisation est requise';
    
    if (formData.budget && isNaN(parseFloat(formData.budget))) {
      newErrors.budget = 'Le budget doit être un nombre valide';
    }
    if (formData.revenue && isNaN(parseFloat(formData.revenue))) {
      newErrors.revenue = 'Le chiffre d\'affaires doit être un nombre valide';
    }
    if (formData.jobs && isNaN(parseInt(formData.jobs))) {
      newErrors.jobs = 'Le nombre d\'emplois doit être un nombre entier';
    }
    if (formData.profitability && isNaN(parseFloat(formData.profitability))) {
      newErrors.profitability = 'Le ratio de rentabilité doit être un nombre valide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      alert('Projet soumis avec succès!');
      console.log('Form data:', formData);
    }
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    return parseFloat(num).toLocaleString('fr-FR');
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
            <span style={styles.brandText}>Banque de projets</span>
          </div>
          <div style={styles.navLinks}>
            <a href="#" style={styles.navLink}>Accueil</a>
            <a href="#" style={styles.navLink}>Rechercher</a>
            <a href="#" style={styles.navLink}>À propos</a>
            <a href="#" style={styles.navLink}>Contact</a>
          </div>
        </div>
      </nav>

      <div style={styles.mainContainer}>
        <div style={styles.gridContainer}>
          {/* Form Section */}
          <div style={styles.formCard}>
            <h2 style={styles.formTitle}>Soumettre un projet</h2>
            
            <div style={styles.formContent}>
              {/* Basic Information */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Informations de base</h3>
                
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Titre du projet *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    style={{...styles.input, ...(errors.title ? styles.inputError : {})}}
                    placeholder="Ex: Centrale solaire photovoltaïque"
                  />
                  {errors.title && <span style={styles.errorText}>{errors.title}</span>}
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    style={{...styles.textarea, ...(errors.description ? styles.inputError : {})}}
                    placeholder="Description détaillée du projet..."
                    rows={4}
                  />
                  {errors.description && <span style={styles.errorText}>{errors.description}</span>}
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Secteur *</label>
                  <select
                    name="sector"
                    value={formData.sector}
                    onChange={handleInputChange}
                    style={{...styles.select, ...(errors.sector ? styles.inputError : {})}}
                  >
                    <option value="">Sélectionner un secteur</option>
                    {sectors.map((sector, index) => (
                      <option key={index} value={sector}>{sector}</option>
                    ))}
                  </select>
                  {errors.sector && <span style={styles.errorText}>{errors.sector}</span>}
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Localisation *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    style={{...styles.input, ...(errors.location ? styles.inputError : {})}}
                    placeholder="Ex: Ouarzazate, Drâa-Tafilalet"
                  />
                  {errors.location && <span style={styles.errorText}>{errors.location}</span>}
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Heure de publication</label>
                  <input
                    type="time"
                    name="publishTime"
                    value={formData.publishTime}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>
              </div>

              {/* Economic Data */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Données économiques</h3>
                
                <div style={styles.gridTwo}>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Investissement (M Dhs) *</label>
                    <input
                      type="number"
                      step="0.1"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      style={{...styles.input, ...(errors.budget ? styles.inputError : {})}}
                      placeholder="12.5"
                    />
                    {errors.budget && <span style={styles.errorText}>{errors.budget}</span>}
                  </div>

                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Chiffre d'affaires (M Dhs)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="revenue"
                      value={formData.revenue}
                      onChange={handleInputChange}
                      style={{...styles.input, ...(errors.revenue ? styles.inputError : {})}}
                      placeholder="28.7"
                    />
                    {errors.revenue && <span style={styles.errorText}>{errors.revenue}</span>}
                  </div>

                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Nombre d'emplois</label>
                    <input
                      type="number"
                      name="jobs"
                      value={formData.jobs}
                      onChange={handleInputChange}
                      style={{...styles.input, ...(errors.jobs ? styles.inputError : {})}}
                      placeholder="45"
                    />
                    {errors.jobs && <span style={styles.errorText}>{errors.jobs}</span>}
                  </div>

                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Ratio de rentabilité</label>
                    <input
                      type="number"
                      step="0.1"
                      name="profitability"
                      value={formData.profitability}
                      onChange={handleInputChange}
                      style={{...styles.input, ...(errors.profitability ? styles.inputError : {})}}
                      placeholder="2.3"
                    />
                    {errors.profitability && <span style={styles.errorText}>{errors.profitability}</span>}
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Détails supplémentaires</h3>
                
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Objectif du projet</label>
                  <textarea
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                    style={styles.textarea}
                    placeholder="Objectif principal du projet..."
                    rows={3}
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Technologie utilisée</label>
                  <textarea
                    name="technology"
                    value={formData.technology}
                    onChange={handleInputChange}
                    style={styles.textarea}
                    placeholder="Technologies et méthodes employées..."
                    rows={3}
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Impact environnemental/économique</label>
                  <textarea
                    name="impact"
                    value={formData.impact}
                    onChange={handleInputChange}
                    style={styles.textarea}
                    placeholder="Impact attendu du projet..."
                    rows={3}
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Régimes incitatifs</label>
                  <textarea
                    name="incentives"
                    value={formData.incentives}
                    onChange={handleInputChange}
                    style={styles.textarea}
                    placeholder="Incitations ou subventions applicables..."
                    rows={2}
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Partenaires du projet</label>
                  <textarea
                    name="partners"
                    value={formData.partners}
                    onChange={handleInputChange}
                    style={styles.textarea}
                    placeholder="Liste des partenaires impliqués dans le projet..."
                    rows={3}
                  />
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Image du projet</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={styles.fileInput}
                  />
                </div>
              </div>

              <button onClick={handleSubmit} style={styles.submitButton}>
                Soumettre le projet
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div style={styles.previewCard}>
            <div style={styles.previewHeader}>
              <span style={styles.previewIcon}>👁️</span>
              <h2 style={styles.previewTitle}>Aperçu du projet</h2>
            </div>

            <div style={styles.previewContent}>
              {/* Project Header */}
              <div style={styles.projectHeader}>
                <h1 style={styles.projectTitle}>
                  {formData.title || 'Titre du projet'}
                </h1>
                <div style={styles.projectMeta}>
                  <div style={styles.metaItem}>
                    <span style={styles.metaIcon}>📅</span>
                    <span>Publié le {getCurrentDate()}</span>
                    {formData.publishTime && <span> à {formData.publishTime}</span>}
                  </div>
                  <div style={styles.metaItem}>
                    <span style={styles.metaIcon}>👁️</span>
                    <span>245 vues</span>
                  </div>
                </div>
                
                <div style={styles.actionButtons}>
                  <button style={styles.primaryButton}>
                    <span style={styles.buttonIcon}>📥</span>
                    Télécharger la fiche projet
                  </button>
                  <button style={styles.secondaryButton}>
                    <span style={styles.buttonIcon}>📤</span>
                    Partager
                  </button>
                  <button style={styles.secondaryButton}>
                    <span style={styles.buttonIcon}>🖨️</span>
                    Imprimer
                  </button>
                </div>
              </div>

              {/* Project Image */}
              <div style={styles.imageContainer}>
                <div 
                  style={styles.imagePreview}
                  onClick={() => imagePreview && setShowImageModal(true)}
                >
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Project preview" 
                      style={styles.previewImage}
                    />
                  ) : (
                    <div style={styles.imagePlaceholder}>
                      <div style={styles.placeholderIcon}>🔍</div>
                      <p>Image du projet</p>
                    </div>
                  )}
                </div>
                {imagePreview && (
                  <div style={styles.zoomIndicator}>🔍</div>
                )}
              </div>

              {/* Economic Data */}
              <div style={styles.economicGrid}>
                <div style={styles.economicCard}>
                  <div style={styles.economicHeader}>
                    <span style={styles.economicIcon}>💰</span>
                    <span>Investissement</span>
                  </div>
                  <p style={styles.economicValue}>
                    {formData.budget ? `${formatNumber(formData.budget)} M Dhs` : '0 M Dhs'}
                  </p>
                </div>
                
                <div style={styles.economicCard}>
                  <div style={styles.economicHeader}>
                    <span style={styles.economicIcon}>📈</span>
                    <span>Chiffre d'affaires</span>
                  </div>
                  <p style={styles.economicValue}>
                    {formData.revenue ? `${formatNumber(formData.revenue)} M Dhs` : '0 M Dhs'}
                  </p>
                </div>
                
                <div style={styles.economicCard}>
                  <div style={styles.economicHeader}>
                    <span style={styles.economicIcon}>👥</span>
                    <span>Emplois</span>
                  </div>
                  <p style={styles.economicValue}>
                    {formData.jobs || '0'}
                  </p>
                </div>
                
                <div style={styles.economicCard}>
                  <div style={styles.economicHeader}>
                    <span style={styles.economicIcon}>📊</span>
                    <span>Ratio de rentabilité</span>
                  </div>
                  <p style={styles.economicValue}>
                    {formData.profitability || '0'}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div style={styles.descriptionSection}>
                <h3 style={styles.sectionHeading}>Description</h3>
                
                {formData.goal && (
                  <div style={styles.descriptionItem}>
                    <h4 style={styles.subHeading}>Objectif du projet</h4>
                    <p style={styles.descriptionText}>{formData.goal}</p>
                  </div>
                )}
                
                {formData.technology && (
                  <div style={styles.descriptionItem}>
                    <h4 style={styles.subHeading}>Technologie utilisée</h4>
                    <p style={styles.descriptionText}>{formData.technology}</p>
                  </div>
                )}
                
                {formData.impact && (
                  <div style={styles.descriptionItem}>
                    <h4 style={styles.subHeading}>Impact environnemental/économique</h4>
                    <p style={styles.descriptionText}>{formData.impact}</p>
                  </div>
                )}
                
                <p style={styles.descriptionText}>
                  {formData.description || 'La description du projet apparaîtra ici...'}
                </p>
              </div>

              {/* Additional Info */}
              <div style={styles.additionalSection}>
                {formData.incentives && (
                  <div style={styles.infoItem}>
                    <h4 style={styles.subHeading}>Régimes incitatifs</h4>
                    <p style={styles.infoText}>{formData.incentives}</p>
                  </div>
                )}
                
                <div style={styles.infoItem}>
                  <h4 style={styles.subHeading}>
                    <span style={styles.infoIcon}>📍</span>
                    Localisation
                  </h4>
                  <p style={styles.infoText}>{formData.location || 'Localisation non spécifiée'}</p>
                </div>
                
                <div style={styles.infoItem}>
                  <h4 style={styles.subHeading}>Secteur</h4>
                  <p style={styles.infoText}>{formData.sector || 'Secteur non spécifié'}</p>
                </div>
                
                <div style={styles.infoItem}>
                  <h4 style={styles.subHeading}>Partenaires</h4>
                  <p style={styles.infoText}>
                    {formData.partners || 'Les partenaires du projet seront affichés ici.'}
                  </p>
                </div>
                
                <div style={styles.infoItem}>
                  <h4 style={styles.subHeading}>Articles connexes</h4>
                  <p style={styles.infoText}>Les articles connexes seront affichés ici.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && imagePreview && (
        <div 
          style={styles.modal}
          onClick={() => setShowImageModal(false)}
        >
          <div style={styles.modalContent}>
            <img 
              src={imagePreview} 
              alt="Project full size" 
              style={styles.modalImage}
            />
          </div>
        </div>
      )}
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
  mainContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem 1rem'
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem'
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    padding: '1.5rem',
    height: 'fit-content'
  },
  formTitle: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '1.5rem',
    borderBottom: '2px solid #8B4513',
    paddingBottom: '0.5rem'
  },
  formContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#555',
    borderBottom: '1px solid #ddd',
    paddingBottom: '0.5rem'
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#333'
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '1rem',
    transition: 'border-color 0.3s'
  },
  textarea: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '1rem',
    resize: 'vertical',
    fontFamily: 'inherit',
    transition: 'border-color 0.3s'
  },
  select: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '1rem',
    backgroundColor: 'white',
    transition: 'border-color 0.3s'
  },
  fileInput: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '1rem',
    backgroundColor: 'white'
  },
  inputError: {
    borderColor: '#dc3545'
  },
  errorText: {
    color: '#dc3545',
    fontSize: '0.875rem'
  },
  gridTwo: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },
  submitButton: {
    backgroundColor: '#8B4513',
    color: 'white',
    padding: '0.875rem 1.5rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  previewCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    padding: '1.5rem',
    height: 'fit-content'
  },
  previewHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.5rem'
  },
  previewIcon: {
    fontSize: '1.25rem'
  },
  previewTitle: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: '#333'
  },
  previewContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  projectHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  projectTitle: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '0.5rem'
  },
  projectMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '1rem'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.9rem',
    color: '#666'
  },
  metaIcon: {
    fontSize: '1rem'
  },
  actionButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#8B4513',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  secondaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#6c757d',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  buttonIcon: {
    fontSize: '0.875rem'
  },
  imageContainer: {
    position: 'relative'
  },
  imagePreview: {
    width: '100%',
    height: '200px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    overflow: 'hidden'
  },
  previewImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '8px'
  },
  imagePlaceholder: {
    textAlign: 'center',
    color: '#6c757d'
  },
  placeholderIcon: {
    fontSize: '2rem',
    marginBottom: '0.5rem'
  },
  zoomIndicator: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white',
    padding: '0.25rem',
    borderRadius: '4px',
    fontSize: '0.875rem'
  },
  economicGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },
  economicCard: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
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
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#333',
    margin: 0
  },
  descriptionSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  sectionHeading: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#333',
    borderBottom: '1px solid #ddd',
    paddingBottom: '0.5rem'
  },
  descriptionItem: {
    marginBottom: '1rem'
  },
  subHeading: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#555',
    marginBottom: '0.5rem'
  },
  descriptionText: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: '#333',
    margin: 0
  },
  additionalSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  infoIcon: {
    fontSize: '1rem',
    marginRight: '0.25rem'
  },
  infoText: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: '#333',
    margin: 0
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    cursor: 'pointer'
  },
  modalContent: {
    maxWidth: '90%',
    maxHeight: '90%',
    position: 'relative'
  },
  modalImage: {
    width: '100%',
    height: 'auto',
    maxHeight: '90vh',
    objectFit: 'contain',
    borderRadius: '8px'
  },
  // Media queries for responsive design
  '@media (max-width: 1024px)': {
    gridContainer: {
      gridTemplateColumns: '1fr',
      gap: '1.5rem'
    }
  },
  '@media (max-width: 768px)': {
    gridTwo: {
      gridTemplateColumns: '1fr'
    },
    economicGrid: {
      gridTemplateColumns: '1fr'
    },
    navLinks: {
      display: 'none'
    },
    actionButtons: {
      flexDirection: 'column'
    }
  }
};

export default SubmitProject;