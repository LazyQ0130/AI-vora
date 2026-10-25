# 课程专属生图封面 V5

2026-10-25。按用户最新要求，为课程目录中的全部 20 门课程分别使用内置 `image_gen` 生图工具生成完整配图，并接入实际页面。每个素材单独调用一次生图工具，共 20 次；未使用 CLI/API 回退。

## 最终实现

- 20 门课程对应 20 张独立的完整位图，取消按方向共用通用图的回退逻辑。文件路径与图片内容哈希都互不相同。
- 移除课程封面的 SVG 内容叠层与手机 SVG 图标替代层；`CourseIllustration` 源文件已单独移除，旧 V3 封面样式不再加载。
- 首页精选、课程目录、详情和阅读目录缩略图统一读取 `src/lib/artwork.ts` 中的类型安全索引。首页、目录和详情封面使用 16:9，紧凑缩略图按焦点裁切。
- 所有课程状态、目标、学时、先修依赖保持源课程体系数据。ML201 仍仅含一节演示样章，整门课程继续明确规划状态。V4 的字号、触控尺寸、样章链接和搜索聚焦功能保留。
- 图片为课程主题的概念插画，不承担可计算图表、实验结果或公式证明的作用。课程标题、编号与状态仍为可访问的真实页面文字；图片提供描述性的 alt。

## 素材与提示词

原始生成 PNG 保存于 `references/generated-v5/`；网页使用的 WebP 保存于 `public/artwork/courses-v5/`。两处均已实际落盘，不依赖用户目录中的临时生成文件。

[完整提示词与来源清单](COURSE_COVERS_V5.json) 逐张记录课程 ID、完整提示词、内置工具保存路径、项目原图路径、最终路径、尺寸与字节数。

| ML201 | 监督学习 | [WebP](../public/artwork/courses-v5/ml201-supervised-learning.webp) |
| ML202 | 经典机器学习算法 | [WebP](../public/artwork/courses-v5/ml202-classical-algorithms.webp) |
| ML203 | 模型评估与实验 | [WebP](../public/artwork/courses-v5/ml203-model-evaluation.webp) |
| AI000 | AI 技术地图 | [WebP](../public/artwork/courses-v5/ai000-ai-technology-map.webp) |
| PY101 | Python 编程 | [WebP](../public/artwork/courses-v5/py101-python-programming.webp) |
| MA101 | 线性代数与微积分 | [WebP](../public/artwork/courses-v5/ma101-linear-algebra-calculus.webp) |
| ST101 | 概率统计与优化 | [WebP](../public/artwork/courses-v5/st101-probability-statistics.webp) |
| DS101 | 科学计算与数据分析 | [WebP](../public/artwork/courses-v5/ds101-scientific-data-analysis.webp) |
| DL301 | 神经网络与反向传播 | [WebP](../public/artwork/courses-v5/dl301-neural-backpropagation.webp) |
| DL302 | PyTorch 训练实践 | [WebP](../public/artwork/courses-v5/dl302-pytorch-training.webp) |
| DL303 | 深度学习核心架构 | [WebP](../public/artwork/courses-v5/dl303-deep-learning-architectures.webp) |
| NLP401 | 自然语言处理 | [WebP](../public/artwork/courses-v5/nlp401-natural-language-processing.webp) |
| LLM401 | 语言模型原理 | [WebP](../public/artwork/courses-v5/llm401-language-model-foundations.webp) |
| LLM402 | 微调与推理工程 | [WebP](../public/artwork/courses-v5/llm402-llm-finetuning-inference.webp) |
| CV401 | 计算机视觉 | [WebP](../public/artwork/courses-v5/cv401-computer-vision.webp) |
| MM401 | 多模态对齐 | [WebP](../public/artwork/courses-v5/mm401-multimodal-alignment.webp) |
| RL401 | 强化学习 | [WebP](../public/artwork/courses-v5/rl401-reinforcement-learning.webp) |
| GM401 | 生成式模型 | [WebP](../public/artwork/courses-v5/gm401-generative-models.webp) |
| SYS501 | MLOps 与部署 | [WebP](../public/artwork/courses-v5/sys501-mlops-deployment.webp) |
| RES501 | 论文复现与科学实验 | [WebP](../public/artwork/courses-v5/res501-research-reproduction.webp) |

统一压缩为 960×540 WebP，单张约 54–106 KiB，20 张合计 1,532,192 字节（约 1.46 MiB）。读取本地静态图片，浏览器不调用 AI 服务。

`npm run prepare:covers` 可从项目内保存的原图重新压缩全部 WebP。脚本优先使用项目原图，仅在原图不存在时尝试清单中的生成源文件；重新压缩不调用生图工具，不需要 API Key。

## 视觉设计

深海军蓝背景、青色与紫色轮廓光、玻璃与金属材质形成统一系列；每张图的主物体由实际课程内容决定。例如 ML201 为分类与回归，ML202 为决策树与聚类，ML203 为交叉验证与实验评估，CV401 为图像检测与分割，RL401 为智能体与奖励路径。没有复用宇宙球体图片来代表多门不同课程。

## 实际验证

- `npm run prepare:covers`、`npm run typecheck`、`npm run lint`、`npm test`、`npm run build` 全部通过，共 13 项测试。
- 新增封面完整性测试：源课程 ID 与封面索引完全对应；每张实际存在且为 WebP；20 张路径及 SHA-256 内容哈希唯一；单张低于 150KB；遗漏映射会明确报错。
- 构建版本在当前 Chromium 中检查首页、全课程目录、L2 筛选目录、ML201 详情和阅读页，覆盖 320 / 390 / 768 / 1024 / 1440px，共 25 组。
- 各档全目录均渲染 20 个独立图片地址，课程封面内 SVG 数量为 0，无页面横向溢出与破损图片。阅读侧栏按响应式设计收起时，不作为图片显示故障；另外实际打开了 320 / 390 / 768 / 1024px 的章节抽屉，缩略图均正常显示，SVG 为 0。
- 实际滚动加载完整目录，确认 20 张封面全部加载；保存整页截图时返回页首，避免固定导航出现在长截图中段。
- 实际点击 ML201 样章入口，正确进入阅读页并使用同一张新生图缩略图。浏览器未记录 error / warn。
- 截图使用减少动态效果模式以避免截取过渡中间帧。未扩展为跨浏览器或触屏真机认证。

## 截图

- [与用户截图对应的三张 L2 卡片](screenshots/covers-v5/l2-cards-desktop.png)
- [L2 桌面页面](screenshots/covers-v5/l2-desktop-1440.png)
- [手机 L2 卡片](screenshots/covers-v5/l2-mobile-390.png)
- [首页四张精选课程](screenshots/covers-v5/home-courses-desktop-1440.png)
- [全部 20 门课程长截图](screenshots/covers-v5/catalog-all-desktop-1440.png)
- [手机详情封面](screenshots/covers-v5/detail-cover-mobile-390.png)
- [手机阅读目录缩略图](screenshots/covers-v5/reader-drawer-mobile-390.png)
- [25 组布局检查数据](screenshots/covers-v5/layout-checks.json)
- [四档抽屉检查数据](screenshots/covers-v5/drawer-checks.json)

产品边界未扩展：没有新增登录、数据库、支付、视频、AI 助手或运行时 AI API。旧图片与旧版验收记录保留，方便追溯；原始课程文件、参考图和提供的设计令牌文件保持原样。
