import { courses, getCourse } from "./curriculum";
import { getCourseDirectory } from "./course-directory";
import { courseOutline } from "../content/course-outline";
import { linearRegressionLesson } from "../content/lessons/linear-regression";
import { foundationLessons, pythonAdvancedLesson } from "../content/lessons/foundations-v2-1";
import { regressionTaskLesson } from "../content/lessons/ml201/regression-task";
import { linearModelLesson } from "../content/lessons/ml201/linear-model";
import { lossFunctionsLesson } from "../content/lessons/ml201/loss-functions";
import { derivativeDirectionLesson } from "../content/lessons/ml201/derivative-direction";
import { mseGradientLesson } from "../content/lessons/ml201/mse-gradient";
import { manualUpdateLesson } from "../content/lessons/ml201/manual-update";
import { numpyRegressionLesson } from "../content/lessons/ml201/numpy-regression";
import { maV22Lessons } from "../content/lessons/ma101";
import { whatIsAiLesson } from "../content/lessons/ai000/what-is-ai";
import { capabilitiesLesson } from "../content/lessons/ai000/capabilities-and-errors";
import { automationLesson } from "../content/lessons/ai000/automation-and-ai";
import { generativeLesson } from "../content/lessons/ai000/generative-ai-and-llm";
import { supervisedLearningLesson } from "../content/lessons/ai000/supervised-learning";
import { unsupervisedLearningLesson } from "../content/lessons/ai000/unsupervised-learning";
import { selfSupervisedLesson } from "../content/lessons/ai000/self-supervised-learning";
import { reinforcementLearningLesson } from "../content/lessons/ai000/reinforcement-learning";
import { dataFeaturesLabelsLesson } from "../content/lessons/ai000/data-features-labels";
import { modelsAndParametersLesson } from "../content/lessons/ai000/models-and-parameters";
import { usingFixedModelLesson } from "../content/lessons/ai000/using-a-fixed-model";
import { naturalLanguageLesson } from "../content/lessons/ai000/natural-language-and-llm";
import { computerVisionLesson } from "../content/lessons/ai000/computer-vision";
import { generativeWorkLesson } from "../content/lessons/ai000/generative-work";
import { rlApplicabilityLesson } from "../content/lessons/ai000/rl-applicability";
import { unreliableAnswersLesson } from "../content/lessons/ai000/unreliable-answers";
import { responsibleUseLesson } from "../content/lessons/ai000/responsible-ai-use";
import { whyFoundationsLesson } from "../content/lessons/ai000/why-foundations";
import { directionLearningRoutesLesson } from "../content/lessons/ai000/direction-learning-routes";
import { problemAnalysisCapstoneLesson } from "../content/lessons/ai000/problem-analysis-capstone";
import { privacyFairnessLesson } from "../content/lessons/ai000/privacy-bias-fairness";
import { multimodalLesson } from "../content/lessons/ai000/multimodal-ai";
import { trainingValidationTestLesson } from "../content/lessons/ai000/training-validation-test";
import { aiMlDlLesson } from "../content/lessons/ai000/ai-ml-dl";
import { pythonFirstRunLesson } from "../content/lessons/py101/first-run";
import { pythonScriptPathsLesson } from "../content/lessons/py101/script-paths";
import { pythonEditorRerunLesson } from "../content/lessons/py101/editor-rerun";
import { pythonProjectEnvironmentsLesson } from "../content/lessons/py101/project-environments";
import { pythonNotebookCellOrderLesson } from "../content/lessons/py101/notebook-cell-order";
import { pythonEnvironmentReproductionLesson } from "../content/lessons/py101/environment-reproduction";
import { pythonVariablesAndAssignmentLesson } from "../content/lessons/py101/variables-and-assignment";
import { pythonBasicValueTypesLesson } from "../content/lessons/py101/basic-value-types";
import { pythonArithmeticExpressionsLesson } from "../content/lessons/py101/arithmetic-expressions";
import { pythonNumericComparisonsLesson } from "../content/lessons/py101/numeric-comparisons";
import { pythonInputAndConversionLesson } from "../content/lessons/py101/input-and-conversion";
import { pythonReadableOutputLesson } from "../content/lessons/py101/readable-output";
import { pythonConditionalExecutionLesson } from "../content/lessons/py101/conditional-execution";
import { pythonConditionalBranchesLesson } from "../content/lessons/py101/conditional-branches";
import {
  publicationManifest,
  readablePublications,
  lessonHref,
} from "../content/publication-manifest";
import {
  isReadable,
  type Course,
  type Lesson,
  type LessonSummary,
  type Publication,
} from "../content/models";

const contents: Lesson[] = [
  pythonConditionalBranchesLesson,
  pythonConditionalExecutionLesson,
  pythonReadableOutputLesson,
  pythonInputAndConversionLesson,
  pythonNumericComparisonsLesson,
  pythonArithmeticExpressionsLesson,
  pythonBasicValueTypesLesson,
  pythonVariablesAndAssignmentLesson,
  pythonEnvironmentReproductionLesson,
  pythonScriptPathsLesson,
  pythonEditorRerunLesson,
  pythonProjectEnvironmentsLesson,
  pythonNotebookCellOrderLesson,
  pythonFirstRunLesson,
  whatIsAiLesson,
  capabilitiesLesson,
  automationLesson,
  aiMlDlLesson,
  generativeLesson,
  supervisedLearningLesson,
  unsupervisedLearningLesson,
  selfSupervisedLesson,
  reinforcementLearningLesson,
  dataFeaturesLabelsLesson,
  modelsAndParametersLesson,
  trainingValidationTestLesson,
  usingFixedModelLesson,
  naturalLanguageLesson,
  computerVisionLesson,
  multimodalLesson,
  generativeWorkLesson,
  rlApplicabilityLesson,
  unreliableAnswersLesson,
  privacyFairnessLesson,
  responsibleUseLesson,
  whyFoundationsLesson,
  directionLearningRoutesLesson,
  problemAnalysisCapstoneLesson,
  ...maV22Lessons,
  regressionTaskLesson,
  linearModelLesson,
  lossFunctionsLesson,
  derivativeDirectionLesson,
  mseGradientLesson,
  manualUpdateLesson,
  numpyRegressionLesson,
  linearRegressionLesson,
  ...foundationLessons,
  pythonAdvancedLesson,
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
    new Set(
      entries
        .filter((e) => e.catalogRole !== "legacy")
        .map((e) => `${e.chapterId}:${e.order}`),
    ).size !== entries.filter((e) => e.catalogRole !== "legacy").length
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
    if (entry.catalogRole !== "legacy") {
      const slot = courseOutline.find((s) => s.lessonId === entry.lessonId);
      if (
        !slot ||
        slot.chapterId !== entry.chapterId ||
        slot.title !== entry.title ||
        slot.order !== entry.order
      )
        throw new Error(`教材与节级蓝图不一致：${entry.lessonId}`);
    }
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
  return getCourseDirectory(catalog);
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
  const lessons = course.chapters
    .flatMap((c) => c.lessons)
    .filter((e) => e.catalogRole !== "legacy" && isReadable(e));
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
    displayNumber: getLearningCourse(entry.courseId)
      ?.chapters.flatMap((ch) => ch.lessons)
      .find((l) => l.lessonId === entry.lessonId)?.displayNumber,
    sectionTitles: lessonRegistry
      .get(entry.lessonId)!
      .sections.map(({ id, title }) => ({ id, title })),
  }),
);
export const learningCourses = courses.map((c) => getLearningCourse(c.id)!);
