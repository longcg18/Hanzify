// src/data/vocabPracticeBuilder.js
// Xây dựng ngân hàng chuyên đề luyện tập theo 5 kỹ năng từ kho từ vựng HSK 1 - 6

import { HSK_LEVELS, HSK_VOCABULARY_LIST } from './hskVocabularyData';

const TONE_NAMES = [
  'Thanh 1 (ˉ) Cao bằng',
  'Thanh 2 (ˊ) Đi lên',
  'Thanh 3 (ˇ) Xuống rồi lên',
  'Thanh 4 (ˋ) Dứt khoát'
];

/**
 * Chuẩn hóa một mục từ vựng
 */
function normalizeVocab(v) {
  return {
    id: v.id,
    level: v.level,
    topic: v.topic || 'Tổng hợp',
    hanzi: v.hanzi,
    pinyin: v.pinyin,
    wordType: v.wordType || v.word_type || 'Từ vựng',
    mean: v.mean || v.meaning || '',
    exampleHanzi: v.exampleHanzi || v.example_cn || '',
    exampleMean: v.exampleMean || v.example_vn || '',
    sino: v.sino_vietnamese || v.sinoVietnamese || '',
    tone: v.tone || null,
    isSingleChar: Boolean(v.isSingleChar || (v.hanzi && v.hanzi.length === 1))
  };
}

/**
 * Lấy danh sách đáp án sai (distractors) duy nhất
 */
