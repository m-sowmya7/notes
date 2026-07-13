import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { TemplatesModalProvider } from './context/TemplatesModalContext'
import './styles/globals.css'
import AppRoutes from './routes/AppRoutes';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TemplatesModalProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
    </TemplatesModalProvider>
  </React.StrictMode>
)