import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import '../App.css'

const parseDateMs = (dateStr) => {
  const d = new Date((dateStr || '').replace(/\./g, '-'))
  return d.getTime()
}

const dummyPosts = [
  {
    id: 3,
    title: '학부 연구생 신규 모집',
    content:
      '영남대학교 지능형 네트워크 연구실에서 학부 연구생을 모집합니다.',
    fullContent: `영남대학교 지능형 네트워크 연구실에서 학부 연구생을 모집합니다.

첨부된 파일을 양식에 맞추어 network@yu.ac.kr로 제출 바랍니다.
메일 제목: 학번_이름_학부 연구생 지원 서류 제출
파일 제목: 학번_이름.hwpx
유의사항: 지정된 양식 미준수 시 선발에서 자동으로 제외됩니다.

관련 문의: network@yu.ac.kr`,
    author: 'Intelligence Networking Lab',
    date: '2026.03.20',
    views: 1,
    image: '/images/ug-recruit-2026.png',
    images: ['/images/ug-recruit-2026.png'],
    attachments: [
      {
        title: '지능형 네트워크 연구실 학부연구생 지원서',
        filename: '지능형 네트워크 연구실 학부연구생 지원서.hwpx',
        url: '/files/%E1%84%8C%E1%85%B5%E1%84%82%E1%85%B3%E1%86%BC%E1%84%92%E1%85%A7%E1%86%BC%20%E1%84%82%E1%85%A6%E1%84%90%E1%85%B3%E1%84%8B%E1%85%AF%E1%84%8F%E1%85%B3%20%E1%84%8B%E1%85%A7%E1%86%AB%E1%84%80%E1%85%AE%E1%84%89%E1%85%B5%E1%86%AF%20%E1%84%92%E1%85%A1%E1%86%A8%E1%84%87%E1%85%AE%E1%84%8B%E1%85%A7%E1%86%AB%E1%84%80%E1%85%AE%E1%84%89%E1%85%A2%E1%86%BC%20%E1%84%8C%E1%85%B5%E1%84%8B%E1%85%AF%E1%86%AB%E1%84%89%E1%85%A5.hwpx'
      }
    ]
  },
  {
    id: 1,
    title: '2025 한국통신학회 추계학술대회',
    content:
      '2025년도 한국통신학회 추계종합학술발표회에 연구실 구성원이 참석하여 연구 성과를 공유하고 네트워크 연구 동향을 논의했습니다.',
    fullContent: `2025년도 한국통신학회 추계종합학술발표회에 연구실 구성원이 참석하여 연구 성과를 공유하고 최신 네트워크 연구 동향을 논의했습니다.

학술대회 기간 동안 세션 발표와 포스터 발표를 통해 무선 통신, 네트워크 최적화, AI 기반 네트워킹 등 다양한 주제의 연구 결과를 소개했으며,
국내외 연구자들과의 교류를 통해 공동 연구 및 협력 가능성을 모색했습니다.

앞으로도 국내외 학술대회 참여를 통해 연구실의 연구 성과를 지속적으로 확산하고, 산업·학계와의 협력을 강화해 나갈 예정입니다.`,
    author: 'Intelligence Networking Lab',
    date: '2025.11.21',
    views: 1,
    image: '/images/kics-2025-01.png'
  },
  {
    id: 4,
    title: '2024년도 한국통신학회 추계종합학술 프로그램',
    content: '2024년 11월 20일부터 22일까지 한국통신학회 추계종합학술 프로그램에 참여하였습니다.',
    fullContent: `2024년 11월 20일부터 22일까지 한국통신학회 추계종합학술 프로그램에 참여하였습니다.`,
    author: 'Intelligence Networking Lab',
    date: '2024.11.20',
    views: 1,
    image: '/images/kics-2024-fall-program-01.png',
    images: ['/images/kics-2024-fall-program-01.png'],
    attachments: [
      {
        title: '2024년도 한국통신학회 추계종합학술 프로그램',
        filename: '2024_fall_ProgramBook_Korean_v12.pdf',
        url: '/files/2024_fall_ProgramBook_Korean_v12.pdf'
      }
    ]
  },
  {
    id: 2,
    title: '2024 한국통신학회 동계학술대회',
    content:
      '2024년도 한국통신학회 동계학술대회에 참가하여 무선 네트워킹 및 AI 기반 네트워크 연구 결과를 발표하고 다양한 연구자들과 교류했습니다.',
    fullContent: `2024년도 한국통신학회 동계학술대회에 연구실 구성원이 참가하여 무선 네트워킹, AI 기반 네트워크 최적화 등의 주제로 연구 결과를 발표했습니다.

세션 발표와 포스터 발표를 통해 연구 성과를 공유하고, 다른 연구 그룹과의 토론을 통해 향후 연구 방향에 대한 아이디어를 얻었습니다.

또한 학술대회 기간 동안 튜토리얼과 워크숍에 참석하여 최신 통신 및 네트워크 기술에 대한 이해를 넓혔으며,
이를 바탕으로 연구실의 연구 주제를 더욱 발전시켜 나갈 계획입니다.`,
    author: 'Intelligence Networking Lab',
    date: '2024.02.15',
    views: 1,
    image: '/images/kics-2024-winter-02.png',
    images: ['/images/kics-2024-winter-02.png', '/images/kics-2024-winter-01.png']
  },
  {
    id: 5,
    title: 'ASK 2025 프로그램',
    content:
      '경북대학교 대구캠퍼스에서 2025년 5월 29일~31일 진행한 ASK 2025 프로그램에 참여하였습니다.',
    fullContent: `경북대학교 대구캠퍼스에서 2025년 5월 29일~31일 진행한 ASK 2025 프로그램에 참여하였습니다.`,
    author: 'Intelligence Networking Lab',
    date: '2025.06.01',
    views: 1,
    image: '/images/ask-2025/001.png',
    images: ['/images/ask-2025/001.png', '/images/ask-2025/002.png']
  }
].sort((a, b) => parseDateMs(b.date) - parseDateMs(a.date))

