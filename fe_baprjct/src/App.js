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
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/project_catalog" element={<ProjectCatalog />} />
          <Route path="/project_details_page/:id" element={<ProjectDetailsPage />} />
          <Route path="/chat_bot" element={<ChatBot />} />
          <Route path="/submit_page" element={<SubmitPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
