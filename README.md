# Aivora · 系统化 AI 技术学习平台

可运行、可扩展的静态课程学习系统。课程事实来自课程体系 V1.0 的原始 JSON / Markdown，20 门课程与对应项目仍为规划。当前提供 9 节现行试读教材，并保留 1 节旧综合试读，共用同一个阅读器，均已技术校验、待人工内容审核。Aivora 是品牌工作名，域名与商标尚未核验。

## 启动与检查

要求 Node.js 20.9+、npm；本机实测 Node.js 24.16.0 / npm 11.13.0。以 package-lock.json 为可复现安装依据。

```powershell
npm ci
npm run dev
```

打开 http://127.0.0.1:3000 。仅监听本机，不向公网发布。

新增课时或重构内容模块后，若长时间运行的开发进程仍显示旧目录或 404，请停止该进程再运行 npm run dev，使静态课时列表与模块缓存重新载入。生产构建会重新生成发布路径。

```powershell
npm run typecheck
npm run lint
npm test
npm run build
npm start -- --port 3001
```

教材技术检查需要额外安装本地 Python 与 NumPy（网页运行不需要 Python）：

```powershell
python -m pip install numpy
npm run prepare:downloads
npm run test:python
```

test:python 会执行全部 Python 单元测试、网页每个 Python 代码块，并核对下载脚本与 Notebook；结果写入 docs/TEACHING_V2_PYTHON_RESULTS.json，旧 COURSE_ENGINE 证据保留。本机实测 Python 3.14.2 / NumPy 2.5.2。教材面向 Python 3.10+；未声称所有解释器和 NumPy 版本均已验证。

精确教学图已作为 PNG 入库，重新生成时另需 matplotlib（本机 3.11.2）：

```powershell
python -m pip install matplotlib
npm run prepare:diagrams
npm run prepare:ml-diagrams
```

## 技术与视觉

Next.js 16.4.3（App Router）、React 19.3.1、TypeScript 5.9.3 strict、Tailwind CSS 4.3.3、Motion 12.43.0、Radix Dialog 1.3.1、Lucide 0.468.0、KaTeX 0.19.1、Prism React Renderer 2.4.1、Zod 4.6.7。此轮未添加前端依赖。

品牌保留深海军蓝、Indigo、Violet、Cyan，使用系统中英文字体。Hero 与 20 张独立课程封面是离线生成并压缩的本地 WebP；Logo 和确定性数学实验保留 SVG。教学 PNG 由精确绘图脚本产生，手机另有适合窄屏的构图。参考截图仅用于设计比对，未作为页面背景或裁剪资产。

阅读器样式集中在 reader.css；入口和学习中心规则在 learning-system.css；其余页面保留原视觉基础。动效使用既有 Motion / CSS，遵循 prefers-reduced-motion。

## 现有路由

| 路由 | 内容 |
| --- | --- |
| / | 品牌 Hero、等级路线、学习方式、课程与试读入口 |
| /courses | 20 门规划课程，关键词 / 等级 / 方向筛选，URL 可分享，Ctrl/⌘ K 聚焦搜索 |
| /courses/[id] | 原始目标、先修、章节规划、实验和项目；按清单显示真实样章入口 |
| /paths | 建议先修关系；桌面关系图，手机纵向阶段 |
| /learn/ML201/ML201-C03-L01 至 L03 | 新版 3.1–3.3：回归任务、模型与损失 |
| /learn/ML201/ML201-C04-L02 至 L05 | 新版 4.1–4.4：导数、梯度、手算与 NumPy |
| /learn/ML201/ML201-C04-L01 | 旧版综合试读，原链接 / 锚点 / 记录保留 |
| /learn/PY101/PY101-C05-L01 | Python 函数与参数 |
| /learn/MA101/MA101-C03-L01 | 向量与矩阵的基本运算 |
| /dashboard | 独立课时进度、最近阅读与各课程的可读样章统计 |
| /projects | 原始 project 字段衍生的规划项目 |
| 未知课程、课时或错误课程归属 | 品牌化 404 |

课程编码仅用于稳定数据键和地址。学员目录统一为“第 n 章 → n.m 课时 → n.m.k 独立知识单元”，展示编号与内部 ID 分离。无真实登录、支付、数据库、后台 CMS、视频、AI 助手、运行时 AI API 或在线 Python 服务，不虚构学员、评价和课程上线数据。

## 课程引擎与扩展

