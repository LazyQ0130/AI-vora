import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight, Clock3, BookOpen } from "lucide-react";
import { type Course, getCoursePreview } from "@/lib/curriculum";
import { getCourseCover } from "@/lib/artwork";
import { formatCourseReferences } from "@/lib/course-presentation";

export function CourseArt({
  course,
  compact = false,
}: {
  course: Course;
  compact?: boolean;
}) {
  const cover = getCourseCover(course.id);
  return (
    <div
      className={`course-art course-raster-art art-${course.lvl} ${compact ? "art-compact" : ""}`}
    >
      <Image
        className="course-cover"
        src={cover.src}
        alt={cover.alt}
        style={
          compact
            ? { objectPosition: cover.compactPosition ?? "50% 50%" }
            : undefined
        }
        fill
        unoptimized
        sizes={
          compact
            ? "80px"
            : "(max-width: 700px) 100vw, (max-width: 980px) 45vw, 30vw"
        }
      />
      <div className="course-art-shade" />
    </div>
  );
}
export function CourseCard({
  course,
  featured = false,
}: {
  course: Course;
  featured?: boolean;
}) {
  const preview = getCoursePreview(course.id);
  return (
    <article
      className={`course-card ${featured ? "featured-course-card" : ""} ${preview ? "has-preview" : ""}`}
    >
      <CourseArt course={course} />
      <div className="course-card-body">
        <div className="card-meta">
          <span className={`level level-${course.lvl}`}>
            {course.lvl} · {course.direction}
          </span>
          <span className="planned">
            <i />
            规划中
          </span>
        </div>
        <h3>
          <Link className="course-title-link" href={`/courses/${course.id}`}>
            {course.name}
          </Link>
        </h3>
        <p className="course-goal">{course.goal}</p>
        <div className="card-facts">
          <span>
            <BookOpen size={13} />
            {course.chapters.length} 章规划
          </span>
          <span>
            <Clock3 size={13} />
            预计 {course.hours} 小时
          </span>
        </div>
        <div className="course-prereq">
          先修：{formatCourseReferences(course.req)}
        </div>
        {preview && (
          <Link href={preview.href} className="course-preview-link">
            <BookOpen size={15} />
            <span>
              含可阅读样章
              <small>
                {preview.displayNumber ? `${preview.displayNumber} ` : ""}
                {preview.title}
              </small>
            </span>
            <ArrowRight size={16} />
          </Link>
        )}
        <span className="card-arrow">
          <ArrowUpRight size={17} />
        </span>
      </div>
    </article>
  );
}
