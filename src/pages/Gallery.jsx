import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { galleryItems } from '../data/gallery'
import '../App.css'

function Gallery() {
  const navigate = useNavigate()
  const sortedGalleryItems = useMemo(
    () =>
      [...galleryItems].sort((a, b) => {
        const dateA = new Date(a.date.replace(/\./g, '-'))
        const dateB = new Date(b.date.replace(/\./g, '-'))
        return dateB - dateA
      }),
    []
  )

  const handleItemClick = (itemId) => {
    navigate(`/gallery/${itemId}`)
  }

  // 페이지 로드 시 상단으로 스크롤
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <div className="page">
      <header className="lab-header">
        <div className="brand-area">
          <img
            src="/images/Yu.svg"
            alt="YU Intelligence Networking Lab"
            className="brand-logo"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          />
          <div>
            <p>Intelligence Networking Lab</p>
            <span>영남대학교 지능형 네트워크 연구실</span>
          </div>
        </div>
        <nav className="main-nav">
          <button onClick={() => navigate('/')}>Home</button>
          <button onClick={() => navigate('/news')}>News</button>
          <button className="active">Gallery</button>
          <button onClick={() => {
            navigate('/')
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                window.location.hash = 'members'
              })
            })
          }}>Members</button>
          <button onClick={() => {
            navigate('/')
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                window.location.hash = 'publication'
              })
            })
          }}>Publication</button>
          <button onClick={() => {
            navigate('/')
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                window.location.hash = 'contact'
              })
            })
          }}>Contact</button>
        </nav>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <section className="news">
          <div className="news-header">
            <h2>Gallery</h2>
          </div>
          <div className="posts-list">
            {sortedGalleryItems.map((item) => (
              <article
                key={item.id}
                className="post-card"
                onClick={() => handleItemClick(item.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="post-image">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="post-content">
                  <h3>{item.title}</h3>
                  <p className="post-text">{item.content}</p>
                  <div className="post-meta">
                    <span className="post-author">{item.author}</span>
                    <span className="post-date">{item.date}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </motion.main>

      <footer className="footer">
        <div>
          <p className="brand">YU Intelligence Networking Lab</p>
          <p>경상북도 경산시 대학로 280, 영남대학교 IT관 210호</p>
        </div>
        <span>© {new Date().getFullYear()} Intelligence Networking Lab</span>
      </footer>
    </div>
  )
}

export default Gallery
