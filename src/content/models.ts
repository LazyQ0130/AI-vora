import { z } from "zod";
import type { Course as CatalogCourse } from "../lib/curriculum";

const text = z.string().min(1);
const anchor = text.regex(/^[a-z][a-z0-9-]*$/);
const localAsset = text.regex(
  /^\/(?:learning|downloads)\/[a-zA-Z0-9/_-]+\.(?:png|webp|jpg|py|ipynb|pdf|zip)$/,
);
export const publicationStates = [
  "planned",
  "draft",
  "pending-validation",
  "tech-verified",
  "pending-review",
  "reviewed",
  "pilot",
  "published",
  "deprecated",
] as const;
export const publicationSchema = z
  .object({
    lessonId: text.regex(/^[A-Z]+\d{3}-C\d{2}-L\d{2}$/),
    courseId: text.regex(/^[A-Z]+\d{3}$/),
    chapterId: text.regex(/^[A-Z]+\d{3}-C\d{2}$/),
    title: text,
    contentVersion: z.number().int().positive(),
    order: z.number().int().positive(),
    catalogRole: z.enum(["current", "legacy"]).default("current"),
    optionalLesson: z.boolean().default(false),
    status: z.enum(publicationStates),
    access: z.enum(["private", "preview", "public"]),
    technicalEvidence: text.optional(),
    reviewEvidence: text.optional(),
  })
  .superRefine((entry, ctx) => {
    if (
      [
        "tech-verified",
        "pending-review",
        "reviewed",
        "pilot",
        "published",
      ].includes(entry.status) &&
      !entry.technicalEvidence
    )
      ctx.addIssue({ code: "custom", message: "技术校验状态必须提供证据" });
    if (
      ["reviewed", "pilot", "published"].includes(entry.status) &&
      !entry.reviewEvidence
    )
      ctx.addIssue({ code: "custom", message: "人工审核状态必须提供审核证据" });
    if (entry.access === "public" && entry.status !== "published")
      ctx.addIssue({
        code: "custom",
        message: "只有正式发布教材可设置 public",
      });
    if (
      ![
        "tech-verified",
        "pending-review",
        "reviewed",
        "pilot",
        "published",
      ].includes(entry.status) &&
      entry.access !== "private"
    )
      ctx.addIssue({
        code: "custom",
        message: "未校验、草稿或下线教材不能公开试读",
      });
  });
export type Publication = z.infer<typeof publicationSchema>;
export function isReadable(entry: Publication) {
  return (
    (entry.access === "preview" || entry.access === "public") &&
    [
      "tech-verified",
      "pending-review",
      "reviewed",
      "pilot",
      "published",
    ].includes(entry.status) &&
    Boolean(entry.technicalEvidence) &&
    (!["reviewed", "pilot", "published"].includes(entry.status) ||
      Boolean(entry.reviewEvidence))
  );
}
export function publicationLabel(entry: Publication) {
  return entry.status === "published"
    ? "正式教材"
    : entry.status === "pilot"
      ? "试学教材"
      : entry.status === "reviewed"
        ? "试读 · 已审核"
        : "试读 · 待人工审核";
}
export function publicationNotice(entry: Publication) {
  if (entry.status === "published") return "本节教材已完成发布审核。";
  if (entry.status === "pilot")
    return "本节处于教学试学阶段，完整课程尚未正式发布。";
  if (entry.status === "reviewed")
    return "本节已完成内容审核，可先试读；完整课程尚未正式发布。";
  return "本节可试读，已进行技术校验，仍待人工内容审核。完整课程尚未正式发布。";
}
export const resourceSchema = z.object({
  id: anchor,
  title: text,
  href: localAsset,
  format: z.enum(["Python", "Notebook", "PDF", "ZIP"]),
  description: text,
});
export type LearningResource = z.infer<typeof resourceSchema>;
export const learningLinkSchema = z.object({
  title: text,
  href: text.refine(
    (value) => /^https:\/\//.test(value) || /^\/(courses|learn)\//.test(value),
  ),
  note: text,
});
const quizSchema = z
  .object({
    type: z.literal("quiz"),
    id: anchor,
    question: text,
    options: z.array(text).min(2).max(8),
    correct: z.number().int().nonnegative(),
    explanations: z.array(text),
  })
  .superRefine((quiz, ctx) => {
    if (
      quiz.correct >= quiz.options.length ||
      quiz.options.length !== quiz.explanations.length
    )
      ctx.addIssue({
        code: "custom",
        message: "测验需要有效答案与每个选项的解析",
      });
  });
