import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';

const HSK_LEVELS = ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'];

const SAMPLE_ROWS = [
  {
    id: 'row-1',
    skill: 'listening',
    partNumber: 1,
    partTitle: 'Phần nghe 1: Phán đoán Đúng / Sai',
    prompt: '他们正在教室里看书。',
    pinyin: 'Tāmen zhèngzài jiàoshì lǐ kànshū.',
    audioText: '男：喂，你在哪儿呢？\n女：我和同学在教室里看书呢。',
    readingText: '',
    optA: 'Đúng (对)',
    optB: 'Sai (错)',
    optC: '',
    optD: '',
    correctAnswer: 'A',
    explanation: 'Nữ nói rõ "我和同学在教室里看书呢" trùng khớp với câu nhận định.'
  },
  {
    id: 'row-2',
    skill: 'listening',
    partNumber: 1,
    partTitle: 'Phần nghe 1: Phán đoán Đúng / Sai',
    prompt: '他明天要去北京旅游。',
    pinyin: 'Tā míngtiān yào qù Běijīng lǚyóu.',
    audioText: '男：你明天去北京出差吗？\n女：不，我是去上海旅游。',
    readingText: '',
    optA: 'Đúng (对)',
    optB: 'Sai (错)',
    optC: '',
    optD: '',
    correctAnswer: 'B',
    explanation: 'Nữ đi Thượng Hải (上海) chứ không phải Bắc Kinh (北京).'
  },
  {
    id: 'row-3',
    skill: 'reading',
    partNumber: 1,
    partTitle: 'Phần đọc 1: Chọn từ điền vào chỗ trống',
    prompt: '今天天气很冷，你多穿一件______吧。',
    pinyin: 'Jīntiān tiānqì hěn lěng, nǐ duō chuān yí jiàn ______ ba.',
    audioText: '',
    readingText: '',
    optA: '衣服 (yīfu)',
    optB: '苹果 (píngguǒ)',
    optC: '水 (shuǐ)',
    optD: '书 (shū)',
    correctAnswer: 'A',
    explanation: 'Lượng từ "件" và động từ "穿" (mặc) đi với quần áo (衣服).'
  },
  {
    id: 'row-4',
    skill: 'reading',
    partNumber: 2,
    partTitle: 'Phần đọc 2: Đọc hiểu đoạn văn ngắn',
    prompt: '根据短文，小王最喜欢什么运动？',
    pinyin: 'Gēnjù duǎnwén, Xiǎo Wáng zuì xǐhuan shénme yùndòng?',
    audioText: '',
    readingText: '小王每天早上都去跑步，周末还会和朋友一起打篮球。不过，他最喜欢的运动还是游泳。',
    optA: '跑步 (Chạy bộ)',
    optB: '打篮球 (Bóng rổ)',
    optC: '游泳 (Bơi lội)',
    optD: '踢足球 (Bóng đá)',
    correctAnswer: 'C',
    explanation: 'Câu cuối nêu rõ: "他最喜欢的运动还是游泳" (Môn anh ấy thích nhất vẫn là bơi lội).'
  }
];

