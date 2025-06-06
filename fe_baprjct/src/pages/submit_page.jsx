import React, { useState } from 'react';
import { Upload, FileText, ImageIcon } from 'lucide-react';

const SubmitProject = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sector: '',
    budget: '',
    revenue: '',
    location: '',
    province: '',
    jobs: '',
    profitability: '',
    goal: '',
    technology: '',
    impact: '',
    incentives: '',
    partners: '',
    image: null,
    pdfFile: null,
    publishTime: ''
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [pdfFileName, setPdfFileName] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const sectors = [
    'Agriculture',
    'Énergie renouvelable – Énergie solaire',
    'Énergie renouvelable – Énergie éolienne',
    'Tourisme',
    'Technologie',
    'Santé',
    'Éducation',
    'Artisanat',
    'Industrie'
  ];

  // Moroccan provinces in Drâa-Tafilalet region
  const provinces = [
    'Errachidia',
    'Ouarzazate',
    'Midelt',
    'Tinghir',
    'Zagora'
  ];

  // Handle logout function
  const handleLogout = () => {
    // Clear all authentication tokens
    localStorage.removeItem('token');
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    
    // Redirect to home or login page
    window.location.href = '/';
  };

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
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image valide.');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La taille de l\'image ne doit pas dépasser 5MB.');
        return;
      }

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

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        alert('Veuillez sélectionner un fichier PDF valide.');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('La taille du PDF ne doit pas dépasser 10MB.');
        return;
      }

      setFormData(prev => ({
        ...prev,
        pdfFile: file
      }));
      setPdfFileName(file.name);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Le titre est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (!formData.sector) newErrors.sector = 'Le secteur est requis';
    if (!formData.budget.trim()) newErrors.budget = 'Le budget est requis';
    if (!formData.location.trim()) newErrors.location = 'La localisation est requise';
    if (!formData.province) newErrors.province = 'La province est requise';
    
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

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem('token') || localStorage.getItem('jwt');
      
      if (!token) {
        setSubmitMessage('❌ Vous devez être connecté pour soumettre un projet');
        setIsSubmitting(false);
        return;
      }

      // Create project data object
      const projectData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        sector: formData.sector,
        location: formData.location.trim(),
        province: formData.province,
        budget: parseFloat(formData.budget),
        revenue: formData.revenue ? parseFloat(formData.revenue) : 0,
        jobs: formData.jobs ? parseInt(formData.jobs) : 0,
        profitability: formData.profitability ? parseFloat(formData.profitability) : 0,
        goal: formData.goal?.trim() || "",
        technology: formData.technology?.trim() || "",
        impact: formData.impact?.trim() || "",
        incentives: formData.incentives?.trim() || "",
        partners: formData.partners?.trim() || "",
        publishTime: formData.publishTime || "12:00",
        category: "TRADITIONAL_CRAFTS"
      };

      console.log('🚀 Submitting project data:', projectData);

      let response;
      
      // Check if we have files to upload
      if (formData.image || formData.pdfFile) {
        console.log('📂 Using multipart upload endpoint...');
        
        const formDataToSend = new FormData();
        
        // Add project data as JSON string (not Blob)
        formDataToSend.append('project', JSON.stringify(projectData));
        
        // Add files
        if (formData.image) {
          formDataToSend.append('image', formData.image);
        }
        if (formData.pdfFile) {
          formDataToSend.append('pdfFile', formData.pdfFile);
        }

        response = await fetch('http://localhost:8080/api/projects/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
            // DO NOT set Content-Type - let browser handle multipart boundaries
          },
          body: formDataToSend
        });
        
      } else {
        console.log('📝 Using JSON endpoint (no files)...');
        
        response = await fetch('http://localhost:8080/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(projectData)
        });
      }

      console.log('📡 Response status:', response.status);

      // Handle response
      let result;
      try {
        const responseText = await response.text();
        console.log('📄 Raw response:', responseText);
        
        if (responseText) {
          result = JSON.parse(responseText);
        } else {
          result = {};
        }
        console.log('📋 Parsed response:', result);
      } catch (e) {
        console.error('❌ Failed to parse response as JSON:', e);
        setSubmitMessage('❌ Erreur: Réponse invalide du serveur');
        return;
      }

      if (response.ok) {
        // Success cases
        if (result.success || result.data || response.status === 201) {
          setSubmitMessage('✅ Projet créé avec succès!');
          console.log('✅ Project created successfully:', result);
          
          // Reset form after successful submission
          setTimeout(() => {
            setFormData({
              title: '',
              description: '',
              sector: '',
              budget: '',
              revenue: '',
              location: '',
              province: '',
              jobs: '',
              profitability: '',
              goal: '',
              technology: '',
              impact: '',
              incentives: '',
              partners: '',
              image: null,
              pdfFile: null,
              publishTime: ''
            });
            setImagePreview(null);
            setPdfFileName('');
            setSubmitMessage('');
          }, 3000);
          
        } else {
          console.error('❌ Unexpected success response format:', result);
          setSubmitMessage(`❌ Erreur: ${result.message || result.error || 'Réponse inattendue'}`);
        }

      } else {
        // Error cases
        console.error('❌ API Error:', result);
        let errorMessage = 'Échec de la soumission';
        
        // Handle different error types
        if (result && result.error) {
          errorMessage = result.error;
        } else if (result && result.message) {
          errorMessage = result.message;
        } else {
          // Handle specific HTTP status codes
          switch (response.status) {
            case 400:
              errorMessage = 'Données de projet invalides. Vérifiez tous les champs.';
              break;
            case 401:
              errorMessage = 'Non autorisé. Veuillez vous reconnecter.';
              break;
            case 403:
              errorMessage = 'Accès refusé. Vous devez être un porteur de projet.';
              break;
            case 413:
              errorMessage = 'Fichier trop volumineux. Réduisez la taille des fichiers.';
              break;
            case 415:
              errorMessage = 'Format de fichier non supporté.';
              break;
            case 500:
              errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
              break;
            default:
              errorMessage = `Erreur ${response.status}: ${response.statusText}`;
          }
        }
        
        setSubmitMessage(`❌ Erreur: ${errorMessage}`);
      }

    } catch (error) {
      console.error('❌ Network/Connection error:', error);
      
      // Handle different types of network errors
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setSubmitMessage('❌ Erreur de connexion. Vérifiez que le serveur est démarré sur le port 8080.');
      } else if (error.name === 'AbortError') {
        setSubmitMessage('❌ Délai d\'attente dépassé. Veuillez réessayer.');
      } else {
        setSubmitMessage('❌ Erreur de connexion au serveur. Détails: ' + error.message);
      }
    } finally {
      setIsSubmitting(false);
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
      {/* Updated Navigation with same design as catalog */}
      <header style={styles.catalogHeader}>
        <div style={styles.headerContent}>
          <div style={styles.logoSection}>
            <div style={styles.logo}>🏛️</div>
            <h1 style={styles.headerTitle}>Banque de projets - Porteur</h1>
          </div>
          <nav style={styles.mainNav}>
            <a href="/project_catalog" style={styles.navLink}>📊 Projets</a>
            <a href="/submit_page" style={{...styles.navLink, ...styles.activeNavLink}}>➕ Nouveau Projet</a>
            <a href="/articles" style={styles.navLink}>📰 Articles</a>
            <a href="/dashboard" style={styles.navLink}>📈 Dashboard</a>
            <a href="/rendezvous" style={styles.navLink}>📅 Rendez-vous</a>
            <button onClick={handleLogout} style={styles.logoutBtn}>🚪 Déconnexion</button>
          </nav>
        </div>
      </header>

      <div style={styles.mainContainer}>
        <div style={styles.gridContainer}>
          {/* Form Section */}
          <div style={styles.formCard}>
            <h2 style={styles.formTitle}>Soumettre un projet</h2>
            
            {/* Submit Message */}
            {submitMessage && (
              <div style={{
                ...styles.submitMessage,
                backgroundColor: submitMessage.includes('✅') ? '#d4edda' : '#f8d7da',
                borderColor: submitMessage.includes('✅') ? '#c3e6cb' : '#f5c6cb',
                color: submitMessage.includes('✅') ? '#155724' : '#721c24'
              }}>
                {submitMessage}
              </div>
            )}
            
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  >
                    <option value="">Sélectionner un secteur</option>
                    {sectors.map((sector, index) => (
                      <option key={index} value={sector}>{sector}</option>
                    ))}
                  </select>
                  {errors.sector && <span style={styles.errorText}>{errors.sector}</span>}
                </div>

                <div style={styles.gridTwo}>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Localisation *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      style={{...styles.input, ...(errors.location ? styles.inputError : {})}}
                      placeholder="Ex: Ouarzazate"
                      disabled={isSubmitting}
                    />
                    {errors.location && <span style={styles.errorText}>{errors.location}</span>}
                  </div>

                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Province *</label>
                    <select
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      style={{...styles.select, ...(errors.province ? styles.inputError : {})}}
                      disabled={isSubmitting}
                    >
                      <option value="">Sélectionner une province</option>
                      {provinces.map((province, index) => (
                        <option key={index} value={province}>{province}</option>
                      ))}
                    </select>
                    {errors.province && <span style={styles.errorText}>{errors.province}</span>}
                  </div>
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Heure de publication</label>
                  <input
                    type="time"
                    name="publishTime"
                    value={formData.publishTime}
                    onChange={handleInputChange}
                    style={styles.input}
                    disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
                    />
                    {errors.profitability && <span style={styles.errorText}>{errors.profitability}</span>}
                  </div>
                </div>
              </div>

              {/* Files Upload Section */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Fichiers du projet</h3>
                
                <div style={styles.gridTwo}>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Image du projet</label>
                    <div style={styles.fileUploadContainer}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={styles.hiddenFileInput}
                        id="image-upload"
                        disabled={isSubmitting}
                      />
                      <label htmlFor="image-upload" style={styles.fileUploadLabel}>
                        <ImageIcon size={20} />
                        <span>{formData.image ? formData.image.name : 'Choisir une image'}</span>
                      </label>
                      {imagePreview && (
                        <div style={styles.imagePreviewContainer}>
                          <img src={imagePreview} alt="Preview" style={styles.imagePreviewThumb} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Fiche projet (PDF)</label>
                    <div style={styles.fileUploadContainer}>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handlePdfChange}
                        style={styles.hiddenFileInput}
                        id="pdf-upload"
                        disabled={isSubmitting}
                      />
                      <label htmlFor="pdf-upload" style={styles.fileUploadLabel}>
                        <FileText size={20} />
                        <span>{pdfFileName || 'Choisir un PDF'}</span>
                      </label>
                      {pdfFileName && (
                        <div style={styles.pdfIndicator}>
                          <FileText size={16} />
                          <span>{pdfFileName}</span>
                        </div>
                      )}
                    </div>
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <button 
                onClick={handleSubmit} 
                style={{
                  ...styles.submitButton,
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Soumission en cours...' : 'Soumettre le projet'}
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
                    <span>0 vues</span>
                  </div>
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

              {/* PDF File Indicator */}
              {pdfFileName && (
                <div style={styles.pdfSection}>
                  <h4 style={styles.subHeading}>📄 Fiche projet disponible</h4>
                  <div style={styles.pdfDownloadBox}>
                    <FileText size={24} />
                    <span>{pdfFileName}</span>
                  </div>
                </div>
              )}

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
                  <p style={styles.descriptionText}>{formData.goal}</p>  // ✅ CORRECT!
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
                  <p style={styles.infoText}>
                    {formData.location ? `${formData.location}, ${formData.province}` : 'Localisation non spécifiée'}
                  </p>
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

// Complete styles object
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
  },
  
  // Header styles matching catalog design exactly
  catalogHeader: {
    background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
    boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    padding: '0.75rem 0'
  },
  
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '60px'
  },
  
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  
  logo: {
    fontSize: '1.8rem',
    background: 'rgba(255,255,255,0.2)',
    padding: '0.4rem',
    borderRadius: '10px',
    backdropFilter: 'blur(10px)'
  },
  
  headerTitle: {
    color: 'white',
    fontSize: '1.3rem',
    fontWeight: '600',
    margin: 0
  },
  
  mainNav: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center'
  },
  
  navLink: {
    color: 'rgba(255,255,255,0.9)',
    textDecoration: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    transition: 'all 0.3s ease',
    fontWeight: '500',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '0.9rem',
    whiteSpace: 'nowrap'
  },
  
  activeNavLink: {
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    backdropFilter: 'blur(10px)'
  },
  
  logoutBtn: {
    color: 'rgba(255,255,255,0.9)',
    textDecoration: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    transition: 'all 0.3s ease',
    fontWeight: '500',
    border: '1px solid rgba(220, 53, 69, 0.3)',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '0.9rem',
    background: 'rgba(220, 53, 69, 0.2)',
    whiteSpace: 'nowrap'
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
  
  submitMessage: {
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    border: '1px solid',
    fontSize: '1rem',
    fontWeight: '500'
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
  
  // File upload styles
  fileUploadContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  
  hiddenFileInput: {
    display: 'none'
  },
  
  fileUploadLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    border: '2px dashed #ddd',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: '#f8f9fa',
    color: '#666',
    fontWeight: '500'
  },
  
  imagePreviewContainer: {
    marginTop: '0.5rem'
  },
  
  imagePreviewThumb: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '4px',
    border: '1px solid #ddd'
  },
  
  pdfIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem',
    backgroundColor: '#e3f2fd',
    borderRadius: '4px',
    fontSize: '0.9rem',
    color: '#1976d2'
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
  
  // Preview styles
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
  
  pdfSection: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e9ecef'
  },
  
  pdfDownloadBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    backgroundColor: 'white',
    borderRadius: '6px',
    border: '1px solid #ddd',
    color: '#333'
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
  }
};
export default SubmitProject;