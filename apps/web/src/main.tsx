import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { TemplatesModalProvider } from './context/TemplatesModalContext'
import './styles/globals.css'
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import AppRoutes from './routes/AppRoutes';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TemplatesModalProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TemplatesModalProvider>
    </QueryClientProvider>
  </React.StrictMode>
)