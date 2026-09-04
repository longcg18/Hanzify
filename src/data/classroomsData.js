/**
 * Hanzify 汉字流 - Classrooms & Roster Data Model
 * Hỗ trợ quy trình mở lớp thực tế của Cô Hoài:
 * 1. Mở lớp + Chọn combo khóa học + Nhập danh sách học viên + Lên lịch học
 * 2. Sinh mã lớp học duy nhất (Unique Class Code)
 * 3. Học sinh quét/nhập mã -> Chọn đúng tên trong danh sách -> Tạo username & password đăng nhập
 */

export function generateUniqueClassCode(existingClassrooms = []) {
  const existingCodes = new Set(
    (existingClassrooms || []).map(c => (c.code || '').trim().toUpperCase())
  );
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Bỏ các ký tự dễ nhầm lẫn như 0, O, 1, I
  let code = '';
  let attempts = 0;

  do {
    let randomPart = '';
    for (let i = 0; i < 6; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Định dạng: HZ-2026-XXXXXX (14 ký tự, bảo mật, chuyên nghiệp, không trùng lặp)
    code = `HZ-2026-${randomPart}`;
    attempts++;
    if (attempts > 100) {
      code = `HZ-2026-${Date.now().toString(36).toUpperCase()}`;
      break;
    }
  } while (existingCodes.has(code));

  return code;
}

export const INITIAL_CLASSROOMS = [
  {
    id: 'class-hsk2-k01',
    code: 'HZ-2026-K02HSK',
    name: 'Lớp HSK 2 Cấp Tốc - Khóa K01',
    level: 'HSK 2',
    teacher: 'Cô Hoài',
    courseIds: ['hsk2'],
    schedule: {
      days: ['T3', 'T5', 'T7'],
      shift: 'Tối',
      timeNote: '19:30 - 21:00'
    },
    students: [
      {
        id: 'st-01',
        name: 'Nguyễn Văn An',
        username: 'student',
        isActivated: true,
        activatedAt: '2026-08-15'
      },
      {
        id: 'st-02',
        name: 'Trần Thị Mai',
        username: null,
        isActivated: false,
        activatedAt: null
      },
      {
        id: 'st-03',
        name: 'Lê Hoàng Nam',
        username: null,
        isActivated: false,
        activatedAt: null
      },
      {
        id: 'st-04',
        name: 'Phạm Minh Đức',
        username: null,
        isActivated: false,
        activatedAt: null
      },
      {
        id: 'st-05',
        name: 'Hoàng Thùy Linh',
        username: null,
        isActivated: false,
        activatedAt: null
      }
    ],
    createdAt: '2026-08-10'
  },
  {
    id: 'class-combo-h1h3-k02',
    code: 'HZ-2026-CB13X9',
    name: 'Lớp Combo Toàn Diện HSK 1 + HSK 2',
    level: 'HSK 2',
    teacher: 'Cô Hoài',
    courseIds: ['hsk1', 'hsk2'],
    schedule: {
      days: ['T2', 'T4', 'T6'],
      shift: 'Tối',
      timeNote: '20:00 - 21:30'
    },
    students: [
      {
        id: 'st-06',
        name: 'Đỗ Thị Lan',
        username: null,
        isActivated: false,
        activatedAt: null
      },
      {
        id: 'st-07',
        name: 'Vũ Quốc Huy',
        username: null,
        isActivated: false,
        activatedAt: null
      },
      {
        id: 'st-08',
        name: 'Bùi Phương Thảo',
        username: null,
        isActivated: false,
        activatedAt: null
      },
      {
        id: 'st-09',
        name: 'Ngô Gia Bảo',
        username: null,
        isActivated: false,
        activatedAt: null
      }
    ],
    createdAt: '2026-08-25'
  }
];
