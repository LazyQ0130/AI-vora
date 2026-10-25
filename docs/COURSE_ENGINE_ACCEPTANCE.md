# 通用课程引擎开发验收

日期：2026-10-25。基线 `77bcdee`。实施计划见 [COURSE_ENGINE_PLAN.md](COURSE_ENGINE_PLAN.md)。

## 第一阶段：引擎与兼容层

已完成统一 Course / Chapter / Lesson / ContentBlock 数据模型与 Zod 构建期校验。章节从原始课程目录生成，空章节保持规划；教材、发布权限与原始课程状态分离。静态清单控制可读地址，草稿、未校验与下线教材不能生成试读入口；正式发布需要技术和人工审核证据。原课程事实与 20 张封面不变。

Reader 改为接收课程、章节、教材和发布信息；ChapterToc、导航分组、题目、文件名、目标、资源、先修与元数据由内容驱动。线性回归实验独立动态加载，未出现实验的课时不加载该组件。保留原样章 DTO 作为兼容适配输入，既有算法与下载测试继续有效。

v2 进度键：`aivora:learning:v2:<courseId>:<lessonId>:r<contentVersion>`。单课时保存最高浏览比例、当前段落、读完标记与时间。新版教材修订使用不同键，不冒用旧版完成状态。v1 仅迁移至原 ML 样章 r1；读取兼容、挂载后幂等迁移，不删除旧键。已有 v2（包括无法识别的数据）不被迁移自动覆盖。写入失败使用每个键独立的会话内存；外部事件不会覆盖未落盘状态。

验证：TypeScript、ESLint 通过；24 项单元测试通过（原 15 项 + 新 9 项）。证据：`tests/course-engine.test.ts`、`tests/learning-progress.test.ts`。覆盖状态门禁、内容合法性、错误课程/课时、原 ML 段落兼容、相邻导航、隔离、修订、迁移、损坏数据、存储失败和外部变更。此时仅完成技术层验证，浏览器验收见第四阶段，不能以本阶段检查替代。

尚待后续阶段：两个新教材、详情/学习中心接入、CSS 整理和真实浏览器验收。教材人工审校与真实试学不在本轮技术验证范围。

## 第二阶段：三种教材验证

保留原 ML 样章教材与 7 个稳定段落 ID；新增 Python 函数与参数（原第 5 章）、向量与矩阵的基本运算（原第 3 章，含向量复习）。均由同一 Lesson schema 和 Reader 消费。两张教学 PNG 用 matplotlib 精确绘制，提供源脚本、真实尺寸、解释性 alt 和图注，不替换已有课程封面。

教材包含目标、理论、代码/公式、练习、逐选项答案解析与官方参考。Python 说明形参/实参、return、关键字与默认值、共享默认列表和注解边界；数学说明形状、行列内积、非交换性、@ 与 *、一维数组与列向量的差异。

验证：`npm run test:python` 实际执行 6 项 Python 单元测试、3 份脚本与 Notebook、网页全部 6 个 Python 代码块。Python 3.14.2 / NumPy 2.5.2；新图生成使用 matplotlib 3.11.2。结果见 [COURSE_ENGINE_PYTHON_RESULTS.json](COURSE_ENGINE_PYTHON_RESULTS.json)。函数返回值 6.0 / 13 / 5.0，示意调用返回 7；矩阵 AB=[[4,6],[1,3]]、BA=[[2,4],[1,5]]、MN=[[4,5],[2,3]]，内积=5；ML 与最小二乘及有限差分对照通过。Notebook 的输出和执行编号保持空白，不伪造已执行状态。

全部公式经 KaTeX strict/error 解析通过，图片文件头尺寸匹配；下载源码、Notebook 与网页代码同源。TypeScript 与 27 项单元测试通过。新增了原课程文件 SHA-256 字节一致性测试。三节状态均为 pending-review / preview，没有正式教材发布声明，也没有把规划课程改成已上线。尚待真实浏览器视觉与交互验收，以及后续人工审核/教学试学。

## 第三阶段：通用阅读 UI 与 CSS

详情页按真实章节显示试读入口；卡片、路径和目录从清单获取课程可读性。学习中心只接收轻量课时摘要，不打包全部教材正文；分别显示最近阅读、各课时记录与各课程“可读样章”进度，不冒充整门课程完成度。目录及右侧内容地图按任意课时段落定位，只有真实相邻课时才生成上下节链接。

阅读器保留深海军蓝 / Indigo / Violet / Cyan；正文统一 16px，说明与公式图注 14px，辅助信息最低 12px。菜单、复制、段落导航等主要触控区域至少 44px。公式、代码使用独立横向滚动区域；教学图支持桌面与手机两种构图，并提供原图入口，避免窄屏缩小整张信息图导致文字不可读。图片保留固有尺寸、懒加载和轻量淡入；代码复制有反馈与定时器清理。

