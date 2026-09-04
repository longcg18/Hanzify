/**
 * Hanzify 汉字流 - Gamification, Streak, Leaderboard & Community Forum Data
 */

export const INITIAL_STREAK_DATA = {
  currentStreak: 5,
  longestStreak: 14,
  checkedInToday: false,
  totalXp: 5420,
  weekDays: [
    { day: 'T2', name: 'Thứ 2', completed: true, date: '2026-08-31' },
    { day: 'T3', name: 'Thứ 3', completed: true, date: '2026-09-01' },
    { day: 'T4', name: 'Thứ 4', completed: true, date: '2026-09-02' },
    { day: 'T5', name: 'Thứ 5', completed: true, date: '2026-09-03' },
    { day: 'T6', name: 'Thứ 6', completed: true, date: '2026-09-04' },
    { day: 'T7', name: 'Thứ 7', completed: false, date: '2026-09-05' },
    { day: 'CN', name: 'Chủ Nhật', completed: false, date: '2026-09-06' }
  ],
  milestones: [
    { days: 3, label: 'Khởi động 3 ngày', xpBonus: 100, unlocked: true },
    { days: 7, label: 'Chiến binh 1 tuần', xpBonus: 300, unlocked: false },
    { days: 30, label: 'Bậc thầy kiên trì 1 tháng', xpBonus: 1500, unlocked: false },
    { days: 100, label: 'Huyền thoại Hanzify', xpBonus: 5000, unlocked: false }
  ]
};

export const CLASSES_LIST = [
  { id: 'all', name: '🌐 Toàn Hệ Thống Hanzify', note: 'So tài tổng thể toàn bộ học viên' },
  { id: 'hsk1-k02', name: '🎓 Lớp HSK 1 - K02 (Tối T3 - T5)', note: 'Đã học 8 buổi • 18 học viên', totalLessons: 8 },
  { id: 'hsk1-k03', name: '🎓 Lớp HSK 1 - K03 (Chiều T7 - CN)', note: 'Mới học 3 buổi • 14 học viên (Đua top công bằng)', totalLessons: 3 },
  { id: 'hsk2-k01', name: '🎓 Lớp HSK 2 Toàn Diện (Tối T2 - T4 - T6)', note: 'Đã học 12 buổi • 26 học viên', totalLessons: 12 }
];

