import pg from 'pg';
const { Client } = pg;
const client = new Client({
  host: 'aws-0-ap-northeast-2.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.vwuikidgncknuozufiyi',
  password: 'ThuHoai1409',
  ssl: { rejectUnauthorized: false }
});

const Q3_LESSON_DATA = [
  {
    lessonId: 'course-hsk3-q3-l01',
    titleZh: '你想吃什么就点什么',
    vocab: '菜单 (càidān), 点菜 (diǎncài), 随便 (suíbiàn), 味道 (wèidao)',
    listening: {
      prompt: '听录音选择正确答案：服务员问顾客想吃什么，顾客怎么回答？',
      audioText: '服务员：请问您想吃点儿什么？顾客：你们这儿有什么特色菜？你想吃什么就点什么吧。',
      options: [
        { id: 'A', hanzi: '想吃什么就点什么', meaning: 'Muốn ăn gì thì gọi nấy', isCorrect: true },
        { id: 'B', hanzi: '今天不吃特色菜', meaning: 'Hôm nay không ăn món đặc sản', isCorrect: false },
        { id: 'C', hanzi: '只喝一杯热水', meaning: 'Chỉ uống một cốc nước nóng', isCorrect: false }
      ]
    },
    pinyin: {
      prompt: '选择正确的拼音与声调：菜单',
      hanzi: '菜单',
      meaning: 'Thực đơn (Menu)',
      options: [
        { id: 'A', text: 'càidān', isCorrect: true },
        { id: 'B', text: 'cǎidān', isCorrect: false },
        { id: 'C', text: 'cāidǎn', isCorrect: false }
      ]
    },
    word_order: {
      prompt: '连词成句：你想吃什么就吃什么。',
      meaning: 'Bạn muốn ăn gì thì ăn nấy.',
      chips: [
        { id: 'c1', word: '你' },
        { id: 'c2', word: '想吃什么' },
        { id: 'c3', word: '就' },
        { id: 'c4', word: '吃什么' },
        { id: 'c5', word: '。' }
      ]
    },
    voice: {
      prompt: '大声朗读课文核心句并录音：',
      text: '今天我请客，你想吃什么就点什么吧！',
      pinyin: 'Jīntiān wǒ qǐngkè, nǐ xiǎng chī shénme jiù diǎn shénme ba!',
      meaning: 'Hôm nay tôi đãi, bạn muốn ăn gì cứ gọi nấy nhé!'
    },
    writing: {
      prompt: '练习书写生字：点 (diǎn - 9 nét, bộ Hỏa 灬)',
      char: '点',
      pinyin: 'diǎn',
      strokes: 9,
      radicals: '灬 (Hỏa)',
      meaning: 'Điểm, gọi món, một chút'
    }
  },
  {
    lessonId: 'course-hsk3-q3-l02',
    titleZh: '我们搬家了',
    vocab: '搬家 (bānjiā), 房东 (fángdōng), 附近 (fùjìn), 方便 (fāngbiàn)',
    listening: {
      prompt: '听对话选择正确答案：他们为什么搬家？',
      audioText: '大卫：听说你们搬家了？小明：对，新家离公司更近，上下班更方便。',
      options: [
        { id: 'A', hanzi: '新家离公司更近，上下班方便', meaning: 'Nhà mới gần công ty hơn, đi làm tiện hơn', isCorrect: true },
        { id: 'B', hanzi: '房东不租了', meaning: 'Chủ nhà không cho thuê nữa', isCorrect: false },
        { id: 'C', hanzi: '旧家附近没有超市', meaning: 'Nhà cũ gần đó không có siêu thị', isCorrect: false }
      ]
    },
    pinyin: {
      prompt: '选择正确的拼音与声调：附近',
      hanzi: '附近',
      meaning: 'Lân cận, gần đây',
      options: [
        { id: 'A', text: 'fùjìn', isCorrect: true },
        { id: 'B', text: 'fǔjīn', isCorrect: false },
        { id: 'C', text: 'fùjǐng', isCorrect: false }
      ]
    },
    word_order: {
      prompt: '连词成句：我们搬到新家了。',
      meaning: 'Chúng tôi đã chuyển sang nhà mới rồi.',
      chips: [
        { id: 'c1', word: '我们' },
        { id: 'c2', word: '搬到' },
        { id: 'c3', word: '新家' },
        { id: 'c4', word: '了' },
        { id: 'c5', word: '。' }
      ]
    },
    voice: {
      prompt: '大声朗读课文核心句并录音：',
      text: '我们上个周末刚搬家，欢迎周末来我家玩！',
      pinyin: 'Wǒmen shàng gè zhōumò gāng bānjiā, huānyíng zhōumò lái wǒ jiā wán!',
      meaning: 'Cuối tuần trước chúng tôi vừa chuyển nhà, hoan nghênh cuối tuần tới nhà tôi chơi!'
    },
    writing: {
      prompt: '练习书写生字：近 (jìn - 7 nét, bộ Xước 辶)',
      char: '近',
      pinyin: 'jìn',
      strokes: 7,
      radicals: '辶 (Xước)',
      meaning: 'Gần, thân cận'
    }
  },
  {
    lessonId: 'course-hsk3-q3-l03',
    titleZh: '北京一点儿也不热',
    vocab: '气候 (qìhòu), 刮风 (guāfēng), 一点儿也不 (yìdiǎnr yě bù)',
    listening: {
      prompt: '听对话选择正确答案：北京现在的天气怎么样？',
      audioText: '王丽：北京现在热吗？李强：现在秋天了，刮着凉风，一点儿也不热。',
      options: [
        { id: 'A', hanzi: '一点儿也不热，很舒服', meaning: 'Chẳng nóng chút nào, rất dễ chịu', isCorrect: true },
        { id: 'B', hanzi: '北京现在非常热', meaning: 'Bắc Kinh bây giờ rất nóng', isCorrect: false },
        { id: 'C', hanzi: '每天都下大雨', meaning: 'Ngày nào cũng mưa to', isCorrect: false }
      ]
    },
    pinyin: {
      prompt: '选择正确的拼音与声调：刮风',
      hanzi: '刮风',
      meaning: 'Nổi gió, gió thổi',
      options: [
        { id: 'A', text: 'guāfēng', isCorrect: true },
        { id: 'B', text: 'guǎfēng', isCorrect: false },
        { id: 'C', text: 'guàfēn', isCorrect: false }
      ]
    },
    word_order: {
      prompt: '连词成句：这个西瓜一点儿也不甜。',
      meaning: 'Quả dưa hấu này chẳng ngọt chút nào.',
      chips: [
        { id: 'c1', word: '这个西瓜' },
        { id: 'c2', word: '一点儿' },
        { id: 'c3', word: '也' },
        { id: 'c4', word: '不甜' },
        { id: 'c5', word: '。' }
      ]
    },
    voice: {
      prompt: '大声朗读课文核心句并录音：',
      text: '今天外边刮大风，天气一点儿也不热。',
      pinyin: 'Jīntiān wàibian guā dàfēng, tiānqì yìdiǎnr yě bú rè.',
      meaning: 'Hôm nay bên ngoài gió lớn, thời tiết chẳng nóng chút nào.'
    },
    writing: {
      prompt: '练习书写生字：热 (rè - 10 nét, bộ Hỏa 灬)',
      char: '热',
      pinyin: 'rè',
      strokes: 10,
      radicals: '灬 (Hỏa)',
      meaning: 'Nóng, nhiệt tình'
    }
  },
  {
    lessonId: 'course-hsk3-q3-l04',
    titleZh: '这些照片每一张都很漂亮',
    vocab: '照片 (zhàopiàn), 照相机 (zhàoxiàngjī), 每一张 (měi yì zhāng)',
    listening: {
      prompt: '听对话选择正确答案：男的觉得女的照片拍得怎么样？',
      audioText: '女：这是我去上海拍的照片，你觉得怎么样？男：太棒了！这些照片每一张都很漂亮。',
      options: [
        { id: 'A', hanzi: '每一张都很漂亮', meaning: 'Từng bức ảnh đều rất đẹp', isCorrect: true },
        { id: 'B', hanzi: '拍得太黑了', meaning: 'Chụp tối quá', isCorrect: false },
        { id: 'C', hanzi: '照片太少了', meaning: 'Ít ảnh quá', isCorrect: false }
      ]
    },
    pinyin: {
      prompt: '选择正确的拼音与声调：照片',
      hanzi: '照片',
      meaning: 'Bức ảnh, hình ảnh',
      options: [
        { id: 'A', text: 'zhàopiàn', isCorrect: true },
        { id: 'B', text: 'zhǎopiàn', isCorrect: false },
        { id: 'C', text: 'zhàopiān', isCorrect: false }
      ]
    },
    word_order: {
      prompt: '连词成句：这些照片每一张都很漂亮。',
      meaning: 'Những bức ảnh này từng tấm đều rất đẹp.',
      chips: [
        { id: 'c1', word: '这些照片' },
        { id: 'c2', word: '每一张' },
        { id: 'c3', word: '都' },
        { id: 'c4', word: '很漂亮' },
        { id: 'c5', word: '。' }
      ]
    },
    voice: {
      prompt: '大声朗读课文核心句并录音：',
      text: '我们班的同学每一个都很认真学习。',
      pinyin: 'Wǒmen bān de tóngxué měi yí gè dōu hěn rènzhēn xuéxí.',
      meaning: 'Bạn học lớp chúng tôi từng người đều học tập rất chăm chỉ.'
    },
    writing: {
      prompt: '练习书写生字：张 (zhāng - 7 nét, bộ Cung 弓)',
      char: '张',
      pinyin: 'zhāng',
      strokes: 7,
      radicals: '弓 (Cung)',
      meaning: 'Trương (lượng từ cho tranh ảnh, giấy tờ)'
    }
  },
  {
    lessonId: 'course-hsk3-q3-l05',
    titleZh: '坐高铁比坐飞机方便',
    vocab: '高铁 (gāotiě), 航班 (hángbān), 比较 (bǐjiào), 准时 (zhǔnshí)',
    listening: {
      prompt: '听录音选择正确答案：为什么他们选择坐高铁？',
      audioText: '王经理：去南京坐高铁还是飞机？张秘书：南京不远，高铁准时而且不用提前两小时去机场，比坐飞机方便。',
      options: [
        { id: 'A', hanzi: '高铁准时且省时间，比飞机方便', meaning: 'Tàu cao tốc đúng giờ và tiết kiệm thời gian, tiện hơn máy bay', isCorrect: true },
        { id: 'B', hanzi: '坐飞机机票买不到', meaning: 'Không mua được vé máy bay', isCorrect: false },
        { id: 'C', hanzi: '去南京没有高铁', meaning: 'Đi Nam Kinh không có tàu cao tốc', isCorrect: false }
      ]
    },
    pinyin: {
      prompt: '选择正确的拼音与声调：准时',
      hanzi: '准时',
      meaning: 'Đúng giờ',
      options: [
        { id: 'A', text: 'zhǔnshí', isCorrect: true },
        { id: 'B', text: 'zǔnshí', isCorrect: false },
        { id: 'C', text: 'zhǔnsí', isCorrect: false }
      ]
    },
    word_order: {
      prompt: '连词成句：坐高铁比坐飞机方便得多。',
      meaning: 'Đi tàu cao tốc tiện hơn đi máy bay nhiều.',
      chips: [
        { id: 'c1', word: '坐高铁' },
        { id: 'c2', word: '比坐飞机' },
        { id: 'c3', word: '方便' },
        { id: 'c4', word: '得多' },
        { id: 'c5', word: '。' }
      ]
    },
    voice: {
      prompt: '大声朗读课文核心句并录音：',
      text: '从北京到天津，坐高铁比开车快多了。',
      pinyin: 'Cóng Běijīng dào Tiānjīn, zuò gāotiě bǐ kāichē kuài duō le.',
      meaning: 'Từ Bắc Kinh đến Thiên Tân, đi tàu cao tốc nhanh hơn lái ô tô nhiều.'
    },
    writing: {
      prompt: '练习书写生字：便 (biàn - 9 nét, bộ Nhân đứng 亻)',
      char: '便',
      pinyin: 'biàn / pián',
      strokes: 9,
      radicals: '亻 (Nhân đứng)',
      meaning: 'Tiện lợi, thuận tiện'
    }
  }
];

