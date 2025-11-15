import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { dummyPosts } from './News'
import '../App.css'

const memberPhotos = [
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'
]

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [activeSection, setActiveSection] = useState('home')
  const navigate = useNavigate()
  const location = useLocation()
  const heroRef = useRef(null)
  const introRef = useRef(null)
  const professorRef = useRef(null)
  const membersRef = useRef(null)
  const publicationRef = useRef(null)
  const contactRef = useRef(null)
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  // News 게시물을 캐러셀 슬라이드로 변환
  const slides = useMemo(
    () =>
      dummyPosts.map((post) => ({
        id: post.id,
        url: post.image,
        title: post.title,
        description: post.content,
        postId: post.id
      })),
    []
  )

  // 최근 게시물 2개 (날짜순 정렬, 최신순)
  const recentPosts = useMemo(
    () => {
      const sorted = [...dummyPosts].sort((a, b) => {
        // 날짜 형식: '2024.01.15' -> '2024-01-15'로 변환
        const dateA = new Date(a.date.replace(/\./g, '-'))
        const dateB = new Date(b.date.replace(/\./g, '-'))
        return dateB - dateA // 최신순
      })
      return sorted.slice(0, 2)
    },
    []
  )

  // URL 해시를 감지하여 해당 섹션으로 스크롤
  useEffect(() => {
    const scrollToSection = (hash) => {
      if (!hash) return
      
      const map = {
        members: professorRef,
        publication: publicationRef,
        contact: contactRef,
        intro: introRef,
        home: heroRef
      }
      const targetRef = map[hash]
      if (targetRef?.current) {
        // DOM이 완전히 렌더링될 때까지 대기 (페이지 전환 후)
        const scrollTimeout = setTimeout(() => {
          const header = document.querySelector('.lab-header')
          const headerHeight = header ? header.offsetHeight + 20 : 100
          const elementPosition = targetRef.current.getBoundingClientRect().top + window.pageYOffset
          const offsetPosition = elementPosition - headerHeight

          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth'
          })
        }, 300)

        return () => clearTimeout(scrollTimeout)
      }
    }

    // location.hash 또는 window.location.hash에서 해시 가져오기
    const hash = (location.hash || window.location.hash).replace('#', '')
    if (hash) {
      return scrollToSection(hash)
    }

    // 해시 변경 감지
    const handleHashChange = () => {
      const currentHash = window.location.hash.replace('#', '')
      scrollToSection(currentHash)
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [location])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.dataset.section
            if (id === 'professor') {
              setActiveSection('members')
            } else {
              setActiveSection(id)
            }
          }
        })
      },
      {
        threshold: 0.4
      }
    )

    const targets = [
      { ref: heroRef, id: 'home' },
      { ref: introRef, id: 'intro' },
      { ref: professorRef, id: 'professor' },
      { ref: membersRef, id: 'members' },
      { ref: publicationRef, id: 'publication' },
      { ref: contactRef, id: 'contact' }
    ]

    targets.forEach(({ ref }) => {
      if (ref.current) {
        observer.observe(ref.current)
      }
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!contactRef.current || mapInstanceRef.current) {
      return
    }

    const initMap = () => {
      if (!window.google || !window.google.maps || !mapRef.current) {
        return
      }

      const location = { lat: 35.830638, lng: 128.7544314 }

      try {
        const map = new window.google.maps.Map(mapRef.current, {
          zoom: 17,
          center: location,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          disableDefaultUI: false
        })

        const marker = new window.google.maps.Marker({
          position: location,
          map: map,
          title: '영남대학교 IT관 E21동'
        })

        const infoWindow = new window.google.maps.InfoWindow({
          content: '<div style="padding: 8px; font-weight: bold; font-size: 14px;">영남대학교 IT관 E21동</div>'
        })

        marker.addListener('click', () => {
          infoWindow.open(map, marker)
        })

        infoWindow.open(map, marker)

        mapInstanceRef.current = map
      } catch (error) {
        console.error('Map initialization error:', error)
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !mapInstanceRef.current) {
            if (window.google && window.google.maps) {
              setTimeout(initMap, 200)
            } else {
              const checkGoogle = setInterval(() => {
                if (window.google && window.google.maps) {
                  clearInterval(checkGoogle)
                  setTimeout(initMap, 200)
                }
              }, 100)

              setTimeout(() => {
                clearInterval(checkGoogle)
              }, 10000)
            }
          }
        })
      },
      { threshold: 0.1 }
    )

    if (contactRef.current) {
      observer.observe(contactRef.current)
    }

    return () => {
      if (contactRef.current) {
        observer.unobserve(contactRef.current)
      }
    }
  }, [])

  const handleMenuClick = (target) => {
    if (target === 'news') {
      window.scrollTo({ top: 0, behavior: 'instant' })
      navigate('/news')
      return
    }
    const map = {
      home: heroRef,
      intro: introRef,
      members: professorRef,
      publication: publicationRef,
      contact: contactRef
    }
    const targetRef = map[target]
    if (targetRef?.current) {
      // 헤더 높이를 동적으로 계산
      const header = document.querySelector('.lab-header')
      const headerHeight = header ? header.offsetHeight + 20 : 100 // 헤더 높이 + 여유 공간 20px
      const elementPosition = targetRef.current.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - headerHeight

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="page">
      <header className="lab-header">
        <div className="brand-area">
          <img
            src="/images/Yu.svg"
            alt="YU Intelligent Networking Lab"
            className="brand-logo"
          />
          <div>
            <p>Intelligent Network Lab</p>
            <span>영남대학교 지능형 네트워크 연구실</span>
          </div>
        </div>
        <nav className="main-nav">
          <button
            className={activeSection === 'home' ? 'active' : ''}
            onClick={() => handleMenuClick('home')}
          >
            Home
          </button>
          <button
            className={activeSection === 'news' ? 'active' : ''}
            onClick={() => handleMenuClick('news')}
          >
            News
          </button>
          <button
            className={activeSection === 'members' ? 'active' : ''}
            onClick={() => handleMenuClick('members')}
          >
            Members
          </button>
          <button
            className={activeSection === 'publication' ? 'active' : ''}
            onClick={() => handleMenuClick('publication')}
          >
            Publication
          </button>
          <button
            className={activeSection === 'contact' ? 'active' : ''}
            onClick={() => handleMenuClick('contact')}
          >
            Contact
          </button>
        </nav>
      </header>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <section className="hero" ref={heroRef} data-section="home">
          <div className="carousel">
            <div className="carousel-wrapper">
              <div
                className="carousel-slides"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className="carousel-frame"
                    style={{ backgroundImage: `url(${slide.url})`, cursor: 'pointer' }}
                    onClick={() => navigate(`/news/${slide.postId}`)}
                  >
                    <div className="slide-caption">
                      <h2>{slide.title}</h2>
                      <p>{slide.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="nav-btn prev"
                aria-label="이전 이미지"
                onClick={() =>
                  setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
                }
              >
                <img src="/images/ArrowLeft.svg" alt="이전" />
              </button>
              <button
                className="nav-btn next"
                aria-label="다음 이미지"
                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              >
                <img src="/images/ArrowRight.svg" alt="다음" />
              </button>
            </div>
          </div>
          <div className="news-panel">
            {recentPosts.map((post, index) => (
              <div
                key={post.id}
                className="news-card"
                onClick={() => navigate(`/news/${post.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <p className="tag">소식 {index + 1}</p>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="intro" ref={introRef} data-section="intro">
          <h2>Intelligent Networking Lab</h2>
          <p>
            The Intelligent Networking Lab is a leading research group dedicated to pioneering next-generation wireless communication and networking technologies. The lab focuses on designing Wireless LAN (WLAN) protocols based on IEEE 802.11, designing mobile communication systems such as LTE/NR, and developing wireless networking technologies based on machine learning and deep learning. Through these efforts, the lab aims to enhance wireless network performance, maximize energy efficiency, and improve the quality of various application services.
          </p>
        </section>

        <section className="professor" ref={professorRef} data-section="professor">
          <img className="professor-img" src="/images/park.png" alt="Professor Young Deok Park" />
          <div className="professor-content">
            <p className="eyebrow">Professor</p>
            <h2>Young Deok Park</h2>
            <p>
              Young Deok Park is an assistant professor with the Department of Computer Engineering at
              Yeungnam University. His research interests include IEEE 802.11 MAC/PHY protocol design,
              multimedia streaming over wireless networks, and LTE/NR system design.
            </p>
            <ul>
              <li>Ph.D, POSTECH Computer Science & Engineering</li>
              <li>전 삼성전자 네트워크 사업부 책임 연구원</li>
              <li>주요 연구: 대용량 무선 전송, 엣지 AI, 지능형 트래픽 제어</li>
            </ul>
          </div>
        </section>

        <section className="members" ref={membersRef} data-section="members">
          <div className="members-header">
            <h2>Members</h2>
            <p>차세대 네트워크를 설계하는 연구자들을 소개합니다.</p>
          </div>
          <div className="member-grid">
            {memberPhotos.map((photo, idx) => (
              <article key={photo + idx} className="member-card">
                <img src={photo} alt={`연구원 ${idx + 1}`} />
                <div>
                  <h3>연구원 {idx + 1}</h3>
                  <p>스마트 무선 시스템 · AI 네트워크</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="publication" ref={publicationRef} data-section="publication">
          <h2>Publication</h2>
          <p>연구실의 주요 논문 및 발표 자료를 확인하실 수 있습니다.</p>
        </section>

        <section className="contact" ref={contactRef} data-section="contact">
          <h2>Contact</h2>
          <div className="contact-content">
            <div className="map-container">
              <div ref={mapRef} className="google-map" />
            </div>
            <div className="contact-info">
              <p>연구실에 대한 문의사항이 있으시면 언제든지 연락주세요.</p>
              <div className="contact-details">
                <p><strong>주소:</strong> 경상북도 경산시 대학로 280, 영남대학교 IT관 E21동</p>
                <p><strong>연락처:</strong> 연구실로 문의해주세요</p>
              </div>
            </div>
          </div>
        </section>
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

export default Home

