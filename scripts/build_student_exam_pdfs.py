"""Build student-facing HSK papers without transcripts or answer pages.

The published CTI sample PDFs include answer keys at the end. Keep only the
question pages, preserving the original pictures and layout byte-for-byte at
the page-content level. Run this when the source papers change.
"""

from io import BytesIO
from pathlib import Path
from urllib.request import urlopen

from pypdf import PdfReader, PdfWriter


SOURCES = (
    ("H10901", 1, 9, 14),
    ("H10902", 1, 9, 14),
    ("H20901", 2, 12, 18),
    ("H20902", 2, 12, 18),
    ("H31001", 3, 13, 22),
    ("H31002", 3, 13, 22),
)

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "public" / "exam-papers"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

for code, level, question_page_count, source_page_count in SOURCES:
    url = f"https://www.chinesetest.cn/userfiles/file/HSK/level{level}/{code}.pdf"
    with urlopen(url, timeout=60) as response:
        source_bytes = response.read()
    source = PdfReader(BytesIO(source_bytes))
    if len(source.pages) != source_page_count:
        raise ValueError(f"{code}: expected {source_page_count} source pages, got {len(source.pages)}")
    last_question = source.pages[question_page_count].extract_text() or ""
    first_excluded = source.pages[question_page_count + 1].extract_text() or ""
    if "听力材料" in last_question or "听力材料" not in first_excluded:
        raise ValueError(f"{code}: question/transcript boundary changed; refusing to publish")

    writer = PdfWriter()
    for page_index in range(1, question_page_count + 1):
        writer.add_page(source.pages[page_index])
    writer.add_metadata({"/Title": f"HSK {level} {code} - student question paper"})
    output = OUTPUT_DIR / f"{code}.pdf"
    with output.open("wb") as stream:
        writer.write(stream)

    student = PdfReader(output)
    if len(student.pages) != question_page_count:
        raise ValueError(f"{code}: output page count mismatch")
    for page in student.pages:
        text = page.extract_text() or ""
        if "卷答案" in text or "听力材料" in text:
            raise ValueError(f"{code}: restricted content remains in output")
    print(f"{code}: {len(student.pages)} question pages -> {output.relative_to(ROOT)}")
