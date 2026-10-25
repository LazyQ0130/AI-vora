"use client";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  HardDrive,
  CheckCircle2,
  History,
  Route,
  ArrowUpRight,
} from "lucide-react";
import { useLocalProgress } from "@/lib/use-progress";
import { SAMPLE_URL } from "@/lib/curriculum";
import { sampleLesson } from "@/content/sample";
import { ProgressRing } from "./lesson/blocks";
import { EmptyState, Reveal } from "./ui";

export function Dashboard() {
  const progress = useLocalProgress();
  const nextUrl = progress ? `${SAMPLE_URL}#${progress.section}` : SAMPLE_URL;
  return (
    <div className="container page-container">
      <div className="page-intro">
        <span className="eyebrow">EVERY SMALL STEP COUNTS</span>
        <h1>学习，沿着自己的节奏。</h1>
        <p>让每一次理解都有记录，让下一步始终清晰。</p>
        <span className="subtle-tag">
          <HardDrive size={12} />
          阅读记录仅保存在当前浏览器
        </span>
      </div>
      <div className="dashboard-stats">
        <div>
          <BookOpen />
          <strong>
            {progress ? "1" : "0"}
            <small>节</small>
          </strong>
          <span>已开始阅读的样章</span>
        </div>
        <div>
          <CheckCircle2 />
          <strong>
            {progress?.completed ? "1" : "0"}
            <small>节</small>
          </strong>
          <span>已标记读完</span>
        </div>
      </div>
      <div className="dashboard-layout">
        <section>
          <div className="section-heading">
            <div>
              <span className="eyebrow">PICK UP WHERE YOU LEFT OFF</span>
              <h2>{progress ? "继续你的探索" : "从一次阅读开始"}</h2>
            </div>
            <BookOpen size={19} className="muted" />
          </div>
          {progress ? (
            <Reveal className="continue-card">
              <div className="continue-card-visual">
                <ProgressRing value={progress.percent} />
                <span>
                  {progress.completed ? "本节已读完" : "样章阅读进度"}
                </span>
              </div>
              <div className="continue-card-copy">
                <span className="level level-L2">试读样章 · L2 机器学习</span>
                <h3>{sampleLesson.title}</h3>
                <p>
                  当前停留：
                  {
                    sampleLesson.sections.find(
                      (section) => section.id === progress.section,
                    )?.title
                  }
                </p>
                <Link href={nextUrl} className="button button-primary">
                  {progress.completed ? "再次阅读" : "继续阅读"}
                  <ArrowRight size={15} />
                </Link>
              </div>
            </Reveal>
          ) : (
            <EmptyState
              icon={<BookOpen size={31} />}
              title="还没有阅读记录"
              description="试读线性回归与梯度下降，探索图文、公式与代码结合的学习方式。"
            >
              <Link className="button button-primary" href={SAMPLE_URL}>
                阅读样章
                <ArrowRight size={16} />
              </Link>
            </EmptyState>
          )}
          <section className="detail-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">YOUR READING HISTORY</span>
                <h2>最近阅读</h2>
              </div>
              <History size={18} className="muted" />
            </div>
            {progress ? (
              <Link href={nextUrl} className="history-row">
                <div className="history-icon">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3>{sampleLesson.title}</h3>
                  <p>
                    试读样章 ·{" "}
                    {progress.completed
                      ? "手动标记已读完"
                      : `已浏览 ${progress.percent}%`}
                  </p>
                  <time dateTime={new Date(progress.updatedAt).toISOString()}>
                    {new Intl.DateTimeFormat("zh-CN", {
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "Asia/Shanghai",
                    }).format(progress.updatedAt)}
                  </time>
                </div>
                <ArrowUpRight size={18} />
              </Link>
            ) : (
              <div className="history-empty">
                尚无记录。完成一次样章访问后，将在这里显示。
              </div>
            )}
          </section>
        </section>
        <aside className="dashboard-aside">
          <div className="panel">
            <Route size={25} />
            <span className="eyebrow">A CLEARER DIRECTION</span>
            <h3>下一步，去向哪里？</h3>
            <p>从已有基础出发，查看编程、机器学习与专业方向的推荐先修关系。</p>
            <Link href="/paths" className="text-link">
              探索学习路径
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="panel dashboard-note">
            <HardDrive size={21} />
            <h3>关于这里的记录</h3>
            <p>
              记录仅保存在当前浏览器，不跨设备同步。更换浏览器或清除站点数据后，记录可能丢失。
            </p>
            <p>
              浏览器限制保存时，记录仅在本次访问期间有效。阅读比例与读完标记用于安排学习，不代表已经掌握课程。
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
