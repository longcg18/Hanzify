// scripts/hsk_full_data/hsk2_exams.js
// Dữ liệu chuẩn 100% số lượng câu hỏi cho 2 đề HSK 2 (60 câu/đề = 120 câu)
// HSK 2: 50 phút, Thang điểm 200 (Nghe 100 + Đọc 100), Điểm đạt: 120

export const hsk2Exams = [
  {
    id: 'official-hsk2-01',
    title: 'Đề Thi Thử HSK 2 Toàn Diện - Đề Số 01 (H20901)',
    chineseTitle: '新汉语水平考试 HSK（二级）样卷一 H20901',
    level: 'HSK 2',
    duration: 50,
    passingScore: 120,
    maxScore: 200,
    tag: 'Đề Chuẩn Hanban',
    description: 'Đề thi chính thức HSK 2 mã H20901 chuẩn CTI/Hanban với đủ 60 câu hỏi chuẩn xác (35 câu Nghe + 25 câu Đọc), có Pinyin, audio script và giải thích chi tiết.',
    skills: [
      {
        id: 'hsk2-01-listen',
        skill_type: 'listening',
        name: 'Nghe hiểu',
        chinese_name: '听力',
        sort_order: 1,
        parts: [
          {
            id: 'hsk2-01-l-p1',
            part_number: 1,
            title: 'Phần 1 (Câu 1 - 10)',
            instructions: 'Nghe câu nói, phán đoán nội dung Đúng (√) hoặc Sai (✕) so với ý nghĩa câu miêu tả. Mỗi câu nghe 2 lần.',
            sort_order: 1,
            questions: [
              {
                question_number: 1,
                prompt: 'Phán đoán: "Anh ấy thích chơi bóng rổ vào buổi chiều." (他喜欢打篮球)',
                audio_text: '每天下午他都去打篮球。Měitiān xiàwǔ tā dōu qù dǎ lánqiú.',
                pinyin: 'Měitiān xiàwǔ tā dōu qù dǎ lánqiú.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: '"打篮球" (dǎ lánqiú) nghĩa là chơi bóng rổ. Trùng khớp với mô tả.'
              },
              {
                question_number: 2,
                prompt: 'Phán đoán: "Bây giờ thời tiết rất lạnh, muốn mặc áo dày." (天气很冷)',
                audio_text: '太热了，把西瓜切开吃吧。Tài rè le, bǎ xīguā qiē kāi chī ba.',
                pinyin: 'Tài rè le, bǎ xīguā qiē kāi chī ba.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Sai (错误 - ✕)',
                explanation: 'Băng nói: "太热了" (Nóng quá rồi), không phải lạnh (冷).'
              },
              {
                question_number: 3,
                prompt: 'Phán đoán: "Cô gái đang bơi lội." (正在游泳)',
                audio_text: '她游得真快，像一条小鱼。Tā yóu de zhēn kuài, xiàng yì tiáo xiǎoyú.',
                pinyin: 'Tā yóu de zhēn kuài, xiàng yì tiáo xiǎoyú.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: '"游得真快" nói về bơi lội ("游泳"). Đáp án Đúng.'
              },
              {
                question_number: 4,
                prompt: 'Phán đoán: "Họ đi xem phim cùng nhau." (一起看电影)',
                audio_text: '我们在教室里写作业呢。Wǒmen zài jiàoshì lǐ xiě zuòyè ne.',
                pinyin: 'Wǒmen zài jiàoshì lǐ xiě zuòyè ne.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Sai (错误 - ✕)',
                explanation: 'Họ đang làm bài tập ở lớp ("写作业"), không phải xem phim.'
              },
              {
                question_number: 5,
                prompt: 'Phán đoán: "Anh ấy đang gọi điện thoại cho bạn gái." (打电话)',
                audio_text: '喂，你现在到哪儿了？Wèi, nǐ xiànzài dào nǎr le?',
                pinyin: 'Wèi, nǐ xiànzài dào nǎr le?',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: 'Từ "喂" và hỏi vị trí là biểu hiện của nghe gọi điện thoại.'
              },
              {
                question_number: 6,
                prompt: 'Phán đoán: "Họ đang đi bộ tập thể dục." (正在走路散步)',
                audio_text: '路上车太多，我们跑步去吧。Lùshang chē tài duō, wǒmen pǎobù qù ba.',
                pinyin: 'Lùshang chē tài duō, wǒmen pǎobù qù ba.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Sai (错误 - ✕)',
                explanation: 'Băng nói: "跑步" (chạy bộ), không phải đi dạo ("走路散步").'
              },
              {
                question_number: 7,
                prompt: 'Phán đoán: "Người nói đang ở trên máy bay." (在飞机上)',
                audio_text: '先生，飞机马上要起飞了，请坐好。Xiānsheng, fēijī mǎshàng yào qǐfēi le, qǐng zuò hǎo.',
                pinyin: 'fēijī mǎshàng yào qǐfēi le, qǐng zuò hǎo.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: 'Tiếp viên thông báo máy bay sắp cất cánh ("飞机马上要起飞").'
              },
              {
                question_number: 8,
                prompt: 'Phán đoán: "Món cá này nấu rất cay." (鱼做得很辣)',
                audio_text: '这个鱼做得真好吃，一点儿也不辣。Zhège yú zuò de zhēn hǎochī, yìdiǎnr yě bù là.',
                pinyin: 'yìdiǎnr yě bù là.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Sai (错误 - ✕)',
                explanation: 'Băng nói: "一点儿也不辣" (Một chút cũng không cay), câu nhận định Sai.'
              },
              {
                question_number: 9,
                prompt: 'Phán đoán: "Cô ấy bị ốm phải uống thuốc." (生病吃药)',
                audio_text: '医生说这个药一天吃三次。Yīshēng shuō zhège yào yì tiān chī sān cì.',
                pinyin: 'zhège yào yì tiān chī sān cì.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: '"吃药" nghĩa là uống thuốc theo dặn dò của bác sĩ.'
              },
              {
                question_number: 10,
                prompt: 'Phán đoán: "Cửa hàng này bán trà sữa ngon." (卖奶茶)',
                audio_text: '这家商店有很多漂亮的旧书。Zhè jiā shāngdiàn yǒu hěn duō piàoliang de jiù shū.',
                pinyin: 'yǒu hěn duō piàoliang de jiù shū.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Sai (错误 - ✕)',
                explanation: 'Cửa hàng này bán sách cũ ("旧书"), không bán trà sữa.'
              }
            ]
          },
          {
            id: 'hsk2-01-l-p2',
            part_number: 2,
            title: 'Phần 2 (Câu 11 - 20)',
            instructions: 'Nghe đối thoại ngắn và chọn ngữ cảnh/hành động tương ứng từ A, B, C.',
            sort_order: 2,
            questions: [
              {
                question_number: 11,
                prompt: 'Nghe đối thoại và chọn việc họ đang làm:',
                audio_text: '女：今天我们吃羊肉怎么样？男：好啊，天冷吃羊肉最好。Jīntiān wǒmen chī yángròu zěnmeyàng? Hǎo a, tiān lěng chī yángròu zuì hǎo.',
                pinyin: 'Jīntiān wǒmen chī yángròu zěnmeyàng?',
                options: ['A. Ăn thịt cừu (吃羊肉)', 'B. Mua áo len (买毛衣)', 'C. Đi trượt tuyết (滑雪)'],
                correct_answer: 'A. Ăn thịt cừu (吃羊肉)',
                explanation: '"吃羊肉" là ăn thịt dê/cừu khi trời lạnh.'
              },
              {
                question_number: 12,
                prompt: 'Nghe đối thoại và chọn phương tiện di chuyển:',
                audio_text: '男：你怎么来公司的？女：今天路上堵车，我坐地铁来的。Nǐ zěnme lái gōngsī de? Jīntiān lùshang dǔchē, wǒ zuò dìtiě lái de.',
                pinyin: 'wǒ zuò dìtiě lái de.',
                options: ['A. Đi tàu điện ngầm (坐地铁)', 'B. Đi taxi (坐出租车)', 'C. Đi xe bus (坐公共汽车)'],
                correct_answer: 'A. Đi tàu điện ngầm (坐地铁)',
                explanation: 'Cô gái trả lời: "我坐地铁来的" (Tôi đi tàu điện ngầm tới).'
              },
              {
                question_number: 13,
                prompt: 'Nghe đối thoại và chọn đồ vật được tìm kiếm:',
                audio_text: '女：我的手表怎么找不到了？男：别着急，在床头柜上呢。Wǒ de shǒubiǎo zěnme zhǎobúdào le? Bié zháojí, zài chuángtóuguì shang ne.',
                pinyin: 'Wǒ de shǒubiǎo zěnme zhǎobúdào le?',
                options: ['A. 手表 (Đồng hồ đeo tay)', 'B. 手机 (Điện thoại)', 'C. 钥匙 (Chìa khóa)'],
                correct_answer: 'A. 手表 (Đồng hồ đeo tay)',
                explanation: '"手表" là đồng hồ đeo tay.'
              },
              {
                question_number: 14,
                prompt: 'Nghe đối thoại và chọn sở thích của cô gái:',
                audio_text: '男：你的汉语说得真好！女：谢谢，我每天早上都读课文。Nǐ de Hànyǔ shuō de zhēn hǎo! Xièxie, wǒ měitiān zǎoshang dōu dú kèwén.',
                pinyin: 'wǒ měitiān zǎoshang dōu dú kèwén.',
                options: ['A. Đọc bài khóa mỗi sáng', 'B. Xem phim hoạt hình', 'C. Nghe nhạc Trung Quốc'],
                correct_answer: 'A. Đọc bài khóa mỗi sáng',
                explanation: '"每天早上都读课文" là đọc bài khóa mỗi sáng.'
              },
              {
                question_number: 15,
                prompt: 'Nghe đối thoại và chọn loại phòng:',
                audio_text: '女：服务员，我想换一个安静的房间。男：好的，请稍等。Fúwùyuán, wǒ xiǎng huàn yí gè ānjìng de fángjiān. Hǎo de, qǐng shāoděng.',
                pinyin: 'wǒ xiǎng huàn yí gè ānjìng de fángjiān.',
                options: ['A. Phòng yên tĩnh (安静的房间)', 'B. Phòng có ban công', 'C. Phòng lớn tầng 1'],
                correct_answer: 'A. Phòng yên tĩnh (安静的房间)',
                explanation: '"安静的房间" là phòng yên tĩnh.'
              },
              {
                question_number: 16,
                prompt: 'Nghe đối thoại và chọn giá tiền món hàng:',
                audio_text: '男：这件黑色的多少钱？女：两百八十块。Zhè jiàn hēisè de duōshao qián? Liǎngbǎi bāshí kuài.',
                pinyin: 'Liǎngbǎi bāshí kuài.',
                options: ['A. 280 块', 'B. 180 块', 'C. 380 块'],
                correct_answer: 'A. 280 块',
                explanation: '"两百八十块" (280 đồng).'
              },
              {
                question_number: 17,
                prompt: 'Nghe đối thoại và chọn thời gian bắt đầu họp:',
                audio_text: '女：会议两点一刻开始，准备好了吗？男：都准备好了。Huìyì liǎng diǎn yí kè kāishǐ, zhǔnbèi hǎo le ma? Dōu zhǔnbèi hǎo le.',
                pinyin: 'liǎng diǎn yí kè kāishǐ',
                options: ['A. 2:15', 'B. 2:30', 'C. 2:45'],
                correct_answer: 'A. 2:15',
                explanation: '"两点一刻" là 2 giờ 15 phút (1 khắc = 15 phút).'
              },
              {
                question_number: 18,
                prompt: 'Nghe đối thoại và chọn lý do không đi du lịch:',
                audio_text: '男：周末去旅游吗？女：这几天眼睛不舒服，想在家休息。Zhōumò qù lǚyóu ma? Zhè jǐ tiān yǎnjing bù shūfu, xiǎng zài jiā xiūxi.',
                pinyin: 'yǎnjing bù shūfu, xiǎng zài jiā xiūxi.',
                options: ['A. Mắt không khỏe (眼睛不舒服)', 'B. Bận làm thêm giờ', 'C. Hết tiền chi tiêu'],
                correct_answer: 'A. Mắt không khỏe (眼睛不舒服)',
                explanation: '"眼睛不舒服" là mắt bị mỏi / không khỏe.'
              },
              {
                question_number: 19,
                prompt: 'Nghe đối thoại và chọn môn thể thao người nam rủ:',
                audio_text: '男：我们一起去踢足球吧？女：太热了，我不想去。Wǒmen yìqǐ qù tī zúqiú ba? Tài rè le, wǒ bù xiǎng qù.',
                pinyin: 'Wǒmen yìqǐ qù tī zúqiú ba?',
                options: ['A. Đá bóng (踢足球)', 'B. Chơi cầu lông (打羽毛球)', 'C. Đua thuyền (划船)'],
                correct_answer: 'A. Đá bóng (踢足球)',
                explanation: '"踢足球" là đá bóng.'
              },
              {
                question_number: 20,
                prompt: 'Nghe đối thoại và chọn loại hoa quả muốn mua:',
                audio_text: '女：桌子上的西瓜很甜，吃点儿吧。男：好，我正口渴呢。Zhuōzi shang de xīguā hěn tián, chī diǎnr ba. Hǎo, wǒ zhèng kǒukě ne.',
                pinyin: 'Zhuōzi shang de xīguā hěn tián',
                options: ['A. 西瓜 (Dưa hấu)', 'B. 苹果 (Táo)', 'C. 香蕉 (Chuối)'],
                correct_answer: 'A. 西瓜 (Dưa hấu)',
                explanation: '"西瓜" là dưa hấu.'
              }
            ]
          },
          {
            id: 'hsk2-01-l-p3',
            part_number: 3,
            title: 'Phần 3 (Câu 21 - 30)',
            instructions: 'Nghe đối thoại 2 lượt và trả lời câu hỏi trắc nghiệm A, B, C.',
            sort_order: 3,
            questions: [
              {
                question_number: 21,
                prompt: 'Hỏi: Người nam muốn đi đâu? (男的想去哪儿？)',
                audio_text: '男：请问去火车站怎么走？女：一直往前走，在第一个红绿灯右拐。Qǐngwèn qù huǒchēzhàn zěnme zǒu? Yìzhí wǎng qián zǒu, zài dì-yī gè hónglǜdēng yòuguǎi. 问：男的想去哪儿？',
                pinyin: 'Qǐngwèn qù huǒchēzhàn zěnme zǒu?',
                options: ['A. 火车站 (Ga tàu hỏa)', 'B. 飞机场 (Sân bay)', 'C. 汽车站 (Bến xe khách)'],
                correct_answer: 'A. 火车站 (Ga tàu hỏa)',
                explanation: 'Người nam hỏi đường đến ga tàu ("火车站").'
              },
              {
                question_number: 22,
                prompt: 'Hỏi: Họ gặp nhau lúc mấy giờ? (他们几点见面？)',
                audio_text: '女：明天早上八点半在校门口见，行吗？男：没问题，明天见。Míngtiān zǎoshang bā diǎn bàn zài xiàoménkǒu jiàn, xíng ma? Méi wèntí, míngtiān jiàn. 问：他们几点见面？',
                pinyin: 'bā diǎn bàn zài xiàoménkǒu jiàn',
                options: ['A. 8:00', 'B. 8:30', 'C. 9:00'],
                correct_answer: 'B. 8:30',
                explanation: '"八点半" là 8 giờ 30 phút.'
              },
              {
                question_number: 23,
                prompt: 'Hỏi: Người nữ muốn uống gì? (女的想喝什么？)',
                audio_text: '男：你想喝咖啡还是茶？女：给我一杯温水吧。Nǐ xiǎng hē kāfēi háishì chá? Gěi wǒ yì bēi wēnshuǐ ba. 问：女的想喝什么？',
                pinyin: 'Gěi wǒ yì bēi wēnshuǐ ba.',
                options: ['A. 咖啡 (Cà phê)', 'B. 茶 (Trà)', 'C. 温水 (Nước ấm)'],
                correct_answer: 'C. 温水 (Nước ấm)',
                explanation: 'Cô gái yêu cầu: "给我一杯温水吧" (Cho tôi một cốc nước ấm).'
              },
              {
                question_number: 24,
                prompt: 'Hỏi: Người nam cảm thấy bộ phim thế nào? (男的觉得电影怎么样？)',
                audio_text: '女：昨天的电影好看吗？男：太有意思了，演员演得特别好。Zuótiān de diànyǐng hǎokàn ma? Tài yǒu yìsi le, yǎnyuán yǎn de tèbié hǎo. 问：男的觉得电影怎么样？',
                pinyin: 'Tài yǒu yìsi le',
                options: ['A. 很有意思 (Rất hay/thú vị)', 'B. 不好看 (Không hay)', 'C. 太长了 (Quá dài)'],
                correct_answer: 'A. 很有意思 (Rất hay/thú vị)',
                explanation: '"太有意思了" (Cực kỳ thú vị).'
              },
              {
                question_number: 25,
                prompt: 'Hỏi: Bác sĩ khuyên bệnh nhân điều gì? (医生建议他做什么？)',
                audio_text: '女：你感冒了，要多喝水，按时吃药。男：好的，谢谢医生。Nǐ gǎnmào le, yào duō hē shuǐ, ànshí chī yào. Hǎo de, xièxie yīshēng. 问：医生建议他做什么？',
                pinyin: 'yào duō hē shuǐ, ànshí chī yào.',
                options: ['A. 多喝水按时吃药 (Uống nhiều nước và uống thuốc đúng giờ)', 'B. Đi chạy bộ thể thao', 'C. Đi làm tăng ca'],
                correct_answer: 'A. 多喝水按时吃药 (Uống nhiều nước và uống thuốc đúng giờ)',
                explanation: '"多喝水，按时吃药" là lời dặn dò của bác sĩ.'
              },
              {
                question_number: 26,
                prompt: 'Hỏi: Người nam đã học tiếng Trung được bao lâu? (男的学了多长时间汉语？)',
                audio_text: '女：你学汉语几年了？男：整整两年了。Nǐ xué Hànyǔ jǐ nián le? Zhěngzhěng liǎng nián le. 问：男的学了多长时间汉语？',
                pinyin: 'Zhěngzhěng liǎng nián le.',
                options: ['A. 一年 (1 năm)', 'B. 两年 (2 năm)', 'C. 三年 (3 năm)'],
                correct_answer: 'B. 两年 (2 năm)',
                explanation: '"两年" là 2 năm.'
              },
              {
                question_number: 27,
                prompt: 'Hỏi: Ai đang hát? (谁在唱歌？)',
                audio_text: '男：隔壁是谁在唱歌？女：是我妹妹，她很喜欢唱歌。Gébì shì shéi zài chànggē? Shì wǒ mèimei, tā hěn xǐhuan chànggē. 问：谁在唱歌？',
                pinyin: 'Shì wǒ mèimei',
                options: ['A. 妹妹 (Em gái)', 'B. 姐姐 (Chị gái)', 'C. 妈妈 (Mẹ)'],
                correct_answer: 'A. 妹妹 (Em gái)',
                explanation: '"是我妹妹" (Là em gái tôi).'
              },
              {
                question_number: 28,
                prompt: 'Hỏi: Chiếc váy này màu gì? (这条裙子是什么颜色的？)',
                audio_text: '女：你看这条红色的裙子好看吗？男：真漂亮，非常适合你。Nǐ kàn zhè tiáo hóngsè de qúnzi hǎokàn ma? Zhēn piàoliang, fēicháng shìhé nǐ. 问：这条裙子是什么颜色的？',
                pinyin: 'zhè tiáo hóngsè de qúnzi',
                options: ['A. 红色 (Màu đỏ)', 'B. 白色 (Màu trắng)', 'C. 黑色 (Màu đen)'],
                correct_answer: 'A. 红色 (Màu đỏ)',
                explanation: '"红色的裙子" là chiếc váy màu đỏ.'
              },
              {
                question_number: 29,
                prompt: 'Hỏi: Họ chuẩn bị đi phương tiện gì về nhà? (他们怎么回家？)',
                audio_text: '男：雨下得太大了，我们打车回去吧。女：好的，我叫一辆滴滴。Yǔ xià de tài dà le, wǒmen dǎchē huíqù ba. Hǎo de, wǒ jiào yí liàng Dīdī. 问：他们怎么回家？',
                pinyin: 'wǒmen dǎchē huíqù ba',
                options: ['A. 打车 (Đi taxi/gọi xe)', 'B. 走路 (Đi bộ)', 'C. 骑车 (Đi xe đạp)'],
                correct_answer: 'A. 打车 (Đi taxi/gọi xe)',
                explanation: '"打车" là bắt taxi.'
              },
              {
                question_number: 30,
                prompt: 'Hỏi: Người nam đang làm gì? (男的在做什么？)',
                audio_text: '女：小李，你快来看看这个题。男：等我两分钟，我正在洗碗呢。Xiǎo Lǐ, nǐ kuài lái kànkan zhège tí. Děng wǒ liǎng fēnzhōng, wǒ zhèngzài xǐ wǎn ne. 问：男的在做什么？',
                pinyin: 'wǒ zhèngzài xǐ wǎn ne.',
                options: ['A. 洗碗 (Rửa bát)', 'B. 做饭 (Nấu cơm)', 'C. 睡觉 (Ngủ)'],
                correct_answer: 'A. 洗碗 (Rửa bát)',
                explanation: '"洗碗" là rửa bát chén.'
              }
            ]
          },
          {
            id: 'hsk2-01-l-p4',
            part_number: 4,
            title: 'Phần 4 (Câu 31 - 35)',
            instructions: 'Nghe đối thoại dài hơn (4-5 lượt) và trả lời câu hỏi trắc nghiệm.',
            sort_order: 4,
            questions: [
              {
                question_number: 31,
                prompt: 'Hỏi: Người nữ mua những gì? (女的买了什么？)',
                audio_text: '男：你买什么了？女：我买了两斤苹果和一些西红柿。男：一共多少钱？女：二十五块。问：女的买了什么？',
                pinyin: 'Wǒ mǎi le liǎng jīn píngguǒ hé yìxiē xīhóngshì.',
                options: ['A. 苹果和西红柿 (Táo và cà chua)', 'B. 香蕉和西瓜 (Chuối và dưa hấu)', 'C. 面条和米饭 (Mì và cơm)'],
                correct_answer: 'A. 苹果和西红柿 (Táo và cà chua)',
                explanation: '"两斤苹果和一些西红柿" là 2 cân táo và một ít cà chua.'
              },
              {
                question_number: 32,
                prompt: 'Hỏi: Người nữ nghĩ công việc mới thế nào? (女的觉得新工作怎么样？)',
                audio_text: '男：你的新工作怎么样？累不累？女：虽然有点儿忙，但是同事们都很热情，我很喜欢。男：那就好，好好干！问：女的觉得新工作怎么样？',
                pinyin: 'Suīrán yǒudiǎnr máng, dànshì tóngshìmen dōu hěn rèqíng',
                options: ['A. 很喜欢 (Rất thích)', 'B. 很无聊 (Rất chán)', 'C. 工资低 (Lương thấp)'],
                correct_answer: 'A. 很喜欢 (Rất thích)',
                explanation: 'Cô ấy nói: "我很喜欢" (Tôi rất thích).'
              },
              {
                question_number: 33,
                prompt: 'Hỏi: Máy tính của người nam bị làm sao? (男的的电脑怎么了？)',
                audio_text: '女：小张，你怎么不用电脑？男：我的电脑坏了，开不了机。女：那送去修一下吧。男：好的，我下午去。问：男的的电脑怎么了？',
                pinyin: 'Wǒ de diànnǎo huài le, kāi bù liǎo jī.',
                options: ['A. 坏了开不了机 (Bị hỏng không bật được)', 'B. 被偷了 (Bị mất trộm)', 'C. 卖掉了 (Đã bán đi)'],
                correct_answer: 'A. 坏了开不了机 (Bị hỏng không bật được)',
                explanation: '"电脑坏了，开不了机" là máy tính hỏng không mở lên được.'
              },
              {
                question_number: 34,
                prompt: 'Hỏi: Họ hẹn nhau đi đâu vào cuối tuần? (他们周末打算去哪儿？)',
                audio_text: '男：周末有空吗？我们去爬山吧。女：天气预报说周六有雨。男：那周日去吧，周日是晴天。女：好的，一言为定。问：他们打算周几去爬山？',
                pinyin: 'Nà zhōurì qù ba, zhōurì shì qíngtiān.',
                options: ['A. 周六 (Thứ 7)', 'B. 周日 (Chủ nhật)', 'C. 周五 (Thứ 6)'],
                correct_answer: 'B. 周日 (Chủ nhật)',
                explanation: 'Chủ nhật trời nắng nên họ quyết định đi vào "周日" (Chủ nhật).'
              },
              {
                question_number: 35,
                prompt: 'Hỏi: Ai bị sốt? (谁发烧了？)',
                audio_text: '女：王经理，我今天想请假。男：怎么了？小陈。女：我儿子发烧了，三十九度，我想带他去医院。男：快去吧，注意身体。问：谁发烧了？',
                pinyin: 'Wǒ érzi fāshāo le, sānshíjiǔ dù',
                options: ['A. 小陈的儿子 (Con trai của Tiểu Trần)', 'B. 小陈 (Tiểu Trần)', 'C. 王经理 (Giám đốc Vương)'],
                correct_answer: 'A. 小陈的儿子 (Con trai của Tiểu Trần)',
                explanation: '"我儿子发烧了" -> Người bị sốt là con trai cô ấy.'
              }
            ]
          }
        ]
      },
      {
        id: 'hsk2-01-read',
        skill_type: 'reading',
        name: 'Đọc hiểu',
        chinese_name: '阅读',
        sort_order: 2,
        parts: [
          {
            id: 'hsk2-01-r-p1',
            part_number: 1,
            title: 'Phần 1 (Câu 36 - 40)',
            instructions: 'Đọc câu văn và chọn bức tranh/ngữ cảnh miêu tả tương ứng.',
            sort_order: 1,
            questions: [
              {
                question_number: 36,
                prompt: 'Chọn nội dung phù hợp: "这条裙子太长了，有短一点儿的吗？"',
                reading_text: '这条裙子太长了，有短一点儿的吗？Zhè tiáo qúnzi tài cháng le, yǒu duǎn yìdiǎnr de ma?',
                pinyin: 'Zhè tiáo qúnzi tài cháng le, yǒu duǎn yìdiǎnr de ma?',
                options: ['A. Thử váy và hỏi đổi cỡ ngắn hơn', 'B. Mua giày chạy bộ', 'C. Ăn cơm ở nhà hàng'],
                correct_answer: 'A. Thử váy và hỏi đổi cỡ ngắn hơn',
                explanation: '"裙子太长" (váy quá dài), "短一点儿" (ngắn hơn một chút).'
              },
              {
                question_number: 37,
                prompt: 'Chọn nội dung phù hợp: "外面正在下雪，白茫茫的一片。"',
                reading_text: '外面正在下雪，白茫茫的一片。Wàimiàn zhèngzài xià xuě, bái mángmáng de yí piàn.',
                pinyin: 'Wàimiàn zhèngzài xià xuě',
                options: ['A. Cảnh tuyết rơi trắng xóa ngoài trời', 'B. Bãi biển nắng vàng rực rỡ', 'C. Rừng cây mùa thu lá đỏ'],
                correct_answer: 'A. Cảnh tuyết rơi trắng xóa ngoài trời',
                explanation: '"下雪" là tuyết rơi.'
              },
              {
                question_number: 38,
                prompt: 'Chọn nội dung phù hợp: "别看手机了，快去睡觉吧。"',
                reading_text: '别看手机了，快去睡觉吧。Bié kàn shǒujī le, kuài qù shuìjiào ba.',
                pinyin: 'Bié kàn shǒujī le, kuài qù shuìjiào ba.',
                options: ['A. Nhắc nhở buông điện thoại đi ngủ', 'B. Xem tivi cùng gia đình', 'C. Thức dậy chuẩn bị đi làm'],
                correct_answer: 'A. Nhắc nhở buông điện thoại đi ngủ',
                explanation: '"别看手机" (Đừng xem điện thoại nữa), "快去睡觉" (Mau đi ngủ đi).'
              },
              {
                question_number: 39,
                prompt: 'Chọn nội dung phù hợp: "他每天早上都坚持跑五公里。"',
                reading_text: '他每天早上都坚持跑五公里。Tā měitiān zǎoshang dōu jiānchí pǎo wǔ gōnglǐ.',
                pinyin: 'pǎo wǔ gōnglǐ',
                options: ['A. Tập chạy bộ buổi sáng', 'B. Ngồi uống cà phê đọc báo', 'C. Đi câu cá bên bờ sông'],
                correct_answer: 'A. Tập chạy bộ buổi sáng',
                explanation: '"跑五公里" nghĩa là chạy 5 km.'
              },
              {
                question_number: 40,
                prompt: 'Chọn nội dung phù hợp: "请大家打开书，翻到第二十页。"',
                reading_text: '请大家打开书，翻到第二十页。Qǐng dàjiā dǎkāi shū, fāndào dì-èrshí yè.',
                pinyin: 'dǎkāi shū, fāndào dì-èrshí yè.',
                options: ['A. Giáo viên yêu cầu mở sách trang 20', 'B. Học sinh chơi bóng rổ', 'C. Nấu món ăn Trung Quốc'],
                correct_answer: 'A. Giáo viên yêu cầu mở sách trang 20',
                explanation: '"打开书，翻到第二十页" là mở sách lật đến trang 20.'
              }
            ]
          },
          {
            id: 'hsk2-01-r-p2',
            part_number: 2,
            title: 'Phần 2 (Câu 41 - 45)',
            instructions: 'Chọn từ vựng thích hợp điền vào chỗ trống trong câu.',
            sort_order: 2,
            questions: [
              {
                question_number: 41,
                prompt: 'Điền từ: 天阴了，马上要_____了，出门记得带伞。',
                reading_text: '天阴了，马上要_____了，出门记得带伞。Tiān yīn le, mǎshàng yào _____ le, chūmén jìde dài sǎn.',
                pinyin: 'Tiān yīn le, mǎshàng yào _____ le',
                options: ['A. 下雨 (mưa)', 'B. 跑步 (chạy bộ)', 'C. 唱歌 (hát)'],
                correct_answer: 'A. 下雨 (mưa)',
                explanation: 'Trời râm "天阴", mang ô "带伞" thì hành động tiếp theo là trời sắp mưa "下雨".'
              },
              {
                question_number: 42,
                prompt: 'Điền từ: 妈妈做的中国菜_____好吃！',
                reading_text: '妈妈做的中国菜_____好吃！Māma zuò de Zhōngguócài _____ hǎochī!',
                pinyin: 'zuò de Zhōngguócài _____ hǎochī!',
                options: ['A. 非常 (vô cùng / rất)', 'B. 正在 (đang)', 'C. 一起 (cùng nhau)'],
                correct_answer: 'A. 非常 (vô cùng / rất)',
                explanation: 'Phó từ chỉ mức độ "非常" đứng trước tính từ "好吃".'
              },
              {
                question_number: 43,
                prompt: 'Điền từ: 我能_____一下你的自行车吗？',
                reading_text: '我能_____一下你的自行车吗？Wǒ néng _____ yíxià nǐ de zìxíngchē ma?',
                pinyin: 'Wǒ néng _____ yíxià nǐ de zìxíngchē ma?',
                options: ['A. 借 (mượn)', 'B. 买 (mua)', 'C. 卖 (bán)'],
                correct_answer: 'A. 借 (mượn)',
                explanation: 'Mượn xe đạp đi dùng động từ "借" (jiè).'
              },
              {
                question_number: 44,
                prompt: 'Điền từ: 你怎么了？哪儿不_____？',
                reading_text: '你怎么了？哪儿不_____？Nǐ zěnme le? Nǎr bù _____?',
                pinyin: 'Nǐ zěnme le? Nǎr bù _____?',
                options: ['A. 舒服 (dễ chịu / khỏe)', 'B. 漂亮 (xinh đẹp)', 'C. 便宜 (rẻ)'],
                correct_answer: 'A. 舒服 (dễ chịu / khỏe)',
                explanation: 'Hỏi thăm sức khỏe dùng "哪儿不舒服？" (Trong người khó chịu chỗ nào?).'
              },
              {
                question_number: 45,
                prompt: 'Điền từ: 喂，请问王经理在_____吗？',
                reading_text: '喂，请问王经理在_____吗？Wèi, qǐngwèn Wáng jīnglǐ zài _____ ma?',
                pinyin: 'qǐngwèn Wáng jīnglǐ zài _____ ma?',
                options: ['A. 办公室 (văn phòng)', 'B. 苹果 (quả táo)', 'C. 颜色 (màu sắc)'],
                correct_answer: 'A. 办公室 (văn phòng)',
                explanation: 'Hỏi người quản lý có ở văn phòng làm việc không: "在办公室吗".'
              }
            ]
          },
          {
            id: 'hsk2-01-r-p3',
            part_number: 3,
            title: 'Phần 3 (Câu 46 - 50)',
            instructions: 'Đọc đoạn văn ngắn và phán đoán nhận định Đúng (√) hoặc Sai (✕).',
            sort_order: 3,
            questions: [
              {
                question_number: 46,
                prompt: 'Phán đoán nhận định: "Anh ấy không muốn đi du lịch."',
                reading_text: '我想去北京旅游，因为我特别喜欢故宫和长城。★ 他不想去北京。（ ）',
                pinyin: 'Wǒ xiǎng qù Běijīng lǚyóu... Tā bù xiǎng qù Běijīng.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Sai (错误 - ✕)',
                explanation: 'Bài viết "我想去北京" (Tôi muốn đi), nhận định nói "不想去" là Sai.'
              },
              {
                question_number: 47,
                prompt: 'Phán đoán nhận định: "Tiểu Trương đã tìm được chìa khóa."',
                reading_text: '小张把房间找了个遍，最后在沙发下面找到了钥匙。★ 小张找到钥匙了。（ ）',
                pinyin: 'zài shāfā xiàmiàn zhǎodào le yàoshi... Xiǎo Zhāng zhǎodào yàoshi le.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: 'Bài viết "找到了钥匙" (Đã tìm thấy chìa khóa). Nhận định Đúng.'
              },
              {
                question_number: 48,
                prompt: 'Phán đoán nhận định: "Hôm nay em gái đến lớp đúng giờ."',
                reading_text: '今天早上妹妹起晚了，没赶上公共汽车，上课迟到了。★ 妹妹没迟到。（ ）',
                pinyin: 'shàngkè chídào le... Mèimei méi chídào.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Sai (错误 - ✕)',
                explanation: 'Bài nói em gái bị muộn "迟到了", nhận định nói "没迟到" là Sai.'
              },
              {
                question_number: 49,
                prompt: 'Phán đoán nhận định: "Món ăn ở quán này ngon và giá cả hợp lý."',
                reading_text: '这家饭馆的菜不仅味道好，而且价格很便宜，我们经常来。★ 这里的菜很便宜。（ ）',
                pinyin: 'jiàgé hěn piányi... Zhèlǐ de cài hěn piányi.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: 'Bài viết: "价格很便宜" (Giá rất rẻ). Nhận định Đúng.'
              },
              {
                question_number: 50,
                prompt: 'Phán đoán nhận định: "Bác sĩ khuyên anh ấy không nên uống cà phê buổi tối."',
                reading_text: '医生对他说：晚上喝咖啡容易睡不着觉，最好喝一杯热牛奶。★ 晚上可以多喝咖啡。（ ）',
                pinyin: 'Wǎnshang hē kāfēi róngyì shuìbuzháo jiào... Wǎnshang kěyǐ duō hē kāfēi.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Sai (错误 - ✕)',
                explanation: 'Bác sĩ bảo tối uống cà phê dễ mất ngủ, nhận định bảo có thể uống nhiều là Sai.'
              }
            ]
          },
          {
            id: 'hsk2-01-r-p4',
            part_number: 4,
            title: 'Phần 4 (Câu 51 - 60)',
            instructions: 'Đọc câu văn và chọn câu ghép logic tương thích nhất.',
            sort_order: 4,
            questions: [
              {
                question_number: 51,
                prompt: 'Ghép câu tương thích cho: "时间过得真快，"',
                reading_text: '时间过得真快，Shíjiān guò de zhēn kuài,',
                pinyin: 'Shíjiān guò de zhēn kuài,',
                options: ['A. 一年又过去了。(lại một năm nữa trôi qua rồi.)', 'B. 我买了一个苹果。(tôi mua một quả táo.)', 'C. 太阳很大。(mặt trời rất to.)'],
                correct_answer: 'A. 一年又过去了。(lại một năm nữa trôi qua rồi.)',
                explanation: '"Thời gian trôi nhanh thật, lại một năm trôi qua rồi."'
              },
              {
                question_number: 52,
                prompt: 'Ghép câu tương thích cho: "虽然外面雨很大，"',
                reading_text: '虽然外面雨很大，Suīrán wàimiàn yǔ hěn dà,',
                pinyin: 'Suīrán wàimiàn yǔ hěn dà,',
                options: ['A. 但是他还是去上班了。(nhưng anh ấy vẫn đi làm.)', 'B. 所以天气很热。(nên trời rất nóng.)', 'C. 他在游泳。(anh ấy đang bơi.)'],
                correct_answer: 'A. 但是他还是去上班了。(nhưng anh ấy vẫn đi làm.)',
                explanation: 'Cấu trúc biểu thị chuyển ý "虽然……但是……" (Tuy... nhưng...).'
              },
              {
                question_number: 53,
                prompt: 'Ghép câu tương thích cho: "你要吃苹果"',
                reading_text: '你要吃苹果 Nǐ yào chī píngguǒ',
                pinyin: 'Nǐ yào chī píngguǒ',
                options: ['A. 还是吃香蕉？(hay là ăn chuối?)', 'B. 都在桌子上。(đều ở trên bàn.)', 'C. 非常好看。(rất đẹp mắt.)'],
                correct_answer: 'A. 还是吃香蕉？(hay là ăn chuối?)',
                explanation: 'Câu hỏi lựa chọn với liên từ "还是".'
              },
              {
                question_number: 54,
                prompt: 'Ghép câu tương thích cho: "因为今天没有课，"',
                reading_text: '因为今天没有课，Yīnwèi jīntiān méiyǒu kè,',
                pinyin: 'Yīnwèi jīntiān méiyǒu kè,',
                options: ['A. 所以我想多睡一会儿。(nên tôi muốn ngủ thêm một lát.)', 'B. 他在教室学习。(anh ấy học ở lớp.)', 'C. 老师来了。(thầy giáo đến rồi.)'],
                correct_answer: 'A. 所以我想多睡一会儿。(nên tôi muốn ngủ thêm một lát.)',
                explanation: 'Cặp liên từ nguyên nhân - kết quả "因为……所以……"'
              },
              {
                question_number: 55,
                prompt: 'Ghép câu tương thích cho: "这道题太难了，"',
                reading_text: '这道题太难了，Zhè dào tí tài nán le,',
                pinyin: 'Zhè dào tí tài nán le,',
                options: ['A. 我不会做。(tôi không biết làm.)', 'B. 很好喝。(rất ngon.)', 'C. 已经饱了。(đã no rồi.)'],
                correct_answer: 'A. 我不会做。(tôi không biết làm.)',
                explanation: 'Bài tập khó quá "太难了" nên không biết làm "不会做".'
              },
              {
                question_number: 56,
                prompt: 'Ghép câu tương thích cho: "小猫生病了，"',
                reading_text: '小猫生病了，Xiǎomāo shēngbìng le,',
                pinyin: 'Xiǎomāo shēngbìng le,',
                options: ['A. 今天不吃东西。(hôm nay không chịu ăn gì.)', 'B. 它在跑得快。(nó chạy rất nhanh.)', 'C. 衣服真漂亮。(quần áo rất đẹp.)'],
                correct_answer: 'A. 今天不吃东西。(hôm nay không chịu ăn gì.)',
                explanation: 'Mèo ốm thì mệt mỏi không ăn gì.'
              },
              {
                question_number: 57,
                prompt: 'Ghép câu tương thích cho: "请问去洗手间"',
                reading_text: '请问去洗手间 Qǐngwèn qù xǐshǒujiān',
                pinyin: 'Qǐngwèn qù xǐshǒujiān',
                options: ['A. 怎么走？(đi như thế nào?)', 'B. 多少钱？(bao nhiêu tiền?)', 'C. 几岁了？(mấy tuổi rồi?)'],
                correct_answer: 'A. 怎么走？(đi như thế nào?)',
                explanation: 'Hỏi đường đi nhà vệ sinh: "请问去洗手间怎么走？"'
              },
              {
                question_number: 58,
                prompt: 'Ghép câu tương thích cho: "我听不懂他说的话，"',
                reading_text: '我听不懂他说的话，Wǒ tīngbudǒng tā shuō de huà,',
                pinyin: 'Wǒ tīngbudǒng tā shuō de huà,',
                options: ['A. 因为他说得太快了。(bởi vì anh ấy nói nhanh quá.)', 'B. 声音太小了。(âm thanh quá nhỏ.)', 'C. 汉字很难写。(chữ Hán khó viết.)'],
                correct_answer: 'A. 因为他说得太快了。(bởi vì anh ấy nói nhanh quá.)',
                explanation: 'Nói quá nhanh dẫn đến không nghe kịp hiểu.'
              },
              {
                question_number: 59,
                prompt: 'Ghép câu tương thích cho: "下班以后，"',
                reading_text: '下班以后，Xiàbān yǐhòu,',
                pinyin: 'Xiàbān yǐhòu,',
                options: ['A. 我们一起去喝杯咖啡吧。(chúng ta cùng đi uống tách cà phê nhé.)', 'B. 正在上班呢。(đang đi làm.)', 'C. 早上好。(chào buổi sáng.)'],
                correct_answer: 'A. 我们一起去喝杯咖啡吧。(chúng ta cùng đi uống tách cà phê nhé.)',
                explanation: 'Tan sở sau đó rủ đi uống cà phê thư giãn.'
              },
              {
                question_number: 60,
                prompt: 'Ghép câu tương thích cho: "祝你生日快乐，"',
                reading_text: '祝你生日快乐，Zhù nǐ shēngrì kuàilè,',
                pinyin: 'Zhù nǐ shēngrì kuàilè,',
                options: ['A. 这是送给你的礼物！(đây là món quà tặng bạn!)', 'B. 再见！(tạm biệt!)', 'C. 没关系！(không sao!)'],
                correct_answer: 'A. 这是送给你的礼物！(đây là món quà tặng bạn!)',
                explanation: 'Chúc mừng sinh nhật đi kèm tặng quà: "这是送给你的礼物".'
              }
            ]
          }
        ]
      }
    ]
  },

  // ĐỀ THI HSK 2 - ĐỀ SỐ 02 (H21330) - 60 CÂU ĐẦY ĐỦ
  {
    id: 'official-hsk2-02',
    title: 'Đề Thi Thử HSK 2 Toàn Diện - Đề Số 02 (H21330)',
    chineseTitle: '新汉语水平考试 HSK（二级）样卷二 H21330',
    level: 'HSK 2',
    duration: 50,
    passingScore: 120,
    maxScore: 200,
    tag: 'Đề Chuẩn Hanban',
    description: 'Đề thi chính thức HSK 2 mã H21330 chuẩn CTI/Hanban với trọn vẹn 60 câu hỏi (Nghe 1-35, Đọc 36-60), đầy đủ Pinyin, audio text và giải thích chi tiết.',
    skills: [
      {
        id: 'hsk2-02-listen',
        skill_type: 'listening',
        name: 'Nghe hiểu',
        chinese_name: '听力',
        sort_order: 1,
        parts: [
          {
            id: 'hsk2-02-l-p1',
            part_number: 1,
            title: 'Phần 1 (Câu 1 - 10)',
            instructions: 'Nghe câu nói, phán đoán tính đúng sai Đúng (√) hoặc Sai (✕).',
            sort_order: 1,
            questions: [
              {
                question_number: 1,
                prompt: 'Phán đoán: "Anh ấy đang đọc sách trong phòng." (在房间看书)',
                audio_text: '房间里很安静，他在看书呢。Fángjiān lǐ hěn ānjìng, tā zài kàn shū ne.',
                pinyin: 'tā zài kàn shū ne.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: '"在看书" nghĩa là đang đọc sách.'
              },
              {
                question_number: 2,
                prompt: 'Phán đoán: "Họ đang đi xem phim." (去电影院)',
                audio_text: '我们坐出租车去火车站接人。Wǒmen zuò chūzūchē qù huǒchēzhàn jiē rén.',
                pinyin: 'qù huǒchēzhàn jiē rén.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Sai (错误 - ✕)',
                explanation: 'Họ đi ga tàu đón người ("火车站接人"), không phải đi xem phim.'
              },
              {
                question_number: 3,
                prompt: 'Phán đoán: "Cô ấy thích ăn táo." (喜欢吃苹果)',
                audio_text: '这些苹果又大又甜，她非常喜欢。Zhèxiē píngguǒ yòu dà yòu tián, tā fēicháng xǐhuan.',
                pinyin: 'tā fēicháng xǐhuan.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: '"非常喜欢" táo to và ngọt.'
              },
              {
                question_number: 4,
                prompt: 'Phán đoán: "Hôm nay trời nắng đẹp." (晴天)',
                audio_text: '外面风太大了，天阴沉沉的。Wàimiàn fēng tài dà le, tiān yīnchénchén de.',
                pinyin: 'fēng tài dà le, tiān yīnchénchén de.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Sai (错误 - ✕)',
                explanation: 'Gió to trời u ám, không phải trời nắng đẹp.'
              },
              {
                question_number: 5,
                prompt: 'Phán đoán: "Em trai đang đá bóng." (踢足球)',
                audio_text: '弟弟正在操场上踢足球呢。Dìdi zhèngzài cāochǎng shang tī zúqiú ne.',
                pinyin: 'zhèngzài cāochǎng shang tī zúqiú ne.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: '"踢足球" là đá bóng.'
              },
              {
                question_number: 6,
                prompt: 'Phán đoán: "Cô ấy mua áo len màu trắng." (白色的)',
                audio_text: '她买了一件黑色的衣服。Tā mǎi le yí jiàn hēisè de yīfu.',
                pinyin: 'hēisè de yīfu.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Sai (错误 - ✕)',
                explanation: 'Băng đọc "黑色" (màu đen), không phải màu trắng.'
              },
              {
                question_number: 7,
                prompt: 'Phán đoán: "Bây giờ là 7 giờ sáng." (早上七点)',
                audio_text: '闹钟响了，刚好七点整。Nàozhōng xiǎng le, gānghǎo qī diǎn zhěng.',
                pinyin: 'gānghǎo qī diǎn zhěng.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: '"七点整" là 7 giờ đúng.'
              },
              {
                question_number: 8,
                prompt: 'Phán đoán: "Món canh này rất mặn." (汤很咸)',
                audio_text: '这个汤很淡，需要再加点儿盐。Zhège tāng hěn dàn, xūyào zài jiā diǎnr yán.',
                pinyin: 'Zhège tāng hěn dàn',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Sai (错误 - ✕)',
                explanation: '"淡" là nhạt cần thêm muối, không phải mặn.'
              },
              {
                question_number: 9,
                prompt: 'Phán đoán: "Anh ấy đang bơi lội." (游泳)',
                audio_text: '水里太凉了，他马上跳进了泳池。Shuǐ lǐ tài liáng le, tā mǎshàng tiàojìn le yǒngchí.',
                pinyin: 'tiàojìn le yǒngchí.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: '"跳进泳池" nhảy vào bể bơi để bơi lội.'
              },
              {
                question_number: 10,
                prompt: 'Phán đoán: "Chiếc xe đạp này mới mua." (新买的)',
                audio_text: '这辆自行车我已经骑了五年了。Zhè liàng zìxíngchē wǒ yǐjīng qí le wǔ nián le.',
                pinyin: 'yǐjīng qí le wǔ nián le.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Sai (错误 - ✕)',
                explanation: 'Đã đi được 5 năm ("五年了"), không phải xe mới mua.'
              }
            ]
          },
          {
            id: 'hsk2-02-l-p2',
            part_number: 2,
            title: 'Phần 2 (Câu 11 - 20)',
            instructions: 'Nghe đoạn hội thoại và chọn đáp án thích hợp.',
            sort_order: 2,
            questions: [
              {
                question_number: 11,
                prompt: 'Nghe đối thoại và chọn việc họ đang làm:',
                audio_text: '女：服务员，来一盘炒鸡蛋。男：好的，请稍等，马上就来。Fúwùyuán, lái yì pán chǎo jīdàn. Hǎo de, qǐng shāoděng, mǎshàng jiù lái.',
                pinyin: 'chǎo jīdàn',
                options: ['A. Gọi món trứng xào (点炒鸡蛋)', 'B. Mua vé tàu (买火车票)', 'C. Đổi tiền (换钱)'],
                correct_answer: 'A. Gọi món trứng xào (点炒鸡蛋)',
                explanation: '"炒鸡蛋" là món trứng xào.'
              },
              {
                question_number: 12,
                prompt: 'Nghe đối thoại và chọn địa điểm:',
                audio_text: '男：医生，我的头有点儿疼。女：来，我先量一下体温。Yīshēng, wǒ de tóu yǒudiǎnr téng. Lái, wǒ xiān liáng yíxià tǐwēn.',
                pinyin: 'wǒ de tóu yǒudiǎnr téng',
                options: ['A. 医院 (Bệnh viện)', 'B. 商店 (Cửa hàng)', 'C. 银行 (Ngân hàng)'],
                correct_answer: 'A. 医院 (Bệnh viện)',
                explanation: '"医生" (bác sĩ), "量体温" (đo thân nhiệt).'
              },
              {
                question_number: 13,
                prompt: 'Nghe đối thoại và chọn phương tiện:',
                audio_text: '女：怎么去机场最快？男：坐机场大巴或者地铁。Zěnme qù jīchǎng zuì kuài? Zuò jīchǎng dàbā huòzhě dìtiě.',
                pinyin: 'Zuò jīchǎng dàbā huòzhě dìtiě.',
                options: ['A. 地铁 (Tàu điện ngầm)', 'B. 骑车 (Đi xe đạp)', 'C. 走路 (Đi bộ)'],
                correct_answer: 'A. 地铁 (Tàu điện ngầm)',
                explanation: '"地铁" là tàu điện ngầm.'
              },
              {
                question_number: 14,
                prompt: 'Nghe đối thoại và chọn giá bán:',
                audio_text: '男：这本词典多少钱？女：六十块一本。Zhè běn cídiǎn duōshao qián? Liùshí kuài yì běn.',
                pinyin: 'Liùshí kuài yì běn.',
                options: ['A. 60 块', 'B. 50 块', 'C. 80 块'],
                correct_answer: 'A. 60 块',
                explanation: '"六十块" (60 đồng).'
              },
              {
                question_number: 15,
                prompt: 'Nghe đối thoại và chọn đồ uống:',
                audio_text: '女：喝点儿绿茶吧。男：好的，谢谢，正想喝点热的。Hē diǎnr lǜchá ba. Hǎo de, xièxie, zhèng xiǎng hē diǎn rè de.',
                pinyin: 'Hē diǎnr lǜchá ba.',
                options: ['A. 绿茶 (Trà xanh)', 'B. 可乐 (Coca)', 'C. 牛奶 (Sữa)'],
                correct_answer: 'A. 绿茶 (Trà xanh)',
                explanation: '"绿茶" là trà xanh.'
              },
              {
                question_number: 16,
                prompt: 'Nghe đối thoại và chọn địa điểm gặp gỡ:',
                audio_text: '男：我们在哪儿等小王？女：在图书馆门口吧。Wǒmen zài nǎr děng Xiǎo Wáng? Zài túshūguǎn ménkǒu ba.',
                pinyin: 'Zài túshūguǎn ménkǒu ba.',
                options: ['A. 图书馆门口 (Cổng thư viện)', 'B. 宿舍楼下 (Dưới ký túc xá)', 'C. 教室里 (Trong lớp học)'],
                correct_answer: 'A. 图书馆门口 (Cổng thư viện)',
                explanation: '"图书馆门口" là cổng thư viện.'
              },
              {
                question_number: 17,
                prompt: 'Nghe đối thoại và chọn thời gian:',
                audio_text: '女：火车什么时候开？男：还有十分钟，八点十分开。Huǒchē shénme shíhou kāi? Hái yǒu shí fēnzhōng, bā diǎn shí fēn kāi.',
                pinyin: 'bā diǎn shí fēn kāi.',
                options: ['A. 8:10', 'B. 8:00', 'C. 8:20'],
                correct_answer: 'A. 8:10',
                explanation: '"八点十分" là 8 giờ 10 phút.'
              },
              {
                question_number: 18,
                prompt: 'Nghe đối thoại và chọn quà tặng:',
                audio_text: '男：送给小妹什么生日礼物好呢？女：买一只玩具熊吧。Sòng gěi xiǎomèi shénme shēngrì lǐwù hǎo ne? Mǎi yì zhī wánjùxióng ba.',
                pinyin: 'Mǎi yì zhī wánjùxióng ba.',
                options: ['A. 玩具熊 (Gấu bông đồ chơi)', 'B. 新书包 (Cặp sách mới)', 'C. 铅笔盒 (Hộp bút)'],
                correct_answer: 'A. 玩具熊 (Gấu bông đồ chơi)',
                explanation: '"玩具熊" là chú gấu bông.'
              },
              {
                question_number: 19,
                prompt: 'Nghe đối thoại và chọn môn học:',
                audio_text: '女：明天下午考什么？男：考中国历史。Míngtiān xiàwǔ kǎo shénme? Kǎo Zhōngguó lìshǐ.',
                pinyin: 'Kǎo Zhōngguó lìshǐ.',
                options: ['A. 历史 (Lịch sử)', 'B. 数学 (Toán học)', 'C. 英语 (Tiếng Anh)'],
                correct_answer: 'A. 历史 (Lịch sử)',
                explanation: '"中国历史" là lịch sử Trung Quốc.'
              },
              {
                question_number: 20,
                prompt: 'Nghe đối thoại và chọn thời tiết:',
                audio_text: '男：明天的天气预报看了吗？女：看了，说明天阴天，没有雨。Míngtiān de tiānqì yùbào kàn le ma? Kàn le, shuō míngtiān yīn tiān, méiyǒu yǔ.',
                pinyin: 'míngtiān yīn tiān, méiyǒu yǔ.',
                options: ['A. 阴天 (Trời râm mát)', 'B. 大雨 (Mưa to)', 'C. 下雪 (Tuyết rơi)'],
                correct_answer: 'A. 阴天 (Trời râm mát)',
                explanation: '"阴天" là trời râm mát.'
              }
            ]
          },
          {
            id: 'hsk2-02-l-p3',
            part_number: 3,
            title: 'Phần 3 (Câu 21 - 30)',
            instructions: 'Nghe đối thoại 2 lượt và trả lời câu hỏi trắc nghiệm.',
            sort_order: 3,
            questions: [
              {
                question_number: 21,
                prompt: 'Hỏi: Người nam muốn tìm ai? (男的找谁？)',
                audio_text: '男：请问张老师在吗？女：他去开会了，下午才回来。Qǐngwèn Zhāng lǎoshī zài ma? Tā qù kāihuì le, xiàwǔ cái huílái. 问：男的找谁？',
                pinyin: 'Qǐngwèn Zhāng lǎoshī zài ma?',
                options: ['A. 张老师 (Thầy Trương)', 'B. 李校长 (Hiệu trưởng Lý)', 'C. 王医生 (Bác sĩ Vương)'],
                correct_answer: 'A. 张老师 (Thầy Trương)',
                explanation: 'Người nam hỏi "张老师在吗？".'
              },
              {
                question_number: 22,
                prompt: 'Hỏi: Người nữ thấy chiếc áo thế nào? (女的觉得衣服怎么样？)',
                audio_text: '男：这件红色的真好看，你觉得呢？女：好看是好看，就是太贵了。Zhè jiàn hóngsè de zhēn hǎokàn, nǐ juéde ne? Hǎokàn shì hǎokàn, jiùshì tài guì le. 问：女的觉得衣服怎么样？',
                pinyin: 'jiùshì tài guì le.',
                options: ['A. 太贵了 (Quá đắt)', 'B. 太便宜了 (Quá rẻ)', 'C. 颜色不好 (Màu không đẹp)'],
                correct_answer: 'A. 太贵了 (Quá đắt)',
                explanation: '"就是太贵了" (chỉ là đắt quá).'
              },
              {
                question_number: 23,
                prompt: 'Hỏi: Họ dự định làm gì vào ngày mai? (他们明天打算做什么？)',
                audio_text: '女：明天是星期日，一起去打羽毛球吧。男：好啊，早上八点见。Míngtiān shì xīngqīrì, yìqǐ qù dǎ yǔmáoqiú ba. Hǎo a, zǎoshang bā diǎn jiàn. 问：他们明天打算做什么？',
                pinyin: 'yìqǐ qù dǎ yǔmáoqiú ba.',
                options: ['A. 打羽毛球 (Đánh cầu lông)', 'B. 逛街买衣服 (Dạo phố mua đồ)', 'C. 看电影 (Xem phim)'],
                correct_answer: 'A. 打羽毛球 (Đánh cầu lông)',
                explanation: '"打羽毛球" là đánh cầu lông.'
              },
              {
                question_number: 24,
                prompt: 'Hỏi: Người nam đã khỏi bệnh chưa? (男的病好了吗？)',
                audio_text: '女：你的感冒好点儿了吗？男：好多了，已经不咳嗽了。Nǐ de gǎnmào hǎo diǎnr le ma? Hǎo duō le, yǐjīng bù késou le. 问：男的身体怎么样了？',
                pinyin: 'Hǎo duō le, yǐjīng bù késou le.',
                options: ['A. 好多了 (Đã đỡ nhiều rồi)', 'B. 更严重了 (Nặng hơn)', 'C. 还在发烧 (Vẫn đang sốt)'],
                correct_answer: 'A. 好多了 (Đã đỡ nhiều rồi)',
                explanation: '"好多了" nghĩa là đã đỡ nhiều.'
              },
              {
                question_number: 25,
                prompt: 'Hỏi: Chiếc máy tính giá bao nhiêu? (这台电脑多少钱？)',
                audio_text: '男：这台新电脑花了我四千块钱。女：虽然贵，但是性能非常好。Zhè tái xīn diànnǎo huā le wǒ sìqiān kuài qián. Suīrán guì, dànshì xìngnéng fēicháng hǎo. 问：这台电脑多少钱？',
                pinyin: 'sìqiān kuài qián.',
                options: ['A. 4000 块', 'B. 3000 块', 'C. 5000 块'],
                correct_answer: 'A. 4000 块',
                explanation: '"四千块" là 4000 đồng.'
              },
              {
                question_number: 26,
                prompt: 'Hỏi: Họ đang ở đâu? (他们在哪儿？)',
                audio_text: '女：师傅，请送我去市中心的第一人民医院。男：好的，请系好安全带。Shīfu, qǐng sòng wǒ qù shì zhōngxīn de dì-yī rénmín yīyuàn. Hǎo de, qǐng jìhǎo ānquándài. 问：他们在哪儿？',
                pinyin: 'qǐng jìhǎo ānquándài.',
                options: ['A. 出租车上 (Trên xe taxi)', 'B. 飞机上 (Trên máy bay)', 'C. 轮船上 (Trên tàu thủy)'],
                correct_answer: 'A. 出租车上 (Trên xe taxi)',
                explanation: 'Gọi tài xế "师傅" và thắt dây an toàn "系好安全带".'
              },
              {
                question_number: 27,
                prompt: 'Hỏi: Người nữ muốn ăn món gì? (女的想吃什么？)',
                audio_text: '男：今天中午想吃什么？面条还是米饭？女：好久没吃饺子了，包饺子吧。Jīntiān zhōngwǔ xiǎng chī shénme? Miàntiáo háishì mǐfàn? Hǎojiǔ méi chī jiǎozi le, bāo jiǎozi ba. 问：女的想吃什么？',
                pinyin: 'bāo jiǎozi ba.',
                options: ['A. 饺子 (Sủi cảo)', 'B. 面条 (Mì)', 'C. 米饭 (Cơm)'],
                correct_answer: 'A. 饺子 (Sủi cảo)',
                explanation: '"饺子" là bánh sủi cảo.'
              },
              {
                question_number: 28,
                prompt: 'Hỏi: Người nam cảm thấy bài kiểm tra thế nào? (男的觉得考试难吗？)',
                audio_text: '女：这次汉语考试你考得怎么样？男：听力有点儿难，阅读还行。Zhè cì Hànyǔ kǎoshì nǐ kǎo de zěnmeyàng? Tīnglì yǒudiǎnr nán, yuèdú hái xíng. 问：男的觉得听力怎么样？',
                pinyin: 'Tīnglì yǒudiǎnr nán',
                options: ['A. 有点儿难 (Hơi khó)', 'B. 很简单 (Rất dễ)', 'C. 非常容易 (Cực kỳ dễ)'],
                correct_answer: 'A. 有点儿难 (Hơi khó)',
                explanation: '"听力有点儿难" (Phần nghe hơi khó).'
              },
              {
                question_number: 29,
                prompt: 'Hỏi: Người nữ sẽ đi đâu du lịch? (女的要去哪儿旅游？)',
                audio_text: '男：假期你准备去哪儿玩？女：我想去云南，听说那里的风景特别美。Jiàqī nǐ zhǔnbèi qù nǎr wán? Wǒ xiǎng qù Yúnnán, tīngshuō nàlǐ de fēngjǐng tèbié měi. 问：女的想去哪儿？',
                pinyin: 'Wǒ xiǎng qù Yúnnán',
                options: ['A. 云南 (Vân Nam)', 'B. 海南 (Hải Nam)', 'C. 北京 (Bắc Kinh)'],
                correct_answer: 'A. 云南 (Vân Nam)',
                explanation: '"去云南" (Đi tỉnh Vân Nam).'
              },
              {
                question_number: 30,
                prompt: 'Hỏi: Người nam đang tìm đồ vật gì? (男的在找什么？)',
                audio_text: '男：你看没看见我的眼镜？女：你头顶上戴着呢！Nǐ kàn méi kànjiàn wǒ de yǎnjìng? Nǐ tóudǐng shang dài zhe ne! 问：男的在找什么？',
                pinyin: 'wǒ de yǎnjìng',
                options: ['A. 眼镜 (Kính đeo mắt)', 'B. 帽子 (Mũ)', 'C. 钥匙 (Chìa khóa)'],
                correct_answer: 'A. 眼镜 (Kính đeo mắt)',
                explanation: '"眼镜" là chiếc kính mắt.'
              }
            ]
          },
          {
            id: 'hsk2-02-l-p4',
            part_number: 4,
            title: 'Phần 4 (Câu 31 - 35)',
            instructions: 'Nghe đối thoại dài và chọn câu trả lời đúng.',
            sort_order: 4,
            questions: [
              {
                question_number: 31,
                prompt: 'Hỏi: Chuyến bay bị hoãn vì lý do gì? (飞机为什么延误？)',
                audio_text: '女：先生，抱歉通知您，飞往上海的航班因为大雾推迟起飞。男：那大概要推迟多久呢？女：预计两小时后起飞。男：好吧，谢谢。问：航班为什么推迟？',
                pinyin: 'yīnwèi dàwù tuīchí qǐfēi.',
                options: ['A. 因为大雾 (Vì sương mù lớn)', 'B. 因为暴雨 (Vì bão to)', 'C. 机械故障 (Vì trục trặc máy)'],
                correct_answer: 'A. 因为大雾 (Vì sương mù lớn)',
                explanation: '"因为大雾推迟起飞" (Do sương mù dày đặc nên hoãn cất cánh).'
              },
              {
                question_number: 32,
                prompt: 'Hỏi: Họ cùng nhau xem chương trình gì? (他们一起看什么？)',
                audio_text: '男：电视里在放什么呢？女：正在播足球比赛呢。男：是哪个队对哪个队？女：中国队对巴西队。问：电视里在放什么？',
                pinyin: 'zhèngzài bō zúqiú bǐsài ne.',
                options: ['A. 足球比赛 (Trận đấu bóng đá)', 'B. 电视剧 (Phim truyền hình)', 'C. 音乐晚会 (Đêm nhạc)'],
                correct_answer: 'A. 足球比赛 (Trận đấu bóng đá)',
                explanation: '"足球比赛" là trận thi đấu bóng đá.'
              },
              {
                question_number: 33,
                prompt: 'Hỏi: Người nữ uống cà phê có cho đường không? (女的喝咖啡放糖吗？)',
                audio_text: '男：我给你冲杯咖啡吧。女：好的，多放点儿牛奶，不要放糖。男：好嘞，马上来。女：多谢！问：女的咖啡里不要放什么？',
                pinyin: 'bú yào fàng táng.',
                options: ['A. 糖 (Đường)', 'B. 牛奶 (Sữa)', 'C. 冰块 (Đá)'],
                correct_answer: 'A. 糖 (Đường)',
                explanation: '"不要放糖" nghĩa là không cho đường.'
              },
              {
                question_number: 34,
                prompt: 'Hỏi: Người nam cảm thấy khách sạn này thế nào? (男的觉得这家宾馆怎么样？)',
                audio_text: '女：你这次住的宾馆环境好吗？男：房间很大很干净，服务员态度也非常好。女：那下次我也去住。男：值得推荐！问：这家宾馆怎么样？',
                pinyin: 'Fángjiān hěn dà hěn gānjìng',
                options: ['A. 大而且干净，服务好 (Rộng rãi, sạch sẽ, phục vụ tốt)', 'B. 太小太吵 (Nhỏ và ồn ào)', 'C. 价格非常贵 (Giá rất đắt)'],
                correct_answer: 'A. 大而且干净，服务好 (Rộng rãi, sạch sẽ, phục vụ tốt)',
                explanation: '"很大很干净，服务员态度也非常好".'
              },
              {
                question_number: 35,
                prompt: 'Hỏi: Họ dự định làm gì vào ngày mai? (他们明天打算做什么？)',
                audio_text: '男：明天你有空吗？陪我去买台笔记本电脑吧。女：好啊，去电脑城买吗？男：对，那里选择多。女：行，明天上午九点见。问：他们明天去做什么？',
                pinyin: 'péi wǒ qù mǎi tái bǐjìběn diànnǎo ba.',
                options: ['A. 买笔记本电脑 (Mua máy tính xách tay)', 'B. 修自行车 (Sửa xe đạp)', 'C. 看电影 (Xem phim)'],
                correct_answer: 'A. 买笔记本电脑 (Mua máy tính xách tay)',
                explanation: '"买笔记本电脑" là mua máy tính xách tay.'
              }
            ]
          }
        ]
      },
      {
        id: 'hsk2-02-read',
        skill_type: 'reading',
        name: 'Đọc hiểu',
        chinese_name: '阅读',
        sort_order: 2,
        parts: [
          {
            id: 'hsk2-02-r-p1',
            part_number: 1,
            title: 'Phần 1 (Câu 36 - 40)',
            instructions: 'Chọn mô tả phù hợp với nội dung câu.',
            sort_order: 1,
            questions: [
              {
                question_number: 36,
                prompt: 'Chọn nội dung phù hợp: "请进，欢迎来到我们家做客！"',
                reading_text: '请进，欢迎来到我们家做客！Qǐng jìn, huānyíng lái dào wǒmen jiā zuòkè!',
                pinyin: 'huānyíng lái dào wǒmen jiā zuòkè!',
                options: ['A. Mời khách vào nhà chơi', 'B. Tiễn bạn ra sân bay', 'C. Mua vé tàu hỏa'],
                correct_answer: 'A. Mời khách vào nhà chơi',
                explanation: '"欢迎来做客" là chào mừng đến làm khách.'
              },
              {
                question_number: 37,
                prompt: 'Chọn nội dung phù hợp: "这条小狗真可爱，浑身雪白。"',
                reading_text: '这条小狗真可爱，浑身雪白。Zhè tiáo xiǎogǒu zhēn kě\'ài, húnshēn xuěbái.',
                pinyin: 'xiǎogǒu zhēn kě\'ài',
                options: ['A. Chú chó con màu trắng đáng yêu', 'B. Con mèo đen lười biếng', 'C. Con chim hót trên cây'],
                correct_answer: 'A. Chú chó con màu trắng đáng yêu',
                explanation: '"小狗" (chó con), "雪白" (trắng như tuyết).'
              },
              {
                question_number: 38,
                prompt: 'Chọn nội dung phù hợp: "服务员，请给我们拿两双筷子。"',
                reading_text: '服务员，请给我们拿两双筷子。Fúwùyuán, qǐng gěi wǒmen ná liǎng shuāng kuàizi.',
                pinyin: 'gěi wǒmen ná liǎng shuāng kuàizi.',
                options: ['A. Nhờ nhân viên lấy 2 đôi đũa', 'B. Gọi tính tiền hóa đơn', 'C. Đổi phòng khách sạn'],
                correct_answer: 'A. Nhờ nhân viên lấy 2 đôi đũa',
                explanation: '"两双筷子" là hai đôi đũa.'
              },
              {
                question_number: 39,
                prompt: 'Chọn nội dung phù hợp: "他生病住院了，我们买点水果去看看他。"',
                reading_text: '他生病住院了，我们买点水果去看看他。Tā shēngbìng zhùyuàn le, wǒmen mǎi diǎn shuǐguǒ qù kànkan tā.',
                pinyin: 'shēngbìng zhùyuàn le',
                options: ['A. Đi thăm người ốm nằm viện', 'B. Đi du lịch vùng cao', 'C. Đi bơi ở hồ nước'],
                correct_answer: 'A. Đi thăm người ốm nằm viện',
                explanation: '"生病住院" là bị bệnh phải nằm viện.'
              },
              {
                question_number: 40,
                prompt: 'Chọn nội dung phù hợp: "公共汽车来了，大家排好队上车。"',
                reading_text: '公共汽车来了，大家排好队上车。Gōnggòng qìchē lái le, dàjiā pái hǎo duì shàng chē.',
                pinyin: 'Gōnggòng qìchē lái le, dàjiā pái hǎo duì shàng chē.',
                options: ['A. Xếp hàng trật tự lên xe buýt', 'B. Lái xe taxi qua cầu', 'C. Đi máy bay sang Mỹ'],
                correct_answer: 'A. Xếp hàng trật tự lên xe buýt',
                explanation: '"公共汽车" là xe buýt, "排队" là xếp hàng.'
              }
            ]
          },
          {
            id: 'hsk2-02-r-p2',
            part_number: 2,
            title: 'Phần 2 (Câu 41 - 45)',
            instructions: 'Điền từ vựng chuẩn xác vào chỗ trống.',
            sort_order: 2,
            questions: [
              {
                question_number: 41,
                prompt: 'Điền từ: 他学习很_____，每次考试都是第一名。',
                reading_text: '他学习很_____，每次考试都是第一名。Tā xuéxí hěn _____, měi cì kǎoshì dōu shì dì-yī míng.',
                pinyin: 'Tā xuéxí hěn _____',
                options: ['A. 努力 (chăm chỉ / nỗ lực)', 'B. 慢 (chậm)', 'C. 贵 (đắt)'],
                correct_answer: 'A. 努力 (chăm chỉ / nỗ lực)',
                explanation: 'Đứng đầu lớp thì học tập rất "努力" (chăm chỉ).'
              },
              {
                question_number: 42,
                prompt: 'Điền từ: 医生说，每天多_____对身体有好处。',
                reading_text: '医生说，每天多_____对身体有好处。Yīshēng shuō, měitiān duō _____ duì shēntǐ yǒu hǎochu.',
                pinyin: 'měitiān duō _____ duì shēntǐ yǒu hǎochu.',
                options: ['A. 运动 (vận động / thể thao)', 'B. 睡觉 (ngủ)', 'C. 看手机 (xem điện thoại)'],
                correct_answer: 'A. 运动 (vận động / thể thao)',
                explanation: 'Năng tập luyện thể thao "运动" tốt cho sức khỏe.'
              },
              {
                question_number: 43,
                prompt: 'Điền từ: 你能帮我把这封信_____到邮局吗？',
                reading_text: '你能帮我把这封信_____到邮局吗？Nǐ néng bāng wǒ bǎ zhè fēng xìn _____ dào yóujú ma?',
                pinyin: 'bǎ zhè fēng xìn _____ dào yóujú ma?',
                options: ['A. 送 (gửi / đưa)', 'B. 吃 (ăn)', 'C. 听 (nghe)'],
                correct_answer: 'A. 送 (gửi / đưa)',
                explanation: 'Đưa thư đến bưu điện dùng động từ "送" (sòng).'
              },
              {
                question_number: 44,
                prompt: 'Điền từ: 路上车真多，我们_____要迟到了。',
                reading_text: '路上车真多，我们_____要迟到了。Lùshang chē zhēn duō, wǒmen _____ yào chídào le.',
                pinyin: 'wǒmen _____ yào chídào le.',
                options: ['A. 可能 (có khả năng / có lẽ)', 'B. 不想 (không muốn)', 'C. 已经 (đã)'],
                correct_answer: 'A. 可能 (có khả năng / có lẽ)',
                explanation: '"可能要迟到了" (Có lẽ sắp muộn rồi).'
              },
              {
                question_number: 45,
                prompt: 'Điền từ: 这个问题很_____，大家都会回答。',
                reading_text: '这个问题很_____，大家都会回答。Zhège wèntí hěn _____, dàjiā dōu huì huídá.',
                pinyin: 'Zhège wèntí hěn _____, dàjiā dōu huì huídá.',
                options: ['A. 简单 (đơn giản)', 'B. 难 (khó)', 'C. 远 (xa)'],
                correct_answer: 'A. 简单 (đơn giản)',
                explanation: 'Mọi người đều biết trả lời vì câu hỏi "简单" (đơn giản).'
              }
            ]
          },
          {
            id: 'hsk2-02-r-p3',
            part_number: 3,
            title: 'Phần 3 (Câu 46 - 50)',
            instructions: 'Đọc đoạn văn ngắn và phán đoán tính đúng sai.',
            sort_order: 3,
            questions: [
              {
                question_number: 46,
                prompt: 'Phán đoán: "Bố anh ấy thích uống cà phê hơn uống trà."',
                reading_text: '我爸爸每天早上都要喝一杯中国绿茶，从来不喝咖啡。★ 爸爸喜欢喝咖啡。（ ）',
                pinyin: 'cónglái bù hē kāfēi... Bàba xǐhuan hē kāfēi.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Sai (错误 - ✕)',
                explanation: 'Bố không bao giờ uống cà phê ("从来不喝咖啡"). Nhận định Sai.'
              },
              {
                question_number: 47,
                prompt: 'Phán đoán: "Tiểu Minh hôm nay không đi học."',
                reading_text: '小明今天发高烧，妈妈帮他向老师请了一天假。★ 小明今天去上学了。（ ）',
                pinyin: 'qǐng le yì tiān jià... Xiǎo Míng jīntiān qù shàngxué le.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Sai (错误 - ✕)',
                explanation: 'Đã xin nghỉ học ("请了一天假"), nhận định nói đi học là Sai.'
              },
              {
                question_number: 48,
                prompt: 'Phán đoán: "Quán ăn này phục vụ cả món chay."',
                reading_text: '这家饭馆不仅有各种各样的肉菜，也有不少好吃的蔬菜菜品。★ 这里有蔬菜菜品。（ ）',
                pinyin: 'yě yǒu bù shǎo hǎochī de shūcài càipǐn',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: 'Có nhiều món rau củ ("蔬菜菜品"). Nhận định Đúng.'
              },
              {
                question_number: 49,
                prompt: 'Phán đoán: "Anh ấy rất thích bài hát mới này."',
                reading_text: '这首歌的歌词写得太美了，旋律也动听，我每天都要听好几遍。★ 他很喜欢这首歌。（ ）',
                pinyin: 'wǒ měitiān dōu yào tīng hǎo jǐ biàn... Tā hěn xǐhuan zhè shǒu gē.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: 'Mỗi ngày nghe mấy lần chứng tỏ rất thích bài hát. Nhận định Đúng.'
              },
              {
                question_number: 50,
                prompt: 'Phán đoán: "Bộ quần áo này rất đắt."',
                reading_text: '这件衣服质量很好，而且只要五十块钱，太划算了。★ 这件衣服很贵。（ ）',
                pinyin: 'zhǐ yào wǔshí kuài qián, tài huásuàn le... Zhè jiàn yīfu hěn guì.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Sai (错误 - ✕)',
                explanation: 'Chỉ có 50 đồng và rất hời ("太划算"), nhận định đắt là Sai.'
              }
            ]
          },
          {
            id: 'hsk2-02-r-p4',
            part_number: 4,
            title: 'Phần 4 (Câu 51 - 60)',
            instructions: 'Ghép cặp câu phù hợp logic.',
            sort_order: 4,
            questions: [
              {
                question_number: 51,
                prompt: 'Ghép câu cho: "虽然工作很辛苦，"',
                reading_text: '虽然工作很辛苦，Suīrán gōngzuò hěn xīnkǔ,',
                pinyin: 'Suīrán gōngzuò hěn xīnkǔ,',
                options: ['A. 但是他觉得很充实。(nhưng anh ấy cảm thấy rất ý nghĩa.)', 'B. 他不想吃饭。(anh ấy không muốn ăn cơm.)', 'C. 太阳下山了。(mặt trời lặn rồi.)'],
                correct_answer: 'A. 但是他觉得很充实。(nhưng anh ấy cảm thấy rất ý nghĩa.)',
                explanation: '"虽然……但是……" (Tuy vất vả nhưng cảm thấy trọn vẹn ý nghĩa).'
              },
              {
                question_number: 52,
                prompt: 'Ghép câu cho: "请问张老师的办公室"',
                reading_text: '请问张老师的办公室 Qǐngwèn Zhāng lǎoshī de bàngōngshì',
                pinyin: 'Qǐngwèn Zhāng lǎoshī de bàngōngshì',
                options: ['A. 在几楼？(ở tầng mấy?)', 'B. 多少钱？(bao nhiêu tiền?)', 'C. 几岁了？(mấy tuổi?)'],
                correct_answer: 'A. 在几楼？(ở tầng mấy?)',
                explanation: 'Hỏi vị trí văn phòng ở tầng mấy: "在几楼？".'
              },
              {
                question_number: 53,
                prompt: 'Ghép câu cho: "外面风很大，"',
                reading_text: '外面风很大，Wàimiàn fēng hěn dà,',
                pinyin: 'Wàimiàn fēng hěn dà,',
                options: ['A. 把窗户关上吧。(hãy đóng cửa sổ lại đi.)', 'B. 一起去游泳吧。(cùng đi bơi nhé.)', 'C. 水果很甜。(hoa quả rất ngọt.)'],
                correct_answer: 'A. 把窗户关上吧。(hãy đóng cửa sổ lại đi.)',
                explanation: 'Gió to thì đóng cửa sổ "把窗户关上".'
              },
              {
                question_number: 54,
                prompt: 'Ghép câu cho: "因为今天堵车，"',
                reading_text: '因为今天堵车，Yīnwèi jīntiān dǔchē,',
                pinyin: 'Yīnwèi jīntiān dǔchē,',
                options: ['A. 所以我迟到了十分钟。(nên tôi đến muộn 10 phút.)', 'B. 菜很好吃。(món ăn ngon.)', 'C. 天气很晴朗。(trời rất quang đãng.)'],
                correct_answer: 'A. 所以 tôi迟到了十分钟。(nên tôi đến muộn 10 phút.)',
                explanation: 'Tắc đường nên bị muộn học/làm.'
              },
              {
                question_number: 55,
                prompt: 'Ghép câu cho: "你喜欢喝红茶"',
                reading_text: '你喜欢喝红茶 Nǐ xǐhuan hē hóngchá',
                pinyin: 'Nǐ xǐhuan hē hóngchá',
                options: ['A. 还是喜欢喝绿茶？(hay là thích uống trà xanh?)', 'B. 在桌子上面。(ở trên bàn.)', 'C. 是一百块。(là một trăm đồng.)'],
                correct_answer: 'A. 还是喜欢喝绿茶？(hay là thích uống trà xanh?)',
                explanation: 'Câu hỏi lựa chọn đồ uống với "还是".'
              },
              {
                question_number: 56,
                prompt: 'Ghép câu cho: "别玩游戏了，"',
                reading_text: '别玩游戏了，Bié wán yóuxì le,',
                pinyin: 'Bié wán yóuxì le,',
                options: ['A. 快去复习准备明天的考试！(mau đi ôn tập chuẩn bị thi ngày mai!)', 'B. 电影真好看。(phim hay lắm.)', 'C. 衣服洗好了。(quần áo giặt xong rồi.)'],
                correct_answer: 'A. 快去复习准备明天的考试！(mau đi ôn tập chuẩn bị thi ngày mai!)',
                explanation: 'Khuyên dừng chơi game để ôn bài.'
              },
              {
                question_number: 57,
                prompt: 'Ghép câu cho: "如果明天下雨，"',
                reading_text: '如果明天下雨，Rúguǒ míngtiān xiàyǔ,',
                pinyin: 'Rúguǒ míngtiān xiàyǔ,',
                options: ['A. 我们就不去公园了。(chúng ta sẽ không đi công viên nữa.)', 'B. 太阳很大。(mặt trời rất to.)', 'C. 他考了一百分。(anh ấy thi được 100 điểm.)'],
                correct_answer: 'A. 我们就不去公园了。(chúng ta sẽ không đi công viên nữa.)',
                explanation: 'Cấu trúc giả thiết "如果……就……" (Nếu... thì...).'
              },
              {
                question_number: 58,
                prompt: 'Ghép câu cho: "我听医生的话，"',
                reading_text: '我听医生的话，Wǒ tīng yīshēng de huà,',
                pinyin: 'Wǒ tīng yīshēng de huà,',
                options: ['A. 每天都按时吃药。(mỗi ngày đều uống thuốc đúng giờ.)', 'B. 去买了一双鞋。(đi mua một đôi giày.)', 'C. 打了两个小时球。(chơi bóng 2 tiếng.)'],
                correct_answer: 'A. 每天都按时吃药。(mỗi ngày đều uống thuốc đúng giờ.)',
                explanation: 'Nghe lời bác sĩ dặn uống thuốc đúng giờ.'
              },
              {
                question_number: 59,
                prompt: 'Ghép câu cho: "周末如果有时间，"',
                reading_text: '周末如果有时间，Zhōumò rúguǒ yǒu shíjiān,',
                pinyin: 'Zhōumò rúguǒ yǒu shíjiān,',
                options: ['A. 我们一起去逛街买书吧。(chúng ta cùng đi dạo phố mua sách nhé.)', 'B. 昨天很累。(hôm qua rất mệt.)', 'C. 早上好。(chào buổi sáng.)'],
                correct_answer: 'A. 我们一起去逛街买书吧。(chúng ta cùng đi dạo phố mua sách nhé.)',
                explanation: 'Rủ rê đi dạo phố vào ngày cuối tuần.'
              },
              {
                question_number: 60,
                prompt: 'Ghép câu cho: "祝你们新婚快乐，"',
                reading_text: '祝你们新婚快乐，Zhù nǐmen xīnhūn kuàilè,',
                pinyin: 'Zhù nǐmen xīnhūn kuàilè,',
                options: ['A. 白头偕老，永远幸福！(bách niên giai lão, mãi mãi hạnh phúc!)', 'B. 慢走，不送！(đi thong thả!)', 'C. 考试顺利！(thi cử thuận lợi!)'],
                correct_answer: 'A. 白头偕老，永远幸福！(bách niên giai lão, mãi mãi hạnh phúc!)',
                explanation: 'Lời chúc đám cưới chúc phúc bách niên giai lão.'
              }
            ]
          }
        ]
      }
    ]
  }
];
