"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowRight,
  SearchX,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import {
  courses,
  directions,
  filterCourses,
  levels,
  levelNames,
  coursePreviews,
  findLessonEntries,
} from "@/lib/curriculum";
import { CourseCard } from "./course-card";
import { Drawer, EmptyState } from "./ui";
import { COURSE_SEARCH_ID, focusCourseSearch } from "@/lib/course-search";

export function Catalog() {
  const params = useSearchParams();
  const router = useRouter();
  const query = params.get("q") ?? "";
  const level = levels.includes(params.get("level") as (typeof levels)[number])
    ? params.get("level")!
    : "all";
  const category = directions.includes(
    params.get("direction") as (typeof directions)[number],
  )
    ? params.get("direction")!
    : "全部方向";
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (params.get("focus") !== "search") return;
    focusCourseSearch();
    const next = new URLSearchParams(window.location.search);
    next.delete("focus");
    window.history.replaceState(
      null,
      "",
      `/courses${next.size ? `?${next}` : ""}`,
    );
  }, [params]);
  const results = useMemo(
    () => filterCourses(query, level, category),
    [query, level, category],
  );
  const lessonResults = useMemo(
    () => findLessonEntries(query, level, category),
    [query, level, category],
  );
  function update(key: string, value: string) {
    const next = new URLSearchParams(window.location.search);
    if (!value || value === "all" || value === "全部方向") next.delete(key);
    else next.set(key, value);
    window.history.replaceState(
      null,
      "",
      `/courses${next.size ? `?${next}` : ""}`,
    );
  }
  const filters = (
    <div className="filter-content">
      <div className="filter-title">
        课程方向<span>{courses.length}</span>
      </div>
      {directions.map((direction) => (
        <button
          key={direction}
          className={`direction-option ${category === direction ? "selected" : ""}`}
          aria-pressed={category === direction}
          onClick={() => update("direction", direction)}
        >
          {direction}
          <span>
            {direction === "全部方向"
              ? courses.length
              : courses.filter((c) => c.direction === direction).length}
          </span>
        </button>
      ))}
      <div className="sidebar-note">
        <span className="eyebrow">LEARNING, YOUR WAY</span>
        <h3>不知道从哪开始？</h3>
        <p>按已有基础，找到自己的起点。</p>
        <Link href="/paths" className="text-link">
          查看学习路径
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
  return (
    <div className="container page-container">
      <div className="page-intro">
        <span className="eyebrow">EXPLORE THE KNOWLEDGE UNIVERSE</span>
        <h1>连接知识，构建能力。</h1>
        <p>从基础认知到前沿探索，找到适合你的下一步。</p>
        <span className="subtle-tag">
          <i className="status-dot" />
          课程筹备中 · 可先体验试读样章
        </span>
      </div>
      <div className="catalog-sample catalog-previews">
        <span className="catalog-preview-heading">
          <BookIcon />
          先体验一次完整的图文学习
          <span className="catalog-sample-caption">
            选择一节样章 · 内容待人工审核
          </span>
        </span>
        <div className="catalog-preview-choices">
          {Object.values(coursePreviews).map(
            (preview) =>
              preview && (
                <Link key={preview.href} href={preview.href}>
                  {preview.displayNumber ? `${preview.displayNumber} ` : ""}
                  {preview.title}
                  <ArrowRight size={15} />
                </Link>
              ),
          )}
        </div>
      </div>
      <div className="catalog-layout">
        <aside className="catalog-sidebar" aria-label="方向筛选">
          {filters}
        </aside>
        <div className="catalog-main">
          <div className="catalog-toolbar">
            <div className="search-field">
              <Search size={17} />
              <input
                id={COURSE_SEARCH_ID}
                type="search"
                aria-label="搜索课程"
                placeholder="搜索课程名称或知识点…"
                value={query}
                onChange={(event) => update("q", event.target.value)}
              />
              {query && (
                <button
                  aria-label="清空搜索"
                  className="search-clear"
                  onClick={() => update("q", "")}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <Drawer
              open={open}
              onOpenChange={setOpen}
              title="筛选课程方向"
              trigger={
                <button className="button button-secondary filter-toggle">
                  <SlidersHorizontal size={16} />
                  筛选
                </button>
              }
            >
              {filters}
              <button
                className="button button-primary drawer-apply"
                onClick={() => setOpen(false)}
              >
                查看 {results.length} 门课程
              </button>
            </Drawer>
          </div>
          <div className="level-filter" aria-label="课程等级">
            <button
              aria-pressed={level === "all"}
              className={level === "all" ? "active" : ""}
              onClick={() => update("level", "all")}
            >
              全部等级
            </button>
            {levels.map((item, i) => (
              <button
                key={item}
                className={level === item ? "active" : ""}
                aria-pressed={level === item}
                onClick={() => update("level", item)}
              >
                {item}
                <span>{levelNames[i]}</span>
              </button>
            ))}
          </div>
          {lessonResults.length > 0 && (
            <section
              className="lesson-search-results"
              aria-label="课时搜索结果"
            >
              <h2>
                匹配的课时 <span>{lessonResults.length}</span>
              </h2>
              {lessonResults.map((entry) => (
                <div key={entry.lessonId} className="lesson-search-row">
                  <small>
                    {entry.courseName} · {entry.chapterLabel}
                  </small>
                  {entry.href ? (
                    <Link href={entry.href}>
                      {entry.displayNumber ? `${entry.displayNumber} ` : ""}
                      {entry.title}
                      <ArrowRight size={15} />
                    </Link>
                  ) : (
                    <p>
                      {entry.displayNumber} {entry.title}
                      <span>筹备中</span>
                    </p>
                  )}
                </div>
              ))}
            </section>
          )}
          <div className="results-label">
            <span role="status" aria-live="polite">
              找到 <strong>{results.length}</strong> 门规划课程
            </span>
            <span>按课程体系顺序排列</span>
          </div>
          {results.length ? (
            <div className="catalog-grid">
              {results.map((course) => (
                <CourseCard course={course} key={course.id} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<SearchX size={32} />}
              title="暂时没有匹配的课程"
              description="换一个关键词，或重置等级与方向后再试试。"
            >
              <button
                className="button button-secondary"
                onClick={() => router.replace("/courses", { scroll: false })}
              >
                重置全部筛选
              </button>
            </EmptyState>
          )}
          <p className="section-footnote">预计学时包含阅读、练习与项目实践。</p>
        </div>
      </div>
    </div>
  );
}
function BookIcon() {
  return <BookOpen size={19} />;
}
