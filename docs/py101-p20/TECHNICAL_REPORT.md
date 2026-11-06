# P20技术验收：Reader修复与3.4试读放行

2026-11-06。已知P1在最终固定生产矩阵通过，允许已完成的PY101-C03-L04/r1进入pending-review/preview，技术依据为本报告；只有门禁全部完成后才正式提交放行。没有人工reviewEvidence，PY101仍planned，3.5未制作。

## 基线与保护

fetch后main/origin/main/GitHub为d50d2a48b4919d6b387646982f5163ee276c8a7d。重新扫描3355份跟踪文件、4份原修改及7份未跟踪文件，原Reader/阅读测试/ai000兼容器有用户改动，均不借本轮提交。独立干净codex/p20-reader工作树实现与验证，node_modules仅联接既有依赖，不安装/改PATH/安全策略。

WORKSPACE_PROTECTION核对原检出3355份跟踪文件和7份未跟踪文件全部保持开工字节，原status不变。仅4份授权既有源码发生本轮差异：Reader、Publication、PY历史兼容器及P19测试的历史视图入口；新增小型会话辅助器、实际Reader回归宿主/测试、P20校验脚本和证据。用户参考标题/日期清理未提交。P0–P19报告与curriculum不改。

原用户diff在修复树git apply --check通过，但其用户整文件SHA审核还须在未来组合稿重算；原本地main保留基线，不强行快进或制造三端一致。当前3000旧服务未触碰。具体位置和安全步骤见VERSION_AND_COMPATIBILITY。

## 根因、失败与修复

未改Reader逻辑的生产基线三次均复现已保存short-circuit在SPA后退为错误段。透明包装原存储适配器直接记录：3.3/r1先保存short-circuit，在课程页URL下被旧Reader清理flush写为reverse-result，实际原始前后字符串、updatedAt和调用栈在before-storage-writes。说明问题来自将所有UI几何值提升为latest书签并在清理保存，不是localStorage丢键。未逐帧确定最早哪一次上游滚动改变latest，不把未观测的内部回调当作根因。

修复分离视觉几何与合法阅读动作，仍复用原存储：明确锚点锁定所属合法section，阅读输入后scroll点可保存；挂载/路由/布局自身不写书签；离开只flush已接受点；取消过期计时器、dirty幂等、固定scope与重新activate。普通滚轮、触摸、键盘/主指针、Drawer、直接hash、读完继续工作，不硬编码段落或固定sleep。

首版原路径通过后，真实普通滚轮回归失败：目标已stop-reason，入口仍order-matters。原状态完整保留。新增三项测试证实scrollend/pagehide/unmount可先于UI帧执行，使有效点未被接收；最终版在有效scroll事件同步采样，setState继续rAF，清理不采样过渡DOM。新三项由失败变通过，同一滚轮输入重验成功。详见ROOT_CAUSE_ANALYSIS，不将首版绿色作为最终通过。

## 必要检查

Windows；Node24.16.0、CPython3.14.2、Next16.4.3。所有构建为隔离候选生产，不用dev页面代替。

| 检查 | 结果/证据 |
| --- | --- |
| typecheck | 最终通过，含最终作者Copy校验工具 |
| Lint | 干净修复树0错误0警告；原工作区0错误1既有.workbuddy警告 |
| Node全套 | 最终417/417；首版414通过但后来新增真实回归失败并修复，不隐去 |
| Reader/进度/面板专项 | 最终26/26；另3项P20对象/出版/精确授权检查 |
| prepare:downloads | 16组、3 notebook，生成物无新diff |
| test:python | 160网页例、10组成功/受控错误契约通过，P19有限while入口/10秒保护不改 |
| review:teaching | 63课映射、分层及编辑估时检查通过 |
| 默认Turbopack | exit1，联接依赖不在隔离根内，原失败保留；不宣称根因解决 |
| Webpack | 基线private89页、诊断构建89页、最终preview90页，均真实构建成功 |
| 全局路由 | 最终114/114；旧课程、规划/错误归属404均覆盖 |
| 专项HTTP | 原private10/10，最终preview10/10，3.4实际200 |
| 生产浏览器 | 原3.3路径最终3次、3.4最终3次、其余有限矩阵通过；四宽截图实际查看 |
| 网页代码 | 真实Copy两文件独立执行、6/6 Python DOM同源严格匹配 |

原工作区Lint警告为.workbuddy/py101-p15/audit.ts:23的paragraphs未使用，未改用户忽略目录。干净树没有该警告。默认Turbopack失败为其候选根无法解析外部node_modules中的next/package.json；按用户允许使用Webpack，保留实际失败，不改Next配置冒称已解决。

保留作者检查问题及修复：初次宿主details mock补齐后形成有效4项红测；测试getter断言收窄造成never改用store快照比较；Lint的module变量改名；一次构建与typecheck同时处理.next类型导致TS6053，保留失败并在构建结束后顺序重跑通过；首版测试工具顶部1像素断言/闭包问题保留并纠正，最终版无该失败；Copy首读旧剪贴板被拒绝，第二次真实点击取得主例。Windows多行CLI证据脚本改为可重放文件入口，未以空退出0冒充结果。

## 浏览器和存储证据

final-reader-cases/rows记录最终代码的3.3 short-circuit与3.4 order-matters各三次SPA课程往返+独立reload保持；five-values、reverse-result证明通用；真实滚轮更新stop-reason后返回/reload保持；179/285ms快速离开、reduced-motion、后退/前进、3.2↔3.3↔3.4、完整文档/无hash重开、手机Drawer/H2焦点通过。初始几何UI数字不当成原始存储快照。

原始浏览器写入与Node模拟分开：before/fixed-storage-writes是临时透明包装器记录的真实localStorage，fixed对应首版已修原机制；最终版移除包装器，用生产入口/reload矩阵和实际组件注入测试证明后续修正。INJECTED_STORAGE_REGRESSION仅为Node夹具，83份旧v2修订/v1字符串逐key SHA一致，新3.4/r1单独写；不是学生数据或浏览器真实值。

两份真实Copy原样保存.py（无末尾LF），实际CPython运行分别1/2/3/结束和3/4/5/结束，stderr空、exit0、10秒上限；作者预期为既有独立预解，不从stdout回填。6块网页源码文件名/完整文本按原有限白名单匹配。没有执行漏更新无限循环，也没改P19验证器。所有63 Lesson/Scope、其他62 Publication和旧证据完整一致，精确兼容仍拒绝未知改写。

## 放行与剩余边界

P1在本次Windows Chromium固定矩阵关闭。仅3.4/r1由draft/private进入pending-review/preview，technicalEvidence指本报告；旧3.1–3.3状态不变，PY101 planned，3.5–3.8无注册。P19 private历史和失败保持。PUBLICATION_GATE_DECISION逐项对应十个放行条件。

人工Python教师审稿、中文编辑、真实学生试学、macOS及实体触屏未完成；自动测试/截图不替代这些证据。原开发检出仍P19基线及用户修改，不能称3000服务已更新。为使Reader、完整摘要登记与Publication最终状态自洽，门禁完成后采用单个原子提交；推送远端main后在交付对话核对完整SHA，原检出不强行快进。