export const LEADERBOARD_DATA = {
  // Lọc theo lớp học
  byClass: {
    'hsk1-k03': [
      {
        id: 'user-student-k03-1',
        rank: 1,
        name: 'Hoàng Kim Jessi',
        chineseName: '金安',
        avatar: '杰',
        avatarBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        level: 'HSK 1',
        badge: 'Chăm nhất lớp K03 👑',
        xp: 1850,
        completionRate: 100, // Làm đủ 3/3 bài
        teacherGrade: 9.8,
        lessonsCompleted: 3,
        examsDone: 1,
        minigamesWon: 8,
        isCurrentUser: false
      },
      {
        id: 'user-student-k03-2',
        rank: 2,
        name: 'Đỗ Tuấn Kiệt',
        chineseName: '杜俊杰',
        avatar: '杰',
        avatarBg: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
        level: 'HSK 1',
        badge: 'Bài tập điểm 10 🥈',
        xp: 1620,
        completionRate: 100,
        teacherGrade: 9.5,
        lessonsCompleted: 3,
        examsDone: 0,
        minigamesWon: 7,
        isCurrentUser: false
      },
      {
        id: 'user-student-k03-3',
        rank: 3,
        name: 'Phạm Thị Mai',
        chineseName: '范氏梅',
        avatar: '梅',
        avatarBg: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
        level: 'HSK 1',
        badge: 'Phát âm chuẩn 🥉',
        xp: 1450,
        completionRate: 100,
        teacherGrade: 9.2,
        lessonsCompleted: 3,
        examsDone: 0,
        minigamesWon: 5,
        isCurrentUser: false
      },
      {
        id: 'user-student-k03-4',
        rank: 4,
        name: 'Lê Minh Khang',
        chineseName: '李明康',
        avatar: '康',
        avatarBg: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
        level: 'HSK 1',
        badge: 'Nỗ lực bứt phá',
        xp: 1100,
        completionRate: 67, // 2/3 bài
        teacherGrade: 9.0,
        lessonsCompleted: 2,
        examsDone: 0,
        minigamesWon: 4,
        isCurrentUser: false
      }
    ],
    'hsk1-k02': [
      {
        id: 'user-student-k02-1',
        rank: 1,
        name: 'Trần Tuấn Văn',
        chineseName: '陈俊文',
        avatar: '文',
        avatarBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        level: 'HSK 1',
        badge: 'Top 1 Lớp K02 👑',
        xp: 4960,
        completionRate: 100,
        teacherGrade: 9.9,
        lessonsCompleted: 8,
        examsDone: 2,
        minigamesWon: 16,
        isCurrentUser: false
      },
      {
        id: 'user-student-k02-2',
        rank: 2,
        name: 'Vũ Đức Thịnh',
        chineseName: '武德盛',
        avatar: '盛',
        avatarBg: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
        level: 'HSK 1',
        badge: 'Chăm chỉ nộp bài 🥈',
        xp: 4210,
        completionRate: 100,
        teacherGrade: 9.6,
        lessonsCompleted: 8,
        examsDone: 1,
        minigamesWon: 12,
        isCurrentUser: false
      },
      {
        id: 'user-student-k02-3',
        rank: 3,
        name: 'Nguyễn Thị Bích',
        chineseName: '阮氏碧',
        avatar: '碧',
        avatarBg: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
        level: 'HSK 1',
        badge: 'Top 3 K02 🥉',
        xp: 3880,
        completionRate: 88,
        teacherGrade: 9.3,
        lessonsCompleted: 7,
        examsDone: 1,
        minigamesWon: 10,
        isCurrentUser: false
      }
    ],
    'hsk2-k01': [
      {
        id: 'lb-w-1',
        rank: 1,
        name: 'Trần Minh Trang',
        chineseName: '陈明庄',
        avatar: '庄',
        avatarBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        level: 'HSK 2',
        badge: 'Quán Quân HSK 2 👑',
        xp: 13058,
        completionRate: 100,
        teacherGrade: 9.9,
        lessonsCompleted: 12,
        examsDone: 3,
        minigamesWon: 25,
        isCurrentUser: false
      },
      {
        id: 'lb-w-3',
        rank: 2,
        name: 'Lê Anh Thư',
        chineseName: '李英书',
        avatar: '书',
        avatarBg: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
        level: 'HSK 2',
        badge: 'Á Quân HSK 2 🥈',
        xp: 7780,
        completionRate: 100,
        teacherGrade: 9.6,
        lessonsCompleted: 12,
        examsDone: 2,
        minigamesWon: 15,
        isCurrentUser: false
      },
      {
        id: 'user-student-1',
        rank: 3,
        name: 'Nguyễn Văn An',
        chineseName: '阮文安',
        avatar: '安',
        avatarBg: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
        level: 'HSK 2',
        badge: 'Bứt phá Top 3 Lớp 🥉',
        xp: 5420,
        completionRate: 92,
        teacherGrade: 9.5,
        lessonsCompleted: 11,
        examsDone: 1,
        minigamesWon: 12,
        isCurrentUser: true
      },
      {
        id: 'lb-w-6',
        rank: 4,
        name: 'Đặng Quốc Bảo',
        chineseName: '邓国宝',
        avatar: '宝',
        avatarBg: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
        level: 'HSK 2',
        badge: 'Tiến bộ vượt bậc',
        xp: 3810,
        completionRate: 75,
        teacherGrade: 9.0,
        lessonsCompleted: 9,
        examsDone: 1,
        minigamesWon: 8,
        isCurrentUser: false
      }
    ]
  },
  weekly: [
    {
      id: 'lb-w-1',
      rank: 1,
      name: 'Trần Minh Trang',
      chineseName: '陈明庄',
      avatar: '庄',
      avatarBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      level: 'HSK 4',
      badge: 'Cày đề ngày đêm',
      xp: 13058,
      lessonsCompleted: 14,
      examsDone: 3,
      minigamesWon: 25,
      isCurrentUser: false
    },
    {
      id: 'lb-w-2',
      rank: 2,
      name: 'Trần Tuấn Văn',
      chineseName: '陈俊文',
      avatar: '文',
      avatarBg: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
      level: 'HSK 3',
      badge: 'Vua từ vựng',
      xp: 8960,
      lessonsCompleted: 10,
      examsDone: 2,
      minigamesWon: 18,
      isCurrentUser: false
    },
    {
      id: 'lb-w-3',
      rank: 3,
      name: 'Lê Anh Thư',
      chineseName: '李英书',
      avatar: '书',
      avatarBg: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
      level: 'HSK 3',
      badge: 'Chăm chỉ vô đối',
      xp: 7780,
      lessonsCompleted: 8,
      examsDone: 2,
      minigamesWon: 15,
      isCurrentUser: false
    },
    {
      id: 'user-student-1',
      rank: 4,
      name: 'Nguyễn Văn An',
      chineseName: '阮文安',
      avatar: '安',
      avatarBg: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
      level: 'HSK 2',
      badge: 'Đang bứt phá 🚀',
      xp: 5420,
      lessonsCompleted: 6,
      examsDone: 1,
      minigamesWon: 12,
      isCurrentUser: true
    },
    {
      id: 'lb-w-5',
      rank: 5,
      name: 'Hoàng Kim Jessi',
      chineseName: '金安',
      avatar: '杰',
      avatarBg: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      level: 'HSK 2',
      badge: 'Ngôi sao mới',
      xp: 4284,
      lessonsCompleted: 5,
      examsDone: 1,
      minigamesWon: 9,
      isCurrentUser: false
    },
    {
      id: 'lb-w-6',
      rank: 6,
      name: 'Đặng Quốc Bảo',
      chineseName: '邓国宝',
      avatar: '宝',
      avatarBg: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
      level: 'HSK 2',
      badge: 'Tiến bộ vượt bậc',
      xp: 3810,
      lessonsCompleted: 4,
      examsDone: 1,
      minigamesWon: 8,
      isCurrentUser: false
    },
    {
      id: 'lb-w-7',
      rank: 7,
      name: 'Phạm Thị Mai',
      chineseName: '范氏梅',
      avatar: '梅',
      avatarBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      level: 'HSK 1',
      badge: 'Tân binh thần tốc',
      xp: 2950,
      lessonsCompleted: 4,
      examsDone: 0,
      minigamesWon: 10,
      isCurrentUser: false
    }
  ],
  monthly: [
    {
      id: 'lb-m-1',
      rank: 1,
      name: 'Trần Minh Trang',
      chineseName: '陈明庄',
      avatar: '庄',
      avatarBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      level: 'HSK 4',
      badge: 'Top 1 Tháng 8 & 9',
      xp: 45280,
      lessonsCompleted: 42,
      examsDone: 12,
      minigamesWon: 80,
      isCurrentUser: false
    },
    {
      id: 'lb-m-2',
      rank: 2,
      name: 'Lê Anh Thư',
      chineseName: '李英书',
      avatar: '书',
      avatarBg: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
      level: 'HSK 3',
      badge: 'Chuyên gia luyện đề',
      xp: 36450,
      lessonsCompleted: 35,
      examsDone: 9,
      minigamesWon: 62,
      isCurrentUser: false
    },
    {
      id: 'lb-m-3',
      rank: 3,
      name: 'Trần Tuấn Văn',
      chineseName: '陈俊文',
      avatar: '文',
      avatarBg: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
      level: 'HSK 3',
      badge: 'Sát thủ HSK 3',
      xp: 31200,
      lessonsCompleted: 30,
      examsDone: 8,
      minigamesWon: 54,
      isCurrentUser: false
    },
    {
      id: 'user-student-1',
      rank: 4,
      name: 'Nguyễn Văn An',
      chineseName: '阮文安',
      avatar: '安',
      avatarBg: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
      level: 'HSK 2',
      badge: 'Học viên chăm chỉ',
      xp: 22480,
      lessonsCompleted: 24,
      examsDone: 5,
      minigamesWon: 41,
      isCurrentUser: true
    },
    {
      id: 'lb-m-5',
      rank: 5,
      name: 'Đặng Quốc Bảo',
      chineseName: '邓国宝',
      avatar: '宝',
      avatarBg: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
      level: 'HSK 2',
      badge: 'Nỗ lực không ngừng',
      xp: 18900,
      lessonsCompleted: 18,
      examsDone: 4,
      minigamesWon: 33,
      isCurrentUser: false
    }
  ],
  allTime: [
    {
      id: 'lb-a-1',
      rank: 1,
      name: 'Trần Minh Trang',
      chineseName: '陈明庄',
      avatar: '庄',
      avatarBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      level: 'HSK 4',
      badge: 'Đại Tông Sư Hanzify 👑',
      xp: 184500,
      lessonsCompleted: 180,
      examsDone: 45,
      minigamesWon: 350,
      isCurrentUser: false
    },
    {
      id: 'lb-a-2',
      rank: 2,
      name: 'Lê Anh Thư',
      chineseName: '李英书',
      avatar: '书',
      avatarBg: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
      level: 'HSK 3',
      badge: 'Cao Thủ Hoa Ngữ 🥈',
      xp: 142300,
      lessonsCompleted: 140,
      examsDone: 38,
      minigamesWon: 280,
      isCurrentUser: false
    },
    {
      id: 'lb-a-3',
      rank: 3,
      name: 'Vũ Đức Thịnh',
      chineseName: '武德盛',
      avatar: '盛',
      avatarBg: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
      level: 'HSK 4',
      badge: 'Bậc Thầy Pinyin 🥉',
      xp: 128900,
      lessonsCompleted: 125,
      examsDone: 32,
      minigamesWon: 240,
      isCurrentUser: false
    },
    {
      id: 'user-student-1',
      rank: 6,
      name: 'Nguyễn Văn An',
      chineseName: '阮文安',
      avatar: '安',
      avatarBg: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
      level: 'HSK 2',
      badge: 'Học viên HSK 2',
      xp: 86400,
      lessonsCompleted: 75,
      examsDone: 18,
      minigamesWon: 160,
      isCurrentUser: true
    }
  ]
};

