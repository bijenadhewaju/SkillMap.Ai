import React, { StrictMode } from 'react'
import ReactDOM, { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <AuthProvider>
        <App />
    </AuthProvider>
  </StrictMode>,
)
