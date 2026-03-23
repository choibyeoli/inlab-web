import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { publications } from '../data/publications'
import '../App.css'

function Publications() {
  const navigate = useNavigate()

  // SPA 환경(특히 iOS)에서 이전 스크롤 위치가 복원되는 경우가 있어
  // 페이지 진입 시 상단으로 고정합니다.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])
  const groupedByYear = publications.reduce((acc, pub) => {
    const year = pub.date.slice(0, 4)
    let group = acc.find((g) => g.year === year)
    if (!group) {
      group = { year, items: [] }
      acc.push(group)
    }
    group.items.push(pub)
    return acc
  }, [])

  return (
    <div className="page">
      <div className="main-nav-row">
        <nav className="main-nav main-nav-inline">
          <button onClick={() => navigate('/')}>Home</button>
          <button onClick={() => navigate('/news')}>News</button>
          <button onClick={() => navigate('/gallery')}>Gallery</button>
          <button onClick={() => navigate('/#members')}>Members</button>
          <button onClick={() => navigate('/#publication')}>Publication</button>
          <button onClick={() => navigate('/#contact')}>Contact</button>
        </nav>
      </div>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <section className="publication-page">
          <header className="publication-page-header">
            <h1>Publications</h1>
          </header>

          <div className="pub-timeline">
            {groupedByYear.map((group) => (
              <div key={group.year} className="pub-year-group">
                <div className="pub-year-col">
                  <span className="pub-year-label">{group.year}</span>
                </div>
                <div className="pub-year-list">
                  {group.items.map((pub, index) => {
                    const Wrapper = pub.link ? 'a' : 'div'
                    const wrapperProps = pub.link
                      ? {
                          href: pub.link,
                          target: '_blank',
                          rel: 'noreferrer'
                        }
                      : {}

                    return (
                      <Wrapper
                        key={pub.id}
                        className={`publication-item pub-timeline-card ${
                          pub.link ? 'pub-entry-clickable' : ''
                        }`}
                        {...wrapperProps}
                      >
                        <span className="pub-badge">{pub.type}</span>
                        <div className="pub-text">
                          <p className="pub-title">{pub.title}</p>
                          <p className="pub-meta">{pub.authors}</p>
                          <p className="pub-meta">{pub.venue}</p>
                          {pub.extra && <p className="pub-meta">{pub.extra}</p>}
                        </div>
                      </Wrapper>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </motion.main>
    </div>
  )
}

export default Publications