export const INITIAL_FORUM_POSTS = [
  {
    id: 'post-1',
    category: 'bai-kho', // 'bai-kho' | 'hoi-dap' | 'bao-loi' | 'kinh-nghiem' | 'thao-luan'
    title: 'Phân biệt cách dùng 把 (Bả) và 被 (Bị) trong câu phức HSK 3?',
    content: 'Chào cô Hoài và các bạn! Mình đang học đến Bài 05 phần câu chữ 把, hay bị nhầm lẫn khi nào dùng 把 (chủ động tác động làm thay đổi vị trí/trạng thái) và khi nào dùng 被 (bị động). Ai có mẹo nhớ nhanh không ạ?',
    author: {
      name: 'Nguyễn Văn An',
      avatar: '安',
      role: 'student',
      badge: 'Học viên HSK 2'
    },
    createdAt: 'Hôm nay, 14:30',
    likesCount: 12,
    isLiked: false,
    status: 'answered', // 'pending' | 'answered' | 'fixed' | 'pinned'
    tags: ['Ngữ pháp HSK 3', 'Câu chữ 把', 'Mẹo nhớ'],
    comments: [
      {
        id: 'c-1',
        author: {
          name: 'Cô Hoài',
          avatar: '怀',
          role: 'teacher',
          badge: 'Giáo viên phụ trách 🌸'
        },
        content: 'Chào An! Cách nhớ cực đơn giản nhé:\n1. Câu 把: Chủ ngữ LÀM CHO tân ngữ thay đổi (A 把 B + Động từ + Kết quả). Ví dụ: 我把作业做完了 (Tôi làm xong bài tập rồi - chủ động).\n2. Câu 被: Chủ ngữ BỊ tác động (A 被 B + Động từ + Kết quả). Ví dụ: 苹果被弟弟吃了 (Quả táo bị em trai ăn rồi - bị động).\nEm nhớ là sau động từ trong cả 2 câu đều PHẢI có thành phần khác (kết quả, phương hướng) nhé!',
        createdAt: 'Hôm nay, 15:00',
        isTeacherAnswer: true,
        likesCount: 8
      },
      {
        id: 'c-2',
        author: {
          name: 'Trần Minh Trang',
          avatar: '庄',
          role: 'student',
          badge: 'Top 1 BXH'
        },
        content: 'Cô giải thích ngắn gọn dễ hiểu quá ạ! Em cũng từng bị lú câu này suốt.',
        createdAt: 'Hôm nay, 15:20',
        isTeacherAnswer: false,
        likesCount: 3
      }
    ]
  },
  {
    id: 'post-2',
    category: 'bao-loi',
    title: 'Góp ý: Câu số 4 đề thi thử HSK 2 phần Nghe loa bị rè ở giây thứ 15',
    content: 'Em vừa làm đề thi "Đề Thi Thử HSK 2 Toàn Diện - Đề 01", ở phần Nghe Part 1 câu 4 đoạn hội thoại của bạn nữ âm thanh hơi nhỏ và bị giật nhẹ một nhịp. Mong admin kiểm tra lại file audio giúp học viên ạ!',
    author: {
      name: 'Lê Anh Thư',
      avatar: '书',
      role: 'student',
      badge: 'Học viên HSK 3'
    },
    createdAt: 'Hôm qua, 20:15',
    likesCount: 9,
    isLiked: true,
    status: 'fixed',
    tags: ['Báo lỗi Audio', 'Đề HSK 2', 'Đã xử lý'],
    comments: [
      {
        id: 'c-3',
        author: {
          name: 'Nguyễn Phúc Long (Admin)',
          avatar: '👑',
          role: 'admin',
          badge: 'Quản trị viên tối cao'
        },
        content: 'Cảm ơn Thư đã báo lỗi rất chi tiết nhé! Đội ngũ kỹ thuật đã re-render và lọc tạp âm lại cho track audio câu 4. Hiện âm thanh đã phát trong trẻo chuẩn 320kbps rồi nhé!',
        createdAt: 'Hôm qua, 21:00',
        isTeacherAnswer: true,
        likesCount: 6
      }
    ]
  },
  {
    id: 'post-3',
    category: 'kinh-nghiem',
    title: 'Bí kíp đạt 195/200 điểm HSK 2 trong vòng 2 tháng tự học cùng Hanzify',
    content: 'Chào cả nhà, mình vừa thi đỗ HSK 2 tuần trước. Mình muốn chia sẻ 3 thói quen giúp mình bứt phá:\n1. Giữ chuỗi Streak hằng ngày (mỗi ngày ít nhất 15 phút làm mini-game từ vựng).\n2. Làm đi làm lại phần Đọc hiểu để quen mắt chữ Hán không cần nhìn Pinyin.\n3. Luyện đề bấm giờ thật trên phòng thi ảo của Hanzify để không bị cóng.',
    author: {
      name: 'Trần Minh Trang',
      avatar: '庄',
      role: 'student',
      badge: 'Top 1 BXH'
    },
    createdAt: '2 ngày trước',
    likesCount: 34,
    isLiked: false,
    status: 'pinned',
    tags: ['Kinh nghiệm', 'HSK 2', 'Ghim bài'],
    comments: [
      {
        id: 'c-4',
        author: {
          name: 'Cô Hoài',
          avatar: '怀',
          role: 'teacher',
          badge: 'Giáo viên phụ trách 🌸'
        },
        content: 'Cô rất tự hào về Trang! Phương pháp học kiên trì từng ngày chính là chìa khóa vàng. Cô ghim bài này lên đầu diễn đàn cho các bạn cùng học hỏi nhé!',
        createdAt: '2 ngày trước',
        isTeacherAnswer: true,
        likesCount: 15
      }
    ]
  },
  {
    id: 'post-4',
    category: 'bao-loi',
    title: 'Giao diện phòng thi trên điện thoại bị che mất nút nộp bài nếu zoom to',
    content: 'Khi em xoay ngang màn hình iPad hoặc zoom to 120% trên trình duyệt điện thoại, nút Nộp Bài ở góc dưới bên phải đôi khi bị thanh điều hướng che lấp. Admin xem xét đẩy nút lên cao hơn chút nhé.',
    author: {
      name: 'Trần Tuấn Văn',
      avatar: '文',
      role: 'student',
      badge: 'Học viên HSK 3'
    },
    createdAt: '3 ngày trước',
    likesCount: 7,
    isLiked: false,
    status: 'fixed',
    tags: ['Giao diện Mobile', 'Phòng thi', 'Đã sửa'],
    comments: [
      {
        id: 'c-5',
        author: {
          name: 'Nguyễn Phúc Long (Admin)',
          avatar: '👑',
          role: 'admin',
          badge: 'Quản trị viên tối cao'
        },
        content: 'Đã bổ sung CSS `safe-area-inset-bottom` và padding cho thanh điều khiển phòng thi. Cảm ơn Văn đã phản hồi!',
        createdAt: '3 ngày trước',
        isTeacherAnswer: true,
        likesCount: 4
      }
    ]
  },
  {
    id: 'post-5',
    category: 'thao-luan',
    title: 'Có bạn nào đang tìm bạn cùng luyện khẩu ngữ HSKK qua Discord không?',
    content: 'Mình đang học lớp Giao tiếp của Cô Hoài, muốn tìm bạn cùng luyện phản xạ phát âm thanh 1 và thanh 4 khoảng 20 phút mỗi tối từ 21h-21h20. Ai hứng thú nhắn mình nhé!',
    author: {
      name: 'Đặng Quốc Bảo',
      avatar: '宝',
      role: 'student',
      badge: 'Học viên HSK 2'
    },
    createdAt: '4 ngày trước',
    likesCount: 11,
    isLiked: false,
    status: 'pending',
    tags: ['Luyện nói', 'HSKK', 'Tìm bạn học'],
    comments: [
      {
        id: 'c-6',
        author: {
          name: 'Nguyễn Văn An',
          avatar: '安',
          role: 'student',
          badge: 'Học viên HSK 2'
        },
        content: 'Mình tham gia với nhé Bảo ơi! Mình cũng đang muốn chỉnh lại phát âm thanh 4.',
        createdAt: '4 ngày trước',
        isTeacherAnswer: false,
        likesCount: 2
      }
    ]
  }
];
