import { courses, getCourse } from "./curriculum";
import { linearRegressionLesson } from "../content/lessons/linear-regression";
import { pythonFunctionsLesson } from "../content/lessons/python-functions";
import { vectorMatrixLesson } from "../content/lessons/vector-matrix";
import {
  publicationManifest,
  readablePublications,
  lessonHref,
} from "../content/publication-manifest";
import {
  isReadable,
  type Chapter,
  type Course,
  type Lesson,
  type LessonSummary,
  type Publication,
} from "../content/models";

const contents: Lesson[] = [
  linearRegressionLesson,
  pythonFunctionsLesson,
  vectorMatrixLesson,
];
export const lessonRegistry: ReadonlyMap<string, Lesson> = new Map(
  contents.map((lesson) => [lesson.id, lesson]),
);

export function validateRegistry(
  entries: Publication[],
  lessons: readonly Lesson[],
) {
  if (new Set(entries.map((e) => e.lessonId)).size !== entries.length)
    throw new Error("发布清单课时 ID 重复");
  if (new Set(lessons.map((e) => e.id)).size !== lessons.length)
    throw new Error("内容课时 ID 重复");
  if (
    new Set(entries.map((e) => `${e.chapterId}:${e.order}`)).size !==
    entries.length
  )
    throw new Error("同章课时顺序重复");
  for (const entry of entries) {
    const catalog = getCourse(entry.courseId);
    const chapterIndex = catalog?.chapters.findIndex(
      (_, index) =>
        `${catalog.id}-C${String(index + 1).padStart(2, "0")}` ===
        entry.chapterId,
    );
    if (
      !catalog ||
      chapterIndex === undefined ||
      chapterIndex < 0 ||
      !entry.lessonId.startsWith(`${entry.chapterId}-L`)
    )
      throw new Error(`发布清单引用无效课程或章节：${entry.lessonId}`);
    const lesson = lessons.find((l) => l.id === entry.lessonId);
    if (!lesson) throw new Error(`缺少教材：${entry.lessonId}`);
    for (const key of [
      "courseId",
      "chapterId",
      "title",
      "contentVersion",
    ] as const)
      if (lesson[key] !== entry[key])
        throw new Error(`教材与清单不一致：${entry.lessonId}.${key}`);
  }
  for (const lesson of lessons)
    if (!entries.some((e) => e.lessonId === lesson.id))
      throw new Error(`教材未登记：${lesson.id}`);
}
validateRegistry(publicationManifest, contents);

export function getLearningCourse(courseId: string): Course | undefined {
  const catalog = getCourse(courseId);
  if (!catalog) return undefined;
  const chapters: Chapter[] = catalog.chapters.map((title, index) => {
    const id = `${courseId}-C${String(index + 1).padStart(2, "0")}`;
    return {
      id,
      courseId,
      order: index + 1,
      title: title.replace(/^\d+\s+/, ""),
      lessons: readablePublications
        .filter((e) => e.chapterId === id)
        .sort((a, b) => a.order - b.order),
    };
  });
  return { ...catalog, chapters };
}
export function resolveLesson(courseId: string, lessonId: string) {
  const publication = publicationManifest.find(
    (e) => e.courseId === courseId && e.lessonId === lessonId,
  );
  if (!publication || !isReadable(publication)) return undefined;
  const course = getLearningCourse(courseId);
  const lesson = lessonRegistry.get(lessonId);
  const chapter = course?.chapters.find((c) => c.id === publication.chapterId);
  return course && lesson && chapter
    ? { course, chapter, lesson, publication }
    : undefined;
}
export function getAdjacentLessons(course: Course, lessonId: string) {
  const lessons = course.chapters.flatMap((c) => c.lessons).filter(isReadable);
  const index = lessons.findIndex((l) => l.lessonId === lessonId);
  if (index < 0) return {};
  return { previous: lessons[index - 1], next: lessons[index + 1] };
}
export const lessonSummaries: LessonSummary[] = readablePublications.map(
  (entry) => ({
    ...entry,
    href: lessonHref(entry),
    courseName: getCourse(entry.courseId)!.name,
    level: getCourse(entry.courseId)!.lvl,
    sectionTitles: lessonRegistry
      .get(entry.lessonId)!
      .sections.map(({ id, title }) => ({ id, title })),
  }),
);
export const learningCourses = courses.map((c) => getLearningCourse(c.id)!);
