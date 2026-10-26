import type { Metadata } from "next";
import "./globals.css";
import "./visual-v2.css";
import "./usability.css";
import "./course-covers-v5.css";
import "./reader.css";
import "./learning-system.css";
import "./teaching-v2-1.css";
import "./teaching-v2-2.css";
import { Header, Footer } from "@/components/site-shell";
import { Providers } from "@/components/ui";

export const metadata: Metadata = {
  title: {
    default: "Aivora · 让 AI 知识，成为可掌握的未来",
    template: "%s · Aivora",
  },
  description:
    "系统化 AI 技术学习平台。以图文、数学、代码和项目，构建从基础认知到工程研究的知识路径。课程正在筹备，可先阅读试读样章。",
  icons: { icon: "/brand/aivora-mark.svg" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <Providers>
          <a className="skip-link" href="#main-content">
            跳到主要内容
          </a>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