```text
src/content/models.ts                  Course / Chapter / Lesson / ContentBlock 与内容校验
src/content/publication-manifest.ts    静态发布清单、状态与访问权限
src/content/course-outline.ts         独立节级蓝图，不改写原章级事实
src/content/lessons/                   原创教材数据，不包含页面逻辑
src/content/resources/programs.ts      网页与下载共用的代码、资源描述
src/content/sample.ts                 原 ML 样章 DTO，保留兼容
src/lib/curriculum.ts                  V1.0 原始事实适配、搜索与入口
src/lib/course-engine.ts               章节组合、注册表、路由解析、相邻课时、轻量摘要
src/lib/course-numbering.ts            章 / 节 / 知识单元编号与显示标题清理
src/lib/course-directory.ts            节级蓝图、发布权限与原目录组合
src/lib/learning-progress.ts           v2 校验、迁移与可注入存储
src/lib/use-learning-progress.ts       浏览器订阅与 React hooks
src/lib/progress.ts / use-progress.ts  v1 兼容 API，现有测试保留
src/components/lesson/                 通用阅读器、目录、内容组件、按需加载实验
public/learning/                      精确教学图（桌面 / 手机构图）
public/downloads/                     同源 Python / Notebook
curriculum/                           用户原始课程体系，不改写事实
references/                           原始视觉参考与已有生图原图
docs/                                 实施计划、架构、验收与真实截图
```

新增课时只需编写 Lesson 数据、登记节级蓝图、内容注册表与发布清单、配置本地资源，不需要新增或修改 React 页面。支持文字、子标题、表格、图片、数学、代码、提示、测验、分层提示练习、补修链接、下载、总结及受控交互实验；不执行教材中的任意脚本。

当前真实可读内容为 9 节现行教材（ML 七节、PY/MA 各一节），另保留 1 节旧 ML 综合试读，全部为待人工审核试读。3.4、4.5、4.6 等未制作课时只显示规划，无正文链接。生成 V2 教学图运行 `npm run prepare:ml-diagrams`；生产服务启动后可运行 `npm run test:routes`（默认 3001，可设 AIVORA_BASE_URL）。

发布生命周期包括规划、草稿、待验证、技术已验证、待审核、已审核、试学、正式发布与下线。状态与访问权限分开，草稿和未验证内容保持私有，只有具备证据的内容可试读；正式发布还需人工审核证据。整门课程的规划状态不会因一节样章改变。详细流程、校验要求和新增组件方法见 [课程编写指南](docs/COURSE_AUTHORING.md)。

## 阅读记录与兼容

新键为 aivora:learning:v2:<courseId>:<lessonId>:r<contentVersion>。按课程、课时与教材修订分别记录最高浏览比例、当前段落、读完标记和时间。旧版记录保留在历史中，课程完成率只统计现行可读教材；旧样章读完不会变成新版七节读完。浏览比例、手动读完和测验反馈各自独立，均不代表掌握程度。开放练习输入只在当前页面暂存，离开页面不保存。

旧 aivora:learning:v1 仅兼容迁移至原 ML 样章 r1。合法 v2 优先，迁移幂等；不删除旧键，迁移也不会自动覆盖已有但无法识别的 v2。内容升级使用新修订键，保留旧记录；写入失败时按键保留会话内存。更换浏览器、设备或清理站点数据不会同步恢复。

## 验收记录

最新结果：[教材 V2 与分层目录验收](docs/TEACHING_V2_ACCEPTANCE.md)、[分阶段计划](docs/TEACHING_V2_PLAN.md)、[逐节质量与来源审查](docs/TEACHING_V2_CONTENT_REVIEW.md)、[Python 执行证据](docs/TEACHING_V2_PYTHON_RESULTS.json)、[真实浏览器验收](docs/TEACHING_V2_BROWSER_RESULTS.json)。

历史记录：[通用课程引擎](docs/COURSE_ENGINE_ACCEPTANCE.md)、[前端基础验收](docs/FRONTEND_ACCEPTANCE.md)、[设计系统](docs/UI_SYSTEM.md)、[V4 可用性](docs/USABILITY_REFINEMENT_V4.md)、[V5 独立封面](docs/COURSE_COVERS_V5.md)、[V6 学员界面](docs/LEARNER_INTERFACE_V6.md)。旧报告描述的是当时版本，以最新 V2 报告为当前状态。

仍需后续专业人工审校、真实教学试学和更多课程内容生产。本轮没有将技术校验或生产构建当作正式教材发布、浏览器验收或真实用户测试。
