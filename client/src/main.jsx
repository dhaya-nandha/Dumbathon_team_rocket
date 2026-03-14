import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { CaptchaProvider } from './context/CaptchaContext'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CaptchaProvider>
        <App />
      </CaptchaProvider>
    </BrowserRouter>
  </StrictMode>,
);
