import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    
    // Simulate API call - replace with your actual API call
    setTimeout(() => {
      setMessage('Un lien de réinitialisation a été envoyé à votre adresse e-mail.');
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-cover">
          <img src="/images/forgotImg.jpg" alt="" />
          <div className="forgot-password-text">
            <span className="forgot-password-text-1">Mot de passe oublié ?</span>
            <span className="forgot-password-text-2">
              Pas de problème ! Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </span>
          </div>
        </div>

        <div className="forgot-password-forms">
          <div className="forgot-password-form-content">
            <div className="forgot-password-form">
              <div className="forgot-password-title">Réinitialisation</div>
              <div className="forgot-password-subtitle">
                Entrez votre adresse e-mail pour recevoir un lien de réinitialisation de mot de passe.
              </div>
              
              <div className="forgot-password-input-boxes">
                <div className="forgot-password-input-box">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    placeholder="Entrez votre e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="forgot-password-button forgot-password-input-box">
                  <input
                    type="button"
                    value={isLoading ? 'Envoi en cours...' : 'Envoyer le lien'}
                    disabled={isLoading}
                    onClick={handleSubmit}
                  />
                </div>

                {message && (
                  <div className={`forgot-password-message ${message.includes('envoyé') ? 'success' : 'error'}`}>
                    {message}
                  </div>
                )}

                <div className="forgot-password-text forgot-password-back-text">
                  <a href="/login">← Retour à la connexion</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;