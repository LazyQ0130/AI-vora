import { getCourse } from "./curriculum";
import { courseDisplayNames } from "./course-labels";

// Short, learner-facing names. Internal identifiers remain in data and URLs.

export function getCourseDisplayName(id: string) {
  return courseDisplayNames[id] ?? getCourse(id)?.name ?? id;
}

/** Preserve chapter ranges and dependency conditions while resolving IDs. */
export function formatCourseReferences(text: string) {
  return text.replace(/\b[A-Z]{2,3}\d{3}\b/g, (id) =>
    getCourse(id) ? `《${getCourseDisplayName(id)}》` : id,
  );
}
