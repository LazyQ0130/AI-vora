import type { Course as CatalogCourse } from "./curriculum";
import type { Course, Publication, DirectoryLesson } from "../content/models";
import { isReadable } from "../content/models";
import { courseOutline } from "../content/course-outline";
import {
  publicationManifest,
  lessonHref,
} from "../content/publication-manifest";
import { cleanOutlineTitle, lessonNumber } from "./course-numbering";

export function getCourseDirectory(catalog: CatalogCourse): Course {
  const chapters = catalog.chapters.map((title, index) => {
    const id = `${catalog.id}-C${String(index + 1).padStart(2, "0")}`;
    const lessons: DirectoryLesson[] = courseOutline
      .filter((slot) => slot.chapterId === id)
      .sort((a, b) => a.order - b.order)
      .map((slot) => {
        const entry: Publication = publicationManifest.find(
          (p) => p.lessonId === slot.lessonId && p.catalogRole !== "legacy",
        ) ?? {
          ...slot,
          contentVersion: 1,
          status: "planned",
          access: "private",
          catalogRole: "current",
          optionalLesson: false,
        };
        return {
          ...entry,
          title: cleanOutlineTitle(entry.title),
          displayNumber: lessonNumber(index + 1, slot.order),
          href: isReadable(entry) ? lessonHref(entry) : undefined,
        };
      });
    return {
      id,
      courseId: catalog.id,
      order: index + 1,
      title: cleanOutlineTitle(title),
      lessons,
    };
  });
  return {
    ...catalog,
    chapters,
    legacyLessons: publicationManifest.filter(
      (p) =>
        p.courseId === catalog.id &&
        p.catalogRole === "legacy" &&
        isReadable(p),
    ),
  };
}
