// src/data/practice/hsk1_practice.js
// 100 câu hỏi Luyện tập tự do HSK 1 (20 câu Nghe, 20 câu Đọc, 20 câu Ngữ pháp, 20 câu Pinyin, 20 câu Chữ Hán)

export const hsk1PracticeTopics = [
  // =========================================================================
  // 1. 🎧 KỸ NĂNG NGHE HIỂU (20 CÂU)
  // =========================================================================
  {
    id: 'hsk1-prac-listening',
    skill: 'listening',
    skillLabel: '🎧 Luyện Nghe',
    level: 'HSK 1',
    title: 'Luyện Nghe HSK 1: Chào Hỏi, Thời Gian & Đời Sống',
    desc: 'Luyện tai nghe nhận biết lời chào, số đếm, giờ giấc, đồ vật và các câu hội thoại giao tiếp căn bản.',
    questionsCount: 20,
    questions: [
      {
        prompt: 'Lắng nghe lời chào: "你好，很高兴认识你！" Người nói muốn bày tỏ điều gì?',
        audio: '你好，很高兴认识你！',
        pinyin: 'Nǐ hǎo, hěn gāoxìng rènshi nǐ!',
        options: ['Chào bạn, rất vui được quen biết bạn!', 'Tạm biệt, hẹn gặp lại ngày mai!', 'Xin lỗi, tôi không quen bạn.', 'Cảm ơn sự giúp đỡ của bạn.'],
        correct: 0,
        explain: '"很高兴认识你" là mẫu câu chào làm quen lịch sự: Rất vui được quen bạn.'
      },
      {
        prompt: 'Lắng nghe giờ hẹn: "我们明天上午九点见。" Họ hẹn nhau lúc mấy giờ?',
        audio: '我们明天上午九点见。',
        pinyin: 'Wǒmen míngtiān shàngwǔ jiǔ diǎn jiàn.',
        options: ['8:00 sáng mai', '9:00 sáng mai', '9:00 tối mai', '10:00 sáng mai'],
        correct: 1,
        explain: '"明天上午九点" là 9 giờ sáng ngày mai.'
      },
      {
        prompt: 'Lắng nghe đồ uống: "你想喝茶还是喝水？" Người nói đưa ra những lựa chọn nào?',
        audio: '你想喝茶还是喝水？',
        pinyin: 'Nǐ xiǎng hē chá háishì hē shuǐ?',
        options: ['Trà hay là nước lọc', 'Cà phê hay nước ngọt', 'Sữa tươi hay nước hoa quả', 'Bia hay rượu vang'],
        correct: 0,
        explain: '"茶" là trà, "水" là nước lọc.'
      },
      {
        prompt: 'Lắng nghe địa điểm: "我爸爸在医院工作，他是医生。" Bố anh ấy làm việc ở đâu?',
        audio: '我爸爸在医院工作，他是医生。',
        pinyin: 'Wǒ bàba zài yīyuàn gōngzuò, tā shì yīshēng.',
        options: ['Trường học', 'Bệnh viện', 'Cửa hàng', 'Ngân hàng'],
        correct: 1,
        explain: '"在医院工作" nghĩa là làm việc ở bệnh viện.'
      },
      {
        prompt: 'Lắng nghe con số: "这个杯子十五块钱。" Chiếc cốc giá bao nhiêu?',
        audio: '这个杯子十五块钱。',
        pinyin: 'Zhège bēizi shíwǔ kuài qián.',
        options: ['5 đồng', '10 đồng', '15 đồng', '50 đồng'],
        correct: 2,
        explain: '"十五块" (shíwǔ kuài) là 15 đồng.'
      },
      {
        prompt: 'Lắng nghe thời tiết: "今天太冷了，下雨了。" Thời tiết hôm nay ra sao?',
        audio: '今天太冷了，下雨了。',
        pinyin: 'Jīntiān tài lěng le, xiàyǔ le.',
        options: ['Trời rất nóng và nắng to', 'Trời quá lạnh và đổ mưa', 'Trời ấm áp nhiều mây', 'Trời nổi bão lớn'],
        correct: 1,
        explain: '"太冷了" là quá lạnh, "下雨了" là trời mưa rồi.'
      },
      {
        prompt: 'Lắng nghe số lượng: "我买了五个大苹果。" Người nói mua mấy quả táo?',
        audio: '我买了五个大苹果。',
        pinyin: 'Wǒ mǎi le wǔ gè dà píngguǒ.',
        options: ['3 quả', '4 quả', '5 quả', '6 quả'],
        correct: 2,
        explain: '"五个大苹果" là 5 quả táo to.'
      },
      {
        prompt: 'Lắng nghe con vật: "桌子下面有一只小猫。" Con mèo đang ở đâu?',
        audio: '桌子下面有一只小猫。',
        pinyin: 'Zhuōzi xiàmiàn yǒu yì zhī xiǎomāo.',
        options: ['Trên bàn', 'Dưới bàn', 'Trên ghế', 'Trong hộp'],
        correct: 1,
        explain: '"桌子下面" là ở phía dưới cái bàn.'
      },
      {
        prompt: 'Lắng nghe hành động: "李老师正在打电话呢。" Thầy Lý đang làm gì?',
        audio: '李老师正在打电话呢。',
        pinyin: 'Lǐ lǎoshī zhèngzài dǎ diànhuà ne.',
        options: ['Đang gọi điện thoại', 'Đang đọc sách', 'Đang ăn cơm', 'Đang giảng bài'],
        correct: 0,
        explain: '"打电话" (dǎ diànhuà) là gọi điện thoại.'
      },
      {
        prompt: 'Lắng nghe tuổi tác: "他女儿今年四岁了。" Con gái anh ấy mấy tuổi?',
        audio: '他女儿今年四岁了。',
        pinyin: 'Tā nǚ\'ér jīnnián sì suì le.',
        options: ['3 tuổi', '4 tuổi', '5 tuổi', '14 tuổi'],
        correct: 1,
        explain: '"四岁" (sì suì) là 4 tuổi.'
      },
      {
        prompt: 'Lắng nghe món ăn: "我很喜欢吃中国米饭和面条。" Người nói thích ăn gì?',
        audio: '我很喜欢吃中国米饭和面条。',
        pinyin: 'Wǒ hěn xǐhuan chī Zhōngguó mǐfàn hé miàntiáo.',
        options: ['Cơm và mì sợi Trung Quốc', 'Bánh mì và sữa', 'Phở và gỏi cuốn', 'Hoa quả tươi'],
        correct: 0,
        explain: '"米饭" là cơm, "面条" là mì sợi.'
      },
      {
        prompt: 'Lắng nghe phương tiện: "我们坐出租车去火车站吧。" Họ di chuyển bằng gì?',
        audio: '我们坐出租车去火车站吧。',
        pinyin: 'Wǒmen zuò chūzūchē qù huǒchēzhàn ba.',
        options: ['Đi bộ', 'Đi xe đạp', 'Đi xe taxi', 'Đi máy bay'],
        correct: 2,
        explain: '"坐出租车" là đi bằng xe taxi.'
      },
      {
        prompt: 'Lắng nghe địa điểm học: "王明在学校里看书。" Vương Minh ở đâu đọc sách?',
        audio: '王明在学校里看书。',
        pinyin: 'Wáng Míng zài xuéxiào lǐ kàn shū.',
        options: ['Ở nhà', 'Ở trường học', 'Ở công viên', 'Ở thư viện thành phố'],
        correct: 1,
        explain: '"在学校里" là ở trong trường học.'
      },
      {
        prompt: 'Lắng nghe lời cảm ơn: "谢谢你帮助我！" Lời đáp lễ phù hợp nhất là gì?',
        audio: '谢谢你帮助我！',
        pinyin: 'Xièxie nǐ bāngzhù wǒ!',
        options: ['不客气！(Đừng khách sáo!)', '对不起！(Xin lỗi!)', '没关系！(Không sao!)', '再见！(Tạm biệt!)'],
        correct: 0,
        explain: 'Đáp lại lời cảm ơn "谢谢" dùng "不客气".'
      },
      {
        prompt: 'Lắng nghe lời xin lỗi: "对不起，我来晚了！" Người kia nên đáp lại câu nào?',
        audio: '对不起，我来晚了！',
        pinyin: 'Duìbuqǐ, wǒ lái wǎn le!',
        options: ['没关系。(Không sao đâu.)', '谢谢。(Cảm ơn.)', '请坐。(Mời ngồi.)', '太好了。(Tốt quá.)'],
        correct: 0,
        explain: 'Đáp lại "对不起" dùng "没关系".'
      },
      {
        prompt: 'Lắng nghe thời gian: "现在是下午两点半。" Bây giờ là mấy giờ?',
        audio: '现在是下午两点半。',
        pinyin: 'Xiànzài shì xiàwǔ liǎng diǎn bàn.',
        options: ['1:30 chiều', '2:00 chiều', '2:30 chiều', '3:30 chiều'],
        correct: 2,
        explain: '"两点半" là 2 giờ 30 phút.'
      },
      {
        prompt: 'Lắng nghe đồ vật: "那本汉语书是我的。" Quyển sách nào là của tôi?',
        audio: '那本汉语书是我的。',
        pinyin: 'Nà běn Hànyǔ shū shì wǒ de.',
        options: ['Quyển sách tiếng Trung kia', 'Quyển vở viết này', 'Chiếc cặp sách màu đen', 'Cây bút mực màu đỏ'],
        correct: 0,
        explain: '"汉语书" là sách tiếng Hán/tiếng Trung.'
      },
      {
        prompt: 'Lắng nghe người thân: "我哥哥在北京上大学。" Anh trai đang ở đâu?',
        audio: '我哥哥在北京上大学。',
        pinyin: 'Wǒ gēge zài Běijīng shàng dàxué.',
        options: ['Học đại học ở Thượng Hải', 'Học đại học ở Bắc Kinh', 'Đi làm ở Quảng Châu', 'Đi du lịch nước ngoài'],
        correct: 1,
        explain: '"在北京上大学" là học đại học ở Bắc Kinh.'
      },
      {
        prompt: 'Lắng nghe câu hỏi tên: "请问，你叫什么名字？" Câu trả lời đúng cấu trúc:',
        audio: '请问，你叫什么名字？',
        pinyin: 'Qǐngwèn, nǐ jiào shénme míngzi?',
        options: ['我叫张伟。(Tôi tên là Trương Vĩ.)', '我是中国人。(Tôi là người Trung Quốc.)', '我二十岁。(Tôi hai mươi tuổi.)', '我是学生。(Tôi là học sinh.)'],
        correct: 0,
        explain: 'Hỏi tên dùng "我叫 + tên".'
      },
      {
        prompt: 'Lắng nghe tạm biệt: "明天见！" Nghĩa của câu này là gì?',
        audio: '明天见！',
        pinyin: 'Míngtiān jiàn!',
        options: ['Ngày mai gặp lại!', 'Tuần sau gặp nhé!', 'Hẹn gặp buổi tối!', 'Chúc ngủ ngon!'],
        correct: 0,
        explain: '"明天见" nghĩa là ngày mai gặp lại.'
      }
    ]
  },

  // =========================================================================
  // 2. 📖 KỸ NĂNG ĐỌC HIỂU (20 CÂU)
  // =========================================================================
  {
    id: 'hsk1-prac-reading',
    skill: 'reading',
    skillLabel: '📖 Đọc Hiểu',
    level: 'HSK 1',
    title: 'Đọc Hiểu Đoạn Văn & Mẫu Câu HSK 1',
    desc: 'Đọc hiểu các câu đơn giản, thông báo, biển hiệu, giá tiền và lời nhắn sinh hoạt hàng ngày.',
    questionsCount: 20,
    questions: [
      {
        prompt: 'Đọc câu: "今天星期日，学校没有人。" Phán đoán: Hôm nay trường học rất đông học sinh.',
        options: ['对 (Đúng)', '错 (Sai - Trường không có ai)'],
        correct: 1,
        explain: '"没有人" nghĩa là không có người.'
      },
      {
        prompt: 'Đọc câu: "桌子上有三个苹果，我吃了一个。" Hỏi: Trên bàn còn lại mấy quả táo?',
        options: ['1 quả', '2 quả', '3 quả', '0 quả'],
        correct: 1,
        explain: 'Có 3 quả ăn mất 1 quả: 3 - 1 = 2 quả (两个).'
      },
      {
        prompt: 'Đọc câu: "他是我的好朋友，我们天天一起学习。" Họ có mối quan hệ gì?',
        options: ['Bạn bè tốt cùng học', 'Thầy giáo và học sinh', 'Bố con', 'Người xa lạ'],
        correct: 0,
        explain: '"好朋友" nghĩa là bạn bè tốt.'
      },
      {
        prompt: 'Đọc biển báo: "请坐，喝茶。" Câu này thể hiện hành động gì?',
        options: ['Mời ngồi uống trà', 'Cấm ngồi', 'Yêu cầu thanh toán tiền trà', 'Đóng cửa hàng'],
        correct: 0,
        explain: '"请坐" (mời ngồi), "喝茶" (uống trà).'
      },
      {
        prompt: 'Đọc câu: "我想买这件大衣服，但是太贵了。" Vì sao người nói chưa mua áo?',
        options: ['Vì quá đắt (太贵了)', 'Vì áo bị rách', 'Vì cỡ áo quá nhỏ', 'Vì không thích màu sắc'],
        correct: 0,
        explain: '"太贵了" nghĩa là quá đắt tiền.'
      },
      {
        prompt: 'Đọc câu: "她是医院里的护士，工作很忙。" Cô ấy làm nghề gì?',
        options: ['Y tá bệnh viện', 'Bác sĩ trưởng khoa', 'Giáo viên mầm non', 'Nhân viên bán hàng'],
        correct: 0,
        explain: '"护士" là y tá trong bệnh viện.'
      },
      {
        prompt: 'Đọc câu: "昨天北京下大雨，天气很冷。" Thời tiết hôm qua ở Bắc Kinh thế nào?',
        options: ['Nắng đẹp ấm áp', 'Mưa to và trời rất lạnh', 'Tuyết rơi dày', 'Nóng bức oi ả'],
        correct: 1,
        explain: '"下大雨" (mưa to), "很冷" (rất lạnh).'
      },
      {
        prompt: 'Đọc câu: "我在中国住了五年，会说很多汉语。" Người nói sống ở đâu 5 năm?',
        options: ['Ở Việt Nam', 'Ở Trung Quốc', 'Ở Mỹ', 'Ở Nhật Bản'],
        correct: 1,
        explain: '"在中国" nghĩa là ở Trung Quốc.'
      },
      {
        prompt: 'Đọc câu: "小狗在椅子下面睡觉。" Con chó đang làm gì?',
        options: ['Đang ăn cơm', 'Đang đi ngủ', 'Đang chạy nhảy', 'Đang uống nước'],
        correct: 1,
        explain: '"睡觉" (shuìjiào) là đang ngủ.'
      },
      {
        prompt: 'Đọc câu: "现在两点，我们三点坐飞机去上海。" Mấy giờ máy bay cất cánh?',
        options: ['1:00', '2:00', '3:00', '4:00'],
        correct: 2,
        explain: '"三点坐飞机" nghĩa là 3 giờ đi máy bay.'
      },
      {
        prompt: 'Đọc câu: "这家饭店的中国菜真好吃！" Người nói khen điều gì?',
        options: ['Món ăn Trung Quốc ở quán này rất ngon', 'Quán ăn phục vụ chậm', 'Món ăn quá cay', 'Giá cả đắt đỏ'],
        correct: 0,
        explain: '"真好吃" nghĩa là thật ngon miệng.'
      },
      {
        prompt: 'Đọc câu: "我不喜欢喝牛奶，我喜欢喝热茶。" Người nói thích uống gì?',
        options: ['Sữa lạnh', 'Trà nóng', 'Nước đá', 'Cà phê'],
        correct: 1,
        explain: '"我喜欢喝热茶" (Tôi thích uống trà nóng).'
      },
      {
        prompt: 'Đọc câu: "我的汉语老师是李老师，她三十岁。" Cô Lý bao nhiêu tuổi?',
        options: ['20 tuổi', '25 tuổi', '30 tuổi', '35 tuổi'],
        correct: 2,
        explain: '"三十岁" (sānshí suì) là 30 tuổi.'
      },
      {
        prompt: 'Đọc câu: "商店在学校的前面。" Cửa hàng nằm ở vị trí nào so với trường học?',
        options: ['Phía sau trường', 'Phía trước trường', 'Bên trong trường', 'Bên cạnh trường'],
        correct: 1,
        explain: '"前面" (qiánmiàn) là phía trước.'
      },
      {
        prompt: 'Đọc câu: "他没去上班，因为他生病了。" Vì sao anh ấy không đi làm?',
        options: ['Vì trời mưa', 'Vì bị ốm (生病了)', 'Vì bận đi du lịch', 'Vì công ty nghỉ lễ'],
        correct: 1,
        explain: '"因为他生病了" (Bởi vì anh ấy bị bệnh/ốm).'
      },
      {
        prompt: 'Đọc câu: "这只小猫是白色的，非常漂亮。" Con mèo có màu gì?',
        options: ['Màu đen', 'Màu trắng (白色)', 'Màu vàng', 'Màu xám'],
        correct: 1,
        explain: '"白色的" (báisè de) là màu trắng.'
      },
      {
        prompt: 'Đọc câu: "爸爸在看书，妈妈在做饭。" Mẹ đang làm việc gì?',
        options: ['Đang xem tivi', 'Đang nấu cơm (做饭)', 'Đang rửa bát', 'Đang đọc sách'],
        correct: 1,
        explain: '"做饭" (zuò fàn) nghĩa là nấu cơm/nấu ăn.'
      },
      {
        prompt: 'Đọc câu: "这个汉字怎么读？我不会。" Người nói gặp khó khăn gì?',
        options: ['Không biết đọc chữ Hán này', 'Không biết viết chữ', 'Không có từ điển', 'Không thích học'],
        correct: 0,
        explain: '"怎么读" là đọc thế nào, "我不会" là tôi không biết.'
      },
      {
        prompt: 'Đọc câu: "明天是八月十号，星期五。" Ngày mai là thứ mấy?',
        options: ['Thứ Năm', 'Thứ Sáu (星期五)', 'Thứ Bảy', 'Chủ Nhật'],
        correct: 1,
        explain: '"星期五" (xīngqīwǔ) là thứ Sáu.'
      },
      {
        prompt: 'Đọc câu: "我和小李一起坐出租车回家。" Họ cùng nhau đi về đâu bằng taxi?',
        options: ['Đến trường', 'Về nhà (回家)', 'Đến bệnh viện', 'Đến sân bay'],
        correct: 1,
        explain: '"回家" nghĩa là trở về nhà.'
      }
    ]
  },

  // =========================================================================
  // 3. 🧩 KỸ NĂNG NGỮ PHÁP (20 CÂU)
  // =========================================================================
  {
    id: 'hsk1-prac-grammar',
    skill: 'grammar',
    skillLabel: '🧩 Ngữ Pháp',
    level: 'HSK 1',
    title: 'Ngữ Pháp Căn Bản HSK 1: Trật Tự Từ & Lượng Từ',
    desc: 'Nắm chắc cấu trúc S + V + O, lượng từ (个, 本, 块), câu hỏi (吗, 呢, 谁, 什么, 哪儿) và phó từ 不/很.',
    questionsCount: 20,
    questions: [
      {
        prompt: 'Chọn câu có trật tự thời gian đúng ngữ pháp:',
        options: [
          '我明天去北京。(Wǒ míngtiān qù Běijīng.)',
          '我去北京明天。(Wǒ qù Běijīng míngtiān.)',
          '去我明天北京。(Qù wǒ míngtiān Běijīng.)',
          '明天北京我去。(Míngtiān Běijīng wǒ qù.)'
        ],
        correct: 0,
        explain: 'Quy tắc ngữ pháp: Trạng từ chỉ thời gian (明天) đứng trước vị ngữ động từ (去).'
      },
      {
        prompt: 'Điền lượng từ thích hợp: "桌子上有两_____书。"',
        options: ['本 (běn - quyển)', '个 (gè - cái)', '块 (kuài - đồng)', '只 (zhī - con)'],
        correct: 0,
        explain: 'Lượng từ dùng cho sách (书) là "本" (běn).'
      },
      {
        prompt: 'Điền từ phủ định: "他_____是我的老师，他是我的同学。"',
        options: ['没 (méi)', '不 (bù)', '很 (hěn)', '也 (yě)'],
        correct: 1,
        explain: 'Phủ định cho động từ "是" bắt buộc dùng "不" (不是).'
      },
      {
        prompt: 'Điền từ để hỏi địa điểm: "请问，洗手间在_____？"',
        options: ['哪儿 (nǎr - ở đâu)', '谁 (shéi - ai)', '什么 (shénme - cái gì)', '怎么 (zěnme - thế nào)'],
        correct: 0,
        explain: 'Hỏi nơi chốn/vị trí dùng đại từ nghi vấn "哪儿" (nǎr).'
      },
      {
        prompt: 'Điền lượng từ cho con vật nhỏ: "我家有一_____小狗。"',
        options: ['只 (zhī)', '本 (běn)', '个 (gè)', '件 (jiàn)'],
        correct: 0,
        explain: 'Lượng từ dùng cho chó/mèo là "只" (zhī).'
      },
      {
        prompt: 'Điền từ nghi vấn hỏi người: "他是_____？- 他是我的医生。"',
        options: ['谁 (shéi - ai)', '哪儿 (nǎr - đâu)', '什么 (shénme - gì)', '多少 (duōshao - bao nhiêu)'],
        correct: 0,
        explain: 'Hỏi người dùng "谁" (shéi).'
      },
      {
        prompt: 'Chọn câu hỏi có đại từ nghi vấn "吗" chuẩn xác:',
        options: [
          '你是中国人吗？(Bạn là người Trung Quốc phải không?)',
          '你是谁吗？',
          '你去哪儿吗？',
          '你叫什么名字吗？'
        ],
        correct: 0,
        explain: 'Trợ từ "吗" dùng ở cuối câu hỏi Yes/No, không dùng chung với các đại từ hỏi như 谁, 哪儿, 什么.'
      },
      {
        prompt: 'Điền lượng từ tiền tệ: "这个苹果两_____钱。"',
        options: ['块 (kuài - đồng/tệ)', '本 (běn)', '岁 (suì)', '天 (tiān)'],
        correct: 0,
        explain: 'Đơn vị đo tiền tệ khẩu ngữ là "块" (kuài).'
      },
      {
        prompt: 'Điền phó từ mức độ: "今天天气_____热，我想喝水。"',
        options: ['很 (hěn - rất)', '不 (bù)', '吗 (ma)', '呢 (ne)'],
        correct: 0,
        explain: 'Phó từ chỉ mức độ "很" đứng trước tính từ "热" (很热).'
      },
      {
        prompt: 'Điền trợ từ kết cấu sở hữu: "这件衣服是李老师_____。"',
        options: ['的 (de)', '得 (de)', '地 (de)', '了 (le)'],
        correct: 0,
        explain: 'Cấu trúc "là của ai": 是 + Người + 的.'
      },
      {
        prompt: 'Điền trợ từ diễn tả hành động đang diễn ra: "他正在看书_____。"',
        options: ['呢 (ne)', '吗 (ma)', '吧 (ba)', '了 (le)'],
        correct: 0,
        explain: 'Cấu trúc "正在...呢" biểu thị hành động đang tiến hành.'
      },
      {
        prompt: 'Điền từ hỏi số lượng dưới 10: "你家有_____口人？"',
        options: ['几 (jǐ - mấy)', '多少 (duōshao - bao nhiêu)', '什么 (shénme)', '谁 (shéi)'],
        correct: 0,
        explain: 'Hỏi số lượng nhỏ người trong nhà (thường dưới 10) dùng "几口人".'
      },
      {
        prompt: 'Chọn câu ghép liên từ "和" (và) chính xác:',
        options: [
          '我和他是好朋友。(Tôi và anh ấy là bạn tốt.)',
          '我吃饭和他。(Sai)',
          '他是老师和我。(Sai)',
          '和我很喜欢他。(Sai)'
        ],
        correct: 0,
        explain: '"和" nối 2 danh từ hoặc đại từ: A 和 B.'
      },
      {
        prompt: 'Điền từ diễn tả khả năng học được: "我_____说一点儿汉语。"',
        options: ['会 (huì - biết)', '在 (zài)', '是 (shì)', '有 (yǒu)'],
        correct: 0,
        explain: 'Động từ năng nguyện "会" chỉ năng lực có được qua học tập/rèn luyện.'
      },
      {
        prompt: 'Điền từ thể hiện ý muốn: "我_____去商店买东西。"',
        options: ['想 (xiǎng - muốn/nghĩ)', '很 (hěn)', '不 (bù)', '的 (de)'],
        correct: 0,
        explain: '"想 + V" biểu thị mong muốn làm việc gì đó.'
      },
      {
        prompt: 'Điền lượng từ dùng cho quần áo: "我买了一_____衣服。"',
        options: ['件 (jiàn - chiếc/bộ)', '本 (běn)', '个 (gè)', '只 (zhī)'],
        correct: 0,
        explain: 'Lượng từ của quần áo "衣服" là "件" (jiàn).'
      },
      {
        prompt: 'Chọn câu diễn tả địa điểm đứng trước hành động đúng chuẩn:',
        options: [
          '我们在教室里写汉字。(Chúng tôi ở trong lớp viết chữ Hán.)',
          '我们写汉字在教室里。(Sai ngữ pháp)',
          '教室里我们在写汉字。(Ít tự nhiên)',
          '写汉字在教室里我们。(Sai)'
        ],
        correct: 0,
        explain: 'Cấu trúc tiếng Trung: Chủ ngữ + 在 + Địa điểm + Động từ + Tân ngữ.'
      },
      {
        prompt: 'Điền từ hỏi cách thức thực hiện hành động: "请问，这个字_____写？"',
        options: ['怎么 (zěnme - như thế nào)', '什么 (shénme)', '哪儿 (nǎr)', '谁 (shéi)'],
        correct: 0,
        explain: '"怎么 + Động từ" dùng để hỏi phương thức/cách làm: 怎么写 (viết thế nào).'
      },
      {
        prompt: 'Điền từ diễn đạt sự tồn tại: "桌子上_____很多书。"',
        options: ['有 (yǒu - có)', '是 (shì)', '在 (zài)', '去 (qù)'],
        correct: 0,
        explain: 'Câu biểu thị tồn tại: Nơi chốn + 有 + Danh từ (桌子上有很多书).'
      },
      {
        prompt: 'Điền trợ từ hoàn thành hành động: "我喝了一杯水_____。"',
        options: ['了 (le)', '吗 (ma)', '呢 (ne)', '吧 (ba)'],
        correct: 0,
        explain: 'Trợ từ "了" đặt sau động từ hoặc cuối câu biểu thị hành động đã hoàn thành.'
      }
    ]
  },

  // =========================================================================
  // 4. 📝 KỸ NĂNG PINYIN & THANH ĐIỆU (20 CÂU)
  // =========================================================================
  {
    id: 'hsk1-prac-pinyin',
    skill: 'pinyin',
    skillLabel: '📝 Pinyin & Thanh Điệu',
    level: 'HSK 1',
    title: 'Ngữ Âm Pinyin & Thanh Điệu Nhập Môn HSK 1',
    desc: 'Luyện chuẩn thanh 1-4, biến điệu thanh 3, cặp âm bật hơi (b-p, d-t, g-k) và âm đầu lưỡi.',
    questionsCount: 20,
    questions: [
      {
        prompt: 'Thanh điệu của từ "Mẹ" (妈妈) đọc là:',
        options: ['māma (Thanh 1 + Khinh thanh)', 'mámā', 'mǎmǎ', 'màmā'],
        correct: 0,
        explain: 'Chữ đầu đọc thanh 1 kéo dài, chữ sau đọc khinh thanh nhẹ nhàng (māma).'
      },
      {
        prompt: 'Từ "Cảm ơn" (谢谢) có phiên âm đúng là:',
        options: ['xièxie', 'xīexie', 'xiéxie', 'xiěxie'],
        correct: 0,
        explain: '"谢谢" đọc thanh 4 kết hợp khinh thanh: xièxie.'
      },
      {
        prompt: 'Quy tắc biến điệu 2 thanh 3: Từ "Xin chào" (你好 - nǐ hǎo) được đọc thành:',
        options: ['ní hǎo (Thanh 2 + Thanh 3)', 'nǐ hào', 'nì hǎo', 'nī hǎo'],
        correct: 0,
        explain: 'Khi 2 thanh 3 đi liền nhau, thanh 3 đầu tiên biến thành thanh 2: nǐ hǎo -> ní hǎo.'
      },
      {
        prompt: 'Biến điệu của chữ "不" trước thanh 4: "不是" (bù + shì) đọc là:',
        options: ['bú shì (Thanh 2 + Thanh 4)', 'bù shì', 'bǔ shì', 'bū shì'],
        correct: 0,
        explain: 'Chữ "不" (bù) khi đứng trước một âm tiết mang thanh 4 sẽ biến đổi thành thanh 2: bú shì.'
      },
      {
        prompt: 'Phân biệt âm bật hơi: Từ "Bạn bè" (朋友) có âm đầu là "p" bật hơi, phiên âm là:',
        options: ['péngyou', 'béngyou', 'féngyou', 'téngyou'],
        correct: 0,
        explain: '"朋" phát âm bật hơi mạnh luồng gió: péng.'
      },
      {
        prompt: 'Từ "Trường học" (学校) có phiên âm Pinyin chuẩn là:',
        options: ['xuéxiào', 'xuéxiao', 'xuèxiào', 'xuēxiào'],
        correct: 0,
        explain: '"学" mang thanh 2 (xué), "校" mang thanh 4 (xiào).'
      },
      {
        prompt: 'Từ "Thầy cô giáo" (老师) có phiên âm Pinyin chuẩn là:',
        options: ['lǎoshī', 'láoshī', 'lǎoshì', 'lāoshī'],
        correct: 0,
        explain: '"老" mang thanh 3 (lǎo), "师" mang thanh 1 (shī).'
      },
      {
        prompt: 'Từ "Trung Quốc" (中国) có phiên âm Pinyin chuẩn là:',
        options: ['Zhōngguó', 'Zhòngguó', 'Zhōngguò', 'Zhǒngguó'],
        correct: 0,
        explain: '"中" mang thanh 1 (zhōng), "国" mang thanh 2 (guó).'
      },
      {
        prompt: 'Từ "Uống nước" (喝水) có phiên âm chuẩn là:',
        options: ['hē shuǐ', 'hé shuǐ', 'hè shuǐ', 'hē shuì'],
        correct: 0,
        explain: '"喝" mang thanh 1 (hē), "水" mang thanh 3 (shuǐ).'
      },
      {
        prompt: 'Từ "Ăn cơm" (吃饭) có phiên âm chuẩn là:',
        options: ['chī fàn', 'chí fàn', 'chǐ fàn', 'chì fàn'],
        correct: 0,
        explain: '"吃" mang thanh 1 (chī), "饭" mang thanh 4 (fàn).'
      },
      {
        prompt: 'Vận mẫu đặc biệt "ü": Khi đi với "j, q, x", dấu hai chấm trên đầu ü sẽ:',
        options: ['Được lược bỏ (viết thành u nhưng vẫn đọc là uy)', 'Giữ nguyên dấu hai chấm', 'Chuyển thành chữ w', 'Chuyển thành chữ y'],
        correct: 0,
        explain: 'Quy tắc: j, q, x gặp ü thì bỏ 2 chấm nhưng vẫn phát âm là tròn môi "uy" (ju, qu, xu).'
      },
      {
        prompt: 'Từ "Bác sĩ" (医生) có phiên âm chuẩn là:',
        options: ['yīshēng', 'yíshēng', 'yǐshēng', 'yìshēng'],
        correct: 0,
        explain: 'Cả 2 chữ đều mang thanh 1: yīshēng.'
      },
      {
        prompt: 'Từ "Ngày mai" (明天) có phiên âm chuẩn là:',
        options: ['míngtiān', 'mǐngtiān', 'mìngtiān', 'mīngtiān'],
        correct: 0,
        explain: '"明" thanh 2 (míng), "天" thanh 1 (tiān).'
      },
      {
        prompt: 'Từ "Hôm qua" (昨天) có phiên âm chuẩn là:',
        options: ['zuótiān', 'zuòtiān', 'zuōtiān', 'zuǒtiān'],
        correct: 0,
        explain: '"昨" thanh 2 (zuó), "天" thanh 1 (tiān).'
      },
      {
        prompt: 'Từ "Hôm nay" (今天) có phiên âm chuẩn là:',
        options: ['jīntiān', 'jíntiān', 'jǐntiān', 'jìntiān'],
        correct: 0,
        explain: 'Cả 2 âm tiết đều mang thanh 1 bằng phẳng: jīntiān.'
      },
      {
        prompt: 'Từ "Xem sách" (看书) có phiên âm chuẩn là:',
        options: ['kàn shū', 'kān shū', 'kǎn shū', 'kàn shù'],
        correct: 0,
        explain: '"看" mang thanh 4 dứt khoát (kàn), "书" mang thanh 1 (shū).'
      },
      {
        prompt: 'Từ "Đi ngủ" (睡觉) có phiên âm chuẩn là:',
        options: ['shuìjiào', 'shuījiào', 'shuíjiào', 'shuǐjiào'],
        correct: 0,
        explain: 'Cả 2 chữ đều mang thanh 4 dứt khoát: shuìjiào.'
      },
      {
        prompt: 'Từ "Đi taxi" (出租车) có phiên âm chuẩn là:',
        options: ['chūzūchē', 'chúzūchē', 'chūzùchē', 'chūzūchě'],
        correct: 0,
        explain: 'Cả 3 chữ đều phát âm thanh 1: chū-zū-chē.'
      },
      {
        prompt: 'Từ "Máy bay" (飞机) có phiên âm chuẩn là:',
        options: ['fēijī', 'féijī', 'fěijī', 'fèijī'],
        correct: 0,
        explain: 'Cả 2 chữ đều mang thanh 1: fēijī.'
      },
      {
        prompt: 'Từ "Quả táo" (苹果) có phiên âm chuẩn là:',
        options: ['píngguǒ', 'pǐngguǒ', 'pīngguǒ', 'pìngguǒ'],
        correct: 0,
        explain: '"苹" mang thanh 2 (píng), "果" mang thanh 3 (guǒ).'
      }
    ]
  },

  // =========================================================================
  // 5. ✍️ KỸ NĂNG CHỮ HÁN & TỪ VỰNG (20 CÂU)
  // =========================================================================
  {
    id: 'hsk1-prac-hanzi',
    skill: 'hanzi',
    skillLabel: '✍️ Chữ Hán & Từ Vựng',
    level: 'HSK 1',
    title: 'Nhận Diện Bộ Thủ & Từ Vựng Cốt Lõi HSK 1',
    desc: 'Nhận diện các bộ thủ thông dụng (bộ Nhân đứng 亻, bộ Nữ 女, bộ Thủy 氵, bộ Khẩu 口) và phân biệt mặt chữ.',
    questionsCount: 20,
    questions: [
      {
        prompt: 'Chữ "你" (bạn) chứa bộ thủ biểu ý nào?',
        options: ['Bộ Nhân đứng (亻 - chỉ người)', 'Bộ Thủy (氵 - chỉ nước)', 'Bộ Mộc (木 - chỉ cây)', 'Bộ Hỏa (火 - chỉ lửa)'],
        correct: 0,
        explain: 'Chữ "你" gồm bộ Nhân đứng (亻) biểu thị đại từ xưng hô chỉ người.'
      },
      {
        prompt: 'Chữ "妈妈" (mẹ), "她" (cô ấy) đều chứa bộ thủ nào?',
        options: ['Bộ Nữ (女 - phụ nữ)', 'Bộ Khẩu (口 - miệng)', 'Bộ Nhật (日 - mặt trời)', 'Bộ Tâm (心 - tim/tâm tư)'],
        correct: 0,
        explain: 'Bộ Nữ (女) thường xuất hiện trong các danh từ chỉ phái nữ/người mẹ/chị em gái.'
      },
      {
        prompt: 'Chữ "喝" (uống), "吃" (ăn) đều chứa bộ thủ nào bên trái?',
        options: ['Bộ Khẩu (口 - miệng)', 'Bộ Thủy (氵 - nước)', 'Bộ Nhân (亻)', 'Bộ Môn (门 - cửa)'],
        correct: 0,
        explain: 'Hành động ăn/uống dùng miệng nên chứa bộ Khẩu (口).'
      },
      {
        prompt: 'Chữ "水" (nước) khi biến thành bộ thủ bên trái chữ Hán viết thành:',
        options: ['Bộ Ba chấm Thủy (氵)', 'Bộ Hỏa (灬)', 'Bộ Nhân (亻)', 'Bộ Mộc (木)'],
        correct: 0,
        explain: 'Bộ Ba chấm thủy (氵) biểu thị ý nghĩa liên quan đến sông ngòi, nước, chất lỏng.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Mặt trời / Ngày":',
        options: ['日 (rì)', '月 (yuè)', '水 (shuǐ)', '山 (shān)'],
        correct: 0,
        explain: '"日" (rì) là hình vẽ mặt trời, mang nghĩa mặt trời hoặc ngày.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Mặt trăng / Tháng":',
        options: ['月 (yuè)', '日 (rì)', '木 (mù)', '火 (huǒ)'],
        correct: 0,
        explain: '"月" (yuè) là hình trăng khuyết, mang nghĩa mặt trăng hoặc tháng trong năm.'
      },
      {
        prompt: 'Nét cơ bản đầu tiên khi viết chữ "一" (số 1) là nét gì?',
        options: ['Nét Ngang (一)', 'Nét Sổ (丨)', 'Nét Phẩy (丿)', 'Nét Chấm (丶)'],
        correct: 0,
        explain: 'Chữ "一" gồm một nét Ngang (Héng).'
      },
      {
        prompt: 'Chọn chữ Hán biểu thị chữ "Tôi / Bản thân":',
        options: ['我 (wǒ)', '你 (nǐ)', '他 (tā)', '们 (men)'],
        correct: 0,
        explain: '"我" (wǒ) là đại từ nhân xưng ngôi thứ nhất: Tôi / Mình / Em.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Sách":',
        options: ['书 (shū)', '包 (bāo)', '笔 (bǐ)', '桌 (zhuō)'],
        correct: 0,
        explain: '"书" (shū) là sách.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "To / Lớn":',
        options: ['大 (dà)', '小 (xiǎo)', '多 (duō)', '少 (shǎo)'],
        correct: 0,
        explain: '"大" (dà) nghĩa là to lớn, trái nghĩa với "小" (xiǎo - nhỏ).'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Nhỏ / Bé":',
        options: ['小 (xiǎo)', '大 (dà)', '多 (duō)', '少 (shǎo)'],
        correct: 0,
        explain: '"小" (xiǎo) nghĩa là nhỏ bé.'
      },
      {
        prompt: 'Chữ "明" trong "明天" (ngày mai) được ghép bởi 2 bộ thủ nào?',
        options: ['Nhật (日) và Nguyệt (月) - mặt trời và mặt trăng biểu thị ánh sáng', 'Kim và Mộc', 'Thủy và Hỏa', 'Nhân và Khẩu'],
        correct: 0,
        explain: 'Chữ "明" ghép từ 日 (mặt trời) và 月 (mặt trăng) tạo thành ý nghĩa quang minh, sáng sủa.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Trường học" (xuéxiào):',
        options: ['学校', '学生', '学友', '学习'],
        correct: 0,
        explain: '"学校" (xuéxiào) là trường học.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Cảm ơn" (xièxie):',
        options: ['谢谢', '客气', '对起', '再见'],
        correct: 0,
        explain: '"谢谢" (xièxie) nghĩa là cảm ơn.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Tạm biệt" (zàijiàn):',
        options: ['再见', '明天', '你好', '欢迎'],
        correct: 0,
        explain: '"再见" (zàijiàn) nghĩa là hẹn gặp lại / tạm biệt.'
      },
      {
        prompt: 'Chữ "休" (nghỉ ngơi) gồm bộ Nhân (亻- người) đứng tựa vào chữ Mộc (木 - cái cây). Đây là loại chữ gì?',
        options: ['Chữ hội ý (kết hợp ý nghĩa biểu thị người dựa vào cây nghỉ mát)', 'Chữ tượng hình', 'Chữ chỉ sự', 'Chữ giả tá'],
        correct: 0,
        explain: 'Người (亻) dựa vào cây (木) nghỉ ngơi là ví dụ kinh điển của chữ Hội ý trong Hán tự.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Đi" (qù):',
        options: ['去', '来', '买', '看'],
        correct: 0,
        explain: '"去" (qù) là đi tới đâu đó.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Đến / Lại đây" (lái):',
        options: ['来', '去', '坐', '回'],
        correct: 0,
        explain: '"来" (lái) là đến / lại.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Thích" (xǐhuan):',
        options: ['喜欢', '高兴', '漂亮', '认识'],
        correct: 0,
        explain: '"喜欢" (xǐhuan) là thích.'
      },
      {
        prompt: 'Chọn chữ Hán có nghĩa là "Quả táo" (píngguǒ):',
        options: ['苹果', '衣服', '杯子', '水杯'],
        correct: 0,
        explain: '"苹果" (píngguǒ) là quả táo, có bộ Thảo đầu (艹) chỉ loài thực vật/hoa quả.'
      }
    ]
  }
];
