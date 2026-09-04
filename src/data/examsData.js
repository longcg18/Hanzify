/**
 * Hanzify 汉字流 - Hierarchical HSK Exams Data Store
 * Cấu trúc phân cấp 4 tầng:
 * Đề Thi (Exam) ➔ Kỹ Năng (Skills: Nghe, Đọc, Viết) ➔ Phần (Parts: Phần 1, Phần 2...) ➔ Câu Hỏi (Questions: Đơn vị nhỏ nhất)
 */

export const INITIAL_EXAMS_DATA = [
  {
    id: 'exam-hsk2-01',
    title: 'Đề Thi Thử HSK 2 Toàn Diện - Đề Số 01',
    chineseTitle: 'HSK 2级 全真模拟考试 (卷一)',
    level: 'HSK 2',
    duration: 35, // phút
    passingScore: 120,
    maxScore: 200,
    tag: 'Đề tiêu chuẩn',
    description: 'Đầy đủ 2 kỹ năng Nghe hiểu (听力) và Đọc hiểu (阅读) theo đúng chuẩn Hanban. Phân chia rành mạch các phần thi và câu hỏi.',
    skills: [
      {
        id: 'skill-lis-hsk2',
        type: 'listening',
        name: 'Kỹ Năng Nghe Hiểu (听力)',
        chineseName: '听力部分',
        parts: [
          {
            id: 'part-lis-1',
            partNumber: 1,
            title: 'Phần nghe 1: Phán đoán Đúng / Sai',
            instructions: 'Lắng nghe từng câu thoại ngắn, đối chiếu với tình huống và chọn đáp án chính xác nhất.',
            questions: [
              {
                id: 'eq-1',
                questionNumber: 1,
                prompt: 'Lắng nghe câu thoại và chọn nội dung/tình huống đúng nhất.',
                audioText: '外面下大雨了，你别出去了。',
                readingText: '',
                pinyin: 'Wàimiàn xià dàyǔ le, nǐ bié chūqu le.',
                options: ['Trời đang nắng to', 'Trời đang mưa to', 'Trời có tuyết rơi', 'Trời nhiều gió'],
                correctAnswer: 'Trời đang mưa to',
                explanation: 'Từ khóa nghe được: "下大雨" (mưa to), câu nói khuyên đừng ra ngoài vì trời mưa to.'
              },
              {
                id: 'eq-2',
                questionNumber: 2,
                prompt: 'Lắng nghe cuộc đối thoại ngắn và xác định địa điểm.',
                audioText: '男：服务员，我想点菜。女：好的先生，请问您想吃什么？',
                readingText: '',
                pinyin: 'Nán: Fúwùyuán, wǒ xiǎng diǎncài. Nǚ: Hǎode xiānsheng, qǐngwèn nín xiǎng chī shénme?',
                options: ['Ở bệnh viện', 'Ở sân bay', 'Ở nhà hàng / Quán ăn', 'Ở rạp chiếu phim'],
                correctAnswer: 'Ở nhà hàng / Quán ăn',
                explanation: 'Từ khóa: "服务员" (phục vụ) và "点菜" (gọi món ăn) -> Địa điểm là nhà hàng/quán ăn.'
              }
            ]
          },
          {
            id: 'part-lis-2',
            partNumber: 2,
            title: 'Phần nghe 2: Hội thoại chọn thông tin',
            instructions: 'Lắng nghe đoạn hội thoại giữa 2 nhân vật và chọn phương án trả lời đúng.',
            questions: [
              {
                id: 'eq-3',
                questionNumber: 3,
                prompt: 'Lắng nghe thông tin về giờ giấc.',
                audioText: '现在是差一刻八点，电影八点开始。',
                readingText: '',
                pinyin: 'Xiànzài shì chà yí kè bā diǎn, diànyǐng bā diǎn kāishǐ.',
                options: ['7 giờ 45 phút', '8 giờ 15 phút', '8 giờ đúng', '7 giờ 30 phút'],
                correctAnswer: '7 giờ 45 phút',
                explanation: '"差一刻八点" = kém 15 phút 8 giờ = 7:45.'
              },
              {
                id: 'eq-4',
                questionNumber: 4,
                prompt: 'Lắng nghe sở thích của nhân vật.',
                audioText: '我最喜欢踢足球，我哥哥喜欢打篮球。',
                readingText: '',
                pinyin: 'Wǒ zuì xǐhuan tī zúqiú, wǒ gēge xǐhuan dǎ lánqiú.',
                options: ['Người nói thích đá bóng', 'Người nói thích bóng rổ', 'Anh trai thích đá bóng', 'Cả hai đều thích bơi'],
                correctAnswer: 'Người nói thích đá bóng',
                explanation: '"我最喜欢踢足球" -> Người nói thích nhất là môn bóng đá.'
              },
              {
                id: 'eq-5',
                questionNumber: 5,
                prompt: 'Lắng nghe phương tiện di chuyển nhanh nhất.',
                audioText: '去火车站坐出租车要半个小时，坐地铁只要十五分钟。',
                readingText: '',
                pinyin: 'Qù huǒchēzhàn zuò chūzūchē yào bàn gè xiǎoshí, zuò dìtiě zhǐ yào shíwǔ fēnzhōng.',
                options: ['Đi tàu hỏa', 'Đi taxi', 'Đi xe buýt', 'Đi tàu điện ngầm (nhanh nhất)'],
                correctAnswer: 'Đi tàu điện ngầm (nhanh nhất)',
                explanation: 'Đi taxi mất 30 phút, đi tàu điện ngầm ("坐地铁") chỉ mất 15 phút.'
              }
            ]
          }
        ]
      },
      {
        id: 'skill-read-hsk2',
        type: 'reading',
        name: 'Kỹ Năng Đọc Hiểu (阅读)',
        chineseName: '阅读部分',
        parts: [
          {
            id: 'part-read-1',
            partNumber: 1,
            title: 'Phần đọc 1: Đọc hiểu và phán đoán',
            instructions: 'Đọc kỹ câu văn tiếng Hán và xác định nội dung được đưa ra là Đúng hay Sai.',
            questions: [
              {
                id: 'eq-6',
                questionNumber: 6,
                prompt: 'Phán đoán Đúng / Sai dựa vào câu văn sau:',
                audioText: '',
                readingText: '医生说我生病了，需要多喝水，多休息，不能去上班。 -> Phán đoán: Người này hôm nay vẫn đi làm bình thường.',
                pinyin: 'Yīshēng shuō wǒ shēngbìng le...',
                options: ['对 (Đúng)', '错 (Sai)'],
                correctAnswer: '错 (Sai)',
                explanation: 'Câu văn ghi rõ "不能去上班" (không thể đi làm) nên phán đoán đi làm bình thường là Sai.'
              }
            ]
          },
          {
            id: 'part-read-2',
            partNumber: 2,
            title: 'Phần đọc 2: Đọc câu hỏi và chọn đáp án',
            instructions: 'Đọc câu văn hoặc đoạn văn ngắn, chọn phương án thích hợp điền vào chỗ trống hoặc trả lời câu hỏi.',
            questions: [
              {
                id: 'eq-7',
                questionNumber: 7,
                prompt: 'Đọc câu văn và trả lời câu hỏi:',
                audioText: '',
                readingText: '桌子上有一本书，两支笔和一个苹果。 -> Hỏi: Trên bàn có mấy cái bút?',
                pinyin: 'Zhuōzi shang yǒu yì běn shū, liǎng zhī bǐ...',
                options: ['一支 (1 cái)', '两支 (2 cái)', '三支 (3 cái)'],
                correctAnswer: '两支 (2 cái)',
                explanation: 'Lượng từ cho bút là "支" (zhī), câu ghi rõ "两支笔" = 2 cây bút.'
              },
              {
                id: 'eq-8',
                questionNumber: 8,
                prompt: 'Đọc lịch trình và chọn thời gian đúng:',
                audioText: '',
                readingText: '小张每天早上六点起床跑步，然后七点吃早饭，八点去公司。 -> Hỏi: Tiểu Trương mấy giờ ăn sáng?',
                pinyin: 'Xiǎo Zhāng měitiān zǎoshang liù diǎn...',
                options: ['6:00', '7:00', '8:00', '8:30'],
                correctAnswer: '7:00',
                explanation: 'Nội dung: "七点吃早饭" (7 giờ ăn sáng).'
              },
              {
                id: 'eq-9',
                questionNumber: 9,
                prompt: 'Chọn từ thích hợp điền vào chỗ trống:',
                audioText: '',
                readingText: '这个西瓜太____了，我们可以买那个便宜一点儿的。',
                pinyin: 'Zhège xīguā tài ____ le, wǒmen kěyǐ mǎi nàge piányi yìdiǎnr de.',
                options: ['贵 (Đắt)', '快 (Nhanh)', '高 (Cao)', '远 (Xa)'],
                correctAnswer: '贵 (Đắt)',
                explanation: 'Vế sau nói mua quả "rẻ hơn một chút" (便宜), nên vế trước phải là "đắt quá" (太贵了).'
              },
              {
                id: 'eq-10',
                questionNumber: 10,
                prompt: 'Đọc biển báo hoặc chỉ dẫn:',
                audioText: '',
                readingText: '请往前走，洗手间在左边第二间。 -> Hỏi: Nhà vệ sinh ở đâu?',
                pinyin: 'Qǐng wǎng qián zǒu, xǐshǒujiān zài zuǒbian dì-èr jiān.',
                options: ['Phía sau bên phải', 'Phía trước bên trái phòng thứ 2', 'Tầng trên', 'Bên ngoài tòa nhà'],
                correctAnswer: 'Phía trước bên trái phòng thứ 2',
                explanation: '"往前走" (đi về phía trước), "左边第二间" (phòng thứ 2 bên tay trái).'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'exam-hsk1-01',
    title: 'Đề Thi Thử HSK 1 Nền Tảng - Đề Số 01',
    chineseTitle: 'HSK 1级 基础全真模拟 (卷一)',
    level: 'HSK 1',
    duration: 30,
    passingScore: 120,
    maxScore: 200,
    tag: 'Khởi động',
    description: 'Dành cho học viên mới bắt đầu, kiểm tra vốn 150 từ vựng cốt lõi, khả năng nhận diện mặt chữ Hán và nghe hiểu các câu chào hỏi căn bản.',
    skills: [
      {
        id: 'skill-lis-hsk1',
        type: 'listening',
        name: 'Kỹ Năng Nghe Hiểu (听力)',
        chineseName: '听力部分',
        parts: [
          {
            id: 'part-lis-hsk1-1',
            partNumber: 1,
            title: 'Phần nghe 1: Chữ Hán & Từ vựng căn bản',
            instructions: 'Lắng nghe từ vựng và chọn hình ảnh hoặc nghĩa tiếng Việt tương ứng.',
            questions: [
              {
                id: 'eq-hsk1-1',
                questionNumber: 1,
                prompt: 'Lắng nghe từ vựng chào hỏi:',
                audioText: '你好！',
                readingText: '',
                pinyin: 'Nǐ hǎo!',
                options: ['Tạm biệt', 'Xin chào', 'Cảm ơn', 'Không có chi'],
                correctAnswer: 'Xin chào',
                explanation: '"你好" có nghĩa là Xin chào.'
              },
              {
                id: 'eq-hsk1-2',
                questionNumber: 2,
                prompt: 'Lắng nghe đại từ xưng hô:',
                audioText: '我们',
                readingText: '',
                pinyin: 'Wǒmen',
                options: ['Tôi', 'Bạn', 'Chúng tôi / Chúng ta', 'Bọn họ'],
                correctAnswer: 'Chúng tôi / Chúng ta',
                explanation: '"我们" là Chúng tôi, chúng ta.'
              }
            ]
          }
        ]
      },
      {
        id: 'skill-read-hsk1',
        type: 'reading',
        name: 'Kỹ Năng Đọc Hiểu (阅读)',
        chineseName: '阅读部分',
        parts: [
          {
            id: 'part-read-hsk1-1',
            partNumber: 1,
            title: 'Phần đọc 1: Đọc Pinyin & Chữ Hán',
            instructions: 'Chọn phiên âm hoặc nghĩa đúng của từ được cho.',
            questions: [
              {
                id: 'eq-hsk1-3',
                questionNumber: 3,
                prompt: 'Chọn nghĩa đúng của từ "谢谢":',
                audioText: '',
                readingText: '谢谢 (xièxie)',
                pinyin: 'xièxie',
                options: ['Xin lỗi', 'Cảm ơn', 'Tạm biệt', 'Không dám'],
                correctAnswer: 'Cảm ơn',
                explanation: '"谢谢" có nghĩa là Cảm ơn.'
              },
              {
                id: 'eq-hsk1-4',
                questionNumber: 4,
                prompt: 'Từ nào sau đây có nghĩa là "Nước uống"?',
                audioText: '',
                readingText: 'Nước uống trong tiếng Trung là gì?',
                pinyin: '',
                options: ['茶 (Trà)', '水 (Nước)', '米饭 (Cơm)', '苹果 (Táo)'],
                correctAnswer: '水 (Nước)',
                explanation: '"水" (shuǐ) có nghĩa là nước.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'exam-hsk3-full',
    title: 'Đề Thi Thử HSK 3 Chuẩn Quốc Tế (Đầy Đủ 3 Kỹ Năng)',
    chineseTitle: 'HSK 3级 全真模拟 (含书写部分)',
    level: 'HSK 3',
    duration: 90,
    passingScore: 180,
    maxScore: 300,
    tag: 'Đầy đủ 3 kỹ năng',
    description: 'Bao gồm trọn vẹn 3 kỹ năng: Nghe hiểu (100đ), Đọc hiểu (100đ) và Viết Hán tự (100đ). Tổng thang điểm 300, điểm đạt từ 180.',
    skills: [
      {
        id: 'skill-lis-hsk3',
        type: 'listening',
        name: 'Kỹ Năng Nghe Hiểu (听力)',
        chineseName: '听力部分',
        parts: [
          {
            id: 'part-lis-hsk3-1',
            partNumber: 1,
            title: 'Phần nghe 1: Đối thoại công việc & đời sống',
            instructions: 'Lắng nghe đoạn thoại và chọn đáp án phù hợp.',
            questions: [
              {
                id: 'eq-hsk3-1',
                questionNumber: 1,
                prompt: 'Lắng nghe lý do cuộc họp bị hoãn:',
                audioText: '王经理突然有急事去机场了，下午的两点会议改到明天上午。',
                readingText: '',
                pinyin: '',
                options: ['Cuộc họp chuyển sang 2h chiều', 'Cuộc họp chuyển sang sáng mai', 'Cuộc họp bị hủy hoàn toàn', 'Họp tại sân bay'],
                correctAnswer: 'Cuộc họp chuyển sang sáng mai',
                explanation: '"改到明天上午" = chuyển sang sáng mai.'
              }
            ]
          }
        ]
      },
      {
        id: 'skill-read-hsk3',
        type: 'reading',
        name: 'Kỹ Năng Đọc Hiểu (阅读)',
        chineseName: '阅读部分',
        parts: [
          {
            id: 'part-read-hsk3-1',
            partNumber: 1,
            title: 'Phần đọc 1: Đọc hiểu đoạn văn ngữ cảnh',
            instructions: 'Đọc đoạn văn và trả lời câu hỏi.',
            questions: [
              {
                id: 'eq-hsk3-2',
                questionNumber: 2,
                prompt: 'Đọc câu văn và chọn nhận định đúng:',
                audioText: '',
                readingText: '虽然今天工作很累，但是听到大家对项目的夸奖，我心里感到非常高兴。',
                pinyin: '',
                options: ['Người nói cảm thấy buồn vì quá mệt', 'Người nói rất vui vì dự án được khen ngợi', 'Người nói muốn từ chức', 'Dự án đã thất bại'],
                correctAnswer: 'Người nói rất vui vì dự án được khen ngợi',
                explanation: '"心里感到非常高兴" do dự án được khen.'
              }
            ]
          }
        ]
      },
      {
        id: 'skill-write-hsk3',
        type: 'writing',
        name: 'Kỹ Năng Viết (书写)',
        chineseName: '书写部分',
        parts: [
          {
            id: 'part-write-hsk3-1',
            partNumber: 1,
            title: 'Phần viết 1: Sắp xếp cụm từ thành câu hoàn chỉnh',
            instructions: 'Sắp xếp các từ được cung cấp theo đúng trật tự ngữ pháp tiếng Trung.',
            questions: [
              {
                id: 'eq-hsk3-3',
                questionNumber: 3,
                prompt: 'Sắp xếp các từ thành câu đúng: [昨天] / [他] / [买] / [了一辆新自行车]',
                audioText: '',
                readingText: 'Các cụm từ: 昨天 / 他 / 买 / 了一辆新自行车',
                pinyin: '',
                options: [
                  '他昨天买了一辆新自行车。',
                  '买了一辆新自行车他昨天。',
                  '昨天买了他一辆新自行车。',
                  '他了一辆新自行车买昨天。'
                ],
                correctAnswer: '他昨天买了一辆新自行车。',
                explanation: 'Trật tự Chủ ngữ (他) + Trạng từ thời gian (昨天) + Động từ (买) + Trợ từ (了) + Tân ngữ (一辆新自行车).'
              }
            ]
          }
        ]
      }
    ]
  }
];

/**
 * Lấy toàn bộ danh sách câu hỏi dạng phẳng (flatten) từ một đề thi
 * phục vụ cho ExamRoomView hiển thị liên tục theo số thứ tự 1, 2, 3...
 */
export function flattenExamQuestions(exam) {
  if (!exam || !exam.skills) return [];
  const questions = [];
  let currentNum = 1;

  exam.skills.forEach((skill) => {
    (skill.parts || []).forEach((part) => {
      (part.questions || []).forEach((q) => {
        questions.push({
          ...q,
          questionNumber: currentNum++,
          section: skill.type,
          sectionTitle: `${skill.name} · ${part.title}`,
          skillName: skill.name,
          partTitle: part.title,
          partInstructions: part.instructions
        });
      });
    });
  });

  return questions;
}

/**
 * Đếm tổng số câu hỏi trong một đề thi
 */
export function countExamTotalQuestions(exam) {
  if (!exam || !exam.skills) return 0;
  let total = 0;
  exam.skills.forEach((skill) => {
    (skill.parts || []).forEach((part) => {
      total += (part.questions || []).length;
    });
  });
  return total;
}
