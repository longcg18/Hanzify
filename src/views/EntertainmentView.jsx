import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { fetchMatchPairs, fetchToneItems, fetchLeaderboard } from '../services/supabaseService';
import {
  MEMORY_PAIRS_BY_LEVEL,
  TONE_ITEMS_BY_LEVEL,
  SPEED_PAIRS_BY_LEVEL,
  RIDDLES_BY_LEVEL
} from '../data/gamesData';

// Helper to convert level pairs into memory card items
const getMemoryCardsForLevel = (lvl) => {
  const pairs = MEMORY_PAIRS_BY_LEVEL[lvl] || MEMORY_PAIRS_BY_LEVEL['HSK 1'];
  return pairs.flatMap((pair) => [
    { id: `${pair.id}-hanzi`, pairId: pair.id, type: 'hanzi', content: pair.hanzi, pinyin: pair.pinyin, mean: pair.mean },
    { id: `${pair.id}-pinyin`, pairId: pair.id, type: 'pinyin', content: `${pair.pinyin} (${pair.mean})`, pinyin: pair.pinyin, mean: pair.mean }
  ]);
};

// ==========================================
// 1. GAME CATALOG METADATA (Danh Mục Trò Chơi)
// ==========================================
const GAMES_CATALOG = [
  {
    id: 'match',
    title: 'Lật Thẻ Ghép Đôi',
    chineseTitle: '连连看',
    category: 'memory',
    categoryLabel: '🃏 Luyện Trí Nhớ',
    level: 'HSK 1 - 3',
    desc: 'Lật mở các cặp thẻ bài úp, ghép đúng Chữ Hán với Pinyin & Nghĩa tương ứng theo từng cấp độ HSK 1, 2, 3.',
    duration: '1 - 2 phút',
    playersCount: 142,
    topScore: '14 Lượt lật',
    icon: '🃏',
    color: '#A11D24'
  },
  {
    id: 'tone',
    title: 'Thử Thách Thanh Điệu',
    chineseTitle: '声调快闪',
    category: 'tone',
    categoryLabel: '⚡ Phản Xạ Âm Điệu',
    level: 'HSK 1 - 3',
    desc: 'Chữ Hán xuất hiện ngẫu nhiên với Pinyin ẩn dấu. Bấm thật nhanh thanh 1 (ˉ), 2 (ˊ), 3 (ˇ), 4 (ˋ) để tăng chuỗi Combo Streak!',
    duration: '60 giây',
    playersCount: 189,
    topScore: '820 điểm',
    icon: '⚡',
    color: '#d97706'
  },
  {
    id: 'speed-match',
    title: 'Nối Nghĩa Thần Tốc',
    chineseTitle: '词汇配对',
    category: 'match',
    categoryLabel: '🧩 Nối Từ Vựng',
    level: 'HSK 1 - 3',
    desc: 'Cột chữ Hán bên trái và cột nghĩa tiếng Việt bên phải. Bấm chọn nhanh từng cặp chuẩn xác trước khi đồng hồ đếm ngược kết thúc!',
    duration: '90 giây',
    playersCount: 115,
    topScore: '950 điểm',
    icon: '🧩',
    color: '#2563eb'
  },
  {
    id: 'hanzi-riddle',
    title: 'Đoán Chữ Hán Theo Nghĩa',
    chineseTitle: '看义猜字',
    category: 'riddle',
    categoryLabel: '🏮 Nhận Diện Chữ Hán',
    level: 'HSK 1 - 3',
    desc: 'Đọc gợi ý ý nghĩa và ngữ cảnh sử dụng, sau đó chọn đúng chữ Hán chính xác trong 4 phương án đề xuất.',
    duration: '10 câu hỏi',
    playersCount: 96,
    topScore: '1000 điểm',
    icon: '🏮',
    color: '#16a34a'
  }
];