export const ExamExcelBatchModal = ({
  isOpen,
  onClose,
  existingExam = null,
  onSaveExam
}) => {
  const [activeTab, setActiveTab] = useState('grid'); // 'grid' | 'paste' | 'preview'
  const fileInputRef = useRef(null);

  // Exam Meta Information
  const [examMeta, setExamMeta] = useState({
    title: 'Đề Thi Thử HSK Mới',
    chineseTitle: '全真模拟考试',
    level: 'HSK 2',
    duration: 35,
    passingScore: 120,
    maxScore: 200,
    tag: 'Đề chuẩn Hanban',
    description: 'Bộ đề mô phỏng chuẩn kỳ thi HSK với đầy đủ kỹ năng Nghe và Đọc hiểu.'
  });

  // Table rows
  const [rows, setRows] = useState(SAMPLE_ROWS);
  const [filterSkill, setFilterSkill] = useState('all'); // 'all' | 'listening' | 'reading' | 'writing'
  const [pasteText, setPasteText] = useState('');
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Populate from existingExam if editing
  useEffect(() => {
    if (existingExam && isOpen) {
      setExamMeta({
        title: existingExam.title || 'Đề Thi Thử HSK',
        chineseTitle: existingExam.chineseTitle || '',
        level: existingExam.level || 'HSK 2',
        duration: existingExam.duration || 35,
        passingScore: existingExam.passingScore || 120,
        maxScore: existingExam.maxScore || 200,
        tag: existingExam.tag || 'Đề chuẩn Hanban',
        description: existingExam.description || ''
      });

      // Flatten questions from skills -> parts -> questions
      const flat = [];
      let rowIdx = 1;
      (existingExam.skills || []).forEach((skill) => {
        (skill.parts || []).forEach((part) => {
          (part.questions || []).forEach((q) => {
            flat.push({
              id: `row-${Date.now()}-${rowIdx++}`,
              skill: skill.type || 'listening',
              partNumber: part.partNumber || 1,
              partTitle: part.title || `Phần ${part.partNumber || 1}`,
              prompt: q.prompt || '',
              pinyin: q.pinyin || '',
              audioText: q.audioText || '',
              readingText: q.readingText || '',
              optA: q.options?.[0] || '',
              optB: q.options?.[1] || '',
              optC: q.options?.[2] || '',
              optD: q.options?.[3] || '',
              correctAnswer: q.correctAnswer || 'A',
              explanation: q.explanation || ''
            });
          });
        });
      });

      if (flat.length > 0) {
        setRows(flat);
      }
    } else if (!existingExam && isOpen) {
      // Default new exam with samples
      setRows(SAMPLE_ROWS);
      setExamMeta({
        title: 'Đề Thi Thử HSK Mới',
        chineseTitle: '全真模拟考试',
        level: 'HSK 2',
        duration: 35,
        passingScore: 120,
        maxScore: 200,
        tag: 'Đề chuẩn Hanban',
        description: 'Bộ đề mô phỏng chuẩn kỳ thi HSK với đầy đủ kỹ năng Nghe và Đọc hiểu.'
      });
    }
  }, [existingExam, isOpen]);

  if (!isOpen) return null;

  // Filter rows
  const displayedRows = filterSkill === 'all' ? rows : rows.filter((r) => r.skill === filterSkill);

  // Update cell in row
  const handleCellChange = (id, field, value) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  // Add Row
  const handleAddRow = (count = 1) => {
    const newItems = [];
    for (let i = 0; i < count; i++) {
      newItems.push({
        id: `row-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        skill: filterSkill !== 'all' ? filterSkill : 'listening',
        partNumber: 1,
        partTitle: 'Phần 1',
        prompt: '',
        pinyin: '',
        audioText: '',
        readingText: '',
        optA: 'A. ',
        optB: 'B. ',
        optC: 'C. ',
        optD: 'D. ',
        correctAnswer: 'A',
        explanation: ''
      });
    }
    setRows((prev) => [...prev, ...newItems]);
    showToast(`Đã thêm ${count} dòng mới vào bảng.`);
  };

  // Delete Row
  const handleDeleteRow = (id) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  // Duplicate Row
  const handleDuplicateRow = (row) => {
    const cloned = {
      ...row,
      id: `row-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    const idx = rows.findIndex((r) => r.id === row.id);
    const updated = [...rows];
    updated.splice(idx + 1, 0, cloned);
    setRows(updated);
    showToast('Đã nhân bản câu hỏi thành công.');
  };

  // Clear all rows
  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ câu hỏi trong bảng?')) {
      setRows([]);
    }
  };

  // =========================================================================
  // PARSE TAB-SEPARATED VALUES (COPY-PASTE FROM EXCEL / GOOGLE SHEETS)
  // =========================================================================
  const handleParsePaste = () => {
    if (!pasteText.trim()) {
      showToast('Vui lòng dán nội dung từ Excel vào ô trước!');
      return;
    }

    const lines = pasteText.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length === 0) return;

    let startIndex = 0;
    const firstLineLower = lines[0].toLowerCase();
    // Detect if line 0 is a header line (e.g. STT, Kỹ năng, Đề bài...)
    if (
      firstLineLower.includes('kỹ năng') ||
      firstLineLower.includes('skill') ||
      firstLineLower.includes('câu hỏi') ||
      firstLineLower.includes('prompt') ||
      firstLineLower.includes('stt')
    ) {
      startIndex = 1;
    }

    const parsed = [];
    for (let i = startIndex; i < lines.length; i++) {
      const parts = lines[i].split('\t');
      if (parts.length < 2) continue; // Skip malformed lines

      let offset = 0;
      if (!isNaN(parseInt(parts[0], 10)) && parts.length >= 7) {
        offset = 1; // Has STT column
      }

      const rawSkill = (parts[offset] || '').trim().toLowerCase();
      let skill = 'listening';
      if (rawSkill.includes('đọc') || rawSkill.includes('read')) skill = 'reading';
      if (rawSkill.includes('viết') || rawSkill.includes('write')) skill = 'writing';

      const partNum = parseInt(parts[offset + 1], 10) || 1;
      const partTitle = (parts[offset + 2] || `Phần ${partNum}`).trim();
      const prompt = (parts[offset + 3] || parts[offset + 1] || '').trim();
      const pinyin = (parts[offset + 4] || '').trim();
      const script = (parts[offset + 5] || '').trim();
      const optA = (parts[offset + 6] || '').trim();
      const optB = (parts[offset + 7] || '').trim();
      const optC = (parts[offset + 8] || '').trim();
      const optD = (parts[offset + 9] || '').trim();
      const rawAns = (parts[offset + 10] || 'A').trim().toUpperCase();
      const explanation = (parts[offset + 11] || '').trim();

      // Normalize correctAnswer
      let correctAnswer = 'A';
      if (rawAns.includes('B') || rawAns === '1' || rawAns.includes('SAI')) correctAnswer = 'B';
      else if (rawAns.includes('C') || rawAns === '2') correctAnswer = 'C';
      else if (rawAns.includes('D') || rawAns === '3') correctAnswer = 'D';

      parsed.push({
        id: `row-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`,
        skill,
        partNumber: partNum,
        partTitle,
        prompt: prompt || 'Chưa nhập câu hỏi',
        pinyin,
        audioText: skill === 'listening' ? script : '',
        readingText: skill === 'reading' ? script : '',
        optA: optA || 'A. ',
        optB: optB || 'B. ',
        optC: optC || '',
        optD: optD || '',
        correctAnswer,
        explanation
      });
    }

    if (parsed.length > 0) {
      setRows((prev) => [...prev, ...parsed]);
      setPasteText('');
      setActiveTab('grid');
      showToast(`🎉 Đã phân tích và thêm ${parsed.length} câu hỏi từ Excel vào bảng!`);
    } else {
      showToast('Không thể nhận diện các cột. Hãy kiểm tra lại định dạng sao chép từ Excel!');
    }
  };

  // =========================================================================
  // EXCEL FILE IMPORT & EXPORT (XLSX)
  // =========================================================================
  const handleDownloadTemplate = () => {
    const data = [
      [
        'STT',
        'Kỹ Năng (Nghe/Đọc/Viết)',
        'Số Thứ Tự Phần',
        'Tiêu Đề Phần Thi',
        'Câu Hỏi / Đề Bài (Chữ Hán)',
        'Phiên Âm Pinyin',
        'Lời Thoại Nghe / Đoạn Đọc',
        'Lựa Chọn A',
        'Lựa Chọn B',
        'Lựa Chọn C',
        'Lựa Chọn D',
        'Đáp Án Đúng (A/B/C/D)',
        'Giải Thích Đáp Án'
      ],
      [
        1,
        'Nghe',
        1,
        'Phần nghe 1: Phán đoán Đúng/Sai',
        '他们正在教室里看书。',
        'Tāmen zhèngzài jiàoshì lǐ kànshū.',
        '男：喂，你在哪儿呢？\n女：我和同学在教室里看书呢。',
        'Đúng (对)',
        'Sai (错)',
        '',
        '',
        'A',
        'Nữ nói rõ đang đọc sách cùng bạn ở lớp.'
      ],
      [
        2,
        'Nghe',
        1,
        'Phần nghe 1: Phán đoán Đúng/Sai',
        '他明天要去北京旅游。',
        'Tā míngtiān yào qù Běijīng lǚyóu.',
        '男：你明天去北京出差吗？\n女：不，我是去上海旅游。',
        'Đúng (对)',
        'Sai (错)',
        '',
        '',
        'B',
        'Nữ đi Thượng Hải chứ không đi Bắc Kinh.'
      ],
      [
        3,
        'Đọc',
        1,
        'Phần đọc 1: Chọn từ điền chỗ trống',
        '今天天气很冷，你多穿一件______吧。',
        'Jīntiān tiānqì hěn lěng, nǐ duō chuān yí jiàn ______ ba.',
        '',
        '衣服',
        '苹果',
        '水',
        '书',
        'A',
        'Lượng từ "件" và động từ "穿" đi với quần áo (衣服).'
      ],
      [
        4,
        'Đọc',
        2,
        'Phần đọc 2: Đọc hiểu đoạn văn',
        '根据短文，小王最喜欢什么运动？',
        'Gēnjù duǎnwén, Xiǎo Wáng zuì xǐhuan shénme yùndòng?',
        '小王每天早上都去跑步，周末还会和朋友一起打篮球。不过，他最喜欢的运动还是游泳。',
        '跑步',
        '打篮球',
        '游泳',
        '踢足球',
        'C',
        'Câu cuối nêu rõ: "他最喜欢的运动还是游泳".'
      ]
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);

    ws['!cols'] = [
      { wch: 6 },  // STT
      { wch: 22 }, // Kỹ năng
      { wch: 14 }, // Số thứ tự phần
      { wch: 30 }, // Tiêu đề phần
      { wch: 35 }, // Câu hỏi
      { wch: 30 }, // Pinyin
      { wch: 40 }, // Lời thoại
      { wch: 20 }, // A
      { wch: 20 }, // B
      { wch: 20 }, // C
      { wch: 20 }, // D
      { wch: 18 }, // Đáp án đúng
      { wch: 45 }  // Giải thích
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Mau_De_Thi_HSK');
    XLSX.writeFile(wb, `Mau_Nhap_De_Thi_HSK_${examMeta.level.replace(/\s+/g, '_')}.xlsx`);
    showToast('✅ Đã tải file mẫu Excel (.xlsx) về máy!');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const firstSheetName = wb.SheetNames[0];
        const ws = wb.Sheets[firstSheetName];
        const rawData = XLSX.utils.sheet_to_json(ws, { header: 1 });

        if (!rawData || rawData.length < 2) {
          showToast('File Excel không có dữ liệu câu hỏi!');
          return;
        }

        const parsed = [];
        for (let i = 1; i < rawData.length; i++) {
          const row = rawData[i];
          if (!row || row.length === 0) continue;

          let offset = 0;
          if (typeof row[0] === 'number') offset = 1;

          const rawSkill = String(row[offset] || '').toLowerCase();
          let skill = 'listening';
          if (rawSkill.includes('đọc') || rawSkill.includes('read')) skill = 'reading';
          if (rawSkill.includes('viết') || rawSkill.includes('write')) skill = 'writing';

          const partNum = parseInt(row[offset + 1], 10) || 1;
          const partTitle = String(row[offset + 2] || `Phần ${partNum}`).trim();
          const prompt = String(row[offset + 3] || '').trim();
          const pinyin = String(row[offset + 4] || '').trim();
          const script = String(row[offset + 5] || '').trim();
          const optA = String(row[offset + 6] || '').trim();
          const optB = String(row[offset + 7] || '').trim();
          const optC = String(row[offset + 8] || '').trim();
          const optD = String(row[offset + 9] || '').trim();
          const rawAns = String(row[offset + 10] || 'A').toUpperCase().trim();
          const explanation = String(row[offset + 11] || '').trim();

          let correctAnswer = 'A';
          if (rawAns.includes('B') || rawAns === '1') correctAnswer = 'B';
          else if (rawAns.includes('C') || rawAns === '2') correctAnswer = 'C';
          else if (rawAns.includes('D') || rawAns === '3') correctAnswer = 'D';

          if (prompt) {
            parsed.push({
              id: `row-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`,
              skill,
              partNumber: partNum,
              partTitle,
              prompt,
              pinyin,
              audioText: skill === 'listening' ? script : '',
              readingText: skill === 'reading' ? script : '',
              optA: optA || 'A. ',
              optB: optB || 'B. ',
              optC,
              optD,
              correctAnswer,
              explanation
            });
          }
        }

        if (parsed.length > 0) {
          setRows(parsed);
          setActiveTab('grid');
          showToast(`🎉 Đã nhập thành công ${parsed.length} câu hỏi từ file Excel!`);
        } else {
          showToast('Không đọc được câu hỏi nào từ file. Vui lòng đối chiếu với file mẫu!');
        }
      } catch (err) {
        console.error(err);
        showToast('Lỗi khi đọc file Excel. Vui lòng kiểm tra lại file!');
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = ''; // Reset input
  };

  // =========================================================================
  // BUILD COMPLETE EXAM HIERARCHY & SAVE TO SUPABASE
  // =========================================================================
  const handleSaveToExam = () => {
    if (!examMeta.title.trim()) {
      alert('Vui lòng nhập tên đề thi!');
      return;
    }

    if (rows.length === 0) {
      alert('Đề thi chưa có câu hỏi nào! Hãy thêm câu hỏi trước khi lưu.');
      return;
    }

    // Check for empty prompts
    const emptyPrompt = rows.find((r) => !r.prompt.trim());
    if (emptyPrompt) {
      alert('Có câu hỏi chưa nhập nội dung đề bài! Vui lòng kiểm tra lại bảng.');
      return;
    }

    const examId = existingExam?.id || `exam-${Date.now()}`;

    // Group rows by skill
    const skillTypes = ['listening', 'reading', 'writing'];
    const skills = [];

    skillTypes.forEach((sType) => {
      const skillRows = rows.filter((r) => r.skill === sType);
      if (skillRows.length === 0) return;

      const skillName =
        sType === 'listening'
          ? 'Kỹ Năng Nghe Hiểu (听力)'
          : sType === 'reading'
          ? 'Kỹ Năng Đọc Hiểu (阅读)'
          : 'Kỹ Năng Viết (书写)';

      const skillChinese =
        sType === 'listening' ? '听力部分' : sType === 'reading' ? '阅读部分' : '书写部分';

      // Group by partNumber
      const partsMap = new Map();
      skillRows.forEach((r) => {
        const pNum = r.partNumber || 1;
        if (!partsMap.has(pNum)) {
          partsMap.set(pNum, {
            id: `part-${sType}-${pNum}-${Date.now()}`,
            partNumber: pNum,
            title: r.partTitle || `Phần ${pNum}`,
            instructions:
              sType === 'listening'
                ? 'Lắng nghe câu thoại và lựa chọn đáp án chính xác nhất.'
                : 'Đọc kỹ câu hỏi hoặc đoạn văn và chọn phương án đúng.',
            questions: []
          });
        }

        const partObj = partsMap.get(pNum);
        const optionsList = [r.optA, r.optB, r.optC, r.optD].filter((opt) => opt && opt.trim().length > 0);

        partObj.questions.push({
          id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 7)}`,
          questionNumber: partObj.questions.length + 1,
          prompt: r.prompt.trim(),
          audioText: r.audioText ? r.audioText.trim() : null,
          readingText: r.readingText ? r.readingText.trim() : null,
          pinyin: r.pinyin ? r.pinyin.trim() : null,
          options: optionsList.length > 0 ? optionsList : ['A. ', 'B. '],
          correctAnswer: r.correctAnswer || 'A',
          explanation: r.explanation ? r.explanation.trim() : null
        });
      });

      skills.push({
        id: `skill-${sType}-${Date.now()}`,
        type: sType,
        name: skillName,
        chineseName: skillChinese,
        parts: Array.from(partsMap.values())
      });
    });

    const completeExam = {
      id: examId,
      title: examMeta.title.trim(),
      chineseTitle: examMeta.chineseTitle.trim() || '全真模拟考试',
      level: examMeta.level,
      duration: parseInt(examMeta.duration, 10) || 35,
      passingScore: parseInt(examMeta.passingScore, 10) || 120,
      maxScore: parseInt(examMeta.maxScore, 10) || 200,
      tag: examMeta.tag.trim() || 'Đề chuẩn Hanban',
      description: examMeta.description.trim(),
      skills
    };

    if (onSaveExam) {
      onSaveExam(completeExam);
    }
    onClose();
  };

  const listeningCount = rows.filter((r) => r.skill === 'listening').length;
  const readingCount = rows.filter((r) => r.skill === 'reading').length;

  return (
    <div className="modal-overlay" style={{ zIndex: 1200 }}>
      <div
        className="excel-batch-modal"
        style={{
          width: '95vw',
          maxWidth: '1420px',
          height: '92vh',
          background: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1.5px solid #cbd5e1'
        }}
      >
        {/* Toast Alert */}
        {toastMsg && (
          <div
            style={{
              position: 'fixed',
              top: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#0f172a',
              color: '#f8fafc',
              padding: '0.65rem 1.4rem',
              borderRadius: '999px',
              fontSize: '0.86rem',
              fontWeight: 700,
              boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Modal Top Header (Green Excel Theme) */}
        <div
          style={{
            background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
            color: '#ffffff',
            padding: '1rem 1.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '2px solid #14532d'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem'
              }}
            >
              <i className="fa-solid fa-file-excel"></i>
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
                Trình Nhập Đề Thi HSK Theo Kiểu Bảng Tính Excel
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#bbf7d0' }}>
                Soạn thảo trực tiếp hàng loạt câu hỏi, sao chép dán trực tiếp từ Excel hoặc tải file .xlsx
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Quick Stats Pill */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.25)',
                padding: '0.4rem 0.85rem',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                gap: '0.75rem'
              }}
            >
              <span>Tổng: <strong>{rows.length}</strong> câu</span>
              <span>🎧 Nghe: <strong>{listeningCount}</strong></span>
              <span>📖 Đọc: <strong>{readingCount}</strong></span>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: '#fff',
                fontSize: '1.1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s'
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Exam Metadata Strip */}
        <div
          style={{
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            padding: '0.75rem 1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.75rem',
            alignItems: 'center'
          }}
        >
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#475569', marginBottom: '2px' }}>
              Tên đề thi:
            </label>
            <input
              type="text"
              value={examMeta.title}
              onChange={(e) => setExamMeta({ ...examMeta, title: e.target.value })}
              style={{
                width: '100%',
                padding: '0.45rem 0.65rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                fontWeight: 700,
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#475569', marginBottom: '2px' }}>
              Tên tiếng Trung:
            </label>
            <input
              type="text"
              value={examMeta.chineseTitle}
              onChange={(e) => setExamMeta({ ...examMeta, chineseTitle: e.target.value })}
              style={{
                width: '100%',
                padding: '0.45rem 0.65rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ maxWidth: '130px' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#475569', marginBottom: '2px' }}>
              Cấp độ HSK:
            </label>
            <select
              value={examMeta.level}
              onChange={(e) => setExamMeta({ ...examMeta, level: e.target.value })}
              style={{
                width: '100%',
                padding: '0.45rem 0.65rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                fontWeight: 700,
                background: '#ffffff',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {HSK_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          <div style={{ maxWidth: '110px' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#475569', marginBottom: '2px' }}>
              Thời gian (phút):
            </label>
            <input
              type="number"
              value={examMeta.duration}
              onChange={(e) => setExamMeta({ ...examMeta, duration: e.target.value })}
              style={{
                width: '100%',
                padding: '0.45rem 0.65rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                fontWeight: 700,
                outline: 'none'
              }}
            />
          </div>

          <div style={{ maxWidth: '110px' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#475569', marginBottom: '2px' }}>
              Điểm đạt / tối đa:
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                type="number"
                value={examMeta.passingScore}
                onChange={(e) => setExamMeta({ ...examMeta, passingScore: e.target.value })}
                style={{ width: '50px', padding: '0.45rem 0.4rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', textAlign: 'center' }}
              />
              <span>/</span>
              <input
                type="number"
                value={examMeta.maxScore}
                onChange={(e) => setExamMeta({ ...examMeta, maxScore: e.target.value })}
                style={{ width: '50px', padding: '0.45rem 0.4rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', textAlign: 'center' }}
              />
            </div>
          </div>
        </div>

        {/* Toolbar & Tab Controls */}
        <div
          style={{
            padding: '0.65rem 1.5rem',
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          {/* Main Action Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              type="button"
              onClick={() => setActiveTab('grid')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'grid' ? '#166534' : '#f1f5f9',
                color: activeTab === 'grid' ? '#ffffff' : '#475569',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <i className="fa-solid fa-table"></i>
              <span>Bảng Nhập Dữ Liệu ({rows.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'paste' ? '#166534' : '#f1f5f9',
                color: activeTab === 'paste' ? '#ffffff' : '#475569',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <i className="fa-solid fa-paste"></i>
              <span>Dán Nhanh Từ Excel (Ctrl+V)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'preview' ? '#166534' : '#f1f5f9',
                color: activeTab === 'preview' ? '#ffffff' : '#475569',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <i className="fa-regular fa-eye"></i>
              <span>Xem Trước Cấu Trúc Đề</span>
            </button>
          </div>

          {/* Action Tools: Download Template, Upload Excel, Add Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              title="Tải về file Excel mẫu đã định dạng sẵn các cột để soạn câu hỏi"
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                border: '1.5px solid #16a34a',
                background: '#f0fdf4',
                color: '#15803d',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <i className="fa-solid fa-download"></i>
              <span>Tải File Mẫu (.xlsx)</span>
            </button>

            <label
              title="Tải lên file Excel (.xlsx / .csv) để nhập câu hỏi tự động"
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <i className="fa-solid fa-file-import"></i>
              <span>Nhập File Excel</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>

            <button
              type="button"
              onClick={() => handleAddRow(1)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                border: 'none',
                background: '#0f172a',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <i className="fa-solid fa-plus"></i>
              <span>Thêm 1 Dòng</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddRow(5)}
              style={{
                padding: '0.45rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                color: '#334155',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              +5 Dòng
            </button>

            <button
              type="button"
              onClick={handleClearAll}
              title="Xóa toàn bộ dòng trong bảng"
              style={{
                padding: '0.45rem 0.65rem',
                borderRadius: '8px',
                border: '1px solid #fee2e2',
                background: '#fef2f2',
                color: '#dc2626',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <i className="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* TAB 1: SPREADSHEET GRID VIEW */}
        {/* ===================================================================== */}
        {activeTab === 'grid' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Skill Filter Bar */}
            <div
              style={{
                padding: '0.45rem 1.5rem',
                background: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#475569'
              }}
            >
              <span>Lọc theo kỹ năng:</span>
              <button
                type="button"
                onClick={() => setFilterSkill('all')}
                style={{
                  border: 'none',
                  background: filterSkill === 'all' ? '#334155' : 'transparent',
                  color: filterSkill === 'all' ? '#fff' : '#64748b',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Tất cả ({rows.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterSkill('listening')}
                style={{
                  border: 'none',
                  background: filterSkill === 'listening' ? '#166534' : 'transparent',
                  color: filterSkill === 'listening' ? '#fff' : '#166534',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                🎧 Nghe ({listeningCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterSkill('reading')}
                style={{
                  border: 'none',
                  background: filterSkill === 'reading' ? '#991b1b' : 'transparent',
                  color: filterSkill === 'reading' ? '#fff' : '#991b1b',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                📖 Đọc ({readingCount})
              </button>
            </div>

            {/* Scrollable Table Area */}
            <div style={{ flex: 1, overflow: 'auto', background: '#f8fafc' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.82rem',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              >
                <thead
                  style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    background: '#e2e8f0',
                    color: '#1e293b',
                    fontWeight: 800,
                    textAlign: 'left'
                  }}
                >
                  <tr>
                    <th style={{ padding: '8px 10px', width: '40px', textAlign: 'center', borderRight: '1px solid #cbd5e1' }}>STT</th>
                    <th style={{ padding: '8px 10px', width: '90px', borderRight: '1px solid #cbd5e1' }}>Kỹ Năng</th>
                    <th style={{ padding: '8px 10px', width: '70px', borderRight: '1px solid #cbd5e1' }}>Phần</th>
                    <th style={{ padding: '8px 10px', minWidth: '220px', borderRight: '1px solid #cbd5e1' }}>Câu Hỏi / Đề Bài (Chữ Hán) *</th>
                    <th style={{ padding: '8px 10px', minWidth: '180px', borderRight: '1px solid #cbd5e1' }}>Phiên Âm Pinyin</th>
                    <th style={{ padding: '8px 10px', minWidth: '200px', borderRight: '1px solid #cbd5e1' }}>Lời Thoại Nghe / Đoạn Đọc</th>
                    <th style={{ padding: '8px 8px', minWidth: '130px', borderRight: '1px solid #cbd5e1' }}>Đáp Án A</th>
                    <th style={{ padding: '8px 8px', minWidth: '130px', borderRight: '1px solid #cbd5e1' }}>Đáp Án B</th>
                    <th style={{ padding: '8px 8px', minWidth: '130px', borderRight: '1px solid #cbd5e1' }}>Đáp Án C</th>
                    <th style={{ padding: '8px 8px', minWidth: '130px', borderRight: '1px solid #cbd5e1' }}>Đáp Án D</th>
                    <th style={{ padding: '8px 6px', width: '80px', textAlign: 'center', borderRight: '1px solid #cbd5e1' }}>Đúng</th>
                    <th style={{ padding: '8px 10px', minWidth: '180px', borderRight: '1px solid #cbd5e1' }}>Giải Thích</th>
                    <th style={{ padding: '8px 8px', width: '70px', textAlign: 'center' }}>Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedRows.length === 0 ? (
                    <tr>
                      <td colSpan={13} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                        Chưa có câu hỏi nào trong danh sách. Bấm <strong>"Thêm 1 Dòng"</strong> hoặc bấm <strong>"Dán Nhanh Từ Excel"</strong> để nhập dữ liệu!
                      </td>
                    </tr>
                  ) : (
                    displayedRows.map((row, idx) => (
                      <tr
                        key={row.id}
                        style={{
                          background: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                          borderBottom: '1px solid #e2e8f0',
                          transition: 'background 0.1s'
                        }}
                      >
                        {/* STT */}
                        <td style={{ padding: '6px 8px', textAlign: 'center', fontWeight: 800, color: '#64748b', borderRight: '1px solid #e2e8f0' }}>
                          {idx + 1}
                        </td>

                        {/* Kỹ năng (Dropdown) */}
                        <td style={{ padding: '4px 6px', borderRight: '1px solid #e2e8f0' }}>
                          <select
                            value={row.skill}
                            onChange={(e) => handleCellChange(row.id, 'skill', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '4px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              background: row.skill === 'listening' ? '#f0fdf4' : '#fef2f2',
                              color: row.skill === 'listening' ? '#166534' : '#991b1b',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="listening">🎧 Nghe</option>
                            <option value="reading">📖 Đọc</option>
                            <option value="writing">✍️ Viết</option>
                          </select>
                        </td>

                        {/* Phần thi (Part Number) */}
                        <td style={{ padding: '4px 6px', borderRight: '1px solid #e2e8f0' }}>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={row.partNumber}
                            onChange={(e) => handleCellChange(row.id, 'partNumber', parseInt(e.target.value, 10) || 1)}
                            style={{
                              width: '100%',
                              padding: '4px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              textAlign: 'center',
                              fontSize: '0.8rem',
                              fontWeight: 700
                            }}
                          />
                        </td>

                        {/* Prompt (Chữ Hán) */}
                        <td style={{ padding: '4px 6px', borderRight: '1px solid #e2e8f0' }}>
                          <input
                            type="text"
                            placeholder="Nhập chữ Hán..."
                            value={row.prompt}
                            onChange={(e) => handleCellChange(row.id, 'prompt', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: row.prompt.trim() ? '1px solid #cbd5e1' : '1.5px solid #ef4444',
                              fontSize: '0.85rem',
                              fontWeight: 600
                            }}
                          />
                        </td>

                        {/* Pinyin */}
                        <td style={{ padding: '4px 6px', borderRight: '1px solid #e2e8f0' }}>
                          <input
                            type="text"
                            placeholder="Pinyin..."
                            value={row.pinyin}
                            onChange={(e) => handleCellChange(row.id, 'pinyin', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.8rem',
                              color: '#64748b'
                            }}
                          />
                        </td>

                        {/* Audio text / Reading text */}
                        <td style={{ padding: '4px 6px', borderRight: '1px solid #e2e8f0' }}>
                          <input
                            type="text"
                            placeholder={row.skill === 'listening' ? 'Lời thoại audio nghe...' : 'Đoạn văn đọc...'}
                            value={row.skill === 'listening' ? row.audioText : row.readingText}
                            onChange={(e) =>
                              handleCellChange(
                                row.id,
                                row.skill === 'listening' ? 'audioText' : 'readingText',
                                e.target.value
                              )
                            }
                            style={{
                              width: '100%',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.8rem'
                            }}
                          />
                        </td>

                        {/* Option A */}
                        <td style={{ padding: '4px 6px', borderRight: '1px solid #e2e8f0' }}>
                          <input
                            type="text"
                            value={row.optA}
                            onChange={(e) => handleCellChange(row.id, 'optA', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '4px 6px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.8rem'
                            }}
                          />
                        </td>

                        {/* Option B */}
                        <td style={{ padding: '4px 6px', borderRight: '1px solid #e2e8f0' }}>
                          <input
                            type="text"
                            value={row.optB}
                            onChange={(e) => handleCellChange(row.id, 'optB', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '4px 6px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.8rem'
                            }}
                          />
                        </td>

                        {/* Option C */}
                        <td style={{ padding: '4px 6px', borderRight: '1px solid #e2e8f0' }}>
                          <input
                            type="text"
                            value={row.optC}
                            onChange={(e) => handleCellChange(row.id, 'optC', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '4px 6px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.8rem'
                            }}
                          />
                        </td>

                        {/* Option D */}
                        <td style={{ padding: '4px 6px', borderRight: '1px solid #e2e8f0' }}>
                          <input
                            type="text"
                            value={row.optD}
                            onChange={(e) => handleCellChange(row.id, 'optD', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '4px 6px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.8rem'
                            }}
                          />
                        </td>

                        {/* Đáp án đúng (Dropdown A, B, C, D) */}
                        <td style={{ padding: '4px 6px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>
                          <select
                            value={row.correctAnswer}
                            onChange={(e) => handleCellChange(row.id, 'correctAnswer', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '4px',
                              borderRadius: '6px',
                              border: '1.5px solid #16a34a',
                              background: '#f0fdf4',
                              color: '#15803d',
                              fontWeight: 800,
                              fontSize: '0.82rem',
                              textAlign: 'center',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                          </select>
                        </td>

                        {/* Giải thích */}
                        <td style={{ padding: '4px 6px', borderRight: '1px solid #e2e8f0' }}>
                          <input
                            type="text"
                            placeholder="Giải thích ngữ pháp/từ vựng..."
                            value={row.explanation}
                            onChange={(e) => handleCellChange(row.id, 'explanation', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.8rem'
                            }}
                          />
                        </td>

                        {/* Actions (Duplicate / Delete) */}
                        <td style={{ padding: '4px 6px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
                            <button
                              type="button"
                              onClick={() => handleDuplicateRow(row)}
                              title="Nhân bản câu này"
                              style={{
                                border: 'none',
                                background: '#f1f5f9',
                                color: '#334155',
                                borderRadius: '4px',
                                width: '24px',
                                height: '24px',
                                cursor: 'pointer',
                                fontSize: '0.72rem'
                              }}
                            >
                              <i className="fa-regular fa-copy"></i>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteRow(row.id)}
                              title="Xóa câu này"
                              style={{
                                border: 'none',
                                background: '#fee2e2',
                                color: '#dc2626',
                                borderRadius: '4px',
                                width: '24px',
                                height: '24px',
                                cursor: 'pointer',
                                fontSize: '0.72rem'
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 2: QUICK PASTE FROM EXCEL / GOOGLE SHEETS */}
        {/* ===================================================================== */}
        {activeTab === 'paste' && (
          <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'auto' }}>
            <div
              style={{
                background: '#f0fdf4',
                border: '1.5px dashed #16a34a',
                borderRadius: '16px',
                padding: '1.25rem'
              }}
            >
              <h3 style={{ margin: '0 0 0.4rem', color: '#166534', fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fa-solid fa-lightbulb"></i>
                <span>Hướng Dẫn Sao Chép - Dán Nhanh Từ Excel / Google Sheets</span>
              </h3>
              <p style={{ margin: '0 0 0.65rem', fontSize: '0.85rem', color: '#15803d', lineHeight: 1.5 }}>
                1. Mở file Excel đề thi của bạn (hoặc bấm <strong>"Tải File Mẫu (.xlsx)"</strong> ở thanh công cụ).<br />
                2. Bôi đen các dòng câu hỏi cần nhập và nhấn <strong>Ctrl + C</strong>.<br />
                3. Nhấp vào khung bên dưới và nhấn <strong>Ctrl + V</strong>, sau đó bấm <strong>"Phân Tích & Nạp Dữ Liệu"</strong>.
              </p>
              <div style={{ fontSize: '0.78rem', color: '#166534', background: '#dcfce7', padding: '0.5rem 0.85rem', borderRadius: '8px' }}>
                <strong>Thứ tự cột chuẩn:</strong> STT (tùy chọn) ➔ Kỹ năng (Nghe/Đọc) ➔ Số phần ➔ Tiêu đề phần ➔ Đề bài ➔ Pinyin ➔ Lời thoại ➔ Đáp án A ➔ Đáp án B ➔ Đáp án C ➔ Đáp án D ➔ Đáp án đúng (A/B/C/D) ➔ Giải thích.
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginBottom: '0.4rem' }}>
                Dán dữ liệu sao chép từ bảng tính Excel vào đây:
              </label>
              <textarea
                rows={12}
                placeholder="Nhấp vào đây và bấm Ctrl+V để dán dữ liệu..."
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                style={{
                  width: '100%',
                  flex: 1,
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  fontFamily: 'monospace',
                  fontSize: '0.82rem',
                  outline: 'none',
                  resize: 'none',
                  lineHeight: 1.5
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setPasteText('')}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  color: '#475569',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Xóa Nội Dung Đã Dán
              </button>

              <button
                type="button"
                onClick={handleParsePaste}
                style={{
                  padding: '0.65rem 1.6rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#166534',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(22, 101, 52, 0.3)'
                }}
              >
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                <span>Phân Tích & Nạp Dữ Liệu Vào Bảng</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 3: LIVE PREVIEW & HIERARCHY CHECK */}
        {/* ===================================================================== */}
        {activeTab === 'preview' && (
          <div style={{ flex: 1, padding: '1.5rem', overflow: 'auto', background: '#f8fafc' }}>
            <div style={{ maxWidth: '980px', margin: '0 auto' }}>
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '18px',
                  border: '1px solid #e2e8f0',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)'
                }}
              >
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#dc2626', background: '#fee2e2', padding: '2px 8px', borderRadius: '6px' }}>
                  {examMeta.level}
                </span>
                <h3 style={{ margin: '0.5rem 0 0.2rem', fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>
                  {examMeta.title}
                </h3>
                <div style={{ fontSize: '0.95rem', color: '#991b1b', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {examMeta.chineseTitle}
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                  {examMeta.description} • Thời lượng: <strong>{examMeta.duration} phút</strong> • Điểm đạt: <strong>{examMeta.passingScore}/{examMeta.maxScore}</strong>
                </p>
              </div>

              {/* Summary Breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: '#f0fdf4', borderRadius: '16px', border: '1px solid #bbf7d0', padding: '1.25rem' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#166534', marginBottom: '0.4rem' }}>
                    🎧 Kỹ Năng Nghe Hiểu (听力)
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#15803d' }}>
                    Gồm <strong>{listeningCount}</strong> câu hỏi.
                  </div>
                </div>

                <div style={{ background: '#fef2f2', borderRadius: '16px', border: '1px solid #fecaca', padding: '1.25rem' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#991b1b', marginBottom: '0.4rem' }}>
                    📖 Kỹ Năng Đọc Hiểu (阅读)
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#b91c1c' }}>
                    Gồm <strong>{readingCount}</strong> câu hỏi.
                  </div>
                </div>
              </div>

              {/* Sample Questions Rendered */}
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
                Danh Sách Câu Hỏi Mô Phỏng ({rows.length} câu)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {rows.map((r, i) => (
                  <div
                    key={r.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '14px',
                      border: '1px solid #e2e8f0',
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 800, color: '#1e293b' }}>Câu {i + 1}.</span>
                        <span style={{ fontSize: '0.72rem', padding: '2px 6px', borderRadius: '6px', background: r.skill === 'listening' ? '#dcfce7' : '#fee2e2', color: r.skill === 'listening' ? '#166534' : '#991b1b', fontWeight: 700 }}>
                          {r.skill === 'listening' ? '🎧 Nghe' : '📖 Đọc'} (Phần {r.partNumber})
                        </span>
                        {r.pinyin && <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{r.pinyin}</span>}
                      </div>

                      <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                        {r.prompt}
                      </div>

                      {r.audioText && (
                        <div style={{ fontSize: '0.8rem', color: '#047857', background: '#f0fdf4', padding: '0.35rem 0.65rem', borderRadius: '6px', marginBottom: '0.4rem' }}>
                          <strong>Audio thoại:</strong> {r.audioText}
                        </div>
                      )}

                      {r.readingText && (
                        <div style={{ fontSize: '0.8rem', color: '#b45309', background: '#fffbeb', padding: '0.35rem 0.65rem', borderRadius: '6px', marginBottom: '0.4rem' }}>
                          <strong>Đoạn đọc:</strong> {r.readingText}
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.82rem', color: '#334155' }}>
                        {r.optA && <span><strong>A.</strong> {r.optA}</span>}
                        {r.optB && <span><strong>B.</strong> {r.optB}</span>}
                        {r.optC && <span><strong>C.</strong> {r.optC}</span>}
                        {r.optD && <span><strong>D.</strong> {r.optD}</span>}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '8px', background: '#16a34a', color: '#fff', fontSize: '0.78rem', fontWeight: 800 }}>
                        Đáp án: {r.correctAnswer}
                      </span>
                      {r.explanation && (
                        <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.3rem', maxWidth: '180px' }}>
                          {r.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal Bottom Footer Actions */}
        <div
          style={{
            padding: '0.85rem 1.75rem',
            background: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Tổng số câu hợp lệ: <strong>{rows.filter((r) => r.prompt.trim()).length}</strong> / {rows.length} câu
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.65rem 1.4rem',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                color: '#475569',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              Hủy Bỏ
            </button>

            <button
              type="button"
              onClick={handleSaveToExam}
              style={{
                padding: '0.65rem 1.8rem',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #166534 0%, #14532d 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(22, 101, 52, 0.35)'
              }}
            >
              <i className="fa-solid fa-cloud-arrow-up"></i>
              <span>Lưu Toàn Bộ Đề Thi Lên Supabase</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
