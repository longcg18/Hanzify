import React, { useState, useEffect } from 'react';
import {
  fetchUsers,
  createSupabaseUser,
  fetchMatchPairs,
  addMatchPair,
  deleteMatchPair,
  fetchToneItems,
  addToneItem,
  deleteToneItem,
  fetchLeaderboard
} from '../services/supabaseService';
import { checkSupabaseConnection } from '../lib/supabase';



export const AdminUsersView = () => {
  // Main admin sub-tab: 'users' | 'entertainment'
  const [adminSection, setAdminSection] = useState('users');

  // Supabase connection & live state
  const [dbStatus, setDbStatus] = useState({ connected: false, loading: true });
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // ==================== USER MANAGEMENT STATE ====================
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('student');
  const [newPhone, setNewPhone] = useState('');

  // ==================== ENTERTAINMENT MANAGEMENT STATE ====================
  const [gameSubTab, setGameSubTab] = useState('match'); // 'match' | 'tone' | 'leaderboard'
  const [matchPairs, setMatchPairs] = useState([]);
  const [toneItems, setToneItems] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  // New Match Pair Form State
  const [newPairHanzi, setNewPairHanzi] = useState('');
  const [newPairPinyin, setNewPairPinyin] = useState('');
  const [newPairMean, setNewPairMean] = useState('');
  const [newPairCategory, setNewPairCategory] = useState('Từ vựng HSK 2');

  // New Tone Item Form State
  const [newToneChar, setNewToneChar] = useState('');
  const [newTonePinyin, setNewTonePinyin] = useState('');
  const [newToneTone, setNewToneTone] = useState(1);
  const [newToneMean, setNewToneMean] = useState('');

  // Synchronize live data from Supabase
  useEffect(() => {
    async function loadData() {
      try {
        const conn = await checkSupabaseConnection();
        setDbStatus({ connected: conn.connected, loading: false });

        const [usersRes, pairsRes, toneRes, lbRes] = await Promise.all([
          fetchUsers(),
          fetchMatchPairs(),
          fetchToneItems(),
          fetchLeaderboard()
        ]);

        setUsers(usersRes?.data || []);
        setMatchPairs(pairsRes?.data || []);
        setToneItems(toneRes?.data || []);
        setLeaderboard(lbRes?.data || []);
      } catch (err) {
        console.error('Error loading Supabase data:', err);
        setDbStatus({ connected: false, loading: false });
      }
    }
    loadData();
  }, []);

  // Add User Handler (With Supabase Sync)
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const created = {
      id: `user-${Date.now()}`,
      name: newName,
      full_name: newName,
      email: newEmail,
      role: newRole,
      phone: newPhone || '0900 000 000',
      joinedDate: new Date().toLocaleDateString('vi-VN'),
      status: 'active'
    };

    await createSupabaseUser(created);
    setUsers([...users, created]);
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    alert(`🎉 Đã thêm tài khoản [${created.name}] với vai trò [${created.role.toUpperCase()}] vào Supabase thành công!`);
  };

  // Add Match Pair Handler (With Supabase Sync)
  const handleAddMatchPair = async (e) => {
    e.preventDefault();
    if (!newPairHanzi || !newPairPinyin || !newPairMean) {
      alert('Vui lòng nhập đầy đủ Chữ Hán, Pinyin và Nghĩa tiếng Việt!');
      return;
    }

    const newPair = {
      id: `p-${Date.now()}`,
      hanzi: newPairHanzi.trim(),
      pinyin: newPairPinyin.trim(),
      mean: newPairMean.trim(),
      category: newPairCategory
    };

    await addMatchPair(newPair);
    setMatchPairs([newPair, ...matchPairs]);
    setNewPairHanzi('');
    setNewPairPinyin('');
    setNewPairMean('');
    alert(`🎉 Đã thêm cặp thẻ [${newPair.hanzi} - ${newPair.pinyin}] vào Game Lật Thẻ Ghép Đôi trên Supabase!`);
  };

  // Delete Match Pair Handler (With Supabase Sync)
  const handleDeleteMatchPair = async (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa cặp thẻ từ vựng này khỏi game?')) {
      await deleteMatchPair(id);
      setMatchPairs(matchPairs.filter((p) => p.id !== id));
    }
  };

  // Add Tone Question Handler (With Supabase Sync)
  const handleAddToneItem = async (e) => {
    e.preventDefault();
    if (!newToneChar || !newTonePinyin || !newToneMean) {
      alert('Vui lòng nhập đầy đủ Chữ Hán, Pinyin và Nghĩa!');
      return;
    }

    const newItem = {
      id: `t-${Date.now()}`,
      char: newToneChar.trim(),
      pinyin: newTonePinyin.trim(),
      tone: parseInt(newToneTone, 10),
      mean: newToneMean.trim()
    };

    await addToneItem(newItem);
    setToneItems([newItem, ...toneItems]);
    setNewToneChar('');
    setNewTonePinyin('');
    setNewToneMean('');
    alert(`🎉 Đã thêm chữ [${newItem.char} (${newItem.pinyin} - Thanh ${newItem.tone})] vào Thử Thách Thanh Điệu trên Supabase!`);
  };

  // Delete Tone Item Handler (With Supabase Sync)
  const handleDeleteToneItem = async (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa câu hỏi thanh điệu này khỏi game?')) {
      await deleteToneItem(id);
      setToneItems(toneItems.filter((t) => t.id !== id));
    }
  };

  // Speech helper
  const speakWord = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-CN';
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <main className="main-content">
      {/* Admin Header */}
      <section className="courses-header" style={{ marginBottom: '2rem' }}>
        <div className="header-meta" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <span className="meta-badge" style={{ background: 'rgba(161, 29, 36, 0.1)', color: '#A11D24', whiteSpace: 'nowrap' }}>
            👑 Bảng Quản Trị Hệ Thống (Admin Panel)
          </span>
          <span className="meta-class" style={{ whiteSpace: 'nowrap' }}>Toàn Quyền Quản Trị Hệ Thống · Nguyễn Phúc Long</span>

          {/* Supabase Connection Status Badge */}
          <span style={{
            background: dbStatus.connected ? '#f0fdf4' : '#fffbeb',
            color: dbStatus.connected ? '#16a34a' : '#d97706',
            border: dbStatus.connected ? '1px solid #bbf7d0' : '1px solid #fde68a',
            padding: '0.25rem 0.75rem',
            borderRadius: '999px',
            fontSize: '0.78rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            whiteSpace: 'nowrap'
          }}>
            <i className="fa-solid fa-database"></i>
            {dbStatus.connected ? '🟢 Supabase DB: Đã Kết Nối' : '🟡 Supabase DB: Đang Kết Nối'}
          </span>

          <button
            type="button"
            onClick={() => setShowSqlModal(true)}
            style={{
              background: '#f8fafc',
              border: '1px solid #fee2e2',
              color: '#A11D24',
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            <i className="fa-solid fa-file-code"></i>
            Xem Script SQL Supabase
          </button>
        </div>

        <h1 className="header-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span>{adminSection === 'users' ? 'Quản Lý Người Dùng & Phân Quyền' : 'Quản Trị Góc Giải Trí & Mini-Games'}</span>
          <span style={{ fontSize: '1.25rem', color: '#A11D24', fontFamily: 'Noto Serif SC, serif' }}>
            {adminSection === 'users' ? '用户权限管理' : '娱乐游戏管理'}
          </span>
        </h1>

        <p className="header-desc">
          {adminSection === 'users'
            ? 'Quản lý tài khoản Admin, Teacher (Giáo viên chấm bài) và Student (Học viên). Cấp quyền và theo dõi hoạt động.'
            : 'Quản trị ngân hàng thẻ từ vựng Lật Thẻ Ghép Đôi, kho câu đố Thử Thách Thanh Điệu và theo dõi bảng xếp hạng học viên.'}
        </p>

        {/* Primary Sub-Nav Switcher: Người Dùng & Giải Trí */}
        <div style={{
          display: 'flex',
          gap: '0.6rem',
          marginTop: '1.5rem',
          background: '#f8fafc',
          padding: '0.4rem',
          borderRadius: '16px',
          border: '1px solid #fee2e2',
          width: 'fit-content',
          flexWrap: 'wrap'
        }}>
          <button
            type="button"
            onClick={() => setAdminSection('users')}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '12px',
              border: 'none',
              background: adminSection === 'users' ? '#A11D24' : 'transparent',
              color: adminSection === 'users' ? '#ffffff' : '#64748b',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: adminSection === 'users' ? '0 4px 12px rgba(161, 29, 36, 0.25)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <i className="fa-solid fa-users-gear"></i>
            <span>Người Dùng & Phân Quyền ({users.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setAdminSection('entertainment')}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '12px',
              border: 'none',
              background: adminSection === 'entertainment' ? '#A11D24' : 'transparent',
              color: adminSection === 'entertainment' ? '#ffffff' : '#64748b',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: adminSection === 'entertainment' ? '0 4px 12px rgba(161, 29, 36, 0.25)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <i className="fa-solid fa-gamepad"></i>
            <span>Quản Trị Góc Giải Trí ({matchPairs.length + toneItems.length} Từ vựng)</span>
          </button>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 1: USER MANAGEMENT VIEW                           */}
      {/* ========================================================= */}
      {adminSection === 'users' && (
        <div>
          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ color: '#64748b', fontSize: '0.92rem' }}>
              Danh sách tài khoản hệ thống đang hoạt động: <strong>{users.length}</strong> thành viên
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                background: 'linear-gradient(135deg, #A11D24 0%, #7f1d1d 100%)',
                color: '#fff',
                border: 'none',
                padding: '0.7rem 1.35rem',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(161, 29, 36, 0.25)'
              }}
            >
              <i className="fa-solid fa-user-plus"></i>
              Thêm Tài Khoản Mới
            </button>
          </div>

          {/* Users Table */}
          <div style={{ background: '#fff', border: '1px solid #fee2e2', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '1.1rem 1.5rem', whiteSpace: 'nowrap' }}>Họ và Tên</th>
                  <th style={{ padding: '1.1rem 1.5rem', whiteSpace: 'nowrap' }}>Email / Số Điện Thoại</th>
                  <th style={{ padding: '1.1rem 1.5rem', whiteSpace: 'nowrap' }}>Vai Trò (Role)</th>
                  <th style={{ padding: '1.1rem 1.5rem', whiteSpace: 'nowrap' }}>Ngày Tham Gia</th>
                  <th style={{ padding: '1.1rem 1.5rem', whiteSpace: 'nowrap' }}>Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  let roleBadge = { bg: '#f1f5f9', color: '#475569', label: 'Học viên (Student)' };
                  if (u.role === 'admin') roleBadge = { bg: '#fef2f2', color: '#A11D24', label: '👑 Admin (Quản trị)' };
                  if (u.role === 'teacher') roleBadge = { bg: '#f0fdf4', color: '#16a34a', label: '👩‍🏫 Giáo viên (Teacher)' };

                  return (
                    <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '1.2rem 1.5rem', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{u.name}</div>
                        {u.chineseName && <div style={{ fontSize: '0.82rem', color: '#A11D24' }}>{u.chineseName}</div>}
                      </td>
                      <td style={{ padding: '1.2rem 1.5rem', whiteSpace: 'nowrap' }}>
                        <div style={{ color: '#334155' }}>{u.email}</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{u.phone}</div>
                      </td>
                      <td style={{ padding: '1.2rem 1.5rem', whiteSpace: 'nowrap' }}>
                        <span style={{
                          background: roleBadge.bg,
                          color: roleBadge.color,
                          padding: '0.35rem 0.8rem',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}>
                          {roleBadge.label}
                        </span>
                      </td>
                      <td style={{ padding: '1.2rem 1.5rem', whiteSpace: 'nowrap', color: '#64748b', fontSize: '0.88rem' }}>
                        {u.joinedDate}
                      </td>
                      <td style={{ padding: '1.2rem 1.5rem', whiteSpace: 'nowrap' }}>
                        <span style={{
                          background: '#f0fdf4',
                          color: '#16a34a',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}>
                          <i className="fa-solid fa-circle" style={{ fontSize: '0.5rem' }}></i> Hoạt động
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 2: ENTERTAINMENT & MINI-GAMES MANAGEMENT          */}
      {/* ========================================================= */}
      {adminSection === 'entertainment' && (
        <div>
          {/* Mini-Games Stats Overview */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '1.75rem'
          }}>
            <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #fee2e2', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
                🃏 Cặp Thẻ Ghép Đôi
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#A11D24' }}>
                {matchPairs.length} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#94a3b8' }}>cặp ({matchPairs.length * 2} thẻ)</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '4px' }}>✓ Đang hoạt động trên app</div>
            </div>

            <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #fee2e2', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
                ⚡ Câu Đố Thanh Điệu
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#d97706' }}>
                {toneItems.length} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#94a3b8' }}>chữ Hán</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '4px' }}>✓ Tích hợp Web Speech Audio</div>
            </div>

            <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #fee2e2', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
                👥 Lượt Học Viên Chơi
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
                142 <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#94a3b8' }}>lượt</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Tăng 28% so với tuần trước</div>
            </div>

            <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #fee2e2', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
                🏆 Kỷ Lục Điểm Cao Nhất
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#16a34a' }}>
                820 <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#94a3b8' }}>điểm</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Học viên: Nguyễn Minh Anh</div>
            </div>
          </div>

          {/* Mini-Games Inner Navigation */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            borderBottom: '2px solid #fee2e2',
            marginBottom: '1.5rem',
            paddingBottom: '0.5rem'
          }}>
            <button
              type="button"
              onClick={() => setGameSubTab('match')}
              style={{
                padding: '0.55rem 1.15rem',
                borderRadius: '10px',
                border: 'none',
                background: gameSubTab === 'match' ? '#A11D24' : 'transparent',
                color: gameSubTab === 'match' ? '#ffffff' : '#64748b',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span>🃏 Game 1: Lật Thẻ Ghép Đôi</span>
            </button>

            <button
              type="button"
              onClick={() => setGameSubTab('tone')}
              style={{
                padding: '0.55rem 1.15rem',
                borderRadius: '10px',
                border: 'none',
                background: gameSubTab === 'tone' ? '#A11D24' : 'transparent',
                color: gameSubTab === 'tone' ? '#ffffff' : '#64748b',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span>⚡ Game 2: Thử Thách Thanh Điệu</span>
            </button>

            <button
              type="button"
              onClick={() => setGameSubTab('leaderboard')}
              style={{
                padding: '0.55rem 1.15rem',
                borderRadius: '10px',
                border: 'none',
                background: gameSubTab === 'leaderboard' ? '#A11D24' : 'transparent',
                color: gameSubTab === 'leaderboard' ? '#ffffff' : '#64748b',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span>🏆 Bảng Xếp Hạng Học Viên</span>
            </button>
          </div>

          {/* ================= GAME SUB-TAB 1: MEMORY MATCH ================= */}
          {gameSubTab === 'match' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem', alignItems: 'flex-start' }}>
              {/* Word Pairs List */}
              <div style={{ background: '#fff', border: '1px solid #fee2e2', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>
                    Kho Cặp Thẻ Từ Vựng ({matchPairs.length} cặp)
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Học viên lật ghép đôi Hanzi & Pinyin/Nghĩa</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {matchPairs.map((pair, idx) => (
                    <div
                      key={pair.id}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        background: '#f8fafc',
                        border: '1px solid #f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontWeight: 800, color: '#94a3b8', fontSize: '0.85rem', width: '20px' }}>
                          0{idx + 1}
                        </span>

                        {/* Hanzi Card Preview */}
                        <div style={{
                          background: '#fff',
                          border: '1.5px solid #fee2e2',
                          borderRadius: '8px',
                          padding: '4px 12px',
                          fontSize: '1.2rem',
                          fontFamily: 'Noto Serif SC, serif',
                          fontWeight: 700,
                          color: '#A11D24'
                        }}>
                          {pair.hanzi}
                        </div>

                        {/* Pinyin & Meaning */}
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                            {pair.pinyin}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                            {pair.mean} • <span style={{ color: '#16a34a' }}>{pair.category}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => speakWord(pair.hanzi)}
                          title="Phát âm từ vựng"
                          style={{
                            background: '#f1f5f9',
                            border: 'none',
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            color: '#334155'
                          }}
                        >
                          <i className="fa-solid fa-volume-high"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMatchPair(pair.id)}
                          title="Xóa cặp thẻ này"
                          style={{
                            background: '#fee2e2',
                            border: 'none',
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            color: '#dc2626'
                          }}
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Pair Card */}
              <div style={{ background: '#fff', border: '1.5px solid #fee2e2', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>➕</span>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>Thêm Cặp Thẻ Mới</h3>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.25rem', lineHeight: 1.4 }}>
                  Cặp thẻ mới sẽ được tự động xáo trộn ngẫu nhiên vào bàn chơi của học viên.
                </p>

                <form onSubmit={handleAddMatchPair} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Chữ Hán (Ví dụ: 朋友, 汉语):
                    </label>
                    <input
                      type="text"
                      value={newPairHanzi}
                      onChange={(e) => setNewPairHanzi(e.target.value)}
                      placeholder="朋友"
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '1rem',
                        fontFamily: 'Noto Serif SC, serif',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Pinyin kèm dấu (Ví dụ: péngyou):
                    </label>
                    <input
                      type="text"
                      value={newPairPinyin}
                      onChange={(e) => setNewPairPinyin(e.target.value)}
                      placeholder="péngyou"
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.92rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Nghĩa tiếng Việt (Ví dụ: Bạn bè):
                    </label>
                    <input
                      type="text"
                      value={newPairMean}
                      onChange={(e) => setNewPairMean(e.target.value)}
                      placeholder="Bạn bè"
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.92rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Chủ đề phân loại:
                    </label>
                    <select
                      value={newPairCategory}
                      onChange={(e) => setNewPairCategory(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.88rem',
                        outline: 'none',
                        background: '#fff'
                      }}
                    >
                      <option value="Từ vựng HSK 1">Từ vựng HSK 1 Căn bản</option>
                      <option value="Từ vựng HSK 2">Từ vựng HSK 2 Đời sống</option>
                      <option value="Mua sắm & Giá tiền">Mua sắm & Giá tiền</option>
                      <option value="Ẩm thực & Nhà hàng">Ẩm thực & Nhà hàng</option>
                      <option value="Phương hướng & Giao thông">Phương hướng & Giao thông</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.75rem',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #A11D24 0%, #7f1d1d 100%)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      boxShadow: '0 4px 12px rgba(161, 29, 36, 0.25)'
                    }}
                  >
                    <i className="fa-solid fa-plus"></i>
                    <span>Thêm Cặp Thẻ Vào Game</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ================= GAME SUB-TAB 2: TONE QUIZ ================= */}
          {gameSubTab === 'tone' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem', alignItems: 'flex-start' }}>
              {/* Tone Question List */}
              <div style={{ background: '#fff', border: '1px solid #fee2e2', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>
                    Kho Câu Đố Thanh Điệu ({toneItems.length} chữ)
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Học viên bấm chọn thanh 1, 2, 3, 4</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {toneItems.map((item, idx) => (
                    <div
                      key={item.id}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        background: '#f8fafc',
                        border: '1px solid #f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontWeight: 800, color: '#94a3b8', fontSize: '0.85rem', width: '20px' }}>
                          0{idx + 1}
                        </span>

                        {/* Hanzi */}
                        <div style={{
                          background: '#fff',
                          border: '1.5px solid #fee2e2',
                          borderRadius: '8px',
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.3rem',
                          fontFamily: 'Noto Serif SC, serif',
                          fontWeight: 700,
                          color: '#A11D24'
                        }}>
                          {item.char}
                        </div>

                        {/* Pinyin & Tone */}
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{item.pinyin}</span>
                            <span style={{
                              background: '#fef2f2',
                              color: '#A11D24',
                              padding: '1px 6px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 800
                            }}>
                              Thanh {item.tone}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                            Nghĩa: {item.mean}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => speakWord(item.char)}
                          title="Phát âm chữ này"
                          style={{
                            background: '#f1f5f9',
                            border: 'none',
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            color: '#334155'
                          }}
                        >
                          <i className="fa-solid fa-volume-high"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteToneItem(item.id)}
                          title="Xóa câu hỏi này"
                          style={{
                            background: '#fee2e2',
                            border: 'none',
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            color: '#dc2626'
                          }}
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Tone Item Card */}
              <div style={{ background: '#fff', border: '1.5px solid #fee2e2', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>⚡</span>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>Thêm Câu Đố Thanh Điệu</h3>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.25rem', lineHeight: 1.4 }}>
                  Chữ Hán sẽ xuất hiện dạng flash quiz đếm ngược 10 giây để rèn phản xạ cho học viên.
                </p>

                <form onSubmit={handleAddToneItem} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Chữ Hán đơn (Ví dụ: 谁, 吃, 想):
                    </label>
                    <input
                      type="text"
                      value={newToneChar}
                      onChange={(e) => setNewToneChar(e.target.value)}
                      placeholder="谁"
                      maxLength={2}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '1.1rem',
                        fontFamily: 'Noto Serif SC, serif',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Pinyin kèm dấu thanh (Ví dụ: shéi, chī):
                    </label>
                    <input
                      type="text"
                      value={newTonePinyin}
                      onChange={(e) => setNewTonePinyin(e.target.value)}
                      placeholder="shéi"
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.92rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Thanh điệu chuẩn xác:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                      {[1, 2, 3, 4].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setNewToneTone(t)}
                          style={{
                            padding: '0.55rem',
                            borderRadius: '10px',
                            border: newToneTone === t ? '2px solid #A11D24' : '1px solid #cbd5e1',
                            background: newToneTone === t ? '#fef2f2' : '#ffffff',
                            color: newToneTone === t ? '#A11D24' : '#334155',
                            fontWeight: 800,
                            fontSize: '0.85rem',
                            cursor: 'pointer'
                          }}
                        >
                          Thanh {t} {t === 1 ? '¯' : t === 2 ? '´' : t === 3 ? 'ˇ' : '`'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Nghĩa tiếng Việt (Ví dụ: Ai, Ai đó):
                    </label>
                    <input
                      type="text"
                      value={newToneMean}
                      onChange={(e) => setNewToneMean(e.target.value)}
                      placeholder="Ai / Người nào"
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.92rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.75rem',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      boxShadow: '0 4px 12px rgba(217, 119, 6, 0.25)'
                    }}
                  >
                    <i className="fa-solid fa-bolt"></i>
                    <span>Thêm Câu Đố Thanh Điệu</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ================= GAME SUB-TAB 3: LEADERBOARD ================= */}
          {gameSubTab === 'leaderboard' && (
            <div style={{ background: '#fff', border: '1px solid #fee2e2', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #fee2e2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>Bảng Xếp Hạng Mini-Games Tuần Này</h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>Vinh danh học viên đạt điểm cao và chuỗi trả lời liên tiếp</div>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Đã thiết lập lại bảng xếp hạng sang tuần thi đua mới!')}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    padding: '0.5rem 0.95rem',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#475569',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <i className="fa-solid fa-arrows-rotate"></i> Reset Điểm Tuần
                </button>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>Thứ Hạng</th>
                    <th style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>Học Viên</th>
                    <th style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>Mini Game</th>
                    <th style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>Thành Tích</th>
                    <th style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>Điểm Số</th>
                    <th style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>Thời Gian</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((row) => (
                    <tr key={row.rank} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '1.1rem 1.5rem', whiteSpace: 'nowrap' }}>
                        <span style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.9rem',
                          background: row.rank === 1 ? '#fef3c7' : row.rank === 2 ? '#f1f5f9' : '#ffedd5',
                          color: row.rank === 1 ? '#b45309' : row.rank === 2 ? '#475569' : '#c2410c'
                        }}>
                          {row.rank === 1 ? '🥇' : row.rank === 2 ? '🥈' : '🥉'}
                        </span>
                      </td>
                      <td style={{ padding: '1.1rem 1.5rem', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{row.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{row.role}</div>
                      </td>
                      <td style={{ padding: '1.1rem 1.5rem', whiteSpace: 'nowrap', color: '#334155', fontWeight: 600, fontSize: '0.88rem' }}>
                        {row.game}
                      </td>
                      <td style={{ padding: '1.1rem 1.5rem', whiteSpace: 'nowrap' }}>
                        <span style={{ background: '#fef2f2', color: '#A11D24', padding: '3px 8px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700 }}>
                          🔥 {row.streak}
                        </span>
                      </td>
                      <td style={{ padding: '1.1rem 1.5rem', whiteSpace: 'nowrap' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#16a34a' }}>
                          {row.score} đ
                        </span>
                      </td>
                      <td style={{ padding: '1.1rem 1.5rem', whiteSpace: 'nowrap', color: '#94a3b8', fontSize: '0.82rem' }}>
                        {row.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal Add User */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="auth-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <button type="button" className="btn-modal-close" onClick={() => setShowAddModal(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="auth-modal-header" style={{ marginBottom: '1.5rem' }}>
              <div className="auth-badge">👑 Quản Trị Hệ Thống</div>
              <h2 className="auth-title">Tạo Tài Khoản Mới</h2>
              <p className="auth-subtitle">Cấp tài khoản đăng nhập cho Giáo Viên hoặc Học Viên mới</p>
            </div>

            <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Họ và Tên:
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ví dụ: Lê Thị Hoa"
                  required
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Email Đăng Nhập:
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="hoa.le@hanzify.com"
                  required
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Số Điện Thoại:
                </label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="0912 345 678"
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Phân Quyền Vai Trò (Role):
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', outline: 'none', background: '#fff' }}
                >
                  <option value="student">🎓 Học Viên (Làm bài tập & luyện thi)</option>
                  <option value="teacher">👩‍🏫 Giáo Viên (Chấm bài & nhận xét)</option>
                  <option value="admin">👑 Admin (Toàn quyền quản trị hệ thống)</option>
                </select>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '0.75rem',
                  padding: '0.85rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #A11D24 0%, #7f1d1d 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
              >
                Xác Nhận Tạo Tài Khoản
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SQL Script Viewer & Copy Modal for Supabase Migration */}
      {showSqlModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '780px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            border: '1.5px solid #fee2e2'
          }}>
            {/* Header */}
            <div style={{
              padding: '1.25rem 1.75rem',
              borderBottom: '1px solid #fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#fff5f5'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1.4rem' }}>🛠️</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a' }}>
                    Script Khởi Tạo Cơ Sở Dữ Liệu Supabase (schema.sql)
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Project URL: <strong>https://vwuikidgncknuozufiyi.supabase.co</strong>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSqlModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.4rem',
                  cursor: 'pointer',
                  color: '#94a3b8'
                }}
              >
                ✕
              </button>
            </div>

            {/* Instruction */}
            <div style={{ padding: '1rem 1.75rem 0.5rem 1.75rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.86rem', color: '#334155', lineHeight: 1.5 }}>
              💡 <strong>Hướng dẫn:</strong> Bấm nút <strong>"Sao Chép Script SQL"</strong> bên dưới, sau đó mở tab <strong>SQL Editor</strong> trên trang quản lý Supabase của bạn và dán vào rồi bấm <strong>Run</strong> để tự động tạo 8 bảng, cấu hình RLS và nạp dữ liệu mẫu ban đầu.
            </div>

            {/* SQL Content Area */}
            <div style={{ padding: '1rem 1.75rem', overflowY: 'auto', flex: 1, background: '#0f172a' }}>
              <pre style={{ margin: 0, color: '#e2e8f0', fontFamily: 'Consolas, monospace', fontSize: '0.82rem', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
{`-- HANZIFY SUPABASE SCHEMA (schema.sql)
-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT DEFAULT '123456',
  full_name TEXT NOT NULL,
  chinese_name TEXT,
  role TEXT CHECK (role IN ('admin', 'teacher', 'student')) DEFAULT 'student',
  avatar TEXT DEFAULT '安',
  phone TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  chinese_title TEXT,
  level TEXT NOT NULL,
  description TEXT,
  tag TEXT,
  total_lessons INTEGER DEFAULT 12,
  teacher_name TEXT DEFAULT 'Cô Hoài',
  teacher_avatar TEXT DEFAULT '怀',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. LESSONS TABLE
CREATE TABLE IF NOT EXISTS public.lessons (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  chinese_title TEXT,
  description TEXT,
  hsk_level TEXT DEFAULT 'HSK 2',
  is_unlocked BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. HOMEWORK QUESTIONS
CREATE TABLE IF NOT EXISTS public.homework_questions (
  id TEXT PRIMARY KEY,
  lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  prompt TEXT NOT NULL,
  data_json JSONB NOT NULL,
  sort_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.submissions (
  id TEXT PRIMARY KEY,
  lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  student_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'graded')) DEFAULT 'pending',
  total_score NUMERIC(4, 1),
  teacher_comment TEXT,
  teacher_audio_feedback TEXT,
  answers_json JSONB DEFAULT '{}'::jsonb
);

-- 6. GAME MATCH PAIRS
CREATE TABLE IF NOT EXISTS public.game_match_pairs (
  id TEXT PRIMARY KEY,
  hanzi TEXT NOT NULL,
  pinyin TEXT NOT NULL,
  mean TEXT NOT NULL,
  category TEXT DEFAULT 'Từ vựng HSK 2',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. GAME TONE ITEMS
CREATE TABLE IF NOT EXISTS public.game_tone_items (
  id TEXT PRIMARY KEY,
  char TEXT NOT NULL,
  pinyin TEXT NOT NULL,
  tone INTEGER CHECK (tone IN (1, 2, 3, 4)) NOT NULL,
  mean TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. GAME LEADERBOARD
CREATE TABLE IF NOT EXISTS public.game_leaderboard (
  id TEXT PRIMARY KEY,
  user_name TEXT NOT NULL,
  role TEXT DEFAULT 'Học viên',
  score INTEGER NOT NULL,
  game TEXT NOT NULL,
  streak TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ENABLE ROW LEVEL SECURITY & POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homework_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_match_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_tone_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Courses" ON public.courses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Lessons" ON public.lessons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Questions" ON public.homework_questions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Submissions" ON public.submissions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Pairs" ON public.game_match_pairs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Tones" ON public.game_tone_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Leaderboard" ON public.game_leaderboard FOR ALL USING (true) WITH CHECK (true);`}
              </pre>
            </div>

            {/* Footer Buttons */}
            <div style={{
              padding: '1rem 1.75rem',
              borderTop: '1px solid #fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f8fafc'
            }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                {copiedSql ? '✓ Đã sao chép vào bộ nhớ tạm!' : 'Tệp gốc nằm tại: supabase/schema.sql'}
              </span>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    fetch('/api/supabase/schema')
                      .then((r) => r.text())
                      .then((sql) => {
                        navigator.clipboard.writeText(sql);
                        setCopiedSql(true);
                        setTimeout(() => setCopiedSql(false), 3000);
                      })
                      .catch(() => {
                        navigator.clipboard.writeText('Vui lòng copy từ file supabase/schema.sql');
                      });
                  }}
                  style={{
                    background: copiedSql ? '#16a34a' : 'linear-gradient(135deg, #A11D24 0%, #7f1d1d 100%)',
                    color: '#fff',
                    border: 'none',
                    padding: '0.65rem 1.3rem',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 4px 12px rgba(161, 29, 36, 0.25)'
                  }}
                >
                  <i className={copiedSql ? 'fa-solid fa-check' : 'fa-solid fa-copy'}></i>
                  <span>{copiedSql ? 'Đã Sao Chép SQL!' : 'Sao Chép Script SQL'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSqlModal(false)}
                  style={{
                    background: '#e2e8f0',
                    color: '#334155',
                    border: 'none',
                    padding: '0.65rem 1.1rem',
                    borderRadius: '10px',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    cursor: 'pointer'
                  }}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