// Memory match base cards
const BASE_CARDS = [
  { id: 1, pairId: 'pair-1', type: 'hanzi', content: '苹果', pinyin: 'píngguǒ', mean: 'Quả táo' },
  { id: 2, pairId: 'pair-1', type: 'pinyin', content: 'píngguǒ (Táo)', pinyin: 'píngguǒ', mean: 'Quả táo' },
  { id: 3, pairId: 'pair-2', type: 'hanzi', content: '衣服', pinyin: 'yīfu', mean: 'Quần áo' },
  { id: 4, pairId: 'pair-2', type: 'pinyin', content: 'yīfu (Quần áo)', pinyin: 'yīfu', mean: 'Quần áo' },
  { id: 5, pairId: 'pair-3', type: 'hanzi', content: '买', pinyin: 'mǎi', mean: 'Mua' },
  { id: 6, pairId: 'pair-3', type: 'pinyin', content: 'mǎi (Mua)', pinyin: 'mǎi', mean: 'Mua' },
  { id: 7, pairId: 'pair-4', type: 'hanzi', content: '钱', pinyin: 'qián', mean: 'Tiền' },
  { id: 8, pairId: 'pair-4', type: 'pinyin', content: 'qián (Tiền)', pinyin: 'qián', mean: 'Tiền' },
  { id: 9, pairId: 'pair-5', type: 'hanzi', content: '超市', pinyin: 'chāoshì', mean: 'Siêu thị' },
  { id: 10, pairId: 'pair-5', type: 'pinyin', content: 'chāoshì (Siêu thị)', pinyin: 'chāoshì', mean: 'Siêu thị' },
  { id: 11, pairId: 'pair-6', type: 'hanzi', content: '贵', pinyin: 'guì', mean: 'Đắt' },
  { id: 12, pairId: 'pair-6', type: 'pinyin', content: 'guì (Đắt)', pinyin: 'guì', mean: 'Đắt' }
];

// Tone Blitz questions
const TONE_QUESTIONS = [
  { char: '妈', pinyin: 'mā', tone: 1, mean: 'Mẹ' },
  { char: '国', pinyin: 'guó', tone: 2, mean: 'Quốc gia' },
  { char: '好', pinyin: 'hǎo', tone: 3, mean: 'Tốt / Đẹp' },
  { char: '谢', pinyin: 'xiè', tone: 4, mean: 'Cảm ơn' },
  { char: '喝', pinyin: 'hē', tone: 1, mean: 'Uống' },
  { char: '来', pinyin: 'lái', tone: 2, mean: 'Đến' },
  { char: '买', pinyin: 'mǎi', tone: 3, mean: 'Mua' },
  { char: '去', pinyin: 'qù', tone: 4, mean: 'Đi' }
];

// Speed Word Match pairs
const SPEED_WORD_PAIRS = [
  { id: 'sw-1', hanzi: '多少钱', mean: 'Bao nhiêu tiền' },
  { id: 'sw-2', hanzi: '太贵了', mean: 'Đắt quá rồi' },
  { id: 'sw-3', hanzi: '便宜点儿', mean: 'Rẻ một chút' },
  { id: 'sw-4', hanzi: '欢迎光临', mean: 'Hoan nghênh quý khách' }
];

// Hanzi Riddle questions
const RIDDLE_QUESTIONS = [
  {
    prompt: 'Vật tròn ăn ngọt mát, có vỏ màu đỏ hoặc xanh, hay mua ở siêu thị (píngguǒ):',
    options: ['苹果', '衣服', '西瓜', '茶馆'],
    correct: '苹果',
    pinyin: 'píngguǒ',
    mean: 'Quả táo'
  },
  {
    prompt: 'Hành động trao đổi tiền lấy đồ đạc mang về (mǎi):',
    options: ['买', '卖', '看', '听'],
    correct: '买',
    pinyin: 'mǎi',
    mean: 'Mua'
  },
  {
    prompt: 'Nơi có nhiều gian hàng bán đủ loại thực phẩm, đồ gia dụng (chāoshì):',
    options: ['超市', '学校', '医院', '银行'],
    correct: '超市',
    pinyin: 'chāoshì',
    mean: 'Siêu thị'
  },
  {
    prompt: 'Từ chỉ giá cả cao hơn mức bình thường, muốn xin giảm giá (guì):',
    options: ['贵', '好', '大', '少'],
    correct: '贵',
    pinyin: 'guì',
    mean: 'Đắt'
  },
  {
    prompt: 'Đơn vị tiền tệ quen thuộc của Trung Quốc (kuài / yuán):',
    options: ['块', '角', '分', '斤'],
    correct: '块',
    pinyin: 'kuài',
    mean: 'Đồng / Tệ'
  }
];

