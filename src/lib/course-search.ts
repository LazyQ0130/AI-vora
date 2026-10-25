export const COURSE_SEARCH_ID = "course-search";

// Called only by browser event handlers; preserve the current filters and query.
export function focusCourseSearch() {
  const input = document.getElementById(COURSE_SEARCH_ID);
  if (!(input instanceof HTMLInputElement)) return false;
  input.focus();
  input.select();
  return true;
}
