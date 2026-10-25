function ordinal(value: number) {
  if (!Number.isSafeInteger(value) || value < 1)
    throw new RangeError("目录序号必须为正整数");
  return value;
}
export const chapterNumber = (chapter: number) => `第 ${ordinal(chapter)} 章`;
export const lessonNumber = (chapter: number, lesson: number) =>
  `${ordinal(chapter)}.${ordinal(lesson)}`;
export const sectionNumber = (
  chapter: number,
  lesson: number,
  section: number,
) => `${lessonNumber(chapter, lesson)}.${ordinal(section)}`;
export function numberedLessonTitle(entry: {
  title: string;
  displayNumber?: string;
  catalogRole?: string;
}) {
  return `${entry.catalogRole === "legacy" ? "旧版试读 · " : entry.displayNumber ? `${entry.displayNumber} ` : ""}${entry.title}`;
}
export function cleanOutlineTitle(title: string) {
  let value = title.trim();
  for (;;) {
    const next = value
      .replace(/^第\s*\d+\s*章\s*[：:、.．]?\s*/u, "")
      .replace(/^\d+(?:\.\d+)*(?:[、．:：]\s*|\.\s+|\s+)/u, "")
      .trim();
    if (next === value) return value;
    value = next;
  }
}