export const EntertainmentView = () => {
  const { user } = useAuth();

  // Active game: null (Catalog view) | 'match' | 'tone' | 'speed-match' | 'hanzi-riddle'
  const [activeGame, setActiveGame] = useState(null);

  // Filters (Same pattern as PracticeView)
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [currentGameLevel, setCurrentGameLevel] = useState('HSK 1');
  const [matchCards, setMatchCards] = useState([]);
  const [toneQuestions, setToneQuestions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    Promise.all([fetchMatchPairs(), fetchToneItems(), fetchLeaderboard()]).then(([pairsResult, tonesResult, lbResult]) => {
      if (pairsResult.data && pairsResult.data.length > 0) {
        setMatchCards(pairsResult.data.flatMap((pair) => [
          { id: `${pair.id}-hanzi`, pairId: pair.id, type: 'hanzi', content: pair.hanzi, pinyin: pair.pinyin, mean: pair.mean },
          { id: `${pair.id}-pinyin`, pairId: pair.id, type: 'pinyin', content: `${pair.pinyin} (${pair.mean})`, pinyin: pair.pinyin, mean: pair.mean }
        ]));
      }
      if (tonesResult.data && tonesResult.data.length > 0) {
        setToneQuestions(tonesResult.data);
      }
      setLeaderboard(lbResult?.data || []);
    });
  }, []);

  // Filter games list
  const filteredGames = GAMES_CATALOG.filter((g) => {
    const matchCat = selectedCategory === 'all' || g.category === selectedCategory;
    const matchLvl = selectedLevel === 'all' || g.level.includes(selectedLevel) || g.level === selectedLevel;
    return matchCat && matchLvl;
  });

  // Speech Helper
  const speakWord = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-CN';
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    }
  };

  // ==========================================
  // GAME 1: MEMORY MATCH STATE & LOGIC
  // ==========================================
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  const initMatchGame = (level = currentGameLevel) => {
    const pool = getMemoryCardsForLevel(level);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(cards[index].pairId)) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const firstCard = cards[newFlipped[0]];
      const secondCard = cards[newFlipped[1]];

      if (firstCard.pairId === secondCard.pairId) {
        speakWord(firstCard.pinyin || firstCard.content);
        setMatched((prev) => [...prev, firstCard.pairId]);
        setFlipped([]);

        if (matched.length + 1 === cards.length / 2) {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#A11D24', '#D4AF37', '#ffffff']
          });
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 900);
      }
    }
  };

  // ==========================================
  // GAME 2: TONE BLITZ STATE & LOGIC
  // ==========================================
  const [toneIdx, setToneIdx] = useState(0);
  const [toneScore, setToneScore] = useState(0);
  const [toneStreak, setToneStreak] = useState(0);
  const [toneFeedback, setToneFeedback] = useState(null); // 'correct' | 'wrong'

  const currentToneList = TONE_ITEMS_BY_LEVEL[currentGameLevel] || TONE_ITEMS_BY_LEVEL['HSK 1'];
  const currentToneQ = currentToneList[toneIdx] || currentToneList[0];

  const handleToneAnswer = (selectedTone) => {
    if (toneFeedback || !currentToneQ) return;

    if (selectedTone === currentToneQ.tone) {
      setToneFeedback('correct');
      setToneScore((s) => s + 100 + toneStreak * 20);
      setToneStreak((st) => st + 1);
      speakWord(currentToneQ.char);

      confetti({
        particleCount: 40,
        spread: 45,
        origin: { y: 0.7 },
        colors: ['#16a34a', '#D4AF37']
      });
    } else {
      setToneFeedback('wrong');
      setToneStreak(0);
    }

    setTimeout(() => {
      setToneFeedback(null);
      setToneIdx((prev) => (prev + 1) % currentToneList.length);
    }, 1000);
  };

  // ==========================================
  // GAME 3: SPEED WORD MATCH STATE & LOGIC
  // ==========================================
  const [selectedHanzi, setSelectedHanzi] = useState(null);
  const [speedMatchedIds, setSpeedMatchedIds] = useState([]);
  const [speedScore, setSpeedScore] = useState(0);

  const currentSpeedPairs = SPEED_PAIRS_BY_LEVEL[currentGameLevel] || SPEED_PAIRS_BY_LEVEL['HSK 1'];

  const initSpeedMatch = (level = currentGameLevel) => {
    setSelectedHanzi(null);
    setSpeedMatchedIds([]);
    setSpeedScore(0);
  };

  const handleHanziSelect = (item) => {
    if (speedMatchedIds.includes(item.id)) return;
    setSelectedHanzi(item);
    speakWord(item.hanzi);
  };

  const handleMeanSelect = (item) => {
    if (!selectedHanzi || speedMatchedIds.includes(item.id)) return;

    if (selectedHanzi.id === item.id) {
      // Correct match!
      setSpeedMatchedIds((prev) => [...prev, item.id]);
      setSpeedScore((s) => s + 250);
      setSelectedHanzi(null);

      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.65 },
        colors: ['#2563eb', '#16a34a', '#D4AF37']
      });
    } else {
      // Wrong match
      setSelectedHanzi(null);
    }
  };

  // ==========================================
  // GAME 4: HANZI RIDDLE STATE & LOGIC
  // ==========================================
  const [riddleIdx, setRiddleIdx] = useState(0);
  const [riddleScore, setRiddleScore] = useState(0);
  const [selectedRiddleOpt, setSelectedRiddleOpt] = useState(null);
  const [isRiddleAnswered, setIsRiddleAnswered] = useState(false);

  const currentRiddles = RIDDLES_BY_LEVEL[currentGameLevel] || RIDDLES_BY_LEVEL['HSK 1'];
  const currentRiddle = currentRiddles[riddleIdx] || currentRiddles[0];

  const handleRiddleChoose = (opt) => {
    if (isRiddleAnswered || !currentRiddle) return;
    setSelectedRiddleOpt(opt);
    setIsRiddleAnswered(true);

    if (opt === currentRiddle.correct) {
      setRiddleScore((s) => s + 100);
      speakWord(opt);
      confetti({
        particleCount: 45,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#16a34a', '#D4AF37']
      });
    }
  };

  const handleNextRiddle = () => {
    if (riddleIdx < currentRiddles.length - 1) {
      setRiddleIdx((prev) => prev + 1);
      setSelectedRiddleOpt(null);
      setIsRiddleAnswered(false);
    } else {
      alert(`🎉 Hoàn thành câu đố chữ Hán ${currentGameLevel}! Điểm số: ${riddleScore + (selectedRiddleOpt === currentRiddle?.correct ? 0 : 0)} / ${currentRiddles.length * 100}`);
      setActiveGame(null);
    }
  };

  // Launch game handler
  const handleSelectGame = (gameId, targetLevel) => {
    const level = targetLevel || (['HSK 1', 'HSK 2', 'HSK 3'].includes(selectedLevel) ? selectedLevel : currentGameLevel);
    setCurrentGameLevel(level);
    setActiveGame(gameId);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (gameId === 'match') initMatchGame(level);
    if (gameId === 'tone') {
      setToneIdx(0);
      setToneScore(0);
      setToneStreak(0);
      setToneFeedback(null);
    }
    if (gameId === 'speed-match') initSpeedMatch(level);
    if (gameId === 'hanzi-riddle') {
      setRiddleIdx(0);
      setRiddleScore(0);
      setSelectedRiddleOpt(null);
      setIsRiddleAnswered(false);
    }
  };

  // Level switcher handler inside Runner
  const handleLevelChangeInRunner = (newLevel) => {
    setCurrentGameLevel(newLevel);
    if (activeGame === 'match') initMatchGame(newLevel);
    if (activeGame === 'tone') {
      setToneIdx(0);
      setToneScore(0);
      setToneStreak(0);
      setToneFeedback(null);
    }
    if (activeGame === 'speed-match') initSpeedMatch(newLevel);
    if (activeGame === 'hanzi-riddle') {
      setRiddleIdx(0);
      setRiddleScore(0);
      setSelectedRiddleOpt(null);
      setIsRiddleAnswered(false);
    }
  };

  return (
    <main className="main-content">
      {/* Header Banner */}
      <section className="courses-header feature-page-header" style={{ marginBottom: '2rem' }}>
        <div className="header-meta" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <span className="meta-badge" style={{ background: 'rgba(161, 29, 36, 0.1)', color: '#A11D24', whiteSpace: 'nowrap' }}>
            🎮 Khu Vui Học & Edutainment Lab
          </span>
          <span className="meta-class" style={{ whiteSpace: 'nowrap' }}>
            Vừa Học Vừa Chơi · Củng Cố Phản Xạ Tự Nhiên
          </span>
        </div>

        <h1 className="header-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span>Góc Giải Trí & Mini-Games Ôn Bài</span>
          <span style={{ fontSize: '1.25rem', color: '#A11D24', fontFamily: 'Noto Serif SC, serif' }}>趣味学汉语</span>
        </h1>

        <p className="header-desc">
          Xua tan căng thẳng sau giờ học với các mini-games tương tác thông minh. Rèn luyện trí nhớ từ vựng, phản xạ ngữ điệu và nhận diện mặt chữ Hán một cách hào hứng nhất!
        </p>
      </section>

      {/* ======================================================== */}
      {/* VIEW 1: GAME RUNNER ROOM (Khi đã chọn 1 game để chơi)     */}
      {/* ======================================================== */}
      {activeGame ? (
        <div style={{ maxWidth: '880px', margin: '0 auto' }}>
          {/* Runner Navigation Bar */}
          <div style={{
            background: '#fff',
            border: '1.5px solid #fee2e2',
            borderRadius: '20px',
            padding: '1rem 1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 8px 25px rgba(0,0,0,0.03)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <button
              type="button"
              onClick={() => setActiveGame(null)}
              style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                padding: '0.5rem 1.1rem',
                borderRadius: '10px',
                cursor: 'pointer',
                color: '#475569',
                fontSize: '0.86rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.15s'
              }}
            >
              <i className="fa-solid fa-arrow-left"></i>
              <span>Đổi Game Khác</span>
            </button>

            {/* Current Game Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.4rem' }}>
                {GAMES_CATALOG.find((g) => g.id === activeGame)?.icon}
              </span>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>
                  {GAMES_CATALOG.find((g) => g.id === activeGame)?.title}
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#A11D24', fontFamily: 'Noto Serif SC, serif' }}>
                  {GAMES_CATALOG.find((g) => g.id === activeGame)?.chineseTitle}
                </div>
              </div>
            </div>

            {/* Level Switcher in Runner */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Cấp độ:</span>
              {['HSK 1', 'HSK 2', 'HSK 3'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => handleLevelChangeInRunner(lvl)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    border: currentGameLevel === lvl ? '1.5px solid #A11D24' : '1px solid #cbd5e1',
                    background: currentGameLevel === lvl ? '#A11D24' : '#fff',
                    color: currentGameLevel === lvl ? '#fff' : '#475569',
                    fontSize: '0.82rem',
                    fontWeight: currentGameLevel === lvl ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Quick Reset Button */}
            <button
              type="button"
              onClick={() => handleSelectGame(activeGame, currentGameLevel)}
              style={{
                background: 'rgba(161, 29, 36, 0.08)',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                cursor: 'pointer',
                color: '#A11D24',
                fontSize: '0.84rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <i className="fa-solid fa-rotate-right"></i>
              <span>Chơi Lại</span>
            </button>
          </div>

          {/* ================= RUNNER: GAME 1 MEMORY MATCH ================= */}
          {activeGame === 'match' && (
            <div style={{ background: '#fff', border: '1.5px solid #fee2e2', borderRadius: '24px', padding: '2rem', boxShadow: '0 12px 35px rgba(0,0,0,0.04)' }}>
              {/* Game Stats */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Tiến độ ghép đôi ({currentGameLevel}):</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#A11D24' }}>
                    {matched.length} / {cards.length > 0 ? cards.length / 2 : 8} <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>cặp từ</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Số lượt lật:</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                    {moves} <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>lượt</span>
                  </div>
                </div>
              </div>

              {/* Cards Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '14px',
                marginBottom: '1.5rem'
              }}>
                {cards.map((card, idx) => {
                  const isFlipped = flipped.includes(idx) || matched.includes(card.pairId);
                  const isMatched = matched.includes(card.pairId);

                  return (
                    <div
                      key={card.id}
                      onClick={() => handleCardClick(idx)}
                      style={{
                        height: '110px',
                        perspective: '1000px',
                        cursor: isMatched ? 'default' : 'pointer',
                        userSelect: 'none'
                      }}
                    >
                      <div style={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                      }}>
                        {/* Card Back */}
                        <div style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          backfaceVisibility: 'hidden',
                          background: 'linear-gradient(135deg, #A11D24 0%, #7f1d1d 100%)',
                          borderRadius: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 6px 15px rgba(161, 29, 36, 0.25)',
                          border: '2px solid #fff'
                        }}>
                          <span style={{ fontSize: '2rem', color: '#fff', opacity: 0.85, fontFamily: 'Noto Serif SC, serif' }}>流</span>
                        </div>

                        {/* Card Front */}
                        <div style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)',
                          background: isMatched ? '#f0fdf4' : '#ffffff',
                          border: isMatched ? '2px solid #22c55e' : '2px solid #fee2e2',
                          borderRadius: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0.5rem',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                          textAlign: 'center'
                        }}>
                          {card.type === 'hanzi' ? (
                            <span style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'Noto Serif SC, serif', color: '#A11D24' }}>
                              {card.content}
                            </span>
                          ) : (
                            <div>
                              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>
                                {card.pinyin}
                              </div>
                              <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600 }}>
                                {card.mean}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {cards.length > 0 && matched.length === cards.length / 2 && (
                <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '16px', padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎉</div>
                  <h3 style={{ margin: 0, color: '#16a34a', fontSize: '1.3rem' }}>Chúc mừng bạn đã hoàn thành xuất sắc!</h3>
                  <p style={{ color: '#475569', fontSize: '0.9rem', margin: '0.5rem 0 1rem 0' }}>
                    Bạn đã lật xong toàn bộ cặp từ {currentGameLevel} chỉ trong <strong>{moves} lượt lật</strong>.
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                    <button
                      type="button"
                      onClick={() => initMatchGame(currentGameLevel)}
                      style={{
                        background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                        color: '#fff',
                        border: 'none',
                        padding: '0.65rem 1.5rem',
                        borderRadius: '10px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Chơi Lại Ván Mới
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveGame(null)}
                      style={{
                        background: '#f1f5f9',
                        color: '#334155',
                        border: 'none',
                        padding: '0.65rem 1.2rem',
                        borderRadius: '10px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Chọn Game Khác
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= RUNNER: GAME 2 TONE BLITZ ================= */}
          {activeGame === 'tone' && (
            <div style={{ background: '#fff', border: '1.5px solid #fee2e2', borderRadius: '24px', padding: '2rem', boxShadow: '0 12px 35px rgba(0,0,0,0.04)' }}>
              {/* Score & Streak Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Tổng điểm ({currentGameLevel}):</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#A11D24' }}>
                    {toneScore} <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500 }}>điểm</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Chuỗi thắng liên tiếp:</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: toneStreak > 2 ? '#d97706' : '#0f172a' }}>
                    🔥 Combo x{toneStreak}
                  </div>
                </div>
              </div>

              {/* Central Character Card */}
              <div style={{
                textAlign: 'center',
                padding: '2.5rem 1rem',
                background: toneFeedback === 'correct' ? '#f0fdf4' : toneFeedback === 'wrong' ? '#fef2f2' : '#f8fafc',
                border: toneFeedback === 'correct' ? '2px solid #22c55e' : toneFeedback === 'wrong' ? '2px solid #ef4444' : '1px solid #e2e8f0',
                borderRadius: '20px',
                marginBottom: '2rem',
                transition: 'all 0.25s ease'
              }}>
                <div style={{ fontSize: '4.5rem', fontFamily: 'Noto Serif SC, serif', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                  {currentToneQ?.char}
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#A11D24', marginTop: '0.75rem' }}>
                  {currentToneQ?.pinyin}
                </div>
                <div style={{ fontSize: '0.95rem', color: '#64748b', marginTop: '0.35rem' }}>
                  Nghĩa: {currentToneQ?.mean}
                </div>
              </div>

              {/* 4 Tone Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '1.5rem' }}>
                {[
                  { tone: 1, label: 'Thanh 1 (ˉ)', desc: 'Cao & Bằng' },
                  { tone: 2, label: 'Thanh 2 (ˊ)', desc: 'Đi Lên' },
                  { tone: 3, label: 'Thanh 3 (ˇ)', desc: 'Xuống Rồi Lên' },
                  { tone: 4, label: 'Thanh 4 (ˋ)', desc: 'Dứt Khoát' }
                ].map((item) => (
                  <button
                    key={item.tone}
                    type="button"
                    onClick={() => handleToneAnswer(item.tone)}
                    style={{
                      padding: '1.1rem 0.5rem',
                      borderRadius: '16px',
                      border: '1.5px solid #cbd5e1',
                      background: '#ffffff',
                      cursor: 'pointer',
                      textAlign: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#A11D24' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ================= RUNNER: GAME 3 SPEED WORD MATCH ================= */}
          {activeGame === 'speed-match' && (
            <div style={{ background: '#fff', border: '1.5px solid #fee2e2', borderRadius: '24px', padding: '2rem', boxShadow: '0 12px 35px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Điểm số ({currentGameLevel}):</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563eb' }}>
                    {speedScore} điểm
                  </div>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Đã ghép: <strong>{speedMatchedIds.length} / {currentSpeedPairs.length}</strong>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Hanzi Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase' }}>
                    Cột Chữ Hán:
                  </div>
                  {currentSpeedPairs.map((item) => {
                    const isMatched = speedMatchedIds.includes(item.id);
                    const isSelected = selectedHanzi?.id === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleHanziSelect(item)}
                        style={{
                          padding: '1rem',
                          borderRadius: '12px',
                          border: isMatched ? '2px solid #22c55e' : isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                          background: isMatched ? '#f0fdf4' : isSelected ? '#eff6ff' : '#ffffff',
                          color: isMatched ? '#16a34a' : isSelected ? '#2563eb' : '#0f172a',
                          fontWeight: 700,
                          fontSize: '1.15rem',
                          fontFamily: 'Noto Serif SC, serif',
                          cursor: isMatched ? 'default' : 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        {item.hanzi} {isMatched && '✓'}
                      </button>
                    );
                  })}
                </div>

                {/* Meanings Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase' }}>
                    Cột Nghĩa Tiếng Việt:
                  </div>
                  {currentSpeedPairs.map((item) => {
                    const isMatched = speedMatchedIds.includes(item.id);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleMeanSelect(item)}
                        style={{
                          padding: '1rem',
                          borderRadius: '12px',
                          border: isMatched ? '2px solid #22c55e' : '1px solid #cbd5e1',
                          background: isMatched ? '#f0fdf4' : '#ffffff',
                          color: isMatched ? '#16a34a' : '#0f172a',
                          fontWeight: 600,
                          fontSize: '0.92rem',
                          cursor: isMatched ? 'default' : 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        {item.mean} {isMatched && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {speedMatchedIds.length === currentSpeedPairs.length && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '16px', padding: '1.25rem', textAlign: 'center' }}>
                  <h3 style={{ color: '#16a34a', margin: 0 }}>🎉 Hoàn thành nối từ {currentGameLevel} xuất sắc!</h3>
                  <button
                    type="button"
                    onClick={() => initSpeedMatch(currentGameLevel)}
                    style={{
                      marginTop: '0.75rem',
                      background: '#2563eb',
                      color: '#fff',
                      border: 'none',
                      padding: '0.6rem 1.4rem',
                      borderRadius: '10px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Chơi Lại Ván Mới
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================= RUNNER: GAME 4 HANZI RIDDLE ================= */}
          {activeGame === 'hanzi-riddle' && (
            <div style={{ background: '#fff', border: '1.5px solid #fee2e2', borderRadius: '24px', padding: '2rem', boxShadow: '0 12px 35px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                <span style={{ background: '#fef2f2', color: '#16a34a', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700 }}>
                  Câu {riddleIdx + 1} / {currentRiddles.length} ({currentGameLevel})
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#16a34a' }}>
                  {riddleScore} điểm
                </span>
              </div>

              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '6px', fontWeight: 600 }}>Gợi ý chữ Hán:</div>
                <div style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 700, lineHeight: 1.5 }}>
                  {currentRiddle?.prompt}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '1.5rem' }}>
                {currentRiddle?.options.map((opt) => {
                  let btnBg = '#ffffff';
                  let btnBorder = '1.5px solid #cbd5e1';
                  let btnColor = '#0f172a';

                  if (isRiddleAnswered) {
                    if (opt === currentRiddle.correct) {
                      btnBg = '#f0fdf4';
                      btnBorder = '2px solid #22c55e';
                      btnColor = '#16a34a';
                    } else if (opt === selectedRiddleOpt) {
                      btnBg = '#fef2f2';
                      btnBorder = '2px solid #ef4444';
                      btnColor = '#dc2626';
                    }
                  }

                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleRiddleChoose(opt)}
                      style={{
                        padding: '1.25rem',
                        borderRadius: '16px',
                        background: btnBg,
                        border: btnBorder,
                        color: btnColor,
                        fontSize: '1.8rem',
                        fontFamily: 'Noto Serif SC, serif',
                        fontWeight: 800,
                        cursor: isRiddleAnswered ? 'default' : 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {isRiddleAnswered && (
                <div style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={handleNextRiddle}
                    style={{
                      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                      color: '#fff',
                      border: 'none',
                      padding: '0.75rem 2rem',
                      borderRadius: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {riddleIdx < currentRiddles.length - 1 ? 'Câu tiếp theo ➔' : 'Hoàn thành câu đố ➔'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* ======================================================== */
        /* VIEW 2: GAME CATALOG (Lưới các Game giống Luyện Tập)    */
        /* ======================================================== */
        <>
          {/* Category Filter Buttons (Same as PracticeView) */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {[
              { id: 'all', label: 'Tất Cả Thể Loại' },
              { id: 'memory', label: '🃏 Luyện Trí Nhớ' },
              { id: 'tone', label: '⚡ Phản Xạ Thanh Điệu' },
              { id: 'match', label: '🧩 Nối Từ Vựng' },
              { id: 'riddle', label: '🏮 Nhận Diện Chữ Hán' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '12px',
                  border: selectedCategory === cat.id ? '1.5px solid #A11D24' : '1px solid #e2e8f0',
                  background: selectedCategory === cat.id ? '#A11D24' : '#fff',
                  color: selectedCategory === cat.id ? '#fff' : '#475569',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Level Filter Tags */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Cấp độ:</span>
            {['all', 'HSK 1', 'HSK 2', 'HSK 3'].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                style={{
                  padding: '0.3rem 0.8rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: selectedLevel === lvl ? '#fee2e2' : '#f1f5f9',
                  color: selectedLevel === lvl ? '#A11D24' : '#64748b',
                  fontWeight: selectedLevel === lvl ? 700 : 500,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                {lvl === 'all' ? 'Tất cả cấp độ' : lvl}
              </button>
            ))}
          </div>

          {/* Game Cards Grid (Giống hệt các thẻ Chuyên Đề bên Luyện Tập) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            {filteredGames.map((game) => (
              <div
                key={game.id}
                style={{
                  background: '#fff',
                  border: '1px solid #fee2e2',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ background: '#fef2f2', color: '#A11D24', padding: '0.25rem 0.65rem', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 700 }}>
                      {game.categoryLabel}
                    </span>
                    <span style={{ background: '#f8fafc', color: '#64748b', padding: '0.25rem 0.65rem', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 600 }}>
                      {game.level}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.18rem', color: '#0f172a', margin: '0 0 0.35rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{game.title}</span>
                    <span style={{ fontSize: '1rem', color: '#A11D24', fontFamily: 'Noto Serif SC, serif' }}>
                      {game.chineseTitle}
                    </span>
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {game.desc}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', fontSize: '0.8rem', color: '#64748b' }}>
                    <span>
                      <i className="fa-regular fa-clock" style={{ color: '#A11D24', marginRight: '0.35rem' }}></i>
                      {game.duration}
                    </span>
                    <span>
                      <i className="fa-solid fa-layer-group" style={{ color: '#d97706', marginRight: '0.35rem' }}></i>
                      {game.level}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectGame(game.id, selectedLevel !== 'all' ? selectedLevel : 'HSK 1')}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #A11D24 0%, #7f1d1d 100%)',
                      color: '#fff',
                      border: 'none',
                      padding: '0.65rem 1.25rem',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 12px rgba(161, 29, 36, 0.25)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>Chơi Ngay</span>
                    <i className="fa-solid fa-play" style={{ fontSize: '0.75rem' }}></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Leaderboard Summary Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)',
            border: '1.5px solid #fee2e2',
            borderRadius: '20px',
            padding: '1.5rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '2.2rem' }}>🏆</span>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>
                  Bảng Vàng Kỷ Lục Tuần Này
                </h4>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  {leaderboard.length > 0 ? (
                    <>Top 1: <strong>{leaderboard[0].user_name}</strong> ({leaderboard[0].score} điểm) {leaderboard[1] ? `• Top 2: ${leaderboard[1].user_name} (${leaderboard[1].score} điểm)` : ''}</>
                  ) : (
                    'Chưa có kỷ lục trong tuần này • Hãy chơi ngay để trở thành người đứng đầu!'
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSelectGame('tone')}
              style={{
                background: '#ffffff',
                border: '1.5px solid #fee2e2',
                color: '#A11D24',
                padding: '0.55rem 1.2rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <i className="fa-solid fa-fire"></i>
              <span>Phá Kỷ Lục Ngay</span>
            </button>
          </div>
        </>
      )}
    </main>
  );
};
