import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Google Maps API 스크립트 동적 로드
const loadGoogleMapsScript = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  if (apiKey && !window.google) {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }
}

loadGoogleMapsScript()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
