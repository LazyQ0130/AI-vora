import type { Lesson } from "@/content/models";
import { LessonHeading } from "./blocks";
import { ContentRenderer } from "./content-renderer";

export function TeachingSection({ section, resources }: {
  section: Lesson["sections"][number]; resources: Lesson["resources"];
}) {
  const body = <div className={section.layout === "intro" ? "lesson-intro-grid" : "lesson-section-body"}>
    {section.blocks.map((block, index) => <div className={`lesson-block lesson-block-${block.type}`} key={index}>
      <ContentRenderer block={block} resources={resources} />
    </div>)}
  </div>;
  return <section className={`lesson-section lesson-tier-${section.tier}`} id={section.id}>
    <LessonHeading>{section.title}</LessonHeading>
    {section.tier === "core" ? body : <details className="lesson-optional">
      <summary>{section.tier === "verification" ? "可选代码验证" : "可选进阶"} · 展开阅读（不计基础达标）</summary>
      {body}
    </details>}
  </section>;
}
