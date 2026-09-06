// scripts/hsk_full_data/hsk1_exams.js
// Dữ liệu chuẩn 100% số lượng câu hỏi cho 2 đề HSK 1 (40 câu/đề = 80 câu)
// HSK 1: 35 phút, Thang điểm 200 (Nghe 100 + Đọc 100), Điểm đạt: 120

export const hsk1Exams = [
  {
    id: 'official-hsk1-01',
    title: 'Đề Thi Thử HSK 1 Toàn Diện - Đề Số 01 (H10901)',
    chineseTitle: '新汉语水平考试 HSK（一级）样卷一 H10901',
    level: 'HSK 1',
    duration: 35,
    passingScore: 120,
    maxScore: 200,
    tag: 'Đề Chuẩn Hanban',
    description: 'Đề thi chính thức HSK 1 mã H10901 chuẩn CTI/Hanban với đầy đủ 40 câu hỏi (20 câu Nghe + 20 câu Đọc), có Pinyin, audio script và giải thích chi tiết.',
    skills: [
      {
        id: 'hsk1-01-listen',
        skill_type: 'listening',
        name: 'Nghe hiểu',
        chinese_name: '听力',
        sort_order: 1,
        parts: [
          {
            id: 'hsk1-01-l-p1',
            part_number: 1,
            title: 'Phần 1 (Câu 1 - 5)',
            instructions: 'Nghe từ hoặc cụm từ ngắn, đối chiếu với nghĩa/hình ảnh và phán đoán Đúng (√) hoặc Sai (✕). Mỗi câu nghe 2 lần.',
            sort_order: 1,
            questions: [
              {
                question_number: 1,
                prompt: 'Phán đoán nội dung nghe được với ý nghĩa: "Quả táo" (苹果)',
                audio_text: '苹果。píngguǒ.',
                pinyin: 'píngguǒ',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: 'Đoạn băng đọc: "苹果" (píngguǒ) nghĩa là quả táo. Hoàn toàn khớp với đề bài.'
              },
              {
                question_number: 2,
                prompt: 'Phán đoán nội dung nghe được với ý nghĩa: "Uống trà" (喝茶)',
                audio_text: '喝水。hē shuǐ.',
                pinyin: 'hē shuǐ',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Sai (错误 - ✕)',
                explanation: 'Đoạn băng đọc: "喝水" (hē shuǐ - uống nước), trong khi đề bài ghi "uống trà" (喝茶), nên câu này Sai.'
              },
              {
                question_number: 3,
                prompt: 'Phán đoán nội dung nghe được với ý nghĩa: "Xem sách" (看书)',
                audio_text: '看书。kàn shū.',
                pinyin: 'kàn shū',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: 'Đoạn băng đọc: "看书" (kàn shū) nghĩa là xem/đọc sách. Trùng khớp với hình ảnh/nội dung.'
              },
              {
                question_number: 4,
                prompt: 'Phán đoán nội dung nghe được với ý nghĩa: "Máy bay" (飞机)',
                audio_text: '出租车。chūzūchē.',
                pinyin: 'chūzūchē',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Sai (错误 - ✕)',
                explanation: 'Đoạn băng đọc: "出租车" (chūzūchē - xe taxi), không phải máy bay (飞机), đáp án Sai.'
              },
              {
                question_number: 5,
                prompt: 'Phán đoán nội dung nghe được với ý nghĩa: "Trời mưa" (下雨)',
                audio_text: '下雨了。xiàyǔ le.',
                pinyin: 'xiàyǔ le',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: 'Đoạn băng đọc: "下雨了" (xiàyǔ le - trời mưa rồi). Khớp với đề bài.'
              }
            ]
          },
          {
            id: 'hsk1-01-l-p2',
            part_number: 2,
            title: 'Phần 2 (Câu 6 - 10)',
            instructions: 'Nghe câu nói ngắn và chọn đáp án tranh/ý nghĩa phù hợp nhất (A, B hoặc C).',
            sort_order: 2,
            questions: [
              {
                question_number: 6,
                prompt: 'Nghe câu và chọn đồ vật được nhắc đến:',
                audio_text: '他买了一件衣服。Tā mǎi le yí jiàn yīfu.',
                pinyin: 'Tā mǎi le yí jiàn yīfu.',
                options: ['A. 衣服 (Quần áo)', 'B. 苹果 (Quả táo)', 'C. 杯子 (Cái cốc)'],
                correct_answer: 'A. 衣服 (Quần áo)',
                explanation: 'Đoạn băng nói: "他买了一件衣服" (Anh ấy mua một chiếc quần áo). Đáp án đúng là A.'
              },
              {
                question_number: 7,
                prompt: 'Nghe câu và chọn con vật được miêu tả:',
                audio_text: '那只小狗真漂亮。Nà zhī xiǎogǒu zhēn piàoliang.',
                pinyin: 'Nà zhī xiǎogǒu zhēn piàoliang.',
                options: ['A. 猫 (Con mèo)', 'B. 狗 (Con chó)', 'C. 鸟 (Con chim)'],
                correct_answer: 'B. 狗 (Con chó)',
                explanation: 'Đoạn băng phát âm: "小狗" (xiǎogǒu - chó con). Đáp án B là chính xác.'
              },
              {
                question_number: 8,
                prompt: 'Nghe câu và chọn thời gian được nhắc tới:',
                audio_text: '现在是三点。Xiànzài shì sān diǎn.',
                pinyin: 'Xiànzài shì sān diǎn.',
                options: ['A. 2:00', 'B. 3:00', 'C. 5:00'],
                correct_answer: 'B. 3:00',
                explanation: '"三点" (sān diǎn) là 3 giờ đúng. Chọn B.'
              },
              {
                question_number: 9,
                prompt: 'Nghe câu và chọn hành động:',
                audio_text: '他在打电话呢。Tā zài dǎ diànhuà ne.',
                pinyin: 'Tā zài dǎ diànhuà ne.',
                options: ['A. 打电话 (Gọi điện thoại)', 'B. 看电视 (Xem TV)', 'C. 睡觉 (Ngủ)'],
                correct_answer: 'A. 打电话 (Gọi điện thoại)',
                explanation: '"打电话" (dǎ diànhuà) nghĩa là đang gọi điện thoại. Chọn A.'
              },
              {
                question_number: 10,
                prompt: 'Nghe câu và chọn địa điểm:',
                audio_text: '我们都在学校里。Wǒmen dōu zài xuéxiào lǐ.',
                pinyin: 'Wǒmen dōu zài xuéxiào lǐ.',
                options: ['A. 医院 (Bệnh viện)', 'B. 学校 (Trường học)', 'C. 饭店 (Nhà hàng)'],
                correct_answer: 'B. 学校 (Trường học)',
                explanation: '"学校" (xuéxiào) là trường học. Chọn B.'
              }
            ]
          },
          {
            id: 'hsk1-01-l-p3',
            part_number: 3,
            title: 'Phần 3 (Câu 11 - 15)',
            instructions: 'Nghe đoạn đối thoại ngắn 2 câu và chọn ngữ cảnh phù hợp tương ứng.',
            sort_order: 3,
            questions: [
              {
                question_number: 11,
                prompt: 'Nghe đối thoại và chọn câu trả lời đúng:',
                audio_text: '女：你好，李老师！男：你好，请坐。Nǐ hǎo, Lǐ lǎoshī! Nǐ hǎo, qǐng zuò.',
                pinyin: 'Lǐ lǎoshī / qǐng zuò',
                options: ['A. Chào thầy giáo và mời ngồi', 'B. Tạm biệt bác sĩ', 'C. Mua hoa quả ở chợ'],
                correct_answer: 'A. Chào thầy giáo và mời ngồi',
                explanation: '"李老师" (Thầy Lý), "请坐" (Mời ngồi) chỉ ngữ cảnh chào giáo viên.'
              },
              {
                question_number: 12,
                prompt: 'Nghe đối thoại và chọn đồ uống người nữ muốn:',
                audio_text: '男：你想喝什么？女：我想喝茶。Nǐ xiǎng hē shénme? Wǒ xiǎng hē chá.',
                pinyin: 'Nǐ xiǎng hē shénme? Wǒ xiǎng hē chá.',
                options: ['A. 茶 (Trà)', 'B. 水 (Nước lọc)', 'C. 牛奶 (Sữa bò)'],
                correct_answer: 'A. 茶 (Trà)',
                explanation: 'Người nữ trả lời: "我想喝茶" (Tôi muốn uống trà). Chọn A.'
              },
              {
                question_number: 13,
                prompt: 'Nghe đối thoại và xác định người đang ở đâu:',
                audio_text: '男：你爸爸在哪儿？女：他在医院工作。Nǐ bàba zài nǎr? Tā zài yīyuàn gōngzuò.',
                pinyin: 'Tā zài yīyuàn gōngzuò.',
                options: ['A. 商店 (Cửa hàng)', 'B. 医院 (Bệnh viện)', 'C. 学校 (Trường học)'],
                correct_answer: 'B. 医院 (Bệnh viện)',
                explanation: 'Bố cô ấy làm việc ở bệnh viện ("在医院工作"). Chọn B.'
              },
              {
                question_number: 14,
                prompt: 'Nghe đối thoại và chọn thời tiết:',
                audio_text: '女：今天天气怎么样？男：太冷了！Jīntiān tiānqì zěnmeyàng? Tài lěng le!',
                pinyin: 'Jīntiān tiānqì zěnmeyàng? Tài lěng le!',
                options: ['A. 太热了 (Quá nóng)', 'B. 太冷了 (Quá lạnh)', 'C. 下雨了 (Đang mưa)'],
                correct_answer: 'B. 太冷了 (Quá lạnh)',
                explanation: 'Người nam trả lời: "太冷了" (Lạnh quá rồi). Chọn B.'
              },
              {
                question_number: 15,
                prompt: 'Nghe đối thoại và xác định ai đến:',
                audio_text: '男：是谁来了？女：是我同学。Shì shéi lái le? Shì wǒ tóngxué.',
                pinyin: 'Shì shéi lái le? Shì wǒ tóngxué.',
                options: ['A. 同学 (Bạn cùng học)', 'B. 老师 (Thầy giáo)', 'C. 朋友 (Bạn bè)'],
                correct_answer: 'A. 同学 (Bạn cùng học)',
                explanation: 'Người nữ trả lời: "是我同学" (Là bạn cùng học của tôi). Chọn A.'
              }
            ]
          },
          {
            id: 'hsk1-01-l-p4',
            part_number: 4,
            title: 'Phần 4 (Câu 16 - 20)',
            instructions: 'Nghe câu nói hoặc đoạn ngắn và trả lời câu hỏi trắc nghiệm A, B, C.',
            sort_order: 4,
            questions: [
              {
                question_number: 16,
                prompt: 'Hỏi: Ai đang ở nhà? (谁在家？)',
                audio_text: '妈妈在家里做饭呢。Māma zài jiā lǐ zuò fàn ne. 问：谁在家？',
                pinyin: 'Māma zài jiā lǐ zuò fàn ne. Wèn: Shéi zài jiā?',
                options: ['A. 妈妈 (Mẹ)', 'B. 爸爸 (Bố)', 'C. 哥哥 (Anh trai)'],
                correct_answer: 'A. 妈妈 (Mẹ)',
                explanation: '"妈妈在家里做饭" -> Người ở nhà là Mẹ (妈妈).'
              },
              {
                question_number: 17,
                prompt: 'Hỏi: Buổi chiều anh ấy đi đâu? (他下午去哪儿？)',
                audio_text: '下午我想去商店买东西。Xiàwǔ wǒ xiǎng qù shāngdiàn mǎi dōngxi. 问：他下午去哪儿？',
                pinyin: 'Xiàwǔ wǒ xiǎng qù shāngdiàn mǎi dōngxi.',
                options: ['A. 学校 (Trường học)', 'B. 商店 (Cửa hàng)', 'C. 医院 (Bệnh viện)'],
                correct_answer: 'B. 商店 (Cửa hàng)',
                explanation: 'Trong bài: "去商店买东西" (Đi cửa hàng mua đồ).'
              },
              {
                question_number: 18,
                prompt: 'Hỏi: Con gái năm nay bao nhiêu tuổi? (女儿今年几岁？)',
                audio_text: '我女儿今年五岁了。Wǒ nǚ\'ér jīnnián wǔ suì le. 问：女儿今年几岁？',
                pinyin: 'Wǒ nǚ\'ér jīnnián wǔ suì le.',
                options: ['A. 4 岁', 'B. 5 岁', 'C. 6 岁'],
                correct_answer: 'B. 5 岁',
                explanation: '"五岁" (wǔ suì) là 5 tuổi. Chọn B.'
              },
              {
                question_number: 19,
                prompt: 'Hỏi: Người nói đang ngồi phương tiện gì? (他们怎么去？)',
                audio_text: '我们坐出租车去火车站。Wǒmen zuò chūzūchē qù huǒchēzhàn.',
                pinyin: 'Wǒmen zuò chūzūchē qù huǒchēzhàn.',
                options: ['A. 坐飞机 (Đi máy bay)', 'B. 坐出租车 (Đi taxi)', 'C. 开车 (Lái xe)'],
                correct_answer: 'B. 坐出租车 (Đi taxi)',
                explanation: '"坐出租车" (zuò chūzūchē) là đi xe taxi.'
              },
              {
                question_number: 20,
                prompt: 'Hỏi: Người nói thích ăn gì? (他喜欢吃什么？)',
                audio_text: '我不喜欢吃米饭，我喜欢吃面条。Wǒ bù xǐhuan chī mǐfàn, wǒ xǐhuan chī miàntiáo.',
                pinyin: 'Wǒ bù xǐhuan chī mǐfàn, wǒ xǐhuan chī miàntiáo.',
                options: ['A. 米饭 (Cơm)', 'B. 面条 (Mì sợi)', 'C. 苹果 (Táo)'],
                correct_answer: 'B. 面条 (Mì sợi)',
                explanation: '"我喜欢吃面条" (Tôi thích ăn mì). Đáp án đúng là B.'
              }
            ]
          }
        ]
      },
      {
        id: 'hsk1-01-read',
        skill_type: 'reading',
        name: 'Đọc hiểu',
        chinese_name: '阅读',
        sort_order: 2,
        parts: [
          {
            id: 'hsk1-01-r-p1',
            part_number: 1,
            title: 'Phần 1 (Câu 21 - 25)',
            instructions: 'Quan sát từ vựng và phán đoán tính đúng sai so với ý nghĩa/hình ảnh tương ứng.',
            sort_order: 1,
            questions: [
              {
                question_number: 21,
                prompt: 'Phán đoán nghĩa của từ: 书 (shū) có nghĩa là "Quyển sách"',
                reading_text: '书 shū',
                pinyin: 'shū',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: 'Từ "书" (shū) chính xác có nghĩa là quyển sách. Đáp án Đúng.'
              },
              {
                question_number: 22,
                prompt: 'Phán đoán nghĩa của từ: 水果 (shuǐguǒ) có nghĩa là "Xe đạp"',
                reading_text: '水果 shuǐguǒ',
                pinyin: 'shuǐguǒ',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Sai (错误 - ✕)',
                explanation: '"水果" (shuǐguǒ) nghĩa là hoa quả, không phải xe đạp. Đáp án Sai.'
              },
              {
                question_number: 23,
                prompt: 'Phán đoán nghĩa của từ: 医生 (yīshēng) có nghĩa là "Bác sĩ"',
                reading_text: '医生 yīshēng',
                pinyin: 'yīshēng',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: '"医生" (yīshēng) là bác sĩ. Đáp án Đúng.'
              },
              {
                question_number: 24,
                prompt: 'Phán đoán nghĩa của từ: 猫 (māo) có nghĩa là "Con cá"',
                reading_text: '猫 māo',
                pinyin: 'māo',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Sai (错误 - ✕)',
                explanation: '"猫" (māo) là con mèo. Con cá là "鱼" (yú). Đáp án Sai.'
              },
              {
                question_number: 25,
                prompt: 'Phán đoán nghĩa của từ: 电脑 (diànnǎo) có nghĩa là "Máy tính"',
                reading_text: '电脑 diànnǎo',
                pinyin: 'diànnǎo',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: '"电脑" (diànnǎo) dịch nghĩa điện não tức là máy tính điện tử. Đáp án Đúng.'
              }
            ]
          },
          {
            id: 'hsk1-01-r-p2',
            part_number: 2,
            title: 'Phần 2 (Câu 26 - 30)',
            instructions: 'Đọc câu văn và chọn mô tả hành động hoặc đồ vật tương ứng chính xác nhất.',
            sort_order: 2,
            questions: [
              {
                question_number: 26,
                prompt: 'Chọn câu tương ứng nghĩa: "Hôm nay tôi mua một ít hoa quả."',
                reading_text: '今天我买了一些水果。Jīntiān wǒ mǎi le yìxiē shuǐguǒ.',
                pinyin: 'Jīntiān wǒ mǎi le yìxiē shuǐguǒ.',
                options: ['A. Mua hoa quả (水果)', 'B. Uống cà phê (咖啡)', 'C. Đi xem phim (看电影)'],
                correct_answer: 'A. Mua hoa quả (水果)',
                explanation: '"买了一些水果" dịch là đã mua một ít hoa quả.'
              },
              {
                question_number: 27,
                prompt: 'Chọn câu tương ứng nghĩa: "Cái cốc này 20 đồng."',
                reading_text: '这个杯子二十块钱。Zhè ge bēizi èrshí kuài qián.',
                pinyin: 'Zhè ge bēizi èrshí kuài qián.',
                options: ['A. Giá tiền cái cốc: 20 đồng', 'B. Giá tiền cái bàn: 50 đồng', 'C. Mua 20 quyển sách'],
                correct_answer: 'A. Giá tiền cái cốc: 20 đồng',
                explanation: '"杯子" là cái cốc, "二十块" là 20 đồng.'
              },
              {
                question_number: 28,
                prompt: 'Chọn câu tương ứng nghĩa: "Chúng tôi đang ngồi học trong lớp."',
                reading_text: '我们在教室里听课。Wǒmen zài jiàoshì lǐ tīng kè.',
                pinyin: 'Wǒmen zài jiàoshì lǐ tīng kè.',
                options: ['A. Ở trong lớp học nghe giảng', 'B. Ở bệnh viện thăm bạn', 'C. Ở ngoài sân bóng'],
                correct_answer: 'A. Ở trong lớp học nghe giảng',
                explanation: '"教室里" là trong phòng học, "听课" là nghe giảng bài.'
              },
              {
                question_number: 29,
                prompt: 'Chọn câu tương ứng nghĩa: "Thời tiết hôm nay rất đẹp."',
                reading_text: '今天天气很好。Jīntiān tiānqì hěn hǎo.',
                pinyin: 'Jīntiān tiānqì hěn hǎo.',
                options: ['A. Thời tiết tốt, nắng đẹp', 'B. Trời mưa to gió lớn', 'C. Trời rất lạnh và tối'],
                correct_answer: 'A. Thời tiết tốt, nắng đẹp',
                explanation: '"天气很好" chỉ thời tiết rất đẹp, thuận lợi.'
              },
              {
                question_number: 30,
                prompt: 'Chọn câu tương ứng nghĩa: "Cô ấy là bác sĩ ở bệnh viện này."',
                reading_text: '她是这个医院的医生。Tā shì zhège yīyuàn de yīshēng.',
                pinyin: 'Tā shì zhège yīyuàn de yīshēng.',
                options: ['A. Nữ bác sĩ bệnh viện', 'B. Giáo viên trường học', 'C. Nhân viên bán hàng'],
                correct_answer: 'A. Nữ bác sĩ bệnh viện',
                explanation: '"医院的医生" là bác sĩ của bệnh viện.'
              }
            ]
          },
          {
            id: 'hsk1-01-r-p3',
            part_number: 3,
            title: 'Phần 3 (Câu 31 - 35)',
            instructions: 'Ghép câu hỏi với câu đối đáp phù hợp nhất trong giao tiếp.',
            sort_order: 3,
            questions: [
              {
                question_number: 31,
                prompt: 'Ghép câu đáp cho câu hỏi: "你叫什么名字？" (Bạn tên là gì?)',
                reading_text: '你叫什么名字？Nǐ jiào shénme míngzi?',
                pinyin: 'Nǐ jiào shénme míngzi?',
                options: ['A. 我叫王明。(Tôi tên là Vương Minh.)', 'B. 我二十岁。(Tôi hai mươi tuổi.)', 'C. 我是中国人。(Tôi là người Trung Quốc.)'],
                correct_answer: 'A. 我叫王明。(Tôi tên là Vương Minh.)',
                explanation: 'Hỏi tên dùng "你叫什么名字", câu trả lời chuẩn là "我叫..."'
              },
              {
                question_number: 32,
                prompt: 'Ghép câu đáp cho lời cảm ơn: "谢谢你！" (Cảm ơn bạn!)',
                reading_text: '谢谢你！Xièxie nǐ!',
                pinyin: 'Xièxie nǐ!',
                options: ['A. 不客气。(Không có gì / Đừng khách sáo.)', 'B. 对不起。(Xin lỗi.)', 'C. 没关系。(Không sao cả.)'],
                correct_answer: 'A. 不客气。(Không có gì / Đừng khách sáo.)',
                explanation: 'Đáp lại "谢谢" là "不客气". "没关系" dùng để đáp lại "对不起".'
              },
              {
                question_number: 33,
                prompt: 'Ghép câu đáp cho câu hỏi: "这本书是谁的？" (Quyển sách này của ai?)',
                reading_text: '这本书是谁的？Zhè běn shū shì shéi de?',
                pinyin: 'Zhè běn shū shì shéi de?',
                options: ['A. 是我老师的。(Là của thầy giáo tôi.)', 'B. 在桌子上。(Ở trên bàn.)', 'C. 很有意思。(Rất thú vị.)'],
                correct_answer: 'A. 是我老师的。(Là của thầy giáo tôi.)',
                explanation: 'Hỏi sở hữu "是谁的" -> trả lời "是我老师的".'
              },
              {
                question_number: 34,
                prompt: 'Ghép câu đáp cho câu hỏi: "你想吃什么？" (Bạn muốn ăn gì?)',
                reading_text: '你想吃什么？Nǐ xiǎng chī shénme?',
                pinyin: 'Nǐ xiǎng chī shénme?',
                options: ['A. 我想吃中国菜。(Tôi muốn ăn món Trung Quốc.)', 'B. 我想喝水。(Tôi muốn uống nước.)', 'C. 我去商店。(Tôi đi cửa hàng.)'],
                correct_answer: 'A. 我想吃中国菜。(Tôi muốn ăn món Trung Quốc.)',
                explanation: 'Hỏi muốn ăn gì ("吃什么") -> Trả lời đồ ăn "吃中国菜".'
              },
              {
                question_number: 35,
                prompt: 'Ghép câu đáp cho câu chào: "再见！" (Tạm biệt!)',
                reading_text: '再见！Zàijiàn!',
                pinyin: 'Zàijiàn!',
                options: ['A. 明天见！(Ngày mai gặp lại / Tạm biệt!)', 'B. 你好！(Xin chào!)', 'C. 请问？(Xin hỏi?)'],
                correct_answer: 'A. 明天见！(Ngày mai gặp lại / Tạm biệt!)',
                explanation: 'Đáp lại "再见" dùng "明天见" hoặc "再见".'
              }
            ]
          },
          {
            id: 'hsk1-01-r-p4',
            part_number: 4,
            title: 'Phần 4 (Câu 36 - 40)',
            instructions: 'Chọn từ vựng thích hợp nhất điền vào chỗ trống để tạo thành câu hoàn chỉnh.',
            sort_order: 4,
            questions: [
              {
                question_number: 36,
                prompt: 'Điền từ vào chỗ trống: 他是我的_____，我们一起学习汉语。',
                reading_text: '他是我的_____，我们一起学习汉语。Tā shì wǒ de _____, wǒmen yìqǐ xuéxí Hànyǔ.',
                pinyin: 'Tā shì wǒ de _____, wǒmen yìqǐ xuéxí Hànyǔ.',
                options: ['A. 同学 (bạn học)', 'B. 苹果 (quả táo)', 'C. 昨天 (hôm qua)'],
                correct_answer: 'A. 同学 (bạn học)',
                explanation: 'Cùng nhau học tiếng Trung thì người đó là "同学" (bạn học).'
              },
              {
                question_number: 37,
                prompt: 'Điền từ vào chỗ trống: 桌子上有两_____书。',
                reading_text: '桌子上有两_____书。Zhuōzi shang yǒu liǎng _____ shū.',
                pinyin: 'Zhuōzi shang yǒu liǎng _____ shū.',
                options: ['A. 本 (quyển - lượng từ cho sách)', 'B. 个 (cái)', 'C. 岁 (tuổi)'],
                correct_answer: 'A. 本 (quyển - lượng từ cho sách)',
                explanation: 'Lượng từ đi với "书" (sách) là "本" (běn).'
              },
              {
                question_number: 38,
                prompt: 'Điền từ vào chỗ trống: 我_____在看书，没听见你说话。',
                reading_text: '我_____在看书，没听见你说话。Wǒ _____ zài kàn shū, méi tīngjiàn nǐ shuōhuà.',
                pinyin: 'Wǒ _____ zài kàn shū, méi tīngjiàn nǐ shuōhuà.',
                options: ['A. 正 (đang)', 'B. 不 (không)', 'C. 去 (đi)'],
                correct_answer: 'A. 正 (đang)',
                explanation: 'Phó từ "正" kết hợp với "在" tạo thành cấu trúc "正在" biểu thị hành động đang diễn ra.'
              },
              {
                question_number: 39,
                prompt: 'Điền từ vào chỗ trống: 医院在学校的_____面。',
                reading_text: '医院在学校的_____面。Yīyuàn zài xuéxiào de _____ miàn.',
                pinyin: 'Yīyuàn zài xuéxiào de _____ miàn.',
                options: ['A. 前 (phía trước)', 'B. 谁 (ai)', 'C. 怎么样 (như thế nào)'],
                correct_answer: 'A. 前 (phía trước)',
                explanation: '"前面" (phía trước) là từ chỉ phương vị, vị trí phù hợp.'
              },
              {
                question_number: 40,
                prompt: 'Điền từ vào chỗ trống: 这个汉字我不会_____。',
                reading_text: '这个汉字我不会_____。Zhège hànzì wǒ bú huì _____.',
                pinyin: 'Zhège hànzì wǒ bú huì _____.',
                options: ['A. 写 (viết)', 'B. 喝 (uống)', 'C. 听 (nghe)'],
                correct_answer: 'A. 写 (viết)',
                explanation: 'Đối với chữ Hán "汉字", động từ phù hợp là "写" (viết).'
              }
            ]
          }
        ]
      }
    ]
  },

  // ĐỀ THI HSK 1 - ĐỀ SỐ 02 (H11330) - 40 CÂU ĐẦY ĐỦ
  {
    id: 'official-hsk1-02',
    title: 'Đề Thi Thử HSK 1 Toàn Diện - Đề Số 02 (H11330)',
    chineseTitle: '新汉语水平考试 HSK（一级）样卷二 H11330',
    level: 'HSK 1',
    duration: 35,
    passingScore: 120,
    maxScore: 200,
    tag: 'Đề Chuẩn Hanban',
    description: 'Đề thi chính thức HSK 1 mã H11330 chuẩn CTI/Hanban với 40 câu hỏi trọn vẹn (Nghe 1-20, Đọc 21-40), có Pinyin, lời thoại audio và hướng dẫn giải ngữ pháp tiếng Việt.',
    skills: [
      {
        id: 'hsk1-02-listen',
        skill_type: 'listening',
        name: 'Nghe hiểu',
        chinese_name: '听力',
        sort_order: 1,
        parts: [
          {
            id: 'hsk1-02-l-p1',
            part_number: 1,
            title: 'Phần 1 (Câu 1 - 5)',
            instructions: 'Nghe từ ngữ ngắn, phán đoán tính chính xác Đúng (√) hoặc Sai (✕).',
            sort_order: 1,
            questions: [
              {
                question_number: 1,
                prompt: 'Phán đoán nội dung nghe được: "Uống nước" (喝水)',
                audio_text: '喝水。hē shuǐ.',
                pinyin: 'hē shuǐ',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: 'Băng đọc "喝水" (uống nước). Hoàn toàn chính xác.'
              },
              {
                question_number: 2,
                prompt: 'Phán đoán nội dung nghe được: "Xem phim" (看电影)',
                audio_text: '睡觉。shuìjiào.',
                pinyin: 'shuìjiào',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Sai (错误 - ✕)',
                explanation: 'Băng đọc "睡觉" (đi ngủ), khác với xem phim. Đáp án Sai.'
              },
              {
                question_number: 3,
                prompt: 'Phán đoán nội dung nghe được: "Trường học" (学校)',
                audio_text: '学校。xuéxiào.',
                pinyin: 'xuéxiào',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: 'Băng đọc "学校" (trường học). Đáp án Đúng.'
              },
              {
                question_number: 4,
                prompt: 'Phán đoán nội dung nghe được: "Ăn cơm" (吃饭)',
                audio_text: '买衣服。mǎi yīfu.',
                pinyin: 'mǎi yīfu',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Sai (错误 - ✕)',
                explanation: 'Băng đọc "买衣服" (mua quần áo), không phải ăn cơm.'
              },
              {
                question_number: 5,
                prompt: 'Phán đoán nội dung nghe được: "Một con mèo" (一只猫)',
                audio_text: '一只猫。yì zhī māo.',
                pinyin: 'yì zhī māo',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: 'Băng đọc "一只猫" (một con mèo). Đáp án Đúng.'
              }
            ]
          },
          {
            id: 'hsk1-02-l-p2',
            part_number: 2,
            title: 'Phần 2 (Câu 6 - 10)',
            instructions: 'Nghe câu nói ngắn và chọn đáp án tương ứng.',
            sort_order: 2,
            questions: [
              {
                question_number: 6,
                prompt: 'Nghe câu và chọn địa điểm:',
                audio_text: '他在饭馆吃饭。Tā zài fànguǎn chīfàn.',
                pinyin: 'Tā zài fànguǎn chīfàn.',
                options: ['A. 饭馆 (Quán ăn)', 'B. 医院 (Bệnh viện)', 'C. 机场 (Sân bay)'],
                correct_answer: 'A. 饭馆 (Quán ăn)',
                explanation: '"在饭馆吃饭" là ăn cơm ở quán ăn. Chọn A.'
              },
              {
                question_number: 7,
                prompt: 'Nghe câu và chọn đối tượng:',
                audio_text: '我哥哥是老师。Wǒ gēge shì lǎoshī.',
                pinyin: 'Wǒ gēge shì lǎoshī.',
                options: ['A. 哥哥 (Anh trai)', 'B. 弟弟 (Em trai)', 'C. 爸爸 (Bố)'],
                correct_answer: 'A. 哥哥 (Anh trai)',
                explanation: '"我哥哥是老师" -> đối tượng được nhắc đến là Anh trai (哥哥).'
              },
              {
                question_number: 8,
                prompt: 'Nghe câu và chọn số lượng:',
                audio_text: '我买了三个苹果。Wǒ mǎi le sān gè píngguǒ.',
                pinyin: 'Wǒ mǎi le sān gè píngguǒ.',
                options: ['A. 2', 'B. 3', 'C. 5'],
                correct_answer: 'B. 3',
                explanation: '"三个" (sān gè) là 3 quả.'
              },
              {
                question_number: 9,
                prompt: 'Nghe câu và chọn nghề nghiệp:',
                audio_text: '我妈妈是医生。Wǒ māma shì yīshēng.',
                pinyin: 'Wǒ māma shì yīshēng.',
                options: ['A. 医生 (Bác sĩ)', 'B. 学生 (Học sinh)', 'C. 司机 (Tài xế)'],
                correct_answer: 'A. 医生 (Bác sĩ)',
                explanation: '"医生" là bác sĩ.'
              },
              {
                question_number: 10,
                prompt: 'Nghe câu và chọn thời gian:',
                audio_text: '我们明天上午见。Wǒmen míngtiān shàngwǔ jiàn.',
                pinyin: 'Wǒmen míngtiān shàngwǔ jiàn.',
                options: ['A. 明天上午 (Sáng mai)', 'B. 昨天下午 (Chiều qua)', 'C. 晚上 (Buổi tối)'],
                correct_answer: 'A. 明天上午 (Sáng mai)',
                explanation: '"明天上午" là sáng ngày mai.'
              }
            ]
          },
          {
            id: 'hsk1-02-l-p3',
            part_number: 3,
            title: 'Phần 3 (Câu 11 - 15)',
            instructions: 'Nghe đối thoại ngắn và chọn nội dung liên quan.',
            sort_order: 3,
            questions: [
              {
                question_number: 11,
                prompt: 'Nghe đối thoại và chọn việc người nam đang làm:',
                audio_text: '女：你在做什么？男：我在写汉字。Nǐ zài zuò shénme? Wǒ zài xiě hànzì.',
                pinyin: 'Wǒ zài xiě hànzì.',
                options: ['A. 写汉字 (Viết chữ Hán)', 'B. 看书 (Đọc sách)', 'C. 听音乐 (Nghe nhạc)'],
                correct_answer: 'A. 写汉字 (Viết chữ Hán)',
                explanation: 'Người nam nói: "我在写汉字" (Tôi đang viết chữ Hán).'
              },
              {
                question_number: 12,
                prompt: 'Nghe đối thoại và chọn giá tiền:',
                audio_text: '男：这件衣服多少钱？女：八十块。Zhè jiàn yīfu duōshao qián? Bāshí kuài.',
                pinyin: 'Bāshí kuài.',
                options: ['A. 80 块 (80 đồng)', 'B. 50 块 (50 đồng)', 'C. 100 块 (100 đồng)'],
                correct_answer: 'A. 80 块 (80 đồng)',
                explanation: '"八十块" (bāshí kuài) là 80 đồng.'
              },
              {
                question_number: 13,
                prompt: 'Nghe đối thoại và xác định quan hệ:',
                audio_text: '女：他是谁？男：他是我的好朋友。Tā shì shéi? Tā shì wǒ de hǎo péngyou.',
                pinyin: 'Tā shì wǒ de hǎo péngyou.',
                options: ['A. 朋友 (Bạn bè)', 'B. 老师 (Thầy giáo)', 'C. 医生 (Bác sĩ)'],
                correct_answer: 'A. 朋友 (Bạn bè)',
                explanation: '"好朋友" nghĩa là bạn tốt.'
              },
              {
                question_number: 14,
                prompt: 'Nghe đối thoại và xác định thời gian gặp:',
                audio_text: '男：我们几点去火车站？女：四点半。Wǒmen jǐ diǎn qù huǒchēzhàn? Sì diǎn bàn.',
                pinyin: 'Sì diǎn bàn.',
                options: ['A. 4:30', 'B. 4:00', 'C. 5:30'],
                correct_answer: 'A. 4:30',
                explanation: '"四点半" là 4 giờ 30 phút.'
              },
              {
                question_number: 15,
                prompt: 'Nghe đối thoại và chọn địa điểm:',
                audio_text: '女：小猫在哪儿？男：在椅子下面。Xiǎomāo zài nǎr? Zài yǐzi xiàmiàn.',
                pinyin: 'Zài yǐzi xiàmiàn.',
                options: ['A. 椅子下面 (Dưới ghế)', 'B. 桌子上面 (Trên bàn)', 'C. 床上 (Trên giường)'],
                correct_answer: 'A. 椅子下面 (Dưới ghế)',
                explanation: '"椅子下面" là ở phía dưới cái ghế.'
              }
            ]
          },
          {
            id: 'hsk1-02-l-p4',
            part_number: 4,
            title: 'Phần 4 (Câu 16 - 20)',
            instructions: 'Nghe câu nói và trả lời câu hỏi trắc nghiệm.',
            sort_order: 4,
            questions: [
              {
                question_number: 16,
                prompt: 'Hỏi: Ai thích uống trà? (谁喜欢喝茶？)',
                audio_text: '我爸爸每天都喝茶。Wǒ bàba měitiān dōu hē chá. 问：谁喜欢喝茶？',
                pinyin: 'Wǒ bàba měitiān dōu hē chá.',
                options: ['A. 爸爸 (Bố)', 'B. 妈妈 (Mẹ)', 'C. 哥哥 (Anh trai)'],
                correct_answer: 'A. 爸爸 (Bố)',
                explanation: '"我爸爸每天都喝茶" -> Bố uống trà.'
              },
              {
                question_number: 17,
                prompt: 'Hỏi: Thời tiết hôm nay thế nào? (今天天气怎么样？)',
                audio_text: '今天没下雨，天气非常好。Jīntiān méi xiàyǔ, tiānqì fēicháng hǎo. 问：今天天气怎么样？',
                pinyin: 'tiānqì fēicháng hǎo.',
                options: ['A. 很好 (Rất tốt)', 'B. 下雨 (Trời mưa)', 'C. 太冷 (Quá lạnh)'],
                correct_answer: 'A. 很好 (Rất tốt)',
                explanation: '"天气非常好" nghĩa là thời tiết cực kỳ tốt.'
              },
              {
                question_number: 18,
                prompt: 'Hỏi: Anh ấy ở Bắc Kinh bao lâu? (他在北京多长时间？)',
                audio_text: '我在北京住了三年。Wǒ zài Běijīng zhù le sān nián. 问：他在北京住了几年？',
                pinyin: 'Wǒ zài Běijīng zhù le sān nián.',
                options: ['A. 三年 (3 năm)', 'B. 三个月 (3 tháng)', 'C. 三天 (3 ngày)'],
                correct_answer: 'A. 三年 (3 năm)',
                explanation: '"三年" (sān nián) là 3 năm.'
              },
              {
                question_number: 19,
                prompt: 'Hỏi: Trương tiên sinh đi đâu? (张先生去哪儿？)',
                audio_text: '张先生坐飞机去上海了。Zhāng xiānsheng zuò fēijī qù Shànghǎi le. 问：张先生去哪儿？',
                pinyin: 'Zhāng xiānsheng zuò fēijī qù Shànghǎi le.',
                options: ['A. 北京 (Bắc Kinh)', 'B. 上海 (Thượng Hải)', 'C. 广州 (Quảng Châu)'],
                correct_answer: 'B. 上海 (Thượng Hải)',
                explanation: '"去上海了" (Đã đi Thượng Hải).'
              },
              {
                question_number: 20,
                prompt: 'Hỏi: Cô ấy muốn mua cái gì? (她想买什么？)',
                audio_text: '这家店的苹果很大，我想买五个。Zhè jiā diàn de píngguǒ hěn dà, wǒ xiǎng mǎi wǔ gè.',
                pinyin: 'wǒ xiǎng mǎi wǔ gè.',
                options: ['A. 苹果 (Táo)', 'B. 西瓜 (Dưa hấu)', 'C. 衣服 (Quần áo)'],
                correct_answer: 'A. 苹果 (Táo)',
                explanation: 'Nói về việc mua 5 quả táo ("苹果").'
              }
            ]
          }
        ]
      },
      {
        id: 'hsk1-02-read',
        skill_type: 'reading',
        name: 'Đọc hiểu',
        chinese_name: '阅读',
        sort_order: 2,
        parts: [
          {
            id: 'hsk1-02-r-p1',
            part_number: 1,
            title: 'Phần 1 (Câu 21 - 25)',
            instructions: 'Phán đoán tính đúng sai của từ vựng so với nội dung.',
            sort_order: 1,
            questions: [
              {
                question_number: 21,
                prompt: 'Phán đoán từ vựng: 狗 (gǒu) có nghĩa là "Con chó"',
                reading_text: '狗 gǒu',
                pinyin: 'gǒu',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: '"狗" chính là con chó. Đáp án Đúng.'
              },
              {
                question_number: 22,
                prompt: 'Phán đoán từ vựng: 米饭 (mǐfàn) có nghĩa là "Táo"',
                reading_text: '米饭 mǐfàn',
                pinyin: 'mǐfàn',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Sai (错误 - ✕)',
                explanation: '"米饭" là cơm trắng, không phải táo. Đáp án Sai.'
              },
              {
                question_number: 23,
                prompt: 'Phán đoán từ vựng: 睡觉 (shuìjiào) có nghĩa là "Đi ngủ"',
                reading_text: '睡觉 shuìjiào',
                pinyin: 'shuìjiào',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: '"睡觉" dịch là ngủ / đi ngủ. Đáp án Đúng.'
              },
              {
                question_number: 24,
                prompt: 'Phán đoán từ vựng: 开车 (kāi chē) có nghĩa là "Đi bộ"',
                reading_text: '开车 kāi chē',
                pinyin: 'kāi chē',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Sai (错误 - ✕)',
                explanation: '"开车" là lái xe ô tô, không phải đi bộ. Đáp án Sai.'
              },
              {
                question_number: 25,
                prompt: 'Phán đoán từ vựng: 老师 (lǎoshī) có nghĩa là "Thầy giáo / Cô giáo"',
                reading_text: '老师 lǎoshī',
                pinyin: 'lǎoshī',
                options: ['Đúng (正确 - √)', 'Sai (错误 - ✕)'],
                correct_answer: 'Đúng (正确 - √)',
                explanation: '"老师" là giáo viên/thầy cô giáo. Đáp án Đúng.'
              }
            ]
          },
          {
            id: 'hsk1-02-r-p2',
            part_number: 2,
            title: 'Phần 2 (Câu 26 - 30)',
            instructions: 'Chọn câu tương ứng nghĩa hoặc tình huống phù hợp.',
            sort_order: 2,
            questions: [
              {
                question_number: 26,
                prompt: 'Chọn câu có nghĩa: "Cô ấy đang đọc sách trong thư viện."',
                reading_text: '她在看书。Tā zài kàn shū.',
                pinyin: 'Tā zài kàn shū.',
                options: ['A. Đang xem/đọc sách', 'B. Đang nghe nhạc', 'C. Đang nấu cơm'],
                correct_answer: 'A. Đang xem/đọc sách',
                explanation: '"看书" là đọc sách.'
              },
              {
                question_number: 27,
                prompt: 'Chọn câu có nghĩa: "Họ cùng nhau đi ăn cơm trưa."',
                reading_text: '他们去吃午饭了。Tāmen qù chī wǔfàn le.',
                pinyin: 'Tāmen qù chī wǔfàn le.',
                options: ['A. Đi ăn cơm trưa', 'B. Đi về nhà ngủ', 'C. Đi xem bóng đá'],
                correct_answer: 'A. Đi ăn cơm trưa',
                explanation: '"吃午饭" là ăn bữa trưa.'
              },
              {
                question_number: 28,
                prompt: 'Chọn câu có nghĩa: "Trời hôm nay mưa rất to."',
                reading_text: '今天下大雨。Jīntiān xià dà yǔ.',
                pinyin: 'Jīntiān xià dà yǔ.',
                options: ['A. Mưa lớn', 'B. Tuyết rơi', 'C. Nắng chói chang'],
                correct_answer: 'A. Mưa lớn',
                explanation: '"下大雨" là đổ mưa to.'
              },
              {
                question_number: 29,
                prompt: 'Chọn câu có nghĩa: "Tôi muốn mua một chiếc điện thoại mới."',
                reading_text: '我想买一个新手机。Wǒ xiǎng mǎi yí gè xīn shǒujī.',
                pinyin: 'Wǒ xiǎng mǎi yí gè xīn shǒujī.',
                options: ['A. Mua điện thoại mới', 'B. Mua máy tính cũ', 'C. Mua xe đạp mới'],
                correct_answer: 'A. Mua điện thoại mới',
                explanation: '"新手机" là điện thoại di động mới.'
              },
              {
                question_number: 30,
                prompt: 'Chọn câu có nghĩa: "Anh ấy là người bạn tốt nhất của tôi."',
                reading_text: '他是我最好的朋友。Tā shì wǒ zuì hǎo de péngyou.',
                pinyin: 'Tā shì wǒ zuì hǎo de péngyou.',
                options: ['A. Bạn thân thiết nhất', 'B. Thầy giáo nghiêm khắc', 'C. Bạn cùng bàn mới'],
                correct_answer: 'A. Bạn thân thiết nhất',
                explanation: '"最好的朋友" là bạn tốt nhất.'
              }
            ]
          },
          {
            id: 'hsk1-02-r-p3',
            part_number: 3,
            title: 'Phần 3 (Câu 31 - 35)',
            instructions: 'Ghép câu hỏi với câu trả lời chuẩn xác.',
            sort_order: 3,
            questions: [
              {
                question_number: 31,
                prompt: 'Ghép câu đáp cho: "你会说汉语吗？" (Bạn biết nói tiếng Trung không?)',
                reading_text: '你会说汉语吗？Nǐ huì shuō Hànyǔ ma?',
                pinyin: 'Nǐ huì shuō Hànyǔ ma?',
                options: ['A. 我会说一点儿。(Tôi biết nói một chút.)', 'B. 很好吃。(Rất ngon.)', 'C. 我去学校。(Tôi đi học.)'],
                correct_answer: 'A. 我会说一点儿。(Tôi biết nói một chút.)',
                explanation: 'Hỏi về kỹ năng "会说汉语吗" -> Trả lời "我会说一点儿".'
              },
              {
                question_number: 32,
                prompt: 'Ghép câu đáp cho: "对不起！" (Xin lỗi bạn!)',
                reading_text: '对不起！Duìbuqǐ!',
                pinyin: 'Duìbuqǐ!',
                options: ['A. 没关系。(Không sao đâu.)', 'B. 谢谢你。(Cảm ơn bạn.)', 'C. 不客气。(Đừng khách sáo.)'],
                correct_answer: 'A. 没关系。(Không sao đâu.)',
                explanation: 'Đáp lại "对不起" là "没关系".'
              },
              {
                question_number: 33,
                prompt: 'Ghép câu đáp cho: "你的猫在哪儿？" (Con mèo của bạn ở đâu?)',
                reading_text: '你的猫在哪儿？Nǐ de māo zài nǎr?',
                pinyin: 'Nǐ de māo zài nǎr?',
                options: ['A. 它在椅子下面。(Nó ở dưới ghế.)', 'B. 它很喜欢吃鱼。(Nó thích ăn cá.)', 'C. 它是一只白猫。(Nó là mèo trắng.)'],
                correct_answer: 'A. 它在椅子下面。(Nó ở dưới ghế.)',
                explanation: 'Hỏi vị trí "在哪儿" -> trả lời "在椅子下面".'
              },
              {
                question_number: 34,
                prompt: 'Ghép câu đáp cho: "现在几点了？" (Bây giờ mấy giờ rồi?)',
                reading_text: '现在几点了？Xiànzài jǐ diǎn le?',
                pinyin: 'Xiànzài jǐ diǎn le?',
                options: ['A. 现在八点。(Bây giờ 8 giờ.)', 'B. 今天星期一。(Hôm nay thứ 2.)', 'C. 三月份。(Tháng ba.)'],
                correct_answer: 'A. 现在八点。(Bây giờ 8 giờ.)',
                explanation: 'Hỏi giờ "几点了" -> trả lời giờ "现在八点".'
              },
              {
                question_number: 35,
                prompt: 'Ghép câu đáp cho: "你认识他吗？" (Bạn quen biết anh ấy không?)',
                reading_text: '你认识他吗？Nǐ rènshi tā ma?',
                pinyin: 'Nǐ rènshi tā ma?',
                options: ['A. 认识，他是我的同学。(Quen, anh ấy là bạn học của tôi.)', 'B. 他去北京了。(Anh ấy đi Bắc Kinh rồi.)', 'C. 他很高。(Anh ấy rất cao.)'],
                correct_answer: 'A. 认识，他是我的同学。(Quen, anh ấy là bạn học của tôi.)',
                explanation: 'Hỏi "认识吗" -> trả lời xác nhận quen biết "认识...".'
              }
            ]
          },
          {
            id: 'hsk1-02-r-p4',
            part_number: 4,
            title: 'Phần 4 (Câu 36 - 40)',
            instructions: 'Điền từ ngữ phù hợp vào chỗ trống câu văn.',
            sort_order: 4,
            questions: [
              {
                question_number: 36,
                prompt: 'Điền từ vào chỗ trống: 今天是星期天，学校_____人。',
                reading_text: '今天是星期天，学校_____人。Jīntiān shì xīngqītiān, xuéxiào _____ rén.',
                pinyin: 'xuéxiào _____ rén.',
                options: ['A. 没 (không có)', 'B. 不 (chẳng)', 'C. 很 (rất)'],
                correct_answer: 'A. 没 (không có)',
                explanation: '"没有人" nghĩa là không có người.'
              },
              {
                question_number: 37,
                prompt: 'Điền từ vào chỗ trống: 我想去商店买一_____衣服。',
                reading_text: '我想去商店买一_____衣服。Wǒ xiǎng qù shāngdiàn mǎi yì _____ yīfu.',
                pinyin: 'mǎi yì _____ yīfu.',
                options: ['A. 件 (chiếc - lượng từ áo)', 'B. 本 (quyển)', 'C. 个 (cái)'],
                correct_answer: 'A. 件 (chiếc - lượng từ áo)',
                explanation: 'Lượng từ của quần áo "衣服" là "件" (jiàn).'
              },
              {
                question_number: 38,
                prompt: 'Điền từ vào chỗ trống: 请问，火车站怎么_____？',
                reading_text: '请问，火车站怎么_____？Qǐngwèn, huǒchēzhàn zěnme _____?',
                pinyin: 'huǒchēzhàn zěnme _____?',
                options: ['A. 走 (đi)', 'B. 听 (nghe)', 'C. 看 (xem)'],
                correct_answer: 'A. 走 (đi)',
                explanation: 'Hỏi đường đi đến địa điểm dùng cấu trúc "怎么走" (đi thế nào).'
              },
              {
                question_number: 39,
                prompt: 'Điền từ vào chỗ trống: 这里的苹果真_____，我很喜欢吃。',
                reading_text: '这里的苹果真_____，我很喜欢吃。Zhèlǐ de píngguǒ zhēn _____, wǒ hěn xǐhuan chī.',
                pinyin: 'zhēn _____, wǒ hěn xǐhuan chī.',
                options: ['A. 好吃 (ngon)', 'B. 好看 (đẹp mắt)', 'C. 高 (cao)'],
                correct_answer: 'A. 好吃 (ngon)',
                explanation: 'Khen đồ ăn hoa quả ngon dùng "好吃".'
              },
              {
                question_number: 40,
                prompt: 'Điền từ vào chỗ trống: 你喜欢喝茶_____喝咖啡？',
                reading_text: '你喜欢喝茶_____喝咖啡？Nǐ xǐhuan hē chá _____ hē kāfēi?',
                pinyin: 'hē chá _____ hē kāfēi?',
                options: ['A. 还是 (hay là - câu hỏi lựa chọn)', 'B. 或者 (hoặc là - câu trần thuật)', 'C. 和 (và)'],
                correct_answer: 'A. 还是 (hay là - câu hỏi lựa chọn)',
                explanation: 'Trong câu hỏi lựa chọn giữa A hay B dùng liên từ "还是".'
              }
            ]
          }
        ]
      }
    ]
  }
];
