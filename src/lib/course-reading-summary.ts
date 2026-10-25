import type { LessonSummary } from "../content/models";
import type { ReadingProgress } from "./learning-progress";
export function summarizeCourseReading(
  lessons: LessonSummary[],
  records: { lesson: LessonSummary; progress: ReadingProgress }[],
) {
  const current = lessons.filter((lesson) => lesson.catalogRole !== "legacy");
  return [...new Set(current.map((lesson) => lesson.courseId))].map(
    (courseId) => {
      const available = current.filter(
        (lesson) => lesson.courseId === courseId,
      );
      const visited = records.filter(
        (record) =>
          record.lesson.courseId === courseId &&
          record.lesson.catalogRole !== "legacy",
      );
      return {
        courseId,
        name: available[0].courseName,
        available: available.length,
        completed: visited.filter((record) => record.progress.completed).length,
        percent: Math.round(
          visited.reduce((sum, record) => sum + record.progress.percent, 0) /
            available.length,
        ),
      };
    },
  );
}
