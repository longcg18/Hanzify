const OFFICIAL_EXAM_ID = /^official-hsk(\d+)-(\d+)$/i;

export function getOfficialExamIdentity(examOrId) {
  const id = typeof examOrId === 'string' ? examOrId : examOrId?.id;
  const match = String(id || '').match(OFFICIAL_EXAM_ID);
  if (!match) return null;
  return { level: Number(match[1]), number: Number(match[2]) };
}

export function getStudentExamTitle(examOrId, fallback = 'Đề thi HSK') {
  const identity = getOfficialExamIdentity(examOrId);
  if (identity) return `HSK ${identity.level} · Đề số ${identity.number}`;
  const legacyCode = String(fallback || '').match(/H([1-6])\d{3}(\d)/i);
  if (legacyCode) return `HSK ${legacyCode[1]} · Đề số ${Number(legacyCode[2])}`;
  return String(fallback || 'Đề thi HSK')
    .replace(/\s*[—-]\s*đề gốc\s*/gi, ' ')
    .replace(/đề gốc\s*(CTI)?/gi, 'Đề thi')
    .trim();
}

export function getStudentPaperUrl(exam) {
  const identity = getOfficialExamIdentity(exam);
  return identity ? `/exam-papers/hsk${identity.level}-de-${identity.number}.pdf` : exam?.sourcePdfUrl;
}
