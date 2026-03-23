import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import News from './pages/News'
import Gallery from './pages/Gallery'
import GalleryDetail from './pages/GalleryDetail'
import PostDetail from './pages/PostDetail'
import Admin from './pages/Admin'
import Publications from './pages/Publications'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/gallery/:id" element={<GalleryDetail />} />
        <Route path="/news/:id" element={<PostDetail />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/publications" element={<Publications />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

export default App
