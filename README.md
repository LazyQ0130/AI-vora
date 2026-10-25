# Aivora · 系统化 AI 技术学习平台

独立、可运行的前端演示。课程事实来自课程体系 V1.0 的原始 JSON/Markdown，20 门课程及对应项目全部为规划；仅 ML201 提供一节原创演示样章。Aivora 是品牌工作名，域名与商标尚未核验。

## 启动

要求 Node.js 20.9+、npm；本机实测 Node.js 24.16.0 / npm 11.13.0。建议使用 Node.js 当前支持的 LTS。

```powershell
npm ci
npm run dev
```

打开 http://127.0.0.1:3000 。开发服务器仅监听本机地址，不向公网发布。

```powershell
npm run typecheck
npm run lint
npm test
npm run build
npm start
```

生产构建与开发检查已实际执行，具体结果见 `docs/FRONTEND_ACCEPTANCE.md`。`npm start` 需要先构建，和开发服务共用默认 3000 端口时，请先停止其中一个；也可 `npm start -- --port 3001`。

## 实际技术版本

以 `package-lock.json` 为可复现安装依据：Next.js 16.4.3（App Router）、React 19.3.1、TypeScript 5.9.3（strict）、Tailwind CSS 4.3.3、Motion 12.43.0、Radix Dialog 1.3.1、Lucide 0.468.0、KaTeX 0.19.1、Prism React Renderer 2.4.1、Zod 4.6.7。

采用本地系统中英文字体，不依赖远程字体或图库。Hero 与课程封面使用内置 image_gen 离线生成的原创插画，压缩为本地 WebP；Logo 和教材中的数学图示保留可维护的 SVG。参考截图仅用于设计比对，从未作为页面背景或裁剪资产。

本轮视觉打磨记录见 `docs/VISUAL_REFINEMENT_V2.md`。六张生成素材及完整提示词见 `docs/IMAGE_GENERATION_V2.json`，原图保存在 `references/generated-v2/`，网站使用 `public/artwork/` 下的轻量版本。

最新四门课程封面采用“生成材质 + 准确 SVG 内容”，详见 `docs/COURSE_COVERS_V3.md`。提示词与素材路径在 `docs/COURSE_COVERS_V3.json`，原图保存在 `references/generated-v3/`。

## 路由

| 路由                         | 内容                                            |
| ---------------------------- | ----------------------------------------------- |
| `/`                          | 品牌 Hero、L0–L5、学习方式、首发路线、样章入口  |
| `/courses`                   | 20 门规划课程，关键词/等级/方向筛选，URL 可分享 |
| `/courses/[id]`              | 原始目标、先修、真实章节、实验、项目、验收证据  |
| `/paths`                     | 零基础、编程基础、ML/DL 基础的建议路径与分支    |
| `/learn/ML201/ML201-C04-L01` | 线性回归与梯度下降演示样章                      |
| `/dashboard`                 | 浏览器本地阅读进度、继续学习、最近记录与空态    |
| `/projects`                  | 从原始 project 字段衍生的规划项目，按等级筛选   |
| 其他路径或未知课程/单元      | 品牌化 404                                      |

## 源码结构与扩展

```text
src/app/                 Next.js 页面、模板过渡、loading/error/404
src/components/          导航、卡片、目录、路径、项目与学习中心
src/components/lesson/   可组合教材组件与响应式阅读框架
src/app/visual-v2.css    Hero、封面与阅读页的独立视觉层
src/content/sample.ts    原创样章、类型化内容块与同源 NumPy 代码
src/lib/curriculum.ts    Zod 校验、原始目录映射、搜索筛选
src/lib/paths.ts         根据课程蓝图整理的建议路线
src/lib/regression.ts    确定性数学函数与边界控制
src/lib/progress.ts      进度数据校验与合并
src/lib/use-progress.ts  本地存储 adapter 与跨同源标签页更新
public/brand/            图形、横版、单色 Logo
public/artwork/          离线生成并压缩的 Hero 与五类课程封面
public/downloads/        同源生成的 Python / Notebook
curriculum/             用户提供的课程事实来源，保持原样
references/             用户提供的视觉参考，保持原样
design-tokens.json      用户提供的视觉令牌，保持原样
scripts/                下载文件生成工具
tests/                  数据、算法、持久化与 Python 检验
docs/                   设计系统、阶段验收与实际截图
```

