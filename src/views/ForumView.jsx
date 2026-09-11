import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { createForumComment, createForumPost, fetchForumPosts, updateForumPost, fetchUsers } from '../services/supabaseService';

export const ForumView = () => {
  const { user, setIsAuthModalOpen } = useAuth();
  const isTeacherOrAdmin = user?.role === 'admin' || user?.role === 'teacher';

  const [posts, setPosts] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [systemUsers, setSystemUsers] = useState([]);
  const [mentionState, setMentionState] = useState({ postId: null, query: '', cursorPos: 0, matchStart: -1 });
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [mentionActiveIndex, setMentionActiveIndex] = useState(0);
  const commentInputRefs = useRef({});

  useEffect(() => {
    fetchForumPosts().then(({ data, error }) => {
      setPosts(data);
      setLoadError(error || '');
    });
    fetchUsers().then(({ data }) => {
      if (data && data.length > 0) setSystemUsers(data);
    });
  }, []);

  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'bai-kho' | 'bao-loi' | 'kinh-nghiem' | 'thao-luan'
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});

  // New Post Modal State
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('bai-kho');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');

  // Like / Upvote handler
  const handleToggleLike = async (postId, e) => {
    e.stopPropagation();
    const post = posts.find((item) => item.id === postId);
    if (!post) return;
    const isLiked = !post.isLiked;
    const likesCount = isLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1);
    const result = await updateForumPost(postId, { likesCount });
    if (result.success) setPosts((prev) => prev.map((item) => item.id === postId ? { ...item, isLiked, likesCount } : item));
    else setLoadError(result.error);
  };

  // Add Comment handler
  const handleAddComment = async (postId, e) => {
    e.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const newComment = {
      id: `c-${Date.now()}`,
      author: {
        name: user.name,
        avatar: user.avatar || user.name.slice(0, 1),
        role: user.role,
        badge: user.role === 'admin' 
          ? 'Quản trị viên' 
          : user.role === 'teacher' 
          ? 'Giáo viên phụ trách 🌸' 
          : 'Học viên Hanzify'
      },
      content: text,
      createdAt: 'Vừa xong',
      isTeacherAnswer: isTeacherOrAdmin,
      likesCount: 0
    };

    const result = await createForumComment(postId, newComment, user);
    if (!result.success) { setLoadError(result.error); return; }
    setPosts((prev) => prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...(post.comments || []), newComment],
            // If teacher/admin answers, mark as answered
            status: isTeacherOrAdmin && post.category === 'bao-loi' 
              ? 'fixed' 
              : isTeacherOrAdmin 
              ? 'answered' 
              : post.status
          };
        }
        return post;
      }));

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    setMentionState({ postId: null, query: '', cursorPos: 0, matchStart: -1 });
    setMentionSuggestions([]);
  };

  // Create New Post handler
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!newTitle.trim() || !newContent.trim()) {
      alert('Vui lòng điền tiêu đề và nội dung bài viết!');
      return;
    }

    const tagList = newTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newPost = {
      id: `post-${Date.now()}`,
      category: newCategory,
      title: newTitle.trim(),
      content: newContent.trim(),
      author: {
        name: user.name,
        avatar: user.avatar || user.name.slice(0, 1),
        role: user.role,
        badge: user.role === 'admin' 
          ? 'Quản trị viên tối cao' 
          : user.role === 'teacher' 
          ? 'Giáo viên phụ trách 🌸' 
          : user.badge || 'Học viên Hanzify'
      },
      createdAt: 'Vừa xong',
      likesCount: 0,
      isLiked: false,
      status: 'pending',
      tags: tagList.length > 0 ? tagList : [newCategory === 'bao-loi' ? 'Báo lỗi' : 'Học tập'],
      comments: []
    };

    const result = await createForumPost(newPost, user);
    if (!result.success) { setLoadError(result.error); return; }
    setPosts((prev) => [newPost, ...prev]);
    setIsNewPostModalOpen(false);
    setNewTitle('');
    setNewContent('');
    setNewTags('');
    setExpandedPostId(newPost.id);
  };

  // Smart Open New Post Modal
  const handleOpenNewPostModal = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (selectedCategory && selectedCategory !== 'all') {
      setNewCategory(selectedCategory);
    } else {
      setNewCategory('thao-luan');
    }
    setIsNewPostModalOpen(true);
  };

  // Quick Change Post Status (Admin & Teacher)
  const handleChangeStatus = async (postId, newStatus, e) => {
    e.stopPropagation();
    const result = await updateForumPost(postId, { status: newStatus });
    if (result.success) setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, status: newStatus } : p)));
    else setLoadError(result.error);
  };

  // Quick Change Post Category (Admin, Teacher, or Post Author)
  const handleChangeCategory = async (postId, newCat, e) => {
    e.stopPropagation();
    const result = await updateForumPost(postId, { category: newCat });
    if (result.success) {
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, category: newCat } : p)));
    } else {
      setLoadError(result.error);
    }
  };

  // =========================================================================
  // MENTION SYSTEM HELPERS (@tag)
  // =========================================================================
  const getMentionableUsers = (currentPost) => {
    const map = new Map();

    // 1. Staff & Teachers
    map.set('Cô Hoài', {
      id: 'teacher-hoai',
      name: 'Cô Hoài',
      avatar: '怀',
      role: 'teacher',
      badge: 'Giáo viên phụ trách 🌸'
    });
    map.set('Nguyen Phuc Long', {
      id: 'admin-long',
      name: 'Nguyen Phuc Long',
      avatar: '👑',
      role: 'admin',
      badge: 'Quản trị viên'
    });

    // 2. Post Author
    if (currentPost?.author?.name) {
      map.set(currentPost.author.name, {
        id: currentPost.author.id || currentPost.author.name,
        name: currentPost.author.name,
        avatar: currentPost.author.avatar || currentPost.author.name.slice(0, 1),
        role: currentPost.author.role || 'student',
        badge: currentPost.author.badge || 'Tác giả bài viết'
      });
    }

    // 3. Current thread commenters
    (currentPost?.comments || []).forEach((c) => {
      if (c.author?.name && !map.has(c.author.name)) {
        map.set(c.author.name, {
          id: c.author.id || c.author.name,
          name: c.author.name,
          avatar: c.author.avatar || c.author.name.slice(0, 1),
          role: c.author.role || 'student',
          badge: c.author.badge || 'Thành viên'
        });
      }
    });

    // 4. Other authors across forum posts
    (posts || []).forEach((p) => {
      if (p.author?.name && !map.has(p.author.name)) {
        map.set(p.author.name, {
          id: p.author.id || p.author.name,
          name: p.author.name,
          avatar: p.author.avatar || p.author.name.slice(0, 1),
          role: p.author.role || 'student',
          badge: p.author.badge || 'Thành viên'
        });
      }
    });

    // 5. System registered users
    (systemUsers || []).forEach((u) => {
      const name = u.name || u.full_name || u.username;
      if (name && !map.has(name)) {
        map.set(name, {
          id: u.id || name,
          name,
          avatar: u.avatar || name.slice(0, 1),
          role: u.role || 'student',
          badge: u.role === 'admin' ? 'Quản trị viên' : u.role === 'teacher' ? 'Giáo viên 🌸' : 'Học viên Hanzify'
        });
      }
    });

    return Array.from(map.values());
  };

  const handleCommentInputChange = (postId, e, currentPost) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart ?? value.length;
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));

    const textBeforeCursor = value.slice(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    if (lastAtIndex !== -1) {
      const isStartOrSpaced = lastAtIndex === 0 || /\s/.test(textBeforeCursor[lastAtIndex - 1]);
      if (isStartOrSpaced) {
        const query = textBeforeCursor.slice(lastAtIndex + 1);
        if (!query.includes('\n') && query.length <= 25) {
          const list = getMentionableUsers(currentPost);
          const filtered = list.filter((u) =>
            u.name.toLowerCase().includes(query.toLowerCase())
          );
          setMentionState({
            postId,
            query,
            cursorPos,
            matchStart: lastAtIndex
          });
          setMentionSuggestions(filtered);
          setMentionActiveIndex(0);
          return;
        }
      }
    }

    setMentionState({ postId: null, query: '', cursorPos: 0, matchStart: -1 });
    setMentionSuggestions([]);
  };

  const handleSelectMention = (postId, userName) => {
    const currentText = commentInputs[postId] || '';
    const { matchStart, cursorPos } = mentionState;

    let newText = '';
    if (matchStart >= 0) {
      const before = currentText.slice(0, matchStart);
      const after = currentText.slice(cursorPos);
      newText = `${before}@${userName} ${after}`;
    } else {
      newText = currentText ? `${currentText} @${userName} ` : `@${userName} `;
    }

    setCommentInputs((prev) => ({ ...prev, [postId]: newText }));
    setMentionState({ postId: null, query: '', cursorPos: 0, matchStart: -1 });
    setMentionSuggestions([]);

    setTimeout(() => {
      const inputEl = commentInputRefs.current[postId];
      if (inputEl) {
        inputEl.focus();
        const newPos = (matchStart >= 0 ? matchStart : currentText.length) + userName.length + 2;
        inputEl.setSelectionRange(newPos, newPos);
      }
    }, 10);
  };

  const handleCommentKeyDown = (postId, e) => {
    if (mentionState.postId === postId && mentionSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setMentionActiveIndex((prev) => (prev + 1) % mentionSuggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setMentionActiveIndex((prev) => (prev - 1 + mentionSuggestions.length) % mentionSuggestions.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        const selected = mentionSuggestions[mentionActiveIndex] || mentionSuggestions[0];
        if (selected) {
          handleSelectMention(postId, selected.name);
        }
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setMentionState({ postId: null, query: '', cursorPos: 0, matchStart: -1 });
        setMentionSuggestions([]);
        return;
      }
    }
  };

  const handleTriggerMention = (postId, currentPost) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    const currentText = commentInputs[postId] || '';
    const newText = currentText.endsWith(' ') || currentText === '' ? `${currentText}@` : `${currentText} @`;
    setCommentInputs((prev) => ({ ...prev, [postId]: newText }));
    const list = getMentionableUsers(currentPost);
    setMentionState({
      postId,
      query: '',
      cursorPos: newText.length,
      matchStart: newText.length - 1
    });
    setMentionSuggestions(list);
    setMentionActiveIndex(0);
    setTimeout(() => {
      const inputEl = commentInputRefs.current[postId];
      if (inputEl) {
        inputEl.focus();
        inputEl.setSelectionRange(newText.length, newText.length);
      }
    }, 10);
  };

  const handleReplyToComment = (postId, authorName) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    const currentText = commentInputs[postId] || '';
    const tag = `@${authorName} `;
    const newText = currentText.includes(tag) ? currentText : `${tag}${currentText}`;
    setCommentInputs((prev) => ({ ...prev, [postId]: newText }));
    setTimeout(() => {
      const inputEl = commentInputRefs.current[postId];
      if (inputEl) {
        inputEl.focus();
        inputEl.setSelectionRange(newText.length, newText.length);
      }
    }, 10);
  };

  const renderContentWithMentions = (content, mentionableUsers = []) => {
    if (!content) return null;

    const names = mentionableUsers.map((u) => u.name).filter(Boolean);
    names.sort((a, b) => b.length - a.length);

    const escapeRegex = (s) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const userPatterns = names.map(escapeRegex).join('|');

    const regex = userPatterns
      ? new RegExp(`(@(?:${userPatterns})|@[A-Za-z0-9_\u00C0-\u1EF9]+(?:\\s+[A-Za-z0-9_\u00C0-\u1EF9]+)?)`, 'gu')
      : /(@[A-Za-z0-9_\u00C0-\u1EF9]+(?:\\s+[A-Za-z0-9_\u00C0-\u1EF9]+)?)/gu;

    const parts = content.split(regex);

    return parts.map((part, index) => {
      if (part && part.startsWith('@')) {
        const name = part.slice(1).trim();
        const isStaff = name === 'Cô Hoài' || name.toLowerCase().includes('admin') || name === 'Nguyen Phuc Long';
        return (
          <span
            key={index}
            style={{
              color: isStaff ? '#991b1b' : '#0369a1',
              background: isStaff ? '#fee2e2' : '#e0f2fe',
              padding: '1px 7px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.84rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
              margin: '0 2px',
              border: isStaff ? '1px solid #fecdd3' : '1px solid #bae6fd'
            }}
            title={`Người dùng được nhắc: ${name}`}
          >
            <span style={{ opacity: 0.75, marginRight: '1px' }}>@</span>
            {name}
          </span>
        );
      }
      return part;
    });
  };

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchQuery =
      searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchCategory && matchQuery;
  });

  const categories = [
    { id: 'all', label: 'Tất Cả Thảo Luận', icon: 'fa-layer-group', count: posts.length },
    { id: 'bai-kho', label: '❓ Hỏi Bài Khó', icon: 'fa-circle-question', count: posts.filter((p) => p.category === 'bai-kho').length },
    { id: 'bao-loi', label: '🐛 Báo Lỗi & Góp Ý Web', icon: 'fa-bug', count: posts.filter((p) => p.category === 'bao-loi').length },
    { id: 'kinh-nghiem', label: '💡 Kinh Nghiệm HSK', icon: 'fa-lightbulb', count: posts.filter((p) => p.category === 'kinh-nghiem').length },
    { id: 'thao-luan', label: '☕ Góc Thảo Luận', icon: 'fa-comments', count: posts.filter((p) => p.category === 'thao-luan').length }
  ];

  return (
    <div className="forum-view-container" style={{ maxWidth: '1120px', margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>
      {loadError && <div role="alert" style={{ marginBottom: '1rem', padding: '0.85rem 1rem', borderRadius: 12, background: '#fef2f2', color: '#991b1b' }}>Không thể tải dữ liệu diễn đàn: {loadError}</div>}
      {/* Header Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #450a0a 100%)',
        borderRadius: '24px',
        padding: '2rem 2.25rem',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 40px -15px rgba(127, 29, 29, 0.4)',
        marginBottom: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.12)'
      }}>
        <span style={{
          position: 'absolute',
          right: '20px',
          top: '-25px',
          fontSize: '10rem',
          fontFamily: 'Noto Serif SC, serif',
          color: 'rgba(255, 255, 255, 0.05)',
          pointerEvents: 'none',
          userSelect: 'none'
        }}>
          坛
        </span>

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '0.35rem 0.8rem',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '0.65rem'
            }}>
              <i className="fa-solid fa-users" style={{ color: '#fed7aa' }}></i>
              <span>Cộng Đồng Hoa Ngữ Hanzify</span>
            </div>
            <h1 style={{ margin: '0 0 0.4rem', fontSize: '2.1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Diễn Đàn Học Tập & Báo Lỗi Web
            </h1>
            <p style={{ margin: 0, fontSize: '0.92rem', color: '#fecaca', maxWidth: '580px', lineHeight: 1.5 }}>
              Nơi giao lưu, giải đáp bài tập hóc búa, chia sẻ bí quyết thi HSK và phản hồi góp ý kỹ thuật trực tiếp tới Cô Hoài & Đội ngũ Admin.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenNewPostModal}
            style={{
              padding: '0.75rem 1.4rem',
              borderRadius: '14px',
              background: '#ffffff',
              color: '#991b1b',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
              transition: 'all 0.2s'
            }}
          >
            <i className="fa-solid fa-pen-nib"></i>
            <span>Đăng Bài Viết Mới</span>
          </button>
        </div>
      </section>

      {/* Main Forum Layout: Category Sidebar (or horizontal bar) + Post Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: '1.5rem', alignItems: 'flex-start' }}>
        
        {/* Left Sidebar: Categories */}
        <aside style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #fee2e2',
          padding: '1.25rem',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
          position: 'sticky',
          top: '90px'
        }}>
          <h3 style={{ margin: '0 0 0.85rem', fontSize: '0.9rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Chuyên Mục
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: isActive ? '#fef2f2' : 'transparent',
                    color: isActive ? '#A11D24' : '#475569',
                    fontWeight: isActive ? 800 : 600,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <i className={`fa-solid ${cat.icon}`} style={{ color: isActive ? '#A11D24' : '#94a3b8', width: '16px' }}></i>
                    <span>{cat.label}</span>
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    background: isActive ? '#fee2e2' : '#f1f5f9',
                    color: isActive ? '#A11D24' : '#64748b',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontWeight: 700
                  }}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid #f1f5f9',
            fontSize: '0.8rem',
            color: '#64748b'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              <i className="fa-solid fa-shield-halved" style={{ color: '#A11D24' }}></i>
              Nội quy diễn đàn
            </div>
            <p style={{ margin: 0, lineHeight: 1.4, fontSize: '0.75rem' }}>
              Vui lòng giữ hòa khí, đăng bài đúng chuyên mục và mô tả rõ ràng câu hỏi/lỗi gặp phải để được giải đáp nhanh nhất.
            </p>
          </div>
        </aside>

        {/* Right Content Area */}
        <main>
          {/* Search Bar */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #fee2e2',
            padding: '0.65rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.25rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            <i className="fa-solid fa-magnifying-glass" style={{ color: '#94a3b8' }}></i>
            <input
              type="text"
              placeholder="Tìm kiếm bài hỏi, từ khóa ngữ pháp, báo lỗi web..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '0.9rem',
                color: '#1e293b'
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Posts Feed */}
          {filteredPosts.length === 0 ? (
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '3rem 2rem',
              textAlign: 'center',
              border: '1px solid #fee2e2'
            }}>
              <i className="fa-solid fa-comments" style={{ fontSize: '3rem', color: '#fca5a5', marginBottom: '1rem' }}></i>
              <h3 style={{ margin: '0 0 0.5rem', color: '#1e293b' }}>Chưa có bài thảo luận nào trong mục này</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 1.25rem' }}>
                Hãy là người đầu tiên đặt câu hỏi hoặc chia sẻ kinh nghiệm nhé!
              </p>
              <button
                type="button"
                onClick={handleOpenNewPostModal}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '10px',
                  background: '#A11D24',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Đăng Bài Ngay
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredPosts.map((post) => {
                const isExpanded = expandedPostId === post.id;
                const commentText = commentInputs[post.id] || '';

                return (
                  <article
                    key={post.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '18px',
                      border: post.status === 'pinned' ? '2px solid #f59e0b' : '1px solid #fee2e2',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                      overflow: 'hidden',
                      transition: 'all 0.2s'
                    }}
                  >
                    {/* Post Card Header */}
                    <div style={{ padding: '1.25rem 1.5rem 0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        {/* Author Info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: post.author.role === 'admin' 
                              ? '#0f172a' 
                              : post.author.role === 'teacher' 
                              ? 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 100%)' 
                              : '#e0f2fe',
                            color: post.author.role === 'student' ? '#0369a1' : '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            fontFamily: 'Noto Serif SC, serif'
                          }}>
                            {post.author.avatar}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                              <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.92rem' }}>
                                {post.author.name}
                              </span>
                              {post.author.role === 'teacher' && (
                                <span style={{
                                  background: '#fee2e2',
                                  color: '#991b1b',
                                  padding: '1px 7px',
                                  borderRadius: '6px',
                                  fontSize: '0.68rem',
                                  fontWeight: 800
                                }}>
                                  👩‍🏫 GIÁO VIÊN
                                </span>
                              )}
                              {post.author.role === 'admin' && (
                                <span style={{
                                  background: '#0f172a',
                                  color: '#f8fafc',
                                  padding: '1px 7px',
                                  borderRadius: '6px',
                                  fontSize: '0.68rem',
                                  fontWeight: 800
                                }}>
                                  👑 ADMIN
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                              {post.author.badge} • {post.createdAt}
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {post.status === 'pinned' && (
                            <span style={{
                              background: '#fef3c7',
                              color: '#b45309',
                              padding: '3px 8px',
                              borderRadius: '8px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <i className="fa-solid fa-thumbtack"></i> Ghim Đầu
                            </span>
                          )}
                          {post.status === 'fixed' && (
                            <span style={{
                              background: '#ecfdf5',
                              color: '#047857',
                              padding: '3px 8px',
                              borderRadius: '8px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <i className="fa-solid fa-circle-check"></i> Đã Sửa Lỗi Web
                            </span>
                          )}
                          {post.status === 'answered' && (
                            <span style={{
                              background: '#e0f2fe',
                              color: '#0369a1',
                              padding: '3px 8px',
                              borderRadius: '8px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <i className="fa-solid fa-chalkboard-user"></i> Đã Có Giải Đáp
                            </span>
                          )}
                          {post.status === 'pending' && (
                            <span style={{
                              background: '#f1f5f9',
                              color: '#64748b',
                              padding: '3px 8px',
                              borderRadius: '8px',
                              fontSize: '0.72rem',
                              fontWeight: 700
                            }}>
                              Chờ giải đáp
                            </span>
                          )}

                          {/* Category Badge */}
                          {post.category === 'bai-kho' && (
                            <span style={{ background: '#ffe4e6', color: '#be123c', padding: '3px 8px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800 }}>
                              ❓ Hỏi Bài Khó
                            </span>
                          )}
                          {post.category === 'bao-loi' && (
                            <span style={{ background: '#ecfdf5', color: '#047857', padding: '3px 8px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800 }}>
                              🐛 Báo Lỗi Web
                            </span>
                          )}
                          {post.category === 'kinh-nghiem' && (
                            <span style={{ background: '#fef3c7', color: '#b45309', padding: '3px 8px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800 }}>
                              💡 Kinh Nghiệm
                            </span>
                          )}
                          {post.category === 'thao-luan' && (
                            <span style={{ background: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800 }}>
                              ☕ Góc Thảo Luận
                            </span>
                          )}

                          {/* Quick Admin/Teacher/Author Category Changer */}
                          {(isTeacherOrAdmin || (user && user.name === post.author?.name)) && (
                            <select
                              value={post.category}
                              onChange={(e) => handleChangeCategory(post.id, e.target.value, e)}
                              title="Chuyển chuyên mục bài viết"
                              style={{
                                padding: '2px 6px',
                                borderRadius: '6px',
                                border: '1px solid #cbd5e1',
                                fontSize: '0.7rem',
                                color: '#475569',
                                background: '#f8fafc',
                                outline: 'none',
                                cursor: 'pointer'
                              }}
                            >
                              <option value="thao-luan">Mục: ☕ Thảo luận</option>
                              <option value="bai-kho">Mục: ❓ Hỏi bài khó</option>
                              <option value="kinh-nghiem">Mục: 💡 Kinh nghiệm</option>
                              <option value="bao-loi">Mục: 🐛 Báo lỗi</option>
                            </select>
                          )}

                          {/* Quick Admin/Teacher Toggle Status Menu */}
                          {isTeacherOrAdmin && (
                            <select
                              value={post.status}
                              onChange={(e) => handleChangeStatus(post.id, e.target.value, e)}
                              style={{
                                padding: '2px 6px',
                                borderRadius: '6px',
                                border: '1px solid #cbd5e1',
                                fontSize: '0.7rem',
                                color: '#475569',
                                background: '#f8fafc',
                                outline: 'none'
                              }}
                            >
                              <option value="pending">Chờ giải đáp</option>
                              <option value="answered">Đã giải đáp</option>
                              <option value="fixed">Đã sửa lỗi (Fixed)</option>
                              <option value="pinned">Ghim đầu</option>
                            </select>
                          )}
                        </div>
                      </div>

                      {/* Post Title & Content */}
                      <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.4 }}>
                        {post.title}
                      </h3>
                      <p style={{
                        margin: '0 0 0.85rem',
                        fontSize: '0.9rem',
                        color: '#334155',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-line'
                      }}>
                        {post.content}
                      </p>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                          {post.tags.map((tag, idx) => (
                            <span 
                              key={idx}
                              style={{
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                color: '#64748b',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: 600
                              }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Post Actions Bar */}
                    <div style={{
                      padding: '0.65rem 1.5rem',
                      background: '#fafafa',
                      borderTop: '1px solid #f1f5f9',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {/* Like Button */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleLike(post.id, e)}
                          style={{
                            background: post.isLiked ? '#fee2e2' : 'transparent',
                            border: post.isLiked ? '1px solid #fca5a5' : '1px solid transparent',
                            color: post.isLiked ? '#dc2626' : '#64748b',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            transition: 'all 0.15s'
                          }}
                        >
                          <i className={post.isLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
                          <span>{post.likesCount} Thích</span>
                        </button>

                        {/* Comment Count / Toggle Button */}
                        <button
                          type="button"
                          onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#64748b',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                          }}
                        >
                          <i className="fa-regular fa-comment-dots"></i>
                          <span>{post.comments?.length || 0} Bình luận</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#A11D24',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        <span>{isExpanded ? 'Thu gọn' : 'Xem phản hồi & Thảo luận'}</span>
                        <i className={`fa-solid ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                      </button>
                    </div>

                    {/* Comments Thread (When expanded) */}
                    {isExpanded && (
                      <div style={{
                        padding: '1.25rem 1.5rem',
                        background: '#f8fafc',
                        borderTop: '1px solid #f1f5f9'
                      }}>
                        {/* List of comments */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
                          {post.comments && post.comments.length > 0 ? (
                            post.comments.map((comment) => (
                              <div
                                key={comment.id}
                                style={{
                                  background: comment.isTeacherAnswer ? '#fff1f2' : '#ffffff',
                                  border: comment.isTeacherAnswer ? '1.5px solid #fecdd3' : '1px solid #e2e8f0',
                                  borderRadius: '14px',
                                  padding: '0.9rem 1.15rem',
                                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontWeight: 800, fontSize: '0.86rem', color: comment.isTeacherAnswer ? '#991b1b' : '#1e293b' }}>
                                      {comment.author.name}
                                    </span>
                                    {comment.isTeacherAnswer && (
                                      <span style={{
                                        background: '#dc2626',
                                        color: '#ffffff',
                                        padding: '1px 6px',
                                        borderRadius: '6px',
                                        fontSize: '0.65rem',
                                        fontWeight: 800
                                      }}>
                                        LỜI GIẢI TỪ CÔ GIÁO
                                      </span>
                                    )}
                                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                      {comment.createdAt}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleReplyToComment(post.id, comment.author.name)}
                                      title={`Trả lời ${comment.author.name}`}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#be123c',
                                        fontSize: '0.72rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        padding: '0 4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '3px'
                                      }}
                                    >
                                      <i className="fa-solid fa-reply" style={{ fontSize: '0.65rem' }}></i>
                                      <span>Trả lời</span>
                                    </button>
                                  </div>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: 1.55, whiteSpace: 'pre-line' }}>
                                  {renderContentWithMentions(comment.content, getMentionableUsers(post))}
                                </p>
                              </div>
                            ))
                          ) : (
                            <div style={{ textAlign: 'center', padding: '1rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                              Chưa có bình luận nào. Hãy gửi phản hồi đầu tiên!
                            </div>
                          )}
                        </div>

                        {/* Comment Input Box with @mention dropdown */}
                        <div style={{ position: 'relative', width: '100%' }}>
                          {/* Mention Suggestion Popover */}
                          {mentionState.postId === post.id && mentionSuggestions.length > 0 && (
                            <div
                              style={{
                                position: 'absolute',
                                bottom: 'calc(100% + 6px)',
                                left: 0,
                                background: '#ffffff',
                                border: '1.5px solid #fecdd3',
                                borderRadius: '16px',
                                boxShadow: '0 12px 30px -4px rgba(159, 18, 57, 0.18)',
                                maxHeight: '220px',
                                width: '320px',
                                maxWidth: '92vw',
                                overflowY: 'auto',
                                zIndex: 100,
                                padding: '6px'
                              }}
                            >
                              <div style={{
                                padding: '4px 8px 6px',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                color: '#9f1239',
                                borderBottom: '1px solid #ffe4e6',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                              }}>
                                <span>
                                  <i className="fa-solid fa-at" style={{ marginRight: '4px' }}></i>
                                  NHẮC TÊN THÀNH VIÊN
                                </span>
                                <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 500 }}>
                                  Dùng ↑↓ Enter
                                </span>
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
                                {mentionSuggestions.map((u, idx) => {
                                  const isSelected = idx === mentionActiveIndex;
                                  const isTeacher = u.role === 'teacher';
                                  const isAdmin = u.role === 'admin';
                                  return (
                                    <div
                                      key={u.id || u.name}
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        handleSelectMention(post.id, u.name);
                                      }}
                                      onMouseEnter={() => setMentionActiveIndex(idx)}
                                      style={{
                                        padding: '6px 8px',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        cursor: 'pointer',
                                        background: isSelected ? '#fff1f2' : 'transparent',
                                        transition: 'background 0.1s'
                                      }}
                                    >
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{
                                          width: '28px',
                                          height: '28px',
                                          borderRadius: '50%',
                                          background: isTeacher
                                            ? 'linear-gradient(135deg, #be123c, #991b1b)'
                                            : isAdmin
                                            ? '#0f172a'
                                            : '#e0f2fe',
                                          color: isTeacher || isAdmin ? '#ffffff' : '#0369a1',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          fontSize: '0.85rem',
                                          fontWeight: 700
                                        }}>
                                          {u.avatar || u.name.slice(0, 1)}
                                        </div>
                                        <div>
                                          <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1e293b' }}>
                                            {u.name}
                                          </div>
                                          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                                            {u.badge}
                                          </div>
                                        </div>
                                      </div>
                                      {isTeacher && (
                                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#be123c', background: '#ffe4e6', padding: '1px 5px', borderRadius: '4px' }}>
                                          Giáo Viên
                                        </span>
                                      )}
                                      {isAdmin && (
                                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#f8fafc', background: '#0f172a', padding: '1px 5px', borderRadius: '4px' }}>
                                          Admin
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          <form onSubmit={(e) => handleAddComment(post.id, e)} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <div style={{
                              flex: 1,
                              display: 'flex',
                              alignItems: 'center',
                              background: '#ffffff',
                              borderRadius: '12px',
                              border: '1.5px solid #cbd5e1',
                              padding: '0 8px',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                            }}>
                              <input
                                ref={(el) => (commentInputRefs.current[post.id] = el)}
                                type="text"
                                placeholder={user ? "Viết câu trả lời... (Gõ @ để nhắc tên bạn bè)" : "Đăng nhập để tham gia thảo luận..."}
                                value={commentText}
                                onChange={(e) => handleCommentInputChange(post.id, e, post)}
                                onKeyDown={(e) => handleCommentKeyDown(post.id, e)}
                                style={{
                                  flex: 1,
                                  padding: '0.65rem 0.5rem',
                                  border: 'none',
                                  fontSize: '0.88rem',
                                  outline: 'none',
                                  background: 'transparent'
                                }}
                              />
                              <button
                                type="button"
                                title="Tag @nhắc tên người dùng"
                                onClick={() => handleTriggerMention(post.id, post)}
                                style={{
                                  background: '#fee2e2',
                                  border: 'none',
                                  color: '#991b1b',
                                  fontWeight: 800,
                                  fontSize: '0.8rem',
                                  cursor: 'pointer',
                                  padding: '4px 8px',
                                  borderRadius: '8px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                  transition: 'all 0.15s'
                                }}
                              >
                                <i className="fa-solid fa-at" style={{ fontSize: '0.75rem' }}></i>
                                <span>Tag</span>
                              </button>
                            </div>

                            <button
                              type="submit"
                              style={{
                                padding: '0.65rem 1.25rem',
                                borderRadius: '12px',
                                background: '#A11D24',
                                color: '#ffffff',
                                border: 'none',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                whiteSpace: 'nowrap',
                                boxShadow: '0 2px 8px rgba(161, 29, 36, 0.2)'
                              }}
                            >
                              <i className="fa-solid fa-paper-plane"></i>
                              <span>Gửi</span>
                            </button>
                          </form>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* MODAL: ĐĂNG BÀI VIẾT MỚI */}
      {isNewPostModalOpen && (
        <div 
          className="modal-backdrop" 
          onClick={() => setIsNewPostModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              maxWidth: '580px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
              animation: 'modalSlideUp 0.3s ease-out'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>
                <i className="fa-solid fa-pen-to-square" style={{ color: '#A11D24', marginRight: '0.4rem' }}></i>
                Tạo Bài Thảo Luận Mới
              </h3>
              <button
                type="button"
                onClick={() => setIsNewPostModalOpen(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Chuyên Mục Phù Hợp *
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                >
                  <option value="thao-luan">☕ Góc Thảo Luận Chung (Tìm bạn học, Chia sẻ)</option>
                  <option value="bai-kho">❓ Hỏi Bài Khó (Ngữ pháp, Đề thi, Phát âm)</option>
                  <option value="kinh-nghiem">💡 Kinh Nghiệm Học HSK (Mẹo thi cử, Lộ trình)</option>
                  <option value="bao-loi">🐛 Báo Lỗi & Góp Ý Web (Âm thanh, Giao diện, Bug)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Tiêu Đề Bài Viết *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Phân biệt cách dùng 把 và 被 trong câu phức HSK 3..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Nội Dung Thảo Luận Chi Tiết *
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="Mô tả cụ thể thắc mắc, bối cảnh câu hỏi hoặc lỗi bạn gặp phải trên web..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.88rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Thẻ Tag (Phân cách bởi dấu phẩy)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: HSK 2, Ngữ pháp, Lỗi âm thanh"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsNewPostModalOpen(false)}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: '10px',
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    color: '#475569',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.65rem 1.5rem',
                    borderRadius: '10px',
                    background: '#A11D24',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 4px 12px rgba(161, 29, 36, 0.3)'
                  }}
                >
                  <i className="fa-solid fa-paper-plane"></i>
                  <span>Đăng Ngay (+20 XP)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
