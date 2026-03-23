import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { dummyPosts } from './News'
import '../App.css'

function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const post = dummyPosts.find((p) => p.id === parseInt(id))

  // 페이지 로드 시 상단으로 스크롤
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
    return () => clearTimeout(timer)
  }, [id])

  if (!post) {
    return (
      <div className="page">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>게시글을 찾을 수 없습니다.</h2>
          <button onClick={() => navigate('/news')} className="write-btn" style={{ marginTop: '1rem' }}>
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
          <button className="back-btn" onClick={() => navigate('/news')}>
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
                  <h1>{post.title}</h1>
                  <div className="post-detail-meta">
                    <span className="post-author">{post.author}</span>
                    <span className="post-date">{post.date}</span>
                  </div>
                </div>
                {(post.images || (post.image ? [post.image] : [])).map((imageSrc, index) => (
                  <div key={`${post.id}-${index}`} className="post-detail-image">
                    <img src={imageSrc} alt={`${post.title} ${index + 1}`} />
                  </div>
                ))}
                <div className="post-detail-body">
                  <p className="post-detail-text">{post.fullContent || post.content}</p>
                </div>
                {Array.isArray(post.attachments) && post.attachments.length > 0 && (
                  <div className="post-attachments">
                    <h3 className="post-attachments-title">첨부파일</h3>
                    <div className="post-attachments-list">
                      {post.attachments.map((file) => (
                        (() => {
                          // 첨부파일명(원문 한글)을 그대로 사용하되,
                          // URL에서는 정확한 인코딩을 적용해 서버/브라우저 경로 해석 문제를 줄입니다.
                          const downloadName = file?.filename || ''
                          const href =
                            typeof downloadName === 'string' && downloadName.length > 0
                              ? `/files/${encodeURIComponent(downloadName)}`
                              : file?.url
                          const shouldDownload = typeof href === 'string' && href.startsWith('/files/')

                          return (
                        <a
                          key={file.url}
                          className="post-attachment-card"
                          href={href}
                          download={shouldDownload ? (downloadName || true) : undefined}
                          target={shouldDownload ? undefined : '_blank'}
                          rel={shouldDownload ? undefined : 'noreferrer'}
                        >
                          <div className="post-attachment-name">{file.title || file.filename}</div>
                          {file.filename && (
                            <div className="post-attachment-meta">{file.filename}</div>
                          )}
                        </a>
                          )
                        })()
                      ))}
                    </div>
                  </div>
                )}
              </motion.article>
            </AnimatePresence>
            <aside className="post-list-sidebar">
              <h3>게시글 목록</h3>
              <div className="sidebar-posts">
                {dummyPosts.map((p) => (
                  <div
                    key={p.id}
                    className={`sidebar-post-item ${p.id === post.id ? 'active' : ''}`}
                    onClick={() => navigate(`/news/${p.id}`)}
                  >
                    <div className="sidebar-post-image">
                      <img src={p.image} alt={p.title} />
                    </div>
                    <div className="sidebar-post-info">
                      <h4>{p.title}</h4>
                      <div className="sidebar-post-meta">
                        <span>{p.date}</span>
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

export default PostDetail

