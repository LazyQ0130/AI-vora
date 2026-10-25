"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, FlaskConical, Search } from "lucide-react";
import { courses, levels, levelNames } from "@/lib/curriculum";
import { EmptyState } from "./ui";
export function Projects() {
  const [level, setLevel] = useState("all");
  const results = courses.filter(
    (course) => level === "all" || course.lvl === level,
  );
  return (
    <div className="container page-container">
      <div className="page-intro">
        <span className="eyebrow">TURN KNOWLEDGE INTO SOMETHING REAL</span>
        <h1>在实践中，让知识生根。</h1>
        <p>从问题定义到实验分析，用可复现的作品验证理解。</p>
        <span className="subtle-tag">
          源自课程体系的 {courses.length} 项项目规划
        </span>
      </div>
      <div className="info-inline">
        <FlaskConical size={18} />
        <p>
          项目仍在规划中，完整实验资料尚未开放。可先在《线性回归与梯度下降》样章页下载示例代码，在自己的电脑上练习。
        </p>
      </div>
      <div className="project-toolbar">
        <span>按课程等级探索</span>
        <select
          aria-label="项目课程等级"
          value={level}
          onChange={(event) => setLevel(event.target.value)}
        >
          <option value="all">全部等级</option>
          {levels.map((item, index) => (
            <option key={item} value={item}>{item} · {levelNames[index]}</option>
          ))}
        </select>
        <span role="status">{results.length} 项规划</span>
      </div>
      <div className="project-grid">
        {results.map((course) => (
          <Link
            href={`/courses/${course.id}`}
            className="project-card"
            key={course.id}
          >
            <div className="card-meta">
              <span className={`level level-${course.lvl}`}>
                {course.lvl} · {course.direction}
              </span>
              <span className="planned">
                <i />
                规划中
              </span>
            </div>
            <h2>{course.project.replace(/[《》]/g, "")}</h2>
            <p>{course.labs}</p>
            <div className="project-evidence">
              <span>完成目标</span>
              <p>{course.accept}</p>
            </div>
            <div className="project-course">
              {course.name}
              <ArrowUpRight size={15} />
            </div>
          </Link>
        ))}
      </div>
      {!results.length && (
        <EmptyState
          icon={<Search size={26} />}
          title="暂无匹配项目"
          description="请尝试其他等级。"
        />
      )}
    </div>
  );
}
