"use client";
import type { Lesson } from "@/content/models";
import { ChevronDown, ListTree } from "lucide-react";
export function ArticleContents({ lesson, active, onNavigate, collapsible = false }: {
  lesson: Lesson; active: string; onNavigate: (id: string) => void; collapsible?: boolean;
}) {
  const contents = <nav aria-label="文章目录">{lesson.sections.map((section) => <a key={section.id} href={`#${section.id}`} className={active === section.id ? "active" : ""} aria-current={active === section.id ? "location" : undefined} onClick={(event) => { event.preventDefault(); onNavigate(section.id); }}>
      {section.title}{section.tier !== "core" && !section.title.startsWith("可选") && <small>可选</small>}
    </a>)}</nav>;
  if (collapsible) return <details className="reader-outline-panel article-contents">
    <summary><ListTree size={16} aria-hidden="true" />文章目录<span className="article-contents-count">{lesson.sections.length} 节点</span><ChevronDown size={14} aria-hidden="true" /></summary>
    {contents}
  </details>;
  return <div className="reader-outline-panel article-contents">
    <h3><ListTree size={16} />文章目录</h3>
    <p>本篇的学习步骤</p>
    {contents}
  </div>;
}
