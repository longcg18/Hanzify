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

export const INITIAL_CLASSROOMS = [];
