# 静态课程编写与维护

## 数据边界

原 curriculum/ 的 Markdown、JSON 是 20 门课程、等级、目标、学时、先修、章节与项目的事实来源。教材不能反过来改写这些事实。lib/curriculum 的 Course 是目录适配类型；content/models 的 Course 组合相同事实与结构化 Chapter。每个 Chapter 有稳定 ID、顺序和真实可读课时，不为规划章节伪造课时。

Lesson 数据位于 content/lessons，资源程序位于 content/resources/programs，发布状态位于 publication-manifest；course-engine 负责关联与解析。Reader 不导入某一节教材。9 节现行教材与 1 节旧综合试读全部经过同一 ContentRenderer。旧 sample.ts 与 v1 progress API 保留兼容和既有测试；新 UI 不直接消费它们。

## 添加一节教材

1. 从原目录确定 courseId 与章节顺序，在 course-outline 登记节级蓝图（title、order、稳定 ID）。ID 格式为 COURSE-Cxx-Lxx，章节 ID 为 COURSE-Cxx；稳定 ID 不因显示名称变化而改变。显示号由原章顺序与 slot.order 生成，不解析 Lxx。当前 C04-L01 留给旧版，因此 C04-L05 显示为 4.4。
2. 新建 content/lessons/<topic>.ts，用 lessonSchema.parse 包裹数据。提供 contentVersion、标题、副标题、预计本节阅读分钟数、先修、2–4 个目标、段落、参考资料和下载资源。不要把本节分钟数冒充原课程总学时。
3. 每个 section 有稳定 id、title、navGroup、navLabel、blocks，可选 intro 布局。相同导航分组使用相同名称，顶栏会自动选该组首段作为入口。段落用于目录、锚点与进度，发布后应保持稳定。
4. 将 Lesson 导入 course-engine 的 contents。这里只登记数据，不增加 React 页面；注册表校验课程/章节归属、唯一 ID、同章顺序和内容版本一致。
5. 在发布清单登记 lessonId/courseId/chapterId/title/contentVersion/order，初始 draft/private 或 pending-validation/private。私有内容不生成阅读地址、卡片入口或学习统计。
6. 如有完整程序，登记 programs，正文直接引用同一 code 字符串，resourcesForProgram 生成资源描述。运行 prepare:downloads，不能手改生成的下载内容。Notebook 保持未运行的空输出与 null 执行编号。
7. 执行类型、Lint、测试、Python 校验、生产构建和真实浏览器检查；保存技术证据后进入 pending-review/preview。人工审校与试学另行记录，不能把 AI 辅助起草当成人工审核。

现有示例可分别参考 python-functions（纯 Python）、vector-matrix（数学与响应式图片）、linear-regression（旧 DTO 适配与可选交互实验）。

## 发布规则

| 状态 | 用途 | 可见性 |
| --- | --- | --- |
| planned / draft / pending-validation | 规划、写作、校验前 | private |
| tech-verified / pending-review | 技术验证通过、等待内容审核 | private 或 preview；需要 technicalEvidence |
| reviewed | 人工内容审核通过 | private 或 preview；还需 reviewEvidence |
| pilot | 真实教学试学 | private 或 preview；还需 reviewEvidence |
| published | 正式教材 | public / preview / private；技术与审核证据齐全 |
| deprecated | 下线 | private |

technicalEvidence / reviewEvidence 是仓库审核证据引用，不是权限系统或数字签名。维护者负责审查证据的真实性与适用修订；schema 检查字段和状态门禁，不能替代专业审核。当前 10 节均为 pending-review/preview（含旧综合试读），整门课程仍 planned。

## 内容组件

- paragraph / heading：React 文字节点，不注入任意 HTML。
- image：本地 PNG/WebP/JPG、解释性 alt、图注和固有尺寸；可选 mobile 对象提供 src/width/height。通用 picture 根据视口选择构图，无需新增页面；提供原图入口。
- math：LaTeX 与中文解释。KaTeX trust=false，测试使用 strict/error 解析；长公式只在自己的 region 中滚动。
- code：code / filename / language，支持 Python、JavaScript、Bash、JSON、text，复制不包含行号。不提供在线运行按钮。
- callout / summary：重点、边界或总结，内容同样属于教材数据。
- table：caption、列名和行数据；schema 拒绝列数不一致。原生 table 包在可聚焦的横向滚动 region 内，手机不缩小整页。
- reading-links：带说明的补修与衔接资料，区分真实正文、外部教材和仅有章级规划的入口。
- exercise：稳定 ID、课型、题干、分层 hints、solution 与 rubric。原生 details 展示提示与解析，输入仅当前页面暂存，不保存、不自动判分、不更改读完标记。
- quiz：稳定题目 id、问题、至少两个选项、零起始正确索引及每个选项的解析；选中不等于已提交，改选会重置反馈。它是本地自查，不代表认证。
- downloads：引用本节 resources 的 ID；资源限定本地下载路径。全节资源也在页尾列出。
- diagram / experiment：kind 通过枚举选择受控组件。现有 linear-regression 使用确定性数学计算，实验组件单独动态加载。添加新的实验种类时只扩展 schema 与组件注册/分派并提供数值测试，不执行任意教材 JavaScript。

## 进度、修订与导航

v2 以 courseId/lessonId/contentVersion 分键。内容实质改变时递增 contentVersion，并同时更新 Lesson 与 manifest；旧修订键保留，新版从未读开始。只修错字且不改变结构时可保持版本，但不能随意删改段落 ID。单纯重命名课时标题不会改 ID。

v1 兼容仅适用于原 ML201-C04-L01 r1 的既有 7 段；匹配后读取兼容，挂载后迁移，不删除旧键。有 v2 时不自动用旧值覆盖，包括未知/损坏 v2。存储失败时本次会话仍能继续阅读，跨标签的 storage 通知会刷新可落盘记录。恢复本地存储权限后，下一次保存会重试。

目录与相邻课时从原章顺序和节级蓝图 order 产生，清单必须与蓝图一致。只有同课程现行可读课时参与上下节导航；例如 3.3 下一节是 4.1，跳过未制作的 3.4，4.4 没有下一节。旧综合试读 catalogRole=legacy，不冒用新版 4.1 编号，也不参与新版完成率。错误课程归属、未写课时、私有或下线内容均不生成路径。

## 样式和验收

reader.css 管理阅读器基础布局；learning-system.css 管理共享分层目录、教学表格/开放练习等扩展、入口与学习中心，基础 ProgressRing 保留在 globals。不要继续往 visual-v2/usability 添加阅读器覆盖。正文 16px，图注/说明 14px，功能辅助信息至少 12px；主要触控区域至少 44px。不要为了长公式、代码和示意图缩小整页；图片可提供手机构图，公式/代码局部滚动。

滚动监听使用 passive + requestAnimationFrame，浏览比例取整以减少 React 更新，内容块 memo；目录自动滚动局限在目录容器。动效继承 MotionConfig 和 reduced-motion，不增加无必要的动画库。

每次教材变更运行 README 列出的检查，尤其 prepare:downloads → test:python。新增素材确认文件、尺寸、alt 和下载一致性；生产浏览器测试至少覆盖桌面/平板/手机、目录与焦点、题目反馈、复制/下载、刷新恢复、独立进度、状态和 404。构建成功不等同于浏览器或专业内容验收。
