import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'
  const [loading, setLoading] = useState(false);

  // 🚨 FIXED API URL
  const API_BASE_URL = 'http://localhost:8080/api/auth';

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    
    // Auto-hide message after 5 seconds
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  // 🆕 UPDATED: Role-based redirection function
  const getRedirectPath = (role) => {
    switch (role.toUpperCase()) {
      case 'ADMIN':
      case 'PORTEUR':
        return '/project_catalog_porteur';
      case 'USER':
      case 'INVESTISSEUR':
      default:
        return '/project_catalog';
    }
  };

  // 🆕 UPDATED: Get user-friendly role display name
  const getRoleDisplayName = (role) => {
    switch (role.toUpperCase()) {
      case 'ADMIN':
        return 'espace administrateur';
      case 'PORTEUR':
        return 'espace porteur de projet';
      case 'USER':
      case 'INVESTISSEUR':
      default:
        return 'catalogue des projets';
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store JWT token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          username: data.username,
          email: data.email,
          role: data.role
        }));
        
        // 🆕 UPDATED: Get redirect path and display name
        const redirectPath = getRedirectPath(data.role);
        const roleDisplay = getRoleDisplayName(data.role);
        
        showMessage(
          `🎉 Bienvenue ${data.username}! Redirection vers ${roleDisplay}...`, 
          'success'
        );
        
        // Clear form
        setLoginData({ email: '', password: '' });
        
        // 🆕 UPDATED: Redirect based on user role
        setTimeout(() => {
          navigate(redirectPath);
        }, 2000);
      } else {
        // Show specific error messages
        if (data.error && data.error.includes('Invalid')) {
          showMessage('❌ Adresse e-mail ou mot de passe incorrect. Veuillez réessayer.', 'error');
        } else {
          showMessage(`❌ ${data.error || 'Erreur de connexion'}`, 'error');
        }
      }
    } catch (err) {
      showMessage('🔌 Erreur de connexion au serveur. Vérifiez votre connexion internet.', 'error');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: registerData.username,
          email: registerData.email,
          password: registerData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 🔐 SECURITY IMPROVEMENT: Don't auto-login after registration
        // Clear the registration form
        setRegisterData({ username: '', email: '', password: '' });
        
        showMessage(
          `🎊 Compte créé avec succès! Vous pouvez maintenant vous connecter avec vos identifiants.`, 
          'success'
        );
        
        // 🔄 Switch back to login form after successful registration
        setTimeout(() => {
          const checkbox = document.getElementById('login-flip');
          if (checkbox) {
            checkbox.checked = false; // Switch back to login form
          }
          showMessage('👆 Veuillez vous connecter avec vos nouveaux identifiants.', 'info');
        }, 3000);
        
      } else {
        // Show specific error messages
        if (data.error && data.error.includes('Username')) {
          showMessage('👤 Ce nom d\'utilisateur est déjà pris. Choisissez-en un autre.', 'error');
        } else if (data.error && data.error.includes('Email')) {
          showMessage('📧 Cette adresse e-mail est déjà utilisée.', 'error');
        } else {
          showMessage(`❌ ${data.error || 'Erreur lors de l\'inscription'}`, 'error');
        }
      }
    } catch (err) {
      showMessage('🔌 Erreur de connexion au serveur. Vérifiez votre connexion internet.', 'error');
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Beautiful Message Popup */}
      {message && (
        <div className={`message-popup ${messageType} ${message ? 'show' : ''}`}>
          <div className="message-content">
            <span className="message-text">{message}</span>
            <button 
              className="message-close" 
              onClick={() => {setMessage(''); setMessageType('');}}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="login-container">
        <input type="checkbox" id="login-flip" />
        <div className="login-cover">
          <div className="login-front">
            <img src="/images/frontImg.jpg" alt="" />
            <div className="login-text">
              <span className="login-text-1">Révélons le potentiel de <br/> Drâa-Tafilalet.</span>
              <span className="login-text-2">Connectez-vous aux opportunités qui transforment notre région.</span>
            </div>
          </div>
          <div className="login-back">
            <img className="backImg" src="/images/backImg.jpg" alt="" />
            <div className="login-text">
              <span className="login-text-1">Réalisez de grandes choses<br /> en commençant aujourd'hui</span>
              <span className="login-text-2">Lancez-vous dès maintenant</span>
            </div>
          </div>
        </div>
        <div className="login-forms">
          <div className="login-form-content">
            {/* LOGIN FORM */}
            <div className="login-form">
              <div className="login-title">Connexion</div>
              
              <form onSubmit={handleLoginSubmit}>
                <div className="login-input-boxes">
                  <div className="login-input-box">
                    <i className="fas fa-envelope"></i>
                    <input 
                      type="email" 
                      placeholder="Adresse e-mail" 
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="login-input-box">
                    <i className="fas fa-lock"></i>
                    <input 
                      type="password" 
                      placeholder="Entrez votre mot de passe" 
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="login-text"><a href="/forgot_password">Mot de passe oublié ?</a></div>
                  <div className="login-button login-input-box">
                    <input 
                      type="submit" 
                      value={loading ? 'Connexion...' : 'Se connecter'} 
                      disabled={loading}
                    />
                  </div>
                  <div className="login-text login-sign-up-text">
                    Vous n'avez pas de compte ? <label htmlFor="login-flip">Inscrivez-vous maintenant</label>
                  </div>
                </div>
              </form>
            </div>
            
            {/* REGISTRATION FORM */}
            <div className="login-signup-form">
              <div className="login-title">Créer un compte</div>
              <div className="login-subtitle">
                🔐 Après inscription, vous devrez vous connecter manuellement pour des raisons de sécurité.
              </div>
              
              <form onSubmit={handleRegisterSubmit}>
                <div className="login-input-boxes">
                  <div className="login-input-box">
                    <i className="fas fa-user"></i>
                    <input 
                      type="text" 
                      placeholder="Nom d'utilisateur" 
                      value={registerData.username}
                      onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                      required 
                      minLength="3"
                    />
                  </div>
                  <div className="login-input-box">
                    <i className="fas fa-envelope"></i>
                    <input 
                      type="email" 
                      placeholder="Entrez votre adresse e-mail" 
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="login-input-box">
                    <i className="fas fa-lock"></i>
                    <input 
                      type="password" 
                      placeholder="Entrez votre mot de passe (min. 6 caractères)" 
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                      required 
                      minLength="6"
                    />
                  </div>
                  <div className="login-button login-input-box">
                    <input 
                      type="submit" 
                      value={loading ? 'Inscription...' : 'S\'inscrire'} 
                      disabled={loading}
                    />
                  </div>
                  <div className="login-text login-sign-up-text">
                    Vous avez déjà un compte ? <label htmlFor="login-flip">Connectez-vous</label>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Beautiful Message Popup Styles */}
      <style jsx>{`
        .message-popup {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
          min-width: 300px;
          max-width: 500px;
          padding: 0;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          opacity: 0;
          transform: translateX(400px);
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .message-popup.show {
          opacity: 1;
          transform: translateX(0);
        }

        .message-popup.success {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .message-popup.error {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
        }

        .message-popup.info {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
        }

        .message-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
        }

        .message-text {
          font-size: 15px;
          font-weight: 500;
          line-height: 1.4;
          flex: 1;
          margin-right: 12px;
        }

        .message-close {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .message-close:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .login-subtitle {
          font-size: 12px;
          color: #666;
          text-align: center;
          margin-bottom: 15px;
          padding: 8px;
          background: #f8f9fa;
          border-radius: 6px;
          border-left: 3px solid #007bff;
        }

        @media (max-width: 768px) {
          .message-popup {
            top: 10px;
            right: 10px;
            left: 10px;
            min-width: auto;
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;