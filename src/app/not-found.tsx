import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
export default function NotFound() {
  return (
    <div className="container not-found">
      <span className="eyebrow">A DIFFERENT PATH AWAITS</span>
      <div className="not-found-number">
        4<Compass strokeWidth={0.7} />4
      </div>
      <h1>这里，还没有被探索。</h1>
      <p>页面或课程单元不存在，回到知识地图，重新找到你的方向。</p>
      <div>
        <Link href="/" className="button button-primary">
          返回首页
          <ArrowRight size={16} />
        </Link>
        <Link href="/courses" className="button button-secondary">
          探索课程体系
        </Link>
      </div>
    </div>
  );
}
