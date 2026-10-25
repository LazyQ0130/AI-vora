"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowDown,
  ArrowUpRight,
  GitBranch,
  Check,
  Info,
} from "lucide-react";
import { learningPaths, branches } from "@/lib/paths";
import { getCourse, getCoursePreview } from "@/lib/curriculum";
import { formatCourseReferences } from "@/lib/course-presentation";
import { Reveal } from "./ui";
function Node({ id }: { id: string }) {
  const course = getCourse(id)!;
  const preview = getCoursePreview(id);
  return (
    <div className={`path-node ${preview ? "has-preview" : ""}`}>
    <Link href={`/courses/${id}`} className={`path-course level-${course.lvl}`}>
      <span>
        {course.direction}
        <small>{course.lvl}</small>
      </span>
      <h3>{course.name}</h3>
      <span className="path-course-footer">
        查看课程
        <ArrowUpRight size={14} />
      </span>
    </Link>
    {preview && <Link href={preview.href} className="path-preview-link">{preview.displayNumber ? `${preview.displayNumber} ` : ""}试读 · 开始阅读<ArrowRight size={14}/></Link>}
    </div>
  );
}
export function PathsExplorer() {
  const [selected, setSelected] = useState(0);
  const path = learningPaths[selected];
  return (
    <div className="container page-container">
      <div className="page-intro">
        <span className="eyebrow">YOUR FOUNDATION. YOUR DIRECTION.</span>
        <h1>从你的起点，走向新的可能。</h1>
        <p>用先修能力连接知识，找到清晰、适合自己的学习顺序。</p>
        <span className="subtle-tag">课程筹备中 · 编程、数学与机器学习样章可试读</span>
      </div>
      <div className="path-selector" role="tablist" aria-label="选择已有基础">
        {learningPaths.map((item, i) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={i === selected}
            aria-controls="path-panel"
            id={`path-tab-${i}`}
            tabIndex={selected === i ? 0 : -1}
            onKeyDown={(event) => {
              if (
                ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
              ) {
                event.preventDefault();
                const next =
                  event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? 2
                      : (selected + (event.key === "ArrowRight" ? 1 : 2)) % 3;
                setSelected(next);
                document.getElementById(`path-tab-${next}`)?.focus();
              }
            }}
            className={i === selected ? "selected" : ""}
            onClick={() => setSelected(i)}
          >
            <span className="path-index">0{i + 1}</span>
            <span>
              {item.name}
              <small>{item.label}</small>
            </span>
            {selected === i && <Check size={17} />}
          </button>
        ))}
      </div>
      <div
        className="path-panel"
        id="path-panel"
        role="tabpanel"
        aria-labelledby={`path-tab-${selected}`}
      >
        <div className="path-panel-heading">
          <div>
            <span className="eyebrow">RECOMMENDED JOURNEY</span>
            <h2>{path.description}</h2>
            <p>{formatCourseReferences(path.note)}</p>
          </div>
          <GitBranch size={27} />
        </div>
        <div className="path-stages">
          {path.stages.map((stage, i) => (
            <Reveal
              key={`${path.id}-${i}`}
              className="path-stage"
              delay={Math.min(i * 0.025, 0.15)}
            >
              <span className="stage-dot">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="stage-courses">
                <span className="stage-label">阶段 {String(i + 1).padStart(2, "0")}{stage.length > 1 && " · 同阶段课程"}</span>
                {stage.map((id) => (
                  <Node key={id} id={id} />
                ))}
              </div>
              {i < path.stages.length - 1 && (
                <ArrowDown size={16} className="stage-arrow" />
              )}
            </Reveal>
          ))}
        </div>
      </div>
      <section className="detail-section">
        <span className="eyebrow">CHOOSE YOUR NEXT HORIZON</span>
        <h2>共同基础之后，向感兴趣的方向深入。</h2>
        <div className="branch-grid">
          {branches.map((branch) => (
            <article key={branch.name} className="branch-panel">
              <h3>
                {branch.name}
                <GitBranch size={17} />
              </h3>
              <div className="branch-courses">
                {branch.ids.map((id) => (
                  <Node key={id} id={id} />
                ))}
              </div>
              <p>{formatCourseReferences(branch.note)}</p>
            </article>
          ))}
        </div>
        <div className="research-branch">
          <span>
            <GitBranch size={20} />
            进一步走向工程与研究
          </span>
          <div>
            <Link href="/courses/SYS501">
              MLOps 与部署
              <ArrowUpRight size={14} />
            </Link>
            <Link href="/courses/RES501">
              论文复现
              <ArrowUpRight size={14} />
            </Link>
          </div>
          <p>MLOps 与部署：{formatCourseReferences(getCourse("SYS501")!.req)}</p>
          <p>论文复现：{formatCourseReferences(getCourse("RES501")!.req)}</p>
        </div>
      </section>
      <div className="info-inline">
        <Info size={18} />
        <p>
          课程正在筹备中，部分节点提供可阅读样章。路径用于帮助选择学习顺序，可根据已有基础调整起点，并查看各课程的具体先修要求。
        </p>
      </div>
      <div className="path-end">
        <Link href="/courses" className="button button-secondary">
          探索完整课程体系
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
