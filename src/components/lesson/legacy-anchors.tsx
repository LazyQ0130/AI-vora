import type { Lesson } from "@/content/models";

export function LegacyAnchors({ lesson }: { lesson: Lesson }) {
  if (!lesson.legacyAnchors?.length) return null;
  return <aside className="lesson-reading-links" aria-label="旧版书签与内容去向">
    <details><summary>旧版书签与内容去向</summary>
      {lesson.legacyAnchors.map(anchor => <section id={anchor.id} key={anchor.id}>
        <h3 tabIndex={-1}>{anchor.title}</h3><p>{anchor.note}</p><a href={anchor.href}>前往现在的完整讲解与练习</a>
      </section>)}
    </details>
  </aside>;
}