function getDistractors(pool, target, key, count = 3) {
  const others = pool
    .filter((w) => w.id !== target.id && w[key] && w[key] !== target[key])
    .map((w) => w[key]);
  const unique = Array.from(new Set(others));
  // Shuffle
  const shuffled = [...unique].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Tạo một câu hỏi trắc nghiệm xáo trộn 4 phương án
 */
function makeQuestion({ prompt, audio = null, pinyin = null, correctVal, distractorVals, explain }) {
  // Lọc distractor trùng với correctVal
  const validDistractors = distractorVals.filter((d) => d && d !== correctVal).slice(0, 3);
  const opts = [correctVal, ...validDistractors];
  
  // Nếu chưa đủ 4 phương án, thêm phương án mặc định
  while (opts.length < 4) {
    opts.push(`Phương án ${opts.length + 1}`);
  }

  // Shuffle options
  const shuffled = [...opts].sort(() => 0.5 - Math.random());
  const correctIdx = shuffled.indexOf(correctVal);

  return {
    prompt,
    audio,
    pinyin,
    options: shuffled,
    correct: correctIdx >= 0 ? correctIdx : 0,
    explain
  };
}

/**
 * Tạo toàn bộ các chuyên đề kỹ năng từ kho từ vựng cho cả 6 cấp độ HSK 1 - 6
 */
export function buildVocabPracticeTopics(rawList = HSK_VOCABULARY_LIST) {
  const normalized = (rawList && rawList.length > 0 ? rawList : HSK_VOCABULARY_LIST).map(normalizeVocab);
  const topics = [];

  HSK_LEVELS.forEach((lvl) => {
    const lvlWords = normalized.filter((w) => w.level === lvl);
    if (lvlWords.length === 0) return;

    const lvlTag = lvl.toLowerCase().replace(/\s+/g, '');

    // -------------------------------------------------------------------------
    // 1. ✍️ CHỮ HÁN & TỪ VỰNG (hanzi)
    // -------------------------------------------------------------------------
    const hanziQuestions = [];
    lvlWords.forEach((w) => {
      // Dạng 1: Đoán nghĩa từ chữ Hán
      const distractors = getDistractors(lvlWords, w, 'mean', 3);
      if (distractors.length >= 2) {
        hanziQuestions.push(
          makeQuestion({
            prompt: `Từ chữ Hán "${w.hanzi}" (${w.pinyin}) có ý nghĩa là gì?`,
            correctVal: w.mean,
            distractorVals: distractors,
            explain: `"${w.hanzi}" [${w.pinyin}]${w.sino ? ` (Hán-Việt: ${w.sino})` : ''} nghĩa là "${w.mean}".${w.exampleHanzi ? ` Ví dụ: ${w.exampleHanzi} (${w.exampleMean})` : ''}`
          })
        );
      }

      // Dạng 2: Điền chữ Hán vào chỗ trống câu ví dụ
      if (w.exampleHanzi && w.exampleHanzi.includes(w.hanzi)) {
        const hanziDistractors = getDistractors(lvlWords, w, 'hanzi', 3);
        if (hanziDistractors.length >= 2) {
          hanziQuestions.push(
            makeQuestion({
              prompt: `Chọn chữ Hán điền vào chỗ trống: "${w.exampleHanzi.replace(w.hanzi, '_____')}" (${w.exampleMean})`,
              correctVal: w.hanzi,
              distractorVals: hanziDistractors,
              explain: `Chữ Hán cần điền là "${w.hanzi}" (${w.pinyin}: ${w.mean}). Câu hoàn chỉnh: "${w.exampleHanzi}".`
            })
          );
        }
      }
    });

    if (hanziQuestions.length > 0) {
      topics.push({
        id: `vocab-${lvlTag}-hanzi`,
        skill: 'hanzi',
        skillLabel: '✍️ Chữ Hán & Từ Vựng',
        level: lvl,
        title: `Chữ Hán & Từ Vựng ${lvl}: Nhận Diện & Nghĩa Từ`,
        desc: `Luyện nhận diện chữ Hán, nghĩa tiếng Việt và cách dùng của kho ${lvlWords.length} từ vựng chuẩn ${lvl}.`,
        questionsCount: hanziQuestions.length,
        questions: hanziQuestions
      });
    }

    // -------------------------------------------------------------------------
    // 2. 📝 PINYIN & THANH ĐIỆU (pinyin)
    // -------------------------------------------------------------------------
    const pinyinQuestions = [];
    lvlWords.forEach((w) => {
      // Đoán phiên âm Pinyin
      const pinyinDistractors = getDistractors(lvlWords, w, 'pinyin', 3);
      if (pinyinDistractors.length >= 2) {
        pinyinQuestions.push(
          makeQuestion({
            prompt: `Phiên âm Pinyin chính xác của "${w.hanzi}" (${w.mean}) là gì?`,
            correctVal: w.pinyin,
            distractorVals: pinyinDistractors,
            explain: `Chữ Hán "${w.hanzi}" có phiên âm chuẩn là "${w.pinyin}". Nghĩa: ${w.mean}.`
          })
        );
      }

      // Nhận diện thanh điệu nếu là chữ đơn có tone 1 - 4
      if (w.isSingleChar && w.tone >= 1 && w.tone <= 4) {
        const toneCorrect = TONE_NAMES[w.tone - 1];
        const toneDistractors = TONE_NAMES.filter((_, idx) => idx !== w.tone - 1);
        pinyinQuestions.push(
          makeQuestion({
            prompt: `Chữ Hán "${w.hanzi}" (${w.pinyin}) mang thanh điệu nào?`,
            correctVal: toneCorrect,
            distractorVals: toneDistractors,
            explain: `Chữ "${w.hanzi}" đọc là "${w.pinyin}", mang thanh ${w.tone}: ${toneCorrect}.`
          })
        );
      }
    });

    if (pinyinQuestions.length > 0) {
      topics.push({
        id: `vocab-${lvlTag}-pinyin`,
        skill: 'pinyin',
        skillLabel: '📝 Pinyin & Thanh Điệu',
        level: lvl,
        title: `Pinyin & Thanh Điệu ${lvl}: Chuẩn Hóa Phát Âm`,
        desc: `Rèn luyện đọc chuẩn phiên âm Pinyin và phân biệt 4 thanh điệu của từ vựng cấp độ ${lvl}.`,
        questionsCount: pinyinQuestions.length,
        questions: pinyinQuestions
      });
    }

    // -------------------------------------------------------------------------
    // 3. 🎧 LUYỆN NGHE (listening)
    // -------------------------------------------------------------------------
    const listeningQuestions = [];
    lvlWords.forEach((w) => {
      const sentence = w.exampleHanzi || w.hanzi;
      const sentenceMean = w.exampleMean || w.mean;
      const meanDistractors = getDistractors(lvlWords, w, 'exampleMean', 3);
      const fallbackDistractors = getDistractors(lvlWords, w, 'mean', 3);
      const distractors = meanDistractors.length >= 2 ? meanDistractors : fallbackDistractors;

      if (distractors.length >= 2) {
        listeningQuestions.push(
          makeQuestion({
            prompt: `Lắng nghe câu: "${sentence}". Nội dung câu nói mang ý nghĩa gì?`,
            audio: sentence,
            pinyin: w.pinyin,
            correctVal: sentenceMean,
            distractorVals: distractors,
            explain: `Câu thoại: "${sentence}" [${w.pinyin}] — Nghĩa: ${sentenceMean}. Từ khóa cốt lõi: "${w.hanzi}" (${w.mean}).`
          })
        );
      }
    });

    if (listeningQuestions.length > 0) {
      topics.push({
        id: `vocab-${lvlTag}-listening`,
        skill: 'listening',
        skillLabel: '🎧 Luyện Nghe',
        level: lvl,
        title: `Luyện Nghe Câu Ví Dụ & Từ Vựng ${lvl}`,
        desc: `Lắng nghe câu thoại phát âm giọng chuẩn, nhận diện từ vựng và nắm bắt ngữ nghĩa giao tiếp ${lvl}.`,
        questionsCount: listeningQuestions.length,
        questions: listeningQuestions
      });
    }

    // -------------------------------------------------------------------------
    // 4. 📖 ĐỌC HIỂU (reading)
    // -------------------------------------------------------------------------
    const readingQuestions = [];
    lvlWords.forEach((w) => {
      if (w.exampleHanzi) {
        const distractors = getDistractors(lvlWords, w, 'mean', 3);
        if (distractors.length >= 2) {
          readingQuestions.push(
            makeQuestion({
              prompt: `Đọc câu: "${w.exampleHanzi}". Hãy cho biết từ "${w.hanzi}" trong câu mang nghĩa là gì?`,
              correctVal: w.mean,
              distractorVals: distractors,
              explain: `Trong câu "${w.exampleHanzi}" (${w.exampleMean}), từ "${w.hanzi}" giữ vai trò ${w.wordType} mang nghĩa là "${w.mean}".`
            })
          );
        }
      }
    });

    if (readingQuestions.length > 0) {
      topics.push({
        id: `vocab-${lvlTag}-reading`,
        skill: 'reading',
        skillLabel: '📖 Đọc Hiểu',
        level: lvl,
        title: `Đọc Hiểu Câu Mẫu & Ngữ Cảnh ${lvl}`,
        desc: `Đọc câu thực tế, phân tích ngữ nghĩa của từ vựng ${lvl} khi đặt trong ngữ cảnh văn bản hoàn chỉnh.`,
        questionsCount: readingQuestions.length,
        questions: readingQuestions
      });
    }

    // -------------------------------------------------------------------------
    // 5. 🧩 NGỮ PHÁP (grammar)
    // -------------------------------------------------------------------------
    const grammarQuestions = [];
    lvlWords.forEach((w) => {
      if (w.exampleHanzi) {
        const distractors = getDistractors(lvlWords, w, 'wordType', 3);
        const typeOptions = ['Danh từ', 'Động từ', 'Tính từ', 'Phó từ', 'Lượng từ', 'Giới từ', 'Đại từ'];
        const validDistractors = typeOptions.filter((t) => t !== w.wordType).slice(0, 3);

        grammarQuestions.push(
          makeQuestion({
            prompt: `Trong câu "${w.exampleHanzi}", từ "${w.hanzi}" (${w.pinyin}: ${w.mean}) thuộc từ loại nào?`,
            correctVal: w.wordType,
            distractorVals: validDistractors,
            explain: `"${w.hanzi}" là ${w.wordType}. Câu ví dụ hoàn chỉnh: "${w.exampleHanzi}" (${w.exampleMean}).`
          })
        );
      }
    });

    if (grammarQuestions.length > 0) {
      topics.push({
        id: `vocab-${lvlTag}-grammar`,
        skill: 'grammar',
        skillLabel: '🧩 Ngữ Pháp',
        level: lvl,
        title: `Ngữ Pháp & Từ Loại Trong Câu ${lvl}`,
        desc: `Nắm vững đặc điểm từ loại, vị trí cú pháp và cấu trúc ngữ pháp thông dụng của từ vựng ${lvl}.`,
        questionsCount: grammarQuestions.length,
        questions: grammarQuestions
      });
    }
  });

  return topics;
}
