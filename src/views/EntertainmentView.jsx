import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { fetchMatchPairs, fetchToneItems, fetchLeaderboard, addGameRewardXp } from '../services/supabaseService';
import {
  MEMORY_PAIRS_BY_LEVEL,
  TONE_ITEMS_BY_LEVEL,
  SPEED_PAIRS_BY_LEVEL,
  RIDDLES_BY_LEVEL
} from '../data/gamesData';
import {
  HSK_LEVELS,
  HSK_VOCABULARY_LIST,
  getVocabulariesByLevel,
  getRandomGamePairs,
  getRandomToneItems
} from '../data/hskVocabularyData';

// Difficulty configurations and point rewards across all 6 HSK levels
export const GAME_DIFFICULTY_REWARDS = {
  'HSK 1': {
    label: 'Cơ bản (Dễ)',
    badgeColor: '#16a34a',
    badgeBg: '#f0fdf4',
    border: '#bbf7d0',
    baseXp: 35,
    tag: '+35 XP'
  },
  'HSK 2': {
    label: 'Sơ trung cấp',
    badgeColor: '#0284c7',
    badgeBg: '#f0f9ff',
    border: '#bae6fd',
    baseXp: 50,
    tag: '+50 XP'
  },
  'HSK 3': {
    label: 'Trung cấp (Vừa)',
    badgeColor: '#d97706',
    badgeBg: '#fffbeb',
    border: '#fde68a',
    baseXp: 70,
    tag: '+70 XP'
  },
  'HSK 4': {
    label: 'Trung cao cấp',
    badgeColor: '#ea580c',
    badgeBg: '#fff7ed',
    border: '#fed7aa',
    baseXp: 95,
    tag: '+95 XP'
  },
  'HSK 5': {
    label: 'Cao cấp (Khó)',
    badgeColor: '#dc2626',
    badgeBg: '#fef2f2',
    border: '#fecaca',
    baseXp: 120,
    tag: '+120 XP'
  },
  'HSK 6': {
    label: 'Bậc thầy (Thử thách)',
    badgeColor: '#7c3aed',
    badgeBg: '#faf5ff',
    border: '#e9d5ff',
    baseXp: 160,
    tag: '+160 XP'
  }
};

