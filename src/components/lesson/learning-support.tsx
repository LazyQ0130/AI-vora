import type { Lesson } from "@/content/models";
import { glossary } from "@/content/glossary";
import { useId } from "react";
import { BookOpen, ChevronDown, Target } from "lucide-react";
import { lessonExerciseLinks } from "@/lib/lesson-exercises";
import { ProgressRing } from "./blocks";

export function LearningTime({ time, optional, codingOptional = false }: { time: Lesson["learningTime"]; optional: boolean; codingOptional?: boolean }) {
  const range = ([min,max]: [number,number]) => max === 0 ? "本节不安排" : `${min}–${max} 分钟`;
  return <div className="learning-time" aria-label="分项预计学习时间">
    <span>预计阅读 <b>{range(time.reading)}</b></span>
    <span>预计练习 <b>{range(time.practice)}</b></span>
    {time.coding[1] > 0 && <span>{codingOptional ? "可选代码实践" : "预计代码实践"} <b>{range(time.coding)}</b></span>}
    <small>编辑估计，待目标学生试学校准。{optional ? "本节整体可选。" : codingOptional ? "代码可跳过，挑战另需时间。" : "可选进阶另需时间。"}</small>
  </div>;
}

export function LearningPanel({ lesson, progress, completed, onNavigate }: {
  lesson: Lesson; progress: number; completed: boolean; onNavigate: (id: string) => void;
}) {
  const id = useId();
  const exercises = lessonExerciseLinks(lesson);
  const core = exercises.filter((exercise) => exercise.tier === "core" && exercise.objectives.length > 0);
  const optionalSections = lesson.sections.filter((section) => section.tier !== "core");
  const exerciseLink = (exercise: typeof exercises[number]) => <a href={`#exercise-${exercise.id}`} onClick={(event) => {
    event.preventDefault(); onNavigate(`exercise-${exercise.id}`);
  }}>{exercise.title}</a>;
  return <div className="learning-panel">
    <section aria-labelledby={`${id}-goals`}>
      <h3 id={`${id}-goals`} tabIndex={-1}><Target size={16} />本节学习目标</h3>
      {lesson.optionalLesson && <p className="learning-panel-note">本节整体可选，不计基础达标。</p>}
      <ol className="learning-panel-goals">{lesson.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ol>
    </section>
    <section aria-labelledby={`${id}-practice`}>
      <h3 id={`${id}-practice`}>{lesson.optionalLesson ? "可选挑战" : "达标练习"}</h3>
      <ul className="learning-panel-exercises">{(lesson.optionalLesson ? exercises : core).map((exercise) => <li key={exercise.id}>
        {exerciseLink(exercise)}
        {exercise.objectives.length > 0 && <span>对应目标 {exercise.objectives.join("、")}</span>}
      </li>)}</ul>
      <p className="learning-panel-note">先独立作答，再按需查看提示和解答。开放题供自查，不自动评分。</p>
      {!lesson.optionalLesson && optionalSections.length > 0 && <details className="learning-panel-optional">
        <summary>可选拓展与验证</summary>
        {optionalSections.map((section) => <div key={section.id}>
          <span>{section.tier === "verification" ? "可选验证" : "可选进阶"}</span>
          <a href={`#${section.id}`} onClick={(event) => { event.preventDefault(); onNavigate(section.id); }}>{section.title}</a>
          <ul>{exercises.filter((exercise) => section.blocks.some((block) => block.type === "exercise" && block.id === exercise.id)).map((exercise) => <li key={exercise.id}>{exerciseLink(exercise)}</li>)}</ul>
        </div>)}
      </details>}
    </section>
    <section aria-labelledby={`${id}-progress`}>
      <h3 id={`${id}-progress`}>本节阅读进度</h3>
      <div className="reader-progress">
        <ProgressRing value={progress} />
        <div><strong>{completed ? "已手动标记读完" : "尚未标记读完"}</strong><span>阅读比例不代表掌握程度</span></div>
      </div>
      <p className="learning-panel-note">记录仅保存在当前浏览器，不跨设备同步。</p>
    </section>
    <details className="learning-panel-prerequisites">
      <summary><span><BookOpen size={15} />先修知识</span><ChevronDown size={15} /></summary>
      <p>{lesson.prerequisites}</p>
      {lesson.prerequisiteLinks.length > 0 && <ul className="reader-prereq-links">{lesson.prerequisiteLinks.map((link) => <li key={link.href}>
        <a href={link.href} target={link.href.startsWith("https://") ? "_blank" : undefined} rel={link.href.startsWith("https://") ? "noreferrer" : undefined}>{link.title}</a>
        <p>{link.note}</p>
      </li>)}</ul>}
    </details>
  </div>;
}

export function Glossary() {
  return <details className="lesson-glossary" id="glossary">
    <summary>共享术语速查 · 输入、误差、损失与泛化</summary>
    <p>线性回归统一约定：error = prediction - target。误差、损失与独立数据表现分别判断。</p>
    <dl>{glossary.map((entry) => <div key={entry.id} id={`term-${entry.id}`}><dt>{entry.term}</dt><dd>{entry.definition}</dd></div>)}</dl>
  </details>;
}
