import type { Lesson, Publication } from "../../src/content/models";
import { isReadable } from "../../src/content/models";
import { lessonRegistry as currentRegistry, getLearningCourse as currentCourse, getAdjacentLessons } from "../../src/lib/course-engine";
import { publicationManifest as currentManifest } from "../../src/content/publication-manifest";
import { courseOutline as currentOutline } from "../../src/content/course-outline";
import { beforeApprovedPy101Object, isApprovedPy101Addition, approvedPy101Additions as allAdditions } from "../../scripts/py101-p1-compatibility";

// A changed addition remains visible. Hiding requires BOTH whole objects to match approved hashes.
export function historicalPy101View(baseline: string) {
  const historicalLesson = (lesson: Lesson) => beforeApprovedPy101Object("lessons", lesson.id, lesson, baseline) as Lesson;
  const hidden = (id: string) => isApprovedPy101Addition(id, currentRegistry.get(id), currentManifest.find(p => p.lessonId === id), baseline);
  const lessonRegistry = new Map([...currentRegistry].filter(([id]) => !hidden(id)).map(([id, lesson]) => [id, historicalLesson(lesson)]));
  const publicationManifest = currentManifest.filter(p => !hidden(p.lessonId)).map(p => beforeApprovedPy101Object("publications", p.lessonId, p, baseline) as Publication);
  function getLearningCourse(id: string) {
    const course = currentCourse(id); if (!course) return course;
    return { ...course, chapters: course.chapters.map(c => ({ ...c, lessons: c.lessons.filter(l => !hidden(l.lessonId)).map(l => ({ ...l, ...publicationManifest.find(p => p.lessonId === l.lessonId) })) })) };
  }
  function resolveLesson(courseId: string, lessonId: string) {
    const publication = publicationManifest.find(p => p.courseId === courseId && p.lessonId === lessonId);
    const course = getLearningCourse(courseId), lesson = lessonRegistry.get(lessonId), chapter = course?.chapters.find(c => c.id === publication?.chapterId);
    return publication && isReadable(publication) && course && chapter && lesson ? { publication, course, chapter, lesson } : undefined;
  }
  const courseOutline = currentOutline.filter(l => !hidden(l.lessonId));
  const approvedPy101Additions = allAdditions.filter(id => !hidden(id));
  return { historicalLesson, lessonRegistry, publicationManifest, getLearningCourse, getAdjacentLessons, resolveLesson, courseOutline, approvedPy101Additions };
}
