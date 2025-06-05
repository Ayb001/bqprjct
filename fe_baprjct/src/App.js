import React from 'react'
import Home from './pages/home'
import PrivacyPolicy from './pages/privacy_policy'
import TermsConditions from './pages/terms_conditions'
import Login from './pages/login'
import ForgotPassword from './pages/forgot_password'
import ProjectCatalog from './pages/project_catalog'
import ProjectDetailsPage from './pages/project_details_page'
import ChatBot from './pages/chat_bot'
import SubmitPage from './pages/submit_page'
import ArticlesPage from './pages/article_page' 
import ProjectCatalogPorteur from './pages/project_ctalog_porteur'
import PorteurDashboard from './pages/porteur_dashboard'
import AdminDashboard from './pages/admin_dashboard'
import FormPage from './pages/form_page'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <div>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          
          {/* Protected Routes */}
          <Route 
            path="/project_catalog" 
            element={
              <ProtectedRoute>
                <ProjectCatalog />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/project_details_page" 
            element={
              <ProtectedRoute>
                <ProjectDetailsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/chat_bot" 
            element={
              <ProtectedRoute>
                <ChatBot />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/submit_page" 
            element={
              <ProtectedRoute>
                <SubmitPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/article_page" 
            element={
              <ProtectedRoute>
                <ArticlesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/project_catalog_porteur" 
            element={
              <ProtectedRoute>
                <ProjectCatalogPorteur/>
              </ProtectedRoute>
            } 
          />
            <Route 
            path="/porteur_dashboard" 
            element={
              <ProtectedRoute>
                <PorteurDashboard/>
              </ProtectedRoute>
            } 
          />
            <Route 
            path="/admin_dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard/>
              </ProtectedRoute>
            } 
          />
            <Route 
            path="/form_page" 
            element={
              <ProtectedRoute>
                <FormPage/>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </div>
  )
}

export default App