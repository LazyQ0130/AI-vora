# 四门课程封面重做 V3

日期：2026-10-25。按照已确认的内容方向，仅重做 AI000、PY101、MA101、ML201 的封面；Hero、页面布局、课程事实及其他课程的封面映射保持原样。

## 内容与实现

| 课程  | 封面主视觉                                      |
| ----- | ----------------------------------------------- |
| AI000 | AI ⊃ ML ⊃ DL 层级，连接文本、图像、决策任务     |
| PY101 | Python 编辑器、total 函数、列表调用与确定输出 6 |
| MA101 | 坐标系与向量，f(x)=½x² 及 x=1.5 处的切线        |
| ML201 | 回归散点与拟合直线，分类样本与决策边界          |

采用“生成材质层 + 准确 SVG 内容层”：内置 image_gen 生成低噪声的玻璃面板、编辑器工作台和绘图底板，代码、文字、层级和曲线在 `src/components/course-illustration.tsx` 中精确绘制。没有生成伪代码、错误公式或不可核验的模型分数。

新封面使用 `src/app/course-covers-v3.css`，四个 ID 在 `src/lib/artwork.ts` 中单独映射；不会把 Python 图误用作数据分析或工程课程的专属封面。移除了这四张封面底部的重复英文装饰。材质 WebP 合计约 41 KB。

完整原始提示词、内置生图方式、来源和最终文件路径见 [COURSE_COVERS_V3.json](./COURSE_COVERS_V3.json)。原图在 `references/generated-v3/`，网页材质在 `public/artwork/*-v3.webp`。旧版本素材保留，未删除文件。

## 验证

- `npm run typecheck`、`npm run lint`、`npm test`（10/10）、`npm run build` 实际通过。
- 生产服务临时运行在 3001，最终开发预览保持 3000。
- 首页、课程总览、ML201 详情、学习页，在 320 / 375 / 768 / 1024 / 1440 / 1920 共 24 组检查中没有整页横向溢出；未发现已加载但损坏的图片。数据见 `COURSE_COVERS_V3_LAYOUT.json`。
- 首页与总览都恰有四个新的主题内容层，详情/学习页沿用对应课程封面。
- 已实际查看桌面四张卡片，以及四张 375px 手机卡片；代码、公式及图表显示正常。
- 已修复旧图标的 64px SVG 规则对新内容层的尺寸覆盖，确保主题图完整使用封面空间。
- 生产浏览器控制台未发现 error / warn。截图在减少动态效果模式下采集，以避免入场中间帧。

## 截图

- `docs/screenshots/v3/cover-comparison-desktop.png`：四张封面与卡片的最终桌面对照。
- `docs/screenshots/v3/courses-desktop.png`：带页面上下文的桌面截图。
- `docs/screenshots/v3/mobile-AI000.png`、`mobile-PY101.png`、`mobile-MA101.png`、`mobile-ML201.png`：逐门手机截图。

课程仍为规划状态，封面上的图表属于概念示意；未增加真实后端、AI API、视频或课程发布承诺。
