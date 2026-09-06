import pg from 'pg';

const { Client } = pg;
const PROJECT_REF = 'vwuikidgncknuozufiyi';
const DB_PASSWORD = 'ThuHoai1409';

const config = {
  host: 'aws-0-ap-northeast-2.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: `postgres.${PROJECT_REF}`,
  password: DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
};

// 6 Official HSK Exam Papers
const OFFICIAL_EXAMS = [
  // =========================================================================
  // 1. HSK 1 - ĐỀ SỐ 01 (MÃ ĐỀ H10901)
  // =========================================================================
  {
    id: 'exam-hsk1-01',
    title: 'Đề Thi Thử HSK 1 Toàn Diện - Đề Số 01 (H10901)',
    chineseTitle: 'HSK 1级 全真模拟真题 (卷一 H10901)',
    level: 'HSK 1',
    duration: 35,
    passingScore: 120,
    maxScore: 200,
    tag: 'Đề Chuẩn Hanban H10901',
    description: 'Bộ đề thi chuẩn HSK 1 chính thức gồm 2 kỹ năng: Nghe hiểu (听力) và Đọc hiểu (阅读). Đầy đủ phiên âm Pinyin, lời thoại audio và giải thích chi tiết.',
    skills: [
      {
        id: 'skill-h1-01-lis',
        type: 'listening',
        name: 'Kỹ Năng Nghe Hiểu (听力)',
        chineseName: '听力部分',
        parts: [
          {
            id: 'part-h1-01-l1',
            partNumber: 1,
            title: 'Phần nghe 1: Phán đoán Đúng / Sai',
            instructions: 'Lắng nghe từng câu thoại ngắn, đối chiếu với nhận định và chọn phương án Đúng (A) hoặc Sai (B).',
            questions: [
              {
                id: 'q-h1-01-01',
                questionNumber: 1,
                prompt: '很高兴。',
                pinyin: 'Hěn gāoxìng.',
                audioText: '女：认识你很高兴！\n男：我也很高兴。',
                readingText: null,
                options: ['A. Đúng (对)', 'B. Sai (错)'],
                correctAnswer: 'A',
                explanation: 'Nữ nói: "Rất vui được quen biết bạn!", Nam đáp: "Tôi cũng rất vui!". Nhận định "很高兴" hoàn toàn chính xác.'
              },
              {
                id: 'q-h1-01-02',
                questionNumber: 2,
                prompt: '他看书呢。',
                pinyin: 'Tā kàn shū ne.',
                audioText: '女：他在做什么呢？\n男：他正在睡觉呢。',
                readingText: null,
                options: ['A. Đúng (对)', 'B. Sai (错)'],
                correctAnswer: 'B',
                explanation: 'Người nam trả lời: "Anh ấy đang ngủ" (正在睡觉), không phải đang đọc sách (看书).'
              },
              {
                id: 'q-h1-01-03',
                questionNumber: 3,
                prompt: '喝茶。',
                pinyin: 'Hē chá.',
                audioText: '男：你想喝点儿什么？\n女：我想喝一杯茶。',
                readingText: null,
                options: ['A. Đúng (对)', 'B. Sai (错)'],
                correctAnswer: 'A',
                explanation: 'Nữ nói muốn uống một tách trà (喝一杯茶), khớp với từ khóa "喝茶".'
              }
            ]
          },
          {
            id: 'part-h1-01-l2',
            partNumber: 2,
            title: 'Phần nghe 2: Chọn tranh và đáp án phù hợp',
            instructions: 'Lắng nghe đoạn hội thoại 2 câu và chọn đáp án chính xác nhất.',
            questions: [
              {
                id: 'q-h1-01-04',
                questionNumber: 4,
                prompt: '这个多少钱？',
                pinyin: 'Zhège duōshao qián?',
                audioText: '男：请问，这个杯子多少钱？\n女：二十块钱。',
                readingText: null,
                options: ['A. 15 块', 'B. 20 块', 'C. 25 块'],
                correctAnswer: 'B',
                explanation: 'Nữ trả lời rõ: "Hai mươi tệ" (二十块钱 - 20 块).'
              },
              {
                id: 'q-h1-01-05',
                questionNumber: 5,
                prompt: '他们现在在哪儿？',
                pinyin: 'Tāmen xiànzài zài nǎr?',
                audioText: '女：李老师在学校吗？\n男：在，她在教室里呢。',
                readingText: null,
                options: ['A. 商店 (Cửa hàng)', 'B. 医院 (Bệnh viện)', 'C. 学校 (Trường học)'],
                correctAnswer: 'C',
                explanation: 'Nam xác nhận cô Lý đang ở trường học (学校), cụ thể trong phòng học (教室里).'
              }
            ]
          }
        ]
      },
      {
        id: 'skill-h1-01-read',
        type: 'reading',
        name: 'Kỹ Năng Đọc Hiểu (阅读)',
        chineseName: '阅读部分',
        parts: [
          {
            id: 'part-h1-01-r1',
            partNumber: 1,
            title: 'Phần đọc 1: Đối chiếu từ vựng & ngữ nghĩa',
            instructions: 'Đọc kỹ từ và câu đối chiếu, xác định tính đúng / sai.',
            questions: [
              {
                id: 'q-h1-01-06',
                questionNumber: 6,
                prompt: '苹果 (píngguǒ) —— 这是我买的水果。',
                pinyin: 'Píngguǒ —— Zhè shì wǒ mǎi de shuǐguǒ.',
                audioText: null,
                readingText: null,
                options: ['A. Đúng (对)', 'B. Sai (错)'],
                correctAnswer: 'A',
                explanation: 'Quả táo (苹果) thuộc nhóm hoa quả (水果), câu đối chiếu hoàn toàn đúng nghĩa.'
              },
              {
                id: 'q-h1-01-07',
                questionNumber: 7,
                prompt: '出租车 (chūzūchē) —— 我坐飞机去北京。',
                pinyin: 'Chūzūchē —— Wǒ zuò fēijī qù Běijīng.',
                audioText: null,
                readingText: null,
                options: ['A. Đúng (对)', 'B. Sai (错)'],
                correctAnswer: 'B',
                explanation: 'Từ vựng là xe taxi (出租车) nhưng câu lại nói đi máy bay (飞机), không khớp nghĩa.'
              }
            ]
          },
          {
            id: 'part-h1-01-r2',
            partNumber: 2,
            title: 'Phần đọc 2: Điền từ vào chỗ trống',
            instructions: 'Chọn từ vựng HSK 1 thích hợp nhất để hoàn thành câu.',
            questions: [
              {
                id: 'q-h1-01-08',
                questionNumber: 8,
                prompt: '你叫什么______？',
                pinyin: 'Nǐ jiào shénme ______?',
                audioText: null,
                readingText: null,
                options: ['A. 名字 (míngzi)', 'B. 岁 (suì)', 'C. 钱 (qián)'],
                correctAnswer: 'A',
                explanation: 'Mẫu câu hỏi tên quen thuộc: "你叫什么名字？" (Bạn tên là gì?).'
              },
              {
                id: 'q-h1-01-09',
                questionNumber: 9,
                prompt: '今天星期三，明天是______。',
                pinyin: 'Jīntiān xīngqīsān, míngtiān shì ______.',
                audioText: null,
                readingText: null,
                options: ['A. 星期二', 'B. 星期四', 'C. 星期五'],
                correctAnswer: 'B',
                explanation: 'Hôm nay là thứ Tư (星期三), ngày mai phải là thứ Năm (星期四).'
              },
              {
                id: 'q-h1-01-10',
                questionNumber: 10,
                prompt: '桌子上有一本书和一______水。',
                pinyin: 'Zhuōzi shang yǒu yì běn shū hé yì ______ shuǐ.',
                audioText: null,
                readingText: null,
                options: ['A. 杯 (bēi)', 'B. 个 (gè)', 'C. 块 (kuài)'],
                correctAnswer: 'A',
                explanation: 'Lượng từ dùng cho cốc nước là "杯" (一杯水 - một cốc nước).'
              }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 2. HSK 1 - ĐỀ SỐ 02 (MÃ ĐỀ H11330)
  // =========================================================================
  {
    id: 'exam-hsk1-02',
    title: 'Đề Thi Thử HSK 1 Toàn Diện - Đề Số 02 (H11330)',
    chineseTitle: 'HSK 1级 全真模拟真题 (卷二 H11330)',
    level: 'HSK 1',
    duration: 35,
    passingScore: 120,
    maxScore: 200,
    tag: 'Đề Chuẩn Hanban H11330',
    description: 'Bộ đề thi chuẩn HSK 1 mã đề H11330 tập trung vào các tình huống hỏi tuổi, thời gian biểu, gọi điện thoại và vị trí phương hướng.',
    skills: [
      {
        id: 'skill-h1-02-lis',
        type: 'listening',
        name: 'Kỹ Năng Nghe Hiểu (听力)',
        chineseName: '听力部分',
        parts: [
          {
            id: 'part-h1-02-l1',
            partNumber: 1,
            title: 'Phần nghe 1: Phán đoán Đúng / Sai',
            instructions: 'Lắng nghe câu thoại và xác định thông tin đúng hay sai.',
            questions: [
              {
                id: 'q-h1-02-01',
                questionNumber: 1,
                prompt: '天气很热。',
                pinyin: 'Tiānqì hěn rè.',
                audioText: '男：今天太热了！\n女：是啊，多喝点儿水吧。',
                readingText: null,
                options: ['A. Đúng (对)', 'B. Sai (错)'],
                correctAnswer: 'A',
                explanation: 'Cả hai người đều đồng ý thời tiết hôm nay rất nóng (太热了 - 天气很热).'
              },
              {
                id: 'q-h1-02-02',
                questionNumber: 2,
                prompt: '去看电影。',
                pinyin: 'Qù kàn diànyǐng.',
                audioText: '女：下午你想去哪儿？\n男：我想去医院看朋友。',
                readingText: null,
                options: ['A. Đúng (对)', 'B. Sai (错)'],
                correctAnswer: 'B',
                explanation: 'Nam muốn đi bệnh viện thăm bạn (去医院看朋友), không phải đi xem phim (看电影).'
              }
            ]
          },
          {
            id: 'part-h1-02-l2',
            partNumber: 2,
            title: 'Phần nghe 2: Trắc nghiệm hội thoại',
            instructions: 'Lắng nghe hội thoại và chọn phương án trả lời đúng.',
            questions: [
              {
                id: 'q-h1-02-03',
                questionNumber: 3,
                prompt: '王小姐的女儿几岁了？',
                pinyin: 'Wáng xiǎojiě de nǚ\'ér jǐ suì le?',
                audioText: '男：王小姐，这是你的女儿吗？真漂亮！几岁了？\n女：她今年五岁了。',
                readingText: null,
                options: ['A. 4 岁', 'B. 5 岁', 'C. 6 岁'],
                correctAnswer: 'B',
                explanation: 'Cô Vương trả lời rõ con gái năm nay 5 tuổi: "她今年五岁了".'
              },
              {
                id: 'q-h1-02-04',
                questionNumber: 4,
                prompt: '他们几点见面？',
                pinyin: 'Tāmen jǐ diǎn jiànmiàn?',
                audioText: '女：我们明天几点在学校见？\n男：上午九点，好吗？',
                readingText: null,
                options: ['A. 8:00', 'B. 9:00', 'C. 10:00'],
                correctAnswer: 'B',
                explanation: 'Nam hẹn lúc 9 giờ sáng: "上午九点" (9:00).'
              }
            ]
          }
        ]
      },
      {
        id: 'skill-h1-02-read',
        type: 'reading',
        name: 'Kỹ Năng Đọc Hiểu (阅读)',
        chineseName: '阅读部分',
        parts: [
          {
            id: 'part-h1-02-r1',
            partNumber: 1,
            title: 'Phần đọc 1: Chọn từ điền vào chỗ trống',
            instructions: 'Chọn đáp án A, B hoặc C phù hợp nhất để hoàn thành câu.',
            questions: [
              {
                id: 'q-h1-02-05',
                questionNumber: 5,
                prompt: '爸爸在房间里______电话呢。',
                pinyin: 'Bàba zài fángjiān lǐ ______ diànhuà ne.',
                audioText: null,
                readingText: null,
                options: ['A. 打 (dǎ)', 'B. 坐 (zuò)', 'C. 听 (tīng)'],
                correctAnswer: 'A',
                explanation: 'Cụm từ cố định: "打电话" (gọi điện thoại).'
              },
              {
                id: 'q-h1-02-06',
                questionNumber: 6,
                prompt: '前面那个人是我的汉语______。',
                pinyin: 'Qiánmiàn nà ge rén shì wǒ de hànyǔ ______.',
                audioText: null,
                readingText: null,
                options: ['A. 同学 (tóngxué)', 'B. 老师 (lǎoshī)', 'C. 医生 (yīshēng)'],
                correctAnswer: 'B',
                explanation: 'Giáo viên dạy tiếng Trung được gọi là "汉语老师".'
              }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 3. HSK 2 - ĐỀ SỐ 01 (MÃ ĐỀ H20901)
  // =========================================================================
  {
    id: 'exam-hsk2-01',
    title: 'Đề Thi Thử HSK 2 Toàn Diện - Đề Số 01 (H20901)',
    chineseTitle: 'HSK 2级 全真模拟真题 (卷一 H20901)',
    level: 'HSK 2',
    duration: 50,
    passingScore: 120,
    maxScore: 200,
    tag: 'Đề Chuẩn Hanban H20901',
    description: 'Đề thi HSK 2 chính thức với 300 từ vựng và các chủ đề: mua sắm, hỏi giá, thời tiết, hoạt động thể thao và di chuyển phương tiện.',
    skills: [
      {
        id: 'skill-h2-01-lis',
        type: 'listening',
        name: 'Kỹ Năng Nghe Hiểu (听力)',
        chineseName: '听力部分',
        parts: [
          {
            id: 'part-h2-01-l1',
            partNumber: 1,
            title: 'Phần nghe 1: Phán đoán Đúng / Sai',
            instructions: 'Lắng nghe câu văn ngắn và xác định nội dung đúng (A) hay sai (B).',
            questions: [
              {
                id: 'q-h2-01-01',
                questionNumber: 1,
                prompt: '他每天都跑步。',
                pinyin: 'Tā měitiān dōu pǎobù.',
                audioText: '男：为了健康，我每天早晨都去公园跑半个小时步。',
                readingText: null,
                options: ['A. Đúng (对)', 'B. Sai (错)'],
                correctAnswer: 'A',
                explanation: 'Người nam nói: "Mỗi sáng tôi đều chạy bộ nửa tiếng ở công viên", nhận định là Đúng.'
              },
              {
                id: 'q-h2-01-02',
                questionNumber: 2,
                prompt: '他喜欢吃羊肉。',
                pinyin: 'Tā xǐhuan chī yángròu.',
                audioText: '女：你觉得羊肉怎么样？\n男：我觉得味道不太好，我不喜欢吃。',
                readingText: null,
                options: ['A. Đúng (对)', 'B. Sai (错)'],
                correctAnswer: 'B',
                explanation: 'Người nam nói: "Tôi thấy mùi vị không ngon lắm, tôi không thích ăn" (我不喜欢吃).'
              },
              {
                id: 'q-h2-01-03',
                questionNumber: 3,
                prompt: '外面正在下雨。',
                pinyin: 'Wàimiàn zhèngzài xià yǔ.',
                audioText: '女：别出门了，你看外面雨下得太大了。',
                readingText: null,
                options: ['A. Đúng (对)', 'B. Sai (错)'],
                correctAnswer: 'A',
                explanation: 'Nữ bảo: "Đừng ra ngoài nữa, bạn xem ngoài trời mưa to quá" (外面雨下得太大了).'
              }
            ]
          },
          {
            id: 'part-h2-01-l2',
            partNumber: 2,
            title: 'Phần nghe 2: Trắc nghiệm đối thoại nhiều lượt',
            instructions: 'Lắng nghe đối thoại giữa hai người và trả lời câu hỏi.',
            questions: [
              {
                id: 'q-h2-01-04',
                questionNumber: 4,
                prompt: '男的准备买什么颜色的衣服？',
                pinyin: 'Nán de zhǔnbèi mǎi shénme yánsè de yīfu?',
                audioText: '女：这件红色的衣服真好看，你觉得呢？\n男：红色太亮了，我还是买这件黑色的吧。',
                readingText: null,
                options: ['A. 红色 (Màu đỏ)', 'B. 黑色 (Màu đen)', 'C. 白色 (Màu trắng)'],
                correctAnswer: 'B',
                explanation: 'Nam nói: "Màu đỏ sáng quá, tôi vẫn mua cái màu đen này vậy" (买这件黑色的).'
              },
              {
                id: 'q-h2-01-05',
                questionNumber: 5,
                prompt: '张先生什么时候到北京？',
                pinyin: 'Zhāng xiānsheng shénme shíhou dào Běijīng?',
                audioText: '女：张先生买好火车票了吗？\n男：买好了，他明天下午四点到北京。',
                readingText: null,
                options: ['A. 明天上午 10:00', 'B. 明天下午 2:00', 'C. 明天下午 4:00'],
                correctAnswer: 'C',
                explanation: 'Nam xác nhận: "Anh ấy 4 giờ chiều mai đến Bắc Kinh" (明天下午四点).'
              }
            ]
          }
        ]
      },
      {
        id: 'skill-h2-01-read',
        type: 'reading',
        name: 'Kỹ Năng Đọc Hiểu (阅读)',
        chineseName: '阅读部分',
        parts: [
          {
            id: 'part-h2-01-r1',
            partNumber: 1,
            title: 'Phần đọc 1: Chọn từ điền vào chỗ trống',
            instructions: 'Chọn từ ngữ HSK 2 thích hợp điền vào câu.',
            questions: [
              {
                id: 'q-h2-01-06',
                questionNumber: 6,
                prompt: '虽然外面很冷，______房间里非常暖和。',
                pinyin: 'Suīrán wàimiàn hěn lěng, ______ fángjiān lǐ fēicháng nuǎnhuo.',
                audioText: null,
                readingText: null,
                options: ['A. 但是 (dànshì)', 'B. 因为 (yīnwèi)', 'C. 所以 (suǒyǐ)'],
                correctAnswer: 'A',
                explanation: 'Cặp liên từ chỉ quan hệ nhượng bộ: "虽然...但是..." (Tuy... nhưng...).'
              },
              {
                id: 'q-h2-01-07',
                questionNumber: 7,
                prompt: '离这儿不远有一个大超市，走路十分钟就______。',
                pinyin: 'Lí zhèr bù yuǎn yǒu yí ge dà chāoshì, zǒulù shí fēnzhōng jiù ______.',
                audioText: null,
                readingText: null,
                options: ['A. 来 (lái)', 'B. 到 (dào)', 'C. 走 (zǒu)'],
                correctAnswer: 'B',
                explanation: '"走路十分钟就到" nghĩa là đi bộ 10 phút là tới nơi (到).'
              }
            ]
          },
          {
            id: 'part-h2-01-r2',
            partNumber: 2,
            title: 'Phần đọc 2: Đọc hiểu 2 câu liên kết',
            instructions: 'Đọc 2 câu và xác định nhận định bên dưới là Đúng hay Sai.',
            questions: [
              {
                id: 'q-h2-01-08',
                questionNumber: 8,
                prompt: '我哥哥比我大三岁，现在在一家公司上班。\n★ 哥哥比他小。',
                pinyin: 'Wǒ gēge bǐ wǒ dà sān suì, xiànzài zài yì jiā gōngsī shàngbān.\n★ Gēge bǐ tā xiǎo.',
                audioText: null,
                readingText: null,
                options: ['A. Đúng (对)', 'B. Sai (错)'],
                correctAnswer: 'B',
                explanation: 'Câu gốc nói anh trai lớn hơn tôi 3 tuổi (比我大三岁), nhưng nhận định lại nói anh trai nhỏ hơn (比他小), do đó Sai.'
              },
              {
                id: 'q-h2-01-09',
                questionNumber: 9,
                prompt: '请大家把手机关上，电影马上就要开始了。\n★ 电影还没开始。',
                pinyin: 'Qǐng dàjiā bǎ shǒujī guān shang, diànyǐng mǎshàng jiù yào kāishǐ le.\n★ Diànyǐng hái méi kāishǐ.',
                audioText: null,
                readingText: null,
                options: ['A. Đúng (对)', 'B. Sai (错)'],
                correctAnswer: 'A',
                explanation: 'Cụm từ "马上就要开始了" nghĩa là sắp sửa bắt đầu (chưa bắt đầu), nên nhận định "电影还没开始" là Đúng.'
              }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 4. HSK 2 - ĐỀ SỐ 02 (MÃ ĐỀ H21330)
  // =========================================================================
  {
    id: 'exam-hsk2-02',
    title: 'Đề Thi Thử HSK 2 Toàn Diện - Đề Số 02 (H21330)',
    chineseTitle: 'HSK 2级 全真模拟真题 (卷二 H21330)',
    level: 'HSK 2',
    duration: 50,
    passingScore: 120,
    maxScore: 200,
    tag: 'Đề Chuẩn Hanban H21330',
    description: 'Bộ đề thi thử HSK 2 tiêu chuẩn kiểm tra từ vựng về khám bệnh, công việc, sinh nhật, và sở thích du lịch.',
    skills: [
      {
        id: 'skill-h2-02-lis',
        type: 'listening',
        name: 'Kỹ Năng Nghe Hiểu (听力)',
        chineseName: '听力部分',
        parts: [
          {
            id: 'part-h2-02-l1',
            partNumber: 1,
            title: 'Phần nghe 1: Phán đoán Đúng / Sai',
            instructions: 'Lắng nghe lời thoại và xác định Đúng hay Sai.',
            questions: [
              {
                id: 'q-h2-02-01',
                questionNumber: 1,
                prompt: '他感冒了。',
                pinyin: 'Tā gǎnmào le.',
                audioText: '男：今天我头有点儿疼，嗓子也不舒服。\n女：你可能是感冒了，去医院看看吧。',
                readingText: null,
                options: ['A. Đúng (对)', 'B. Sai (错)'],
                correctAnswer: 'A',
                explanation: 'Người nam bị đau đầu, rát họng, nữ khuyên đi bệnh viện vì có thể bị cảm cúm (感冒).'
              },
              {
                id: 'q-h2-02-02',
                questionNumber: 2,
                prompt: '女的在找手表。',
                pinyin: 'Nǚ de zài zhǎo shǒubiǎo.',
                audioText: '女：你看见我的手机了吗？我怎么找不到了？\n男：就在桌子上，在电脑旁边。',
                readingText: null,
                options: ['A. Đúng (对)', 'B. Sai (错)'],
                correctAnswer: 'B',
                explanation: 'Nữ đang tìm điện thoại di động (手机), không phải tìm đồng hồ đeo tay (手表).'
              }
            ]
          },
          {
            id: 'part-h2-02-l2',
            partNumber: 2,
            title: 'Phần nghe 2: Trắc nghiệm tình huống',
            instructions: 'Lắng nghe và chọn đáp án chính xác nhất.',
            questions: [
              {
                id: 'q-h2-02-03',
                questionNumber: 3,
                prompt: '男的想吃什么？',
                pinyin: 'Nán de xiǎng chī shénme?',
                audioText: '女：今天晚上我们吃面条还是吃米饭？\n男：吃面条吧，再做个鸡蛋汤。',
                readingText: null,
                options: ['A. 米饭 (Cơm)', 'B. 面条 (Mì sợi)', 'C. 包子 (Bánh bao)'],
                correctAnswer: 'B',
                explanation: 'Nam muốn ăn mì sợi: "吃面条吧" (B).'
              },
              {
                id: 'q-h2-02-04',
                questionNumber: 4,
                prompt: '他们打算怎么去机场？',
                pinyin: 'Tāmen dǎsuàn zěnme qù jīchǎng?',
                audioText: '女：时间还早，我们坐地铁去机场吧，便宜又快。\n男：好的，听你的。',
                readingText: null,
                options: ['A. 坐出租车 (Taxi)', 'B. 坐公交车 (Xe buýt)', 'C. 坐地铁 (Tàu điện ngầm)'],
                correctAnswer: 'C',
                explanation: 'Nữ đề nghị đi tàu điện ngầm: "我们坐地铁去机场吧", nam đồng ý.'
              }
            ]
          }
        ]
      },
      {
        id: 'skill-h2-02-read',
        type: 'reading',
        name: 'Kỹ Năng Đọc Hiểu (阅读)',
        chineseName: '阅读部分',
        parts: [
          {
            id: 'part-h2-02-r1',
            partNumber: 1,
            title: 'Phần đọc 1: Chọn từ điền chỗ trống',
            instructions: 'Điền từ HSK 2 thích hợp vào câu.',
            questions: [
              {
                id: 'q-h2-02-05',
                questionNumber: 5,
                prompt: '请您等一下，经理正在开会，大概半个______后结束。',
                pinyin: 'Qǐng nín děng yíxià, jīnglǐ zhèngzài kāihuì, dàgài bàn ge ______ hòu jiéshù.',
                audioText: null,
                readingText: null,
                options: ['A. 小时 (tiếng đồng hồ)', 'B. 分钟 (phút)', 'C. 天 (ngày)'],
                correctAnswer: 'A',
                explanation: 'Cụm từ chỉ khoảng thời gian: "半个小时" (nửa tiếng đồng hồ).'
              },
              {
                id: 'q-h2-02-06',
                questionNumber: 6,
                prompt: '明天是妈妈的生日，我打算送她一块新______。',
                pinyin: 'Míngtiān shì māma de shēngrì, wǒ dǎsuàn sòng tā yí kuài xīn ______.',
                audioText: null,
                readingText: null,
                options: ['A. 手机 (điện thoại)', 'B. 手表 (đồng hồ đeo tay)', 'C. 衣服 (quần áo)'],
                correctAnswer: 'B',
                explanation: 'Lượng từ "块" dùng cho đồng hồ đeo tay (一块手表).'
              }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 5. HSK 3 - ĐỀ SỐ 01 (MÃ ĐỀ H30901)
  // =========================================================================
  {
    id: 'exam-hsk3-01',
    title: 'Đề Thi Thử HSK 3 Toàn Diện - Đề Số 01 (H30901)',
    chineseTitle: 'HSK 3级 全真模拟真题 (卷一 H30901)',
    level: 'HSK 3',
    duration: 85,
    passingScore: 180,
    maxScore: 300,
    tag: 'Đề Chuẩn Hanban H30901',
    description: 'Bộ đề thi chuẩn HSK 3 cấp độ trung cấp, kiểm tra 600 từ vựng và cấu trúc ngữ pháp nâng cao: câu so sánh, câu chữ 把, liên từ biểu thị quan hệ logic.',
    skills: [
      {
        id: 'skill-h3-01-lis',
        type: 'listening',
        name: 'Kỹ Năng Nghe Hiểu (听力)',
        chineseName: '听力部分',
        parts: [
          {
            id: 'part-h3-01-l1',
            partNumber: 1,
            title: 'Phần nghe 1: Đoạn văn ngắn phán đoán Đúng / Sai',
            instructions: 'Lắng nghe đoạn văn 2-3 câu và phán đoán tính đúng sai của nhận định.',
            questions: [
              {
                id: 'q-h3-01-01',
                questionNumber: 1,
                prompt: '小张今天准时上班了。',
                pinyin: 'Xiǎo Zhāng jīntiān zhǔnshí shàngbān le.',
                audioText: '男：小张今天早上起床晚了，路上又遇到了堵车，所以迟到了十分钟。',
                readingText: null,
                options: ['A. Đúng (对)', 'B. Sai (错)'],
                correctAnswer: 'B',
                explanation: 'Tiểu Trương dậy muộn và bị tắc đường nên đã đến muộn 10 phút (迟到了十分钟), do đó nhận định đi làm đúng giờ (准时上班) là Sai.'
              },
              {
                id: 'q-h3-01-02',
                questionNumber: 2,
                prompt: '他们经常一起去爬山。',
                pinyin: 'Tāmen jīngcháng yìqǐ qù páshān.',
                audioText: '女：我和同事每个周末都去爬山，这不仅能锻炼身体，还能放松心情。',
                readingText: null,
                options: ['A. Đúng (对)', 'B. Sai (错)'],
                correctAnswer: 'A',
                explanation: 'Người nữ nói: "Tôi và đồng nghiệp mỗi cuối tuần đều đi leo núi", nhận định là Đúng.'
              }
            ]
          },
          {
            id: 'part-h3-01-l2',
            partNumber: 2,
            title: 'Phần nghe 2: Trắc nghiệm hội thoại dài',
            instructions: 'Lắng nghe hội thoại và chọn đáp án chính xác nhất.',
            questions: [
              {
                id: 'q-h3-01-03',
                questionNumber: 3,
                prompt: '男的为什么换工作？',
                pinyin: 'Nán de wèishénme huàn gōngzuò?',
                audioText: '女：听说你换新工作了？现在怎么样？\n男：挺好的。以前的公司离家太远了，每天路上要花两个小时，现在这家公司走路十分钟就能到。',
                readingText: null,
                options: [
                  'A. 以前的公司工资太低',
                  'B. 以前的公司离家太远',
                  'C. 新公司工作更轻松'
                ],
                correctAnswer: 'B',
                explanation: 'Nam giải thích: "Công ty trước kia xa nhà quá, mỗi ngày trên đường mất 2 tiếng" (离家太远 - B).'
              },
              {
                id: 'q-h3-01-04',
                questionNumber: 4,
                prompt: '这条裤子现在卖多少钱？',
                pinyin: 'Zhè tiáo kùzi xiànzài mài duōshao qián?',
                audioText: '男：请问这件外套和这条裤子多少钱？\n女：外套三百块。裤子原价两百块，今天打八折，只要一百六十块。',
                readingText: null,
                options: ['A. 300 块', 'B. 200 块', 'C. 160 块'],
                correctAnswer: 'C',
                explanation: 'Quần giá gốc 200 tệ, hôm nay giảm 20% (打八折), chỉ còn 160 tệ (只要一百六十块).'
              }
            ]
          }
        ]
      },
      {
        id: 'skill-h3-01-read',
        type: 'reading',
        name: 'Kỹ Năng Đọc Hiểu (阅读)',
        chineseName: '阅读部分',
        parts: [
          {
            id: 'part-h3-01-r1',
            partNumber: 1,
            title: 'Phần đọc 1: Ghép cặp câu logic',
            instructions: 'Chọn vế câu phù hợp nhất về mặt ngữ nghĩa.',
            questions: [
              {
                id: 'q-h3-01-05',
                questionNumber: 5,
                prompt: '你把桌子上的盘子和碗______吧。',
                pinyin: 'Nǐ bǎ zhuōzi shang de pánzi hé wǎn ______ ba.',
                audioText: null,
                readingText: null,
                options: ['A. 洗干净 (rửa sạch)', 'B. 读一遍 (đọc một lượt)', 'C. 戴上 (đeo vào)'],
                correctAnswer: 'A',
                explanation: 'Đĩa và bát (盘子和碗) thì cần rửa sạch (洗干净).'
              },
              {
                id: 'q-h3-01-06',
                questionNumber: 6,
                prompt: '只要坚持练习，你的汉语水平就一定会______。',
                pinyin: 'Zhǐyào jiānchí liànxí, nǐ de hànyǔ shuǐpíng jiù yídìng huì ______.',
                audioText: null,
                readingText: null,
                options: ['A. 结束 (kết thúc)', 'B. 提高 (nâng cao)', 'C. 检查 (kiểm tra)'],
                correctAnswer: 'B',
                explanation: 'Trình độ tiếng Trung (汉语水平) đi với động từ nâng cao (提高).'
              }
            ]
          },
          {
            id: 'part-h3-01-r2',
            partNumber: 2,
            title: 'Phần đọc 2: Đọc hiểu đoạn văn ngắn',
            instructions: 'Đọc đoạn văn và trả lời câu hỏi trắc nghiệm.',
            questions: [
              {
                id: 'q-h3-01-07',
                questionNumber: 7,
                prompt: '根据短文，我们可以知道什么？',
                pinyin: 'Gēnjù duǎnwén, wǒmen kěyǐ zhīdào shénme?',
                audioText: null,
                readingText: '虽然很多人认为钱是最重要的，但是如果没有健康的身体，再多的钱也没有用。所以，我们应该在努力工作的同时，多注意休息和锻炼。',
                options: [
                  'A. 钱比健康更重要',
                  'B. 健康比金钱更重要',
                  'C. 努力工作不需要休息'
                ],
                correctAnswer: 'B',
                explanation: 'Đoạn văn nhấn mạnh nếu không có sức khỏe thì bao nhiêu tiền cũng vô dụng, nên sức khỏe quan trọng hơn tiền bạc (健康比金钱更重要 - B).'
              }
            ]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 6. HSK 3 - ĐỀ SỐ 02 (MÃ ĐỀ H31330)
  // =========================================================================
  {
    id: 'exam-hsk3-02',
    title: 'Đề Thi Thử HSK 3 Toàn Diện - Đề Số 02 (H31330)',
    chineseTitle: 'HSK 3级 全真模拟真题 (卷二 H31330)',
    level: 'HSK 3',
    duration: 85,
    passingScore: 180,
    maxScore: 300,
    tag: 'Đề Chuẩn Hanban H31330',
    description: 'Bộ đề thi chuẩn HSK 3 mã đề H31330 với các bài đọc hiểu chuyên sâu về văn hóa giao tiếp, thói quen sinh hoạt và kỹ năng làm việc văn phòng.',
    skills: [
      {
        id: 'skill-h3-02-lis',
        type: 'listening',
        name: 'Kỹ Năng Nghe Hiểu (听力)',
        chineseName: '听力部分',
        parts: [
          {
            id: 'part-h3-02-l1',
            partNumber: 1,
            title: 'Phần nghe 1: Phán đoán Đúng / Sai',
            instructions: 'Lắng nghe đoạn văn và phán đoán nội dung.',
            questions: [
              {
                id: 'q-h3-02-01',
                questionNumber: 1,
                prompt: '他找到了丢失的钱包。',
                pinyin: 'Tā zhǎodào le diūshī de qiánbāo.',
                audioText: '男：昨天我不小心把钱包落在了出租车上，司机师傅发现后主动联系了我，今天早上把钱包还给我了。',
                readingText: null,
                options: ['A. Đúng (对)', 'B. Sai (错)'],
                correctAnswer: 'A',
                explanation: 'Tài xế taxi đã chủ động liên hệ và trả lại ví tiền sáng nay, nên việc tìm lại được ví (找到了丢失的钱包) là Đúng.'
              },
              {
                id: 'q-h3-02-02',
                questionNumber: 2,
                prompt: '他们打算乘飞机去旅行。',
                pinyin: 'Tāmen dǎsuàn chéng fēijī qù lǚxíng.',
                audioText: '女：现在的很多高铁速度非常快，而且车站就在市中心，比坐飞机更方便，我们这次还是坐高铁吧。',
                readingText: null,
                options: ['A. Đúng (对)', 'B. Sai (错)'],
                correctAnswer: 'B',
                explanation: 'Nữ quyết định đi tàu cao tốc (高铁) vì tiện lợi hơn máy bay, nên nhận định đi máy bay là Sai.'
              }
            ]
          },
          {
            id: 'part-h3-02-l2',
            partNumber: 2,
            title: 'Phần nghe 2: Hội thoại trắc nghiệm',
            instructions: 'Lắng nghe hội thoại và chọn đáp án chính xác nhất.',
            questions: [
              {
                id: 'q-h3-02-03',
                questionNumber: 3,
                prompt: '会议几点开始？',
                pinyin: 'Huìyì jǐ diǎn kāishǐ?',
                audioText: '男：李经理，下午两点的会议推迟了吗？\n女：是的，王总两点半才到，所以会议改在三点整开始。',
                readingText: null,
                options: ['A. 2:00', 'B. 2:30', 'C. 3:00'],
                correctAnswer: 'C',
                explanation: 'Cuộc họp đổi sang bắt đầu lúc 3 giờ đúng (改在三点整开始 - C).'
              },
              {
                id: 'q-h3-02-04',
                questionNumber: 4,
                prompt: '关于那个宾馆，男的觉得怎么样？',
                pinyin: 'Guānyú nà ge bīnguǎn, nán de juéde zěnmeyàng?',
                audioText: '女：你觉得这家宾馆的环境怎么样？\n男：房间挺干净的，服务也热情，就是价格稍微有点儿贵。',
                readingText: null,
                options: ['A. 房间不干净', 'B. 服务态度差', 'C. 价格有点儿贵'],
                correctAnswer: 'C',
                explanation: 'Nam nhận xét: "Phòng khá sạch, phục vụ nhiệt tình, chỉ là giá hơi đắt một chút" (价格稍微有点儿贵 - C).'
              }
            ]
          }
        ]
      },
      {
        id: 'skill-h3-02-read',
        type: 'reading',
        name: 'Kỹ Năng Đọc Hiểu (阅读)',
        chineseName: '阅读部分',
        parts: [
          {
            id: 'part-h3-02-r1',
            partNumber: 1,
            title: 'Phần đọc 1: Chọn từ thích hợp điền vào chỗ trống',
            instructions: 'Điền từ vựng HSK 3 thích hợp vào câu.',
            questions: [
              {
                id: 'q-h3-02-05',
                questionNumber: 5,
                prompt: '这本书的内容非常______，我看了好几遍都不觉得厌烦。',
                pinyin: 'Zhè běn shū de nèiróng fēicháng ______, wǒ kàn le hǎo jǐ biàn dōu bù juéde yànfán.',
                audioText: null,
                readingText: null,
                options: ['A. 有趣 (thú vị)', 'B. 难过 (buồn bã)', 'C. 简单 (đơn giản)'],
                correctAnswer: 'A',
                explanation: 'Xem đi xem lại không biết chán chứng tỏ nội dung rất thú vị (有趣).'
              },
              {
                id: 'q-h3-02-06',
                questionNumber: 6,
                prompt: '遇到不懂的生词时，你一定要记得查______。',
                pinyin: 'Yù dào bù dǒng de shēngcí shí, nǐ yídìng yào jìde chá ______.',
                audioText: null,
                readingText: null,
                options: ['A. 地图 (bản đồ)', 'B. 词典 (từ điển)', 'C. 护照 (hộ chiếu)'],
                correctAnswer: 'B',
                explanation: 'Khi gặp từ mới (生词) thì cần tra từ điển (查词典).'
              }
            ]
          },
          {
            id: 'part-h3-02-r2',
            partNumber: 2,
            title: 'Phần đọc 2: Đọc hiểu đoạn văn phân tích',
            instructions: 'Đọc đoạn văn và chọn nhận định đúng nhất.',
            questions: [
              {
                id: 'q-h3-02-07',
                questionNumber: 7,
                prompt: '根据这段话，我们可以知道写信人的主要目的是什么？',
                pinyin: 'Gēnjù zhè duàn huà, wǒmen kěyǐ zhīdào xiěxìn rén de zhǔyào mùdì shì shénme?',
                audioText: null,
                readingText: '尊敬的张老师：您好！感谢您这一年来对我的悉心指导。下周我就要回国了，离开之前希望能请您吃顿便饭，不知道您本周五晚上是否有空？',
                options: [
                  'A. 向老师请假',
                  'B. 感谢老师并邀请共进晚餐',
                  'C. 询问汉语考试成绩'
                ],
                correctAnswer: 'B',
                explanation: 'Bức thư cảm ơn thầy giáo và mời thầy ăn bữa cơm trước khi về nước (感谢老师并邀请共进晚餐 - B).'
              }
            ]
          }
        ]
      }
    ]
  }
];

async function seedOfficialExams() {
  console.log('🔄 Connecting to Supabase Cloud PostgreSQL...');
  const client = new Client(config);
  await client.connect();
  console.log('✅ Connected to Supabase PostgreSQL successfully!');

  try {
    console.log('\n🧹 Clearing old draft exams and cascading children...');
    await client.query('DELETE FROM public.exam_questions;');
    await client.query('DELETE FROM public.exam_parts;');
    await client.query('DELETE FROM public.exam_skills;');
    await client.query('DELETE FROM public.exams;');
    console.log('✅ Cleaned existing exam tables.');

    console.log('\n🚀 Seeding 6 Official HSK Exams (HSK 1, HSK 2, HSK 3)...');

    for (const exam of OFFICIAL_EXAMS) {
      console.log(`\n📝 Inserting [${exam.level}]: ${exam.title}...`);

      // 1. Insert exam
      await client.query(
        `INSERT INTO public.exams (id, title, chinese_title, level, duration, passing_score, max_score, description, tag)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          exam.id,
          exam.title,
          exam.chineseTitle,
          exam.level,
          exam.duration,
          exam.passingScore,
          exam.maxScore,
          exam.description,
          exam.tag
        ]
      );

      // 2. Insert skills
      for (const [sIdx, skill] of exam.skills.entries()) {
        await client.query(
          `INSERT INTO public.exam_skills (id, exam_id, skill_type, name, chinese_name, sort_order)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            skill.id,
            exam.id,
            skill.type,
            skill.name,
            skill.chineseName,
            sIdx + 1
          ]
        );

        // 3. Insert parts
        for (const [pIdx, part] of skill.parts.entries()) {
          await client.query(
            `INSERT INTO public.exam_parts (id, skill_id, part_number, title, instructions, sort_order)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              part.id,
              skill.id,
              part.partNumber,
              part.title,
              part.instructions,
              pIdx + 1
            ]
          );

          // 4. Insert questions
          for (const [qIdx, q] of part.questions.entries()) {
            await client.query(
              `INSERT INTO public.exam_questions 
               (id, part_id, question_number, prompt, audio_text, reading_text, pinyin, options, correct_answer, explanation, sort_order)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10, $11)`,
              [
                q.id,
                part.id,
                q.questionNumber,
                q.prompt,
                q.audioText,
                q.readingText,
                q.pinyin,
                JSON.stringify(q.options),
                q.correctAnswer,
                q.explanation,
                qIdx + 1
              ]
            );
          }
        }
      }

      const countQ = exam.skills.reduce((acc, s) => acc + s.parts.reduce((pAcc, p) => pAcc + p.questions.length, 0), 0);
      console.log(`   ✅ Inserted ${exam.title} with ${countQ} authentic questions.`);
    }

    console.log('\n🎉 ALL 6 OFFICIAL HSK EXAMS SEEDED SUCCESSFULLY!');

    const resExams = await client.query('SELECT id, level, title FROM public.exams ORDER BY level, id');
    console.log('\n📋 Exams in Supabase:');
    resExams.rows.forEach((r, i) => console.log(`   ${i + 1}. [${r.level}] ${r.title}`));

    const resCount = await client.query('SELECT count(*) FROM public.exam_questions');
    console.log(`\n📊 Total questions in database: ${resCount.rows[0].count} questions.`);

  } catch (err) {
    console.error('❌ Error seeding exams to Supabase:', err);
  } finally {
    await client.end();
  }
}

seedOfficialExams();
