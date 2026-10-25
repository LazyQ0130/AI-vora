import { z } from "zod";
import source from "../../curriculum/AI技术课程目录_V1.0.json";
import { courseDisplayNames } from "./course-labels";
import { lessonHref } from "../content/publication-manifest";
import { getCourseDirectory } from "./course-directory";
import { chapterNumber } from "./course-numbering";

const schema = z.object({
  id: z.string().regex(/^[A-Z]+\d{3}$/),
  lvl: z.enum(["L0", "L1", "L2", "L3", "L4", "L5"]),
  name: z.string().min(1),
  hours: z.string().regex(/^\d+–\d+$/),
  req: z.string().min(1),
  goal: z.string().min(1),
  chapters: z.array(z.string().min(1)).min(1),
  labs: z.string().min(1),
  project: z.string().min(1),
  accept: z.string().min(1),
  priority: z.string().regex(/^P[0-5]$/),
});
export type CourseStatus =
  | "planned"
  | "draft"
  | "tech-verified"
  | "reviewed"
  | "pilot"
  | "published"
  | "deprecated";
export const directions = [
  "全部方向",
  "AI 认知",
  "编程与数据",
  "数学基础",
  "机器学习",
  "深度学习",
  "专业方向",
  "工程与研究",
] as const;
export const levels = ["L0", "L1", "L2", "L3", "L4", "L5"] as const;
export const levelNames = [
  "AI 认知",
  "基础能力",
  "机器学习",
  "深度学习",
  "专业方向",
  "工程与研究",
];
function direction(id: string) {
  if (id.startsWith("AI")) return "AI 认知";
  if (/^(PY|DS)/.test(id)) return "编程与数据";
  if (/^(MA|ST)/.test(id)) return "数学基础";
  if (id.startsWith("ML")) return "机器学习";
  if (id.startsWith("DL")) return "深度学习";
  if (/^(SYS|RES)/.test(id)) return "工程与研究";
  return "专业方向";
}
export const courses = z
  .array(schema)
  .parse(source.courses)
  .map((course) => ({
    ...course,
    status: "planned" as CourseStatus,
    direction: direction(course.id),
  }));
if (new Set(courses.map((c) => c.id)).size !== courses.length)
  throw new Error("课程 ID 重复");
export type Course = (typeof courses)[number];
export const getCourse = (id: string) =>
  courses.find((course) => course.id === id);
export function filterCourses(
  query: string,
  level = "all",
  category = "全部方向",
) {
  const normalize = (value: string) =>
    value.toLocaleLowerCase().replace(/[\s、，,：:《》·]/g, "");
  const term = normalize(query);
  return courses.filter(
    (course) =>
      (level === "all" || course.lvl === level) &&
      (category === "全部方向" || course.direction === category) &&
      normalize(
        `${course.name} ${course.id} ${course.goal} ${courseDisplayNames[course.id] ?? ""} ${getCourseIndexRows(
          course,
        )
          .map((row) => `${row.displayNumber ?? ""} ${row.title}`)
          .join(" ")}`,
      ).includes(term),
  );
}
export const firstRelease = courses.filter((c) => c.priority === "P0");
export const SAMPLE_URL = "/learn/ML201/ML201-C03-L01";
export function getCourseIndexRows(course: Course) {
  const directory = getCourseDirectory(course);
  return [
    ...directory.chapters.flatMap((chapter) =>
      chapter.lessons.map((entry) => ({
        ...entry,
        chapterLabel: chapterNumber(chapter.order),
        courseName: course.name,
      })),
    ),
    ...directory.legacyLessons.map((entry) => ({
      ...entry,
      displayNumber: undefined,
      href: lessonHref(entry),
      chapterLabel: "旧版综合试读",
      courseName: course.name,
    })),
  ];
}
export function findLessonEntries(
  query: string,
  level = "all",
  category = "全部方向",
) {
  const normalize = (value: string) =>
    value.toLocaleLowerCase().replace(/[\s、，,：:《》·]/g, "");
  const term = normalize(query);
  if (!term) return [];
  return courses
    .filter(
      (c) =>
        (level === "all" || c.lvl === level) &&
        (category === "全部方向" || c.direction === category),
    )
    .flatMap(getCourseIndexRows)
    .filter((row) =>
      normalize(
        `${row.displayNumber ?? ""} ${row.title} ${row.courseName}`,
      ).includes(term),
    )
    .sort((a, b) => Number(Boolean(b.href)) - Number(Boolean(a.href)));
}
export const coursePreviews: Readonly<
  Partial<
    Record<string, { href: string; title: string; displayNumber?: string }>
  >
> = Object.fromEntries(
  courses.flatMap((course) => {
    const rows = getCourseIndexRows(course);
    const first =
      rows.find((row) => row.catalogRole !== "legacy" && row.href) ??
      rows.find((row) => row.href);
    return first?.href
      ? [
          [
            course.id,
            {
              href: first.href,
              title: first.title,
              displayNumber: first.displayNumber,
            },
          ],
        ]
      : [];
  }),
);
export const getCoursePreview = (id: string) => coursePreviews[id];
