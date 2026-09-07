// src/data/practice/hsk3_practice.js
// 100 câu hỏi Luyện tập tự do HSK 3 (20 câu Nghe, 20 câu Đọc, 20 câu Ngữ pháp, 20 câu Pinyin, 20 câu Chữ Hán)

export const hsk3PracticeTopics = [
  // =========================================================================
  // 1. 🎧 KỸ NĂNG NGHE HIỂU (20 CÂU)
  // =========================================================================
  {
    id: 'hsk3-prac-listening',
    skill: 'listening',
    skillLabel: '🎧 Luyện Nghe',
    level: 'HSK 3',
    title: 'Luyện Nghe HSK 3: Công Sở, Du Lịch & Đời Sống Xã Hội',
    desc: 'Luyện nghe các ngữ cảnh công việc, phỏng vấn, kế hoạch du lịch, trao đổi bưu phẩm, thương lượng và cảm xúc.',
    questionsCount: 20,
    questions: [
      {
        prompt: 'Lắng nghe thông báo tàu hỏa: "由北京南站开往上海虹桥的G1次列车现在开始检票了。" Chuyến tàu nào bắt đầu soát vé?',
        audio: '由北京南站开往上海虹桥的G1次列车现在开始检票了。',
        pinyin: 'Yóu Běijīng Nánzhàn kāi wǎng Shànghǎi Hóngqiáo de G1 cì lièchē xiànzài kāishǐ jiǎnpiào le.',
        options: ['Tàu G1 từ Bắc Kinh đi Thượng Hải', 'Tàu K12 từ Thượng Hải về Bắc Kinh', 'Tàu D305 đi Quảng Châu', 'Tàu điện ngầm số 1'],
        correct: 0,
        explain: '"G1次列车" là chuyến tàu cao tốc G1.'
      },
      {
        prompt: 'Lắng nghe cuộc gọi bưu điện: "请问顺丰特快寄到广州大概需要几天？- 明天下午就能送到。" Kiện hàng đến nơi khi nào?',
        audio: '请问顺丰特快寄到广州大概需要几天？明天下午就能送到。',
        pinyin: 'Qǐngwèn Shùnfēng tèkuài jì dào Guǎngzhōu dàgài xūyào jǐ tiān? Míngtiān xiàwǔ jiù néng sòng dào.',
        options: ['Chiều mai là giao tới nơi', 'Sáng mai', '3 ngày nữa', 'Tuần sau'],
        correct: 0,
        explain: '"明天下午就能送到" nghĩa là chiều mai đã có thể giao tới nơi.'
      },
      {
        prompt: 'Lắng nghe kế hoạch du lịch: "丽江的风景美如画，我们打算国庆假期去住上一个星期。" Họ dự định đi đâu?',
        audio: '丽江的风景美如画，我们打算国庆假期去住上一个星期。',
        pinyin: 'Lìjiāng de fēngjǐng měi rú huà, wǒmen dǎsuan Guóqìng jiàqī qù zhù shang yí gè xīngqī.',
        options: ['Lệ Giang (丽江)', 'Đại Lý', 'Côn Minh', 'Tây Song Bản Nạp'],
        correct: 0,
        explain: '"丽江" (Lìjiāng) là địa danh Lệ Giang nổi tiếng của tỉnh Vân Nam.'
      },
      {
        prompt: 'Lắng nghe phỏng vấn: "明天上午九点有家外企面试，我得提前半小时到。" Ứng viên cần có mặt lúc mấy giờ?',
        audio: '明天上午九点有家外企面试，我得提前半小时到。',
        pinyin: 'Míngtiān shàngwǔ jiǔ diǎn yǒu jiā wàiqǐ miànshì, wǒ děi tíqián bàn xiǎoshí dào.',
        options: ['8:30 sáng', '9:00 sáng', '9:30 sáng', '8:00 sáng'],
        correct: 0,
        explain: 'Phỏng vấn lúc 9h, đến trước nửa tiếng tức là 8:30 (八点半).'
      },
      {
        prompt: 'Lắng nghe phòng ở: "这套两居室采光特别好，而且离地铁站步行只要五分钟。" Căn nhà có ưu thế gì?',
        audio: '这套两居室采光特别好，而且离地铁站步行只要五分钟。',
        pinyin: 'Zhè tào liǎngjūshì cǎiguāng tèbié hǎo, érqiě lí dìtiězhàn bùxíng zhǐ yào wǔ fēnzhōng.',
        options: ['Đón ánh sáng tốt và cách ga tàu điện chỉ 5 phút đi bộ', 'Giá thuê cực rẻ', 'Có thang máy riêng', 'Rất xa trung tâm'],
        correct: 0,
        explain: '"采光好" (ánh sáng tốt), "离地铁站步行只要五分钟" (cách ga 5 phút đi bộ).'
      },
      {
        prompt: 'Lắng nghe ăn uống: "师傅，这道水煮牛肉请千万少放麻椒和辣椒，我嗓子发炎了。" Vì sao khách yêu cầu ít cay?',
        audio: '师傅，这道水煮牛肉请千万少放麻椒和辣椒，我嗓子发炎了。',
        pinyin: 'Shīfu, zhè dào shuǐzhǔ niúròu qǐng qiānwàn shǎo fàng májiāo hé làjiāo, wǒ sǎngzi fāyán le.',
        options: ['Vì cổ họng đang bị viêm (嗓子发炎)', 'Vì bị đau dạ dày', 'Vì đang ăn kiêng', 'Vì không có tiền'],
        correct: 0,
        explain: '"嗓子发炎" là cổ họng bị viêm đau.'
      },
      {
        prompt: 'Lắng nghe mua sắm: "这条纯羊毛围巾手感真细腻，冬天戴一定特别温暖。" Món đồ được nhắc đến là gì?',
        audio: '这条纯羊毛围巾手感真细腻，冬天戴一定特别温暖。',
        pinyin: 'Zhè tiáo chún yángmáo wéijīn shǒugǎn zhēn xìnì, dōngtiān dài yídìng tèbié wēnnuǎn.',
        options: ['Khăn quàng cổ len nguyên chất (羊毛围巾)', 'Áo phao lông vũ', 'Găng tay da', 'Mũ len trùm tai'],
        correct: 0,
        explain: '"围巾" (wéijīn) là khăn quàng cổ.'
      },
      {
        prompt: 'Lắng nghe thể thao: "我办了健身房的年卡，每周二和周四晚上都去练瑜伽。" Người nói luyện môn gì vào tối thứ 3 và thứ 5?',
        audio: '我办了健身房的年卡，每周二和周四晚上都去练瑜伽。',
        pinyin: 'Wǒ bàn le jiànshēnfáng de niánkǎ, měi zhōu\'èr hé zhōusì wǎnshang dōu qù liàn yújiā.',
        options: ['Tập Yoga (练瑜伽)', 'Tập gym đẩy tạ', 'Tập bơi', 'Tập quyền anh'],
        correct: 0,
        explain: '"练瑜伽" (liàn yújiā) là luyện tập yoga.'
      },
      {
        prompt: 'Lắng nghe thời tiết hoãn bay: "由于首都机场突降大雾，部分航班可能会延误起飞。" Vì sao chuyến bay bị hoãn?',
        audio: '由于首都机场突降大雾，部分航班可能会延误起飞。',
        pinyin: 'Yóuyú Shǒudū jīchǎng tū jiàng dàwù, bùfen hángbān kěnéng huì yánwù qǐfēi.',
        options: ['Do sân bay có sương mù dày đặc (大雾)', 'Do bão tuyết', 'Do mất điện đường băng', 'Do máy bay hết nhiên liệu'],
        correct: 0,
        explain: '"大雾" (dàwù) là sương mù dày đặc.'
      },
      {
        prompt: 'Lắng nghe ngân hàng: "先生，您的手机银行已经开通了，请妥善保管好动态密码。" Nhân viên dặn dò điều gì?',
        audio: '先生，您的手机银行已经开通了，请妥善保管好动态密码。',
        pinyin: 'Xiānsheng, nín de shǒujī yínháng yǐjīng kāitōng le, qǐng tuǒshàn bǎoguǎn hǎo dòngtài mìmǎ.',
        options: ['Bảo quản cẩn thận mật khẩu mã OTP (密码)', 'Không được rút tiền', 'Thay điện thoại mới', 'Nộp thêm tiền phí'],
        correct: 0,
        explain: '"妥善保管好动态密码" là bảo quản mật khẩu cẩn thận.'
      },
      {
        prompt: 'Lắng nghe lời chúc tiệc cưới: "祝二位新人百年好合，白头偕老，早生贵子！" Đây là lời chúc trong dịp nào?',
        audio: '祝二位新人百年好合，白头偕老，早生贵子！',
        pinyin: 'Zhù èr wèi xīnrén bǎinián hǎohé, báitóu xiélǎo, zǎoshēng guìzǐ!',
        options: ['Lễ thành hôn / Đám cưới', 'Tiệc thôi nôi', 'Lễ mừng thọ', 'Khai trương công ty'],
        correct: 0,
        explain: '"百年好合，白头偕老" là lời chúc bách niên giai lão trong đám cưới.'
      },
      {
        prompt: 'Lắng nghe đổi trả đồ: "这双皮鞋的尺码有点儿小，磨脚，能给我换双四十二码的吗？" Người nói muốn đổi sang cỡ giày bao nhiêu?',
        audio: '这双皮鞋的尺码有点儿小，磨脚，能给我换双四十二码的吗？',
        pinyin: 'néng gěi wǒ huàn shuāng sìshí\'èr mǎ de ma?',
        options: ['Cỡ 40', 'Cỡ 41', 'Cỡ 42 (四十二码)', 'Cỡ 43'],
        correct: 2,
        explain: '"四十二码" (sìshí\'èr mǎ) là size 42.'
      },
      {
        prompt: 'Lắng nghe thói quen tốt: "坚持睡前半小时阅读经典著作，能让心灵得到沉淀。" Thói quen được nhắc đến là gì?',
        audio: '坚持睡前半小时阅读经典著作，能让心灵得到沉淀。',
        pinyin: 'Jiānchí shuì qián bàn xiǎoshí yuèdú jīngdiǎn zhùzuò, néng ràng xīnlíng dédào chéndiàn.',
        options: ['Đọc sách nửa tiếng trước khi đi ngủ', 'Nghe nhạc sôi động', 'Xem phim hành động', 'Ăn đêm no nê'],
        correct: 0,
        explain: '"睡前半小时阅读" là đọc sách nửa tiếng trước giờ ngủ.'
      },
      {
        prompt: 'Lắng nghe sửa xe: "师傅，我的车左后轮刚才被钉子扎了，漏气严重。" Xe gặp sự cố gì?',
        audio: '师傅，我的车左后轮刚才被钉子扎了，漏气严重。',
        pinyin: 'wǒ de chē zuǒhòulún gāngcái bèi dīngzi zhā le, lòu qì yánzhòng.',
        options: ['Lốp sau bên trái bị đinh đâm thủng xì hơi', 'Động cơ chết máy', 'Vỡ kính chắn gió', 'Hỏng đèn xe'],
        correct: 0,
        explain: '"被钉子扎了，漏气" là bị đinh đâm thủng lốp thoát hơi.'
      },
      {
        prompt: 'Lắng nghe mua quà: "爷爷平时喜欢喝茶，送他这套宜兴紫砂壶最合适不过了。" Món quà cho ông nội là gì?',
        audio: '爷爷平时喜欢喝茶，送他这套宜兴紫砂壶最合适不过了。',
        pinyin: 'sòng tā zhè tào Yíxīng zǐshāhú zuì héshì búguò le.',
        options: ['Bộ ấm trà tử sa Nghi Hưng (紫砂壶)', 'Thùng rượu quý', 'Cây cảnh bonsai', 'Hộp nhân sâm'],
        correct: 0,
        explain: '"紫砂壶" là ấm trà tử sa đất sét nung danh tiếng.'
      },
      {
        prompt: 'Lắng nghe bệnh viện: "医生，拍胸片的化验单什么时候能出来？- 半小时后凭条码在一楼自助机打印。" Lấy kết quả ở đâu sau 30 phút?',
        audio: '医生，拍胸片的化验单什么时候能出来？半小时后凭条码在一楼自助机打印。',
        pinyin: 'Bàn xiǎoshí hòu píng tiáomǎ zài yī lóu zìzhùjī dǎyìn.',
        options: ['Máy tự động tầng 1 bằng mã vạch', 'Quầy thuốc tầng 2', 'Bàn bác sĩ khám', 'Gửi về tận nhà'],
        correct: 0,
        explain: '"一楼自助机打印" là in tại máy tự phục vụ ở tầng 1.'
      },
      {
        prompt: 'Lắng nghe ẩm thực Tứ Xuyên: "麻婆豆腐和宫保鸡丁是川菜中最具代表性的经典名菜。" Hai món ăn này thuộc trường phái ẩm thực nào?',
        audio: '麻婆豆腐和宫保鸡丁是川菜中最具代表性的经典名菜。',
        pinyin: 'Mápó dòufu hé Gōngbǎo jīdīng shì Chuāncài zhōng zuì jù dàibiǎoxìng de jīngdiǎn míngcài.',
        options: ['Món ăn Tứ Xuyên (川菜)', 'Món ăn Quảng Đông', 'Món ăn Sơn Đông', 'Món ăn Giang Tô'],
        correct: 0,
        explain: '"川菜" (Chuāncài) là ẩm thực Tứ Xuyên trứ danh.'
      },
      {
        prompt: 'Lắng nghe công việc: "这个季度的销售额比去年同期增长了百分之二十。" Doanh số bán hàng tăng bao nhiêu %?',
        audio: '这个季度的销售额比去年同期增长了百分之二十。',
        pinyin: 'zēngzhǎng le bǎifēnzhī èrshí.',
        options: ['10%', '15%', '20% (百分之二十)', '25%'],
        correct: 2,
        explain: '"百分之二十" (bǎifēnzhī èrshí) là 20%.'
      },
      {
        prompt: 'Lắng nghe sở thích: "小王业余时间最大的爱好就是去户外摄影，记录大自然的美丽瞬间。" Sở thích ngoài giờ của Tiểu Vương là gì?',
        audio: '小王业余时间最大的爱好就是去户外摄影，记录大自然的美丽瞬间。',
        pinyin: 'qù hùwài shèyǐng, jìlù dàzìrán de měilì shùnjiān.',
        options: ['Nhiếp ảnh dã ngoại (户外摄影)', 'Chơi game online', 'Đọc truyện tranh', 'Sưu tầm tem'],
        correct: 0,
        explain: '"户外摄影" (hùwài shèyǐng) là chụp ảnh dã ngoại ngoài trời.'
      },
      {
        prompt: 'Lắng nghe hẹn hò: "周末我们在大剧院门口集合，看完歌剧一起吃夜宵。" Họ dự định xem gì trước khi ăn đêm?',
        audio: '周末我们在大剧院门口集合，看完歌剧一起吃夜宵。',
        pinyin: 'kànwán gējù yìqǐ chī yèxiāo.',
        options: ['Vở nhạc kịch / Opera (歌剧)', 'Xem phim bom tấn', 'Xem xiếc thú', 'Xem bóng đá'],
        correct: 0,
        explain: '"歌剧" (gējù) là vở ca kịch opera.'
      }
    ]
  },

  // =========================================================================
  // 2. 📖 KỸ NĂNG ĐỌC HIỂU (20 CÂU)
  // =========================================================================
  {
    id: 'hsk3-prac-reading',
    skill: 'reading',
    skillLabel: '📖 Đọc Hiểu',
    level: 'HSK 3',
    title: 'Đọc Hiểu Đoạn Văn Phong Phú HSK 3',
    desc: 'Đọc hiểu đoạn văn dài về văn hóa, thành ngữ, bảo vệ môi trường, công nghệ và phát triển bản thân.',
    questionsCount: 20,
    questions: [
      {
        prompt: 'Đoạn văn: "俗话说：‘百闻不如一见’。听别人把桂林的山水描述得再好，也不如自己亲自坐船游一次漓江来得震撼。" ★ Ý nghĩa cốt lõi của câu thành ngữ là:',
        options: ['Trăm nghe không bằng một lần thấy tận mắt', 'Không nên tin lời đồn đại', 'Cần chăm chỉ nghe giảng', 'Nên ở nhà xem tivi'],
        correct: 0,
        explain: '"百闻不如一见" là thành ngữ: Trăm nghe không bằng mắt thấy.'
      },
      {
        prompt: 'Đoạn văn: "城市绿化不仅能净化被汽车尾气污染的空气，还能有效降低城市的噪声污染，为市民提供舒适的生活环境。" Cây xanh đô thị có tác dụng gì?',
        options: ['Lọc sạch không khí và giảm tiếng ồn', 'Tăng mật độ giao thông', 'Tạo thêm nhà cửa', 'Tăng nhiệt độ đô thị'],
        correct: 0,
        explain: '"净化空气" (lọc sạch không khí), "降低噪声" (giảm tiếng ồn).'
      },
      {
        prompt: 'Đoạn văn: "失败并不可怕，可怕的是丧失了重新开始的勇气。只要善于总结经验教训，每一次挫折都是通往成功的阶梯。" Tác giả muốn truyền tải thông điệp gì?',
        options: ['Dũng cảm đối mặt thất bại và biết đúc kết kinh nghiệm', 'Tránh làm việc khó', 'Bỏ cuộc ngay khi gặp khó', 'Đổ lỗi cho hoàn cảnh'],
        correct: 0,
        explain: 'Động viên con người dũng cảm kiên cường đứng lên từ vấp ngã.'
      },
      {
        prompt: 'Đoạn văn: "大熊猫是中国特有的珍稀动物，以竹子为主食。它们温和憨厚的模样深受世界各国人民的喜爱。" Thức ăn chủ yếu của gấu trúc là gì?',
        options: ['Cây trúc, tre (竹子)', 'Thịt động vật', 'Trái cây chín', 'Cơm trắng'],
        correct: 0,
        explain: '"以竹子为主食" là lấy cây trúc/tre làm thức ăn chính.'
      },
      {
        prompt: 'Đoạn văn: "智能手机的普及极大地便利了人们的生活，移动支付、网上购物和在线学习让大家足不出户就能办好很多事情。" Công nghệ mang lại điều gì?',
        options: ['Giúp con người không cần ra khỏi nhà vẫn hoàn thành nhiều việc tiện lợi', 'Làm con người bận rộn hơn', 'Lãng phí thời gian', 'Làm gián đoạn giao tiếp'],
        correct: 0,
        explain: '"足不出户就能办好很多事情" không cần bước chân ra cửa vẫn làm được nhiều việc.'
      },
      {
        prompt: 'Đoạn văn: "喝茶是中国人自古以来的传统习惯。客来敬茶不仅是一种礼貌，更体现了主人对客人的尊重与热情。" Ý nghĩa của việc mời trà khách là gì?',
        options: ['Thể hiện sự lễ phép, tôn trọng và lòng hiếu khách', 'Bắt buộc khách phải uống', 'Quảng cáo loại trà ngon', 'Tiết kiệm chi phí'],
        correct: 0,
        explain: '"体现了尊重与热情" thể hiện sự tôn trọng và nhiệt tình hiếu khách.'
      },
      {
        prompt: 'Đoạn văn: "随着年龄的增长，保持充足的睡眠和均衡的营养摄入，对于预防各种心血管疾病具有关键作用。" Hai yếu tố then chốt cho sức khỏe là gì?',
        options: ['Ngủ đủ giấc và dinh dưỡng cân bằng', 'Uống nhiều cà phê', 'Tập luyện quá sức', 'Bỏ bữa ăn sáng'],
        correct: 0,
        explain: '"充足的睡眠和均衡的营养" là giấc ngủ đầy đủ và dinh dưỡng cân bằng.'
      },
      {
        prompt: 'Đoạn văn: "在团队合作中，良好的沟通能力往往比个人的业务能力更加重要。只有心往一处想，劲往一处使，才能高效完成目标。" Yếu tố quan trọng nhất trong nhóm là gì?',
        options: ['Kỹ năng giao tiếp và tinh thần phối hợp gắn kết', 'Làm việc độc lập đơn lẻ', 'Cạnh tranh gắt gao giữa các thành viên', 'Người lãnh đạo quyết định tất cả'],
        correct: 0,
        explain: '"良好的沟通能力" (kỹ năng giao tiếp tốt) là nền tảng của làm việc nhóm.'
      },
      {
        prompt: 'Đoạn văn: "杭州西湖四季景色各异，春柳、夏荷、秋月、冬雪，素有‘人间天堂’之美誉。" Tây Hồ được ca ngợi bằng danh xưng gì?',
        options: ['Thiên đường nơi hạ giới (人间天堂)', 'Thành phố ánh sáng', 'Xứ sở ngàn hoa', 'Thành phố băng tuyết'],
        correct: 0,
        explain: '"人间天堂" (Rénjiān tiāntáng) nghĩa là thiên đường nơi trần gian.'
      },
      {
        prompt: 'Đoạn văn: "诚信是做人的基本准则。一诺千金的人才能在社会上立足并赢得长久的信赖。" Đoạn văn nhấn mạnh phẩm chất nào?',
        options: ['Chữ Tín và giữ đúng lời hứa (诚信)', 'Sự nhanh trí mưu mẹo', 'Sự giàu có về vật chất', 'Khả năng hùng biện'],
        correct: 0,
        explain: '"诚信" (thành tín) là giữ chữ tín và lời hứa.'
      },
      {
        prompt: 'Đoạn văn: "很多初学者觉得汉字难记，其实只要掌握了常用部首和形声字的构字规律，识字就会变得轻松有趣。" Bí quyết nhớ chữ Hán là gì?',
        options: ['Nắm chắc quy luật cấu tạo chữ hình thanh và bộ thủ thường gặp', 'Chép phạt mỗi chữ 100 lần', 'Chỉ học Pinyin không học chữ', 'Chỉ nhìn qua không cần nhớ'],
        correct: 0,
        explain: '"掌握了常用部首和形声字的构字规律" nắm vững quy luật cấu tạo chữ.'
      },
      {
        prompt: 'Đoạn văn: "图书馆是知识的海洋。在馆内阅览书籍时，切勿高声喧哗并请将手机调至静音模式。" Quy định thư viện yêu cầu điều gì?',
        options: ['Không làm ồn và chuyển điện thoại sang chế độ rung/yên lặng', 'Được thoải mái ăn uống', 'Mang thú cưng vào', 'Nói chuyện điện thoại to tiếng'],
        correct: 0,
        explain: '"切勿高声喧哗，手机调至静音" là giữ yên lặng và tắt chuông.'
      },
      {
        prompt: 'Đoạn văn: "水是生命之源。日常生活中随手关紧水龙头、一水多用，都是节约水资源的良好习惯。" Hành động nào thể hiện tiết kiệm nước?',
        options: ['Khóa chặt vòi nước và tái sử dụng nước nhiều lần', 'Mở vòi nước chảy tự do', 'Tắm bồn thật nhiều nước', 'Dùng nước sạch tưới đường thường xuyên'],
        correct: 0,
        explain: '"随手关紧水龙头、一水多用" là khóa chặt vòi nước và tái sử dụng nước.'
      },
      {
        prompt: 'Đoạn văn: "端午节吃粽子、赛龙舟是为了纪念古代爱国诗人屈原，这是中华民族悠久的传统民俗。" Tết Đoan Ngọ tưởng nhớ ai?',
        options: ['Nhà thơ yêu nước Khuất Nguyên (屈原)', 'Lý Bạch', 'Đỗ Phủ', 'Khổng Tử'],
        correct: 0,
        explain: 'Tết Đoan Ngọ gắn liền với truyền thuyết tưởng nhớ thi nhân Khuất Nguyên (屈原).'
      },
      {
        prompt: 'Đoạn văn: "经常吃油炸食品不仅容易导致身体发胖，还会增加患各种心脑血管疾病的风险。" Tác hại của đồ chiên rán là gì?',
        options: ['Dễ gây tăng cân béo phì và hại tim mạch', 'Giúp bổ sung nhiều vitamin', 'Làm da dẻ mịn màng', 'Tăng cường sức đề kháng'],
        correct: 0,
        explain: 'Gây béo phì và tăng nguy cơ bệnh tim mạch ("发胖，增加疾病风险").'
      },
      {
        prompt: 'Đoạn văn: "故宫又称紫禁城，是中国明清两代的皇家宫殿，也是世界上现存规模最大、保存最为完整的木质结构古建筑群之一。" Cố Cung có tên gọi khác là gì?',
        options: ['Tử Cấm Thành (紫禁城)', 'Di Hòa Viên', 'Viên Minh Viên', 'Thiên Đàn'],
        correct: 0,
        explain: '"故宫又称紫禁城" (Cố Cung còn gọi là Tử Cấm Thành).'
      },
      {
        prompt: 'Đoạn văn: "面对压力时，找朋友倾诉或者跑跑步听听轻音乐，都是非常健康的解压方式。" Phương pháp xả stress lành mạnh là gì?',
        options: ['Tâm sự với bạn bè, chạy bộ hoặc nghe nhạc nhẹ', 'Nhịn ăn bỏ bữa', 'Uống nhiều rượu bia', 'Tự cô lập bản thân'],
        correct: 0,
        explain: 'Chia sẻ tâm sự, vận động hoặc nghe nhạc thư thái giải tỏa áp lực.'
      },
      {
        prompt: 'Đoạn văn: "学而时习之，不亦说乎？这句名言告诫我们，学习过的知识要经常温习实践，才能真正领会其精髓。" Lời dạy nhấn mạnh điều gì?',
        options: ['Kiến thức đã học cần thường xuyên ôn tập và thực hành', 'Học xong là cất sách đi', 'Chỉ cần học thuộc vẹt trước kỳ thi', 'Không cần làm bài tập'],
        correct: 0,
        explain: 'Học đi đôi với ôn tập thường xuyên để nắm vững tri thức.'
      },
      {
        prompt: 'Đoạn văn: "垃圾分类能够实现资源的回收再利用，减少环境污染，是一项功在当代、利在千秋的环保举措。" Lợi ích của phân loại rác là gì?',
        options: ['Tái chế tài nguyên và giảm thiểu ô nhiễm môi trường', 'Làm tăng rác thải', 'Tốn kém chi phí', 'Làm đường phố bẩn hơn'],
        correct: 0,
        explain: 'Tái sử dụng tài nguyên và bảo vệ môi trường trong sạch ("回收再利用，减少环境污染").'
      },
      {
        prompt: 'Đoạn văn: "人无远虑，必有近忧。无论在求学阶段还是步入职场，凡事预则立，提前做好长远规划才能有备无患。" Đoạn văn khuyên chúng ta nên:',
        options: ['Chủ động lập kế hoạch và có tầm nhìn dài hạn', 'Đến đâu hay đến đó', 'Chỉ nghĩ đến ngày mai', 'Không cần lo lắng tương lai'],
        correct: 0,
        explain: 'Lo xa thì không phải lo gần, chủ động lên kế hoạch dài hạn.'
      }
    ]
  },

  // =========================================================================
  // 3. 🧩 KỸ NĂNG NGỮ PHÁP (20 CÂU)
  // =========================================================================
  {
    id: 'hsk3-prac-grammar',
    skill: 'grammar',
    skillLabel: '🧩 Ngữ Pháp',
    level: 'HSK 3',
    title: 'Ngữ Pháp Nòng Cốt HSK 3: Câu Chữ 把, Chữ 被 & Bổ Ngữ Xu Hướng',
    desc: 'Luyện câu chữ 把, câu bị động chữ 被, bổ ngữ xu hướng phức hợp (起来, 下去, 出来), bổ ngữ trạng thái 得 và liên từ cao cấp.',
    questionsCount: 20,
    questions: [
      {
        prompt: 'Chọn câu chữ "把" (bǎ) có cấu trúc chuẩn xác nhất:',
        options: [
          '请把空调关上。',
          '请把关上空调。',
          '空调把请关上。',
          '关上空调请把。'
        ],
        correct: 0,
        explain: 'Cấu trúc câu chữ 把: S + 把 + O (đối tượng chịu tác động) + V + Bổ ngữ kết quả/xu hướng ("把空调关上").'
      },
      {
        prompt: 'Chọn câu bị động chữ "被" (bèi) chuẩn xác:',
        options: [
          '桌子上的蛋糕被弟弟吃了。',
          '弟弟被蛋糕吃了。',
          '蛋糕吃了被弟弟。',
          '被弟弟吃了蛋糕。'
        ],
        correct: 0,
        explain: 'Cấu trúc câu bị động: Chủ thể bị tác động (蛋糕) + 被 + Chủ thể gây ra (弟弟) + V + 了 (吃了).'
      },
      {
        prompt: 'Điền bổ ngữ xu hướng biểu thị hành động bắt đầu và tiếp tục: "大家听了他的笑话，都大声笑_____了。"',
        options: ['起来 (qǐlái - lên/rộ lên)', '下去 (xiàqù)', '出来 (chūlái)', '过去 (guòqù)'],
        correct: 0,
        explain: 'V + 起来 biểu thị hành động bắt đầu phát sinh và tiếp diễn: 笑起来 (cười rộ lên).'
      },
      {
        prompt: 'Điền bổ ngữ xu hướng biểu thị hành động tiếp diễn không ngừng: "只要坚持_____，胜利一定属于我们！"',
        options: ['下去 (xiàqù - tiếp tục)', '起来 (qǐlái)', '回来 (huílái)', '进去 (jìnqù)'],
        correct: 0,
        explain: 'V + 下去 biểu thị hành động đang tiến hành sẽ tiếp tục duy trì tới tương lai: 坚持下去 (kiên trì tiếp tục).'
      },
      {
        prompt: 'Điền bổ ngữ xu hướng biểu thị từ không thấy/không biết trở nên rõ ràng: "我想_____一个好办法了！"',
        options: ['出来 (chūlái - ra/nghĩ ra)', '进去 (jìnqù)', '起来 (qǐlái)', '下去 (xiàqù)'],
        correct: 0,
        explain: 'V + 出来 biểu thị kết quả nhận thức hoặc sản sinh ý tưởng mới: 想出来 (nghĩ ra).'
      },
      {
        prompt: 'Chọn câu có bổ ngữ trình độ/trạng thái với chữ "得" chuẩn xác:',
        options: [
          '他汉字写得非常漂亮。',
          '他非常写汉字得漂亮。',
          '汉字他漂亮写得。',
          '写得漂亮他汉字。'
        ],
        correct: 0,
        explain: 'Cấu trúc: S + (O) + V + 得 + Phó từ + Tính từ ("他汉字写得非常漂亮").'
      },
      {
        prompt: 'Điền cặp liên từ biểu thị quan hệ tăng tiến: "他_____会说汉语，_____说得非常流利。"',
        options: [
          '不仅……而且…… (Không những... mà còn...)',
          '虽然……但是……',
          '因为……所以……',
          '只要……就……'
        ],
        correct: 0,
        explain: '"不仅...而且..." biểu thị mối quan hệ bổ sung tăng tiến cấp độ.'
      },
      {
        prompt: 'Điền cặp liên từ điều kiện cần và đủ: "_____坚持锻炼身体，身体_____会越来越强壮。"',
        options: [
          '只要……就…… (Chỉ cần... thì...)',
          '只有……才…… (Chỉ có... mới...)',
          '虽然……但是……',
          '宁可……也不……'
        ],
        correct: 0,
        explain: '"只要...就..." diễn tả điều kiện đầy đủ (chỉ cần... là sẽ...).'
      },
      {
        prompt: 'Điền cặp liên từ điều kiện duy nhất: "_____通过这次考核，_____能正式转正。"',
        options: [
          '只有……才…… (Chỉ có... mới...)',
          '只要……就……',
          '无论……都……',
          '既然……就……'
        ],
        correct: 0,
        explain: '"只有...才..." diễn đạt điều kiện duy nhất bắt buộc phải đạt được.'
      },
      {
        prompt: 'Điền cặp liên từ biểu thị điều kiện bất biến: "_____遇到多大的困难，他_____从不低头。"',
        options: [
          '无论……都…… (Bất luận / Dù cho... đều...)',
          '因为……所以……',
          '如果……就……',
          '虽然……但是……'
        ],
        correct: 0,
        explain: '"无论...都..." biểu thị trong bất kỳ hoàn cảnh nào thì kết quả vẫn không đổi.'
      },
      {
        prompt: 'Chọn câu dùng phó từ "越……越……" (càng... càng...) đúng ngữ pháp:',
        options: [
          '风越刮越大，雨越下越急。',
          '风越大越刮。',
          '越来越风大。',
          '越风越雨。'
        ],
        correct: 0,
        explain: 'Cấu trúc "越 + Động từ/Tính từ + 越 + Tính từ": 越刮越大.'
      },
      {
        prompt: 'Điền từ biểu thị vừa làm việc này vừa làm việc kia đồng thời: "他一边听音乐，_____写作业。"',
        options: ['一边 (yìbiān - vừa...)', '一起', '一直', '已经'],
        correct: 0,
        explain: 'Cấu trúc "一边...一边..." diễn tả 2 hành động diễn ra song song cùng thời điểm.'
      },
      {
        prompt: 'Chọn câu dùng giới từ "除了……以外，还/都……" chuẩn xác:',
        options: [
          '除了小王以外，大家都按时到了。',
          '除大家小王都到了。',
          '到了大家都除了小王。',
          '除了大家都到了小王。'
        ],
        correct: 0,
        explain: 'Cấu trúc loại trừ: 除了 A 以外，(B) 都...'
      },
      {
        prompt: 'Điền từ biểu thị mức độ cực điểm: "听到这个好消息，大家高兴_____了！"',
        options: ['极 (jí - cực kỳ / hết sức)', '太', '很', '更'],
        correct: 0,
        explain: 'Cấu trúc "Tính từ + 极了" biểu thị mức độ cao tột cùng: 高兴极了 (vui mừng hết đỗi).'
      },
      {
        prompt: 'Điền phó từ biểu thị hành động xảy ra bất ngờ: "正要出门，天空_____下起暴雨来。"',
        options: ['突然 (tūrán - đột nhiên / bất thình lình)', '常常', '马上', '已经'],
        correct: 0,
        explain: '"突然" làm trạng ngữ biểu thị sự việc diễn ra bất ngờ ngoài dự kiến.'
      },
      {
        prompt: 'Chọn câu biểu thị cấu trúc "càng ngày càng..." chuẩn xác:',
        options: [
          '北京的天气越来越冷了。',
          '北京越来越天气冷。',
          '冷越来越北京天气。',
          '天气冷越来越北京。'
        ],
        correct: 0,
        explain: 'Cấu trúc "越来越 + Tính từ": 越来越冷.'
      },
      {
        prompt: 'Điền động từ năng nguyện thể hiện nghĩa vụ cần thiết: "过马路时，我们_____看红绿灯。"',
        options: ['应该 (yīnggāi - nên / phải)', '喜欢', '打算', '敢'],
        correct: 0,
        explain: '"应该" biểu thị bổn phận, trách nhiệm về mặt lý lẽ đạo đức hoặc an toàn.'
      },
      {
        prompt: 'Điền từ nối diễn đạt kết quả tiêu cực nếu không làm: "快点儿走，_____我们要迟到了！"',
        options: ['要不然 / 否则 (nếu không thì)', '因为', '所以', '虽然'],
        correct: 0,
        explain: '"要不然" hoặc "否则" mang nghĩa: Nếu không thì sẽ dẫn tới hậu quả không mong muốn.'
      },
      {
        prompt: 'Điền giới từ chỉ phương hướng di chuyển: "列车正_____上海方向飞速行驶。"',
        options: ['向 / 往 (hướng về / đi về)', '在', '给', '被'],
        correct: 0,
        explain: 'Giới từ "向/往 + Phương hướng + Động từ": 向上海方向行驶.'
      },
      {
        prompt: 'Chọn câu có trợ từ ngữ khí "吧" dùng để suy đoán hoặc cầu khiến:',
        options: [
          '你也是大三的学生吧？',
          '你去了哪儿吧？',
          '谁是谁吧？',
          '什么是汉字吧？'
        ],
        correct: 0,
        explain: 'Trợ từ "吧" cuối câu dùng để đưa ra phỏng đoán có căn cứ hoặc đề nghị nhẹ nhàng.'
      }
    ]
  },

  // =========================================================================
  // 4. 📝 KỸ NĂNG PINYIN & THANH ĐIỆU (20 CÂU)
  // =========================================================================
  {
    id: 'hsk3-prac-pinyin',
    skill: 'pinyin',
    skillLabel: '📝 Pinyin & Thanh Điệu',
    level: 'HSK 3',
    title: 'Phát Âm & Ngữ Điệu Chuẩn Xác HSK 3',
    desc: 'Nắm vững phiên âm từ đa âm tiết, từ đồng âm khác nghĩa, hiện tượng biến điệu và thanh nhẹ nâng cao.',
    questionsCount: 20,
    questions: [
      {
        prompt: 'Từ "Môi trường" (环境) có phiên âm Pinyin chuẩn là:',
        options: ['huánjìng', 'huǎnjìng', 'huānjìng', 'huànjīng'],
        correct: 0,
        explain: '"环" mang thanh 2 (huán), "境" mang thanh 4 (jìng).'
      },
      {
        prompt: 'Từ "Ảnh hưởng" (影响) có phiên âm Pinyin chuẩn là:',
        options: ['yǐngxiǎng', 'yīngxiǎng', 'yǐngxiāng', 'yìngxiǎng'],
        correct: 0,
        explain: 'Cả 2 chữ đều mang thanh 3: yǐng-xiǎng (biến điệu đọc thành yíng-xiǎng).'
      },
      {
        prompt: 'Từ "Thành tích / Điểm số" (成绩) có phiên âm chuẩn là:',
        options: ['chéngjì', 'chèngjì', 'chéngjī', 'chēngjì'],
        correct: 0,
        explain: '"成" thanh 2 (chéng), "绩" thanh 4 (jì).'
      },
      {
        prompt: 'Từ "Khỏe mạnh / Sức khỏe" (健康) có phiên âm chuẩn là:',
        options: ['jiànkāng', 'jiānkāng', 'jiànkàng', 'jiǎnkāng'],
        correct: 0,
        explain: '"健" thanh 4 (jiàn), "康" thanh 1 (kāng).'
      },
      {
        prompt: 'Từ "Giải quyết" (解决) có phiên âm chuẩn là:',
        options: ['jiějué', 'jiējué', 'jièjué', 'jiějuē'],
        correct: 0,
        explain: '"解" thanh 3 (jiě), "决" thanh 2 (jué).'
      },
      {
        prompt: 'Từ "Thuận lợi" (顺利) có phiên âm chuẩn là:',
        options: ['shùnlì', 'shūnlì', 'shúnlì', 'shǔnlì'],
        correct: 0,
        explain: 'Cả 2 chữ đều mang thanh 4 dứt khoát: shùnlì.'
      },
      {
        prompt: 'Từ "Chăm chỉ / Nghiêm túc" (认真) có phiên âm chuẩn là:',
        options: ['rènzhēn', 'rēnzhēn', 'rénzhēn', 'rènzhèn'],
        correct: 0,
        explain: '"认" mang thanh 4 (rèn), "真" mang thanh 1 (zhēn).'
      },
      {
        prompt: 'Từ "Hộ chiếu" (护照) có phiên âm chuẩn là:',
        options: ['hùzhào', 'hūzhào', 'húzhào', 'hùzhāo'],
        correct: 0,
        explain: 'Cả 2 chữ đều mang thanh 4: hùzhào.'
      },
      {
        prompt: 'Từ "Hành lý" (行李) có phiên âm chuẩn là:',
        options: ['xíngli (Thanh 2 + Khinh thanh)', 'xǐngli', 'xìngli', 'xīnglǐ'],
        correct: 0,
        explain: '"行" thanh 2 (xíng), "李" đọc thanh nhẹ (li).'
      },
      {
        prompt: 'Từ "Mùa xuân" (春天) có phiên âm chuẩn là:',
        options: ['chūntiān', 'chúntiān', 'chǔntiān', 'chùntiān'],
        correct: 0,
        explain: 'Cả 2 chữ đều mang thanh 1 cao bằng: chūntiān.'
      },
      {
        prompt: 'Từ "Nhiệt tình" (热情) có phiên âm chuẩn là:',
        options: ['rèqíng', 'rēqíng', 'réqíng', 'rèqīng'],
        correct: 0,
        explain: '"热" thanh 4 (rè), "情" thanh 2 (qíng).'
      },
      {
        prompt: 'Từ "Khách sạn / Nhà nghỉ" (宾馆) có phiên âm chuẩn là:',
        options: ['bīnguǎn', 'bínguǎn', 'bǐnguǎn', 'bìnguǎn'],
        correct: 0,
        explain: '"宾" thanh 1 (bīn), "馆" thanh 3 (guǎn).'
      },
      {
        prompt: 'Từ "Cần cù / Nỗ lực" (努力) có phiên âm chuẩn là:',
        options: ['nǔlì', 'nūlì', 'núlì', 'nùlì'],
        correct: 0,
        explain: '"努" mang thanh 3 (nǔ), "力" mang thanh 4 (lì).'
      },
      {
        prompt: 'Từ "Thường xuyên" (经常) có phiên âm chuẩn là:',
        options: ['jīngcháng', 'jǐngcháng', 'jìngcháng', 'jīngchāng'],
        correct: 0,
        explain: '"经" thanh 1 (jīng), "常" thanh 2 (cháng).'
      },
      {
        prompt: 'Từ "Bảo vệ" (保护) có phiên âm chuẩn là:',
        options: ['bǎohù', 'bāohù', 'báohù', 'bàohù'],
        correct: 0,
        explain: '"保" thanh 3 (bǎo), "护" thanh 4 (hù).'
      },
      {
        prompt: 'Từ "Thành công" (成功) có phiên âm chuẩn là:',
        options: ['chénggōng', 'chēnggōng', 'chěnggōng', 'chènggōng'],
        correct: 0,
        explain: '"成" thanh 2 (chéng), "功" thanh 1 (gōng).'
      },
      {
        prompt: 'Từ "Quan trọng" (重要) có phiên âm chuẩn là:',
        options: ['zhòngyào', 'zhōngyào', 'zhóngyào', 'zhǒngyào'],
        correct: 0,
        explain: 'Cả 2 chữ đều mang thanh 4: zhòngyào.'
      },
      {
        prompt: 'Từ "Đặc biệt" (特别) có phiên âm chuẩn là:',
        options: ['tèbié', 'tēbié', 'těbié', 'tèbiē'],
        correct: 0,
        explain: '"特" thanh 4 (tè), "别" thanh 2 (bié).'
      },
      {
        prompt: 'Từ "Tự nhiên / Thiên nhiên" (自然) có phiên âm chuẩn là:',
        options: ['zìrán', 'zhìrán', 'zīrán', 'zìrān'],
        correct: 0,
        explain: '"自" mang thanh 4 (zì), "然" mang thanh 2 (rán).'
      },
      {
        prompt: 'Từ "Thói quen" (习惯) có phiên âm chuẩn là:',
        options: ['xíguàn', 'xīguàn', 'xǐguàn', 'xìguàn'],
        correct: 0,
        explain: '"习" thanh 2 (xí), "惯" thanh 4 (guàn).'
      }
    ]
  },

  // =========================================================================
  // 5. ✍️ KỸ NĂNG CHỮ HÁN & TỪ VỰNG (20 CÂU)
  // =========================================================================
  {
    id: 'hsk3-prac-hanzi',
    skill: 'hanzi',
    skillLabel: '✍️ Chữ Hán & Từ Vựng',
    level: 'HSK 3',
    title: 'Từ Vựng Trung Cấp & Cụm Chữ Hán HSK 3',
    desc: 'Luyện cấu tạo từ ghép, thành ngữ cơ bản, từ trái nghĩa/đồng nghĩa và phân biệt các chữ Hán phức tạp.',
    questionsCount: 20,
    questions: [
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Môi trường" (huánjìng):',
        options: ['环境', '情况', '意境', '情境'],
        correct: 0,
        explain: '"环境" (huánjìng) là môi trường tự nhiên hoặc môi trường sống.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Lịch sử" (lìshǐ):',
        options: ['历史', '历代', '经历', '学历'],
        correct: 0,
        explain: '"历史" (lìshǐ) là lịch sử.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Quyết định" (juédìng):',
        options: ['决定', '一定要', '决心', '判断'],
        correct: 0,
        explain: '"决定" (juédìng) là đưa ra quyết định.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Giải quyết" (jiějué):',
        options: ['解决', '了解', '解释', '解放'],
        correct: 0,
        explain: '"解决" (jiějué) là giải quyết khó khăn vướng mắc.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Văn hóa" (wénhuà):',
        options: ['文化', '文学', '文明', '文字'],
        correct: 0,
        explain: '"文化" (wénhuà) là văn hóa.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Công ty" (gōngsī):',
        options: ['公司', '社会', '机关', '企业'],
        correct: 0,
        explain: '"公司" (gōngsī) là công ty, doanh nghiệp.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Ngân hàng" (yínháng):',
        options: ['银行', '行李', '行人', '行业'],
        correct: 0,
        explain: '"银行" (yínháng) là ngân hàng tài chính.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Hộ chiếu" (hùzhào):',
        options: ['护照', '拍照', '照片', '照顾'],
        correct: 0,
        explain: '"护照" (hùzhào) là cuốn hộ chiếu.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Vé máy bay / Thẻ lên tàu bay" (dēngjīpái):',
        options: ['登机牌', '火车票', '门票', '汽车票'],
        correct: 0,
        explain: '"登机牌" (dēngjīpái) là thẻ lên máy bay.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Kiểm tra / Thi cử" (kǎoshì):',
        options: ['考试', '试卷', '考查', '试验'],
        correct: 0,
        explain: '"考试" (kǎoshì) là kỳ thi/kiểm tra.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Thành công" (chénggōng):',
        options: ['成功', '完成', '成就', '工夫'],
        correct: 0,
        explain: '"成功" (chénggōng) là thành công.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Bảo vệ" (bǎohù):',
        options: ['保护', '保管', '保温', '爱护'],
        correct: 0,
        explain: '"保护" (bǎohù) là bảo vệ (môi trường, động vật...).'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "An toàn" (ānquán):',
        options: ['安全', '安静', '安心', '安排'],
        correct: 0,
        explain: '"安全" (ānquán) là an toàn.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Sạch sẽ" (gānjìng):',
        options: ['干净', '安静', '净化', '干燥'],
        correct: 0,
        explain: '"干净" (gānjìng) là sạch sẽ.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Thuận lợi" (shùnlì):',
        options: ['顺利', '方便', '利益', '利用'],
        correct: 0,
        explain: '"顺利" (shùnlì) là suôn sẻ, thuận lợi.'
      },
      {
        prompt: 'Từ trái nghĩa: Từ trái nghĩa với "热情" (nhiệt tình) là gì?',
        options: ['冷淡 (lěngdàn - lạnh nhạt)', '高兴', '认真', '难过'],
        correct: 0,
        explain: 'Trái nghĩa với "热情" (nhiệt tình ấm áp) là "冷淡" (lạnh nhạt hờ hững).'
      },
      {
        prompt: 'Từ trái nghĩa: Từ trái nghĩa với "成功" (thành công) là gì?',
        options: ['失败 (shībài - thất bại)', '结束', '过去', '困难'],
        correct: 0,
        explain: 'Trái nghĩa với thành công là thất bại (失败).'
      },
      {
        prompt: 'Từ đồng nghĩa: Từ nào đồng nghĩa với "突然" (tūrán - đột nhiên)?',
        options: ['忽然 (hūrán - bỗng nhiên)', '终于', '一直', '其实'],
        correct: 0,
        explain: '"突然" và "忽然" đều mang nghĩa là đột nhiên, bất ngờ.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Thói quen" (xíguàn):',
        options: ['习惯', '学习', '练贯', '贯穿'],
        correct: 0,
        explain: '"习惯" (xíguàn) là thói quen/tập quán.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Quan tâm / Chăm sóc" (guānxīn):',
        options: ['关心', '关系', '开门', '心情'],
        correct: 0,
        explain: '"关心" (guānxīn) là quan tâm chăm sóc.'
      }
    ]
  }
];