旧 globals / visual-v2 / usability 移除 226 / 195 / 52 个阅读器相关选择器，原文件由 4620 / 1669 / 258 行降为 3478 / 770 / 198 行；统一到 reader.css。共享 ProgressRing 仍留在基础样式，入口与学习中心新增规则独立在 learning-system.css。未增加 JavaScript 动画依赖；实验按需加载，滚动每帧最多更新一次，内容块 memo 避免进度更新触发语法高亮重算；保留 MotionConfig reducedMotion 与全站 CSS 降级。

首轮浏览器检查发现进度环文本被新标签规则覆盖、长课程目录自动定位时带走课程标题；已收窄标签选择器，并将目录滚动限制在章节列表内部。其余页面样式保留，最终回归证据见第四阶段。

手机检查还发现横向构图的教学图需要滑动才能看到主要内容，已补充 640px 专用构图：函数调用改为纵向三步骤，向量图保留等比例坐标并重新排布标签。该能力由通用 image.mobile 数据与 picture 组件提供，不按课程分叉阅读页面。

## 第四阶段：最终自动化与浏览器验收

### 实际执行结果

| 检查 | 结果 | 证据 |
| --- | --- | --- |
| npm run prepare:downloads | 3 组 Python / Notebook 同源生成 | programs.ts、public/downloads、下载一致性测试 |
| npm run typecheck | 通过，无类型错误 | TypeScript strict；最终生产构建另执行框架类型检查 |
| npm run lint | 通过，无错误或警告 | ESLint 全仓库 |
| npm test | 28 / 28 通过 | 原 15 项保留；新增内容、引擎、进度 13 项 |
| npm run test:python | 6 项 Python 单元测试及网页全部 6 个 Python 代码块通过 | [Python 实测 JSON](COURSE_ENGINE_PYTHON_RESULTS.json) |
| npm run build | 通过 | 静态生成 ML / PY / MA 三条阅读路径，其他现有页面保留 |
| 本地生产 HTTP | 23 / 23 符合预期 | [HTTP 结果](COURSE_ENGINE_HTTP_RESULTS.json) |
| 真实浏览器交互检查 | 19 / 19 通过 | [浏览器结果](COURSE_ENGINE_BROWSER_RESULTS.json) |
| 视口检查 | 3 门 × 4 种宽度 = 12 组，无整页横向溢出 | 同上；1440 / 768 / 390 / 320px |
| 实际截图 | 30 张 | [截图目录](screenshots/course-engine/) |

Python 实测环境为 3.14.2 / NumPy 2.5.2；网页不依赖 Python。浏览器检查运行于本机生产服务 127.0.0.1:3001，Windows IAB Chromium，使用真实页面与视口模拟。检查包含正常动效与 prefers-reduced-motion。没有将构建、DOM 测量或服务器请求单独当作浏览器验收；桌面、平板、手机截图均实际查看。

### 重点交互与数据证据

- 三节标题、课程、章节、目标、代码文件名、题目与资源正确，PY 在原第 5 章、MA 在原第 3 章、ML 在原第 4 章。ML 的原 7 段、确定性实验和下载内容保留。
- 三门均显示“试读 · 待人工审核”，完整课程仍显示筹备；错误课程归属、未知课时、规划但无教材章节均为 404，不回退到另一门教材。
- 手机目录选择 binding 段落后，段落顶部约 209.68px，固定导航底部约 182.33px；平板 ML 代码段顶部约 221.90px、导航底部约 194.33px。段落标题能获得焦点；Escape 关闭后焦点返回目录按钮。
- 原 ML v1 已读完记录在首次打开新学习中心时直接恢复（此前 16:46 的记录），未清空旧数据；PY 单独标记完成时 MA 仍为 0/1。继续验收后 MA 为已浏览 88%、未标记读完；刷新后 3 条独立记录一致。从 MA 历史入口恢复 #quiz，定位未被导航遮挡。验收操作留下的是本机样章记录，不是学员人数或认证数据。
- 题目错误时显示对应原因及参考答案，改选会重置提交状态；三节的正确答案反馈均实际操作。代码复制经剪贴板核对，完整脚本不含行号；Python 浏览器实际下载文件与仓库源码字节一致。代码局部键盘滚动 scrollLeft=40、容器 308px、内容 632px，整页不溢出。
- 数学公式保留 MathML，5 个数学块无 KaTeX error；公式可以用键盘横向阅读。手机图实际加载 640px 专用构图，原图入口在新标签打开 1200×600 PNG，阅读器位置保留；验收创建的图片标签已关闭。
- ML 实验学习率调至 1.00 后显示发散警告，重置恢复 0.10 / 100 次，w≈1.711、b≈1.155、MSE≈7.325e-3。放大图表坐标后，将轴名称移到独立文字层，修正窄屏字母与刻度重叠；320px 的实验坐标实际显示约 12.23px，静态图约 13.48px。
- 12 组视口中正文均为 16px，图注 14px，阅读导航 48px，平板/手机目录与目标按钮 44px。三个样章均为 2 道自查题；段落数分别 7 / 6 / 6。没有整页横向溢出或公式错误。
- Ctrl+K 从阅读器跳到课程页并聚焦 course-search，课程页重复按仍聚焦；Windows 显示 Ctrl K。Python 名称搜索匹配真实课程及其新样章。首页正常动效、悬停和桌面/手机布局做了回归。
- reduced-motion 下 html scrollBehavior=auto，页面 opacity=1、transform=none，动效时长降为 0.00001s；正常模式观察到实际页面淡入且 html 使用 smooth。浏览器错误/警告日志为空。

