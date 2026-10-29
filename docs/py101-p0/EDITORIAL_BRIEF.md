# 1.1课前编辑简报

2026-10-29；基线 `81feeb132336e499bbc05d346cbe5d9710472723`。开写前fetch完成，HEAD/main/origin/main一致。用户已有4个跟踪文件修改和若干未跟踪附件，见BASELINE_STATUS.txt；内容、清单、下载及用户修改的SHA256见BASELINE.json。

```yaml
courseId: PY101
chapterId: PY101-C01
lessonId: PY101-C01-L01
audience: L1，完全没有写过程序，可能非计算机专业
coreQuestion: 怎样把自己写的文字保存成Python程序，并在本地确认运行的是这份文件？
prerequisites:
  - 会启动软件、输入英文符号、创建文件夹和保存文件；不要求AI000
objectives:
  - 在本地确认解释器版本，并用自己的运行记录区分代码文件、解释器和输出
  - 独立修改并运行一个.py文件，先预测再核对print产生的逐行结果
  - 根据文件位置或报错定位一次运行失败，并验证恢复后的结果
mainExample:
  scenario: 让电脑显示一条问候，再显示当前文件的名字
  givens: 两条print，均为教学构造的文字，无外部数据
  expected: 交互输出Hello, Aivora!；脚本两行Hello, Aivora!和File: first_run.py
core:
  - 尽早一行输出 → 安装分支 → print解释 → 保存脚本 → 当前目录运行 → 修改 → 排错 → 两道独立任务
optional:
  - 无进阶教学；完整工程验证留在维护文档
assessmentMap:
  - objective: 1
    exerciseIds: [own-message]
  - objective: 2
    exerciseIds: [own-message]
  - objective: 3
    exerciseIds: [find-script]
figures:
  - 零图；逐条操作与预期、故障对照已能表达所需信息，无截图配额
code:
  - 标准库内置print，无第三方依赖；新安装选受支持稳定3.x，语法兼容3.10+
references:
  - 见SOURCES.md，官方Windows/macOS/下载页/解释器/print/IDLE，2026-10-29核验
openQuestions:
  - 干净Windows安装、无管理员设备与macOS尚未亲测
  - 真正零基础学生能否独立辨认终端与>>>，须真实试学
```

## 目标—正文—核心练习

| 正式目标 | section.id 教学支点 | exerciseIds | 独立证据 | 提示/答案/rubric检查 | 人工复核 |
| --- | --- | --- | --- | --- | --- |
| 1 确认版本、区分三者 | first-output、local-python、save-script、run-script | own-message | 自己的版本命令结果、文件位置、运行命令、真实输出；一句话指出解释器/文件/输出 | 方向提示不提供文本；二级只拆动作；参考值只是一个示例 | 待人工判断充分性 |
| 2 修改并运行 | print-text、save-script、run-script、change-message | own-message | 自选主题两行改写及新增第三行；运行前预测与运行后比对；最终源码 | 任意合理文本、单/双引号、python或py/mac python3均接受 | 待人工审阅与学生试学 |
| 3 排错并验证 | locate-errors | find-script | 在新文件夹中复现路径错误，依据文件清单恢复；修复前后命令及输出 | 一级看位置，二级分解查看目录/实际名称；两种合法恢复路径；拒绝盲目重装 | 待人工观察学生过程 |

Quiz仅区分文件/解释器/结果，不承担目标验收。页面输入框仅临时自查，不自动评分；真实源码和运行结果保存在本地。

## 起草前独立预期

逐条从文字内容和print默认换行规则推得，未从程序输出倒填预期：单行 `Hello, Aivora!\n`；初始两行 `Hello, Aivora!\nFile: first_run.py\n`。示范变化选「Reading plan」「File: first_run.py」「Next: run again」为三行；学生自选文字不设唯一答案。第一行引号缺失时文件解析失败，stdout为空、非零退出；从不含脚本的工作目录传入相对文件名时文件打开失败、非零退出。忘保存则磁盘源码/输出保持旧内容；不同目录同名文件按命令实际路径决定输出。

版本选择只介绍运行命令的必要关系；不教def、变量、模块、try/except、虚拟环境和Notebook。macOS用官方IDLE保存纯文本；Windows用记事本UTF-8与所有文件类型防止.py.txt。下载通过既有资源管线同源生成，教材只要求.py。
