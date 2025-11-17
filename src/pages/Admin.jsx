import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { dummyPosts } from './News'
import '../App.css'

function Admin() {
  const [activeTab, setActiveTab] = useState('posts')
  const [posts, setPosts] = useState(dummyPosts)
  const [editingPost, setEditingPost] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [showPostForm, setShowPostForm] = useState(false)
  const [showAccountForm, setShowAccountForm] = useState(false)
  const navigate = useNavigate()

  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    fullContent: '',
    author: '연구실',
    date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\./g, '.').replace(/\s/g, ''),
    image: '',
    views: 0
  })

  const [accountForm, setAccountForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin'
  })

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const handlePostSubmit = (e) => {
    e.preventDefault()
    if (editingPost) {
      // 수정
      setPosts(posts.map(p => 
        p.id === editingPost.id 
          ? { ...postForm, id: editingPost.id, content: postForm.content || postForm.fullContent.substring(0, 100) }
          : p
      ))
      alert('게시글이 수정되었습니다.')
    } else {
      // 새 게시글
      const newPost = {
        ...postForm,
        id: Math.max(...posts.map(p => p.id)) + 1,
        content: postForm.content || postForm.fullContent.substring(0, 100)
      }
      setPosts([newPost, ...posts])
      alert('새 게시글이 등록되었습니다.')
    }
    setEditingPost(null)
    setShowPostForm(false)
    setPostForm({
      title: '',
      content: '',
      fullContent: '',
      author: '연구실',
      date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\./g, '.').replace(/\s/g, ''),
      image: '',
      views: 0
    })
  }

  const handleEditPost = (post) => {
    setEditingPost(post)
    setPostForm({
      title: post.title,
      content: post.content,
      fullContent: post.fullContent,
      author: post.author,
      date: post.date,
      image: post.image,
      views: post.views
    })
    setShowPostForm(true)
  }

  const handleDeletePost = (postId) => {
    if (window.confirm('정말 이 게시글을 삭제하시겠습니까?')) {
      setPosts(posts.filter(p => p.id !== postId))
      alert('게시글이 삭제되었습니다.')
    }
  }

  const handleAccountSubmit = (e) => {
    e.preventDefault()
    alert(`관리자 계정 "${accountForm.username}"이(가) 생성되었습니다.`)
    setAccountForm({
      username: '',
      email: '',
      password: '',
      role: 'admin'
    })
    setShowAccountForm(false)
  }

  const handleCancel = () => {
    setEditingPost(null)
    setShowPostForm(false)
    setShowAccountForm(false)
    setPostForm({
      title: '',
      content: '',
      fullContent: '',
      author: '연구실',
      date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\./g, '.').replace(/\s/g, ''),
      image: '',
      views: 0
    })
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-brand">
            <h1>관리자 대시보드</h1>
          </div>
          <button className="admin-logout-btn" onClick={() => navigate('/')} title="홈으로 돌아가기">
            <img src="/images/Home 1.svg" alt="홈" className="admin-home-icon" />
          </button>
        </div>
      </header>

      <div className="admin-container">
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <button
              className={activeTab === 'posts' ? 'active' : ''}
              onClick={() => {
                setActiveTab('posts')
                setShowPostForm(false)
                setShowAccountForm(false)
              }}
            >
              <img src="/images/Edit 3.svg" alt="게시글 관리" className="nav-icon" />
              게시글 관리
            </button>
            <button
              className={activeTab === 'accounts' ? 'active' : ''}
              onClick={() => {
                setActiveTab('accounts')
                setShowPostForm(false)
                setShowAccountForm(false)
              }}
            >
              <img src="/images/Users.svg" alt="계정 관리" className="nav-icon" />
              계정 관리
            </button>
            <button
              className={activeTab === 'settings' ? 'active' : ''}
              onClick={() => {
                setActiveTab('settings')
                setShowPostForm(false)
                setShowAccountForm(false)
              }}
            >
              <img src="/images/Settings 3.svg" alt="설정" className="nav-icon" />
              설정
            </button>
          </nav>
        </aside>

        <main className="admin-main">
          {activeTab === 'posts' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="admin-section-header">
                <h2>게시글 관리</h2>
                <button
                  className="admin-primary-btn"
                  onClick={() => {
                    setShowPostForm(true)
                    setEditingPost(null)
                    setPostForm({
                      title: '',
                      content: '',
                      fullContent: '',
                      author: '연구실',
                      date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\./g, '.').replace(/\s/g, ''),
                      image: '',
                      views: 0
                    })
                  }}
                >
                  + 새 게시글 작성
                </button>
              </div>

              {showPostForm && (
                <div className="admin-card">
                  <h3>{editingPost ? '게시글 수정' : '새 게시글 작성'}</h3>
                  <form onSubmit={handlePostSubmit} className="admin-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>제목 *</label>
                        <input
                          type="text"
                          value={postForm.title}
                          onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                          required
                          placeholder="게시글 제목을 입력하세요"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>요약 내용</label>
                        <textarea
                          value={postForm.content}
                          onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                          rows="3"
                          placeholder="게시글 목록에 표시될 요약 내용"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>전체 내용 *</label>
                        <textarea
                          value={postForm.fullContent}
                          onChange={(e) => setPostForm({ ...postForm, fullContent: e.target.value })}
                          rows="8"
                          required
                          placeholder="게시글 전체 내용을 입력하세요"
                        />
                      </div>
                    </div>

                    <div className="form-row form-row-2">
                      <div className="form-group">
                        <label>작성자</label>
                        <input
                          type="text"
                          value={postForm.author}
                          onChange={(e) => setPostForm({ ...postForm, author: e.target.value })}
                          placeholder="작성자명"
                        />
                      </div>
                      <div className="form-group">
                        <label>작성일</label>
                        <input
                          type="text"
                          value={postForm.date}
                          onChange={(e) => setPostForm({ ...postForm, date: e.target.value })}
                          placeholder="2024.01.15"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>이미지 URL</label>
                        <input
                          type="url"
                          value={postForm.image}
                          onChange={(e) => setPostForm({ ...postForm, image: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button type="button" className="admin-secondary-btn" onClick={handleCancel}>
                        취소
                      </button>
                      <button type="submit" className="admin-primary-btn">
                        {editingPost ? '수정하기' : '등록하기'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {selectedPost ? (
                <div className="admin-card">
                  <div className="admin-post-detail-header">
                    <button
                      className="admin-secondary-btn"
                      onClick={() => setSelectedPost(null)}
                    >
                      ← 목록으로
                    </button>
                    <div className="admin-post-detail-actions">
                      <button
                        className="admin-action-btn edit"
                        onClick={() => {
                          handleEditPost(selectedPost)
                          setSelectedPost(null)
                        }}
                      >
                        수정
                      </button>
                      <button
                        className="admin-action-btn delete"
                        onClick={() => {
                          handleDeletePost(selectedPost.id)
                          setSelectedPost(null)
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  
                  <div className="admin-post-detail-content">
                    {selectedPost.image && (
                      <div className="admin-post-detail-image">
                        <img src={selectedPost.image} alt={selectedPost.title} />
                      </div>
                    )}
                    <h1>{selectedPost.title}</h1>
                    <div className="admin-post-detail-meta">
                      <span>{selectedPost.author}</span>
                      <span>•</span>
                      <span>{selectedPost.date}</span>
                      <span>•</span>
                      <span>조회 {selectedPost.views}</span>
                    </div>
                    <div className="admin-post-detail-body">
                      <p>{selectedPost.fullContent || selectedPost.content}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="admin-posts-list">
                  {posts.map((post) => (
                    <div 
                      key={post.id} 
                      className="admin-post-card"
                      onClick={() => setSelectedPost(post)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="admin-post-image">
                        <img src={post.image} alt={post.title} />
                      </div>
                      <div className="admin-post-content">
                        <h3>{post.title}</h3>
                        <p className="admin-post-meta">
                          {post.author} • {post.date} • 조회 {post.views}
                        </p>
                        <p className="admin-post-excerpt">{post.content}</p>
                      </div>
                      <div className="admin-post-actions" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="admin-action-btn edit"
                          onClick={() => handleEditPost(post)}
                        >
                          수정
                        </button>
                        <button
                          className="admin-action-btn delete"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'accounts' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="admin-section-header">
                <h2>계정 관리</h2>
                <button
                  className="admin-primary-btn"
                  onClick={() => setShowAccountForm(true)}
                >
                  + 새 관리자 계정 생성
                </button>
              </div>

              {showAccountForm && (
                <div className="admin-card">
                  <h3>새 관리자 계정 생성</h3>
                  <form onSubmit={handleAccountSubmit} className="admin-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>사용자명 *</label>
                        <input
                          type="text"
                          value={accountForm.username}
                          onChange={(e) => setAccountForm({ ...accountForm, username: e.target.value })}
                          required
                          placeholder="관리자 사용자명"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>이메일 *</label>
                        <input
                          type="email"
                          value={accountForm.email}
                          onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                          required
                          placeholder="admin@example.com"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>비밀번호 *</label>
                        <input
                          type="password"
                          value={accountForm.password}
                          onChange={(e) => setAccountForm({ ...accountForm, password: e.target.value })}
                          required
                          placeholder="비밀번호를 입력하세요"
                          minLength="8"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>권한</label>
                        <select
                          value={accountForm.role}
                          onChange={(e) => setAccountForm({ ...accountForm, role: e.target.value })}
                        >
                          <option value="admin">관리자</option>
                          <option value="editor">편집자</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-actions">
                      <button type="button" className="admin-secondary-btn" onClick={handleCancel}>
                        취소
                      </button>
                      <button type="submit" className="admin-primary-btn">
                        계정 생성
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="admin-card">
                <h3>등록된 관리자 계정</h3>
                <div className="admin-accounts-list">
                  <div className="admin-account-item">
                    <div className="account-info">
                      <div className="account-avatar">A</div>
                      <div>
                        <strong>admin</strong>
                        <span>admin@lab.yu.ac.kr</span>
                      </div>
                    </div>
                    <div className="account-role">관리자</div>
                    <div className="account-actions">
                      <button className="admin-action-btn edit">수정</button>
                      <button className="admin-action-btn delete">삭제</button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="admin-section-header">
                <h2>설정</h2>
              </div>

              <div className="admin-card">
                <h3>일반 설정</h3>
                <form className="admin-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>연구실 이름</label>
                      <input type="text" defaultValue="Intelligent Network Lab" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>연구실 설명</label>
                      <textarea rows="4" defaultValue="차세대 네트워크를 설계하는 연구실입니다." />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="admin-primary-btn">저장</button>
                  </div>
                </form>
              </div>

              <div className="admin-card">
                <h3>알림 설정</h3>
                <div className="admin-settings-list">
                  <div className="setting-item">
                    <div>
                      <strong>이메일 알림</strong>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <div>
                      <strong>새 게시글 알림</strong>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Admin

