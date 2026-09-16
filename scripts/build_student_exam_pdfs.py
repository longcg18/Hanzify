"""Build student-facing HSK papers without transcripts or answer pages.

The published CTI sample PDFs include answer keys at the end. Keep only the
question pages, preserving the original pictures and layout byte-for-byte at
the page-content level. Run this when the source papers change.
"""

from io import BytesIO
from pathlib import Path
from urllib.request import urlopen

from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas


SOURCES = (
    ("H10901", 1, 1, 9, 14),
    ("H10902", 1, 2, 9, 14),
    ("H20901", 2, 1, 12, 18),
    ("H20902", 2, 2, 12, 18),
    ("H31001", 3, 1, 13, 22),
    ("H31002", 3, 2, 13, 22),
)

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "public" / "exam-papers"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

for code, level, exam_number, question_page_count, source_page_count in SOURCES:
    legacy_question_paper = OUTPUT_DIR / f"{code}.pdf"
    if legacy_question_paper.exists():
        source = PdfReader(legacy_question_paper)
        if len(source.pages) != question_page_count:
            raise ValueError(f"{code}: legacy question paper page count mismatch")
        page_indexes = range(question_page_count)
    else:
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
        page_indexes = range(1, question_page_count + 1)

    writer = PdfWriter()
    for output_page_number, page_index in enumerate(page_indexes, start=1):
        page = source.pages[page_index]
        width = float(page.mediabox.width)
        height = float(page.mediabox.height)
        overlay_bytes = BytesIO()
        overlay = canvas.Canvas(overlay_bytes, pagesize=(width, height))
        overlay.setFillColorRGB(1, 1, 1)
        overlay.rect(0, 0, width, 76, fill=1, stroke=0)
        overlay.setFillColorRGB(0.25, 0.25, 0.25)
        overlay.setFont("Helvetica", 8)
        overlay.drawCentredString(width / 2, 24, str(output_page_number))
        overlay.save()
        overlay_bytes.seek(0)
        page.merge_page(PdfReader(overlay_bytes).pages[0], over=True)
        writer.add_page(page)
    writer.add_metadata({"/Title": f"HSK {level} - De so {exam_number}"})
    output = OUTPUT_DIR / f"hsk{level}-de-{exam_number}.pdf"
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
