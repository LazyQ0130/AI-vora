"use client";
import Link from "next/link";
import { RotateCcw, TriangleAlert } from "lucide-react";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container page-container">
      <div className="empty-state error-state">
        <TriangleAlert size={35} />
        <h1>这一页暂时未能载入</h1>
        <p>请重试，或返回课程目录继续探索。</p>
        <div>
          <button className="button button-primary" onClick={reset}>
            <RotateCcw size={16} />
            重新尝试
          </button>
          <Link href="/courses" className="button button-secondary">
            返回课程目录
          </Link>
        </div>
      </div>
    </div>
  );
}
