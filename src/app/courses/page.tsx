import { Suspense } from "react";
import { Catalog } from "@/components/catalog";
export const metadata = { title: "课程体系" };
export default function CoursesPage() {
  return (
    <Suspense
      fallback={
        <div className="container page-container" role="status">
          正在载入课程目录…
        </div>
      }
    >
      <Catalog />
    </Suspense>
  );
}
