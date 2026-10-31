# 两张原创关系图

确定性来源 scripts/render-py101-runtime-diagrams.ts；SVG母版在 diagram-sources/，四PNG在 public/learning/py101/。使用已有Sharp依赖，不新增运行时库。复用现行ContentBlock image及picture移动图；没有改Schema、ContentRenderer或用户原Reader，没有冒用linear-regression。

1.4 direct-run：终端容纳Shell和cwd，Shell启动实际Python，Python读取并执行.py；cwd到脚本的箭头标出相对路径解析。图中给出直接调用/激活后核对两方式，并指出同版本仍可不同环境。正文两短段解释命令两半与PowerShell &，随后身份工具验证；压短原有重复解释，不只加一张装饰图。

1.5 kernel-check：浏览器与服务器双向，服务器分别打开/保存文件、转交内核执行并接收结果；文件与内核分列。图替换原三对象表。内核存运行状态，.ipynb存代码/说明/已保存输出；保存不等于全部内存，服务器Python与Kernel必须分别核验。正文按两条通路给文本等价，alt和caption均写关键区别。

事实核对见 SOURCE_FACTS.md。架构图是本课普通本地Notebook的教学层次图，并未声称列出Jupyter所有组件或浏览器直连/远程部署的全部协议。

移动稿为340逻辑宽的专门排布，不把桌面四对象横图直接缩成320px。320视口内实际图宽254px，最小关键标签19逻辑像素约14.2 CSS像素，其他20–24约14.9–17.9；正文维持16px。桌面/768用宽图，390/320用窄图。箭头标签加底色描边以免线条穿字。

实际生产浏览器四宽度检查图源选择、加载、alt和尺寸；八张 diagram-*-*.jpg与DIAGRAM_BROWSER_CHECKS.json保留证据。首轮768截图遇平滑定位尚未结束，后续单独等待工具往返并重新取图，不将未在视口的图冒称已视觉验收。两个320图已逐张查看中文/箭头/裁切；桌面、平板与手机亦查看最终截图。图片可查看原图，周边文本等价保留。
