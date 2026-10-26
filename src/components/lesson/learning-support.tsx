import type { Lesson } from "@/content/models";
import { glossary } from "@/content/glossary";
import { useId } from "react";
import { ArrowUpRight, BookOpen, Check, ChevronDown, Target } from "lucide-react";
import { lessonExerciseLinks } from "@/lib/lesson-exercises";

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
  const primaryExercises = lesson.optionalLesson ? exercises : core;
  const optionalSections = lesson.sections.filter((section) => section.tier !== "core");
  const percent = Math.round(Math.min(100, Math.max(0, progress)));
  const exerciseLink = (exercise: typeof exercises[number]) => <a className="learning-exercise-card" href={`#exercise-${exercise.id}`} onClick={(event) => {
    event.preventDefault(); onNavigate(`exercise-${exercise.id}`);
  }}>
    <span className="learning-exercise-copy"><span className="learning-exercise-kind">{exercise.kind}练习</span><span className="learning-exercise-title">{exercise.title}</span></span>
    <ArrowUpRight size={16} aria-hidden="true" />
  </a>;
  return <div className="learning-panel">
    <section aria-labelledby={`${id}-goals`}>
      <div className="learning-panel-heading"><h3 id={`${id}-goals`} tabIndex={-1}><Target size={16} aria-hidden="true" />本节学习目标</h3><span>{lesson.objectives.length} 项</span></div>
      {lesson.optionalLesson && <p className="learning-panel-note">本节整体可选，不计基础达标。</p>}
      <ol className="learning-panel-goals">{lesson.objectives.map((objective, index) => {
        const display = lesson.objectiveDisplay?.find((entry) => entry.objective === objective);
        return <li key={objective}>
          <span className="learning-goal-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <div>{display ? <><strong>{display.title}</strong><p>{display.description}</p></> : <p className="learning-goal-original">{objective}</p>}</div>
        </li>;
      })}</ol>
      {!!lesson.objectiveDisplay?.length && <details className="learning-panel-full-goals">
        <summary>查看完整目标<ChevronDown size={13} aria-hidden="true" /></summary>
        <ol>{lesson.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ol>
      </details>}
    </section>
    <section aria-labelledby={`${id}-practice`}>
      <div className="learning-panel-heading"><h3 id={`${id}-practice`}>{lesson.optionalLesson ? "可选挑战" : "核心练习"}</h3><span>{primaryExercises.length} 道</span></div>
      <ul className="learning-panel-exercises">{primaryExercises.map((exercise) => <li key={exercise.id}>
        {exerciseLink(exercise)}
      </li>)}</ul>
      <p className="learning-panel-note">自主核对 · 不自动评分</p>
      {!lesson.optionalLesson && optionalSections.length > 0 && <details className="learning-panel-optional">
        <summary>可选拓展与验证<ChevronDown size={14} aria-hidden="true" /></summary>
        {optionalSections.map((section) => <div key={section.id}>
          <span className="learning-exercise-kind">{section.tier === "verification" ? "可选验证" : "可选进阶"}</span>
          <a className="learning-panel-link" href={`#${section.id}`} onClick={(event) => { event.preventDefault(); onNavigate(section.id); }}>{section.title}<ArrowUpRight size={14} aria-hidden="true" /></a>
          <ul>{exercises.filter((exercise) => section.blocks.some((block) => block.type === "exercise" && block.id === exercise.id)).map((exercise) => <li key={exercise.id}>{exerciseLink(exercise)}</li>)}</ul>
        </div>)}
      </details>}
    </section>
    <section className="learning-panel-reading" aria-labelledby={`${id}-progress`}>
      <div className="learning-panel-heading"><h3 id={`${id}-progress`}>阅读进度</h3><span>仅当前浏览器</span></div>
      <p className="learning-reading-status"><span>已浏览 <strong>{percent}%</strong></span><span aria-hidden="true">·</span><span>{completed && <Check size={13} aria-hidden="true" />}{completed ? "已手动标记读完" : "尚未标记读完"}</span></p>
      <div className="learning-reading-track" role="progressbar" aria-label="本节已浏览比例" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><span style={{ width: `${percent}%` }} /></div>
      <p className="learning-panel-note">浏览比例不代表练习完成或掌握程度。</p>
    </section>
    <details className="learning-panel-prerequisites">
      <summary><span><BookOpen size={15} aria-hidden="true" />先修知识</span><ChevronDown size={15} aria-hidden="true" /></summary>
      <p>{lesson.prerequisites}</p>
      {lesson.prerequisiteLinks.length > 0 && <ul className="learning-prerequisite-links">{lesson.prerequisiteLinks.map((link) => <li key={link.href}>
        <a className="learning-panel-link" href={link.href} target={link.href.startsWith("https://") ? "_blank" : undefined} rel={link.href.startsWith("https://") ? "noreferrer" : undefined}>{link.title}<ArrowUpRight size={14} aria-hidden="true" /></a>
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
