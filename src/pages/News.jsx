import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import '../App.css'

const dummyPosts = [
  {
    id: 1,
    title: '6G 기반 초저지연 무선 통신 연구 착수',
    content: '연구실에서 6G 기반 초저지연 무선 통신 기술 연구를 본격적으로 시작했습니다. 산업 파트너와의 협력을 통해 스마트 팩토리 환경에서의 실증 실험을 진행할 예정입니다.',
    fullContent: `연구실에서 6G 기반 초저지연 무선 통신 기술 연구를 본격적으로 시작했습니다. 산업 파트너와의 협력을 통해 스마트 팩토리 환경에서의 실증 실험을 진행할 예정입니다.

이번 연구는 차세대 무선 통신 기술의 핵심인 초저지연 통신을 실현하기 위한 것으로, 5G를 넘어서는 성능을 목표로 하고 있습니다. 특히 산업용 IoT 환경에서 요구되는 실시간 데이터 전송과 제어를 위한 기술 개발에 중점을 두고 있습니다.

주요 연구 내용:
- 초저지연 MAC 프로토콜 설계
- 엣지 컴퓨팅 기반 트래픽 최적화
- 실시간 네트워크 모니터링 시스템 구축

향후 2년간 지속될 예정이며, 산업 파트너와의 협력을 통해 실제 스마트 팩토리 환경에서의 실증 실험을 진행할 예정입니다.`,
    author: '연구실',
    date: '2024.01.15',
    views: 124,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 2,
    title: 'AI 무선 최적화 플랫폼 오픈',
    content: '강화학습과 네트워크 트윈 기술을 결합한 AI 기반 무선 네트워크 최적화 플랫폼을 공개했습니다. 실시간 트래픽 분석 및 자동 리소스 할당 기능을 제공합니다.',
    fullContent: `강화학습과 네트워크 트윈 기술을 결합한 AI 기반 무선 네트워크 최적화 플랫폼을 공개했습니다. 실시간 트래픽 분석 및 자동 리소스 할당 기능을 제공합니다.

이 플랫폼은 인공지능 기술을 활용하여 무선 네트워크의 성능을 자동으로 최적화하는 혁신적인 솔루션입니다. 강화학습 알고리즘을 통해 네트워크 환경에 맞는 최적의 파라미터를 자동으로 학습하고 적용합니다.

주요 기능:
- 실시간 트래픽 분석 및 예측
- 자동 리소스 할당 및 스케줄링
- 네트워크 트윈 기반 시뮬레이션
- 성능 모니터링 및 리포트 생성

플랫폼은 웹 기반 인터페이스를 제공하여 네트워크 관리자가 쉽게 사용할 수 있도록 설계되었습니다.`,
    author: '연구실',
    date: '2024.01.10',
    views: 98,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 3,
    title: '국제 학회 논문 발표 성공',
    content: '연구실에서 IEEE INFOCOM 2024에 논문이 채택되어 발표를 완료했습니다. 주제는 "Energy-Efficient MAC Protocol for 6G Networks"입니다.',
    fullContent: `연구실에서 IEEE INFOCOM 2024에 논문이 채택되어 발표를 완료했습니다. 주제는 "Energy-Efficient MAC Protocol for 6G Networks"입니다.

IEEE INFOCOM은 컴퓨터 네트워크 분야의 최고 권위 학회 중 하나로, 이번 논문 채택은 연구실의 연구 성과를 국제적으로 인정받는 중요한 계기가 되었습니다.

논문 주요 내용:
- 6G 네트워크를 위한 에너지 효율적인 MAC 프로토콜 설계
- 동적 전력 관리 기법
- 시뮬레이션 및 실험을 통한 성능 검증

연구실의 박영덕 교수와 박사과정 학생들이 공동으로 연구를 진행했으며, 향후 관련 연구를 지속적으로 발전시켜 나갈 예정입니다.`,
    author: '연구실',
    date: '2024.01.05',
    views: 156,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 4,
    title: '산업체 협력 프로젝트 착수',
    content: '삼성전자 네트워크 사업부와 공동으로 차세대 무선 통신 프로토콜 개발 프로젝트를 시작했습니다. 향후 2년간 지속될 예정입니다.',
    fullContent: `삼성전자 네트워크 사업부와 공동으로 차세대 무선 통신 프로토콜 개발 프로젝트를 시작했습니다. 향후 2년간 지속될 예정입니다.

이번 프로젝트는 산업계와 학계의 협력을 통해 차세대 무선 통신 기술을 개발하는 것을 목표로 합니다. 삼성전자의 산업 경험과 연구실의 기술력을 결합하여 실용적인 솔루션을 만들어 나갈 예정입니다.

프로젝트 목표:
- 차세대 무선 통신 프로토콜 설계 및 구현
- 실시간 멀티미디어 전송 최적화
- 네트워크 성능 평가 및 검증

프로젝트 기간 동안 정기적인 미팅과 기술 교류를 통해 연구를 진행하며, 최종적으로는 실제 제품에 적용 가능한 기술을 개발하는 것을 목표로 하고 있습니다.`,
    author: '연구실',
    date: '2024.01.01',
    views: 203,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80'
  }
]

function News() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const navigate = useNavigate()

  const handleWriteClick = () => {
    if (isLoggedIn) {
      alert('글쓰기 기능은 추후 구현 예정입니다.')
    } else {
      setShowLoginModal(true)
    }
  }

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
            alt="YU Intelligent Networking Lab"
            className="brand-logo"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          />
          <div>
            <p>Intelligent Network Lab</p>
            <span>영남대학교 지능형 네트워크 연구실</span>
          </div>
        </div>
        <nav className="main-nav">
          <button onClick={() => navigate('/')}>Home</button>
          <button className="active">News</button>
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
            <button className="write-btn" onClick={handleWriteClick}>
              글쓰기
            </button>
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
                    <span className="post-views">조회 {post.views}</span>
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
          <p className="brand">YU Intelligent Networking Lab</p>
          <p>경상북도 경산시 대학로 280, 영남대학교 IT관 210호</p>
        </div>
        <span>© {new Date().getFullYear()} Intelligent Networking Lab</span>
      </footer>
    </div>
  )
}

export { dummyPosts }
export default News

