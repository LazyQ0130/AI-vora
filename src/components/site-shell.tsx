"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Menu, Search, BookOpen } from "lucide-react";
import { Drawer } from "./ui";
import { SAMPLE_URL } from "@/lib/curriculum";
import { focusCourseSearch } from "@/lib/course-search";

const subscribePlatform = () => () => {};
const platformShortcut = () =>
  /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘ K" : "Ctrl K";

const nav = [
  ["/", "首页"],
  ["/courses", "课程体系"],
  ["/paths", "学习路径"],
  ["/projects", "实践项目"],
];
export function Brand() {
  return (
    <Link href="/" className="brand">
      <Image
        src="/brand/aivora-mark.svg"
        alt=""
        width={40}
        height={40}
        priority
      />
      <span>
        Aivora<small>系统化 AI 技术学习平台</small>
      </span>
    </Link>
  );
}
export function Header() {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const shortcutLabel = useSyncExternalStore(
    subscribePlatform,
    platformShortcut,
    () => "Ctrl K",
  );
  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (!focusCourseSearch()) router.push("/courses?focus=search");
      }
    }
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, [router]);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="主导航">
          {nav.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={
                (href === "/" ? path === href : path.startsWith(href))
                  ? "page"
                  : undefined
              }
            >
              {label}
              {(href === "/" ? path === href : path.startsWith(href)) && (
                <motion.span
                  className="nav-indicator"
                  layoutId="nav-indicator"
                  transition={{ duration: 0.26 }}
                />
              )}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link
            className="search-link"
            href="/courses?focus=search"
            aria-label={`探索知识 ${shortcutLabel}，搜索课程`}
            onClick={(event) => {
              if (
                !event.ctrlKey && !event.metaKey && !event.shiftKey &&
                !event.altKey && focusCourseSearch()
              ) event.preventDefault();
            }}
          >
            <Search size={17} />
            <span>探索知识</span>
            <kbd>{shortcutLabel}</kbd>
          </Link>
          <Link className="dashboard-link" href="/dashboard">
            <BookOpen size={16} />
            学习中心
          </Link>
          <Link
            href={SAMPLE_URL}
            className="button button-small button-primary"
          >
            开始试读
            <ArrowUpRight size={15} />
          </Link>
          <Drawer
            open={open}
            onOpenChange={setOpen}
            title="探索 Aivora"
            trigger={
              <button className="icon-button mobile-menu" aria-label="打开导航">
                <Menu size={21} />
              </button>
            }
          >
            <nav className="mobile-navigation" aria-label="移动导航">
              {[
                ...nav,
                ["/dashboard", "学习中心"],
                [SAMPLE_URL, "阅读样章"],
              ].map(([href, label]) => (
                <Link href={href} key={href} onClick={() => setOpen(false)}>
                  {label}
                  <ArrowUpRight size={17} />
                </Link>
              ))}
            </nav>
            <p className="muted small">课程筹备中，可先阅读试读样章。</p>
          </Drawer>
        </div>
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div>
          <Brand />
          <p>让 AI 知识，成为可掌握的未来。</p>
        </div>
        <div className="footer-links">
          <Link href="/courses">探索课程</Link>
          <Link href="/paths">学习路径</Link>
          <Link href="/projects">实践项目</Link>
          <Link href={SAMPLE_URL}>试读样章</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Aivora</span>
        <span>
          <i className="status-dot" />
          课程筹备中 · 可体验试读样章
        </span>
      </div>
    </footer>
  );
}
