import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { dummyPosts } from './News'
import { publications } from '../data/publications'
import '../App.css'

const members = [
  {
    name: '민만기',
    nameEn: 'Manki Min',
    role: 'Ph.D. Student',
    description: 'IEEE 802.11 MAC protocol, semantic communication and network optimization.',
    email: 'network@yu.ac.kr',
    photo: '/images/minmanki.png'
  },
  {
    name: '김성훈',
    nameEn: 'Seonghun Kim',
    role: 'M.S. Student',
    description: 'IEEE 802.11 MAC protocol, multi-media streaming over wireless networks',
    email: 'hoonc-corgi@yu.ac.kr',
    photo: '/images/kimseonghoon.png'
  },
  {
    name: '윤민서',
    nameEn: 'Minseo Yoon',
    role: 'M.S. Student',
    description: 'IEEE 802.11 based pose estimation, full duplex',
    email: 'nety03@yu.ac.kr',
    photo: '/images/yoonminseo.png'
  },
  {
    name: '최선우',
    nameEn: 'Seonwoo Choi',
    role: 'Undergraduate Student',
    description: 'Undergraduate research in intelligent networking and wireless systems.',
    email: 'csw1616@yu.ac.kr',
    photo: '/images/seonwoo.png'
  }
]

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [activeSection, setActiveSection] = useState('home')
  const [showProfessorModal, setShowProfessorModal] = useState(false)
  const [showAlumni, setShowAlumni] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const heroRef = useRef(null)
  const introRef = useRef(null)
  const professorRef = useRef(null)
  const membersRef = useRef(null)
  const publicationRef = useRef(null)
  const contactRef = useRef(null)

  const topPublications = useMemo(() => {
    // Home 화면에 고정 노출할 논문 3개(제목 키워드 기준)
    const keywords = [
      'flexvi',
      'widercast',
      'design and implementation of monitoring system'
    ]

    const selected = keywords
      .map((kw) =>
        publications.find((p) => (p.title || '').toLowerCase().includes(kw))
      )
      .filter(Boolean)

    return selected.slice(0, 3)
  }, [])
  const alumniMembers = useMemo(
    () => [
      {
        id: 'alumni-1',
        name: '최대규',
        nameEn: 'Daekyu Choi',
        role: 'Samsung Electronics',
        description: 'Samsung Electronics'
      },
      {
        id: 'alumni-2',
        name: '최요하',
        nameEn: 'Yoha Choi',
        role: 'Samsung Electronics',
        description: 'Samsung Electronics'
      },
      {
        id: 'alumni-3',
        name: '박재언',
        nameEn: 'Jaeeon Park',
        role: 'CEO | CheeseRush',
        description: 'CEO | CheeseRush'
      },
      {
        id: 'alumni-4',
        name: '주민기',
        nameEn: 'MinKi Joo',
        role: 'CheeseRush',
        description: 'CheeseRush'
      },
      {
        id: 'alumni-5',
        name: '하민영',
        nameEn: 'Minyeong Ha',
        role: '',
        description: ''
      }
    ],
    []
  )

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
          const header = document.querySelector('.main-nav-row')
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

  const handleMenuClick = (target) => {
    if (target === 'news') {
      window.scrollTo({ top: 0, behavior: 'instant' })
      navigate('/news')
      return
    }
    if (target === 'gallery') {
      window.scrollTo({ top: 0, behavior: 'instant' })
      navigate('/gallery')
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
      const header = document.querySelector('.main-nav-row')
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
      <div className="main-nav-row">
        <nav className="main-nav main-nav-inline">
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
            className={activeSection === 'gallery' ? 'active' : ''}
            onClick={() => handleMenuClick('gallery')}
          >
            Gallery
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
      </div>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <section className="hero" ref={heroRef} data-section="home">
          <div className="hero-left">
            <p className="hero-eyebrow">Lab. of Intelligence Networking</p>
            <h1 className="hero-title">
              Intelligence
              <br />
              Networking
              <br />
              Lab.
            </h1>
            <p className="hero-subtitle">
              We design next-generation wireless communication and networking systems
              based on AI-driven optimization and intelligent protocols.
            </p>
          </div>
          <div className="carousel hero-right">
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
        </section>

        <section className="news-panel" aria-label="Recent news">
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
        </section>

        <section className="intro" ref={introRef} data-section="intro">
          <h2>Intelligence Networking Lab</h2>
          <p>
            The Intelligence Networking Lab is a leading research group dedicated to pioneering next-generation wireless communication and networking technologies. The lab focuses on designing Wireless LAN (WLAN) protocols based on IEEE 802.11, designing mobile communication systems such as LTE/NR, and developing wireless networking technologies based on machine learning and deep learning. Through these efforts, the lab aims to enhance wireless network performance, maximize energy efficiency, and improve the quality of various application services.
          </p>
        </section>

        <section
          className="professor"
          ref={professorRef}
          data-section="professor"
          onClick={() => setShowProfessorModal(true)}
          style={{ cursor: 'pointer' }}
        >
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
              <li>Ex-Senior Research Engineer | Samsung Electronics (Networks)</li>
              <li>Expertise: High-capacity Wireless Transmission, Edge AI, Intelligent Traffic Control</li>
            </ul>
          </div>
          <a
            className="professor-mail-btn"
            href="mailto:ydpark@yu.ac.kr"
            aria-label="박영덕 교수님께 메일 보내기"
            title="박영덕 교수님께 메일 보내기"
            onClick={(e) => e.stopPropagation()}
          >
            <img src="/images/mail.svg" alt="" aria-hidden="true" />
          </a>
        </section>

        <section className="members" ref={membersRef} data-section="members">
          <div className="members-header">
            <h2>Members</h2>
            <p>차세대 네트워크를 설계하는 연구자들을 소개합니다.</p>
          </div>
          <div className="member-grid">
            {members.map((member) => (
              <article key={member.email} className="member-card">
                <img className="member-photo" src={member.photo} alt={member.name} />
                <div className="member-info">
                  <h3>
                    {member.name}
                    <span className="member-role-badge">{member.role}</span>
                  </h3>
                  <span className="member-name-en">{member.nameEn}</span>
                  <p>{member.description}</p>
                </div>
                <a
                  className="member-mail-btn"
                  href={`mailto:${member.email}`}
                  aria-label={`${member.name}에게 메일 보내기`}
                  title={`${member.name}에게 메일 보내기`}
                >
                  <img src="/images/mail.svg" alt="" aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="alumni">
          <div className={`alumni-dropdown ${showAlumni ? 'open' : ''}`}>
            <div className="member-grid alumni-grid">
            {alumniMembers.map((member) => (
              <article key={member.id} className="member-card alumni-card">
                  <div className="member-info">
                    <h3>
                      {member.name}
                    {!!member.role && <span className="member-role-badge">{member.role}</span>}
                    </h3>
                    <span className="member-name-en">{member.nameEn}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <button
            type="button"
            className="publication-more-btn alumni-toggle-btn"
            onClick={() => setShowAlumni((prev) => !prev)}
          >
            {showAlumni ? 'Alumni 접기' : 'Alumni 더보기'}
          </button>
        </section>

        <section className="publication" ref={publicationRef} data-section="publication">
          <h2>Publications</h2>
          <div className="publication-list home-publication-list">
            {topPublications.map((pub) => (
              <a
                key={pub.id}
                className="publication-item"
                href={pub.link || undefined}
                target={pub.link ? '_blank' : undefined}
                rel={pub.link ? 'noreferrer' : undefined}
              >
                <span className="pub-badge">{pub.type}</span>
                <div className="pub-text">
                  <p className="pub-title">{pub.title}</p>
                  <p className="pub-meta">
                    {pub.authors} ({pub.date.replace('-', '.')})
                  </p>
                  <p className="pub-meta">{pub.venue}</p>
                  {pub.extra && <p className="pub-meta">{pub.extra}</p>}
                </div>
              </a>
            ))}
          </div>
          <button
            type="button"
            className="publication-more-btn"
            onClick={() => navigate('/publications')}
          >
            더보기
          </button>
        </section>

        {showProfessorModal && (
          <div className="modal-overlay" onClick={() => setShowProfessorModal(false)}>
            <div className="prof-modal" onClick={(e) => e.stopPropagation()}>
              <button
                className="modal-close prof-modal-close"
                type="button"
                onClick={() => setShowProfessorModal(false)}
                aria-label="Close professor details"
              >
                ×
              </button>
              <div className="prof-modal-header">
                <h3>Young Deok Park (박영덕)</h3>
                <p>Assistant Professor, School of Computer Science and Engineering, Yeungnam University</p>
                <p className="prof-email">E-mail: ydpark@yu.ac.kr</p>
              </div>

              <div className="prof-modal-body">
                <section className="prof-section">
                  <h4>Professional Experiences</h4>
                  <ul>
                    <li>Mar. 2021 – present: Assistant Professor, Dept. of Computer Engineering, Yeungnam University (YU)</li>
                    <li>Sep. 2019 – Feb. 2021: Senior Engineer, Networks Business, Samsung Electronics Co., Ltd.</li>
                    <li>Mar. 2019 – Aug. 2019: Postdoctoral Researcher, Dept. of Computer Science and Engineering, POSTECH</li>
                  </ul>
                </section>

                <section className="prof-section">
                  <h4>Education</h4>
                  <ul>
                    <li>Ph.D., Computer Science and Engineering, POSTECH, Feb. 2019 (Adviser: Prof. Young-Joo Suh)</li>
                    <li>M.S., Computer Science and Engineering, POSTECH, Feb. 2014 (Adviser: Prof. Young-Joo Suh)</li>
                    <li>B.S., Computer Engineering, Sungkyunkwan University (SKKU), Feb. 2012</li>
                  </ul>
                </section>

                <section className="prof-section">
                  <h4>Research Interests</h4>
                  <ul>
                    <li>IEEE 802.11 MAC/PHY protocol design</li>
                    <li>LTE/NR system design</li>
                    <li>ML/DL-based wireless networking</li>
                  </ul>
                </section>

                <section className="prof-section">
                  <h4>Selected Publications (International Journals)</h4>
                  <ul>
                    <li>
                      H. Ahn, H. Lee, and Y. D. Park, “AUB: A Full-Duplex MAC Protocol for the Efficient
                      Utilization of the Idle Uplink Period in WLAN,” <em>Journal of Communications and Networks</em>, vol. 25, no. 6, pp. 750–759, Dec. 2023.
                    </li>
                    <li>
                      H. Lee, H. Ahn, and Y. D. Park, “De-identifying Transmission System using Wireless
                      Channel as Differential Privacy Noise and Deep Neural Networks,” <em>ICT Express</em>, vol. 9, no. 4, pp. 683–690, Aug. 2023.
                    </li>
                    <li>
                      H. Lee, H. Ahn, and Y. D. Park, “Performance Analysis of Coexistence of
                      Traditional Communication System and Emerging Semantic Communication System,”
                      <em>ICT Express</em>, vol. 9, no. 3, pp. 420–426, June 2023.
                    </li>
                    <li>
                      H. Ahn, Y. D. Park, D. Kim, and Y.-J. Suh, “A Full-duplex MAC Protocol based on
                      Buffer Status Report for Successive Full-duplex Link Setup,” <em>IEEE Communications Letters</em>, vol. 23, no. 9, pp. 1506–1509, Sep. 2019.
                    </li>
                  </ul>
                </section>

                <section className="prof-section">
                  <h4>Selected Publications (International Conferences)</h4>
                  <ul>
                    <li>
                      S. Lee, Y. D. Park, S. Jeon, and Y.-J. Suh, “Design and Implementation of Monitoring
                      System for Breathing and Heart Rate Pattern using WiFi Signals,” in <em>Proc. IEEE CCNC</em>, 2018.
                    </li>
                    <li>
                      Y. D. Park, J.-P. Jeong, and Y.-J. Suh, “Exploiting Additional Active Time of WiFi
                      Interface to Reduce Power Consumption of Smartphones,” in <em>Proc. IEEE VTC</em>, May 2014.
                    </li>
                  </ul>
                </section>

                <section className="prof-section">
                  <h4>Projects (Selected)</h4>
                  <ul>
                    <li>“Research on Wi-Fi Signal-based Vital Sign Monitoring Technology,” NRF (2021.09.01 – 2024.02.29)</li>
                    <li>“Key Techniques for Enhancing Performance of Wireless Video Streaming,” Yeungnam University (2021.03.01 – 2024.02.29)</li>
                    <li>“Research on Network Technologies for Increasing Energy Efficiency of Smart Devices,” NRF (2013.11.01 – 2016.10.31)</li>
                  </ul>
                </section>

                <section className="prof-section">
                  <h4>Lectures (Recent)</h4>
                  <ul>
                    <li>Data Communications, Big Data Analytics and Application, C Programming (Undergraduate)</li>
                    <li>Computer Networks, Wireless Networks, Mobile Networks (Graduate / Undergraduate)</li>
                    <li>AI and AI Educations, COG ICT AI Program (Deep Learning &amp; ML parts)</li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        )}

        <section className="contact" ref={contactRef} data-section="contact">
          <h2>Contact</h2>
          <div className="contact-content">
            <div className="contact-info">
              <p>연구실에 대한 문의사항이 있으시면 언제든지 연락주세요.</p>
              <div className="contact-details">
                <p><strong>주소:</strong> 경상북도 경산시 대학로 280, 영남대학교 IT관 E21 210호</p>
                <p><strong>연락처:</strong> network@yu.ac.kr</p>
              </div>
            </div>
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

export default Home

