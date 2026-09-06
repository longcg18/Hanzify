// src/data/gamesData.js
// Dữ liệu trò chơi giáo dục phong phú phân loại theo HSK 1, HSK 2, HSK 3

// =========================================================================
// 1. 🃏 LẬT THẺ GHÉP ĐÔI (MEMORY MATCH) THEO CẤP ĐỘ
// =========================================================================
export const MEMORY_PAIRS_BY_LEVEL = {
  'HSK 1': [
    { id: 'm1-1', hanzi: '你好', pinyin: 'nǐ hǎo', mean: 'Xin chào' },
    { id: 'm1-2', hanzi: '谢谢', pinyin: 'xièxie', mean: 'Cảm ơn' },
    { id: 'm1-3', hanzi: '再见', pinyin: 'zàijiàn', mean: 'Tạm biệt' },
    { id: 'm1-4', hanzi: '苹果', pinyin: 'píngguǒ', mean: 'Quả táo' },
    { id: 'm1-5', hanzi: '喝水', pinyin: 'hē shuǐ', mean: 'Uống nước' },
    { id: 'm1-6', hanzi: '看书', pinyin: 'kàn shū', mean: 'Xem sách' },
    { id: 'm1-7', hanzi: '医生', pinyin: 'yīshēng', mean: 'Bác sĩ' },
    { id: 'm1-8', hanzi: '老师', pinyin: 'lǎoshī', mean: 'Giáo viên' }
  ],
  'HSK 2': [
    { id: 'm2-1', hanzi: '便宜', pinyin: 'piányi', mean: 'Rẻ tiền' },
    { id: 'm2-2', hanzi: '昂贵', pinyin: 'ángguì', mean: 'Đắt đỏ' },
    { id: 'm2-3', hanzi: '手表', pinyin: 'shǒubiǎo', mean: 'Đồng hồ đeo tay' },
    { id: 'm2-4', hanzi: '自行车', pinyin: 'zìxíngchē', mean: 'Xe đạp' },
    { id: 'm2-5', hanzi: '游泳', pinyin: 'yóuyǒng', mean: 'Bơi lội' },
    { id: 'm2-6', hanzi: '踢足球', pinyin: 'tī zúqiú', mean: 'Đá bóng' },
    { id: 'm2-7', hanzi: '打羽毛球', pinyin: 'dǎ yǔmáoqiú', mean: 'Đánh cầu lông' },
    { id: 'm2-8', hanzi: '时间', pinyin: 'shíjiān', mean: 'Thời gian' }
  ],
  'HSK 3': [
    { id: 'm3-1', hanzi: '环境', pinyin: 'huánjìng', mean: 'Môi trường' },
    { id: 'm3-2', hanzi: '影响', pinyin: 'yǐngxiǎng', mean: 'Ảnh hưởng' },
    { id: 'm3-3', hanzi: '解决', pinyin: 'jiějué', mean: 'Giải quyết' },
    { id: 'm3-4', hanzi: '决定', pinyin: 'juédìng', mean: 'Quyết định' },
    { id: 'm3-5', hanzi: '保护', pinyin: 'bǎohù', mean: 'Bảo vệ' },
    { id: 'm3-6', hanzi: '健康', pinyin: 'jiànkāng', mean: 'Khỏe mạnh' },
    { id: 'm3-7', hanzi: '成绩', pinyin: 'chéngjì', mean: 'Thành tích' },
    { id: 'm3-8', hanzi: '认真', pinyin: 'rènzhēn', mean: 'Nghiêm túc' }
  ]
};

