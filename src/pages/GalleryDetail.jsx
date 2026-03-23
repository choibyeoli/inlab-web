import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { galleryItems } from '../data/gallery'
import '../App.css'

function GalleryDetail() {
  const { id } = useParams()
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
  const item = sortedGalleryItems.find((g) => g.id === parseInt(id, 10))

  // 페이지 로드 시 상단으로 스크롤
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
    return () => clearTimeout(timer)
  }, [id])

  if (!item) {
    return (
      <div className="page">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>갤러리 항목을 찾을 수 없습니다.</h2>
          <button onClick={() => navigate('/gallery')} className="write-btn" style={{ marginTop: '1rem' }}>
            목록으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

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
          <button onClick={() => navigate('/gallery')}>Gallery</button>
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

      <main>
        <section className="post-detail">
          <button className="back-btn" onClick={() => navigate('/gallery')}>
            ← 목록으로
          </button>
          <div className="post-detail-layout">
            <AnimatePresence mode="wait">
              <motion.article
                key={id}
                className="post-detail-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <div className="post-detail-header">
                  <h1>{item.title}</h1>
                  <div className="post-detail-meta">
                    <span className="post-author">{item.author}</span>
                    <span className="post-date">{item.date}</span>
                  </div>
                </div>
                {(item.images || [item.image]).map((imageSrc, index) => (
                  <div key={`${item.id}-${index}`} className="post-detail-image">
                    <img src={imageSrc} alt={`${item.title} ${index + 1}`} />
                  </div>
                ))}
                <div className="post-detail-body">
                  <p className="post-detail-text">{item.fullContent || item.content}</p>
                </div>
              </motion.article>
            </AnimatePresence>
            <aside className="post-list-sidebar">
              <h3>갤러리 목록</h3>
              <div className="sidebar-posts">
                {sortedGalleryItems.map((g) => (
                  <div
                    key={g.id}
                    className={`sidebar-post-item ${g.id === item.id ? 'active' : ''}`}
                    onClick={() => navigate(`/gallery/${g.id}`)}
                  >
                    <div className="sidebar-post-image">
                      <img src={g.image} alt={g.title} />
                    </div>
                    <div className="sidebar-post-info">
                      <h4>{g.title}</h4>
                      <div className="sidebar-post-meta">
                        <span>{g.author}</span>
                        <span>{g.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>
      </main>

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

export default GalleryDetail