// For lessons 6-15, generate tailored questions based on lesson topic
const Q3_TOPICS_REMAINING = [
  { id: 'course-hsk3-q3-l06', titleZh: '我不仅想买裙子，还想买鞋', grammar: '不仅...还...', char: '鞋', pinyinChar: 'xié', meaningChar: 'Giày' },
  { id: 'course-hsk3-q3-l07', titleZh: '医生的话我比谁都清楚', grammar: '比谁都...', char: '医', pinyinChar: 'yī', meaningChar: 'Y học, bác sĩ' },
  { id: 'course-hsk3-q3-l08', titleZh: '明天你来得了吗？', grammar: '得/不能 (khả năng)', char: '假', pinyinChar: 'jià', meaningChar: 'Nghỉ phép' },
  { id: 'course-hsk3-q3-l09', titleZh: '我得把作业交给老师', grammar: 'Câu chữ 把 (Bả)', char: '把', pinyinChar: 'bǎ', meaningChar: 'Cầm, nắm (câu chữ bả)' },
  { id: 'course-hsk3-q3-l10', titleZh: '我已经把材料打印出来了', grammar: '把 + Bổ ngữ xu hướng kép', char: '印', pinyinChar: 'yìn', meaningChar: 'In ấn, con dấu' },
  { id: 'course-hsk3-q3-l11', titleZh: '怎么突然刮起风来了', grammar: 'Xu hướng ...起来', char: '突', pinyinChar: 'tū', meaningChar: 'Đột nhiên' },
  { id: 'course-hsk3-q3-l12', titleZh: '好书很容易被人借走', grammar: 'Câu bị động 被 (Bị / Được)', char: '被', pinyinChar: 'bèi', meaningChar: 'Bị, được' },
  { id: 'course-hsk3-q3-l13', titleZh: '我相信我们都能解决这个难题', grammar: '解决难题', char: '难', pinyinChar: 'nán', meaningChar: 'Khó khăn, nan đề' },
  { id: 'course-hsk3-q3-l14', titleZh: '大熊猫是中国的国宝', grammar: 'Giới thiệu danh thắng / quốc bảo', char: '猫', pinyinChar: 'māo', meaningChar: 'Con mèo, gấu trúc' },
  { id: 'course-hsk3-q3-l15', titleZh: '春节是最重要的节日', grammar: 'So sánh nhất 最...', char: '节', pinyinChar: 'jié', meaningChar: 'Tiết, ngày lễ' }
];