// =========================================================================
// 2. ⚡ THỬ THÁCH THANH ĐIỆU (TONE BLITZ) THEO CẤP ĐỘ
// =========================================================================
export const TONE_ITEMS_BY_LEVEL = {
  'HSK 1': [
    { char: '妈', pinyin: 'mā', tone: 1, mean: 'Mẹ' },
    { char: '书', pinyin: 'shū', tone: 1, mean: 'Sách' },
    { char: '吃', pinyin: 'chī', tone: 1, mean: 'Ăn' },
    { char: '喝', pinyin: 'hē', tone: 1, mean: 'Uống' },
    { char: '国', pinyin: 'guó', tone: 2, mean: 'Quốc gia' },
    { char: '学', pinyin: 'xué', tone: 2, mean: 'Học' },
    { char: '人', pinyin: 'rén', tone: 2, mean: 'Người' },
    { char: '来', pinyin: 'lái', tone: 2, mean: 'Đến' },
    { char: '好', pinyin: 'hǎo', tone: 3, mean: 'Tốt / Đẹp' },
    { char: '你', pinyin: 'nǐ', tone: 3, mean: 'Bạn' },
    { char: '我', pinyin: 'wǒ', tone: 3, mean: 'Tôi' },
    { char: '买', pinyin: 'mǎi', tone: 3, mean: 'Mua' },
    { char: '谢', pinyin: 'xiè', tone: 4, mean: 'Cảm ơn' },
    { char: '去', pinyin: 'qù', tone: 4, mean: 'Đi' },
    { char: '是', pinyin: 'shì', tone: 4, mean: 'Là' },
    { char: '叫', pinyin: 'jiào', tone: 4, mean: 'Tên là' },
    { char: '看', pinyin: 'kàn', tone: 4, mean: 'Xem / Nhìn' },
    { char: '大', pinyin: 'dà', tone: 4, mean: 'To lớn' },
    { char: '小', pinyin: 'xiǎo', tone: 3, mean: 'Nhỏ bé' },
    { char: '天', pinyin: 'tiān', tone: 1, mean: 'Trời / Ngày' }
  ],
  'HSK 2': [
    { char: '高', pinyin: 'gāo', tone: 1, mean: 'Cao' },
    { char: '新', pinyin: 'xīn', tone: 1, mean: 'Mới' },
    { char: '穿', pinyin: 'chuān', tone: 1, mean: 'Mặc' },
    { char: '玩', pinyin: 'wán', tone: 2, mean: 'Chơi' },
    { char: '白', pinyin: 'bái', tone: 2, mean: 'Trắng' },
    { char: '晴', pinyin: 'qíng', tone: 2, mean: 'Nắng ráo' },
    { char: '红', pinyin: 'hóng', tone: 2, mean: 'Đỏ' },
    { char: '懂', pinyin: 'dǒng', tone: 3, mean: 'Hiểu' },
    { char: '走', pinyin: 'zǒu', tone: 3, mean: 'Đi bộ' },
    { char: '洗', pinyin: 'xǐ', tone: 3, mean: 'Rửa / Giặt' },
    { char: '给', pinyin: 'gěi', tone: 3, mean: 'Cho / Tặng' },
    { char: '贵', pinyin: 'guì', tone: 4, mean: 'Đắt' },
    { char: '慢', pinyin: 'màn', tone: 4, mean: 'Chậm' },
    { char: '快', pinyin: 'kuài', tone: 4, mean: 'Nhanh' },
    { char: '唱', pinyin: 'chàng', tone: 4, mean: 'Hát' },
    { char: '跳', pinyin: 'tiào', tone: 4, mean: 'Nhảy' },
    { char: '进', pinyin: 'jìn', tone: 4, mean: 'Vào' },
    { char: '问', pinyin: 'wèn', tone: 4, mean: 'Hỏi' },
    { char: '送', pinyin: 'sòng', tone: 4, mean: 'Tặng / Tiễn' },
    { char: '远', pinyin: 'yuǎn', tone: 3, mean: 'Xa' }
  ],
  'HSK 3': [
    { char: '春', pinyin: 'chūn', tone: 1, mean: 'Mùa xuân' },
    { char: '通', pinyin: 'tōng', tone: 1, mean: 'Thông suốt' },
    { char: '班', pinyin: 'bān', tone: 1, mean: 'Lớp học / Ca làm' },
    { char: '成', pinyin: 'chéng', tone: 2, mean: 'Thành công' },
    { char: '难', pinyin: 'nán', tone: 2, mean: 'Khó khăn' },
    { char: '甜', pinyin: 'tián', tone: 2, mean: 'Ngọt' },
    { char: '词', pinyin: 'cí', tone: 2, mean: 'Từ vựng' },
    { char: '减', pinyin: 'jiǎn', tone: 3, mean: 'Giảm bớt' },
    { char: '准', pinyin: 'zhǔn', tone: 3, mean: 'Chuẩn xác' },
    { char: '伞', pinyin: 'sǎn', tone: 3, mean: 'Chiếc ô' },
    { char: '考', pinyin: 'kǎo', tone: 3, mean: 'Thi cử' },
    { char: '定', pinyin: 'dìng', tone: 4, mean: 'Quyết định' },
    { char: '护', pinyin: 'hù', tone: 4, mean: 'Bảo hộ' },
    { char: '静', pinyin: 'jìng', tone: 4, mean: 'Yên tĩnh' },
    { char: '变', pinyin: 'biàn', tone: 4, mean: 'Biến đổi' },
    { char: '互', pinyin: 'hù', tone: 4, mean: 'Lẫn nhau' },
    { char: '健', pinyin: 'jiàn', tone: 4, mean: 'Khỏe mạnh' },
    { char: '顺', pinyin: 'shùn', tone: 4, mean: 'Thuận lợi' },
    { char: '极', pinyin: 'jí', tone: 2, mean: 'Cực độ' },
    { char: '短', pinyin: 'duǎn', tone: 3, mean: 'Ngắn' }
  ]
};

