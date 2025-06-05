import React, { useState } from 'react';

const OnboardingForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Investment Profile
    investmentExperience: '',
    riskTolerance: '',
    investmentBudget: '',
    investmentTimeframe: '',
    
    // Sector Preferences
    preferredSectors: [],
    regionalFocus: [],
    projectTypes: [],
    
    // Goals and Motivations
    primaryGoals: [],
    secondaryMotivations: '',
    successMetrics: [],
    
    // Psychological Profile
    decisionMakingStyle: '',
    informationPreference: '',
    collaborationStyle: '',
    riskApproach: '',
    
    // Regional Knowledge
    draaFamiliarity: '',
    localConnections: '',
    culturalInterest: '',
    sustainabilityPriority: '',
    
    // Additional Preferences
    preferredCommunication: [],
    meetingPreference: '',
    followUpFrequency: '',
    additionalComments: ''
  });

  const totalSteps = 6;

  const sectors = [
    'Agriculture et Agro-industrie',
    'Tourisme et Écotourisme',
    'Énergie Renouvelable',
    'Santé et Bien-être',
    'Infrastructure et Construction',
    'Artisanat et Patrimoine',
    'Technologies et Innovation',
    'Commerce et Services',
    'Transport et Logistique',
    'Éducation et Formation'
  ];

  const regions = [
    'Ouarzazate',
    'Errachidia',
    'Midelt',
    'Tinghir',
    'Zagora',
    'Autres zones rurales',
    'Toute la région Drâa-Tafilalet'
  ];

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMultiSelect = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name].includes(value) 
        ? prev[name].filter(item => item !== value)
        : [...prev[name], value]
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Here you would send the data to your backend
    console.log('Form Data:', formData);
    alert('Profil créé avec succès ! Vous allez être redirigé vers la plateforme.');
    // Redirect to main platform
  };

  const renderStepIndicator = () => (
    <div style={styles.stepIndicator}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          style={{
            ...styles.stepDot,
            ...(i + 1 <= currentStep ? styles.stepDotActive : {})
          }}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div style={styles.stepContent}>
      <h2 style={styles.stepTitle}>📊 Votre Profil d'Investisseur</h2>
      <p style={styles.stepDescription}>
        Aidez-nous à mieux comprendre votre expérience et vos objectifs d'investissement
      </p>

      <div style={styles.questionGroup}>
        <label style={styles.questionLabel}>
          Quelle est votre expérience en investissement ?
        </label>
        <div style={styles.radioGroup}>
          {[
            'Débutant - Première fois',
            'Intermédiaire - Quelques investissements',
            'Expérimenté - Portefeuille diversifié',
            'Expert - Investisseur professionnel'
          ].map(option => (
            <label key={option} style={styles.radioOption}>
              <input
                type="radio"
                name="investmentExperience"
                value={option}
                checked={formData.investmentExperience === option}
                onChange={(e) => handleInputChange('investmentExperience', e.target.value)}
                style={styles.radioInput}
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      <div style={styles.questionGroup}>
        <label style={styles.questionLabel}>
          Quel est votre budget d'investissement prévu ?
        </label>
        <select
          value={formData.investmentBudget}
          onChange={(e) => handleInputChange('investmentBudget', e.target.value)}
          style={styles.selectInput}
        >
          <option value="">Sélectionnez votre budget</option>
          <option value="50k-100k">50 000 - 100 000 DH</option>
          <option value="100k-250k">100 000 - 250 000 DH</option>
          <option value="250k-500k">250 000 - 500 000 DH</option>
          <option value="500k-1M">500 000 DH - 1M DH</option>
          <option value="1M+">Plus de 1M DH</option>
        </select>
      </div>

      <div style={styles.questionGroup}>
        <label style={styles.questionLabel}>
          Quelle est votre tolérance au risque ?
        </label>
        <div style={styles.riskScale}>
          {[
            { value: 'conservateur', label: 'Conservateur', desc: 'Sécurité avant tout' },
            { value: 'modere', label: 'Modéré', desc: 'Équilibre risque/rendement' },
            { value: 'dynamique', label: 'Dynamique', desc: 'Accepte les fluctuations' },
            { value: 'speculatif', label: 'Spéculatif', desc: 'Recherche les hauts rendements' }
          ].map(risk => (
            <div
              key={risk.value}
              style={{
                ...styles.riskOption,
                ...(formData.riskTolerance === risk.value ? styles.riskOptionActive : {})
              }}
              onClick={() => handleInputChange('riskTolerance', risk.value)}
            >
              <div style={styles.riskLabel}>{risk.label}</div>
              <div style={styles.riskDesc}>{risk.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.questionGroup}>
        <label style={styles.questionLabel}>
          Votre horizon d'investissement ?
        </label>
        <div style={styles.radioGroup}>
          {[
            'Court terme (1-2 ans)',
            'Moyen terme (3-5 ans)',
            'Long terme (5-10 ans)',
            'Très long terme (10+ ans)'
          ].map(option => (
            <label key={option} style={styles.radioOption}>
              <input
                type="radio"
                name="investmentTimeframe"
                value={option}
                checked={formData.investmentTimeframe === option}
                onChange={(e) => handleInputChange('investmentTimeframe', e.target.value)}
                style={styles.radioInput}
              />
              {option}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div style={styles.stepContent}>
      <h2 style={styles.stepTitle}>🏢 Secteurs d'Intérêt</h2>
      <p style={styles.stepDescription}>
        Quels secteurs vous intéressent le plus pour vos investissements ?
      </p>

      <div style={styles.questionGroup}>
        <label style={styles.questionLabel}>
          Sélectionnez vos secteurs prioritaires (plusieurs choix possibles)
        </label>
        <div style={styles.sectorGrid}>
          {sectors.map(sector => (
            <div
              key={sector}
              style={{
                ...styles.sectorCard,
                ...(formData.preferredSectors.includes(sector) ? styles.sectorCardActive : {})
              }}
              onClick={() => handleMultiSelect('preferredSectors', sector)}
            >
              <div style={styles.sectorIcon}>
                {sector.includes('Agriculture') ? '🌾' :
                 sector.includes('Tourisme') ? '🏛️' :
                 sector.includes('Énergie') ? '☀️' :
                 sector.includes('Santé') ? '🏥' :
                 sector.includes('Infrastructure') ? '🏗️' :
                 sector.includes('Artisanat') ? '🎨' :
                 sector.includes('Technologies') ? '💻' :
                 sector.includes('Commerce') ? '🏪' :
                 sector.includes('Transport') ? '🚛' : '📚'}
              </div>
              <div style={styles.sectorName}>{sector}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.questionGroup}>
        <label style={styles.questionLabel}>
          Régions d'intérêt dans Drâa-Tafilalet
        </label>
        <div style={styles.checkboxGroup}>
          {regions.map(region => (
            <label key={region} style={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={formData.regionalFocus.includes(region)}
                onChange={() => handleMultiSelect('regionalFocus', region)}
                style={styles.checkboxInput}
              />
              {region}
            </label>
          ))}
        </div>
      </div>

      <div style={styles.questionGroup}>
        <label style={styles.questionLabel}>
          Types de projets préférés
        </label>
        <div style={styles.checkboxGroup}>
          {[
            'Projets innovants et technologiques',
            'Projets traditionnels éprouvés',
            'Projets à fort impact social',
            'Projets écologiques et durables',
            'Projets de grande envergure',
            'Petits projets locaux',
            'Projets collaboratifs',
            'Projets individuels'
          ].map(type => (
            <label key={type} style={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={formData.projectTypes.includes(type)}
                onChange={() => handleMultiSelect('projectTypes', type)}
                style={styles.checkboxInput}
              />
              {type}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div style={styles.stepContent}>
      <h2 style={styles.stepTitle}>🎯 Objectifs et Motivations</h2>
      <p style={styles.stepDescription}>
        Quels sont vos objectifs principaux avec cette plateforme ?
      </p>

      <div style={styles.questionGroup}>
        <label style={styles.questionLabel}>
          Vos objectifs principaux (plusieurs choix possibles)
        </label>
        <div style={styles.checkboxGroup}>
          {[
            'Générer des revenus réguliers',
            'Faire croître mon capital',
            'Diversifier mes investissements',
            'Contribuer au développement régional',
            'Soutenir l\'innovation locale',
            'Créer des emplois',
            'Préserver l\'environnement',
            'Acquérir de l\'expérience'
          ].map(goal => (
            <label key={goal} style={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={formData.primaryGoals.includes(goal)}
                onChange={() => handleMultiSelect('primaryGoals', goal)}
                style={styles.checkboxInput}
              />
              {goal}
            </label>
          ))}
        </div>
      </div>

      <div style={styles.questionGroup}>
        <label style={styles.questionLabel}>
          Qu'est-ce qui vous motive le plus dans l'investissement ?
        </label>
        <textarea
          value={formData.secondaryMotivations}
          onChange={(e) => handleInputChange('secondaryMotivations', e.target.value)}
          placeholder="Décrivez vos motivations personnelles..."
          style={styles.textareaInput}
          rows={4}
        />
      </div>

      <div style={styles.questionGroup}>
        <label style={styles.questionLabel}>
          Comment mesurez-vous le succès d'un investissement ?
        </label>
        <div style={styles.checkboxGroup}>
          {[
            'Retour sur investissement financier',
            'Impact social et communautaire',
            'Création d\'emplois locaux',
            'Innovation et développement technologique',
            'Durabilité environnementale',
            'Préservation culturelle',
            'Développement personnel',
            'Réputation et reconnaissance'
          ].map(metric => (
            <label key={metric} style={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={formData.successMetrics.includes(metric)}
                onChange={() => handleMultiSelect('successMetrics', metric)}
                style={styles.checkboxInput}
              />
              {metric}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div style={styles.stepContent}>
      <h2 style={styles.stepTitle}>🧠 Profil Psychologique</h2>
      <p style={styles.stepDescription}>
        Ces questions nous aident à personnaliser votre expérience sur la plateforme
      </p>

      <div style={styles.questionGroup}>
        <label style={styles.questionLabel}>
          Comment prenez-vous vos décisions d'investissement ?
        </label>
        <div style={styles.radioGroup}>
          {[
            'Analyse approfondie et recherche détaillée',
            'Intuition et feeling personnel',
            'Conseils d\'experts et recommandations',
            'Combinaison d\'analyse et d\'intuition'
          ].map(style => (
            <label key={style} style={styles.radioOption}>
              <input
                type="radio"
                name="decisionMakingStyle"
                value={style}
                checked={formData.decisionMakingStyle === style}
                onChange={(e) => handleInputChange('decisionMakingStyle', e.target.value)}
                style={styles.radioInput}
              />
              {style}
            </label>
          ))}
        </div>
      </div>

      <div style={styles.questionGroup}>
        <label style={styles.questionLabel}>
          Quel type d'information préférez-vous ?
        </label>
        <div style={styles.radioGroup}>
          {[
            'Données chiffrées et graphiques',
            'Descriptions détaillées et explications',
            'Témoignages et cas d\'usage',
            'Présentations visuelles et vidéos'
          ].map(pref => (
            <label key={pref} style={styles.radioOption}>
              <input
                type="radio"
                name="informationPreference"
                value={pref}
                checked={formData.informationPreference === pref}
                onChange={(e) => handleInputChange('informationPreference', e.target.value)}
                style={styles.radioInput}
              />
              {pref}
            </label>
          ))}
        </div>
      </div>

      <div style={styles.questionGroup}>
        <label style={styles.questionLabel}>
          Votre style de collaboration ?
        </label>
        <div style={styles.radioGroup}>
          {[
            'Préfère investir seul(e)',
            'Aime les petits groupes sélectionnés',
            'Ouvert(e) aux grandes communautés',
            'Flexible selon le projet'
          ].map(style => (
            <label key={style} style={styles.radioOption}>
              <input
                type="radio"
                name="collaborationStyle"
                value={style}
                checked={formData.collaborationStyle === style}
                onChange={(e) => handleInputChange('collaborationStyle', e.target.value)}
                style={styles.radioInput}
              />
              {style}
            </label>
          ))}
        </div>
      </div>

      <div style={styles.questionGroup}>
        <label style={styles.questionLabel}>
          Face à un risque, vous êtes plutôt :
        </label>
        <div style={styles.radioGroup}>
          {[
            'Prudent(e) - J\'évite les risques',
            'Calculateur(trice) - J\'évalue chaque risque',
            'Opportuniste - Je saisis les bonnes occasions',
            'Audacieux(se) - J\'aime relever les défis'
          ].map(approach => (
            <label key={approach} style={styles.radioOption}>
              <input
                type="radio"
                name="riskApproach"
                value={approach}
                checked={formData.riskApproach === approach}
                onChange={(e) => handleInputChange('riskApproach', e.target.value)}
                style={styles.radioInput}
              />
              {approach}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div style={styles.stepContent}>
      <h2 style={styles.stepTitle}>🏔️ Connaissance Régionale</h2>
      <p style={styles.stepDescription}>
        Votre familiarité avec la région Drâa-Tafilalet nous aide à mieux vous orienter
      </p>

      <div style={styles.questionGroup}>
        <label style={styles.questionLabel}>
          Quelle est votre connaissance de la région Drâa-Tafilalet ?
        </label>
        <div style={styles.radioGroup}>
          {[
            'Natif(ve) de la région',
            'J\'y vis depuis plusieurs années',
            'Je la visite régulièrement',
            'Je la connais peu mais elle m\'intéresse',
            'Première découverte'
          ].map(level => (
            <label key={level} style={styles.radioOption}>
              <input
                type="radio"
                name="draaFamiliarity"
                value={level}
                checked={formData.draaFamiliarity === level}
                onChange={(e) => handleInputChange('draaFamiliarity', e.target.value)}
                style={styles.radioInput}
              />
              {level}
            </label>
          ))}
        </div>
      </div>

      <div style={styles.questionGroup}>
        <label style={styles.questionLabel}>
          Avez-vous des connexions locales dans la région ?
        </label>
        <div style={styles.radioGroup}>
          {[
            'Réseau familial et amical étendu',
            'Quelques contacts professionnels',
            'Partenaires d\'affaires existants',
            'Contacts limités',
            'Aucune connexion actuelle'
          ].map(connection => (
            <label key={connection} style={styles.radioOption}>
              <input
                type="radio"
                name="localConnections"
                value={connection}
                checked={formData.localConnections === connection}
                onChange={(e) => handleInputChange('localConnections', e.target.value)}
                style={styles.radioInput}
              />
              {connection}
            </label>
          ))}
        </div>
      </div>

      <div style={styles.questionGroup}>
        <label style={styles.questionLabel}>
          Votre intérêt pour la culture et patrimoine locaux ?
        </label>
        <div style={styles.radioGroup}>
          {[
            'Très passionné(e) - C\'est prioritaire',
            'Intéressé(e) - Important dans mes choix',
            'Curieux(se) - J\'aimerais en apprendre plus',
            'Neutre - Ce n\'est pas un critère',
            'Peu intéressé(e) - Focus sur le business'
          ].map(interest => (
            <label key={interest} style={styles.radioOption}>
              <input
                type="radio"
                name="culturalInterest"
                value={interest}
                checked={formData.culturalInterest === interest}
                onChange={(e) => handleInputChange('culturalInterest', e.target.value)}
                style={styles.radioInput}
              />
              {interest}
            </label>
          ))}
        </div>
      </div>

      <div style={styles.questionGroup}>
        <label style={styles.questionLabel}>
          Importance de la durabilité environnementale ?
        </label>
        <div style={styles.riskScale}>
          {[
            { value: 'essentiel', label: 'Essentiel', desc: 'Critère non négociable' },
            { value: 'important', label: 'Important', desc: 'Influence mes décisions' },
            { value: 'consideré', label: 'Considéré', desc: 'Un plus appréciable' },
            { value: 'secondaire', label: 'Secondaire', desc: 'Pas prioritaire' }
          ].map(priority => (
            <div
              key={priority.value}
              style={{
                ...styles.riskOption,
                ...(formData.sustainabilityPriority === priority.value ? styles.riskOptionActive : {})
              }}
              onClick={() => handleInputChange('sustainabilityPriority', priority.value)}
            >
              <div style={styles.riskLabel}>{priority.label}</div>
              <div style={styles.riskDesc}>{priority.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div style={styles.stepContent}>
      <h2 style={styles.stepTitle}>📞 Préférences de Communication</h2>
      <p style={styles.stepDescription}>
        Comment souhaitez-vous être accompagné sur la plateforme ?
      </p>

      <div style={styles.questionGroup}>
        <label style={styles.questionLabel}>
          Vos canaux de communication préférés (plusieurs choix possibles)
        </label>
        <div style={styles.checkboxGroup}>
          {[
            'Email',
            'SMS',
            'Appels téléphoniques',
            'Messages sur la plateforme',
            'WhatsApp',
            'Réunions en personne',
            'Visioconférence',
            'Notifications push'
          ].map(channel => (
            <label key={channel} style={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={formData.preferredCommunication.includes(channel)}
                onChange={() => handleMultiSelect('preferredCommunication', channel)}
                style={styles.checkboxInput}
              />
              {channel}
            </label>
          ))}
        </div>
      </div>

      <div style={styles.questionGroup}>
        <label style={styles.questionLabel}>
          Type de rendez-vous préféré
        </label>
        <div style={styles.radioGroup}>
          {[
            'Rendez-vous en personne uniquement',
            'Visioconférence privilégiée',
            'Mélange selon la situation',
            'Échanges écrits suffisants'
          ].map(pref => (
            <label key={pref} style={styles.radioOption}>
              <input
                type="radio"
                name="meetingPreference"
                value={pref}
                checked={formData.meetingPreference === pref}
                onChange={(e) => handleInputChange('meetingPreference', e.target.value)}
                style={styles.radioInput}
              />
              {pref}
            </label>
          ))}
        </div>
      </div>

      <div style={styles.questionGroup}>
        <label style={styles.questionLabel}>
          Fréquence de suivi souhaitée
        </label>
        <div style={styles.radioGroup}>
          {[
            'Hebdomadaire - Suivi régulier',
            'Bi-mensuel - Équilibre optimal',
            'Mensuel - Points d\'étape',
            'Trimestriel - Vue d\'ensemble',
            'À la demande - Selon mes besoins'
          ].map(freq => (
            <label key={freq} style={styles.radioOption}>
              <input
                type="radio"
                name="followUpFrequency"
                value={freq}
                checked={formData.followUpFrequency === freq}
                onChange={(e) => handleInputChange('followUpFrequency', e.target.value)}
                style={styles.radioInput}
              />
              {freq}
            </label>
          ))}
        </div>
      </div>

      <div style={styles.questionGroup}>
        <label style={styles.questionLabel}>
          Commentaires additionnels (optionnel)
        </label>
        <textarea
          value={formData.additionalComments}
          onChange={(e) => handleInputChange('additionalComments', e.target.value)}
          placeholder="Partagez tout autre information qui pourrait nous aider à mieux vous accompagner..."
          style={styles.textareaInput}
          rows={4}
        />
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      default: return renderStep1();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <div style={styles.header}>
            <div style={styles.logoSection}>
              <div style={styles.logo}>🏛️</div>
              <div>
                <h1 style={styles.title}>Bienvenue sur BanqueProject</h1>
                <p style={styles.subtitle}>Créons ensemble votre profil d'investisseur</p>
              </div>
            </div>
            {renderStepIndicator()}
          </div>

          <div style={styles.content}>
            {renderCurrentStep()}
          </div>

          <div style={styles.footer}>
            <div style={styles.progressInfo}>
              Étape {currentStep} sur {totalSteps}
            </div>
            <div style={styles.buttonGroup}>
              {currentStep > 1 && (
                <button style={styles.prevButton} onClick={prevStep}>
                  ← Précédent
                </button>
              )}
              {currentStep < totalSteps ? (
                <button style={styles.nextButton} onClick={nextStep}>
                  Suivant →
                </button>
              ) : (
                <button style={styles.submitButton} onClick={handleSubmit}>
                  🚀 Finaliser mon profil
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    fontFamily: 'Arial, sans-serif'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(139, 69, 19, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem'
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '800px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 40px rgba(139, 69, 19, 0.2)',
    border: '3px solid #8B4513'
  },
  header: {
    padding: '2rem',
    borderBottom: '2px solid #f0f0f0',
    backgroundColor: '#8B4513',
    color: 'white',
    borderRadius: '17px 17px 0 0'
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  logo: {
    fontSize: '3rem',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: '1rem',
    borderRadius: '12px'
  },
  title: {
    margin: '0',
    fontSize: '1.8rem',
    fontWeight: 'bold'
  },
  subtitle: {
    margin: '0.5rem 0 0 0',
    fontSize: '1rem',
    opacity: 0.9
  },
  stepIndicator: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem'
  },
  stepDot: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1rem',
    transition: 'all 0.3s'
  },
  stepDotActive: {
    backgroundColor: 'white',
    color: '#8B4513'
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '0'
  },
  stepContent: {
    padding: '2rem',
    maxHeight: '60vh',
    overflow: 'auto'
  },
  stepTitle: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: '0.5rem',
    textAlign: 'center'
  },
  stepDescription: {
    fontSize: '1rem',
    color: '#666',
    textAlign: 'center',
    marginBottom: '2rem',
    lineHeight: '1.5'
  },
  questionGroup: {
    marginBottom: '2rem'
  },
  questionLabel: {
    display: 'block',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '1rem'
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  radioOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    border: '2px solid transparent'
  },
  radioInput: {
    margin: '0',
    accentColor: '#8B4513'
  },
  checkboxGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '0.75rem'
  },
  checkboxOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  checkboxInput: {
    margin: '0',
    accentColor: '#8B4513'
  },
  selectInput: {
    width: '100%',
    padding: '1rem',
    fontSize: '1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: 'white',
    color: '#333'
  },
  textareaInput: {
    width: '100%',
    padding: '1rem',
    fontSize: '1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: 'white',
    color: '#333',
    resize: 'vertical',
    fontFamily: 'Arial, sans-serif'
  },
  riskScale: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  riskOption: {
    padding: '1.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    border: '2px solid transparent',
    textAlign: 'center'
  },
  riskOptionActive: {
    backgroundColor: '#8B4513',
    color: 'white',
    borderColor: '#8B4513'
  },
  riskLabel: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem'
  },
  riskDesc: {
    fontSize: '0.9rem',
    opacity: 0.8
  },
  sectorGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  sectorCard: {
    padding: '1.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    border: '2px solid transparent',
    textAlign: 'center'
  },
  sectorCardActive: {
    backgroundColor: '#8B4513',
    color: 'white',
    borderColor: '#8B4513'
  },
  sectorIcon: {
    fontSize: '2rem',
    marginBottom: '0.5rem'
  },
  sectorName: {
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  footer: {
    padding: '1.5rem 2rem',
    borderTop: '2px solid #f0f0f0',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '0 0 17px 17px'
  },
  progressInfo: {
    fontSize: '0.9rem',
    color: '#666'
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem'
  },
  prevButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'white',
    color: '#8B4513',
    border: '2px solid #8B4513',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.3s'
  },
  nextButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#8B4513',
    color: 'white',
    border: '2px solid #8B4513',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.3s'
  },
  submitButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: '2px solid #28a745',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'all 0.3s'
  }
};

export default OnboardingForm;