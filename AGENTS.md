# 工作区文件安全

禁止批量删除文件或目录。禁止 del /s、rd /s、rmdir /s、Remove-Item -Recurse、rm -rf。需要删除时，一次只能删除一个明确路径的文件；需要批量删除应由用户手动处理。

## 课程编写与精修

课程任务先读取 `docs/COURSE_EDITORIAL_STANDARD_V1.md`（长期教学与中文编辑标准）及 `docs/COURSE_AUTHORING.md`（工程接入与技术验收）；课程体系事实以 `curriculum/` 为准。依照 `docs/COURSE_PRODUCTION_WORKFLOW.md` 先形成课前编辑简报、事实来源和目标—练习映射，再单课起草、独立重算与技术校验。可直接使用 `docs/COURSE_GENERATION_PROMPT.md`，读取适用于当前稿件的最新审查，不用历史问题覆盖现稿。AI 辅助审读、测试通过和截图不能替代专业人工审稿或目标学生试学，缺口必须如实交接。

数学、Python、ML三类现行标杆的最近审查见 `docs/CROSS_DISCIPLINE_EDITORIAL_VALIDATION_V1.md`；`docs/COURSE_EDITORIAL_STANDARD_V1_1_PROPOSAL.md` 仅为建议稿，未替换V1.0。核心考核发生实质变化时同步内容版本与发布清单，保留旧修订记录，不继承为新版完成。

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