// =========================================================================
// 3. 🧩 NỐI NGHĨA THẦN TỐC (SPEED WORD MATCH) THEO CẤP ĐỘ
// =========================================================================
export const SPEED_PAIRS_BY_LEVEL = {
  'HSK 1': [
    { id: 'sp1-1', hanzi: '你好', mean: 'Xin chào' },
    { id: 'sp1-2', hanzi: '谢谢', mean: 'Cảm ơn' },
    { id: 'sp1-3', hanzi: '再见', mean: 'Tạm biệt' },
    { id: 'sp1-4', hanzi: '对不起', mean: 'Xin lỗi' },
    { id: 'sp1-5', hanzi: '没关系', mean: 'Không sao đâu' },
    { id: 'sp1-6', hanzi: '很高兴', mean: 'Rất vui mừng' }
  ],
  'HSK 2': [
    { id: 'sp2-1', hanzi: '多少钱', mean: 'Bao nhiêu tiền' },
    { id: 'sp2-2', hanzi: '太贵了', mean: 'Đắt quá rồi' },
    { id: 'sp2-3', hanzi: '便宜点儿', mean: 'Rẻ một chút' },
    { id: 'sp2-4', hanzi: '欢迎光临', mean: 'Hoan nghênh quý khách' },
    { id: 'sp2-5', hanzi: '慢走不送', mean: 'Đi thong thả' },
    { id: 'sp2-6', hanzi: '注意安全', mean: 'Chú ý an toàn' }
  ],
  'HSK 3': [
    { id: 'sp3-1', hanzi: '百闻不如一见', mean: 'Trăm nghe không bằng mắt thấy' },
    { id: 'sp3-2', hanzi: '无论……都……', mean: 'Bất kể thế nào cũng...' },
    { id: 'sp3-3', hanzi: '持之以恒', mean: 'Kiên trì bền bỉ không ngừng' },
    { id: 'sp3-4', hanzi: '实至名归', mean: 'Hoàn toàn xứng đáng danh hiệu' },
    { id: 'sp3-5', hanzi: '言必信行必果', mean: 'Lời nói đi đôi với việc làm' },
    { id: 'sp3-6', hanzi: '一诺千金', mean: 'Một lời hứa nặng ngàn vàng' }
  ]
};

