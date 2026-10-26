"use client";
import type { Lesson } from "@/content/models";
import { ListTree } from "lucide-react";
export function ArticleContents({ lesson, active, onNavigate }: {
  lesson: Lesson; active: string; onNavigate: (id: string) => void;
}) {
  return <div className="reader-outline-panel article-contents">
    <h3><ListTree size={16} />文章目录</h3>
    <p>本篇的学习步骤</p>
    <nav aria-label="文章目录">{lesson.sections.map((section, index) => <a key={section.id} href={`#${section.id}`} className={active === section.id ? "active" : ""} aria-current={active === section.id ? "location" : undefined} onClick={(event) => { event.preventDefault(); onNavigate(section.id); }}>
      <span>{index+1}</span>{section.title}{section.tier !== "core" && !section.title.startsWith("可选") && <small>可选</small>}
    </a>)}</nav>
  </div>;
}
