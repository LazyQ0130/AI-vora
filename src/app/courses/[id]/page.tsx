import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock3,
  Check,
  FlaskConical,
  FolderKanban,
  Info,
} from "lucide-react";
import { courses, getCourse, getCoursePreview } from "@/lib/curriculum";
import { getLearningCourse, lessonSummaries } from "@/lib/course-engine";
import { CourseContents } from "@/components/lesson/course-contents";
import { CourseArt } from "@/components/course-card";
import {
  formatCourseReferences,
  getCourseDisplayName,
} from "@/lib/course-presentation";
export const dynamicParams = false;

export function generateStaticParams() {
  return courses.map((course) => ({ id: course.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const course = getCourse((await params).id);
  return { title: course?.name ?? "课程未找到" };
}
export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const course = getCourse((await params).id);
  if (!course) notFound();
  const learningCourse = getLearningCourse(course.id)!;
  const preview = getCoursePreview(course.id);
  const prereqs = courses.filter(
    (c) => c.id !== course.id && course.req.includes(c.id),
  );
  return (
    <div className="container page-container course-detail">
      <Link className="text-link back-link" href="/courses">
        <ArrowLeft size={15} />
        返回课程体系
      </Link>
      <div className="detail-layout">
        <div>
          <div className="detail-heading">
            <div className="card-meta">
              <span className={`level level-${course.lvl}`}>
                {course.lvl} · {course.direction}
              </span>
            </div>
            <h1>{course.name}</h1>
            <p>{course.goal}</p>
            <div className="detail-facts">
              <span>
                <BookOpen size={15} />
                {course.chapters.length} 章规划
              </span>
              <span>
                <Clock3 size={15} />
                预计 {course.hours} 小时
              </span>
            </div>
          </div>
          <div className="info-inline">
            <Info size={17} />
            <p>
              本课程正在筹备，下方为章节规划。
              {preview && "目前包含可阅读样章，教材仍待人工审核。"}
            </p>
          </div>
          <section className="detail-section">
            <span className="eyebrow">LEARNING OUTCOME</span>
            <h2>学会什么，如何验证</h2>
            <div className="detail-panel">
              <Check size={20} />
              <p>{course.accept}</p>
            </div>
          </section>
          <section className="detail-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">THE COURSE BLUEPRINT</span>
                <h2>课程章节</h2>
              </div>
              <span className="muted small">
                {course.chapters.length} 章 · 规划中
              </span>
            </div>
            <CourseContents course={learningCourse} progressLessons={lessonSummaries.filter((entry) => entry.courseId === course.id)} variant="detail" />
          </section>
          <section className="detail-section">
            <span className="eyebrow">LEARN BY DOING</span>
            <h2>在实验与项目中理解</h2>
            <div className="practice-grid">
              <article className="panel">
                <FlaskConical size={23} />
                <span className="planned">规划实验</span>
                <h3>关键实验</h3>
                <p>{course.labs}</p>
              </article>
              <article className="panel">
                <FolderKanban size={23} />
                <span className="planned">规划项目</span>
                <h3>{course.project.replace(/[《》]/g, "")}</h3>
                <p>{course.accept}</p>
              </article>
            </div>
          </section>
        </div>
        <aside className="detail-side">
          <div className="detail-side-card">
            <CourseArt course={course} />
            <div className="detail-side-inner">
              <span className="planned">
                <i />
                课程规划中
              </span>
              <h3>从理解到可复现的实践</h3>
              <p>图文 · 公式 · 代码 · 小测 · 项目</p>
              {preview ? (
                <Link href={preview.href} className="button button-primary">
                  阅读样章
                  <ArrowRight size={16} />
                </Link>
              ) : (
                <Link href="/paths" className="button button-secondary">
                  查看学习路线
                  <ArrowRight size={16} />
                </Link>
              )}
              <small>课程教材尚未正式发布</small>
            </div>
          </div>
          <div className="panel prerequisite-panel">
            <span className="eyebrow">BEFORE YOU START</span>
            <h3>建议先修能力</h3>
            <p>{formatCourseReferences(course.req)}</p>
            <div className="prereq-links">
              {prereqs.map((c) => (
                <Link href={`/courses/${c.id}`} key={c.id}>
                  {getCourseDisplayName(c.id)}
                  <ArrowRight size={11} />
                </Link>
              ))}
            </div>
            <p className="small muted">
              面向所有专业与身份的学习者，按已有能力选择起点。
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
