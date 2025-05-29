import React, { useState } from 'react';

const Login = () => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = 'http://localhost:8080/api/api/auth';

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
          username: loginData.username,
          password: loginData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store JWT token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          username: data.username,
          email: data.email,
          role: data.role
        }));
        
        setMessage('Connexion réussie! Redirection...');
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        setMessage(data.error || 'Nom d\'utilisateur ou mot de passe incorrect');
      }
    } catch (err) {
      setMessage('Erreur de connexion. Vérifiez que le serveur est en marche.');
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
        // Store JWT token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          username: data.username,
          email: data.email,
          role: data.role
        }));
        
        setMessage('Inscription réussie! Redirection...');
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        setMessage(data.error || 'Erreur lors de l\'inscription');
      }
    } catch (err) {
      setMessage('Erreur de connexion. Vérifiez que le serveur est en marche.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
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
            <div className="login-form">
              <div className="login-title">Connexion</div>
              
              {/* Message Display */}
              {message && (
                <div className={`login-message ${message.includes('réussie') ? 'success' : 'error'}`}>
                  {message}
                </div>
              )}
              
              <form onSubmit={handleLoginSubmit}>
                <div className="login-input-boxes">
                  <div className="login-input-box">
                    <i className="fas fa-user"></i>
                    <input 
                      type="text" 
                      placeholder="Nom d'utilisateur" 
                      value={loginData.username}
                      onChange={(e) => setLoginData({...loginData, username: e.target.value})}
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
            
            <div className="login-signup-form">
              <div className="login-title">Créer un compte</div>
              
              {/* Message Display */}
              {message && (
                <div className={`login-message ${message.includes('réussie') ? 'success' : 'error'}`}>
                  {message}
                </div>
              )}
              
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
                      placeholder="Entrez votre mot de passe" 
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                      required 
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
    </div>
  );
};

export default Login;