export const contentBlockSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("ai-task-figure"),
    kind: z.enum(["mail-flow", "mail-outcomes", "method-hierarchy", "method-and-task", "knowledge-trace", "generation-map", "supervised-flow", "borrowing-groups", "self-supervised-flow", "reinforcement-flow", "features-target-flow"]),
    alt: text,
    caption: text,
  }),
  z.object({ type: z.literal("vector-figure"), kind: z.enum(["meaning", "components", "addition", "scaling"]) }),
  z.object({ type: z.literal("paragraph"), text }),
  z.object({ type: z.literal("heading"), text }),
  z
    .object({
      type: z.literal("table"),
      caption: text,
      columns: z.array(text).min(1),
      rows: z.array(z.array(text)).min(1),
    })
    .superRefine((table, ctx) => {
      if (table.rows.some((row) => row.length !== table.columns.length))
        ctx.addIssue({ code: "custom", message: "表格每行必须与列数一致" });
    }),
  z.object({
    type: z.literal("reading-links"),
    title: text,
    links: z.array(learningLinkSchema).min(1),
  }),
  z.object({
    type: z.literal("exercise"),
    id: anchor,
    title: text,
    kind: z.enum(["理解", "计算", "代码", "迁移", "实验"]),
    prompt: text,
    hints: z.array(text).min(2),
    solution: z.array(text).min(1),
    rubric: z.array(text).min(1),
  }),
  z.object({
    type: z.literal("image"),
    src: localAsset,
    alt: text,
    caption: text,
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    mobile: z
      .object({
        src: localAsset,
        width: z.number().int().positive(),
        height: z.number().int().positive(),
      })
      .optional(),
  }),
  z.object({ type: z.literal("math"), latex: text, explanation: text }),
  z.object({
    type: z.literal("code"),
    code: text,
    filename: text,
    language: z.enum(["python", "javascript", "bash", "json", "text"]),
  }),
  z.object({ type: z.literal("callout"), title: text, text }),
  quizSchema,
  z.object({
    type: z.literal("downloads"),
    resourceIds: z.array(anchor).min(1),
  }),
  z.object({
    type: z.literal("diagram"),
    kind: z.literal("linear-regression"),
    caption: text,
  }),
  z.object({
    type: z.literal("experiment"),
    kind: z.literal("linear-regression"),
  }),
  z.object({ type: z.literal("summary"), points: z.array(text).min(1) }),
]);
export type ContentBlock = z.infer<typeof contentBlockSchema>;
export const lessonSchema = z
  .object({
    id: text.regex(/^[A-Z]+\d{3}-C\d{2}-L\d{2}$/),
    courseId: text,
    chapterId: text,
    contentVersion: z.number().int().positive(),
    title: text,
    subtitle: text,
    learningTime: z.object({
      reading: z.tuple([z.number().int().nonnegative(), z.number().int().nonnegative()]),
      practice: z.tuple([z.number().int().nonnegative(), z.number().int().nonnegative()]),
      coding: z.tuple([z.number().int().nonnegative(), z.number().int().nonnegative()]),
      basis: z.literal("editorial-estimate"),
    }).superRefine((time, ctx) => {
      for (const key of ["reading", "practice", "coding"] as const)
        if (time[key][0] > time[key][1]) ctx.addIssue({ code: "custom", message: "预计时间区间顺序错误" });
    }),
    optionalLesson: z.boolean().default(false),
    assessmentMap: z.array(z.object({
      objective: z.number().int().positive(),
      exerciseIds: z.array(anchor).min(1),
    })).min(1),
    prerequisites: text,
    prerequisiteLinks: z.array(learningLinkSchema).default([]),
    legacyAnchors: z.array(z.object({ id: anchor, title: text, note: text, href: text.regex(/^\/learn\/[A-Z]+\d{3}\/[A-Z]+\d{3}-C\d{2}-L\d{2}#[a-z][a-z0-9-]*$/) })).optional(),
    objectives: z.array(text).min(2).max(4),
    // 展示文案绑定正式目标原文；原文改变后必须重新审核，不能静默沿用。
    objectiveDisplay: z.array(z.object({
      objective: text,
      title: text.max(18),
      description: text.max(48),
    })).max(4).optional(),
    sections: z
      .array(
        z.object({
          id: anchor,
          title: text,
          navGroup: anchor,
          navLabel: text,
          tier: z.enum(["core", "advanced", "verification"]).default("core"),
          layout: z.enum(["stack", "intro"]).optional(),
          blocks: z.array(contentBlockSchema).min(1),
        }),
      )
      .min(1),
    resources: z.array(resourceSchema),
    references: z
      .array(
        z.object({
          title: text,
          href: z.url().refine((url) => url.startsWith("https://")),
          note: text,
        }),
      )
      .min(1),
  })
  .superRefine((lesson, ctx) => {
    const unique = (ids: string[], name: string) => {
      if (new Set(ids).size !== ids.length)
        ctx.addIssue({ code: "custom", message: `${name}不能重复` });
    };
    unique(
      lesson.sections.map((s) => s.id),
      "段落 ID",
    );
    unique(
      lesson.resources.map((r) => r.id),
      "资源 ID",
    );
    const blocks = lesson.sections.flatMap((s) => s.blocks);
    const currentAnchors = [...lesson.sections.map(s => s.id), ...blocks.filter(b => b.type === "exercise").map(b => `exercise-${b.id}`)];
    unique([...currentAnchors, ...(lesson.legacyAnchors ?? []).map(a => a.id)], "正文与兼容锚点");
    unique((lesson.objectiveDisplay ?? []).map((entry) => entry.objective), "目标展示绑定");
    for (const entry of lesson.objectiveDisplay ?? []) {
      if (!lesson.objectives.includes(entry.objective))
        ctx.addIssue({ code: "custom", message: "目标展示文案必须绑定现行正式目标原文" });
    }
    unique(lesson.assessmentMap.map((row) => String(row.objective)), "目标映射");
    for (let objective = 1; objective <= lesson.objectives.length; objective++)
      if (!lesson.assessmentMap.some((row) => row.objective === objective))
        ctx.addIssue({ code: "custom", message: `目标 ${objective} 缺少练习` });
    for (const row of lesson.assessmentMap) {
      if (row.objective > lesson.objectives.length)
        ctx.addIssue({ code: "custom", message: "映射引用未知目标" });
      for (const id of row.exerciseIds) {
        const section = lesson.sections.find((section) => section.blocks.some((b) => b.type === "exercise" && b.id === id));
        if (!section || (!lesson.optionalLesson && section.tier !== "core"))
          ctx.addIssue({ code: "custom", message: `必学目标必须对应核心开放练习：${id}` });
      }
    }
    unique(
      blocks.filter((b) => b.type === "quiz").map((b) => b.id),
      "题目 ID",
    );
    unique(
      blocks.filter((b) => b.type === "exercise").map((b) => b.id),
      "开放练习 ID",
    );
    for (const block of blocks)
      if (
        block.type === "downloads" &&
        block.resourceIds.some(
          (id) => !lesson.resources.some((r) => r.id === id),
        )
      )
        ctx.addIssue({ code: "custom", message: "下载组件引用未知资源" });
    const groups = new Map<string, string>();
    for (const section of lesson.sections) {
      if (
        groups.has(section.navGroup) &&
        groups.get(section.navGroup) !== section.navLabel
      )
        ctx.addIssue({ code: "custom", message: "同一导航分组需要一致的名称" });
      groups.set(section.navGroup, section.navLabel);
    }
  });
export type Lesson = z.infer<typeof lessonSchema>;
export type Chapter = {
  id: string;
  courseId: string;
  order: number;
  title: string;
  lessons: DirectoryLesson[];
};
export type DirectoryLesson = Publication & {
  displayNumber: string;
  href?: string;
};
export type Course = Omit<CatalogCourse, "chapters"> & {
  chapters: Chapter[];
  legacyLessons: Publication[];
};
export type LessonSummary = Publication & {
  href: string;
  courseName: string;
  level: string;
  displayNumber?: string;
  sectionTitles: { id: string; title: string }[];
};