// =========================================================================
// 4. 🏮 ĐOÁN CHỮ HÁN THEO NGHĨA (HANZI RIDDLE) THEO CẤP ĐỘ
// =========================================================================
export const RIDDLES_BY_LEVEL = {
  'HSK 1': [
    {
      prompt: 'Vật tròn ăn ngọt mát, có vỏ màu đỏ hoặc xanh, hay mua ở siêu thị (píngguǒ):',
      options: ['苹果', '衣服', '西瓜', '茶馆'],
      correct: '苹果',
      pinyin: 'píngguǒ',
      mean: 'Quả táo'
    },
    {
      prompt: 'Hành động trao tiền lấy đồ đạc mang về (mǎi):',
      options: ['买', '卖', '看', '听'],
      correct: '买',
      pinyin: 'mǎi',
      mean: 'Mua'
    },
    {
      prompt: 'Địa điểm học tập của học sinh và sinh viên (xuéxiào):',
      options: ['学校', '医院', '商店', '饭店'],
      correct: '学校',
      pinyin: 'xuéxiào',
      mean: 'Trường học'
    },
    {
      prompt: 'Người làm nhiệm vụ khám chữa bệnh cho mọi người (yīshēng):',
      options: ['医生', '老师', '学生', '同学'],
      correct: '医生',
      pinyin: 'yīshēng',
      mean: 'Bác sĩ'
    },
    {
      prompt: 'Phương tiện bay trên bầu trời đưa đón hành khách (fēijī):',
      options: ['飞机', '出租车', '自行车', '火车'],
      correct: '飞机',
      pinyin: 'fēijī',
      mean: 'Máy bay'
    }
  ],
  'HSK 2': [
    {
      prompt: 'Đồ vật nhỏ đeo ở cổ tay để xem giờ giấc (shǒubiǎo):',
      options: ['手表', '手机', '手套', '钥匙'],
      correct: '手表',
      pinyin: 'shǒubiǎo',
      mean: 'Đồng hồ đeo tay'
    },
    {
      prompt: 'Hành vi thể thao dưới nước rất tốt cho sức khỏe mùa hè (yóuyǒng):',
      options: ['游泳', '跑步', '唱歌', '跳舞'],
      correct: '游泳',
      pinyin: 'yóuyǒng',
      mean: 'Bơi lội'
    },
    {
      prompt: 'Tính từ diễn tả giá cả rất thấp, hợp túi tiền (piányi):',
      options: ['便宜', '贵', '大', '小'],
      correct: '便宜',
      pinyin: 'piányi',
      mean: 'Rẻ tiền'
    },
    {
      prompt: 'Phương tiện giao thông công cộng chạy ngầm dưới lòng đất (dìtiě):',
      options: ['地铁', '飞机', '轮船', '出租车'],
      correct: '地铁',
      pinyin: 'dìtiě',
      mean: 'Tàu điện ngầm'
    },
    {
      prompt: 'Đồ uống thơm ngon màu nâu đậm giúp tỉnh táo tinh thần (kāfēi):',
      options: ['咖啡', '牛奶', '茶水', '可乐'],
      correct: '咖啡',
      pinyin: 'kāfēi',
      mean: 'Cà phê'
    }
  ],
  'HSK 3': [
    {
      prompt: 'Cuốn sổ thông hành quan trọng nhất khi xuất nhập cảnh ra nước ngoài (hùzhào):',
      options: ['护照', '登机牌', '学生证', '身份证'],
      correct: '护照',
      pinyin: 'hùzhào',
      mean: 'Hộ chiếu'
    },
    {
      prompt: 'Từ chỉ toàn bộ không gian tự nhiên và điều kiện sinh sống quanh con người (huánjìng):',
      options: ['环境', '情况', '决定', '习惯'],
      correct: '环境',
      pinyin: 'huánjìng',
      mean: 'Môi trường'
    },
    {
      prompt: 'Động từ chỉ hành vi tìm ra phương án tháo gỡ khó khăn khúc mắc (jiějué):',
      options: ['解决', '了解', '完成', '保护'],
      correct: '解决',
      pinyin: 'jiějué',
      mean: 'Giải quyết'
    },
    {
      prompt: 'Mùa đầu tiên trong bốn mùa, vạn vật đâm chồi nảy lộc tươi tốt (chūntiān):',
      options: ['春天', '夏天', '秋天', '冬天'],
      correct: '春天',
      pinyin: 'chūntiān',
      mean: 'Mùa xuân'
    },
    {
      prompt: 'Phẩm chất đạo đức giữ đúng lời hứa và tạo dựng uy tín lâu bền (chéngxìn):',
      options: ['诚信', '客气', '热情', '礼貌'],
      correct: '诚信',
      pinyin: 'chéngxìn',
      mean: 'Thành tín'
    }
  ]
};
