// Public sample papers from Chinese Testing International. Answer keys are
// transcribed from the final page of each linked paper, in question order.
const letters = (value) => value.replace(/\s+/g, '').split('');

export const officialExamSources = [
  {
    id: 'official-hsk1-01', code: 'H10901', level: 'HSK 1', duration: 35,
    answerGroups: ['√×××√', 'AACAC', 'DBAEF', 'BBC CB'.replace(/ /g, ''), '√√××√', 'DFCAB', 'CDABE', 'FBEAC'],
  },
  {
    id: 'official-hsk1-02', code: 'H10902', level: 'HSK 1', duration: 35,
    answerGroups: ['×××√√', 'BACAB', 'EFDBA', 'CACCB', '×√×√√', 'ABCDF', 'CEBDA', 'BEAFC'],
  },
  {
    id: 'official-hsk2-01', code: 'H20901', level: 'HSK 2', duration: 50,
    answerGroups: ['×√××√√×√×√', 'FACEBBECAD', 'CBAC AAB BCC'.replace(/ /g, ''), 'AABBC', 'FECBA', 'DBACF', '√××√×', 'CBFAD DCEBA'.replace(/ /g, '')],
  },
  {
    id: 'official-hsk2-02', code: 'H20902', level: 'HSK 2', duration: 50,
    answerGroups: ['×√×√√√××√×', 'CBFAEEDBCA', 'CABBBAABBC', 'ACCCA', 'EAFCB', 'DFBCA', '√××√×', 'DABFC BE CDA'.replace(/ /g, '')],
  },
  {
    id: 'official-hsk3-01', code: 'H31001', level: 'HSK 3', duration: 85,
    answerGroups: ['BCEFABC ADE'.replace(/ /g, ''), '×√×√√×√√××', 'BCCCBCAA BC'.replace(/ /g, ''), 'BBBCA CACAA'.replace(/ /g, ''), 'CBADFBDEAC', 'FDCBAAB EFC'.replace(/ /g, ''), 'AACBBAABAB'],
    writing: ['弟弟高兴地笑了。', '上午的考试比较简单。', '这个城市的环境变得越来越好了。', '那位医生送给他一个礼物。', '其他班的成绩也有很大提高。', '出', '元', '叫', '中', '米'],
  },
  {
    id: 'official-hsk3-02', code: 'H31002', level: 'HSK 3', duration: 85,
    answerGroups: ['CAFEBCBADE', '×√√××√×√×√', 'BACABCCBBA', 'CCC AABACCB'.replace(/ /g, ''), 'ACDFBBEACD', 'ADFCBEC BFA'.replace(/ /g, ''), 'AAB AABCBBC'.replace(/ /g, '')],
    writing: ['我们先看看菜单。', '她忘了带护照。', '这些葡萄很新鲜。', '熊猫的眼睛和耳朵都是黑色的。', '你敢不敢用冷水洗澡？', '人', '太', '个', '云', '文'],
  },
].map((source) => {
  const levelNumber = Number(source.level.slice(-1));
  const pdfUrl = `https://www.chinesetest.cn/userfiles/file/HSK/level${levelNumber}/${source.code}.pdf`;
  const audioUrl = `https://www.tuttocina.it/tuttocina/lingua/${source.code}.mp3`;
  const answers = source.answerGroups.flatMap(letters).concat(source.writing || []);
  const expected = levelNumber === 1 ? 40 : levelNumber === 2 ? 60 : 80;
  if (answers.length !== expected) throw new Error(`${source.code}: ${answers.length} answers, expected ${expected}`);
  return { ...source, pdfUrl, audioUrl, answers };
});

export const officialExamById = Object.fromEntries(officialExamSources.map((source) => [source.id, source]));