单元测试另外覆盖同课程多个课时的真实相邻导航（仅测试夹具，不发布虚构教材）、草稿/待验证/下线门禁、非法内容、资源、进度损坏/版本、旧记录幂等迁移、存储被拒和跨标签变更。最终补充“无订阅期间外部清除不应由缓存复活”的边界测试并修复存储读取；原有全部测试继续通过。

### 截图索引

| 样章 | 桌面 1440 | 平板 768 | 手机 390 | 窄屏 320 |
| --- | --- | --- | --- | --- |
| 线性回归与梯度下降 | [桌面](screenshots/course-engine/ml-desktop-1440.png) | [平板](screenshots/course-engine/ml-tablet-768.png) | [手机](screenshots/course-engine/ml-mobile-390.png) | [窄屏](screenshots/course-engine/ml-narrow-320.png) |
| Python 函数与参数 | [桌面](screenshots/course-engine/python-desktop-1440.png) | [平板](screenshots/course-engine/python-tablet-768.png) | [手机](screenshots/course-engine/python-mobile-390.png) | [窄屏](screenshots/course-engine/python-narrow-320.png) |
| 向量与矩阵的基本运算 | [桌面](screenshots/course-engine/math-desktop-1440.png) | [平板](screenshots/course-engine/math-tablet-768.png) | [手机](screenshots/course-engine/math-mobile-390.png) | [窄屏](screenshots/course-engine/math-narrow-320.png) |

关键细节：[函数手机示意图](screenshots/course-engine/python-diagram-mobile-390.png)、[向量手机示意图](screenshots/course-engine/math-diagram-mobile-390.png)、[手机代码](screenshots/course-engine/python-code-mobile-390.png)、[目录抽屉](screenshots/course-engine/python-toc-mobile-390.png)、[进度抽屉](screenshots/course-engine/python-progress-mobile-390.png)、[窄屏实验](screenshots/course-engine/ml-experiment-narrow-320.png)、[数学测验](screenshots/course-engine/math-quiz-mobile-390.png)、[学习中心](screenshots/course-engine/dashboard-mobile-390.png)、[错误路径](screenshots/course-engine/invalid-course-mobile-390.png)。

### 原始事实与边界

原始文件与基线 Git blob 的 SHA-256 相同，且由单元测试持续保护：

| 原始文件 | SHA-256 |
| --- | --- |
| AI技术课程体系_V1.0.md | b863f49f3da43225b009b7053dff79d6b5985bf8da9327f7701bc40c0c9d5a73 |
| AI技术课程目录_V1.0.json | a7f5723c2ac659bfe271eeeffc050c2d96c46fd68e29391051c88f5db2812366 |

课程编号继续只用于数据键和地址，未重新显示到学员卡片；20 张原有独立课程封面保留。没有新增展示页面、前端依赖、视频、AI 助手、运行时 AI API、登录、支付或用户数据库；没有删除有效文件或测试。旧 v1 模块作为兼容 API 留存，SAMPLE_URL 作为现有 ML 主要推荐入口保留；新阅读引擎不依赖这些单样章假设。

## 尚未完成与适用限制

1. 三节教材仍待专业人工内容审校和真实教学试学；未标为正式发布。其余课程保持原规划，没有补写或虚构完整教材。
2. 浏览器验收是 Windows Chromium 的桌面/平板/手机视口模拟，未声称覆盖实体触控设备、Safari、Firefox 或完整 WCAG 认证；存储配额拒绝与修订迁移的异常条件由可注入存储单元测试覆盖。
3. 发布清单是静态编辑与构建流程，证据引用需要维护者审查，不是登录权限、付费保护或数字签名。扩展与发布操作见 [COURSE_AUTHORING.md](COURSE_AUTHORING.md)。
4. 阅读记录只在当前浏览器，不能跨设备同步。新版实质教材应递增 contentVersion，保留旧修订键；它不会继承旧版“已读完”。不提供任意代码在线执行服务。

本轮技术、浏览器与文档验收完成；上述内容审核与平台后端能力保留为后续工作。
