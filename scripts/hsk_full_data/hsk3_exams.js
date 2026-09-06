// scripts/hsk_full_data/hsk3_exams.js
// Dữ liệu chuẩn 100% số lượng câu hỏi cho 2 đề HSK 3 (80 câu/đề = 160 câu)
// HSK 3: 85 phút, Thang điểm 300 (Nghe 100 + Đọc 100 + Viết 100), Điểm đạt: 180

export const hsk3Exams = [
  {
    id: 'official-hsk3-01',
    title: 'Đề Thi Thử HSK 3 Toàn Diện - Đề Số 01 (H30901)',
    chineseTitle: '新汉语水平考试 HSK（三级）样卷一 H30901',
    level: 'HSK 3',
    duration: 85,
    passingScore: 180,
    maxScore: 300,
    tag: 'Đề Chuẩn Hanban',
    description: 'Đề thi chính thức HSK 3 mã H30901 chuẩn Hanban với đầy đủ 80 câu hỏi (Nghe 40 câu, Đọc 30 câu, Viết 10 câu), có audio text, pinyin và giải thích chi tiết.',
    skills: [
      {
        id: 'hsk3-01-listen',
        skill_type: 'listening',
        name: 'Nghe hiểu',
        chinese_name: '听力',
        sort_order: 1,
        parts: [
          {
            id: 'hsk3-01-l-p1',
            part_number: 1,
            title: 'Phần 1 (Câu 1 - 10)',
            instructions: 'Nghe đoạn đối thoại ngắn, chọn nội dung hoặc hình ảnh tương ứng (A, B, C). Mỗi câu nghe 2 lần.',
            sort_order: 1,
            questions: [
              {
                question_number: 1,
                prompt: 'Nghe đối thoại và chọn việc họ đang làm:',
                audio_text: '男：喂，你在哪儿呢？女：我在超市买新鲜的水果和蔬菜呢。',
                pinyin: 'Wǒ zài chāoshì mǎi xīnxiān de shuǐguǒ hé shūcài ne.',
                options: ['A. Mua hoa quả và rau ở siêu thị (超市买水果蔬菜)', 'B. Đi khám ở bệnh viện', 'C. Chờ xe ở bến xe buýt'],
                correct_answer: 'A. Mua hoa quả và rau ở siêu thị (超市买水果蔬菜)',
                explanation: '"在超市买新鲜的水果和蔬菜" là đang ở siêu thị mua rau quả tươi.'
              },
              {
                question_number: 2,
                prompt: 'Nghe đối thoại và chọn lý do:',
                audio_text: '女：小李，你怎么戴上眼镜了？男：最近看电脑太多，眼睛有点儿近视了。',
                pinyin: 'Zuìjìn kàn diànnǎo tài duō, yǎnjing yǒudiǎnr jìnshì le.',
                options: ['A. Mắt bị cận thị do dùng máy tính nhiều', 'B. Kính râm chống nắng', 'C. Mượn kính của bạn'],
                correct_answer: 'A. Mắt bị cận thị do dùng máy tính nhiều',
                explanation: '"眼睛有点儿近视了" do nhìn máy tính quá nhiều.'
              },
              {
                question_number: 3,
                prompt: 'Nghe đối thoại và chọn món đồ được nhắc đến:',
                audio_text: '男：这条领带颜色太深了，配这件衬衫不太合适。女：那我给你换一条浅蓝色的吧。',
                pinyin: 'Zhè tiáo lǐngdài yánsè tài shēn le',
                options: ['A. Cà vạt (领带)', 'B. Thắt lưng da (皮带)', 'C. Áo khoác dạ (大衣)'],
                correct_answer: 'A. Cà vạt (领带)',
                explanation: '"领带" là chiếc cà vạt.'
              },
              {
                question_number: 4,
                prompt: 'Nghe đối thoại và chọn hoạt động thể thao:',
                audio_text: '女：今天天气真好，去爬山怎么样？男：好主意，我们带两瓶水就出发。',
                pinyin: 'qù páshān zěnmeyàng?',
                options: ['A. Leo núi (爬山)', 'B. Đi bơi (游泳)', 'C. Trượt băng (滑冰)'],
                correct_answer: 'A. Leo núi (爬山)',
                explanation: '"去爬山" là đi leo núi.'
              },
              {
                question_number: 5,
                prompt: 'Nghe đối thoại và chọn địa điểm:',
                audio_text: '男：您好，我想把这几本书还了，再借一本中文小说。女：好的，请出示您的借书卡。',
                pinyin: 'qǐng chūshì nín de jièshūkǎ.',
                options: ['A. Thư viện (图书馆)', 'B. Nhà sách (书店)', 'C. Bưu điện (邮局)'],
                correct_answer: 'A. Thư viện (图书馆)',
                explanation: '"借书卡" (thẻ mượn sách) là ngữ cảnh ở thư viện.'
              },
              {
                question_number: 6,
                prompt: 'Nghe đối thoại và chọn cảm xúc:',
                audio_text: '女：听说你通过HSK三级考试了，真厉害！男：谢谢，拿到成绩单时我都高兴坏了！',
                pinyin: 'wǒ dōu gāoxìng huài le!',
                options: ['A. Vui mừng khôn xiết (高兴坏了)', 'B. Lo lắng bồn chồn', 'C. Bình thản'],
                correct_answer: 'A. Vui mừng khôn xiết (高兴坏了)',
                explanation: '"高兴坏了" chỉ sự vui sướng vô cùng.'
              },
              {
                question_number: 7,
                prompt: 'Nghe đối thoại và chọn món ăn:',
                audio_text: '男：服务员，我们这桌的糖醋鱼怎么还没上？女：先生别着急，厨师正在做，马上就好。',
                pinyin: 'tángcùyú zěnme hái méi shàng?',
                options: ['A. Cá sốt chua ngọt (糖醋鱼)', 'B. Thịt kho tàu (红烧肉)', 'C. Vịt quay (烤鸭)'],
                correct_answer: 'A. Cá sốt chua ngọt (糖醋鱼)',
                explanation: '"糖醋鱼" là món cá sốt chua ngọt.'
              },
              {
                question_number: 8,
                prompt: 'Nghe đối thoại và chọn phương tiện:',
                audio_text: '女：明天早上七点半的高铁，你别起晚了。男：放心吧，我已经设好闹钟了。',
                pinyin: 'qī diǎn bàn de gāotiě',
                options: ['A. Tàu cao tốc (高铁)', 'B. Máy bay (飞机)', 'C. Xe đò (客车)'],
                correct_answer: 'A. Tàu cao tốc (高铁)',
                explanation: '"高铁" là tàu hỏa cao tốc.'
              },
              {
                question_number: 9,
                prompt: 'Nghe đối thoại và chọn đồ uống yêu thích:',
                audio_text: '男：你每天工作都喝咖啡吗？女：对，喝一杯美式咖啡让我精神饱满。',
                pinyin: 'měishì kāfēi ràng wǒ jīngshén bǎomǎn.',
                options: ['A. Cà phê Americano (美式咖啡)', 'B. Trà hoa cúc', 'C. Nước ép cam'],
                correct_answer: 'A. Cà phê Americano (美式咖啡)',
                explanation: '"美式咖啡" là cà phê phong cách Mỹ.'
              },
              {
                question_number: 10,
                prompt: 'Nghe đối thoại và chọn thời tiết:',
                audio_text: '女：外面突然刮大风了，快把阳台上的衣服收进来！男：好的，我这就去收。',
                pinyin: 'wàimiàn tūrán guā dà fēng le',
                options: ['A. Gió lớn bất ngờ nổi lên (刮大风)', 'B. Mưa rào tạnh ngay', 'C. Nắng chói chang'],
                correct_answer: 'A. Gió lớn bất ngờ nổi lên (刮大风)',
                explanation: '"突然刮大风" là nổi cơn gió to.'
              }
            ]
          },
          {
            id: 'hsk3-01-l-p2',
            part_number: 2,
            title: 'Phần 2 (Câu 11 - 20)',
            instructions: 'Nghe đoạn văn ngắn, phán đoán Đúng (√) hoặc Sai (✕) so với câu nhận định. Mỗi câu nghe 2 lần.',
            sort_order: 2,
            questions: [
              {
                question_number: 11,
                prompt: 'Phán đoán nhận định: "Anh ấy rất thích nuôi thú cưng."',
                audio_text: '我家里养了一只小猫和一只小狗，每天下班回到家，看到它们迎接我，一天的疲劳就全没了。★ 他很喜欢动物。（ ）',
                pinyin: 'Tā hěn xǐhuan dòngwù.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: 'Nuôi cả chó lẫn mèo và thấy hết mệt mỏi chứng tỏ rất yêu động vật. Nhận định Đúng.'
              },
              {
                question_number: 12,
                prompt: 'Phán đoán nhận định: "Anh ấy thường xuyên thức khuya dậy muộn."',
                audio_text: '为了保持身体健康，我坚持早睡早起，每天早晨六点准时去公园慢跑半小时。★ 他习惯早睡早起。（ ）',
                pinyin: 'Tā xíguàn zǎoshuì zǎoqǐ.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: '"坚持早睡早起" khẳng định thói quen ngủ sớm dậy sớm. Nhận định Đúng.'
              },
              {
                question_number: 13,
                prompt: 'Phán đoán nhận định: "Họ quyết định mua căn hộ ở ngoại thành."',
                audio_text: '虽然市中心的房子价格很高，但是为了孩子上学和我们上班方便，我们还是决定买在市中心。★ 他们买了郊区的房子。（ ）',
                pinyin: 'Tāmen mǎi le jiāoqū de fángzi.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Sai (错误 - ✕)',
                explanation: 'Họ quyết định mua ở trung tâm ("市中心"), nhận định nói mua ở ngoại ô ("郊区") là Sai.'
              },
              {
                question_number: 14,
                prompt: 'Phán đoán nhận định: "Món ăn mẹ nấu mang đậm hương vị quê hương."',
                audio_text: '每次出差回到老家，妈妈总会做一桌我小时候最爱吃的家乡菜，那是最幸福的味道。★ 妈妈做的菜有家乡味道。（ ）',
                pinyin: 'Māma zuò de cài yǒu jiāxiāng wèidào.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: '"家乡菜" (món ăn quê nhà) mang hương vị quê hương. Nhận định Đúng.'
              },
              {
                question_number: 15,
                prompt: 'Phán đoán nhận định: "Anh ấy không muốn tham gia buổi phỏng vấn."',
                audio_text: '明天有一场非常重要的外企面试，我特意准备了西装，今晚要好好练习自我介绍。★ 他很重视这次面试。（ ）',
                pinyin: 'Tā hěn zhòngshì zhè cì miànshì.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: 'Chuẩn bị cả âu phục và luyện tập kỹ càng cho thấy anh rất coi trọng ("很重视").'
              },
              {
                question_number: 16,
                prompt: 'Phán đoán nhận định: "Chuyến du lịch này khiến mọi người thất vọng."',
                audio_text: '桂林的山水太迷人了，漓江的水清澈见底，这次旅行给全家人留下了深刻而美好的回忆。★ 他们玩得很不开心。（ ）',
                pinyin: 'Tāmen wán de hěn bù kāixīn.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Sai (错误 - ✕)',
                explanation: 'Kỷ niệm tươi đẹp và sâu sắc ("美好的回忆"), nhận định nói chơi không vui là Sai.'
              },
              {
                question_number: 17,
                prompt: 'Phán đoán nhận định: "Trương lão sư giảng bài rất sinh động hấp dẫn."',
                audio_text: '张老师讲历史故事幽默风趣，枯燥的课文在他的课堂上变得生动极了，大家都爱听。★ 大家都喜欢张老师的课。（ ）',
                pinyin: 'Dàjiā dōu xǐhuan Zhāng lǎoshī de kè.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: '"大家都爱听" đồng nghĩa với mọi người đều yêu thích tiết học. Nhận định Đúng.'
              },
              {
                question_number: 18,
                prompt: 'Phán đoán nhận định: "Anh ấy đã bỏ quên điện thoại trên xe taxi."',
                audio_text: '今天坐出租车下车时太匆忙，把新买的手表落在了后排座位上，幸好司机师傅主动送回来了。★ 他丢了手机。（ ）',
                pinyin: 'Tā diū le shǒujī.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Sai (错误 - ✕)',
                explanation: 'Anh ấy để quên đồng hồ ("手表"), nhận định bảo mất điện thoại ("手机") là Sai.'
              },
              {
                question_number: 19,
                prompt: 'Phán đoán nhận định: "Mùa thu ở Bắc Kinh là mùa đẹp nhất trong năm."',
                audio_text: '老舍先生曾写道：秋天一定要住北平，天高气爽，香山红叶漫山遍野，最是怡人。★ 北京的秋天非常美。（ ）',
                pinyin: 'Běijīng de qiūtiān fēicháng měi.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: 'Đoạn văn ca ngợi mùa thu Bắc Kinh đẹp nhất, dễ chịu nhất. Nhận định Đúng.'
              },
              {
                question_number: 20,
                prompt: 'Phán đoán nhận định: "Công việc này quá nhàn hạ không có áp lực."',
                audio_text: '这个项目时间紧、任务重，整个团队连续加班了一个星期才终于顺利上线。★ 这个项目工作很轻松。（ ）',
                pinyin: 'Zhège xiàngmù gōngzuò hěn qīngsōng.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Sai (错误 - ✕)',
                explanation: 'Thời gian gấp gáp, tăng ca liên tục cả tuần nên không hề nhẹ nhàng ("不轻松").'
              }
            ]
          },
          {
            id: 'hsk3-01-l-p3',
            part_number: 3,
            title: 'Phần 3 (Câu 21 - 30)',
            instructions: 'Nghe đối thoại 2 lượt và trả lời câu hỏi trắc nghiệm A, B, C.',
            sort_order: 3,
            questions: [
              {
                question_number: 21,
                prompt: 'Hỏi: Người nam muốn gửi đồ đến đâu? (男的要把包裹寄到哪儿？)',
                audio_text: '男：您好，寄这个包裹到广州需要几天？女：走特快专递的话，明天下午就能送到。问：男的要把包裹寄到哪儿？',
                pinyin: 'jì zhège bāoguǒ dào Guǎngzhōu',
                options: ['A. 广州 (Quảng Châu)', 'B. 深圳 (Thâm Quyến)', 'C. 上海 (Thượng Hải)'],
                correct_answer: 'A. 广州 (Quảng Châu)',
                explanation: '"寄这个包裹到广州" (Gửi kiện bưu phẩm này đến Quảng Châu).'
              },
              {
                question_number: 22,
                prompt: 'Hỏi: Họ dự định chọn món gì làm quà cưới? (他们打算送什么礼物？)',
                audio_text: '女：小王下周结婚，我们送什么好呢？男：送一套精美的茶具吧，他平时最爱喝茶。问：他们打算送什么？',
                pinyin: 'Sòng yí tào jīngměi de chájù ba',
                options: ['A. 一套精美的茶具 (Bộ ấm chén tinh xảo)', 'B. 一台电冰箱 (Tủ lạnh)', 'C. 一束鲜花 (Bó hoa tươi)'],
                correct_answer: 'A. 一套精美的茶具 (Bộ ấm chén tinh xảo)',
                explanation: '"送一套精美的茶具" vì Tiểu Vương thích uống trà.'
              },
              {
                question_number: 23,
                prompt: 'Hỏi: Vì sao người nữ không thể tham gia tiệc tối? (女的为什么不能去晚宴？)',
                audio_text: '男：今晚公司的庆功晚宴你来吗？女：实在抱歉，我今晚要送父母去机场，来不及了。问：女的今晚要做什么？',
                pinyin: 'sòng fùmǔ qù jīchǎng',
                options: ['A. 送父母去机场 (Đưa bố mẹ ra sân bay)', 'B. 在公司加班 (Tăng ca ở công ty)', 'C. 身体生病了 (Bị ốm)'],
                correct_answer: 'A. 送父母去机场 (Đưa bố mẹ ra sân bay)',
                explanation: '"送父母去机场" (Đưa bố mẹ ra sân bay).'
              },
              {
                question_number: 24,
                prompt: 'Hỏi: Người nam cảm thấy căn phòng thuê thế nào? (男的觉得房子怎么样？)',
                audio_text: '女：你新租的房子环境还满意吗？男：采光特别好，周围交通方便，离地铁站只要走五分钟。问：男的觉得房子怎么样？',
                pinyin: 'Cǎiguāng tèbié hǎo, jiāotōng fāngbiàn',
                options: ['A. 很满意 (Rất hài lòng)', 'B. 太吵闹 (Quá ồn ào)', 'C. 离地铁远 (Xa tàu điện ngầm)'],
                correct_answer: 'A. 很满意 (Rất hài lòng)',
                explanation: 'Khen ngợi ánh sáng tốt, giao thông tiện lợi, rất hài lòng.'
              },
              {
                question_number: 25,
                prompt: 'Hỏi: Chiếc áo khoác này chất liệu gì? (这件外套是什么面料？)',
                audio_text: '男：这件外套摸上去真舒服，是纯羊毛的吗？女：是的先生，百分之百纯羊毛，保暖效果极好。问：这件外套是什么材料？',
                pinyin: 'bǎifēnzhībǎi chún yángmáo',
                options: ['A. 纯羊毛 (100% len cừu thuần chất)', 'B. 纯棉 (Cotton)', 'C. 丝绸 (Tơ lụa)'],
                correct_answer: 'A. 纯羊毛 (100% len cừu thuần chất)',
                explanation: '"百分之百纯羊毛" là 100% len nguyên chất.'
              },
              {
                question_number: 26,
                prompt: 'Hỏi: Cuộc họp bị dời lại đến khi nào? (会议推迟到什么时候？)',
                audio_text: '女：李总，下午两点的部门例会需要改期吗？男：推迟到明天上午九点半吧。问：会议推迟到什么时候？',
                pinyin: 'Tuīchí dào míngtiān shàngwǔ jiǔ diǎn bàn ba.',
                options: ['A. 明天上午 9:30', 'B. 今天下午 4:00', 'C. 后天上午 10:00'],
                correct_answer: 'A. 明天上午 9:30',
                explanation: '"明天上午九点半" (9:30 sáng mai).'
              },
              {
                question_number: 27,
                prompt: 'Hỏi: Người nữ muốn đi đâu để tập thể thao? (女的打算去哪儿锻炼？)',
                audio_text: '男：你办了健身房的年卡？女：对呀，打算每周二和周四晚上去练瑜伽。问：女的打算做什么运动？',
                pinyin: 'qù liàn yújiā.',
                options: ['A. 练瑜伽 (Tập yoga)', 'B. 游泳 (Đi bơi)', 'C. 打网球 (Chơi quần vợt)'],
                correct_answer: 'A. 练瑜伽 (Tập yoga)',
                explanation: '"练瑜伽" là tập bộ môn yoga.'
              },
              {
                question_number: 28,
                prompt: 'Hỏi: Người nam khuyên người nữ làm gì? (男的给女的什么建议？)',
                audio_text: '女：这道数学题太难了，我算了好几遍答案都不对。男：别死记硬背，先复习一下课本上的公式定理。问：男的建议女的做什么？',
                pinyin: 'xiān fùxí yíxià kèběn shang de gōngshì',
                options: ['A. 复习课本上的公式 (Ôn lại công thức trong sách)', 'B. 放弃不做 (Bỏ cuộc)', 'C. Đi hỏi giáo sư'],
                correct_answer: 'A. 复习课本上的公式 (Ôn lại công thức trong sách)',
                explanation: '"先复习一下课本上的公式定理".'
              },
              {
                question_number: 29,
                prompt: 'Hỏi: Khách hàng muốn thanh toán bằng hình thức nào? (顾客想怎么付款？)',
                audio_text: '女：先生，一共是三百六十元，请问您刷卡还是现金？男：微信扫码支付可以吗？女：可以的，请扫这里。问：男的用什么付款？',
                pinyin: 'Wēixìn sǎomǎ zhīfù kěyǐ ma?',
                options: ['A. 微信支付 (Quét mã WeChat Pay)', 'B. 刷信用卡 (Thẻ tín dụng)', 'C. 付现金 (Tiền mặt)'],
                correct_answer: 'A. 微信支付 (Quét mã WeChat Pay)',
                explanation: '"微信扫码支付" quét mã thanh toán ví WeChat.'
              },
              {
                question_number: 30,
                prompt: 'Hỏi: Xe ô tô gặp trục trặc gì? (车出了什么问题？)',
                audio_text: '男：师傅，车怎么停下来了？女：后轮爆胎了，我得换个备用轮胎。问：车怎么了？',
                pinyin: 'Hòulún bàotāi le, huàn bèiyòng lúntāi.',
                options: ['A. 轮胎爆胎了 (Bị xịt lốp/nổ lốp sau)', 'B. Hết xăng giữa đường', 'C. Động cơ quá nóng'],
                correct_answer: 'A. 轮胎爆胎了 (Bị xịt lốp/nổ lốp sau)',
                explanation: '"后轮爆胎了" là lốp sau bị nổ/thủng.'
              }
            ]
          },
          {
            id: 'hsk3-01-l-p4',
            part_number: 4,
            title: 'Phần 4 (Câu 31 - 40)',
            instructions: 'Nghe đối thoại dài hoặc đoạn độc thoại và trả lời câu hỏi trắc nghiệm.',
            sort_order: 4,
            questions: [
              {
                question_number: 31,
                prompt: 'Hỏi: Người nói đang giới thiệu điều gì? (说话人在介绍什么？)',
                audio_text: '各位旅客请注意，由北京南站开往上海虹桥的G1次列车现在开始检票了，请您携带好随身行李物品，凭身份证进站乘车。问：广播通知的是哪趟列车？',
                pinyin: 'G1 cì lièchē xiànzài kāishǐ jiǎnpiào le',
                options: ['A. G1 次列车 (Chuyến tàu G1)', 'B. K123 次列车', 'C. D301 次列车'],
                correct_answer: 'A. G1 次列车 (Chuyến tàu G1)',
                explanation: '"G1次列车现在开始检票".'
              },
              {
                question_number: 32,
                prompt: 'Hỏi: Họ hẹn nhau mấy giờ ở cổng rạp chiếu phim? (他们几点在电影院门口见？)',
                audio_text: '女：今晚七点半的电影，我们提前半小时在影院门口集合，买爆米花。男：好，那我七点准时到。女：不见不散！问：他们几点集合？',
                pinyin: 'tíqián bàn xiǎoshí... qī diǎn zhǔnshí dào',
                options: ['A. 7:00 (7点整)', 'B. 7:30', 'C. 6:30'],
                correct_answer: 'A. 7:00 (7点整)',
                explanation: 'Phim chiếu 7:30, trước nửa tiếng tức là đúng 7:00.'
              },
              {
                question_number: 33,
                prompt: 'Hỏi: Người phụ nữ khuyên mua món gì? (女的建议买什么？)',
                audio_text: '男：我想给爷爷买个生日礼物，买茶具好还是保健品好？女：爷爷平时注重养生，买个足浴按摩盆可能更实用。男：这个建议太棒了！问：女的建议买什么？',
                pinyin: 'zúyù ànmó pén',
                options: ['A. 足浴按摩盆 (Bồn ngâm chân mát xa)', 'B. 名贵茶具', 'C. 高级西装'],
                correct_answer: 'A. 足浴按摩盆 (Bồn ngâm chân mát xa)',
                explanation: '"足浴按摩盆" là chậu massage ngâm chân rất thực tế.'
              },
              {
                question_number: 34,
                prompt: 'Hỏi: Vì sao chuyến bay phải bay vòng trên trời? (飞机为什么盘旋？)',
                audio_text: '男：女士们先生们，由于首都机场上空突降雷阵雨，暂时无法降落，本架航班将在空中盘旋等待二十分钟。问：飞机为什么暂时不能降落？',
                pinyin: 'tū jiàng léizhènyǔ, zànshí wúfǎ jiàngluò',
                options: ['A. 突降雷阵雨 (Mưa dông sấm sét bất ngờ)', 'B. Sương mù dày đặc', 'C. Sân bay mất điện'],
                correct_answer: 'A. 突降雷阵雨 (Mưa dông sấm sét bất ngờ)',
                explanation: '"突降雷阵雨" (bất ngờ đổ mưa dông).'
              },
              {
                question_number: 35,
                prompt: 'Hỏi: Khách sạn cung cấp bữa sáng miễn phí lúc mấy giờ? (早餐供应时间是几点？)',
                audio_text: '女：先生，这是您的房卡。我们酒店在一楼餐厅提供免费自助早餐，时间是早上六点半到九点半。男：好的，谢谢您。问：早餐什么时候结束？',
                pinyin: 'liù diǎn bàn dào jiǔ diǎn bàn',
                options: ['A. 9:30', 'B. 9:00', 'C. 10:00'],
                correct_answer: 'A. 9:30',
                explanation: 'Bắt đầu từ 6:30 và kết thúc lúc 9:30 ("九点半").'
              },
              {
                question_number: 36,
                prompt: 'Hỏi: Bạn của người nam làm nghề gì? (男人的朋友是做什么工作的？)',
                audio_text: '男：我这个朋友在报社当记者，整天跑新闻，特别忙碌。女：当记者虽然辛苦，但能增长很多见识。问：他的朋友是什么职业？',
                pinyin: 'zài bàoshè dāng jìzhě',
                options: ['A. 记者 (Nhà báo / Phóng viên)', 'B. 导游 (Hướng dẫn viên)', 'C. 律师 (Luật sư)'],
                correct_answer: 'A. 记者 (Nhà báo / Phóng viên)',
                explanation: '"当记者" làm nghề phóng viên/nhà báo.'
              },
              {
                question_number: 37,
                prompt: 'Hỏi: Người nữ quyết định đổi áo cỡ nào? (女的打算换多大码的？)',
                audio_text: '女：这件L号的裙子穿在我身上有点儿紧，有XL号的吗？男：有的，请您稍等，我去仓库给您取一件XL号。问：女的要换多大号？',
                pinyin: 'yǒu XL hào de ma?',
                options: ['A. XL 号', 'B. L 号', 'C. M 号'],
                correct_answer: 'A. XL 号',
                explanation: 'Đổi cỡ XL vì cỡ L bị chật.'
              },
              {
                question_number: 38,
                prompt: 'Hỏi: Họ gặp nhau tại đâu lúc tan ca? (他们下班后在哪儿见？)',
                audio_text: '男：下班后在公司楼下的星巴克见吧。女：好，顺便讨论一下下周的项目方案。男：不见不散。问：他们在哪儿见面？',
                pinyin: 'gōngsī lóuxià de Xīngbākè',
                options: ['A. 星巴克咖啡厅 (Quán cà phê Starbucks)', 'B. 饭店包间', 'C. 地铁出入口'],
                correct_answer: 'A. 星巴克咖啡厅 (Quán cà phê Starbucks)',
                explanation: '"公司楼下的星巴克".'
              },
              {
                question_number: 39,
                prompt: 'Hỏi: Món quà lưu niệm được mua ở đâu? (纪念品是在哪儿买的？)',
                audio_text: '女：这把折扇真精致，是在杭州买的吗？男：对，去西湖游玩时在老街的手工艺品店买的。问：这把扇子是在哪儿买的？',
                pinyin: 'qù Xīhú yóuwán shí... zài Hángzhōu',
                options: ['A. 杭州 (Hàng Châu)', 'B. 苏州 (Tô Châu)', 'C. 北京 (Bắc Kinh)'],
                correct_answer: 'A. 杭州 (Hàng Châu)',
                explanation: 'Mua khi đi chơi Tây Hồ ở thành phố Hàng Châu ("杭州").'
              },
              {
                question_number: 40,
                prompt: 'Hỏi: Người nam dự định thi chứng chỉ gì? (男的打算考什么证书？)',
                audio_text: '男：我今年一定要考过驾驶证，买辆车周末带父母去郊游。女：加油，多练练科目二和科目三准没问题！问：男的要考什么？',
                pinyin: 'kǎoguò jiàshǐzhèng',
                options: ['A. 驾驶证 (Bằng lái xe ô tô)', 'B. 教师资格证', 'C. 导游证'],
                correct_answer: 'A. 驾驶证 (Bằng lái xe ô tô)',
                explanation: '"驾驶证" là giấy phép lái xe.'
              }
            ]
          }
        ]
      },
      {
        id: 'hsk3-01-read',
        skill_type: 'reading',
        name: 'Đọc hiểu',
        chinese_name: '阅读',
        sort_order: 2,
        parts: [
          {
            id: 'hsk3-01-r-p1',
            part_number: 1,
            title: 'Phần 1 (Câu 41 - 50)',
            instructions: 'Đọc câu hỏi hoặc tình huống và ghép câu phản hồi tương ứng hợp lý (A, B, C).',
            sort_order: 1,
            questions: [
              {
                question_number: 41,
                prompt: 'Ghép câu cho: "请问去最近的中国银行怎么走？"',
                reading_text: '请问去最近的中国银行怎么走？Qǐngwèn qù zuì jìn de Zhōngguó Yínháng zěnme zǒu?',
                pinyin: 'Qǐngwèn qù zuì jìn de Zhōngguó Yínháng zěnme zǒu?',
                options: ['A. 顺着这条街往前走两百米，过马路就是。(Cứ theo phố này đi thẳng 200m qua đường là tới.)', 'B. 银行已经下班了。(Ngân hàng tan làm rồi.)', 'C. 一共是一百元。(Tổng cộng 100 đồng.)'],
                correct_answer: 'A. 顺着这条街往前走两百米，过马路就是。(Cứ theo phố này đi thẳng 200m qua đường là tới.)',
                explanation: 'Chỉ dẫn đường đi đến Ngân hàng Trung Quốc.'
              },
              {
                question_number: 42,
                prompt: 'Ghép câu cho: "你今天气色看起来不太好，是不是生病了？"',
                reading_text: '你今天气色看起来不太好，是不是生病了？Nǐ jīntiān qìsè kàn qǐlái bú tài hǎo, shìbúshì shēngbìng le?',
                pinyin: 'qìsè kàn qǐlái bú tài hǎo',
                options: ['A. 昨晚有点儿失眠，头隐隐作痛。(Tối qua hơi mất ngủ, đầu đau âm ỉ.)', 'B. 我今天穿了新衣服。(Tôi mặc áo mới.)', 'C. 电影非常精彩。(Phim rất hay.)'],
                correct_answer: 'A. 昨晚有点儿失眠，头隐隐作痛。(Tối qua hơi mất ngủ, đầu đau âm ỉ.)',
                explanation: 'Sắc mặt kém do đêm trước mất ngủ đau đầu.'
              },
              {
                question_number: 43,
                prompt: 'Ghép câu cho: "这本小说情节跌宕起伏，太吸引人了！"',
                reading_text: '这本小说情节跌宕起伏，太吸引人了！Zhè běn xiǎoshuō qíngjié diēdàng-qǐfú, tài xīyǐn rén le!',
                pinyin: 'tài xīyǐn rén le!',
                options: ['A. 我也是看了一宿没合眼，一口气看完了。(Tôi cũng đọc suốt đêm không chớp mắt, đọc một mạch hết luôn.)', 'B. 菜做得很香。(Nấu ăn thơm.)', 'C. 明天有大雨。(Mai có mưa to.)'],
                correct_answer: 'A. 我也是看了一宿没合眼，一口气看完了。(Tôi cũng đọc suốt đêm không chớp mắt, đọc một mạch hết luôn.)',
                explanation: 'Cùng chia sẻ sự say mê đọc truyện lôi cuốn.'
              },
              {
                question_number: 44,
                prompt: 'Ghép câu cho: "周末我们一起去郊区露营看星空吧？"',
                reading_text: '周末我们一起去郊区露营看星空吧？Zhōumò wǒmen yìqǐ qù jiāoqū lùyíng kàn xīngkōng ba?',
                pinyin: 'qù jiāoqū lùyíng kàn xīngkōng ba?',
                options: ['A. 太棒了！我正好新买了一顶双人帐篷。(Tuyệt quá! Tôi vừa vặn mới mua một chiếc lều đôi.)', 'B. 我很饱了。(Tôi no rồi.)', 'C. 考试成绩出来了。(Có điểm thi rồi.)'],
                correct_answer: 'A. 太棒了！我正好新买了一顶双人帐篷。(Tuyệt quá! Tôi vừa vặn mới mua một chiếc lều đôi.)',
                explanation: 'Đồng ý đi cắm trại ngắm sao và chuẩn bị sẵn lều.'
              },
              {
                question_number: 45,
                prompt: 'Ghép câu cho: "这台空调怎么一直在吹热风？"',
                reading_text: '这台空调怎么一直在吹热风？Zhè tái kōngtiáo zěnme yìzhí zài chuī rèfēng?',
                pinyin: 'kōngtiáo zěnme yìzhí zài chuī rèfēng?',
                options: ['A. 可能是模式设错了，把制冷模式调出来看看。(Có thể đặt nhầm chế độ, chỉnh sang làm lạnh thử xem.)', 'B. 今天是星期日。(Hôm nay chủ nhật.)', 'C. 水果很甜。(Trái cây rất ngọt.)'],
                correct_answer: 'A. 可能是模式设错了，把制冷模式调出来看看。(Có thể đặt nhầm chế độ, chỉnh sang làm lạnh thử xem.)',
                explanation: 'Điều hòa thổi gió nóng do nhầm chế độ làm lạnh (制冷).'
              },
              {
                question_number: 46,
                prompt: 'Ghép câu cho: "这道红烧牛肉味道真地道，怎么做的？"',
                reading_text: '这道红烧牛肉味道真地道，怎么做的？Zhè dào hóngshāo niúròu wèidào zhēn dìdao, zěnme zuò de?',
                pinyin: 'wèidào zhēn dìdao, zěnme zuò de?',
                options: ['A. 秘诀是要用小火慢炖两个小时，肉质才软烂入味。(Bí quyết là dùng lửa nhỏ hầm liu riu 2 tiếng thịt mới mềm ngấm.)', 'B. 衣服很合身。(Áo vừa vặn.)', 'C. 火车准点出发。(Tàu chạy đúng giờ.)'],
                correct_answer: 'A. 秘诀是要用小火慢炖两个小时，肉质才软烂入味。(Bí quyết là dùng lửa nhỏ hầm liu riu 2 tiếng thịt mới mềm ngấm.)',
                explanation: 'Giải thích bí quyết nấu món bò kho mềm thơm.'
              },
              {
                question_number: 47,
                prompt: 'Ghép câu cho: "经理，下周的项目计划书我已经发送到您的邮箱了。"',
                reading_text: '经理，下周的项目计划书我已经发送到您的邮箱了。Jīnglǐ, xià zhōu de xiàngmù jìhuàshū wǒ yǐjīng fāsòng dào nín de yóuxiāng le.',
                pinyin: 'yǐjīng fāsòng dào nín de yóuxiāng le.',
                options: ['A. 好的，我审阅后给你反馈意见。(Được rồi, tôi xem xét xong sẽ phản hồi ý kiến cho bạn.)', 'B. 我不想喝茶。(Tôi không muốn uống trà.)', 'C. 天空很蓝。(Bầu trời xanh ngắt.)'],
                correct_answer: 'A. 好的，我审阅后给你反馈意见。(Được rồi, tôi xem xét xong sẽ phản hồi ý kiến cho bạn.)',
                explanation: 'Người quản lý tiếp nhận email tài liệu công việc.'
              },
              {
                question_number: 48,
                prompt: 'Ghép câu cho: "听说小李被评为今年公司的优秀员工了。"',
                reading_text: '听说小李被评为今年公司的优秀员工了。Tīngshuō Xiǎo Lǐ bèi píng wéi jīnnián gōngsī de yōuxiù yuángōng le.',
                pinyin: 'yōuxiù yuángōng',
                options: ['A. 他工作一向兢兢业业，确实实至名归。(Anh ấy làm việc luôn tận tụy cống hiến, thật xứng đáng.)', 'B. 电脑坏了。(Máy tính hỏng.)', 'C. 还没吃午饭。(Chưa ăn trưa.)'],
                correct_answer: 'A. 他工作一向兢兢业业，确实实至名归。(Anh ấy làm việc luôn tận tụy cống hiến, thật xứng đáng.)',
                explanation: 'Đánh giá khen ngợi nhân viên xuất sắc.'
              },
              {
                question_number: 49,
                prompt: 'Ghép câu cho: "你这次去哈尔滨旅游冷不冷？"',
                reading_text: '你这次去哈尔滨旅游冷不冷？Nǐ zhè cì qù Hā\'ěrbīn lǚyóu lěng bù lěng?',
                pinyin: 'qù Hā\'ěrbīn lǚyóu lěng bù lěng?',
                options: ['A. 零下二十度，不过穿羽绒服看冰雕太震撼了！(Âm 20 độ, nhưng mặc áo lông vũ ngắm băng đăng quá choáng ngợp!)', 'B. 我买了一本书。(Tôi mua một cuốn sách.)', 'C. 骑自行车去。(Đi xe đạp.)'],
                correct_answer: 'A. 零下二十度，不过穿羽绒服看冰雕太震撼了！(Âm 20 độ, nhưng mặc áo lông vũ ngắm băng đăng quá choáng ngợp!)',
                explanation: 'Kể về trải nghiệm ngắm băng đăng âm 20 độ ở Cáp Nhĩ Tân.'
              },
              {
                question_number: 50,
                prompt: 'Ghép câu cho: "下班后一起去操场打羽毛球吧？"',
                reading_text: '下班后一起去操场打羽毛球吧？Xiàbān hòu yìqǐ qù cāochǎng dǎ yǔmáoqiú ba?',
                pinyin: 'qù cāochǎng dǎ yǔmáoqiú ba?',
                options: ['A. 好啊，我好久没运动了，正想舒展一下筋骨。(Được thôi, tôi lâu lắm chưa vận động, đang muốn giãn gân cốt.)', 'B. 票买好了。(Mua vé rồi.)', 'C. 药吃过了。(Uống thuốc rồi.)'],
                correct_answer: 'A. 好啊，我好久没运动了，正想舒展一下筋骨。(Được thôi, tôi lâu lắm chưa vận động, đang muốn giãn gân cốt.)',
                explanation: 'Đồng ý lời rủ đi chơi cầu lông vận động cơ thể.'
              }
            ]
          },
          {
            id: 'hsk3-01-r-p2',
            part_number: 2,
            title: 'Phần 2 (Câu 51 - 60)',
            instructions: 'Chọn từ ngữ phù hợp nhất điền vào chỗ trống đoạn văn.',
            sort_order: 2,
            questions: [
              {
                question_number: 51,
                prompt: 'Điền từ: 保护环境是每个公民应尽的_____。',
                reading_text: '保护环境是每个公民应尽的_____。Bǎohù huánjìng shì měi gè gōngmín yīng jìn de _____.',
                pinyin: 'yīng jìn de _____',
                options: ['A. 责任 (trách nhiệm)', 'B. 机会 (cơ hội)', 'C. 热情 (nhiệt tình)'],
                correct_answer: 'A. 责任 (trách nhiệm)',
                explanation: '"应尽的责任" là trách nhiệm cần hoàn thành của công dân.'
              },
              {
                question_number: 52,
                prompt: 'Điền từ: 尽管遇到了许多困难，但他从不_____。',
                reading_text: '尽管遇到了许多困难，但他从不_____。Jǐnguǎn yùdào le xǔduō kùnnan, dàn tā cóng bù _____.',
                pinyin: 'cóng bù _____',
                options: ['A. 放弃 (từ bỏ)', 'B. 接受 (tiếp nhận)', 'C. 相信 (tin tưởng)'],
                correct_answer: 'A. 放弃 (từ bỏ)',
                explanation: '"从不放弃" nghĩa là không bao giờ bỏ cuộc.'
              },
              {
                question_number: 53,
                prompt: 'Điền từ: 他把行李箱锁好，然后放进了衣柜_____。',
                reading_text: '他把行李箱锁好，然后放进了衣柜_____。Tā bǎ xínglixiāng suǒ hǎo, ránhòu fàngjìn le yīguì _____.',
                pinyin: 'fàngjìn le yīguì _____',
                options: ['A. 里面 (bên trong)', 'B. 附近 (lân cận)', 'C. 以前 (trước đây)'],
                correct_answer: 'A. 里面 (bên trong)',
                explanation: 'Cất va li vào bên trong tủ áo: "放进了衣柜里面".'
              },
              {
                question_number: 54,
                prompt: 'Điền từ: 请大家遵守交通_____，红灯停，绿灯行。',
                reading_text: '请大家遵守交通_____，红灯停，绿灯行。Qǐng dàjiā zūnshǒu jiāotōng _____, hóngdēng tíng, lǜdēng xíng.',
                pinyin: 'zūnshǒu jiāotōng _____',
                options: ['A. 规则 (quy tắc / luật lệ)', 'B. 习惯 (thói quen)', 'C. 经验 (kinh nghiệm)'],
                correct_answer: 'A. 规则 (quy tắc / luật lệ)',
                explanation: '"交通规则" là luật giao thông.'
              },
              {
                question_number: 55,
                prompt: 'Điền từ: 中国的茶文化有着悠久的_____。',
                reading_text: '中国的茶文化有着悠久的_____。Zhōngguó de chá wénhuà yǒuzhe yōujiǔ de _____.',
                pinyin: 'yōujiǔ de _____',
                options: ['A. 历史 (lịch sử)', 'B. 故事 (câu chuyện)', 'C. 传统 (truyền thống)'],
                correct_answer: 'A. 历史 (lịch sử)',
                explanation: '"悠久的历史" cụm từ cố định chỉ lịch sử lâu đời.'
              },
              {
                question_number: 56,
                prompt: 'Điền từ: 经常散步不仅能促进消化，还能_____压力。',
                reading_text: '经常散步不仅能促进消化，还能_____压力。Jīngcháng sànbù bùjǐn néng cùjìn xiāohuà, hái néng _____ yālì.',
                pinyin: 'hái néng _____ yālì.',
                options: ['A. 减轻 (giảm bớt)', 'B. 提高 (nâng cao)', 'C. 增加 (gia tăng)'],
                correct_answer: 'A. 减轻 (giảm bớt)',
                explanation: '"减轻压力" giảm bớt áp lực căng thẳng.'
              },
              {
                question_number: 57,
                prompt: 'Điền từ: 他的普通话非常_____，听起来像播音员一样。',
                reading_text: '他的普通话非常_____，听起来像播音员一样。Tā de pǔtōnghuà fēicháng _____, tīng qǐlái xiàng bōyīnyuán yíyàng.',
                pinyin: 'pǔtōnghuà fēicháng _____',
                options: ['A. 标准 (chuẩn mực)', 'B. 清楚 (rõ ràng)', 'C. 认真 (chăm chỉ)'],
                correct_answer: 'A. 标准 (chuẩn mực)',
                explanation: '"普通话非常标准" phát âm tiếng phổ thông rất chuẩn xác.'
              },
              {
                question_number: 58,
                prompt: 'Điền từ: 这个周末我想彻底把房间_____一遍。',
                reading_text: '这个周末我想彻底把房间_____一遍。Zhège zhōumò wǒ xiǎng chèdǐ bǎ fángjiān _____ yíbiàn.',
                pinyin: 'bǎ fángjiān _____ yíbiàn.',
                options: ['A. 打扫 (quét dọn / dọn dẹp)', 'B. 整理 (sắp xếp)', 'C. 修理 (sửa chữa)'],
                correct_answer: 'A. 打扫 (quét dọn / dọn dẹp)',
                explanation: '"打扫房间" là dọn dẹp phòng ốc sạch sẽ.'
              },
              {
                question_number: 59,
                prompt: 'Điền từ: 随着科学技术的_____，人们的生活变得越来越便捷。',
                reading_text: '随着科学技术的_____，人们的生活变得越来越便捷。Suízhe kēxué jìshù de _____, rénmen de shēnghuó biànde yuèláiyuè biànjié.',
                pinyin: 'kēxué jìshù de _____',
                options: ['A. 发展 (phát triển)', 'B. 提高 (nâng cao)', 'C. 改变 (thay đổi)'],
                correct_answer: 'A. 发展 (phát triển)',
                explanation: '"科学技术的发展" sự phát triển của khoa học kỹ thuật.'
              },
              {
                question_number: 60,
                prompt: 'Điền từ: 无论遇到什么事情，我们都要保持_____的心态。',
                reading_text: '无论遇到什么事情，我们都要保持_____的心态。Wúlùn yùdào shénme shìqing, wǒmen dōu yào bǎochí _____ de xīntài.',
                pinyin: 'bǎochí _____ de xīntài.',
                options: ['A. 乐观 (lạc quan)', 'B. 伤心 (đau buồn)', 'C. 紧张 (căng thẳng)'],
                correct_answer: 'A. 乐观 (lạc quan)',
                explanation: '"保持乐观的心态" duy trì tâm thái lạc quan.'
              }
            ]
          },
          {
            id: 'hsk3-01-r-p3',
            part_number: 3,
            title: 'Phần 3 (Câu 61 - 70)',
            instructions: 'Đọc đoạn văn ngắn và chọn câu trả lời trắc nghiệm chuẩn xác A, B, C.',
            sort_order: 3,
            questions: [
              {
                question_number: 61,
                prompt: 'Đọc đoạn văn và trả lời: Người viết muốn chuyển tải thông điệp gì?',
                reading_text: '每天早起十分钟，不仅可以从容地吃一顿丰盛的早餐，还能避免因为赶车而慌慌张张。保持从容的心情，是一天高效工作的开始。★ 这段话主要告诉我们：',
                pinyin: 'Měitiān zǎoqǐ shí fēnzhōng... bǎochí cóngróng de xīnqíng',
                options: ['A. 早起十分钟的好处 (Lợi ích của việc dậy sớm 10 phút)', 'B. 早餐要多吃肉', 'C. 如何快速赶车'],
                correct_answer: 'A. 早起十分钟的好处 (Lợi ích của việc dậy sớm 10 phút)',
                explanation: 'Đoạn văn phân tích các lợi ích thiết thực của việc dậy sớm thêm 10 phút.'
              },
              {
                question_number: 62,
                prompt: 'Đọc đoạn văn và trả lời: Theo bài viết, vì sao trẻ em thích đọc truyện tranh?',
                reading_text: '很多小孩子喜欢看连环画，因为图文并茂的形式让他们更容易理解故事内容，同时丰富的色彩也能激发他们的想象力。★ 小孩子喜欢看连环画是因为：',
                pinyin: 'túwén bìngmào de xíngshì ràng tāmen gèng róngyì lǐjiě',
                options: ['A. 容易理解且能激发想象力 (Dễ hiểu và khơi nguồn trí tưởng tượng)', 'B. 字数特别少', 'C. 老师强制要求'],
                correct_answer: 'A. 容易理解且能激发想象力 (Dễ hiểu và khơi nguồn trí tưởng tượng)',
                explanation: 'Truyện có hình vẽ minh họa giúp trẻ dễ hiểu và kích thích tưởng tượng.'
              },
              {
                question_number: 63,
                prompt: 'Đọc đoạn văn và trả lời: Tác dụng chính của trà xanh là gì?',
                reading_text: '绿茶是中国主要的茶类之一。研究表明，经常适量饮用绿茶，有助于抗氧化、提神醒脑，还能帮助人体消化脂肪。★ 喝绿茶的好处不包括：',
                pinyin: 'kàng yǎnghuà, tíshén xǐngnǎo, bāngzhù xiāohuà zhīfáng',
                options: ['A. 让人迅速入睡 (Giúp dễ ngủ say)', 'B. 提神醒脑 (Tỉnh táo tinh thần)', 'C. 帮助消化 (Hỗ trợ tiêu hóa)'],
                correct_answer: 'A. 让人迅速入睡 (Giúp dễ ngủ say)',
                explanation: 'Trà xanh giúp tỉnh táo tinh thần (提神醒脑), không có tác dụng làm dễ ngủ say.'
              },
              {
                question_number: 64,
                prompt: 'Đọc đoạn văn và trả lời: Muốn học tốt ngoại ngữ cần làm gì?',
                reading_text: '学习一门外语就像打开一扇通往新世界的大门。除了掌握基础词汇和语法外，更重要的是勇敢开口交流，不要害怕犯错误。★ 学习外语最重要的是：',
                pinyin: 'gèng zhòngyào de shì yǒnggǎn kāikǒu jiāoliú',
                options: ['A. 勇敢开口表达交流 (Dũng cảm mở lời giao tiếp)', 'B. 背诵全部字典', 'C. 从不犯任何语法错误'],
                correct_answer: 'A. 勇敢开口表达交流 (Dũng cảm mở lời giao tiếp)',
                explanation: '"更重要的是勇敢开口交流" (Quan trọng hơn là dũng cảm mở miệng giao tiếp).'
              },
              {
                question_number: 65,
                prompt: 'Đọc đoạn văn và trả lời: Vì sao chú gấu trúc được mọi người yêu thích?',
                reading_text: '大熊猫不仅是中国的一级保护动物，也是全世界和平与友谊的象征。它们圆圆的脑袋、黑白分明的毛发和慢悠悠的动作，深受世界各地人们的喜爱。★ 人们喜欢大熊猫主要是因为：',
                pinyin: 'shēnshòu shìjiè gèdì rénmen de xǐ\'ài.',
                options: ['A. 外形可爱惹人喜爱 (Ngoại hình đáng yêu)', 'B. 跑得非常快', 'C. 能帮助人类工作'],
                correct_answer: 'A. 外形可爱惹人喜爱 (Ngoại hình đáng yêu)',
                explanation: 'Đầu tròn, lông đen trắng, cử chỉ thong thả đáng yêu.'
              },
              {
                question_number: 66,
                prompt: 'Đọc đoạn văn và trả lời: Tác giả cảm thấy món quà quý giá nhất là gì?',
                reading_text: '千里送鹅毛，礼轻情意重。在人际交往中，礼物的价格高低并不重要，真正打动人的是送礼者所包含的真诚心意。★ 最打动人的是：',
                pinyin: 'zhēnchéng xīnyì',
                options: ['A. 真诚的心意 (Tấm lòng chân thành)', 'B. 礼物的昂贵价格', 'C. 华丽的外包装'],
                correct_answer: 'A. 真诚的心意 (Tấm lòng chân thành)',
                explanation: '"真正打动人的是送礼者所包含的真诚心意".'
              },
              {
                question_number: 67,
                prompt: 'Đọc đoạn văn và trả lời: Thói quen đi bộ mang lại điều gì?',
                reading_text: '饭后百步走，活到九十九。每天晚餐半小时后散步半个小时，不仅能促进肠胃蠕动，还能让紧绷了一天的大脑得到充分放松。★ 散步的最佳时间是：',
                pinyin: 'wǎncān bàn xiǎoshí hòu',
                options: ['A. 晚餐半小时后 (Nửa tiếng sau bữa tối)', 'B. 刚吃饱立刻跑', 'C. 半夜十二点'],
                correct_answer: 'A. 晚餐半小时后 (Nửa tiếng sau bữa tối)',
                explanation: '"每天晚餐半小时后散步" (Mỗi ngày đi dạo nửa tiếng sau bữa tối).'
              },
              {
                question_number: 68,
                prompt: 'Đọc đoạn văn và trả lời: Câu chuyện muốn truyền cảm hứng gì?',
                reading_text: '失败并不可怕，可怕的是在跌倒之后失去了重新站起来的勇气。每一个成功人士的背后，都经历过无数次不为人知的失败与摸索。★ 这段话鼓励我们要：',
                pinyin: 'chóngxīn zhàn qǐlái de yǒngqì',
                options: ['A. 勇敢面对失败坚持到底 (Dũng cảm đối mặt thất bại kiên trì đến cùng)', 'B. 避免做任何有风险的事', 'C. 迅速放弃困难的目标'],
                correct_answer: 'A. 勇敢面对失败坚持到底 (Dũng cảm đối mặt thất bại kiên trì đến cùng)',
                explanation: 'Động viên con người dũng cảm đứng lên sau vấp ngã.'
              },
              {
                question_number: 69,
                prompt: 'Đọc đoạn văn và trả lời: Du lịch mang lại giá trị gì lớn nhất?',
                reading_text: '读万卷书，行万里路。旅行不仅是欣赏美丽的自然风光，更能体验不同地区的风土人情，拓展一个人的眼界与心胸。★ 旅行的最大收获是：',
                pinyin: 'tuòzhǎn yǎnjiè yǔ xīnxiōng',
                options: ['A. 开阔眼界增长见识 (Mở mang tầm mắt và hiểu biết)', 'B. 买到便宜的特产', 'C. 拍照发社交平台'],
                correct_answer: 'A. 开阔眼界增长见识 (Mở mang tầm mắt và hiểu biết)',
                explanation: '"拓展一个人的眼界与心胸" (Mở rộng tầm mắt và tấm lòng).'
              },
              {
                question_number: 70,
                prompt: 'Đọc đoạn văn và trả lời: Cách xử lý khi gặp áp lực công việc là gì?',
                reading_text: '面对繁重的工作任务时，与其盲目焦虑，不如把大目标分解成几个可以按部就班完成的小步骤，逐一解决。★ 缓解工作压力的有效方法是：',
                pinyin: 'bǎ dà mùbiāo fēnjiě chéng xiǎo bùzhòu',
                options: ['A. 分解目标按部就班执行 (Chia nhỏ mục tiêu thực hiện từng bước)', 'B. 拖延到最后一刻', 'C. 向同事发脾气'],
                correct_answer: 'A. 分解目标按部就班执行 (Chia nhỏ mục tiêu thực hiện từng bước)',
                explanation: '"把大目标分解成几个可以按部就班完成的小步骤".'
              }
            ]
          }
        ]
      },
      {
        id: 'hsk3-01-write',
        skill_type: 'writing',
        name: 'Viết & Sắp xếp',
        chinese_name: '书写',
        sort_order: 3,
        parts: [
          {
            id: 'hsk3-01-w-p1',
            part_number: 1,
            title: 'Phần 1 (Câu 71 - 75)',
            instructions: 'Sắp xếp các từ ngữ xáo trộn thành câu hoàn chỉnh đúng ngữ pháp tiếng Hán.',
            sort_order: 1,
            questions: [
              {
                question_number: 71,
                prompt: 'Sắp xếp thành câu: 汉语 / 他 / 说得 / 非常 / 好',
                reading_text: '汉语 / 他 / 说得 / 非常 / 好',
                pinyin: 'Hànyǔ / tā / shuō de / fēicháng / hǎo',
                options: [
                  'A. 他汉语说得非常好。(Tā Hànyǔ shuō de fēicháng hǎo.)',
                  'B. 非常好他汉语说得。(Fēicháng hǎo tā Hànyǔ shuō de.)',
                  'C. 汉语他非常说得好。(Hànyǔ tā fēicháng shuō de hǎo.)'
                ],
                correct_answer: 'A. 他汉语说得非常好。(Tā Hànyǔ shuō de fēicháng hǎo.)',
                explanation: 'Cấu trúc bổ ngữ trạng thái: Chủ ngữ + Tân ngữ + Động từ + 得 + Phó từ mức độ + Tính từ ("他汉语说得非常好").'
              },
              {
                question_number: 72,
                prompt: 'Sắp xếp thành câu: 干净 / 把 / 房间 / 打扫 / 请',
                reading_text: '干净 / 把 / 房间 / 打扫 / 请',
                pinyin: 'gānjìng / bǎ / fángjiān / dǎsǎo / qǐng',
                options: [
                  'A. 请把房间打扫干净。(Qǐng bǎ fángjiān dǎsǎo gānjìng.)',
                  'B. 把房间请干净打扫。(Bǎ fángjiān qǐng gānjìng dǎsǎo.)',
                  'C. 房间把请打扫干净。(Fángjiān bǎ qǐng dǎsǎo gānjìng.)'
                ],
                correct_answer: 'A. 请把房间打扫干净。(Qǐng bǎ fángjiān dǎsǎo gānjìng.)',
                explanation: 'Cấu trúc câu chữ 把: 请 + 把 + Tân ngữ (房间) + Động từ (打扫) + Bổ ngữ kết quả (干净).'
              },
              {
                question_number: 73,
                prompt: 'Sắp xếp thành câu: 一起 / 去 / 看电影 / 我们 / 吧',
                reading_text: '一起 / 去 / 看电影 / 我们 / 吧',
                pinyin: 'yìqǐ / qù / kàn diànyǐng / wǒmen / ba',
                options: [
                  'A. 我们一起去看电影吧。(Wǒmen yìqǐ qù kàn diànyǐng ba.)',
                  'B. 看电影一起去我们吧。(Kàn diànyǐng yìqǐ qù wǒmen ba.)',
                  'C. 一起去我们看电影吧。(Yìqǐ qù wǒmen kàn diànyǐng ba.)'
                ],
                correct_answer: 'A. 我们一起去看电影吧。(Wǒmen yìqǐ qù kàn diànyǐng ba.)',
                explanation: 'Câu cầu khiến rủ rê: Chủ ngữ (我们) + Phó từ (一起) + Động từ liên hoàn (去看电影) + Trợ từ ngữ khí (吧).'
              },
              {
                question_number: 74,
                prompt: 'Sắp xếp thành câu: 比 / 哥哥 / 我 / 高 / 五厘米',
                reading_text: '比 / 哥哥 / 我 / 高 / 五厘米',
                pinyin: 'bǐ / gēge / wǒ / gāo / wǔ límǐ',
                options: [
                  'A. 哥哥比我高五厘米。(Gēge bǐ wǒ gāo wǔ límǐ.)',
                  'B. 我比哥哥高五厘米。(Wǒ bǐ gēge gāo wǔ límǐ.)',
                  'C. 哥哥我比五厘米高。(Gēge wǒ bǐ wǔ límǐ gāo.)'
                ],
                correct_answer: 'A. 哥哥比我高五厘米。(Gēge bǐ wǒ gāo wǔ límǐ.)',
                explanation: 'Cấu trúc câu so sánh chữ 比: A + 比 + B + Tính từ + Lượng từ sai biệt ("哥哥比我高五厘米").'
              },
              {
                question_number: 75,
                prompt: 'Sắp xếp thành câu: 被 / 吃了 / 苹果 / 弟弟',
                reading_text: '被 / 吃了 / 苹果 / 弟弟',
                pinyin: 'bèi / chī le / píngguǒ / dìdi',
                options: [
                  'A. 苹果被弟弟吃了。(Píngguǒ bèi dìdi chī le.)',
                  'B. 弟弟被苹果吃了。(Dìdi bèi píngguǒ chī le.)',
                  'C. 吃了苹果被弟弟。(Chī le píngguǒ bèi dìdi.)'
                ],
                correct_answer: 'A. 苹果被弟弟吃了。(Píngguǒ bèi dìdi chī le.)',
                explanation: 'Cấu trúc câu bị động chữ 被: Chủ thể chịu tác động (苹果) + 被 + Chủ thể tác động (弟弟) + Động từ + trợ từ (吃了).'
              }
            ]
          },
          {
            id: 'hsk3-01-w-p2',
            part_number: 2,
            title: 'Phần 2 (Câu 76 - 80)',
            instructions: 'Điền chữ Hán chính xác vào chỗ trống theo Pinyin cho sẵn trong câu.',
            sort_order: 2,
            questions: [
              {
                question_number: 76,
                prompt: 'Điền chữ Hán: 他是我的好朋_____(you)，我们经常一起踢足球。',
                reading_text: '他是我的好朋_____(you)，我们经常一起踢足球。Tā shì wǒ de hǎo péng_____(you), wǒmen jīngcháng yìqǐ tī zúqiú.',
                pinyin: 'péngyou',
                options: ['A. 友 (bạn bè - 朋友)', 'B. 右 (bên phải)', 'C. 有 (có)'],
                correct_answer: 'A. 友 (bạn bè - 朋友)',
                explanation: 'Từ "朋友" (péngyou) nghĩa là bạn bè, chữ cần điền là chữ 友.'
              },
              {
                question_number: 77,
                prompt: 'Điền chữ Hán: 我在大学学_____(xí)计算机科学。',
                reading_text: '我在大学学_____(xí)计算机科学。Wǒ zài dàxué xué_____(xí) jìsuànjī kēxué.',
                pinyin: 'xuéxí',
                options: ['A. 习 (học tập - 学习)', 'B. 洗 (rửa)', 'C. 西 (hướng tây)'],
                correct_answer: 'A. 习 (học tập - 学习)',
                explanation: 'Từ "学习" (xuéxí) nghĩa là học tập, chữ cần điền là chữ 习.'
              },
              {
                question_number: 78,
                prompt: 'Điền chữ Hán: 他今_____(tiān)下午要去机场接人。',
                reading_text: '他今_____(tiān)下午要去机场接人。Tā jīn_____(tiān) xiàwǔ yào qù jīchǎng jiē rén.',
                pinyin: 'jīntiān',
                options: ['A. 天 (ngày / trời - 今天)', 'B. 甜 (ngọt)', 'C. 田 (ruộng)'],
                correct_answer: 'A. 天 (ngày / trời - 今天)',
                explanation: 'Từ "今天" (jīntiān) nghĩa là hôm nay, chữ cần điền là chữ 天.'
              },
              {
                question_number: 79,
                prompt: 'Điền chữ Hán: 这件衣服的颜_____(sè)非常鲜艳。',
                reading_text: '这件衣服的颜_____(sè)非常鲜艳。Zhè jiàn yīfu de yán_____(sè) fēicháng xiānyàn.',
                pinyin: 'yánsè',
                options: ['A. 色 (màu sắc - 颜色)', 'B. 涩 (chát)', 'C. 舍 (từ bỏ)'],
                correct_answer: 'A. 色 (màu sắc - 颜色)',
                explanation: 'Từ "颜色" (yánsè) nghĩa là màu sắc, chữ cần điền là chữ 色.'
              },
              {
                question_number: 80,
                prompt: 'Điền chữ Hán: 祝你生_____(rì)快乐，心想事成！',
                reading_text: '祝你生_____(rì)快乐，心想事成！Zhù nǐ shēng_____(rì) kuàilè, xīnxiǎngshìchéng!',
                pinyin: 'shēngrì',
                options: ['A. 日 (ngày - 生日)', 'B. 月 (tháng)', 'C. 年 (năm)'],
                correct_answer: 'A. 日 (ngày - 生日)',
                explanation: 'Từ "生日" (shēngrì) nghĩa là ngày sinh nhật, chữ cần điền là chữ 日.'
              }
            ]
          }
        ]
      }
    ]
  },

  // ĐỀ THI HSK 3 - ĐỀ SỐ 02 (H31330) - 80 CÂU ĐẦY ĐỦ
  {
    id: 'official-hsk3-02',
    title: 'Đề Thi Thử HSK 3 Toàn Diện - Đề Số 02 (H31330)',
    chineseTitle: '新汉语水平考试 HSK（三级）样卷二 H31330',
    level: 'HSK 3',
    duration: 85,
    passingScore: 180,
    maxScore: 300,
    tag: 'Đề Chuẩn Hanban',
    description: 'Đề thi chính thức HSK 3 mã H31330 chuẩn Hanban với đầy đủ 80 câu hỏi (Nghe 1-40, Đọc 41-70, Viết 71-80), có audio script, pinyin và giải thích chi tiết.',
    skills: [
      {
        id: 'hsk3-02-listen',
        skill_type: 'listening',
        name: 'Nghe hiểu',
        chinese_name: '听力',
        sort_order: 1,
        parts: [
          {
            id: 'hsk3-02-l-p1',
            part_number: 1,
            title: 'Phần 1 (Câu 1 - 10)',
            instructions: 'Nghe đối thoại ngắn, chọn nội dung hoặc hình ảnh tương ứng.',
            sort_order: 1,
            questions: [
              {
                question_number: 1,
                prompt: 'Nghe đối thoại và chọn địa điểm:',
                audio_text: '男：请出示您的护照和登机牌。女：给您，请问可以托运两件行李吗？',
                pinyin: 'qǐng chūshì nín de hùzhào hé dēngjīpái.',
                options: ['A. Sân bay (飞机场)', 'B. Bến xe khách (客运站)', 'C. Trạm tàu điện (地铁站)'],
                correct_answer: 'A. Sân bay (飞机场)',
                explanation: '"护照和登机牌" (hộ chiếu và thẻ lên máy bay) ở sân bay.'
              },
              {
                question_number: 2,
                prompt: 'Nghe đối thoại và chọn món đồ được mua:',
                audio_text: '女：小李，这辆山地自行车真帅气，多少钱买的？男：花了我一千两百块呢。',
                pinyin: 'shāndì zìxíngchē zhēn shuàiqi',
                options: ['A. Xe đạp địa hình (山地自行车)', 'B. Xe máy điện', 'C. Ván trượt'],
                correct_answer: 'A. Xe đạp địa hình (山地自行车)',
                explanation: '"山地自行车" là xe đạp leo núi/địa hình.'
              },
              {
                question_number: 3,
                prompt: 'Nghe đối thoại và chọn loại nhạc cụ:',
                audio_text: '男：隔壁弹钢琴的声音真好听，是谁在弹？女：是我表姐，她从小就学琴。',
                pinyin: 'dàn gāngqín de shēngyīn zhēn hǎotīng',
                options: ['A. Đàn Piano (钢琴)', 'B. Đàn Guitar (吉他)', 'C. Đàn Cổ tranh (古筝)'],
                correct_answer: 'A. Đàn Piano (钢琴)',
                explanation: '"弹钢琴" là chơi đàn dương cầm (piano).'
              },
              {
                question_number: 4,
                prompt: 'Nghe đối thoại và chọn việc họ đang làm:',
                audio_text: '女：快看，湖面上有好几只白天鹅呢！男：真美，我赶紧拿相机拍几张照片。',
                pinyin: 'ná xiàngjī pāi jǐ zhāng zhàopiàn.',
                options: ['A. Chụp ảnh thiên nga trên hồ (拍天鹅照片)', 'B. Câu cá ở bờ hồ', 'C. Bơi lội'],
                correct_answer: 'A. Chụp ảnh thiên nga trên hồ (拍天鹅照片)',
                explanation: '"拍几张照片" chụp ảnh thiên nga trên mặt hồ.'
              },
              {
                question_number: 5,
                prompt: 'Nghe đối thoại và chọn món tráng miệng:',
                audio_text: '男：饭后吃点甜点吧，想吃草莓蛋糕还是巧克力冰淇淋？女：来一块草莓蛋糕吧。',
                pinyin: 'cǎoméi dàngāo',
                options: ['A. Bánh kem dâu tây (草莓蛋糕)', 'B. Kem sô cô la', 'C. Chè đậu đỏ'],
                correct_answer: 'A. Bánh kem dâu tây (草莓蛋糕)',
                explanation: '"草莓蛋糕" là bánh kem dâu tây.'
              },
              {
                question_number: 6,
                prompt: 'Nghe đối thoại và chọn trạng thái thời tiết:',
                audio_text: '女：外面雾太大了，能见度不到五十米，开车一定要慢点。男：好的，我开着雾灯呢。',
                pinyin: 'wàimiàn wù tài dà le',
                options: ['A. Sương mù dày đặc (大雾)', 'B. Mưa tuyết lạnh giá', 'C. Nắng chang chang'],
                correct_answer: 'A. Sương mù dày đặc (大雾)',
                explanation: '"外面雾太大了" (Ngoài trời sương mù dày quá).'
              },
              {
                question_number: 7,
                prompt: 'Nghe đối thoại và chọn nghề nghiệp:',
                audio_text: '男：您好，我想咨询一下房屋买卖的合同法律问题。女：没问题，我是这家律所的专业律师。',
                pinyin: 'wǒ shì zhè jiā lǜsuǒ de zhuānyè lǜshī.',
                options: ['A. Luật sư (律师)', 'B. Kiến trúc sư', 'C. Kế toán'],
                correct_answer: 'A. Luật sư (律师)',
                explanation: '"律师" là luật sư tư vấn hợp đồng.'
              },
              {
                question_number: 8,
                prompt: 'Nghe đối thoại và chọn con vật được miêu tả:',
                audio_text: '女：树上那只小松鼠吃松果的样子真滑稽！男：是啊，毛茸茸的大尾巴真好看。',
                pinyin: 'nà zhī xiǎo sōngshǔ chī sōngguǒ',
                options: ['A. Con sóc nhỏ (小松鼠)', 'B. Con khỉ', 'C. Con gấu trúc'],
                correct_answer: 'A. Con sóc nhỏ (小松鼠)',
                explanation: '"小松鼠" là chú sóc nhỏ.'
              },
              {
                question_number: 9,
                prompt: 'Nghe đối thoại và chọn lý do đến muộn:',
                audio_text: '男：小王，今天早会你怎么迟到了？女：实在抱歉，半路上地铁突然故障停运了半小时。',
                pinyin: 'dìtiě tūrán gùzhàng tíngyùn',
                options: ['A. Tàu điện ngầm gặp sự cố kỹ thuật (地铁故障)', 'B. Dậy muộn ngủ quên', 'C. Trời đổ mưa to'],
                correct_answer: 'A. Tàu điện ngầm gặp sự cố kỹ thuật (地铁故障)',
                explanation: '"地铁突然故障" tàu điện gặp sự cố.'
              },
              {
                question_number: 10,
                prompt: 'Nghe đối thoại và chọn địa điểm khám chữa:',
                audio_text: '女：张医生，我的智齿最近发炎肿得厉害。男：先拍个牙片看看，必要时得拔掉。',
                pinyin: 'zhìchǐ zuìjìn fāyán... pāi gè yápiàn',
                options: ['A. Phòng khám nha khoa (牙科诊所)', 'B. Khoa mắt', 'C. Khoa da liễu'],
                correct_answer: 'A. Phòng khám nha khoa (牙科诊所)',
                explanation: 'Đau răng khôn "智齿" và chụp phim răng "牙片" ở nha khoa.'
              }
            ]
          },
          {
            id: 'hsk3-02-l-p2',
            part_number: 2,
            title: 'Phần 2 (Câu 11 - 20)',
            instructions: 'Nghe đoạn văn ngắn và phán đoán tính đúng sai Đúng (√) hoặc Sai (✕).',
            sort_order: 2,
            questions: [
              {
                question_number: 11,
                prompt: 'Phán đoán nhận định: "Anh ấy rất thích đọc sách lịch sử."',
                audio_text: '对我来说，读史使人明智。只要一有闲暇时间，我就会捧起一本中国通史细细品读。★ 他对历史很感兴趣。（ ）',
                pinyin: 'Tā duì lìshǐ hěn gǎn xìngqù.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: 'Đọc sách sử lúc rảnh rỗi cho thấy anh rất hứng thú với lịch sử. Nhận định Đúng.'
              },
              {
                question_number: 12,
                prompt: 'Phán đoán nhận định: "Quán cà phê này có không gian ồn ào náo nhiệt."',
                audio_text: '这家转角处的咖啡馆环境优雅宁静，背景音乐声音很轻，特别适合一个人安静地看书工作。★ 这家咖啡馆很吵闹。（ ）',
                pinyin: 'Zhè jiā kāfēiguǎn hěn chǎonào.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Sai (错误 - ✕)',
                explanation: 'Quán yên tĩnh thanh nhã ("优雅宁静"), nhận định ồn ào là Sai.'
              },
              {
                question_number: 13,
                prompt: 'Phán đoán nhận định: "Tiểu Triệu kiên trì tập luyện chạy bộ mỗi ngày."',
                audio_text: '无论刮风下雨还是严寒酷暑，小赵每天傍晚都会去体育场跑步五公里，从不间断。★ 小赵每天都坚持跑步。（ ）',
                pinyin: 'Xiǎo Zhào měitiān dōu jiānchí pǎobù.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: 'Không kể thời tiết vẫn chạy không gián đoạn. Nhận định Đúng.'
              },
              {
                question_number: 14,
                prompt: 'Phán đoán nhận định: "Họ quyết định hủy bỏ chuyến du lịch Vân Nam."',
                audio_text: '原定这周末去云南丽江游玩的计划，因为全家突发感冒，不得不推迟到下个月国庆假期。★ 他们取消了旅行计划。（ ）',
                pinyin: 'tuīchí dào xià gè yuè',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Sai (错误 - ✕)',
                explanation: 'Họ hoãn dời lịch ("推迟"), không phải hủy bỏ vĩnh viễn ("取消"). Nhận định Sai.'
              },
              {
                question_number: 15,
                prompt: 'Phán đoán nhận định: "Người nói đánh giá cao tinh thần làm việc của Tiểu Tôn."',
                audio_text: '小孙虽然来公司不到半年，但做事严谨认真，遇到不懂的问题虚心请教，进步非常明显。★ 他很认可小孙的工作表现。（ ）',
                pinyin: 'Tā hěn rènkě Xiǎo Sūn de gōngzuò biǎoxiàn.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: 'Khen ngợi làm việc nghiêm túc tiến bộ rõ rệt. Nhận định Đúng.'
              },
              {
                question_number: 16,
                prompt: 'Phán đoán nhận định: "Bộ phim mới này có doanh thu và đánh giá rất thấp."',
                audio_text: '这部科幻电影上映首周票房就突破了五亿元，网络评分高达九点二分，口碑极佳。★ 这部电影不受观众欢迎。（ ）',
                pinyin: 'Zhè bù diànyǐng bù shòu guānzhòng huānyíng.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Sai (错误 - ✕)',
                explanation: 'Doanh thu 500 triệu và điểm 9.2 cho thấy rất được đón nhận, nhận định không hoan nghênh là Sai.'
              },
              {
                question_number: 17,
                prompt: 'Phán đoán nhận định: "Chế độ ăn nhiều rau quả có lợi cho sức khỏe."',
                audio_text: '营养学专家指出，日常饮食中多摄入富含膳食纤维的新鲜果蔬，能有效预防多种慢性疾病。★ 多吃新鲜果蔬对身体有益。（ ）',
                pinyin: 'Duō chī xīnxiān guǒshū duì shēntǐ yǒuyì.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: 'Ăn rau quả tươi ngăn ngừa bệnh tật, có lợi cho cơ thể. Nhận định Đúng.'
              },
              {
                question_number: 18,
                prompt: 'Phán đoán nhận định: "Bác tài xế đã trả lại ví tiền cho hành khách."',
                audio_text: '在出租车后座发现乘客遗落的装有两万元现金的皮夹后，王师傅毫不犹豫地交到了派出所。★ 王师傅把钱包据为己有。（ ）',
                pinyin: 'Wáng shīfu bǎ qiánbāo jùwéijǐyǒu.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Sai (错误 - ✕)',
                explanation: 'Bác nộp cho đồn công an để trả lại, nhận định chiếm đoạt làm của riêng là Sai.'
              },
              {
                question_number: 19,
                prompt: 'Phán đoán nhận định: "Mùa xuân hoa anh đào ở Vũ Hán nở rất đẹp."',
                audio_text: '每年三月下旬，武汉大学校园内的樱花竞相绽放，吸引了全国数以万计的游客前来观赏。★ 武汉大学的樱花很出名。（ ）',
                pinyin: 'Wǔhàn Dàxué de yīnghuā hěn chūmíng.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: 'Hoa anh đào nở rộ thu hút hàng vạn du khách chứng minh rất nổi tiếng. Nhận định Đúng.'
              },
              {
                question_number: 20,
                prompt: 'Phán đoán nhận định: "Anh ấy cảm thấy học ngoại ngữ không cần kiên nhẫn."',
                audio_text: '学外语贵在持之以恒，哪怕每天只抽出二十分钟朗读背诵，一年下来也会有质的飞跃。★ 学外语需要坚持。（ ）',
                pinyin: 'Xué wàiyǔ xūyào jiānchí.',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: '"持之以恒" có nghĩa là phải kiên trì bền bỉ. Nhận định Đúng.'
              }
            ]
          },
          {
            id: 'hsk3-02-l-p3',
            part_number: 3,
            title: 'Phần 3 (Câu 21 - 30)',
            instructions: 'Nghe đối thoại 2 lượt và chọn câu trả lời đúng.',
            sort_order: 3,
            questions: [
              {
                question_number: 21,
                prompt: 'Hỏi: Họ hẹn nhau gặp lúc mấy giờ? (他们约在几点见面？)',
                audio_text: '男：下午三点一刻我们在会议室碰头，可以吗？女：没问题，我准时到。问：他们约在几点碰头？',
                pinyin: 'sān diǎn yí kè',
                options: ['A. 3:15 (三点一刻)', 'B. 3:30', 'C. 3:45'],
                correct_answer: 'A. 3:15 (三点一刻)',
                explanation: '"三点一刻" là 3 giờ 15 phút.'
              },
              {
                question_number: 22,
                prompt: 'Hỏi: Người nam muốn mượn đồ vật gì? (男的想借什么？)',
                audio_text: '男：小李，你的充电宝能借我用一下吗？我的手机快没电了。女：给你，数据线在抽屉里。问：男的想借什么？',
                pinyin: 'chōngdiànbǎo néng jiè wǒ yòng yíxià ma?',
                options: ['A. 充电宝 (Sạc dự phòng)', 'B. 笔记本电脑', 'C. 耳机'],
                correct_answer: 'A. 充电宝 (Sạc dự phòng)',
                explanation: '"充电宝" là cục pin sạc dự phòng.'
              },
              {
                question_number: 23,
                prompt: 'Hỏi: Món quà mừng tân gia là gì? (他们送了什么乔迁礼物？)',
                audio_text: '女：小张搬新家，我们送盆发财树怎么样？男：好寓意，绿植放在客厅也净化空气。问：他们打算送什么？',
                pinyin: 'yì pén fācáishù',
                options: ['A. 一盆绿植发财树 (Chậu cây phát tài)', 'B. 一套餐具', 'C. 一台微波炉'],
                correct_answer: 'A. 一盆绿植发财树 (Chậu cây phát tài)',
                explanation: '"发财树" cây cảnh phát tài chúc mừng nhà mới.'
              },
              {
                question_number: 24,
                prompt: 'Hỏi: Người nữ cảm thấy bộ váy mới thế nào? (女的觉得新裙子怎么样？)',
                audio_text: '男：你试穿的这条真不错，款式很大方。女：就是裙摆稍微有点儿长，穿高跟鞋应该刚好。问：女的觉得裙子怎么样？',
                pinyin: 'qúnbǎi shāowēi yǒudiǎnr cháng',
                options: ['A. 有点儿长 (Hơi dài một chút)', 'B. 太短了', 'C. 颜色太深'],
                correct_answer: 'A. 有点儿长 (Hơi dài một chút)',
                explanation: '"裙摆稍微有点儿长" vạt váy hơi dài một chút.'
              },
              {
                question_number: 25,
                prompt: 'Hỏi: Người nam sắp đi công tác ở đâu? (男的要去哪儿出差？)',
                audio_text: '女：下周去成都出差的机票订好了吗？男：订好了，周一上午九点的直飞航班。问：男的要去哪儿出差？',
                pinyin: 'qù Chéngdū chūchāi',
                options: ['A. 成都 (Thành Đô)', 'B. 重庆 (Trùng Khánh)', 'C. 西安 (Tây An)'],
                correct_answer: 'A. 成都 (Thành Đô)',
                explanation: '"去成都出差" (Đi công tác ở Thành Đô).'
              },
              {
                question_number: 26,
                prompt: 'Hỏi: Thời tiết cuối tuần dự báo ra sao? (周末天气怎么样？)',
                audio_text: '男：周六去野餐吧，天气预报怎么说？女：周六多云转晴，气温二十二度，非常舒服。问：周六天气怎么样？',
                pinyin: 'duōyún zhuǎn qíng',
                options: ['A. 多云转晴，气温适宜 (Nhiều mây chuyển nắng, nhiệt độ dễ chịu)', 'B. 暴雨倾盆', 'C. 刮狂风'],
                correct_answer: 'A. 多云转晴，气温适宜 (Nhiều mây chuyển nắng, nhiệt độ dễ chịu)',
                explanation: '"多云转晴，气温二十二度".'
              },
              {
                question_number: 27,
                prompt: 'Hỏi: Người nam cảm thấy đề thi thế nào? (男的觉得考试难吗？)',
                audio_text: '女：这次数学期末考试题量好大啊！男：不仅题量大，最后两道综合大题难度也极高。问：男的觉得考试怎么样？',
                pinyin: 'nándù yě jí gāo',
                options: ['A. 题量大且很有难度 (Số lượng câu nhiều và rất khó)', 'B. 非常简单 (Rất đơn giản)', 'C. 很容易拿到满分'],
                correct_answer: 'A. 题量大且很有难度 (Số lượng câu nhiều và rất khó)',
                explanation: 'Đề bài nhiều câu và độ khó rất cao.'
              },
              {
                question_number: 28,
                prompt: 'Hỏi: Người phụ nữ muốn làm gì sau bữa tối? (女的晚饭后想做什么？)',
                audio_text: '男：吃完饭去看场电影？女：吃得太饱了，在公园湖边散散步吹吹晚风吧。问：女的晚饭后想做什么？',
                pinyin: 'sàn sàn bù chuī chuī wǎnfēng',
                options: ['A. 在公园散步 (Đi dạo trong công viên)', 'B. 去电影院看电影', 'C. 回家打游戏'],
                correct_answer: 'A. 在公园散步 (Đi dạo trong công viên)',
                explanation: '"在公园湖边散散步吹吹晚风".'
              },
              {
                question_number: 29,
                prompt: 'Hỏi: Ai bị viêm họng? (谁咽喉发炎了？)',
                audio_text: '女：王老师，您讲课声音有点儿沙哑啊。男：这两天喉咙发炎了，吃着消炎润喉糖呢。问：男的怎么了？',
                pinyin: 'hóulóng fāyán le',
                options: ['A. 咽喉发炎声音沙哑 (Cổ họng viêm khản tiếng)', 'B. Đau dạ dày', 'C. Bị trật khớp chân'],
                correct_answer: 'A. 咽喉发炎声音沙哑 (Cổ họng viêm khản tiếng)',
                explanation: '"喉咙发炎了，声音沙哑".'
              },
              {
                question_number: 30,
                prompt: 'Hỏi: Món ăn người nữ gọi là gì? (女的点的是什么菜？)',
                audio_text: '男：服务员，我们这桌的麻婆豆腐怎么还没上？女：不好意思先生，马上为您催一下后厨。问：女的点的是什么菜？',
                pinyin: 'mápó dòufu',
                options: ['A. 麻婆豆腐 (Đậu phụ sốt cay Tứ Xuyên)', 'B. 水煮牛肉', 'C. 回锅肉'],
                correct_answer: 'A. 麻婆豆腐 (Đậu phụ sốt cay Tứ Xuyên)',
                explanation: '"麻婆豆腐" là món đậu phụ sốt cay Tứ Xuyên.'
              }
            ]
          },
          {
            id: 'hsk3-02-l-p4',
            part_number: 4,
            title: 'Phần 4 (Câu 31 - 40)',
            instructions: 'Nghe đoạn văn hoặc hội thoại dài và chọn câu trả lời đúng.',
            sort_order: 4,
            questions: [
              {
                question_number: 31,
                prompt: 'Hỏi: Nhân viên ngân hàng nhắc nhở điều gì? (银行工作人员提醒什么？)',
                audio_text: '女：先生您好，您的银行卡已办理完成，请妥善保管好您的密码，不要向任何人透露。男：好的，非常感谢。问：工作人员提醒男的保管好什么？',
                pinyin: 'bǎoguǎn hǎo nín de mìmǎ',
                options: ['A. 密码 (Mật khẩu)', 'B. 身份证 (Căn cước)', 'C. 手机号 (Số điện thoại)'],
                correct_answer: 'A. 密码 (Mật khẩu)',
                explanation: '"妥善保管好您的密码" (Bảo quản tốt mật khẩu của mình).'
              },
              {
                question_number: 32,
                prompt: 'Hỏi: Người nam dự định mua loại xe nào? (男的打算买什么类型的车？)',
                audio_text: '男：我想换一辆纯电动新能源汽车，节能环保还能省不少油钱。女：现在充电桩挺普及的，确实是个好选择。问：男的打算买什么车？',
                pinyin: 'chún diàndòng xīnnéngyuán qìchē',
                options: ['A. 纯电动新能源汽车 (Xe năng lượng mới thuần điện)', 'B. Xe tải lớn', 'C. Xe phân khối lớn'],
                correct_answer: 'A. 纯电动新能源汽车 (Xe năng lượng mới thuần điện)',
                explanation: '"纯电动新能源汽车" là xe ô tô điện tiết kiệm và bảo vệ môi trường.'
              },
              {
                question_number: 33,
                prompt: 'Hỏi: Buổi hòa nhạc diễn ra vào ngày nào? (音乐会哪天举行？)',
                audio_text: '女：周末大剧院有一场莫扎特交响音乐会，就在周六晚上七点半。男：太棒了，我们买两张前排票吧。问：音乐会几点举行？',
                pinyin: 'zhōuliù wǎnshang qī diǎn bàn',
                options: ['A. 周六晚上 7:30', 'B. 周日晚上 8:00', 'C. 周五晚上 7:00'],
                correct_answer: 'A. 周六晚上 7:30',
                explanation: '"周六晚上七点半" (7:30 tối thứ Bảy).'
              },
              {
                question_number: 34,
                prompt: 'Hỏi: Khách sạn có dịch vụ gì miễn phí? (宾馆提供什么免费服务？)',
                audio_text: '男：请问酒店提供免费接机服务吗？女：有的先生，只要您提前二十四小时告知航班号，我们的专车就会准时在机场接您。问：酒店提供什么服务？',
                pinyin: 'miǎnfèi jiējī fúwù',
                options: ['A. 免费接机服务 (Dịch vụ đón sân bay miễn phí)', 'B. Miễn phí giặt ủi toàn bộ', 'C. Miễn phí bữa tối'],
                correct_answer: 'A. 免费接机服务 (Dịch vụ đón sân bay miễn phí)',
                explanation: '"免费接机服务" đón tại sân bay miễn phí.'
              },
              {
                question_number: 35,
                prompt: 'Hỏi: Người nữ muốn đổi sang cỡ áo nào? (女的想换什么尺码？)',
                audio_text: '女：这件毛衣的S码有点儿短，能给我拿一件M码试试吗？男：没问题，您稍候，我去库房给您拿。问：女的想要什么尺码？',
                pinyin: 'ná yí jiàn M mǎ',
                options: ['A. M 码', 'B. S 码', 'C. L 码'],
                correct_answer: 'A. M 码',
                explanation: 'Đổi từ cỡ S sang cỡ M ("M码").'
              },
              {
                question_number: 36,
                prompt: 'Hỏi: Tác giả ấn tượng nhất với điều gì ở Tây Hồ? (西湖什么最迷人？)',
                audio_text: '走在西湖苏堤上，两旁杨柳依依，微风拂过湖面泛起阵阵涟漪，真是一幅秀丽的江南水墨画。问：这段话描写的是哪里的美景？',
                pinyin: 'zǒu zài Xīhú Sūdī shang',
                options: ['A. 西湖 (Tây Hồ)', 'B. 颐和园 (Di Hòa Viên)', 'C. 故宫 (Cố Cung)'],
                correct_answer: 'A. 西湖 (Tây Hồ)',
                explanation: '"走在西湖苏堤上" (Đi dạo trên đê Tô Đê Tây Hồ).'
              },
              {
                question_number: 37,
                prompt: 'Hỏi: Người nam khuyên người nữ điều gì khi chuẩn bị phỏng vấn? (男的给出什么面试建议？)',
                audio_text: '女：明天面试我特别紧张怎么办？男：多做深呼吸，把自己的优势自信地表达出来，自信是最好的名片。问：男的建议女的怎样面对面试？',
                pinyin: 'zìxìn de biǎodá chūlái',
                options: ['A. 保持自信放松心情 (Giữ vững tự tin và thư giãn)', 'B. 背下所有答案', 'C. Đi sớm 2 tiếng'],
                correct_answer: 'A. 保持自信放松心情 (Giữ vững tự tin và thư giãn)',
                explanation: '"自信是最好的名片" khuyên tự tin và thư thái.'
              },
              {
                question_number: 38,
                prompt: 'Hỏi: Người nữ quyết định học môn năng khiếu gì? (女的打算学什么才艺？)',
                audio_text: '男：暑假你打算报个兴趣班吗？女：我报名了中国传统书法班，练习毛笔字既能修身养性又能练得一手好字。问：女的暑假学什么？',
                pinyin: 'Zhōngguó chuántǒng shūfǎ bān',
                options: ['A. 书法 (Thư pháp viết bút lông)', 'B. 国画 (Tranh thủy mặc)', 'C. 围棋 (Cờ vây)'],
                correct_answer: 'A. 书法 (Thư pháp viết bút lông)',
                explanation: '"中国传统书法班" lớp học thư pháp cổ truyền.'
              },
              {
                question_number: 39,
                prompt: 'Hỏi: Chuyến tàu cao tốc sẽ đến Thượng Hải trong bao lâu? (高铁多长时间到达上海？)',
                audio_text: '男：北京到上海的高铁全程需要多久？女：最快的高铁标杆车只需要四小时十八分钟。问：最快的高铁需要多长时间？',
                pinyin: 'sì xiǎoshí shíbā fēnzhōng',
                options: ['A. 4小时18分钟', 'B. 5小时整', 'C. 6小时半'],
                correct_answer: 'A. 4小时18分钟',
                explanation: '"四小时十八分钟" là 4 tiếng 18 phút.'
              },
              {
                question_number: 40,
                prompt: 'Hỏi: Họ hẹn nhau làm gì vào chủ nhật tuần tới? (他们下周日要做什么？)',
                audio_text: '女：下周日一起去郊外果园摘草莓吧？男：太好了，听说那里的草莓又大又红，纯天然无污染。问：他们打算下周日去做什么？',
                pinyin: 'qù jiāowài guǒyuán zhāi cǎoméi',
                options: ['A. 摘草莓 (Hái dâu tây ở nông trại ngoại thành)', 'B. Đi câu cá', 'C. Đi trượt tuyết'],
                correct_answer: 'A. 摘草莓 (Hái dâu tây ở nông trại ngoại thành)',
                explanation: '"去郊外果园摘草莓" hái dâu tây ở vườn quả ngoại ô.'
              }
            ]
          }
        ]
      },
      {
        id: 'hsk3-02-read',
        skill_type: 'reading',
        name: 'Đọc hiểu',
        chinese_name: '阅读',
        sort_order: 2,
        parts: [
          {
            id: 'hsk3-02-r-p1',
            part_number: 1,
            title: 'Phần 1 (Câu 41 - 50)',
            instructions: 'Ghép cặp câu hỏi và câu đối đáp tương thích logic.',
            sort_order: 1,
            questions: [
              {
                question_number: 41,
                prompt: 'Ghép câu cho: "请问办理入住手续在哪个柜台？"',
                reading_text: '请问办理入住手续在哪个柜台？Qǐngwèn bànlǐ rùzhù shǒuxù zài nǎge guìtái?',
                pinyin: 'bànlǐ rùzhù shǒuxù zài nǎge guìtái?',
                options: ['A. 请往前走，在前台一号窗口办理。(Xin mời đi thẳng, làm thủ tục ở cửa số 1 quầy lễ tân.)', 'B. 已经很晚了。(Đã muộn lắm rồi.)', 'C. 价格很便宜。(Giá rất rẻ.)'],
                correct_answer: 'A. 请往前走，在前台一号窗口办理。(Xin mời đi thẳng, làm thủ tục ở cửa số 1 quầy lễ tân.)',
                explanation: 'Chỉ dẫn làm thủ tục nhận phòng ở quầy lễ tân.'
              },
              {
                question_number: 42,
                prompt: 'Ghép câu cho: "这套西服穿在你身上既合身又显精神！"',
                reading_text: '这套西服穿在你身上既合身又显精神！Zhè tào xīfú chuān zài nǐ shēnshang jì héshēn yòu xiǎn jīngshen!',
                pinyin: 'jì héshēn yòu xiǎn jīngshen!',
                options: ['A. 谢谢你的夸奖，这是我专门为面试定做的。(Cảm ơn lời khen của bạn, đây là bộ tôi may đo riêng để đi phỏng vấn.)', 'B. 外面风很大。(Gió ngoài trời rất to.)', 'C. 水果很甜。(Trái cây rất ngọt.)'],
                correct_answer: 'A. 谢谢你的夸奖，这是我专门为面试定做的。(Cảm ơn lời khen của bạn, đây là bộ tôi may đo riêng để đi phỏng vấn.)',
                explanation: 'Đáp lại lời khen ngợi âu phục vừa vặn lịch sự.'
              },
              {
                question_number: 43,
                prompt: 'Ghép câu cho: "昨晚的乒乓球决赛太精彩了！"',
                reading_text: '昨晚的乒乓球决赛太精彩了！Zuótiān wǎnshang de pīngpāngqiú juésài tài jīngcǎi le!',
                pinyin: 'pīngpāngqiú juésài tài jīngcǎi le!',
                options: ['A. 是啊，双方打满七局，比分咬得特别紧！(Đúng vậy, hai bên thi đấu đủ 7 set, điểm bám đuổi sát nút!)', 'B. 菜做得很香。(Nấu món ăn rất thơm.)', 'C. 衣服洗好了。(Giặt quần áo xong rồi.)'],
                correct_answer: 'A. 是啊，双方打满七局，比分咬得特别紧！(Đúng vậy, hai bên thi đấu đủ 7 set, điểm bám đuổi sát nút!)',
                explanation: 'Cùng thảo luận trận chung kết bóng bàn kịch tính.'
              },
              {
                question_number: 44,
                prompt: 'Ghép câu cho: "你今天怎么选择骑共享单车来上班？"',
                reading_text: '你今天怎么选择骑共享单车来上班？Nǐ jīntiān zěnme xuǎnzé qí gòngxiǎng dānchē lái shàngbān?',
                pinyin: 'qí gòngxiǎng dānchē lái shàngbān?',
                options: ['A. 今天天气晴朗微风和煦，顺便锻炼锻炼身体。(Hôm nay trời nắng gió dịu êm, tiện thể đạp xe rèn luyện thân thể.)', 'B. 昨天吃坏了肚子。(Hôm qua ăn hỏng bụng.)', 'C. 手机找不到了。(Không tìm thấy điện thoại.)'],
                correct_answer: 'A. 今天天气晴朗微风和煦，顺便锻炼锻炼身体。(Hôm nay trời nắng gió dịu êm, tiện thể đạp xe rèn luyện thân thể.)',
                explanation: 'Giải thích lý do đạp xe công cộng rèn luyện sức khỏe.'
              },
              {
                question_number: 45,
                prompt: 'Ghép câu cho: "这台打印机怎么卡纸了？"',
                reading_text: '这台打印机怎么卡纸了？Zhè tái dǎyìnjī zěnme kǎzhǐ le?',
                pinyin: 'dǎyìnjī zěnme kǎzhǐ le?',
                options: ['A. 打开侧盖，轻轻把卡住的纸张顺着方向抽出来。(Mở nắp hông ra, nhẹ nhàng rút tờ giấy kẹt theo chiều ra ngoài.)', 'B. 已经下班了。(Đã tan sở rồi.)', 'C. 票买好了。(Mua vé xong rồi.)'],
                correct_answer: 'A. 打开侧盖，轻轻把卡住的纸张顺着方向抽出来。(Mở nắp hông ra, nhẹ nhàng rút tờ giấy kẹt theo chiều ra ngoài.)',
                explanation: 'Hướng dẫn xử lý kẹt giấy máy in.'
              },
              {
                question_number: 46,
                prompt: 'Ghép câu cho: "这盆兰花开得真清香雅致！"',
                reading_text: '这盆兰花开得真清香雅致！Zhè pén lánhuā kāi de zhēn qīngxiāng yǎzhì!',
                pinyin: 'lánhuā kāi de zhēn qīngxiāng yǎzhì!',
                options: ['A. 养兰花需要细心，不能晒烈日也不能多浇水。(Chăm hoa lan cần tỉ mỉ, không được phơi nắng gắt và tưới quá nhiều nước.)', 'B. 我很饿。(Tôi đói bụng quá.)', 'C. 考试成绩出来了。(Có kết quả thi rồi.)'],
                correct_answer: 'A. 养兰花需要细心，不能晒烈日也不能多浇水。(Chăm hoa lan cần tỉ mỉ, không được phơi nắng gắt và tưới quá nhiều nước.)',
                explanation: 'Kinh nghiệm chăm sóc chậu hoa phong lan.'
              },
              {
                question_number: 47,
                prompt: 'Ghép câu cho: "这次去北京出差感觉怎么样？"',
                reading_text: '这次去北京出差感觉怎么样？Zhè cì qù Běijīng chūchāi gǎnjué zěnmeyàng?',
                pinyin: 'qù Běijīng chūchāi gǎnjué zěnmeyàng?',
                options: ['A. 工作进展非常顺利，顺便吃了一顿正宗的北京烤鸭。(Công việc tiến triển thuận lợi, tiện thể ăn một bữa vịt quay Bắc Kinh chính tông.)', 'B. 钥匙丢了。(Mất chìa khóa.)', 'C. 衣服太小。(Quần áo chật quá.)'],
                correct_answer: 'A. 工作进展非常顺利，顺便吃了一顿正宗的北京烤鸭。(Công việc tiến triển thuận lợi, tiện thể ăn một bữa vịt quay Bắc Kinh chính tông.)',
                explanation: 'Chia sẻ cảm nhận về chuyến công tác Bắc Kinh thuận lợi.'
              },
              {
                question_number: 48,
                prompt: 'Ghép câu cho: "你觉得学好汉语最重要的秘诀是什么？"',
                reading_text: '你觉得学好汉语最重要的秘诀是什么？Nǐ juéde xuéhǎo Hànyǔ zuì zhòngyào de mìjué shì shénme?',
                pinyin: 'xuéhǎo Hànyǔ zuì zhòngyào de mìjué',
                options: ['A. 多听多说多练，营造沉浸式的语言学习环境。(Nghe nhiều nói nhiều luyện nhiều, tạo môi trường học ngập tràn ngôn ngữ.)', 'B. 字典很重。(Từ điển rất nặng.)', 'C. 今天星期三。(Hôm nay thứ tư.)'],
                correct_answer: 'A. 多听多说多练，营造沉浸式的语言学习环境。(Nghe nhiều nói nhiều luyện nhiều, tạo môi trường học ngập tràn ngôn ngữ.)',
                explanation: 'Bí quyết học tiếng Trung: thực hành nghe nói liên tục.'
              },
              {
                question_number: 49,
                prompt: 'Ghép câu cho: "这间会议室的音响效果怎么样？"',
                reading_text: '这间会议室的音响效果怎么样？Zhè jiān huìyìshì de yīnxiǎng xiàoguǒ zěnmeyàng?',
                pinyin: 'yīnxiǎng xiàoguǒ zěnmeyàng?',
                options: ['A. 非常清晰立体，即使坐在后排也能听得一清二楚。(Rất trong trẻo sống động, ngồi hàng ghế cuối vẫn nghe rõ mồn một.)', 'B. 天气转凉了。(Trời trở lạnh rồi.)', 'C. 饭菜很好吃。(Cơm canh ngon.)'],
                correct_answer: 'A. 非常清晰立体，即使坐在后排也能听得一清二楚。(Rất trong trẻo sống động, ngồi hàng ghế cuối vẫn nghe rõ mồn một.)',
                explanation: 'Đánh giá âm thanh phòng họp rõ nét.'
              },
              {
                question_number: 50,
                prompt: 'Ghép câu cho: "下班后我们去尝尝新开的那家川菜馆？"',
                reading_text: '下班后我们去尝尝新开的那家川菜馆？Xiàbān hòu wǒmen qù chángchang xīn kāi de nà jiā Chuāncàiguǎn?',
                pinyin: 'qù chángchang xīn kāi de nà jiā Chuāncàiguǎn?',
                options: ['A. 好啊，听说他们家的水煮鱼和毛血旺特别地道！(Được thôi, nghe nói món cá sốt cay và huyết bò ở đó cực kỳ chuẩn vị!)', 'B. 药按时吃。(Uống thuốc đúng giờ.)', 'C. 会议开完了。(Họp xong rồi.)'],
                correct_answer: 'A. 好啊，听说他们家的水煮鱼和毛血旺特别地道！(Được thôi, nghe nói món cá sốt cay và huyết bò ở đó cực kỳ chuẩn vị!)',
                explanation: 'Đồng ý đi thưởng thức món ăn quán Tứ Xuyên mới mở.'
              }
            ]
          },
          {
            id: 'hsk3-02-r-p2',
            part_number: 2,
            title: 'Phần 2 (Câu 51 - 60)',
            instructions: 'Điền từ vựng thích hợp vào chỗ trống.',
            sort_order: 2,
            questions: [
              {
                question_number: 51,
                prompt: 'Điền từ: 良好的睡眠对保持旺盛的_____至关重要。',
                reading_text: '良好的睡眠对保持旺盛的_____至关重要。Liánghǎo de shuìmián duì bǎochí wàngshèng de _____ zhìguān zhòngyào.',
                pinyin: 'wàngshèng de _____',
                options: ['A. 精力 (tinh lực / sức lực)', 'B. 压力 (áp lực)', 'C. 态度 (thái độ)'],
                correct_answer: 'A. 精力 (tinh lực / sức lực)',
                explanation: '"旺盛的精力" tinh lực dồi dào nhờ giấc ngủ ngon.'
              },
              {
                question_number: 52,
                prompt: 'Điền từ: 只有坚持不懈，才能最终实现自己的_____。',
                reading_text: '只有坚持不懈，才能最终实现自己的_____。Zhǐyǒu jiānchí-búxiè, cái néng zuìzhōng shíxiàn zìjǐ de _____.',
                pinyin: 'shíxiàn zìjǐ de _____',
                options: ['A. 梦想 (ước mơ)', 'B. 困难 (khó khăn)', 'C. 借口 (cớ cớ)'],
                correct_answer: 'A. 梦想 (ước mơ)',
                explanation: '"实现自己的梦想" hiện thực hóa giấc mơ của bản thân.'
              },
              {
                question_number: 53,
                prompt: 'Điền từ: 参观博物馆时，请大家保持_____，切勿大声喧哗。',
                reading_text: '参观博物馆时，请大家保持_____，切勿大声喧哗。Cānguān bówùguǎn shí, qǐng dàjiā bǎochí _____, qièwù dàshēng xuānhuá.',
                pinyin: 'bǎochí _____, qièwù dàshēng xuānhuá',
                options: ['A. 安静 (yên lặng / yên tĩnh)', 'B. 热情 (nhiệt tình)', 'C. 紧张 (căng thẳng)'],
                correct_answer: 'A. 安静 (yên lặng / yên tĩnh)',
                explanation: '"保持安静" giữ trật tự im lặng trong bảo tàng.'
              },
              {
                question_number: 54,
                prompt: 'Điền từ: 经过反复推敲，专家组终于做出了最终的_____。',
                reading_text: '经过反复推敲，专家组终于做出了最终的_____。Jīngguò fǎnfù tuīqiāo, zhuānjiāzǔ zhōngyú zuòchū le zuìzhōng de _____.',
                pinyin: 'zuìzhōng de _____',
                options: ['A. 决定 (quyết định)', 'B. 建议 (gợi ý)', 'C. 改变 (thay đổi)'],
                correct_answer: 'A. 决定 (quyết định)',
                explanation: '"最终的决定" quyết định cuối cùng sau khi cân nhắc.'
              },
              {
                question_number: 55,
                prompt: 'Điền từ: 这篇新闻报道内容客观，事实_____。',
                reading_text: '这篇新闻报道内容客观，事实_____。Zhè piān xīnwén bàodào nèiróng kèguān, shìshí _____.',
                pinyin: 'shìshí _____',
                options: ['A. 清楚 (rõ ràng)', 'B. 复杂 (phức tạp)', 'C. 模糊 (mờ nhạt)'],
                correct_answer: 'A. 清楚 (rõ ràng)',
                explanation: '"事实清楚" sự thật rõ ràng minh bạch.'
              },
              {
                question_number: 56,
                prompt: 'Điền từ: 出门在外，一定要注意人身和财产_____。',
                reading_text: '出门在外，一定要注意人身和财产_____。Chūmén zài wài, yídìng yào zhùyì rénshēn hé cáichǎn _____.',
                pinyin: 'rénshēn hé cáichǎn _____',
                options: ['A. 安全 (an toàn)', 'B. 丰富 (phong phú)', 'C. 干净 (sạch sẽ)'],
                correct_answer: 'A. 安全 (an toàn)',
                explanation: '"人身和财产安全" an toàn tính mạng và tài sản.'
              },
              {
                question_number: 57,
                prompt: 'Điền từ: 随着气温回升，春天的气息越来越_____了。',
                reading_text: '随着气温回升，春天的气息越来越_____了。Suízhe qìwēn huíshēng, chūntiān de qìxī yuèláiyuè _____ le.',
                pinyin: 'yuèláiyuè _____ le.',
                options: ['A. 浓厚 (nồng đậm / rõ rệt)', 'B. 简单 (đơn giản)', 'C. 寒冷 (lạnh giá)'],
                correct_answer: 'A. 浓厚 (nồng đậm / rõ rệt)',
                explanation: '"春天的气息越来越浓厚" hơi thở mùa xuân ngày càng đậm đà.'
              },
              {
                question_number: 58,
                prompt: 'Điền từ: 我们应当珍惜自然资源，杜绝一切盲目_____。',
                reading_text: '我们应当珍惜自然资源，杜绝一切盲目_____。Wǒmen yīngdāng zhēnxī zìrán zīyuán, dùjué yíqiè mángmù _____.',
                pinyin: 'mángmù _____',
                options: ['A. 浪费 (lãng phí)', 'B. 节约 (tiết kiệm)', 'C. 保护 (bảo vệ)'],
                correct_answer: 'A. 浪费 (lãng phí)',
                explanation: '"盲目浪费" lãng phí mù quáng tài nguyên.'
              },
              {
                question_number: 59,
                prompt: 'Điền từ: 他的演讲慷慨激昂，赢得了在场观众热烈的_____。',
                reading_text: '他的演讲慷慨激昂，赢得了在场观众热烈的_____。Tā de yǎnjiǎng kāngkǎi-jī\'áng, yíngdé le zàichǎng guānzhòng rèliè de _____.',
                pinyin: 'rèliè de _____',
                options: ['A. 掌声 (tràng vỗ tay)', 'B. 批评 (phê bình)', 'C. 意见 (ý kiến)'],
                correct_answer: 'A. 掌声 (tràng vỗ tay)',
                explanation: '"热烈的掌声" tràng pháo tay nhiệt liệt.'
              },
              {
                question_number: 60,
                prompt: 'Điền từ: 邻里之间应当相互关照、和睦_____。',
                reading_text: '邻里之间应当相互关照、和睦_____。Línlǐ zhījiān yīngdāng xiānghù guānzhào, hémù _____.',
                pinyin: 'hémù _____',
                options: ['A. 相处 (chung sống / đối xử với nhau)', 'B. 讨论 (thảo luận)', 'C. 离开 (rời khỏi)'],
                correct_answer: 'A. 相处 (chung sống / đối xử với nhau)',
                explanation: '"和睦相处" chung sống hòa thuận thuận thảo.'
              }
            ]
          },
          {
            id: 'hsk3-02-r-p3',
            part_number: 3,
            title: 'Phần 3 (Câu 61 - 70)',
            instructions: 'Đọc đoạn văn ngắn và chọn đáp án trắc nghiệm chuẩn xác A, B, C.',
            sort_order: 3,
            questions: [
              {
                question_number: 61,
                prompt: 'Đọc đoạn văn và trả lời: Tác giả muốn truyền tải thông điệp gì?',
                reading_text: '微笑是世界上最通用的语言。一个真诚的微笑，不仅能化解人与人之间的冷漠与隔阂，还能带给他人温暖和力量。★ 微笑的主要作用是：',
                pinyin: 'huàjiě lěngmò, dài lái wēnnuǎn',
                options: ['A. 拉近人与人之间的距离 (Kéo gần khoảng cách giữa người với người)', 'B. 掩盖内心的悲伤', 'C. 替代语言沟通'],
                correct_answer: 'A. 拉近人与人之间的距离 (Kéo gần khoảng cách giữa người với người)',
                explanation: 'Nụ cười giúp xua tan lạnh nhạt, gắn kết con người.'
              },
              {
                question_number: 62,
                prompt: 'Đọc đoạn văn và trả lời: Theo bài viết, lợi ích của việc trồng cây xanh là gì?',
                reading_text: '城市绿化不仅美化了市民的居住环境，更能有效吸收空气中的二氧化碳和粉尘，调节城市微气候，被誉为城市的绿色肺叶。★ 种植树木的主要益处在于：',
                pinyin: 'xīshōu fěnchén, tiáojié qìhòu',
                options: ['A. 净化空气与改善生态 (Làm sạch không khí và cải thiện sinh thái)', 'B. 提供大量木材', 'C. 降低建筑成本'],
                correct_answer: 'A. 净化空气与改善生态 (Làm sạch không khí và cải thiện sinh thái)',
                explanation: 'Lọc bụi bẩn, điều hòa khí hậu được ví như lá phổi xanh.'
              },
              {
                question_number: 63,
                prompt: 'Đọc đoạn văn và trả lời: Ý nghĩa của câu "Một cây làm chẳng nên non" trong tiếng Hán là gì?',
                reading_text: '单丝不成线，独木不成林。个人的智慧与力量固然重要，但在面对复杂艰巨的任务时，团队协作才能汇聚成无坚不摧的强大合力。★ 这段文字强调：',
                pinyin: 'tuánduì xiézuò',
                options: ['A. 团队协作的重要性 (Tầm quan trọng của tinh thần làm việc nhóm)', 'B. 个人英雄主义', 'C. 独立思考的能力'],
                correct_answer: 'A. 团队协作的重要性 (Tầm quan trọng của tinh thần làm việc nhóm)',
                explanation: 'Nhấn mạnh sức mạnh tập thể và làm việc nhóm (团队协作).'
              },
              {
                question_number: 64,
                prompt: 'Đọc đoạn văn và trả lời: Lời khuyên để bảo vệ thị lực là gì?',
                reading_text: '现代人长时间面对电脑和手机屏幕，极易导致眼部干涩疲劳。眼科医生建议，遵循"20-20-20"法则：每看屏幕20分钟，抬头远眺20英尺外的远方20秒。★ 保护眼睛的有效方法是：',
                pinyin: 'táitóu yuǎntiào 20 yīngchǐ wài',
                options: ['A. 定时让眼睛远眺放松 (Định kỳ đưa mắt nhìn xa thư giãn)', 'B. 连续看屏幕两小时', 'C. 滴大量眼药水'],
                correct_answer: 'A. 定时让眼睛远眺放松 (Định kỳ đưa mắt nhìn xa thư giãn)',
                explanation: 'Quy tắc nhìn ra xa giúp mắt nghỉ ngơi thư giãn.'
              },
              {
                question_number: 65,
                prompt: 'Đọc đoạn văn và trả lời: Chữ "Tín" trong văn hóa truyền thống thể hiện điều gì?',
                reading_text: '言必信，行必果。诚信是立人之本，无论在商业往来还是日常交往中，恪守承诺都是赢得他人尊重与信任的基石。★ 一个人立身处世的核心是：',
                pinyin: 'chéngxìn shì lìrén zhī běn',
                options: ['A. 讲究信用恪守承诺 (Trọng chữ tín và giữ đúng lời hứa)', 'B. 头脑聪明灵活', 'C. 积累丰厚财富'],
                correct_answer: 'A. 讲究信用恪守承诺 (Trọng chữ tín và giữ đúng lời hứa)',
                explanation: '"诚信是立人之本" (Thành tín là gốc rễ lập thân).'
              },
              {
                question_number: 66,
                prompt: 'Đọc đoạn văn và trả lời: Trẻ em phát triển tốt nhất trong môi trường nào?',
                reading_text: '家庭是孩子的第一所学校。充满爱意、包容与鼓励的家庭氛围，不仅能带给孩子充沛的安全感，更能培养他们独立自信健全的人格。★ 良好的家庭教育最关键的是：',
                pinyin: 'chōngmǎn àiyì, bāoróng yǔ gǔlì',
                options: ['A. 充满爱与鼓励的家庭氛围 (Bầu không khí gia đình đầy yêu thương và khích lệ)', 'B. 严厉的惩罚机制', 'C. 报满各种辅导班'],
                correct_answer: 'A. 充满爱与鼓励的家庭氛围 (Bầu không khí gia đình đầy yêu thương và khích lệ)',
                explanation: 'Bầu không khí đầy tình yêu thương và khích lệ giúp trẻ tự tin.'
              },
              {
                question_number: 67,
                prompt: 'Đọc đoạn văn và trả lời: Cách tốt nhất để giảm bớt lo âu là gì?',
                reading_text: '焦虑往往来源于对未知未来的过度担忧。专注于做好当下的每一件小事，脚踏实地，心中的迷茫与焦虑自然会逐渐消散。★ 克服焦虑的关键在于：',
                pinyin: 'zhuānzhù yú zuòhǎo dāngxià',
                options: ['A. 专注做好眼前当下的事 (Tập trung làm tốt việc trước mắt hiện tại)', 'B. 逃避现实问题', 'C. 思考五年后的困难'],
                correct_answer: 'A. 专注做好眼前当下的事 (Tập trung làm tốt việc trước mắt hiện tại)',
                explanation: '"专注于做好当下的每一件小事" (Tập trung làm tốt việc hiện tại).'
              },
              {
                question_number: 68,
                prompt: 'Đọc đoạn văn và trả lời: Thói quen đọc sách mỗi ngày mang lại điều gì?',
                reading_text: '书籍是人类进步的阶梯。哪怕每天只利用睡前半小时阅读几页经典著作，长期积累下来，思想的深度与语言表达能力都会显著提升。★ 长期阅读能：',
                pinyin: 'sīxiǎng de shēndù yǔ biǎodá néng lì xiǎnzhù tíshēng',
                options: ['A. 提升思想深度与表达能力 (Nâng cao độ sâu tư duy và năng lực biểu đạt)', 'B. 快速赚大钱', 'C. 让人不需要思考'],
                correct_answer: 'A. 提升思想深度与表达能力 (Nâng cao độ sâu tư duy và năng lực biểu đạt)',
                explanation: 'Nâng cao chiều sâu tư tưởng và khả năng diễn đạt ngôn ngữ.'
              },
              {
                question_number: 69,
                prompt: 'Đọc đoạn văn và trả lời: Giá trị của việc đúng giờ trong công việc là gì?',
                reading_text: '守时不仅是一种良好的教养，更是职场上专业素养的体现。遵守约定时间，是对他人时间的尊重，也是建立职业信誉的第一步。★ 守时的主要意义是：',
                pinyin: 'duì tārén shíjiān de zūnzhòng, jiànlì xìnyù',
                options: ['A. 尊重他人并建立职业信誉 (Tôn trọng người khác và tạo dựng uy tín nghề nghiệp)', 'B. 能提前下班回家', 'C. 避免受到罚款'],
                correct_answer: 'A. 尊重他人并建立职业信誉 (Tôn trọng người khác và tạo dựng uy tín nghề nghiệp)',
                explanation: 'Đúng giờ thể hiện sự tôn trọng và gây dựng uy tín công việc.'
              },
              {
                question_number: 70,
                prompt: 'Đọc đoạn văn và trả lời: Thái độ đón nhận lời phê bình đúng đắn là gì?',
                reading_text: '良药苦口利于病，忠言逆耳利于行。坦然倾听他人中肯的批评与建议，敢于正视自身的不足，是一个人不断迈向成熟的必经之路。★ 面对中肯的批评，我们应当：',
                pinyin: 'tǎnrán qīngtīng, zhèngshì zìshēn bùzú',
                options: ['A. 虚心接受并改正不足 (Khiêm tốn tiếp thu và sửa chữa thiếu sót)', 'B. 感到愤怒并反驳', 'C. 假装听不见'],
                correct_answer: 'A. 虚心接受并改正不足 (Khiêm tốn tiếp thu và sửa chữa thiếu sót)',
                explanation: 'Thuốc đắng dã tật, lời thật mất lòng, nên khiêm tốn lắng nghe để sửa mình.'
              }
            ]
          }
        ]
      },
      {
        id: 'hsk3-02-write',
        skill_type: 'writing',
        name: 'Viết & Sắp xếp',
        chinese_name: '书写',
        sort_order: 3,
        parts: [
          {
            id: 'hsk3-02-w-p1',
            part_number: 1,
            title: 'Phần 1 (Câu 71 - 75)',
            instructions: 'Sắp xếp các từ thành câu hoàn chỉnh đúng ngữ pháp.',
            sort_order: 1,
            questions: [
              {
                question_number: 71,
                prompt: 'Sắp xếp thành câu: 这本书 / 很有意思 / 借来的 / 图书馆 / 从',
                reading_text: '这本书 / 很有意思 / 借来的 / 图书馆 / 从',
                pinyin: 'zhè běn shū / hěn yǒu yìsi / jiè lái de / túshūguǎn / cóng',
                options: [
                  'A. 从图书馆借来的这本书很有意思。(Cóng túshūguǎn jiè lái de zhè běn shū hěn yǒu yìsi.)',
                  'B. 这本书从图书馆很有意思借来的。(Zhè běn shū cóng túshūguǎn hěn yǒu yìsi jiè lái de.)',
                  'C. 很有意思这本书从图书馆借来的。(Hěn yǒu yìsi zhè běn shū cóng túshūguǎn jiè lái de.)'
                ],
                correct_answer: 'A. 从图书馆借来的这本书很有意思。(Cóng túshūguǎn jiè lái de zhè běn shū hěn yǒu yìsi.)',
                explanation: 'Cụm định ngữ có trợ từ 的 bổ nghĩa cho danh từ: (从图书馆借来的) + 这本书 + 很有意思.'
              },
              {
                question_number: 72,
                prompt: 'Sắp xếp thành câu: 倒进 / 把 / 热水 / 请 / 杯子里',
                reading_text: '倒进 / 把 / 热水 / 请 / 杯子里',
                pinyin: 'dào jìn / bǎ / rèshuǐ / qǐng / bēizi lǐ',
                options: [
                  'A. 请把热水倒进杯子里。(Qǐng bǎ rèshuǐ dào jìn bēizi lǐ.)',
                  'B. 把热水请杯子里倒进。(Bǎ rèshuǐ qǐng bēizi lǐ dào jìn.)',
                  'C. 杯子里把热水请倒进。(Bēizi lǐ bǎ rèshuǐ qǐng dào jìn.)'
                ],
                correct_answer: 'A. 请把热水倒进杯子里。(Qǐng bǎ rèshuǐ dào jìn bēizi lǐ.)',
                explanation: 'Câu chữ 把: 请 + 把 + Tân ngữ (热水) + Động từ (倒进) + Địa điểm đích (杯子里).'
              },
              {
                question_number: 73,
                prompt: 'Sắp xếp thành câu: 吹灭了 / 被 / 蜡烛 / 大风',
                reading_text: '吹灭了 / 被 / 蜡烛 / 大风',
                pinyin: 'chuī miè le / bèi / làzhú / dàfēng',
                options: [
                  'A. 蜡烛被大风吹灭了。(Làzhú bèi dàfēng chuī miè le.)',
                  'B. 大风被蜡烛吹灭了。(Dàfēng bèi làzhú chuī miè le.)',
                  'C. 吹灭了被蜡烛大风。(Chuī miè le bèi làzhú dàfēng.)'
                ],
                correct_answer: 'A. 蜡烛被大风吹灭了。(Làzhú bèi dàfēng chuī miè le.)',
                explanation: 'Câu bị động chữ 被: Ngọn nến bị gió to thổi tắt: 蜡烛 + 被 + 大风 + 吹灭了.'
              },
              {
                question_number: 74,
                prompt: 'Sắp xếp thành câu: 比 / 妹妹 / 汉语 / 我 / 学得 / 好',
                reading_text: '比 / 妹妹 / 汉语 / 我 / 学得 / 好',
                pinyin: 'bǐ / mèimei / Hànyǔ / wǒ / xué de / hǎo',
                options: [
                  'A. 妹妹汉语学得比我好。(Mèimei Hànyǔ xué de bǐ wǒ hǎo.)',
                  'B. 我妹妹汉语比学得好。(Wǒ mèimei Hànyǔ bǐ xué de hǎo.)',
                  'C. 汉语妹妹比我学得好。(Hànyǔ mèimei bǐ wǒ xué de hǎo.)'
                ],
                correct_answer: 'A. 妹妹汉语学得比我好。(Mèimei Hànyǔ xué de bǐ wǒ hǎo.)',
                explanation: 'So sánh kết hợp bổ ngữ trình độ: Chủ ngữ (妹妹) + Tân ngữ (汉语) + Động từ + 得 + 比 + B + Tính từ (好).'
              },
              {
                question_number: 75,
                prompt: 'Sắp xếp thành câu: 已经 / 完成 / 任务 / 顺利 / 了',
                reading_text: '已经 / 完成 / 任务 / 顺利 / 了',
                pinyin: 'yǐjīng / wánchéng / rènwu / shùnlì / le',
                options: [
                  'A. 任务已经顺利完成了。(Rènwu yǐjīng shùnlì wánchéng le.)',
                  'B. 顺利完成了已经任务。(Shùnlì wánchéng le yǐjīng rènwu.)',
                  'C. 已经顺利任务完成了。(Yǐjīng shùnlì rènwu wánchéng le.)'
                ],
                correct_answer: 'A. 任务已经顺利完成了。(Rènwu yǐjīng shùnlì wánchéng le.)',
                explanation: 'Chủ ngữ (任务) + Trạng từ thời gian (已经) + Trạng từ phương thức (顺利) + Động từ (完成) + Trợ từ (了).'
              }
            ]
          },
          {
            id: 'hsk3-02-w-p2',
            part_number: 2,
            title: 'Phần 2 (Câu 76 - 80)',
            instructions: 'Điền chữ Hán tương ứng theo Pinyin vào chỗ trống.',
            sort_order: 2,
            questions: [
              {
                question_number: 76,
                prompt: 'Điền chữ Hán: 他工作非常认_____(zhēn)，深受领导器重。',
                reading_text: '他工作非常认_____(zhēn)，深受领导器重。Tā gōngzuò fēicháng rèn_____(zhēn), shēnshòu lǐngdǎo qìzhòng.',
                pinyin: 'rènzhēn',
                options: ['A. 真 (thật / chăm chỉ - 认真)', 'B. 针 (cây kim)', 'C. 阵 (trận gió)'],
                correct_answer: 'A. 真 (thật / chăm chỉ - 认真)',
                explanation: '"认真" (rènzhēn) nghĩa là nghiêm túc chăm chỉ, chữ cần điền là 真.'
              },
              {
                question_number: 77,
                prompt: 'Điền chữ Hán: 这家饭馆的菜味_____(dào)棒极了！',
                reading_text: '这家饭馆的菜味_____(dào)棒极了！Zhè jiā fànguǎn de cài wèi_____(dào) bàng jí le!',
                pinyin: 'wèidào',
                options: ['A. 道 (mùi vị - 味道)', 'B. 到 (đến)', 'C. 倒 (ngã)'],
                correct_answer: 'A. 道 (mùi vị - 味道)',
                explanation: '"味道" (wèidào) nghĩa là mùi vị thức ăn, chữ cần điền là 道.'
              },
              {
                question_number: 78,
                prompt: 'Điền chữ Hán: 我们要珍_____(xī)时间，努力学习。',
                reading_text: '我们要珍_____(xī)时间，努力学习。Wǒmen yào zhēn_____(xī) shíjiān, nǔlì xuéxí.',
                pinyin: 'zhēnxī',
                options: ['A. 惜 (trân quý - 珍惜)', 'B. 西 (hướng tây)', 'C. 细 (tinh tế)'],
                correct_answer: 'A. 惜 (trân quý - 珍惜)',
                explanation: '"珍惜" (zhēnxī) nghĩa là trân trọng quý tiếc, chữ cần điền là 惜.'
              },
              {
                question_number: 79,
                prompt: 'Điền chữ Hán: 每天早晨他都坚_____(chí)去操场慢跑。',
                reading_text: '每天早晨他都坚_____(chí)去操场慢跑。Měitiān zǎochén tā dōu jiān_____(chí) qù cāochǎng mànpǎo.',
                pinyin: 'jiānchí',
                options: ['A. 持 (kiên trì - 坚持)', 'B. 池 (ao hồ)', 'C. 迟 (chậm chạp)'],
                correct_answer: 'A. 持 (kiên trì - 坚持)',
                explanation: '"坚持" (jiānchí) nghĩa là kiên trì giữ vững, chữ cần điền là 持.'
              },
              {
                question_number: 80,
                prompt: 'Điền chữ Hán: 遇到困难千万不要轻_____(yì)放弃。',
                reading_text: '遇到困难千万不要轻_____(yì)放弃。Yùdào kùnnan qiānwàn bú yào qīng_____(yì) fàngqì.',
                pinyin: 'qīngyì',
                options: ['A. 易 (dễ dàng - 轻易)', 'B. 意 (ý nghĩ)', 'C. 异 (khác biệt)'],
                correct_answer: 'A. 易 (dễ dàng - 轻易)',
                explanation: '"轻易" (qīngyì) nghĩa là nhẹ dạ dễ dàng bỏ cuộc, chữ cần điền là 易.'
              }
            ]
          }
        ]
      }
    ]
  }
];
