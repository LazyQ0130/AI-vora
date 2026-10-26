import type { Lesson } from "@/content/models";
import { glossary } from "@/content/glossary";

export function LearningTime({ time, optional }: { time: Lesson["learningTime"]; optional: boolean }) {
  const range = ([min,max]: [number,number]) => `${min}–${max} 分钟`;
  return <div className="learning-time" aria-label="分项预计学习时间">
    <span>预计阅读 <b>{range(time.reading)}</b></span>
    <span>预计练习 <b>{range(time.practice)}</b></span>
    <span>预计代码实践 <b>{range(time.coding)}</b></span>
    <small>编辑估计，尚未经过目标学生试学校准。{optional ? "本节整体可选。" : "以上仅估计核心活动，可选进阶另需时间。"}</small>
  </div>;
}

export function ObjectiveAssessment({ lesson }: { lesson: Lesson }) {
  const exercises = lesson.sections.flatMap((s) => s.blocks).filter((b) => b.type === "exercise");
  return <section className="objective-assessment" aria-labelledby="assessment-title">
    <h2 id="assessment-title">{lesson.optionalLesson ? "可选目标与挑战" : "核心必学 · 目标与达标练习"}</h2>
    <p>{lesson.prerequisites}</p>
    <ol>{lesson.assessmentMap.map((row) => <li key={row.objective}>
      <strong>{lesson.objectives[row.objective-1]}</strong>
      <span>{row.exerciseIds.map((id) => <a key={id} href={`#exercise-${id}`}>{exercises.find((e) => e.id === id)?.title}</a>)}</span>
    </li>)}</ol>
    <p className="assessment-note">先独立作答，再查看两级提示、参考答案与自查标准。开放练习不自动评分；已读记录不等于掌握。</p>
  </section>;
}

export function Glossary() {
  return <details className="lesson-glossary" id="glossary">
    <summary>共享术语速查 · 输入、误差、损失与泛化</summary>
    <p>线性回归统一约定：error = prediction - target。误差、损失与独立数据表现分别判断。</p>
    <dl>{glossary.map((entry) => <div key={entry.id} id={`term-${entry.id}`}><dt>{entry.term}</dt><dd>{entry.definition}</dd></div>)}</dl>
  </details>;
}
