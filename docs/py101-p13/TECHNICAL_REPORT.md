# P13技术验收

2026-10-30开工，2026-10-31完成验收（Asia/Shanghai；JSON保留各工具实际UTC时间）。唯一新课2.6/r1/order6/非可选。正式源码先draft/private，取得不可解析、目录无href、生产110路由全部通过且本课404、真实IAB不存在页面；再从基线导出干净preview候选完成工程/生产浏览器。16项确认检查通过后才提升正式清单并勘误2.5末段，最终工作区又完整构建及110路由通过。PY101仍planned，无reviewEvidence，第三章没有新增规划/注册/正文。

## Python与交互

EDITORIAL_BRIEF、SOURCE_FACTS、PRE_SOLUTIONS均先于本轮新程序执行，预解未从stdout倒填。实际Windows10.0.26300、PowerShell7.6.5、CPython3.14.2、Node24.16.0、Next16.4.3；官方3.14网页补丁3.14.10与安装版本分开。既有全站Python使用NumPy2.5.2，新课无库依赖。未改系统策略、全局PATH或用户Python环境。

PYTHON_RUNS记录22次保存.py/重读SHA/真实新进程：普通字符串保留字面{total_mass}，f-string插入6.0，中文单位输出正确；分步接收、计算版及完整主例真实stdin；Parcel/4/1.5为6.0/T，Crate B/4/2.5为10.0/T，Crate C/4/3.0为12.0/F，另陌生Bundle D/2/2.25为4.5/T。题一横幅两组4.5/5.0米及陌生3.75米，题二固定12米下9.0/T、12.0/T、15.0/F及陌生12.0/T均实际运行，同源码多次仅输入改变。

两项失败独立契约：错拼total_mas在第2行NameError，无正常print；修为total_mass后同文件新PID正常输出。主例件数4.5在第5行int处ValueError、stdout仅已出现的三提示，重新启动合法输入恢复。原始stderr/退出1与成功0分别保留，不用其他异常充当预期失败，不扩张学生核心错误教学。

所有12个网页Python块通过文件名/精确同源源码登记，逐块真实执行保存文件、提供对应stdin（不需要输入的明确为空）、完整stdout/stderr/退出契约，10秒超时防止等待。12块共22组合，未知源码/输入组合、缺失或错误stdin、错输出/退出、无关错误必须拒绝，旧课严格校验不放宽。WEB_PYTHON_RESULTS提取本课详情，全站25单测、126网页块、10组核心/完整版一致均通过。

TERMINAL_INTERACTION另保留同一新建交互PowerShell里的两次真实ConPTY运行：Shell命令→Item等待→工具输入/Enter→Count→Mass kg→四行摘要→实际Shell提示重新出现；等值10.0确为True。程序源SHA与同源一致。工具键入不是学生或真人试学，未声称终端GUI截图；终端流含回显/控制序列/Shell提示，不能当纯stdout。自动管道原始stdout则提示紧邻第一条print，没有伪造回显或重排。

公开仅替换工作路径前缀、终端标题和偶发无关Shell历史建议，原始留忽略作者目录；Python输出顺序保持。关闭自建Shell时原始控制字节没触发行编辑，错误尝试如实保留，最终在新提示符输入普通exit正常退出0，没有更改用户终端配置。

## 工程结果

| 检查 | 最终工作区 | 干净候选 |
| --- | --- | --- |
| typecheck / lint | 退出0 | 退出0 |
| npm test | 362/362，失败/跳过0 | 361/361，失败/跳过0 |
| prepare:downloads | 16组Python/Notebook、另3份Notebook，退出0 | 同上 |
| test:python | 25单测/126网页块/10组一致通过 | 同上 |
| review:teaching | 59节结构矩阵，退出0 | 同上 |
| npm run build | 默认Turbopack退出0 | 默认Turbopack退出1，Webpack退出0 |
| test:routes | 110/110，生产3028 | 110/110，生产3029 |

工作区多1项是开工已有Reader测试。干净候选由git archive基线加12份明确任务代码导出，排除原4修改/7附件；复用现有node_modules联接，不安装依赖或改配置。外部候选默认Turbopack真实报Could not find the Next.js package，根外依赖限制未修复；错误全文脱敏留CANDIDATE_BUILD_LIMITATION。依据本地Next指南支持的npm run build -- --webpack成功生产构建并start验收，未宣称默认构建成功或根因解决。

CLEAN_CANDIDATE逐项核12份任务代码（8改4新）LF摘要，最终工作区与干净检查/浏览器构建输入相同，最终报告仅文档补充。8项专项检查覆盖身份/门禁、目标两题、简单f字段和不超纲、字面/f/单位/边界输出及失败拒绝、真实记录、精确勘误、六槽位/无第三章/导航/planned及旧版本进度隔离。旧P12断言按实际动态注册适配，不删旧测试/快照、不加固定全站课数门槛、不扩大未知变更豁免。

## 保护与精确勘误

基线HEAD/origin/main为dde3a4582bce48ccf64c83ac298c1b93711a6fd8。原4份跟踪修改、7份未跟踪文件共11份字节/SHA不变，见WORKSPACE_BASELINE/PROTECTION；真实附件路径和备份只在忽略作者目录。Next生成next-env变化仅在核对是已知生成差异后还原开工字节，不用HEAD覆盖用户修改。无删除、stash、reset-hard、强推、进度清空或历史报告改写。

2887份原内容/脚本/测试/资源/curriculum/docs按指纹审计；58个旧Lesson/Publication中57全对象不变。唯一2.5全对象只替末段paragraph后相等，Publication仅技证指针；正式目标、映射、两题、提示/答案/rubric、源码、锚点、学时、r1及progressScope不变。旧下载、第一章/前四节/第5章/AI000/MA101/ML等保持。原兼容登记器按完整摘要精确还原，未知额外改写继续暴露。

## 浏览器与剩余边界

BROWSER_REPORT/RESULTS及四截图记录1440/768/390/320、10目录节点/7组/3目标/2题、六提示解答/rubric、参考完整代码、锚点焦点、f/引号/花括号/冒号空格换行、2.5衔接、章末先修、错误归属404、课程planned/第二章六链接、无第三章链接、新r1重载与旧r1/r2原字符串保持。16确认项通过，控制台error/warn为空。320整页内容305宽无溢出，主代码254/332，局部键盘横滚。

工具虚拟剪贴板三次返回旧源码并粘贴旧文本，逐次留诊断；实际复制按钮与原生navigator.clipboard读取确认完整主例及手机最小f-string精确一致。没有用虚拟粘贴失败冒称通过，也未修改权限/环境或宣称根因修复。中断后新开自建页继续，实际视口重新设置；一次节点错误/summary角色匹配经新状态和原生details定位恢复，不是产品修改。

技术通过支持pending-review/preview，不能替代教师、中文编辑、真实零基础学生、macOS实机或42–62分钟editorial-estimate校准。第一章及2.1–2.5历史人工欠账继续。另只读确认前四节末段仍有旧时点规划句，超出本轮仅2.5末段授权，未改；具体下一轮交接见DELIVERY_REPORT。第二章六节技术齐备不等于整章教学发布通过。