function News() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    if (loginForm.username && loginForm.password) {
      setIsLoggedIn(true)
      setShowLoginModal(false)
      setLoginForm({ username: '', password: '' })
      alert('로그인 성공! 이제 글을 작성할 수 있습니다.')
    } else {
      alert('아이디와 비밀번호를 입력해주세요.')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    alert('로그아웃되었습니다.')
  }

  const handlePostClick = (postId) => {
    navigate(`/news/${postId}`)
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
          <button className="active">News</button>
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

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <section className="news">
          <div className="news-header">
            <h2>News</h2>
          </div>
          <div className="posts-list">
            {dummyPosts.map((post) => (
              <article
                key={post.id}
                className="post-card"
                onClick={() => handlePostClick(post.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="post-image">
                  <img src={post.image} alt={post.title} />
                </div>
                <div className="post-content">
                  <h3>{post.title}</h3>
                  <p className="post-text">{post.content}</p>
                  <div className="post-meta">
                    <span className="post-author">{post.author}</span>
                    <span className="post-date">{post.date}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {isLoggedIn && (
            <div className="admin-bar">
              <span>관리자 모드</span>
              <button className="logout-btn" onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          )}
        </section>

        {showLoginModal && (
          <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
            <div className="login-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowLoginModal(false)}>
                ×
              </button>
              <h3>관리자 로그인</h3>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="username">아이디</label>
                  <input
                    type="text"
                    id="username"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    placeholder="아이디를 입력하세요"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">비밀번호</label>
                  <input
                    type="password"
                    id="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="비밀번호를 입력하세요"
                    required
                  />
                </div>
                <button type="submit" className="login-submit-btn">
                  로그인
                </button>
              </form>
            </div>
          </div>
        )}
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

export { dummyPosts }
export default News

