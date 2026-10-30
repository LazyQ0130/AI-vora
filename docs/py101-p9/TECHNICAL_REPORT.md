# PY101-P9 技术验收

2026-10-30。唯一新增PY101-C02-L02，初始r1/order2/optionalLesson=false。真实draft/private对象不可解析、目录无href；草稿生产构建106条HTTP与新课浏览器404通过。隔离候选先投影preview，生产浏览器门禁完成后，正式源码才改为pending-review/preview，技术依据指向本文。没有reviewEvidence或人工签署，不升reviewed/pilot/published。PY101仍planned。

## 代码与真实执行

环境为Windows 10.0.26300、PowerShell7.6.5、Node24.16.0、Next16.4.3、CPython3.14.2，原有全站Python环境含NumPy2.5.2；本课不要求第三方库，不升级Python。官方网页版本与安装版本分别见SOURCE_FACTS.md。

先写EDITORIAL_BRIEF/PRE_SOLUTIONS，再运行、起草、第二轮重算。23次保存.py并逐次新PowerShell进程实跑，保存源码SHA、命令、cwd、实际Python版本、stdout/stderr/退出码于PYTHON_RUNS.json；机器前缀脱敏，未脱敏原始记录只留外部作者实验目录。

- 11份同源程序/片段：相同显示、测量、真假与文字、单项type、成对type、状态type、完整主例、重绑定和两题参考（第二题含改后值）。片段只补明示赋值上下文；实际还运行了两份完整追加组合，避免仅证明孤立片段。
- 7份替代/组合：两份追加组合、单引号、False与文字False、17.0、17、自选茶具四值；另保存同一个my_measure.py从数值1.5改为文字"1.5"后重跑。
- 3份真实错误：小写true、false实际NameError，缺一边引号实际SyntaxError，退出1、stdout空，保留stderr。不把失败样例改报成功。

主例真实八行依次为3、3、1.5、True、`<class 'int'>`、`<class 'str'>`、`<class 'float'>`、`<class 'bool'>`，与先写的预期一致。同名8→"8"普通显示相同，type为int→str；新12→"12"与27→"27"也真实核对。说明当前值的类型，不把赋值说成旧值原地转型。float精度边界保留，bool与int不作错误割裂，也不提前引入其继承教学。

## 最终工程检查

| 检查 | 用户工作区 | 干净候选 |
| --- | --- | --- |
| npm run typecheck / lint | 各退出0 | 各退出0 |
| npm test | 330/330，0失败/跳过 | 329/329，0失败/跳过 |
| npm run prepare:downloads | 16组旧Python/Notebook及3份分段Notebook，同源重建无diff | 同样通过 |
| npm run test:python | 25单元测试、82网页块、10组核心/完整比较通过 | 同样通过 |
| npm run review:teaching | 55节目标/估时/分层清单输出成功 | 同样通过 |
| 生产构建 | npm run build，默认Turbopack退出0，82静态页 | npm run build -- --webpack退出0，82静态页 |
| npm run test:routes | 最终preview生产3020，106/106 | preview生产3021，106/106 |

各命令实际结果分别存ENGINEERING_WORKSPACE.json、ENGINEERING_CLEAN.json；工作区多1项为用户原有Reader专项测试，不把数量差视为缺测。干净候选从基线Git归档与明确任务文件生成，排除4份原修改及7项未跟踪内容，复用node_modules联接，因此采用支持的Webpack构建；未声称干净Turbopack通过。最终13个任务代码文件与干净候选逐份LF摘要相同，所有产品src与浏览器构建输入相同，见CLEAN_CANDIDATE.json。完整原始日志在忽略的作者目录，提交聚焦证据，不重复整站大快照。

最终preview首轮Node检查在两边各失败1项：旧1.6测试直接使用发布清单接入倒序，和目录order正序不符。仅为期望值按order排序并登记精确源码差异，保留历史快照与断言；复跑全套通过。旧2.1“第二章仅2.1”与相邻假设也改为当前清单核对，新增专项仍明确验证2.1→2.2与2.3–2.6无注册，未加永久总数断言或放宽历史内容保护。作者日志助手一次在测试已退出0并写日志后遇到GBK输出编码错误；修正助手UTF-8显示后续跑剩余命令，未将该工具异常伪报为npm失败或跳过测试。

8项新Node测试覆盖身份/双门禁、3目标2代码题、分层反馈、同源与边界、输出契约、23份真实记录、2.1精确末段比较、动态导航、全部旧课/旧修订进度隔离。网页Python校验增加本课明确分支，旧2.1受控NameError等契约保留；未知或被改写的本课代码、缺行、错误类型、非零退出与stderr均不能蒙混通过。聚焦结果见WEB_PYTHON_RESULTS.json；教学结构结果见TEACHING_CHECK_SUMMARY.json，不将结构覆盖当作效度证明。

## 浏览器、历史与原文件保护

四档真实生产浏览器、代码与类型输出原生复制、8节点锚点/焦点、两题6个提示/答案折叠项、rubric、导航、恢复、旧r1/r2记录隔离、课程筹备和错误归属均通过，详见BROWSER_REPORT/BROWSER_RESULTS。初次高层剪贴板桥接返回旧剪贴板，保留诊断后以原生读回确认真实按钮结果，未改产品。规划2.3–2.6四条HTTP404、错误课程404及2.1/2.2/课程页合计8/8见P9_ROUTES；全量106条见ROUTE_RESULTS。

基线54份旧Lesson与Publication中，除2.1获准末段/技术依据指针外其余53份对象完全相同；481份受保护文件清单按精确允许变更与用户原差异审计。2.1全对象只替换最后paragraph后相等，目标/考核/锚点/版本/进度scope完全相等，维持r1理由及前后原文见TRANSITION_AMENDMENT。旧P6/P7/P8报告、第一章、第5章、AI000、MA101、下载与课程事实未覆盖。复用原兼容登记器登记9份既有源码精确差异，不新增兼容框架或扩大豁免。

原4份修改与7项未跟踪文件共11个实际文件逐字节保留，见WORKSPACE_PROTECTION。Next构建自动改写next-env.d.ts后已按开工备份还原，未暂存用户文件。无删除、stash、reset-hard、强推或进度清空。

## 交接限制

专业Python教师、中文教学编辑、真实零基础学生、macOS实机均未开展；阅读12–18、练习6–10、代码12–18、合计30–46分钟仍编辑估计。AI辅助二轮复核不替代人工。旧审核欠账继续保留，不填写通过率、成绩、签署或学习有效性结论。本课无已知技术阻断，是否进入2.3编写需下一轮明确安排，并保留上述人工与试学工作；本轮不开发2.3。
