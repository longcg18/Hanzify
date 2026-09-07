// src/data/practice/hsk2_practice.js
// 100 câu hỏi Luyện tập tự do HSK 2 (20 câu Nghe, 20 câu Đọc, 20 câu Ngữ pháp, 20 câu Pinyin, 20 câu Chữ Hán)

export const hsk2PracticeTopics = [
  // =========================================================================
  // 1. 🎧 KỸ NĂNG NGHE HIỂU (20 CÂU)
  // =========================================================================
  {
    id: 'hsk2-prac-listening',
    skill: 'listening',
    skillLabel: '🎧 Luyện Nghe',
    level: 'HSK 2',
    title: 'Luyện Nghe HSK 2: Mua Sắm, Sức Khỏe & Giao Tiếp Thực Tế',
    desc: 'Nghe hiểu các mẫu câu hỏi giá, trả giá, diễn tả tình trạng sức khỏe, thói quen sinh hoạt và lịch trình.',
    questionsCount: 20,
    questions: [
      {
        prompt: 'Lắng nghe giá tiền: "这件羊毛衫两百八十块，能便宜点儿吗？" Người nói hỏi điều gì?',
        audio: '这件羊毛衫两百八十块，能便宜点儿吗？',
        pinyin: 'Zhè jiàn yángmáoshān liǎngbǎi bāshí kuài, néng piányi diǎnr ma?',
        options: ['Có thể giảm giá một chút được không?', 'Có cỡ áo lớn hơn không?', 'Có màu đỏ không?', 'Có ship tận nơi không?'],
        correct: 0,
        explain: '"能便宜点儿吗" là câu cửa miệng khi mặc cả: Có thể rẻ hơn chút được không?'
      },
      {
        prompt: 'Lắng nghe sức khỏe: "医生说我感冒了，要多喝温水，按时吃药。" Người nói cần làm gì?',
        audio: '医生说我感冒了，要多喝温水，按时吃药。',
        pinyin: 'Yīshēng shuō wǒ gǎnmào le, yào duō hē wēnshuǐ, ànshí chī yào.',
        options: ['Uống nhiều nước ấm và uống thuốc đúng giờ', 'Đi chạy bộ tập thể thao', 'Tăng ca buổi tối', 'Đi ăn lẩu cay'],
        correct: 0,
        explain: '"多喝温水，按时吃药" là lời khuyên uống nhiều nước ấm và uống thuốc đúng giờ.'
      },
      {
        prompt: 'Lắng nghe thời gian: "会议两点一刻开始，大家准备好了吗？" Cuộc họp bắt đầu lúc mấy giờ?',
        audio: '会议两点一刻开始，大家准备好了吗？',
        pinyin: 'Huìyì liǎng diǎn yí kè kāishǐ, dàjiā zhǔnbèi hǎo le ma?',
        options: ['2:15', '2:30', '2:45', '3:15'],
        correct: 0,
        explain: '"两点一刻" là 2 giờ 15 phút (1 khắc = 15 phút).'
      },
      {
        prompt: 'Lắng nghe phương tiện: "今天路上堵车，所以我坐地铁来上班。" Người nói đi phương tiện gì?',
        audio: '今天路上堵车，所以我坐地铁来上班。',
        pinyin: 'Jīntiān lùshang dǔchē, suǒyǐ wǒ zuò dìtiě lái shàngbān.',
        options: ['Đi xe buýt', 'Đi tàu điện ngầm (地铁)', 'Đi xe máy', 'Đi bộ'],
        correct: 1,
        explain: '"坐地铁" (zuò dìtiě) là đi bằng tàu điện ngầm.'
      },
      {
        prompt: 'Lắng nghe sở thích thể thao: "每天下午我都去操场踢足球。" Người nói chơi môn gì?',
        audio: '每天下午我都去操场踢足球。',
        pinyin: 'Měitiān xiàwǔ wǒ dōu qù cāochǎng tī zúqiú.',
        options: ['Bóng rổ', 'Bóng đá (踢足球)', 'Bơi lội', 'Chạy marathon'],
        correct: 1,
        explain: '"踢足球" (tī zúqiú) là đá bóng.'
      },
      {
        prompt: 'Lắng nghe món ăn: "天气冷了，今天晚上我们去吃火锅吧！" Họ rủ nhau đi ăn món gì?',
        audio: '天气冷了，今天晚上我们去吃火锅吧！',
        pinyin: 'Tiānqì lěng le, jīntiān wǎnshang wǒmen qù chī huǒguō ba!',
        options: ['Ăn lẩu (吃火锅)', 'Ăn mì gói', 'Ăn cơm rang', 'Ăn bánh bao'],
        correct: 0,
        explain: '"吃火锅" (chī huǒguō) là ăn lẩu.'
      },
      {
        prompt: 'Lắng nghe chỉ đường: "往前走两百米，在红绿灯右拐就是书店。" Hiệu sách ở đâu?',
        audio: '往前走两百米，在红绿灯右拐就是书店。',
        pinyin: 'Wǎng qián zǒu liǎngbǎi mǐ, zài hónglǜdēng yòuguǎi jiùshì shūdiàn.',
        options: ['Đi thẳng 200m rồi rẽ phải ở đèn giao thông', 'Đi thẳng 100m rồi rẽ trái', 'Ở ngay ngã tư đối diện', 'Phải đi lùi lại'],
        correct: 0,
        explain: '"右拐" là rẽ phải, "红绿灯" là đèn tín hiệu giao thông.'
      },
      {
        prompt: 'Lắng nghe thời tiết: "外面刮大风，把窗户关好吧。" Người nói yêu cầu làm gì?',
        audio: '外面刮大风，把窗户关好吧。',
        pinyin: 'Wàimiàn guā dà fēng, bǎ chuānghu guān hǎo ba.',
        options: ['Đóng chặt cửa sổ vì gió lớn', 'Mở cửa sổ cho thoáng gió', 'Bật máy điều hòa nhiệt độ', 'Ra sân chơi cầu lông'],
        correct: 0,
        explain: '"把窗户关好" nghĩa là đóng chặt cửa sổ lại.'
      },
      {
        prompt: 'Lắng nghe đồ vật: "我找了半天，原来手表在床头柜上呢。" Đồ vật được tìm thấy là gì?',
        audio: '我找了半天，原来手表在床头柜上呢。',
        pinyin: 'Wǒ zhǎo le bàntiān, yuánlái shǒubiǎo zài chuángtóuguì shang ne.',
        options: ['Đồng hồ đeo tay (手表)', 'Điện thoại di động', 'Chùm chìa khóa', 'Chiếc kính mắt'],
        correct: 0,
        explain: '"手表" (shǒubiǎo) là chiếc đồng hồ đeo tay.'
      },
      {
        prompt: 'Lắng nghe kế hoạch: "周末如果有空，我们一起去爬香山吧。" Họ rủ nhau đi đâu?',
        audio: '周末如果有空，我们一起去爬香山吧。',
        pinyin: 'Zhōumò rúguǒ yǒu kòng, wǒmen yìqǐ qù pá Xiāngshān ba.',
        options: ['Đi leo núi Hương Sơn (爬香山)', 'Đi bơi ở hồ', 'Đi xem phim rạp', 'Đi sở thú xem thú'],
        correct: 0,
        explain: '"爬香山" là leo núi Hương Sơn nổi tiếng.'
      },
      {
        prompt: 'Lắng nghe phòng ở: "这个房间太吵了，我想换一个安静一点儿的。" Người nói muốn đổi phòng thế nào?',
        audio: '这个房间太吵了，我想换一个安静一点儿的。',
        pinyin: 'Zhège fángjiān tài chǎo le, wǒ xiǎng huàn yí gè ānjìng yìdiǎnr de.',
        options: ['Phòng yên tĩnh hơn (安静)', 'Phòng lớn hơn', 'Phòng rẻ hơn', 'Phòng có ban công view biển'],
        correct: 0,
        explain: '"安静一点儿" là yên tĩnh hơn một chút.'
      },
      {
        prompt: 'Lắng nghe tặng quà: "这是送给你的生日礼物，祝你天天开心！" Món quà được tặng vào dịp nào?',
        audio: '这是送给你的生日礼物，祝你天天开心！',
        pinyin: 'Zhè shì sòng gěi nǐ de shēngrì lǐwù, zhù nǐ tiāntiān kāixīn!',
        options: ['Dịp sinh nhật (生日)', 'Dịp đám cưới', 'Dịp năm mới', 'Dịp tốt nghiệp'],
        correct: 0,
        explain: '"生日礼物" là quà mừng sinh nhật.'
      },
      {
        prompt: 'Lắng nghe khen ngợi: "你的汉语发音非常标准，像中国人一样！" Người nói khen điều gì?',
        audio: '你的汉语发音非常标准，像中国人一样！',
        pinyin: 'Nǐ de Hànyǔ fāyīn fēicháng biāozhǔn, xiàng Zhōngguórén yíyàng!',
        options: ['Phát âm tiếng Trung rất chuẩn xác', 'Viết chữ Hán rất đẹp', 'Trí nhớ từ vựng rất siêu', 'Nấu món ăn ngon'],
        correct: 0,
        explain: '"发音非常标准" là phát âm cực kỳ chuẩn xác.'
      },
      {
        prompt: 'Lắng nghe màu sắc: "你看这条红色的裙子好看吗？" Chiếc váy có màu gì?',
        audio: '你看这条红色的裙子好看吗？',
        pinyin: 'Nǐ kàn zhè tiáo hóngsè de qúnzi hǎokàn ma?',
        options: ['Màu đỏ (红色)', 'Màu trắng', 'Màu hồng phấn', 'Màu xanh lá'],
        correct: 0,
        explain: '"红色的裙子" là chiếc váy màu đỏ.'
      },
      {
        prompt: 'Lắng nghe cân nặng: "给我称两斤新鲜的西红柿。" Người nói mua bao nhiêu cà chua?',
        audio: '给我称两斤新鲜的西红柿。',
        pinyin: 'Gěi wǒ chēng liǎng jīn xīnxiān de xīhóngshì.',
        options: ['1 cân (500g)', '2 cân (1kg)', '3 cân (1.5kg)', '5 cân'],
        correct: 1,
        explain: '"两斤" (liǎng jīn) trong đơn vị đo Trung Quốc là 2 cân Tàu (tương đương 1kg).'
      },
      {
        prompt: 'Lắng nghe lý do vắng mặt: "小陈的儿子发高烧了，所以她今天请假。" Ai bị sốt?',
        audio: '小陈的儿子发高烧了，所以她今天请假。',
        pinyin: 'Xiǎo Chén de érzi fā gāoshāo le, suǒyǐ tā jīntiān qǐngjià.',
        options: ['Con trai của Tiểu Trần (小陈的儿子)', 'Tiểu Trần', 'Chồng Tiểu Trần', 'Mẹ Tiểu Trần'],
        correct: 0,
        explain: '"小陈的儿子发高烧" nghĩa là con trai Tiểu Trần bị sốt cao.'
      },
      {
        prompt: 'Lắng nghe máy tính: "我的电脑死机了，开不了，需要送去修一下。" Máy tính bị sao?',
        audio: '我的电脑死机了，开不了，需要送去修一下。',
        pinyin: 'Wǒ de diànnǎo sǐjī le, kāi bù liǎo, xūyào sòng qù xiū yíxià.',
        options: ['Máy tính bị đơ, không bật được, cần đi sửa', 'Bị mất trộm', 'Bị rơi vỡ màn hình', 'Hết dung lượng ổ cứng'],
        correct: 0,
        explain: '"死机了，开不了" là bị treo máy không khởi động lên được.'
      },
      {
        prompt: 'Lắng nghe lời chúc: "明天考试别紧张，相信你一定能考过！" Người nói muốn gửi gắm điều gì?',
        audio: '明天考试别紧张，相信你一定能考过！',
        pinyin: 'Míngtiān kǎoshì bié jǐnzhāng, xiāngxìn nǐ yídìng néng kǎoguò!',
        options: ['Khuyên đừng lo lắng, tự tin sẽ thi đỗ', 'Bảo người kia nên hoãn thi', 'Rủ đi chơi xả stress', 'Nhắc nhở mang bút chì'],
        correct: 0,
        explain: '"别紧张，一定能考过" là lời động viên thi cử.'
      },
      {
        prompt: 'Lắng nghe thể thao: "我最喜欢的运动是打羽毛球，你呢？" Môn thể thao yêu thích của người nói là gì?',
        audio: '我最喜欢的运动是打羽毛球，你呢？',
        pinyin: 'Wǒ zuì xǐhuan de yùndòng shì dǎ yǔmáoqiú, nǐ ne?',
        options: ['Đánh cầu lông (打羽毛球)', 'Đánh bóng bàn', 'Bơi lội', 'Chơi golf'],
        correct: 0,
        explain: '"打羽毛球" (dǎ yǔmáoqiú) là đánh cầu lông.'
      },
      {
        prompt: 'Lắng nghe sở thích ăn uống: "我不太能吃辣，炒菜请少放辣椒。" Người nói có thói quen ăn uống thế nào?',
        audio: '我不太能吃辣，炒菜请少放辣椒。',
        pinyin: 'Wǒ bú tài néng chī là, chǎocài qǐng shǎo fàng làjiāo.',
        options: ['Không ăn được cay nhiều, xin cho ít ớt', 'Rất thích ăn cay nồng', 'Ăn chay hoàn toàn', 'Không ăn được hành tỏi'],
        correct: 0,
        explain: '"不太能吃辣" là không ăn được cay, "少放辣椒" là cho ít ớt.'
      }
    ]
  },

  // =========================================================================
  // 2. 📖 KỸ NĂNG ĐỌC HIỂU (20 CÂU)
  // =========================================================================
  {
    id: 'hsk2-prac-reading',
    skill: 'reading',
    skillLabel: '📖 Đọc Hiểu',
    level: 'HSK 2',
    title: 'Đọc Hiểu Đoạn Văn Đời Sống HSK 2',
    desc: 'Luyện kỹ năng đọc hiểu đoạn văn miêu tả sinh hoạt, công việc, quan hệ bạn bè, so sánh và suy luận ngữ cảnh.',
    questionsCount: 20,
    questions: [
      {
        prompt: 'Đoạn văn: "小李每天早晨坚持跑步五公里，风雨无阻。所以他的身体非常健康。" ★ Nhận định: Tiểu Lý rất ít khi tập thể dục.',
        options: ['对 (Đúng)', '错 (Sai)'],
        correct: 1,
        explain: 'Tiểu Lý chạy bộ mỗi sáng 5km nên nhận định "ít tập thể dục" là Sai.'
      },
      {
        prompt: 'Đoạn văn: "这家咖啡馆的咖啡味道香浓，服务员态度也很好，就是价格稍微有点儿贵。" ★ Nhận định: Quán cà phê này có giá cả rất rẻ.',
        options: ['对 (Đúng)', '错 (Sai)'],
        correct: 1,
        explain: 'Bài nói "价格稍微有点儿贵" (giá hơi đắt) nên nhận định rẻ là Sai.'
      },
      {
        prompt: 'Đoạn văn: "虽然今天外面下着大雪，非常冷，但是教室里开着暖气，很温暖。" Hỏi: Không khí trong lớp học thế nào?',
        options: ['Rất ấm áp (很温暖)', 'Rất lạnh lẽo', 'Mưa gió ẩm ướt', 'Nắng nóng'],
        correct: 0,
        explain: '"教室里开着暖气，很温暖" là trong lớp bật sưởi nên rất ấm.'
      },
      {
        prompt: 'Đoạn văn: "张华比王伟高五厘米，但是王伟跑得比张华快。" Hỏi: Ai chạy nhanh hơn?',
        options: ['Vương Vĩ (王伟)', 'Trương Hoa (张华)', 'Hai người chạy nhanh bằng nhau', 'Không thể biết'],
        correct: 0,
        explain: '"王伟跑得比张华快" là Vương Vĩ chạy nhanh hơn Trương Hoa.'
      },
      {
        prompt: 'Đoạn văn: "这件黑色的大衣穿在爸爸身上非常合适，又保暖又大方。" Chiếc áo khoác này mang lại cảm giác gì?',
        options: ['Vừa ấm áp vừa lịch sự phong độ', 'Quá chật chội', 'Màu sắc quá sặc sỡ', 'Chất vải mỏng'],
        correct: 0,
        explain: '"又保暖又大方" là vừa ấm vừa trang nhã.'
      },
      {
        prompt: 'Đoạn văn: "为了准备下个月的HSK二级考试，她每天晚上都要背三十个生词。" Mỗi tối cô ấy làm gì?',
        options: ['Học thuộc 30 từ mới', 'Xem phim 30 phút', 'Viết 30 bài văn', 'Nghe 30 bài hát'],
        correct: 0,
        explain: '"背三十个生词" là học thuộc 30 từ vựng mới.'
      },
      {
        prompt: 'Đoạn văn: "服务员，这盘鱼不仅味道鲜美，而且鱼刺非常少，老少皆宜。" Món cá này có đặc điểm gì nổi bật?',
        options: ['Thơm ngon và rất ít xương (鱼刺少)', 'Quá mặn', 'Nhiều xương nhọn', 'Rất cay'],
        correct: 0,
        explain: '"鱼刺非常少" nghĩa là rất ít xương cá.'
      },
      {
        prompt: 'Đoạn văn: "今天早上下大雨，路上堵车非常严重，平时只要二十分钟的路程，今天开了整整一个小时。" Hôm nay đi mất bao lâu?',
        options: ['20 phút', '30 phút', 'Đúng 1 tiếng (一个小时)', '2 tiếng'],
        correct: 2,
        explain: '"整整一个小时" là trọn vẹn một tiếng đồng hồ.'
      },
      {
        prompt: 'Đoạn văn: "奶奶今年七十岁了，但耳不聋、眼不花，每天还经常在公园跳广场舞。" Bà nội có tình trạng sức khỏe thế nào?',
        options: ['Rất khỏe mạnh và năng động', 'Đang nằm viện', 'Mắt mờ tai điếc', 'Không thể đi lại'],
        correct: 0,
        explain: 'Bà tai thính mắt sáng và thường xuyên nhảy dân vũ ở công viên.'
      },
      {
        prompt: 'Đoạn văn: "北京的秋天是一年中最美的季节，天高气爽，香山红叶满山，非常适合出游。" Mùa nào ở Bắc Kinh đẹp nhất?',
        options: ['Mùa thu (秋天)', 'Mùa xuân', 'Mùa hè', 'Mùa đông'],
        correct: 0,
        explain: '"北京的秋天是一年中最美的季节" là mùa thu Bắc Kinh đẹp nhất.'
      },
      {
        prompt: 'Đoạn văn: "小孙从小就喜欢弹钢琴，现在已经考过十级了，弹得特别动听。" Tiểu Tôn có tài năng gì?',
        options: ['Chơi đàn Piano rất hay', 'Vẽ tranh sơn dầu', 'Chơi đàn vĩ cầm', 'Múa ba lê'],
        correct: 0,
        explain: '"弹钢琴" là chơi đàn dương cầm (piano).'
      },
      {
        prompt: 'Đoạn văn: "医生提醒大家：饭后不要马上剧烈运动，最好散步半小时，有助于消化。" Sau khi ăn nên làm gì?',
        options: ['Đi dạo thong thả nửa tiếng (散步)', 'Chạy marathon ngay lập tức', 'Đi ngủ ngay', 'Uống trà đá đậm'],
        correct: 0,
        explain: '"最好散步半小时，有助于消化" đi bộ nửa tiếng hỗ trợ tiêu hóa.'
      },
      {
        prompt: 'Đoạn văn: "这本汉语词典虽然很厚很重，但是查字特别方便，解释也很详细。" Quyển từ điển này có ưu điểm gì?',
        options: ['Tra từ rất tiện lợi và giải thích chi tiết', 'Rất mỏng nhẹ', 'Giá cực rẻ', 'Chỉ có tranh ảnh'],
        correct: 0,
        explain: '"查字特别方便，解释也很详细".'
      },
      {
        prompt: 'Đoạn văn: "妈妈做的西红柿炒鸡蛋色香味俱全，是我从小到大最爱吃的一道家常菜。" Món ăn yêu thích của tác giả là gì?',
        options: ['Trứng xào cà chua (西红柿炒鸡蛋)', 'Thịt kho tàu', 'Canh gà hầm', 'Cơm rang dưa bò'],
        correct: 0,
        explain: '"西红柿炒鸡蛋" là món cà chua xào trứng.'
      },
      {
        prompt: 'Đoạn văn: "明天下午两点在三楼第一会议室开全体员工大会，请大家准时参会，不要迟到。" Cuộc họp diễn ra ở đâu?',
        options: ['Phòng họp số 1 ở tầng 3', 'Phòng họp tầng 2', 'Sảnh tầng 1', 'Căng tin công ty'],
        correct: 0,
        explain: '"在三楼第一会议室" là phòng họp 1 ở tầng 3.'
      },
      {
        prompt: 'Đoạn văn: "为了保护眼睛，看手机四十分钟后，应该停下来向远处看看绿色的植物。" Cách bảo vệ mắt tốt là gì?',
        options: ['Nhìn ra xa ngắm cây xanh sau 40 phút dùng điện thoại', 'Xem màn hình liên tục trong bóng tối', 'Đeo kính râm khi ngủ', 'Rửa mắt bằng nước nóng'],
        correct: 0,
        explain: '"向远处看看绿色的植物" nhìn xa ngắm cây xanh giúp mắt thư giãn.'
      },
      {
        prompt: 'Đoạn văn: "小李新买的自行车是蓝色的，车把上还挂着一个漂亮的小铃铛。" Chiếc xe đạp của Tiểu Lý có đặc điểm gì?',
        options: ['Màu xanh lam có gắn chuông xinh xắn', 'Màu đỏ không có chuông', 'Màu đen có giỏ to', 'Xe đạp điện màu trắng'],
        correct: 0,
        explain: '"蓝色的，挂着漂亮的小铃铛" là màu xanh có chuông nhỏ xinh.'
      },
      {
        prompt: 'Đoạn văn: "这家超市每周三都有会员打折活动，所有日用品打八折，所以很多人来排队。" Vì sao thứ Tư đông người xếp hàng?',
        options: ['Có ngày hội giảm giá 20% cho hội viên', 'Mở cửa miễn phí', 'Tặng quà sinh nhật', 'Khai trương cửa hàng mới'],
        correct: 0,
        explain: '"打八折" là giảm 20% (bán 80% giá gốc) nên rất đông khách.'
      },
      {
        prompt: 'Đoạn văn: "天气预报说周六是晴天，周日有中雨。所以我们决定周六去公园野餐。" Họ đi dã ngoại vào ngày nào?',
        options: ['Thứ Bảy (周六)', 'Chủ Nhật', 'Thứ Sáu', 'Cả hai ngày cuối tuần'],
        correct: 0,
        explain: 'Thứ Bảy trời nắng nên chọn đi dã ngoại vào "周六".'
      },
      {
        prompt: 'Đoạn văn: "小王工作非常认真负责，即使遇到了不懂的问题，也会虚心地向老同事请教。" Tiểu Vương có tính cách thế nào?',
        options: ['Nghiêm túc, trách nhiệm và khiêm tốn học hỏi', 'Lười biếng hay trốn việc', 'Kiêu ngạo không nghe ai', 'Thường xuyên đi muộn'],
        correct: 0,
        explain: '"认真负责，虚心请教" là nghiêm túc trách nhiệm và khiêm tốn.'
      }
    ]
  },

  // =========================================================================
  // 3. 🧩 KỸ NĂNG NGỮ PHÁP (20 CÂU)
  // =========================================================================
  {
    id: 'hsk2-prac-grammar',
    skill: 'grammar',
    skillLabel: '🧩 Ngữ Pháp',
    level: 'HSK 2',
    title: 'Ngữ Pháp Nâng Cao HSK 2: Bổ Ngữ, Câu Chữ 比 & 虽然...但是...',
    desc: 'Nắm vững câu so sánh 比, trợ từ động thái (着, 过, 了), cặp liên từ chuyển ý (虽然...但是..., 因为...所以...), phó từ 还/再/就.',
    questionsCount: 20,
    questions: [
      {
        prompt: 'Chọn câu so sánh chữ "比" đúng chuẩn ngữ pháp:',
        options: [
          '哥哥比我高五厘米。',
          '哥哥比我很长。',
          '我比哥哥高五厘米。',
          '比哥哥我高五厘米。'
        ],
        correct: 0,
        explain: 'Cấu trúc so sánh: A + 比 + B + Tính từ + Lượng từ sai biệt ("哥哥比我高五厘米").'
      },
      {
        prompt: 'Điền cặp liên từ biểu thị sự nhượng bộ: "_____工作很累，_____他觉得很充实。"',
        options: [
          '虽然……但是…… (Tuy... nhưng...)',
          '因为……所以…… (Bởi vì... cho nên...)',
          '不仅……而且…… (Không những... mà còn...)',
          '如果……就…… (Nếu... thì...)'
        ],
        correct: 0,
        explain: '"虽然...但是..." biểu thị mối quan hệ nhượng bộ chuyển ý.'
      },
      {
        prompt: 'Điền phó từ: "他生病了，_____坚持来上班。"',
        options: ['还 (vẫn / còn)', '再 (lại)', '就 (ngay)', '很 (rất)'],
        correct: 0,
        explain: 'Phó từ "还" biểu thị sự tiếp diễn bất chấp hoàn cảnh (vẫn kiên trì đi làm).'
      },
      {
        prompt: 'Điền trợ từ trạng thái tồn tại: "门开_____呢，请进吧。"',
        options: ['着 (zhe - đang trong trạng thái)', '过 (guò)', '了 (le)', '的 (de)'],
        correct: 0,
        explain: 'Động từ + 着 biểu thị sự duy trì trạng thái của sự vật: "门开着呢" (Cửa đang mở đấy).'
      },
      {
        prompt: 'Điền trợ từ kinh nghiệm từng trải: "我去_____北京，长城非常壮观。"',
        options: ['过 (guò - đã từng)', '着 (zhe)', '了 (le)', '得 (de)'],
        correct: 0,
        explain: 'Động từ + 过 biểu thị hành động đã từng xảy ra trong quá khứ.'
      },
      {
        prompt: 'Điền phó từ biểu thị hành động xảy ra sớm hoặc thuận lợi: "他早上六点_____起床了。"',
        options: ['就 (jiù - đã / ngay)', '才 (cái - mới)', '还 (hái)', '再 (zài)'],
        correct: 0,
        explain: 'Phó từ "就" biểu thị hành động xảy ra sớm, nhanh chóng hoặc đúng hạn.'
      },
      {
        prompt: 'Điền phó từ biểu thị hành động diễn ra muộn, chậm chạp: "你怎么十点_____来？"',
        options: ['才 (cái - mới)', '就 (jiù)', '已经 (yǐjīng)', '都 (dōu)'],
        correct: 0,
        explain: 'Phó từ "才" biểu thị hành động xảy ra muộn hơn mong đợi (10h mới đến).'
      },
      {
        prompt: 'Phân biệt "有点儿" và "一点儿": Điền từ thích hợp vào câu: "这双鞋子_____大，我想换一双。"',
        options: ['有点儿 (yǒudiǎnr - hơi/hơi quá)', '一点儿 (yìdiǎnr)', '很多', '十分'],
        correct: 0,
        explain: '"有点儿" đứng trước tính từ, thường mang sắc thái không hài lòng, phàn nàn.'
      },
      {
        prompt: 'Điền từ vào câu: "请给我便宜_____吧。"',
        options: ['一点儿 (yìdiǎnr - một chút)', '有点儿', '太', '真'],
        correct: 0,
        explain: '"Tính từ + 一点儿" biểu thị mức độ nhẹ nhàng hoặc cầu khiến: 便宜一点儿 (rẻ một chút).'
      },
      {
        prompt: 'Chọn câu dùng phó từ "再" (lại trong tương lai) chính xác:',
        options: [
          '明天我们再去那家饭馆吃烤鸭。',
          '昨天他再去了。',
          '再见是他。',
          '我再吃了饭昨天。'
        ],
        correct: 0,
        explain: '"再" biểu thị hành động lặp lại chưa xảy ra (trong tương lai).'
      },
      {
        prompt: 'Điền cặp liên từ nguyên nhân - kết quả: "_____今天下雨，_____运动会推迟了。"',
        options: [
          '因为……所以…… (Bởi vì... nên...)',
          '虽然……但是……',
          '不仅……而且……',
          '一边……一边……'
        ],
        correct: 0,
        explain: '"因为...所以..." diễn tả quan hệ nguyên nhân - hệ quả logic.'
      },
      {
        prompt: 'Điền liên từ trong câu hỏi lựa chọn: "你喝咖啡_____喝牛奶？"',
        options: ['还是 (háishì - hay là)', '或者 (huòzhě - hoặc là trong câu trần thuật)', '和 (hé)', '跟 (gēn)'],
        correct: 0,
        explain: 'Trong câu nghi vấn hỏi chọn A hay B bắt buộc dùng "还是".'
      },
      {
        prompt: 'Điền bổ ngữ khả năng: "他说得太快了，我听_____。"',
        options: ['不懂 (bù dǒng - nghe không hiểu)', '不走', '不行', '不跑'],
        correct: 0,
        explain: '"听不懂" là bổ ngữ khả năng biểu thị không tiếp thu hiểu được lời nói.'
      },
      {
        prompt: 'Điền bổ ngữ kết quả: "饭做_____了，快来吃吧！"',
        options: ['好 (hǎo - xong xuôi tốt đẹp)', '看', '多', '少'],
        correct: 0,
        explain: 'Động từ + 好 biểu thị hành động hoàn tất chu đáo đạt yêu cầu: 做好了 (nấu xong rồi).'
      },
      {
        prompt: 'Chọn câu diễn tả sự thay đổi trạng thái với trợ từ "了":',
        options: [
          '春天来了，花儿都开了。',
          '春天是花。',
          '花开春天。',
          '了春天开花。'
        ],
        correct: 0,
        explain: 'Trợ từ ngữ khí "了" ở cuối câu biểu thị sự xuất hiện trạng thái/tình hình mới.'
      },
      {
        prompt: 'Điền giới từ chỉ đối tượng phục vụ/tiếp nhận: "这是我_____你买的新衣服。"',
        options: ['给 (gěi - cho/dành cho)', '在 (zài)', '比 (bǐ)', '被 (bèi)'],
        correct: 0,
        explain: 'Cấu trúc "给 + Tân ngữ + Động từ": 给 你 买 (mua cho bạn).'
      },
      {
        prompt: 'Điền lượng từ đo chiều dài con đường, dòng sông, sợi dây: "这_____路很宽。"',
        options: ['条 (tiáo)', '张 (zhāng)', '本 (běn)', '个 (gè)'],
        correct: 0,
        explain: 'Lượng từ dùng cho đồ vật dài, uốn lượn (đường sá, sông ngòi, quần váy) là "条" (tiáo).'
      },
      {
        prompt: 'Điền từ chỉ phương vị: "书在桌子的_____面。"',
        options: ['上 (shàng - trên)', '很 (hěn)', '都 (dōu)', '谁 (shéi)'],
        correct: 0,
        explain: '"上面" (shàngmiàn) là phía bên trên.'
      },
      {
        prompt: 'Chọn câu dùng phó từ "可能" (có thể / có lẽ) đúng vị trí:',
        options: [
          '明天可能会下雪。',
          '明天会下雪可能。',
          '可能明天会下雪。',
          '下雪可能会明天。'
        ],
        correct: 0,
        explain: '"可能" thường đứng trước vị ngữ biểu thị phán đoán suy đoán.'
      },
      {
        prompt: 'Điền động từ biểu thị việc cầm nắm di chuyển đồ đạc: "请帮我_____一下这个箱子。"',
        options: ['拿 (ná - cầm/xách)', '走 (zǒu)', '跑 (pǎo)', '飞 (fēi)'],
        correct: 0,
        explain: '"拿箱子" nghĩa là cầm/xách chiếc vali.'
      }
    ]
  },

  // =========================================================================
  // 4. 📝 KỸ NĂNG PINYIN & THANH ĐIỆU (20 CÂU)
  // =========================================================================
  {
    id: 'hsk2-prac-pinyin',
    skill: 'pinyin',
    skillLabel: '📝 Pinyin & Thanh Điệu',
    level: 'HSK 2',
    title: 'Luyện Âm Pinyin Nâng Cao & Cụm Từ HSK 2',
    desc: 'Phân biệt thanh nhẹ, âm uốn lưỡi "儿", nhóm thanh mẫu răng môi (f, h) và nhóm mặt lưỡi (j, q, x).',
    questionsCount: 20,
    questions: [
      {
        prompt: 'Từ "Rẻ" (便宜) có phiên âm chuẩn là:',
        options: ['piányi (Thanh 2 + Khinh thanh)', 'piányí', 'piànyi', 'piǎnyi'],
        correct: 0,
        explain: 'Chữ "宜" trong "便宜" đọc khinh thanh nhẹ nhàng: piányi.'
      },
      {
        prompt: 'Từ "Đắt" (贵) có phiên âm chuẩn là:',
        options: ['guì (Thanh 4)', 'guī', 'guí', 'guǐ'],
        correct: 0,
        explain: '"贵" phát âm thanh 4 dứt khoát: guì.'
      },
      {
        prompt: 'Từ "Xe đạp" (自行车) có phiên âm chuẩn là:',
        options: ['zìxíngchē', 'zìxìngchē', 'zhìxíngchē', 'zìxíngchè'],
        correct: 0,
        explain: '"自" thanh 4 (zì), "行" thanh 2 (xíng), "车" thanh 1 (chē).'
      },
      {
        prompt: 'Từ "Đồng hồ đeo tay" (手表) có phiên âm chuẩn là:',
        options: ['shǒubiǎo', 'shóubiǎo', 'shǒubiào', 'shōubiǎo'],
        correct: 0,
        explain: 'Cả 2 chữ đều gốc thanh 3: shǒubiǎo (khi đọc biến điệu thành shóubiǎo).'
      },
      {
        prompt: 'Từ "Tàu điện ngầm" (地铁) có phiên âm chuẩn là:',
        options: ['dìtiě', 'dītiě', 'dítiě', 'dìtiē'],
        correct: 0,
        explain: '"地" thanh 4 (dì), "铁" thanh 3 (tiě).'
      },
      {
        prompt: 'Từ "Bơi lội" (游泳) có phiên âm chuẩn là:',
        options: ['yóuyǒng', 'yōuyǒng', 'yóuyōng', 'yòuyǒng'],
        correct: 0,
        explain: '"游" mang thanh 2 (yóu), "泳" mang thanh 3 (yǒng).'
      },
      {
        prompt: 'Từ "Bóng rổ" (篮球) có phiên âm chuẩn là:',
        options: ['lánqiú', 'lǎnqiú', 'lànqiú', 'lānqiú'],
        correct: 0,
        explain: 'Cả 2 chữ đều mang thanh 2: lán-qiú.'
      },
      {
        prompt: 'Từ "Đá bóng" (踢足球) có phiên âm chuẩn là:',
        options: ['tī zúqiú', 'tí zúqiú', 'tī zhúqiú', 'tì zúqiú'],
        correct: 0,
        explain: '"踢" thanh 1 (tī), "足" thanh 2 (zú), "球" thanh 2 (qiú).'
      },
      {
        prompt: 'Từ "Trứng gà" (鸡蛋) có phiên âm chuẩn là:',
        options: ['jīdàn', 'jídàn', 'jǐdàn', 'jìdàn'],
        correct: 0,
        explain: '"鸡" thanh 1 (jī), "蛋" thanh 4 (dàn).'
      },
      {
        prompt: 'Từ "Dưa hấu" (西瓜) có phiên âm chuẩn là:',
        options: ['xīguā', 'xíguā', 'xǐguā', 'xìguā'],
        correct: 0,
        explain: 'Cả 2 chữ đều mang thanh 1 cao bằng: xīguā.'
      },
      {
        prompt: 'Từ "Thịt cừu" (羊肉) có phiên âm chuẩn là:',
        options: ['yángròu', 'yàngròu', 'yángrōu', 'yǎngròu'],
        correct: 0,
        explain: '"羊" thanh 2 (yáng), "肉" thanh 4 (ròu).'
      },
      {
        prompt: 'Từ "Mắt" (眼睛) có phiên âm chuẩn là:',
        options: ['yǎnjing (Thanh 3 + Khinh thanh)', 'yǎnjīng', 'yánjìng', 'yànjing'],
        correct: 0,
        explain: 'Chữ "睛" trong "眼睛" đọc thanh nhẹ: yǎnjing (chú ý phân biệt với kính mắt 眼镜 yǎnjìng).'
      },
      {
        prompt: 'Từ "Kính đeo mắt" (眼镜) có phiên âm chuẩn là:',
        options: ['yǎnjìng (Thanh 3 + Thanh 4)', 'yǎnjing', 'yánjīng', 'yànjǐng'],
        correct: 0,
        explain: '"镜" mang thanh 4: yǎnjìng.'
      },
      {
        prompt: 'Từ "Thời gian" (时间) có phiên âm chuẩn là:',
        options: ['shíjiān', 'shǐjiān', 'shìjiān', 'shījiān'],
        correct: 0,
        explain: '"时" thanh 2 (shí), "间" thanh 1 (jiān).'
      },
      {
        prompt: 'Từ "Sân bay" (机场) có phiên âm chuẩn là:',
        options: ['jīchǎng', 'jíchǎng', 'jǐchǎng', 'jìchǎng'],
        correct: 0,
        explain: '"机" thanh 1 (jī), "场" thanh 3 (chǎng).'
      },
      {
        prompt: 'Từ "Ga tàu hỏa" (火车站) có phiên âm chuẩn là:',
        options: ['huǒchēzhàn', 'huóchēzhàn', 'huǒchēzhān', 'huōchēzhàn'],
        correct: 0,
        explain: '"火" thanh 3 (huǒ), "车" thanh 1 (chē), "站" thanh 4 (zhàn).'
      },
      {
        prompt: 'Từ "Vui vẻ / Hạnh phúc" (快乐) có phiên âm chuẩn là:',
        options: ['kuàilè', 'kuāilè', 'kuáilè', 'kuǎilè'],
        correct: 0,
        explain: 'Cả 2 chữ đều mang thanh 4 dứt khoát: kuàilè.'
      },
      {
        prompt: 'Từ "Bắt đầu" (开始) có phiên âm chuẩn là:',
        options: ['kāishǐ', 'kǎishǐ', 'kàishǐ', 'kāishī'],
        correct: 0,
        explain: '"开" thanh 1 (kāi), "始" thanh 3 (shǐ).'
      },
      {
        prompt: 'Từ "Giúp đỡ" (帮助) có phiên âm chuẩn là:',
        options: ['bāngzhù', 'bángzhù', 'bǎngzhù', 'bàngzhù'],
        correct: 0,
        explain: '"帮" thanh 1 (bāng), "助" thanh 4 (zhù).'
      },
      {
        prompt: 'Từ "Giới thiệu" (介绍) có phiên âm chuẩn là:',
        options: ['jièshào', 'jiēshào', 'jiéshào', 'jiěshào'],
        correct: 0,
        explain: 'Cả 2 chữ đều mang thanh 4: jièshào.'
      }
    ]
  },

  // =========================================================================
  // 5. ✍️ KỸ NĂNG CHỮ HÁN & TỪ VỰNG (20 CÂU)
  // =========================================================================
  {
    id: 'hsk2-prac-hanzi',
    skill: 'hanzi',
    skillLabel: '✍️ Chữ Hán & Từ Vựng',
    level: 'HSK 2',
    title: 'Chữ Hán & Cụm Từ Cốt Lõi HSK 2',
    desc: 'Phân biệt mặt chữ Hán tương tự (买/卖, 问/间, 白/百), bộ Thủ (扌bộ thủ tay, 辶 bộ quai xước, 忄bộ tâm đứng).',
    questionsCount: 20,
    questions: [
      {
        prompt: 'Phân biệt cặp chữ: Chữ "买" (mǎi) có nghĩa là gì, và khác gì chữ "卖" (mài)?',
        options: ['买 là "Mua" (không có dấu thập trên đầu), 卖 là "Bán"', '买 là "Bán", 卖 là "Mua"', 'Cả hai đều có nghĩa là Mua', 'Cả hai đều là Bán'],
        correct: 0,
        explain: 'Mẹo nhớ: "Bán" thêm đầu (卖 - mài), "Mua" không đầu (买 - mǎi).'
      },
      {
        prompt: 'Chữ "打" (đánh), "找" (tìm), "提" (nhấc) đều chứa bộ thủ nào?',
        options: ['Bộ Tay gảy / Tài gảy (扌- thủ)', 'Bộ Chân (⻊)', 'Bộ Nước (氵)', 'Bộ Lửa (灬)'],
        correct: 0,
        explain: 'Bộ Tài gảy (扌) liên quan mật thiết đến các động tác của bàn tay.'
      },
      {
        prompt: 'Chữ "进" (vào), "远" (xa), "近" (gần), "运" (vận chuyển) đều chứa bộ thủ nào?',
        options: ['Bộ Quai xước (辶 - sước/chỉ di chuyển bước đi)', 'Bộ Môn (门)', 'Bộ Mộc (木)', 'Bộ Thổ (土)'],
        correct: 0,
        explain: 'Bộ Quai xước (辶) gắn liền với hành vi đi lại, di chuyển, khoảng cách.'
      },
      {
        prompt: 'Chữ "快" (nhanh), "慢" (chậm), "情" (tình cảm) đều chứa bộ thủ nào?',
        options: ['Bộ Tâm đứng (忄- trạng thái tâm lý)', 'Bộ Thủy (氵)', 'Bộ Khẩu (口)', 'Bộ Nhân (亻)'],
        correct: 0,
        explain: 'Bộ Tâm đứng (忄) biểu thị trạng thái cảm xúc, tâm lý hoặc suy nghĩ.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Màu trắng" (bái):',
        options: ['白 (bái - trắng)', '百 (bǎi - trăm)', '日 (rì - nhật)', '目 (mù - mắt)'],
        correct: 0,
        explain: 'Chữ "白" là màu trắng, thêm nét ngang bên trong thành chữ "百" (100).'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Số một trăm" (bǎi):',
        options: ['百', '白', '自', '目'],
        correct: 0,
        explain: '"百" (bǎi) là số 100.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Rẻ" (piányi):',
        options: ['便宜', '贵', '真', '好'],
        correct: 0,
        explain: '"便宜" (piányi) nghĩa là rẻ tiền.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Đắt đỏ" (guì):',
        options: ['贵', '便宜', '买', '卖'],
        correct: 0,
        explain: '"贵" (guì) nghĩa là đắt, quý giá.'
      },
      {
        prompt: 'Chữ "问" (hỏi) chứa chữ "口" (miệng) bên trong chữ "门" (cửa). Đây là chữ gì?',
        options: ['问 (wèn - hỏi)', '间 (jiān - gian phòng)', '闪 (shǎn)', '闭 (bì)'],
        correct: 0,
        explain: 'Miệng (口) đứng ở cửa (门) hỏi thăm là chữ "问" (wèn).'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Đồng hồ đeo tay" (shǒubiǎo):',
        options: ['手表', '手机', '手套', '手绢'],
        correct: 0,
        explain: '"手表" là đồng hồ đeo tay (thủ biểu).'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Cửa hàng" (shāngdiàn):',
        options: ['商店', '饭店', '酒店', '书店'],
        correct: 0,
        explain: '"商店" (shāngdiàn) là cửa hàng buôn bán.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Phòng học / Lớp học" (jiàoshì):',
        options: ['教室', '教师', '教学', '教材'],
        correct: 0,
        explain: '"教室" (jiàoshì) là phòng học.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Bệnh viện" (yīyuàn):',
        options: ['医院', '学院', '法院', '剧院'],
        correct: 0,
        explain: '"医院" (yīyuàn) là bệnh viện khám chữa bệnh.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Sân bay" (jīchǎng):',
        options: ['机场', '操场', '商场', '广场'],
        correct: 0,
        explain: '"机场" (jīchǎng) là phi trường/sân bay.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Màu sắc" (yánsè):',
        options: ['颜色', '红色', '黄色', '蓝色'],
        correct: 0,
        explain: '"颜色" (yánsè) nghĩa là màu sắc.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Bơi lội" (yóuyǒng):',
        options: ['游泳', '游戏', '跑步', '跳高'],
        correct: 0,
        explain: '"游泳" (yóuyǒng) là môn bơi lội, cả 2 chữ đều có bộ Ba chấm Thủy (氵).'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Nhảy múa" (tiàowǔ):',
        options: ['跳舞', '唱歌', '画画', '下棋'],
        correct: 0,
        explain: '"跳舞" (tiàowǔ) là khiêu vũ/nhảy múa.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Ca hát" (chànggē):',
        options: ['唱歌', '跳舞', '说话', '听歌'],
        correct: 0,
        explain: '"唱歌" (chànggē) nghĩa là ca hát.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Bắt đầu" (kāishǐ):',
        options: ['开始', '结束', '完成', '准备'],
        correct: 0,
        explain: '"开始" (kāishǐ) nghĩa là bắt đầu khởi sự.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Chuẩn bị" (zhǔnbèi):',
        options: ['准备', '开始', '打算', '决定'],
        correct: 0,
        explain: '"准备" (zhǔnbèi) nghĩa là chuẩn bị chu đáo.'
      }
    ]
  }
];
