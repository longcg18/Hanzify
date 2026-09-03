/**
 * Hanzify 汉字流 - Courses & Curriculum Data Store
 */

export const COURSES_DATA = [
  {
    id: 'hsk2',
    title: 'HSK 2 Toàn Diện: Đời Sống & Mua Sắm',
    chineseTitle: '生活与购物',
    level: 'HSK 2',
    badge: 'Đang theo học',
    teacher: 'Cô Linh Lão Sư (灵老师)',
    coverGradient: 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 100%)',
    charWatermark: '买',
    description: 'Nắm vững 300 từ vựng và 45 mẫu câu đời sống: hỏi giá, số đếm, phương hướng và sinh hoạt hằng ngày.',
    totalLessons: 12,
    completedLessons: 3,
    lessons: [
      {
        id: 'lesson-1',
        number: '01',
        title: 'Chào hỏi & Làm quen (问候与介绍)',
        deadline: 'Đã hoàn thành',
        status: 'completed',
        score: 10.0,
        questionsCount: 5,
        type: 'Đã chấm điểm'
      },
      {
        id: 'lesson-2',
        number: '02',
        title: 'Gia đình & Nghề nghiệp (家庭与工作)',
        deadline: 'Đã hoàn thành',
        status: 'completed',
        score: 9.5,
        questionsCount: 5,
        type: 'Đã chấm điểm'
      },
      {
        id: 'lesson-3',
        number: '03',
        title: 'Thời gian & Ngày tháng (时间与日期)',
        deadline: 'Đã hoàn thành',
        status: 'completed',
        score: 9.0,
        questionsCount: 5,
        type: 'Đã chấm điểm'
      },
      {
        id: 'lesson-4',
        number: '04',
        title: 'Đi Mua Sắm (买东西)',
        deadline: '23:59 Hôm nay',
        status: 'active',
        score: null,
        questionsCount: 5,
        type: 'Cần nộp bài'
      },
      {
        id: 'lesson-5',
        number: '05',
        title: 'Ăn uống tại nhà hàng (在饭馆吃饭)',
        deadline: 'Tuần sau',
        status: 'locked',
        score: null,
        questionsCount: 5,
        type: 'Chưa mở'
      },
      {
        id: 'lesson-6',
        number: '06',
        title: 'Hỏi đường & Giao thông (问路与交通)',
        deadline: 'Tuần sau',
        status: 'locked',
        score: null,
        questionsCount: 5,
        type: 'Chưa mở'
      }
    ]
  },
  {
    id: 'hsk1',
    title: 'Tiếng Trung Căn Bản HSK 1 (Bắt Đầu Từ Số 0)',
    chineseTitle: '初级汉语',
    level: 'HSK 1',
    badge: 'Khóa nền tảng',
    teacher: 'Cô Linh Lão Sư (灵老师)',
    coverGradient: 'linear-gradient(135deg, #450a0a 0%, #831843 100%)',
    charWatermark: '文',
    description: 'Làm quen bảng chữ cái Pinyin, 4 thanh điệu, quy tắc bút thuận chữ Hán và 150 từ vựng cốt lõi.',
    totalLessons: 10,
    completedLessons: 10,
    lessons: [
      {
        id: 'hsk1-1',
        number: '01',
        title: 'Nhập môn Pinyin & Thanh điệu',
        deadline: 'Đã hoàn thành',
        status: 'completed',
        score: 10.0,
        questionsCount: 4,
        type: 'Đã chấm điểm'
      }
    ]
  },
  {
    id: 'speaking',
    title: 'Khẩu Ngữ & Phản Xạ Giao Tiếp HSKK',
    chineseTitle: '口语特训',
    level: 'Giao tiếp',
    badge: 'Lớp chuyên sâu',
    teacher: 'Cô Linh Lão Sư (灵老师)',
    coverGradient: 'linear-gradient(135deg, #991b1b 0%, #dc2626 100%)',
    charWatermark: '话',
    description: 'Chỉnh ngọng thanh 1, thanh 4 và biến âm nửa thanh 3. Luyện nói đoạn văn ngắn tự tin như người bản xứ.',
    totalLessons: 8,
    completedLessons: 2,
    lessons: [
      {
        id: 'spk-1',
        number: '01',
        title: 'Giới thiệu bản thân lưu loát',
        deadline: 'Đã hoàn thành',
        status: 'completed',
        score: 9.2,
        questionsCount: 3,
        type: 'Đã chấm điểm'
      }
    ]
  }
];