async function main() {
  await client.connect();

  // Insert specific 1-5
  for (const item of Q3_LESSON_DATA) {
    // Delete old if any
    await client.query('DELETE FROM homework_questions WHERE lesson_id = $1', [item.lessonId]);

    const q1 = {
      id: `q-${item.lessonId}-1`,
      lesson_id: item.lessonId,
      type: 'listening',
      prompt: item.listening.prompt,
      data_json: {
        audioText: item.listening.audioText,
        options: item.listening.options
      },
      sort_order: 1
    };

    const q2 = {
      id: `q-${item.lessonId}-2`,
      lesson_id: item.lessonId,
      type: 'pinyin',
      prompt: item.pinyin.prompt,
      data_json: {
        hanzi: item.pinyin.hanzi,
        meaning: item.pinyin.meaning,
        options: item.pinyin.options
      },
      sort_order: 2
    };

    const q3 = {
      id: `q-${item.lessonId}-3`,
      lesson_id: item.lessonId,
      type: 'word_order',
      prompt: item.word_order.prompt,
      data_json: {
        meaning: item.word_order.meaning,
        chips: item.word_order.chips
      },
      sort_order: 3
    };

    const q4 = {
      id: `q-${item.lessonId}-4`,
      lesson_id: item.lessonId,
      type: 'voice',
      prompt: item.voice.prompt,
      data_json: {
        text: item.voice.text,
        pinyin: item.voice.pinyin,
        meaning: item.voice.meaning
      },
      sort_order: 4
    };

    const q5 = {
      id: `q-${item.lessonId}-5`,
      lesson_id: item.lessonId,
      type: 'writing',
      prompt: item.writing.prompt,
      data_json: {
        char: item.writing.char,
        pinyin: item.writing.pinyin,
        strokes: item.writing.strokes,
        radicals: item.writing.radicals,
        meaning: item.writing.meaning
      },
      sort_order: 5
    };

    for (const q of [q1, q2, q3, q4, q5]) {
      await client.query(`
        INSERT INTO homework_questions (id, lesson_id, type, prompt, data_json, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [q.id, q.lesson_id, q.type, q.prompt, q.data_json, q.sort_order]);
    }
    console.log(`Seeded 5 questions for ${item.lessonId}`);
  }

  // Insert remaining 6-15
  for (const item of Q3_TOPICS_REMAINING) {
    await client.query('DELETE FROM homework_questions WHERE lesson_id = $1', [item.id]);

    const q1 = {
      id: `q-${item.id}-1`,
      lesson_id: item.id,
      type: 'listening',
      prompt: `听录音选择正确答案：关于“${item.titleZh}”`,
      data_json: {
        audioText: `老师：请大家翻到课文，我们今天学习第${item.id.split('-l')[1]}课：“${item.titleZh}”。`,
        options: [
          { id: 'A', hanzi: item.titleZh, meaning: 'Đúng theo chủ đề bài học', isCorrect: true },
          { id: 'B', hanzi: '明天不去上课', meaning: 'Ngày mai không đi học', isCorrect: false },
          { id: 'C', hanzi: '今天不用做作业', meaning: 'Hôm nay không cần làm bài', isCorrect: false }
        ]
      },
      sort_order: 1
    };

    const q2 = {
      id: `q-${item.id}-2`,
      lesson_id: item.id,
      type: 'pinyin',
      prompt: `选择重点生字“${item.char}”的正确注音与声调：`,
      data_json: {
        hanzi: item.char,
        meaning: item.meaningChar,
        options: [
          { id: 'A', text: item.pinyinChar, isCorrect: true },
          { id: 'B', text: item.pinyinChar.replace(/[āáǎà]/, 'a'), isCorrect: false }
        ]
      },
      sort_order: 2
    };

    const q3 = {
      id: `q-${item.id}-3`,
      lesson_id: item.id,
      type: 'word_order',
      prompt: `连词成句练习：${item.titleZh}`,
      data_json: {
        meaning: `Sắp xếp các cụm từ theo đúng ngữ pháp: ${item.grammar}`,
        chips: [
          { id: 'c1', word: item.titleZh.slice(0, 3) },
          { id: 'c2', word: item.titleZh.slice(3) },
          { id: 'c3', word: '。' }
        ]
      },
      sort_order: 3
    };

    const q4 = {
      id: `q-${item.id}-4`,
      lesson_id: item.id,
      type: 'voice',
      prompt: '大声朗读课文核心句并录音上传：',
      data_json: {
        text: item.titleZh + '。',
        pinyin: 'Luyện tập phát âm chuẩn câu trọng tâm của bài.',
        meaning: item.titleZh
      },
      sort_order: 4
    };

    const q5 = {
      id: `q-${item.id}-5`,
      lesson_id: item.id,
      type: 'writing',
      prompt: `练习书写本课核心生字：“${item.char}”`,
      data_json: {
        char: item.char,
        pinyin: item.pinyinChar,
        meaning: item.meaningChar
      },
      sort_order: 5
    };

    for (const q of [q1, q2, q3, q4, q5]) {
      await client.query(`
        INSERT INTO homework_questions (id, lesson_id, type, prompt, data_json, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [q.id, q.lesson_id, q.type, q.prompt, q.data_json, q.sort_order]);
    }
    console.log(`Seeded 5 questions for ${item.id}`);
  }

  const total = await client.query('SELECT count(*) FROM homework_questions');
  console.log('Final total homework_questions in DB:', total.rows[0].count);

  await client.end();
}

main().catch(console.error);

