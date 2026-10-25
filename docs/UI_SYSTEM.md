# Aivora 前端设计系统

## 品牌与视觉

品牌工作名 Aivora，未核验域名或商标。`design-tokens.json` 为原始依据，CSS 变量定义于 `src/app/globals.css`。

| 令牌       | 数值    | 用途             |
| ---------- | ------- | ---------------- |
| background | #0B1026 | 全站深海军蓝     |
| panel      | #111A33 | 实色阅读与卡片   |
| elevated   | #1E293B | 浮层与强调       |
| primary    | #6366F1 | CTA、导航与选中  |
| cyan       | #06B6D4 | 品牌及概念图     |
| violet     | #A855F7 | 专业方向的辅助色 |
| text       | #E2E8F0 | 阅读正文         |
| muted      | #94A3B8 | 辅助信息         |

Logo 为原创几何 A 标志，提供 `public/brand/` 下的图形、横版和单色 SVG，favicon 复用图形版。没有截取或直接嵌入概念截图。首页使用离线生成的原创星球地平线。当前 V5 为 20 门课程各自生成独立完整配图，全部为本地 WebP；课程封面没有 SVG 叠图，也没有按方向复用的通用图。数学教学图示继续使用可核对的 SVG，无外部图片请求。

历史 V3 曾对四门课程使用生图材质与 SVG 内容层，现已由 V5 全量替代。旧记录与素材保留；当前实现与验收见 `COURSE_COVERS_V5.md`。

使用本地系统字体，优先 Inter / Noto Sans SC / Microsoft YaHei，代码优先 JetBrains Mono / Consolas；不因远程字体下载阻塞首屏。中文主标题以留白和字距构建层级。正文阅读列上限 820px，营销内容列 1280px，外层布局上限 1440px。

## 组件

课程编号只用于内部数据、路由与阅读记录。`course-labels` 提供可搜索的学员名称，`course-presentation` 解析先修与路径引用；展示名称与内部标识分离，保持源课程事实及既有链接稳定。具体清理范围见 `LEARNER_INTERFACE_V6.md`。

- `site-shell`：Brand、Header、Footer；导航当前态使用 Motion 共享指示器。
- `ui`：Providers、Toast、Reveal、Drawer、SectionTitle、EmptyState。抽屉基于 Radix Dialog，提供焦点限制、Escape 关闭与语义标题。
- `course-card`：CourseArt、CourseCard。所有事实来自本地 adapter，不提供伪造的销量或评价。
- `artwork.courseCovers`：20 张课程专属生图的类型安全索引，包含路径、概念插画说明与紧凑裁切焦点。缺少映射会明确报错，防止重新引入重复通用图。
- `catalog`：搜索与筛选保存在 URL。原生 History API 同步 Next.js searchParams，输入不触发服务器请求。桌面侧栏在手机变成 Drawer。
- `paths-explorer`：三种起点、节点与专业分支。Tabs 支持方向键、Home / End，节点是课程详情链接，先修的并行与补修说明保留。
- `lesson/blocks`：LessonHeading、Paragraph、LearningObjectives、InfoCallout、MathBlock、DiagramCard、CodeBlock、QuizBlock、RegressionExperiment、ProgressRing、LessonNavigation。内容采用判别联合类型块，增加教材无需重写整页。
- `lesson/reader`：ChapterToc、三栏阅读框架、requestAnimationFrame 节流的阅读基准线定位与进度、手机双 Drawer。静态内容块 memo 化，滚动更新不重新渲染 KaTeX、代码高亮和数学演示。
- `artwork` / `hero-art`：纯展示素材映射与 Hero 品牌组合。生成图不承载课程状态、文案或数学结论。
- `use-progress`：useSyncExternalStore 避免本地进度的 hydration 差异；读写 localStorage 失败退回当前会话内存；损坏/过期数据回退空态；最高浏览比例只前进。
- `dashboard` / `projects`：真实本地阅读记录、按目录衍生的规划项目；不生成虚构学习记录或成就。

## 交互、响应式与无障碍

按钮、卡片悬停 200ms；页面进入 300ms；进入视口渐现 400ms，仅触发一次。动效以 transform / opacity 为主，无 scroll-jacking。`MotionConfig reducedMotion="user"` 与全局媒体查询尊重用户减少动态效果偏好。Hero 视差只响应鼠标并在减少动态效果时禁用。

响应式断点 1200 / 980 / 700 / 350。小屏导航为 Drawer；卡片列数逐步收敛。按钮、输入与链接有 focus-visible；跳过导航链接通向主要内容；图标按钮有可访问名称。装饰 SVG 从辅助技术中隐藏。

## 重要取舍

1. 概念图作为氛围与空间参考。V2 使用离线生成的有纵深的星球地平线与课程概念插画，保留轻量视差，不引入实时 WebGL/3D；阅读区保持实色。
2. 课程目录是规划蓝图。开发阶段 P0/P1/P2 与课程内容开发批次 P0–P5 属于不同维度。
3. 不开放尚未编写的教材章节，不以章节标题填充伪教材。
4. 不创建登录、支付、聊天、视频或服务器代码执行入口。
5. 尚无相邻样章，上一节/下一节保持明确禁用。保留组件接口，未来增补真实教材后再开放。
6. 样章尚未经过专业人工审校与教学试学，公开前必须补齐；仅提供原创演示与实际数学/代码技术验证。
7. 回归实验图表的浮点坐标统一三位小数，避免不同 JS 环境的计算末位差异造成 hydration 警告。
8. V2 视觉层位于 `src/app/visual-v2.css`，保留通用组件基础；阅读列最大 820px，桌面侧栏约 232 / 248px，窄屏优先正文并切为 Drawer。
9. 阅读页根据实际导航栏下缘计算阅读基准线，避免按钮尺寸、窗口宽度变化后高亮位置偏移。移动目录先关闭抽屉，再滚动并聚焦目标标题，避免焦点恢复将页面拉回。

## V4 功能尺寸与无障碍

`src/app/usability.css` 集中定义正文 14px、辅助文字 12px、触控区域 44px 和功能文字颜色令牌；手机阅读正文 15px。装饰性英文与图像内容不套用功能文字尺寸。V4 曾使用紧凑图标，当前 V5 已统一改为课程专属生图；首页、目录与详情使用 16:9，阅读缩略图使用同一素材的局部裁切。

`curriculum.getCoursePreview` 统一提供真实样章索引，课程生命周期仍为 planned。课程卡通过标题的扩展点击区域进入详情，同时保留独立样章链接；禁止嵌套链接。手机依赖图采用阶段步骤条，桌面保留关系图。

页头搜索快捷键与链接共同复用 `course-search` 聚焦逻辑；跨路由使用临时 URL 标记，聚焦后清理，保留筛选。数学滚动区域提供 region 语义。完整实测与截图见 `USABILITY_REFINEMENT_V4.md`。