扩展课程时修改 `curriculum` 原始数据并通过 adapter 校验。`CourseStatus` 预留完整审核生命周期，当前始终映射 `planned`，不能因为提供样章就把整门课改成已发布。新增教材应使用 `LessonBlock` 结构，提供唯一 ID、专业复核记录、运行验证、练习解析，再添加真实路由与相邻导航。

## 演示教材与测试

样章基于 60 个确定的无噪声合成样本 y=2x+1，内容包括 MSE、解析梯度、全批量梯度下降、交互参数图、带逐选项解析的自查题。浏览器数学演示有收敛、发散、非法输入及有限差分测试。它不是在线 Python 运行服务，也不是现实数据上的泛化评估。

网页、Python 源码与 Notebook 同源。更改代码后重新生成下载文件并测试：

```powershell
npm run prepare:downloads
npm test
```

Python 检验可选，需要 Python 3.10+ 和 NumPy：

```powershell
python -m pip install numpy
python tests/test_sample.py
python public/downloads/linear_regression.py
```

本机已在 Python 3.14.2 / NumPy 2.5.2 实际运行脚本与 Notebook 代码，并通过梯度检验及最小二乘对照；未在所有 Python 版本上测试。教材仍需正式专业人工审校与教学试学，界面已有明确说明。

## 本地状态与产品边界

- `localStorage` 键 `aivora:learning:v1` 保存本节最高浏览比例、当前段落、读完标记与访问时间。已访问不等于已学会，样章进度不冒充整门课程进度。
- 数据损坏或版本不支持时显示空态；浏览器限制存储时使用本次会话内存。更换设备、浏览器或清理站点数据不会同步恢复。
- 提供搜索、筛选、路径切换、章节折叠、目录定位、Quiz、复制与下载。尚无相邻单元，上/下节明确禁用。
- 不包含视频、AI 助手/模型 API、真实认证、支付、数据库、CMS、GPU 或任意代码执行服务；没有虚构学员、评价、销量与已上线课程。
- 未做亮色主题与线上部署。专业内容生产、人工复核与后端能力均属于后续工作。

设计取舍见 `docs/UI_SYSTEM.md`；各页面、断点、截图及已知限制见 `docs/FRONTEND_ACCEPTANCE.md`。

手机字号、44px 触控区域、纵向路径、样章入口、对比度及 Ctrl+K 的最新实测与截图见 [V4 核查记录](docs/USABILITY_REFINEMENT_V4.md)。

20 门课程现各有一张内置生图生成的独立封面，覆盖桌面与手机，没有封面 SVG 叠图或共用通用图。素材、完整提示词、接入与截图见 [V5 封面记录](docs/COURSE_COVERS_V5.md)。本地原图位于 `references/generated-v5/`，WebP 位于 `public/artwork/courses-v5/`；运行 `npm run prepare:covers` 可从已保存的原图重新压缩，不需要调用 AI 服务。

学员界面已去掉课程编号、开发批次、版本号及实现说明；先修与路径改用可读课程名称，搜索支持同一套名称。详见 [V6 学员界面精简记录](docs/LEARNER_INTERFACE_V6.md)。

技术实现参考：[Next.js 官方安装文档](https://nextjs.org/docs/app/getting-started/installation)、[Motion 减少动态效果配置](https://motion.dev/docs/react-motion-config)、[Tailwind Next.js 官方指南](https://tailwindcss.com/docs/installation/framework-guides/nextjs)。
