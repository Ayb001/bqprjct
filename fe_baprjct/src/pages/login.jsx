import React from 'react';

const Login = () => {
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
              <form action="#">
                <div className="login-input-boxes">
                  <div className="login-input-box">
                    <i className="fas fa-envelope"></i>
                    <input type="text" placeholder="Entrez votre e-mail" required />
                  </div>
                  <div className="login-input-box">
                    <i className="fas fa-lock"></i>
                    <input type="password" placeholder="Entrez votre mot de passe" required />
                  </div>
                  <div className="login-text"><a href="#">Mot de passe oublié ?</a></div>
                  <div className="login-button login-input-box">
                    <input type="submit" value="Submit" />
                  </div>
                  <div className="login-text login-sign-up-text">Vous n'avez pas de compte ? <label htmlFor="login-flip">Inscrivez-vous maintenant</label></div>
                </div>
              </form>
            </div>
            <div className="login-signup-form">
              <div className="login-title">Créer un compte</div>
              <form action="#">
                <div className="login-input-boxes">
                  <div className="login-input-box">
                    <i className="fas fa-user"></i>
                    <input type="text" placeholder="Entrez votre nom" required />
                  </div>
                  <div className="login-input-box">
                    <i className="fas fa-envelope"></i>
                    <input type="text" placeholder="Entrez votre adresse e-mail" required />
                  </div>
                  <div className="login-input-box">
                    <i className="fas fa-lock"></i>
                    <input type="password" placeholder="Entrez votre mot de passe" required />
                  </div>
                  <div className="login-button login-input-box">
                    <input type="submit" value="Submit" />
                  </div>
                  <div className="login-text login-sign-up-text">Vous avez déjà un compte ?<label htmlFor="login-flip">Connectez-vous</label></div>
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