// Reusable Game Victory & XP Reward Banner
const GameRewardCard = ({
  rewardResult,
  currentGameLevel,
  onReplay,
  onSelectOther,
  onOpenAuth
}) => {
  if (!rewardResult) return null;
  const { xpEarned, totalXp, gameTitle, level, bonusReason, isGuest } = rewardResult;
  const levelReward = GAME_DIFFICULTY_REWARDS[level] || GAME_DIFFICULTY_REWARDS['HSK 1'];

  return (
    <div style={{
      background: 'linear-gradient(145deg, #ffffff 0%, #fefce8 100%)',
      border: '2px solid #fef08a',
      borderRadius: '20px',
      padding: '2rem 1.5rem',
      textAlign: 'center',
      boxShadow: '0 12px 35px rgba(202, 138, 4, 0.12)',
      marginTop: '1.5rem',
      animation: 'fadeIn 0.35s ease'
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '0.5rem', filter: 'drop-shadow(0 4px 10px rgba(234, 179, 8, 0.35))' }}>
        🏆
      </div>
      <h3 style={{ margin: 0, color: '#854d0e', fontSize: '1.35rem', fontWeight: 800 }}>
        Chúc Mừng Bạn Đã Hoàn Thành!
      </h3>
      <p style={{ color: '#713f12', fontSize: '0.9rem', margin: '0.35rem 0 1.25rem 0' }}>
        {gameTitle} — Cấp độ <strong>{level}</strong> ({levelReward.label})
      </p>

      {/* Points Highlight Pill */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        background: 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)',
        border: '1.5px solid #eab308',
        borderRadius: '999px',
        padding: '0.6rem 1.6rem',
        boxShadow: '0 4px 14px rgba(234, 179, 8, 0.25)',
        marginBottom: '1rem'
      }}>
        <span style={{ fontSize: '1.4rem' }}>⭐</span>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#854d0e', textTransform: 'uppercase' }}>
            Điểm Thưởng Nhận Được
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#713f12', lineHeight: 1 }}>
            +{xpEarned} XP
          </div>
        </div>
      </div>

      {bonusReason && (
        <div style={{ fontSize: '0.82rem', color: '#15803d', fontWeight: 700, marginBottom: '0.75rem' }}>
          ✨ {bonusReason}
        </div>
      )}

      {isGuest ? (
        <div style={{
          background: '#fff',
          border: '1px dashed #ca8a04',
          borderRadius: '12px',
          padding: '0.85rem 1rem',
          maxWidth: '440px',
          margin: '0 auto 1.25rem',
          fontSize: '0.84rem',
          color: '#854d0e'
        }}>
          <div>🔒 <em>Bạn đang chơi ở chế độ khách nên điểm chưa được lưu.</em></div>
          {onOpenAuth && (
            <button
              type="button"
              onClick={onOpenAuth}
              style={{
                marginTop: '0.5rem',
                background: '#854d0e',
                color: '#fff',
                border: 'none',
                padding: '0.45rem 1.1rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              Đăng Nhập Để Lưu +{xpEarned} XP Ngay
            </button>
          )}
        </div>
      ) : (
        <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
          Tổng điểm tích lũy của bạn: <strong style={{ color: '#A11D24', fontSize: '0.95rem' }}>{totalXp} XP</strong> 🔥
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={onReplay}
          style={{
            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
            color: '#fff',
            border: 'none',
            padding: '0.65rem 1.5rem',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)'
          }}
        >
          Chơi Lại Ván Mới
        </button>
        <button
          type="button"
          onClick={onSelectOther}
          style={{
            background: '#ffffff',
            color: '#475569',
            border: '1.5px solid #cbd5e1',
            padding: '0.65rem 1.3rem',
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '0.88rem',
            cursor: 'pointer'
          }}
        >
          Chọn Game Khác
        </button>
      </div>
    </div>
  );
};

// Helper to convert level pairs into memory card items (from database or local rich dataset)
const getMemoryCardsForLevel = (lvl = 'HSK 1', remotePairs = []) => {
  let pairs = (remotePairs || []).filter((p) => p.category === lvl);
  if (!pairs || pairs.length < 4) {
    pairs = getRandomGamePairs(lvl, 8);
  } else {
    pairs = [...pairs].sort(() => 0.5 - Math.random()).slice(0, 8);
  }
  return pairs.flatMap((pair) => [
    { id: `${pair.id}-hanzi`, pairId: pair.id, type: 'hanzi', content: pair.hanzi, pinyin: pair.pinyin, mean: pair.mean },
    { id: `${pair.id}-pinyin`, pairId: pair.id, type: 'pinyin', content: `${pair.pinyin} (${pair.mean})`, pinyin: pair.pinyin, mean: pair.mean }
  ]);
};

// Helper for Tone Blitz questions
const getToneQuestionsForLevel = (lvl = 'HSK 1', remoteTones = []) => {
  let tones = (remoteTones || []).filter((t) => t.mean?.includes(`[${lvl}]`));
  if (!tones || tones.length < 4) {
    tones = getRandomToneItems(lvl, 10);
  } else {
    tones = [...tones].sort(() => 0.5 - Math.random()).slice(0, 10);
  }
  if (!tones || tones.length === 0) {
    tones = getRandomToneItems('all', 10);
  }
  return tones;
};

// Helper for Speed Word Match pairs
const getSpeedPairsForLevel = (lvl = 'HSK 1', remotePairs = []) => {
  let pairs = (remotePairs || []).filter((p) => p.category === lvl);
  if (!pairs || pairs.length < 4) {
    pairs = getRandomGamePairs(lvl, 6);
  } else {
    pairs = [...pairs].sort(() => 0.5 - Math.random()).slice(0, 6);
  }
  return pairs.map((p) => ({ id: p.id, hanzi: p.hanzi, mean: p.mean }));
};

// Helper for Hanzi Riddles
const getRiddlesForLevel = (lvl = 'HSK 1') => {
  const words = getVocabulariesByLevel(lvl);
  if (!words || words.length < 4) {
    return RIDDLES_BY_LEVEL[lvl] || RIDDLES_BY_LEVEL['HSK 1'];
  }
  const pool = [...words].sort(() => 0.5 - Math.random()).slice(0, 5);
  return pool.map((target) => {
    const others = words.filter((w) => w.id !== target.id);
    const distractors = [...others].sort(() => 0.5 - Math.random()).slice(0, 3).map((w) => w.hanzi);
    const options = [...distractors, target.hanzi].sort(() => 0.5 - Math.random());
    const prompt = target.exampleHanzi
      ? `Điền từ thích hợp: "${target.exampleHanzi.replace(target.hanzi, '_____')}" (${target.exampleMean || target.mean}):`
      : `Từ vựng có nghĩa là "${target.mean}" (Phiên âm: ${target.pinyin}):`;
    return {
      prompt,
      options,
      correct: target.hanzi,
      pinyin: target.pinyin,
      mean: target.mean
    };
  });
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
    level: 'HSK 1 - 6',
    desc: 'Lật mở các cặp thẻ bài úp, ghép đúng Chữ Hán với Pinyin & Nghĩa tương ứng theo từng cấp độ HSK 1 đến HSK 6.',
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
    level: 'HSK 1 - 6',
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
    level: 'HSK 1 - 6',
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
    level: 'HSK 1 - 6',
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

export const EntertainmentView = ({ streakData, onRewardXp, onOpenAuth }) => {
  const { user } = useAuth();

  // Active game: null (Catalog view) | 'match' | 'tone' | 'speed-match' | 'hanzi-riddle'
  const [activeGame, setActiveGame] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [currentGameLevel, setCurrentGameLevel] = useState('HSK 1');
  const [rawMatchPairs, setRawMatchPairs] = useState([]);
  const [matchCards, setMatchCards] = useState([]);
  const [toneQuestions, setToneQuestions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [rewardResult, setRewardResult] = useState(null);

  useEffect(() => {
    Promise.all([fetchMatchPairs(), fetchToneItems(), fetchLeaderboard()]).then(([pairsResult, tonesResult, lbResult]) => {
      let remoteTones = [];
      if (pairsResult.data && pairsResult.data.length > 0) {
        setRawMatchPairs(pairsResult.data);
        setMatchCards(pairsResult.data.flatMap((pair) => [
          { id: `${pair.id}-hanzi`, pairId: pair.id, type: 'hanzi', content: pair.hanzi, pinyin: pair.pinyin, mean: pair.mean, category: pair.category },
          { id: `${pair.id}-pinyin`, pairId: pair.id, type: 'pinyin', content: `${pair.pinyin} (${pair.mean})`, pinyin: pair.pinyin, mean: pair.mean, category: pair.category }
        ]));
      }
      if (tonesResult.data && tonesResult.data.length > 0) {
        remoteTones = tonesResult.data;
        setToneQuestions(remoteTones);
      }
      setLeaderboard(lbResult?.data || []);
      if (remoteTones.length > 0) {
        setToneQuestionsList(getToneQuestionsForLevel(currentGameLevel, remoteTones));
      }
    });
  }, []);

  // Universal Award Points Handler based on Game & Difficulty
  const handleAwardPoints = async (earnedXp, gameTitle, level, bonusReason = null) => {
    if (!earnedXp || earnedXp <= 0 || rewardResult) return;
    try {
      if (onRewardXp) {
        const res = await onRewardXp({
          gameId: activeGame,
          gameTitle,
          level,
          xpEarned: earnedXp,
          bonusReason
        });
        setRewardResult({
          xpEarned: earnedXp,
          totalXp: res?.totalXp || (Number(streakData?.totalXp || 0) + earnedXp),
          gameTitle,
          level,
          bonusReason,
          isGuest: !user
        });
      } else if (user?.id) {
        const res = await addGameRewardXp(user.id, earnedXp, {
          gameId: activeGame,
          gameTitle,
          level
        });
        setRewardResult({
          xpEarned: earnedXp,
          totalXp: res?.data?.totalXp || (Number(streakData?.totalXp || 0) + earnedXp),
          gameTitle,
          level,
          bonusReason,
          isGuest: false
        });
      } else {
        setRewardResult({
          xpEarned: earnedXp,
          totalXp: earnedXp,
          gameTitle,
          level,
          bonusReason,
          isGuest: true
        });
      }
    } catch (err) {
      console.error('Error awarding game XP:', err);
    }
  };

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
    const pool = getMemoryCardsForLevel(level, rawMatchPairs);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setRewardResult(null);
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
        const nextMatched = [...matched, firstCard.pairId];
        setMatched(nextMatched);
        setFlipped([]);

        if (nextMatched.length === cards.length / 2) {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#A11D24', '#D4AF37', '#ffffff']
          });

          // Award Points based on Difficulty & Performance
          const diffConfig = GAME_DIFFICULTY_REWARDS[currentGameLevel] || GAME_DIFFICULTY_REWARDS['HSK 1'];
          const totalMoves = moves + 1;
          const bonusXp = totalMoves <= 12 ? 15 : totalMoves <= 16 ? 10 : 0;
          const earnedXp = diffConfig.baseXp + bonusXp;
          handleAwardPoints(
            earnedXp,
            'Lật Thẻ Ghép Đôi',
            currentGameLevel,
            bonusXp > 0 ? `Lật chuẩn chỉ ${totalMoves} lượt (+${bonusXp} XP)` : null
          );
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
  const [toneQuestionsList, setToneQuestionsList] = useState(() => getToneQuestionsForLevel('HSK 1'));
  const [toneIdx, setToneIdx] = useState(0);
  const [toneScore, setToneScore] = useState(0);
  const [toneStreak, setToneStreak] = useState(0);
  const [toneMaxStreak, setToneMaxStreak] = useState(0);
  const [toneCorrectCount, setToneCorrectCount] = useState(0);
  const [toneFeedback, setToneFeedback] = useState(null); // 'correct' | 'wrong'
  const [isToneFinished, setIsToneFinished] = useState(false);

  const initToneGame = (level = currentGameLevel, remoteTones = toneQuestions) => {
    const list = getToneQuestionsForLevel(level, remoteTones);
    setToneQuestionsList(list);
    setToneIdx(0);
    setToneScore(0);
    setToneStreak(0);
    setToneMaxStreak(0);
    setToneCorrectCount(0);
    setToneFeedback(null);
    setIsToneFinished(false);
    setRewardResult(null);
  };

  const currentToneQ = toneQuestionsList[toneIdx] || toneQuestionsList[0];
  const roundQuestions = Math.min(10, toneQuestionsList.length || 10);

  const handleToneAnswer = (selectedTone) => {
    if (toneFeedback || isToneFinished || !currentToneQ) return;
    const isCorrect = selectedTone === currentToneQ.tone;

    if (isCorrect) {
      setToneFeedback('correct');
      setToneScore((s) => s + 100 + toneStreak * 20);
      setToneStreak((st) => {
        const next = st + 1;
        setToneMaxStreak((m) => Math.max(m, next));
        return next;
      });
      setToneCorrectCount((c) => c + 1);
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
      if (toneIdx + 1 >= roundQuestions) {
        setIsToneFinished(true);
        const finalCorrect = toneCorrectCount + (isCorrect ? 1 : 0);
        const diffConfig = GAME_DIFFICULTY_REWARDS[currentGameLevel] || GAME_DIFFICULTY_REWARDS['HSK 1'];
        const accuracyRatio = roundQuestions > 0 ? finalCorrect / roundQuestions : 1;
        const comboBonus = toneMaxStreak >= 4 ? 10 : 0;
        const earnedXp = Math.max(10, Math.round(accuracyRatio * diffConfig.baseXp)) + comboBonus;
        handleAwardPoints(
          earnedXp,
          'Thử Thách Thanh Điệu',
          currentGameLevel,
          toneMaxStreak >= 4 ? `Combo liên hoàn x${toneMaxStreak} (+10 XP)` : `Đúng ${finalCorrect}/${roundQuestions} câu`
        );
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        setToneIdx((prev) => prev + 1);
      }
    }, 900);
  };

  // ==========================================
  // GAME 3: SPEED WORD MATCH STATE & LOGIC
  // ==========================================
  const [selectedHanzi, setSelectedHanzi] = useState(null);
  const [speedMatchedIds, setSpeedMatchedIds] = useState([]);
  const [speedScore, setSpeedScore] = useState(0);
  const [wrongMatchId, setWrongMatchId] = useState(null);

  const shuffleArray = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    // Ensure the shuffled order is never identical to the original order
    if (a.length > 1 && a.every((item, idx) => item.id === arr[idx].id)) {
      const first = a.shift();
      a.push(first);
    }
    return a;
  };

  const currentSpeedPairs = getSpeedPairsForLevel(currentGameLevel, rawMatchPairs);
  const [speedHanziList, setSpeedHanziList] = useState(() => [...currentSpeedPairs]);
  const [speedMeaningList, setSpeedMeaningList] = useState(() => shuffleArray(currentSpeedPairs));

  const initSpeedMatch = (level = currentGameLevel) => {
    const pairs = getSpeedPairsForLevel(level, rawMatchPairs);
    setSelectedHanzi(null);
    setSpeedMatchedIds([]);
    setSpeedScore(0);
    setWrongMatchId(null);
    setSpeedHanziList([...pairs]);
    setSpeedMeaningList(shuffleArray(pairs));
    setRewardResult(null);
  };

  useEffect(() => {
    initSpeedMatch(currentGameLevel);
  }, [currentGameLevel, rawMatchPairs]);

  const handleHanziSelect = (item) => {
    if (speedMatchedIds.includes(item.id)) return;
    if (selectedHanzi?.id === item.id) {
      setSelectedHanzi(null);
      return;
    }
    setSelectedHanzi(item);
    speakWord(item.hanzi);
  };

  const handleMeanSelect = (item) => {
    if (!selectedHanzi || speedMatchedIds.includes(item.id)) return;

    if (selectedHanzi.id === item.id) {
      // Correct match!
      const nextMatched = [...speedMatchedIds, item.id];
      setSpeedMatchedIds(nextMatched);
      setSpeedScore((s) => s + 250);
      setSelectedHanzi(null);

      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.65 },
        colors: ['#2563eb', '#16a34a', '#D4AF37']
      });

      if (nextMatched.length === currentSpeedPairs.length) {
        const diffConfig = GAME_DIFFICULTY_REWARDS[currentGameLevel] || GAME_DIFFICULTY_REWARDS['HSK 1'];
        handleAwardPoints(diffConfig.baseXp, 'Nối Nghĩa Thần Tốc', currentGameLevel);
      }
    } else {
      // Wrong match: flash error on wrong item then reset
      setWrongMatchId(item.id);
      setTimeout(() => {
        setWrongMatchId(null);
        setSelectedHanzi(null);
      }, 500);
    }
  };

  // ==========================================
  // GAME 4: HANZI RIDDLE STATE & LOGIC
  // ==========================================
  const [riddleQuestionsList, setRiddleQuestionsList] = useState(() => getRiddlesForLevel('HSK 1'));
  const [riddleIdx, setRiddleIdx] = useState(0);
  const [riddleScore, setRiddleScore] = useState(0);
  const [riddleCorrectCount, setRiddleCorrectCount] = useState(0);
  const [selectedRiddleOpt, setSelectedRiddleOpt] = useState(null);
  const [isRiddleAnswered, setIsRiddleAnswered] = useState(false);
  const [isRiddleFinished, setIsRiddleFinished] = useState(false);

  const initRiddleGame = (level = currentGameLevel) => {
    const list = getRiddlesForLevel(level);
    setRiddleQuestionsList(list);
    setRiddleIdx(0);
    setRiddleScore(0);
    setRiddleCorrectCount(0);
    setSelectedRiddleOpt(null);
    setIsRiddleAnswered(false);
    setIsRiddleFinished(false);
    setRewardResult(null);
  };

  const currentRiddle = riddleQuestionsList[riddleIdx] || riddleQuestionsList[0];

  const handleRiddleChoose = (opt) => {
    if (isRiddleAnswered || isRiddleFinished || !currentRiddle) return;
    setSelectedRiddleOpt(opt);
    setIsRiddleAnswered(true);

    if (opt === currentRiddle.correct) {
      setRiddleScore((s) => s + 100);
      setRiddleCorrectCount((c) => c + 1);
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
    if (riddleIdx < riddleQuestionsList.length - 1) {
      setRiddleIdx((prev) => prev + 1);
      setSelectedRiddleOpt(null);
      setIsRiddleAnswered(false);
    } else {
      setIsRiddleFinished(true);
      const totalQ = riddleQuestionsList.length;
      const diffConfig = GAME_DIFFICULTY_REWARDS[currentGameLevel] || GAME_DIFFICULTY_REWARDS['HSK 1'];
      const earnedXp = Math.max(10, Math.round((riddleCorrectCount / totalQ) * diffConfig.baseXp));
      handleAwardPoints(
        earnedXp,
        'Đoán Chữ Hán Theo Nghĩa',
        currentGameLevel,
        riddleCorrectCount === totalQ ? 'Chính xác 100% (+10 XP bonus)' : `Đúng ${riddleCorrectCount}/${totalQ} câu`
      );
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Launch game handler
  const handleSelectGame = (gameId, targetLevel) => {
    const level = targetLevel || (['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'].includes(selectedLevel) ? selectedLevel : currentGameLevel);
    setCurrentGameLevel(level);
    setActiveGame(gameId);
    setRewardResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (gameId === 'match') initMatchGame(level);
    if (gameId === 'tone') initToneGame(level);
    if (gameId === 'speed-match') initSpeedMatch(level);
    if (gameId === 'hanzi-riddle') initRiddleGame(level);
  };

  // Level switcher handler inside Runner
  const handleLevelChangeInRunner = (newLevel) => {
    setCurrentGameLevel(newLevel);
    setRewardResult(null);
    if (activeGame === 'match') initMatchGame(newLevel);
    if (activeGame === 'tone') initToneGame(newLevel);
    if (activeGame === 'speed-match') initSpeedMatch(newLevel);
    if (activeGame === 'hanzi-riddle') initRiddleGame(newLevel);
  };

  return (
    <main className="main-content">
      {/* Header Banner */}
      {/* Compact Modern Header Banner (chỉ hiển thị ở danh mục game) */}
      {!activeGame && (
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #fffbfb 100%)',
          border: '1px solid #fee2e2',
          borderRadius: '16px',
          padding: '1.1rem 1.4rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.85rem',
          boxShadow: '0 4px 16px rgba(161, 29, 36, 0.04)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{
                background: '#fef2f2',
                color: '#A11D24',
                padding: '2px 8px',
                borderRadius: '8px',
                fontSize: '0.74rem',
                fontWeight: 700,
                border: '1px solid #fecaca'
              }}>
                🎮 Mini-Games
              </span>
              <span style={{ fontSize: '0.85rem', color: '#A11D24', fontFamily: 'Noto Serif SC, serif', fontWeight: 600 }}>
                趣味学汉语
              </span>
            </div>
            <h1 style={{ margin: '0 0 0.2rem 0', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              Góc Giải Trí & Ôn Bài
            </h1>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
              Vừa học vừa chơi, củng cố phản xạ chữ Hán, thanh điệu và nhận điểm XP đua top.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '0.35rem 0.75rem',
              borderRadius: '10px',
              fontSize: '0.78rem',
              color: '#475569',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              <i className="fa-solid fa-gamepad" style={{ color: '#A11D24' }}></i>
              4 Thể loại
            </span>
            <span style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '0.35rem 0.75rem',
              borderRadius: '10px',
              fontSize: '0.78rem',
              color: '#475569',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              <i className="fa-solid fa-layer-group" style={{ color: '#d97706' }}></i>
              HSK 1 - 6
            </span>
            <span style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              padding: '0.35rem 0.75rem',
              borderRadius: '10px',
              fontSize: '0.78rem',
              color: '#b45309',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              ⭐ Tới +160 XP
            </span>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 1: GAME RUNNER ROOM (Khi đã chọn 1 game để chơi)     */}
      {/* ======================================================== */}
      {activeGame ? (
        <div style={{ maxWidth: '880px', margin: '0 auto' }}>
          {/* Runner Navigation Bar */}
          <div style={{
            background: '#fff',
            border: '1.5px solid #fee2e2',
            borderRadius: '16px',
            padding: '0.75rem 1.25rem',
            marginBottom: '1rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}>
            {/* Row 1: Back Button, Game Title, Quick Reset */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setActiveGame(null)}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    padding: '0.4rem 0.9rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    color: '#475569',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.15s'
                  }}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                  <span>Đổi Game Khác</span>
                </button>

                {/* Current Game Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>
                    {GAMES_CATALOG.find((g) => g.id === activeGame)?.icon}
                  </span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a', fontWeight: 800 }}>
                      {GAMES_CATALOG.find((g) => g.id === activeGame)?.title}
                    </h3>
                    <div style={{ fontSize: '0.72rem', color: '#A11D24', fontFamily: 'Noto Serif SC, serif' }}>
                      {GAMES_CATALOG.find((g) => g.id === activeGame)?.chineseTitle}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Reset Button */}
              <button
                type="button"
                onClick={() => handleSelectGame(activeGame, currentGameLevel)}
                style={{
                  background: 'rgba(161, 29, 36, 0.08)',
                  border: 'none',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: '#A11D24',
                  fontSize: '0.82rem',
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

            {/* Row 2: Level Switcher in Runner with difficulty points badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', borderTop: '1px solid #f8fafc', paddingTop: '0.45rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Cấp độ:</span>
              {HSK_LEVELS.map((lvl) => {
                const r = GAME_DIFFICULTY_REWARDS[lvl];
                const isActive = currentGameLevel === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => handleLevelChangeInRunner(lvl)}
                    title={`Độ khó: ${r.label} - Thưởng ${r.tag}`}
                    style={{
                      padding: '0.3rem 0.65rem',
                      borderRadius: '7px',
                      border: isActive ? '1.5px solid #A11D24' : '1px solid #cbd5e1',
                      background: isActive ? '#A11D24' : '#fff',
                      color: isActive ? '#fff' : '#475569',
                      fontSize: '0.78rem',
                      fontWeight: isActive ? 700 : 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{lvl}</span>
                    <span style={{
                      fontSize: '0.68rem',
                      background: isActive ? 'rgba(255,255,255,0.22)' : r.badgeBg,
                      color: isActive ? '#ffffff' : r.badgeColor,
                      padding: '1px 5px',
                      borderRadius: '5px',
                      fontWeight: 700
                    }}>
                      {r.tag}
                    </span>
                  </button>
                );
              })}
            </div>
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
                <GameRewardCard
                  rewardResult={rewardResult}
                  currentGameLevel={currentGameLevel}
                  onReplay={() => initMatchGame(currentGameLevel)}
                  onSelectOther={() => setActiveGame(null)}
                  onOpenAuth={onOpenAuth}
                />
              )}
            </div>
          )}

          {/* ================= RUNNER: GAME 2 TONE BLITZ ================= */}
          {activeGame === 'tone' && (
            <div style={{ background: '#fff', border: '1.5px solid #fee2e2', borderRadius: '24px', padding: '2rem', boxShadow: '0 12px 35px rgba(0,0,0,0.04)' }}>
              {isToneFinished ? (
                <GameRewardCard
                  rewardResult={rewardResult}
                  currentGameLevel={currentGameLevel}
                  onReplay={() => initToneGame(currentGameLevel)}
                  onSelectOther={() => setActiveGame(null)}
                  onOpenAuth={onOpenAuth}
                />
              ) : (
                <>
                  {/* Score & Streak Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Tổng điểm ({currentGameLevel}):</div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#A11D24' }}>
                        {toneScore} <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500 }}>điểm</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <span style={{ background: '#fef2f2', color: '#A11D24', padding: '0.35rem 0.85rem', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 700 }}>
                        Tiến độ: Câu {toneIdx + 1} / {roundQuestions}
                      </span>
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
                </>
              )}
            </div>
          )}

          {/* ================= RUNNER: GAME 3 SPEED WORD MATCH ================= */}
          {activeGame === 'speed-match' && (
            <div style={{ background: '#fff', border: '1.5px solid #fee2e2', borderRadius: '18px', padding: '1.1rem 1.4rem', boxShadow: '0 8px 25px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.65rem' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Điểm số ({currentGameLevel}):</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2563eb' }}>
                    {speedScore} điểm
                  </div>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  Đã ghép: <strong style={{ color: '#0f172a' }}>{speedMatchedIds.length} / {currentSpeedPairs.length}</strong>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '0.75rem' }}>
                {/* Hanzi Column (Cột Chữ Hán) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ 
                    minHeight: '26px',
                    fontWeight: 700, 
                    fontSize: '0.82rem', 
                    color: selectedHanzi ? '#64748b' : '#0f172a', 
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>{selectedHanzi ? 'Cột Chữ Hán:' : '1. Chọn Chữ Hán:'}</span>
                    {selectedHanzi && (
                      <span style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 700 }}>
                        Đang chọn: {selectedHanzi.hanzi}
                      </span>
                    )}
                  </div>
                  {speedHanziList.map((item) => {
                    const isMatched = speedMatchedIds.includes(item.id);
                    const isSelected = selectedHanzi?.id === item.id;
                    const isDimmed = Boolean(selectedHanzi) && !isSelected && !isMatched;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleHanziSelect(item)}
                        style={{
                          height: '46px',
                          padding: '0 1rem',
                          borderRadius: '10px',
                          border: isMatched 
                            ? '2px solid #22c55e' 
                            : isSelected 
                              ? '2.5px solid #2563eb' 
                              : isDimmed 
                                ? '1px solid #e2e8f0' 
                                : '1.5px solid #cbd5e1',
                          background: isMatched 
                            ? '#f0fdf4' 
                            : isSelected 
                              ? '#eff6ff' 
                              : isDimmed 
                                ? '#f8fafc' 
                                : '#ffffff',
                          color: isMatched 
                            ? '#16a34a' 
                            : isSelected 
                              ? '#2563eb' 
                              : isDimmed 
                                ? '#94a3b8' 
                                : '#0f172a',
                          fontWeight: 700,
                          fontSize: '1.15rem',
                          fontFamily: 'Noto Serif SC, serif',
                          cursor: isMatched ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          boxSizing: 'border-box',
                          opacity: isDimmed ? 0.38 : 1,
                          filter: isDimmed ? 'grayscale(50%)' : 'none',
                          transform: isSelected ? 'scale(1.015)' : 'none',
                          boxShadow: isSelected 
                            ? '0 0 12px rgba(37, 99, 235, 0.28)' 
                            : isMatched 
                              ? 'none' 
                              : '0 1px 3px rgba(0,0,0,0.02)',
                          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      >
                        <span>{item.hanzi}</span>
                        {isMatched && <span style={{ fontSize: '0.9rem', color: '#16a34a' }}>✓</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Meanings Column (Cột Nghĩa Tiếng Việt) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ 
                    minHeight: '26px',
                    fontWeight: 800, 
                    fontSize: '0.82rem', 
                    color: selectedHanzi ? '#1d4ed8' : '#94a3b8', 
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.25s ease'
                  }}>
                    <span>{selectedHanzi ? '👉 Cột Nghĩa Tiếng Việt:' : '2. Cột Nghĩa Tiếng Việt:'}</span>
                    {selectedHanzi ? (
                      <span style={{ 
                        fontSize: '0.72rem', 
                        background: '#dbeafe', 
                        color: '#1d4ed8', 
                        padding: '2px 8px', 
                        borderRadius: '999px', 
                        fontWeight: 700,
                        animation: 'pulse 1.5s infinite'
                      }}>
                        Ghép cặp ngay!
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic' }}>
                        (chọn Hán tự trước)
                      </span>
                    )}
                  </div>
                  {speedMeaningList.map((item) => {
                    const isMatched = speedMatchedIds.includes(item.id);
                    const isWrong = wrongMatchId === item.id;
                    const isReadyToMatch = Boolean(selectedHanzi) && !isMatched;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleMeanSelect(item)}
                        title={item.mean}
                        style={{
                          height: '46px',
                          padding: '0 1rem',
                          borderRadius: '10px',
                          border: isMatched 
                            ? '2px solid #22c55e' 
                            : isWrong 
                              ? '2.5px solid #ef4444' 
                              : isReadyToMatch 
                                ? '2px solid #3b82f6' 
                                : '1px dashed #cbd5e1',
                          background: isMatched 
                            ? '#f0fdf4' 
                            : isWrong 
                              ? '#fef2f2' 
                              : isReadyToMatch 
                                ? '#ffffff' 
                                : '#fafafa',
                          color: isMatched 
                            ? '#16a34a' 
                            : isWrong 
                              ? '#dc2626' 
                              : isReadyToMatch 
                                ? '#1e3a8a' 
                                : '#94a3b8',
                          fontWeight: isReadyToMatch ? 700 : 600,
                          fontSize: '0.9rem',
                          cursor: isMatched ? 'default' : isReadyToMatch ? 'pointer' : 'not-allowed',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          boxSizing: 'border-box',
                          opacity: isMatched ? 0.9 : isReadyToMatch ? 1 : 0.45,
                          boxShadow: isWrong 
                            ? '0 0 12px rgba(239, 68, 68, 0.35)' 
                            : isReadyToMatch 
                              ? '0 2px 10px rgba(59, 130, 246, 0.18)' 
                              : 'none',
                          transform: isWrong 
                            ? 'translateX(4px)' 
                            : isReadyToMatch 
                              ? 'translateY(-1px)' 
                              : 'none',
                          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      >
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.mean}
                        </span>
                        {isMatched && <span style={{ fontSize: '0.9rem', color: '#16a34a' }}>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {speedMatchedIds.length === currentSpeedPairs.length && (
                <GameRewardCard
                  rewardResult={rewardResult}
                  currentGameLevel={currentGameLevel}
                  onReplay={() => initSpeedMatch(currentGameLevel)}
                  onSelectOther={() => setActiveGame(null)}
                  onOpenAuth={onOpenAuth}
                />
              )}
            </div>
          )}

          {/* ================= RUNNER: GAME 4 HANZI RIDDLE ================= */}
          {activeGame === 'hanzi-riddle' && (
            <div style={{ background: '#fff', border: '1.5px solid #fee2e2', borderRadius: '24px', padding: '2rem', boxShadow: '0 12px 35px rgba(0,0,0,0.04)' }}>
              {isRiddleFinished ? (
                <GameRewardCard
                  rewardResult={rewardResult}
                  currentGameLevel={currentGameLevel}
                  onReplay={() => initRiddleGame(currentGameLevel)}
                  onSelectOther={() => setActiveGame(null)}
                  onOpenAuth={onOpenAuth}
                />
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                    <span style={{ background: '#fef2f2', color: '#16a34a', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700 }}>
                      Câu {riddleIdx + 1} / {riddleQuestionsList.length} ({currentGameLevel})
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
                </>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Cấp độ:</span>
            {['all', ...HSK_LEVELS].map((lvl) => (
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

                  {/* Difficulty XP Badges */}
                  <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
                    {['HSK 1', 'HSK 2', 'HSK 3'].map((lvl) => {
                      const r = GAME_DIFFICULTY_REWARDS[lvl];
                      return (
                        <span
                          key={lvl}
                          style={{
                            fontSize: '0.72rem',
                            background: r.badgeBg,
                            color: r.badgeColor,
                            border: `1px solid ${r.border}`,
                            padding: '2px 7px',
                            borderRadius: '6px',
                            fontWeight: 700
                          }}
                        >
                          {lvl}: {r.tag}
                        </span>
                      );
                    })}
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
