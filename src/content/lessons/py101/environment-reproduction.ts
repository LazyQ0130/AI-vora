import { lessonSchema, type ContentBlock } from "../../models";
import { reproductionCode, reproductionBlockNames, reproductionCommands as cmd } from "../../resources/python-reproduction";
const p = (text: string): ContentBlock => ({ type: "paragraph", text });
const code = (filename: string, text: string, language: "python" | "text" = "text"): ContentBlock => ({ type: "code", filename, code: text, language });
const sample = (key: keyof typeof reproductionCode) => code(reproductionBlockNames[key], reproductionCode[key], "python");
const commands = (key: keyof typeof cmd, location: string) => [code(`Windows · PowerShell · ${location}`, cmd[key].windows), code(`macOS · zsh / bash · ${location}`, cmd[key].mac)];

export const pythonEnvironmentReproductionLesson = lessonSchema.parse({
  id: "PY101-C01-L06", courseId: "PY101", chapterId: "PY101-C01", contentVersion: 2,
  title: "让别人复现一次环境问题",
  subtitle: "把“刚才运行出错”变成可重新操作的条件、文件与记录，再在新会话里验证恢复。",
  prerequisites: "已完成1.1–1.5，能保存运行.py、确认cwd与相对路径、使用项目.venv并核验实际解释器，能在Jupyter重启内核按序全跑。本课组合这些操作，不另教完整调试体系。实际练习需要电脑和已可用的本地Python/Jupyter。",
  prerequisiteLinks: [
    { title: "1.2 当前目录与脚本路径", href: "/learn/PY101/PY101-C01-L02#relative-route", note: "补齐相对路径与cwd。" },
    { title: "1.3 保存后重新运行", href: "/learn/PY101/PY101-C01-L03#save-rerun", note: "先确认提交的源码确实保存。" },
    { title: "1.4 实际环境诊断", href: "/learn/PY101/PY101-C01-L04#observe-env", note: "复制只读观察工具，核对环境身份。" },
    { title: "1.5 从干净内核运行", href: "/learn/PY101/PY101-C01-L05#clean-run", note: "补齐内核状态、重启与全部运行。" },
  ],
  objectives: ["从实际运行中收集位置、环境身份、命令及预期与实际结果，留下必要复现条件", "在新终端或干净Notebook内核中重现受控问题，区分位置、环境与状态并修复", "交付必要源码与简短脱敏记录，保留修复前后结果并在新会话验证恢复"],
  assessmentMap: [{ objective: 1, exerciseIds: ["reproduce-script-issue"] }, { objective: 2, exerciseIds: ["reproduce-script-issue", "recover-notebook-record"] }, { objective: 3, exerciseIds: ["reproduce-script-issue", "recover-notebook-record"] }],
  learningTime: { reading: [10, 15], practice: [8, 12], coding: [22, 30], basis: "editorial-estimate" },
  sections: [
    { id: "unclear-request", title: "“运行出错了”还缺什么？", navGroup: "start", navLabel: "复现条件", blocks: [
      p("你向别人求助：“我运行Python时出错了。”对方拿到同一份文件却运行成功。究竟是文件位置、启动的Python，还是Notebook上一次记住的内容不同？只凭回忆，很难把两次操作对齐。"),
      p("复现就是按明确条件重新操作，观察问题是否再次出现。我们先用一条已经学过的print制造受控的文件定位问题，记下条件；随后换两个情境，练习把记录交给别人。记录要短，但要能据此真正操作。"),
    ] },
    { id: "prepare-case", title: "只准备一个文件定位问题", navGroup: "start", navLabel: "复现条件", blocks: [
      p("在新练习位置建立repro-lab/notice-tool，按1.4准备它的.venv。再建scripts/notice.py，保存下方一条print；源码与环境目录分开。"),
      code("主例布局", "repro-lab/\n└── notice-tool/       ← 本次项目根和cwd\n    ├── .venv/\n    └── scripts/\n        └── notice.py"),
      sample("notice"),
      p("进入notice-tool，pwd确认项目根，dir scripts（macOS为ls scripts）确认文件。用已有诊断核对项目Python，系统/Shell和版本填一次共用环境卡。"),
      p("下面只写错脚本参数，解释器和保存状态保持正确。先预测能否显示Notice N8，再执行本平台命令。"),
      ...commands("badPath", "notice-tool项目根"),
      p("这些是Shell命令，输入终端，不放进.py或Notebook代码格。Windows的&调用引号中的环境解释器；后面的相对路径从当前目录找文件。这里请求的是根下notice.py，而实际文件在scripts内。执行一次，保留自己得到的完整提示。"),
    ] },
    { id: "read-evidence", title: "把命令、输出和错误分开看", navGroup: "observe", navLabel: "错误与恢复", blocks: [
      p("命令记录你做了什么。标准输出（stdout）接收print这样的正常结果；错误输出（stderr）提供故障线索，终端可能把两者显示在同一个窗口。抄录时分别标明，不能把命令或提示符当程序输出。本例应没有Notice N8，因为解释器还没打开脚本。"),
      p("下面是一种Windows文件定位错误的形式，位置用占位符表示。重点找出哪个解释器打不开哪个目标；自己取证时保存相关完整提示，不用照抄教材路径。"),
      code("主例实测stderr · 项目位置已脱敏", "<项目根>\\.venv\\Scripts\\python.exe: can't open file '<项目根>\\\\notice.py': [Errno 2] No such file or directory"),
      p("退出状态是程序返回Shell的辅助信号：Python通常以0表示正常完成，非零表示失败。原因还要结合错误行。"),
      p("紧接刚才的Python命令执行下方观察行，避免先运行别的外部程序覆盖状态。echo是Shell命令，放在终端。"),
      ...commands("exit", "紧接刚才的Python命令"),
      p("这个文件定位例常见退出状态为2，修复后为0，以自己实际结果为准。未知字段写“尚未核实”，可重新执行目标命令后立即核对，别编造数值。"),
      { type: "table", caption: "两类失败发生的位置不同", columns: ["现象", "已发生什么", "先核对什么"], rows: [
        ["can't open file，目标路径不存在", "解释器已启动，目标源码还没开始执行", "cwd、脚本参数、真实文件位置"],
        ["Notebook中的NameError，提到某个名字", "代码已交给内核执行，但当前状态缺少该名字", "实际内核、重启动作、提供名字的格是否先执行"],
      ] },
      p("长回溯要连同出错代码行和相关末行保存；不要只截NameError一个词。若出现与预期不同的故障，先记录事实再检查条件，不把真实错误改写成教材预期。"),
    ] },
    { id: "repair-replay", title: "只改脚本参数，再开一个终端", navGroup: "observe", navLabel: "错误与恢复", blocks: [
      p("保持notice-tool为cwd，继续使用原来的环境Python和已保存源码，只把参数改为实际的scripts/notice.py。先写下预期，再执行下方本平台命令。"),
      ...commands("goodPath", "notice-tool项目根"),
      code("修复后实测stdout", "Notice N8"),
      p("参数指到真实文件后，应看到Notice N8，stderr为空、状态0。保持同一cwd、解释器和源码，只对照两条脚本参数，就能说明修复了哪里。"),
      p("新开一个独立终端窗口或终端标签，重新进入notice-tool并用pwd核对位置。不要依赖旧终端的激活状态；按记录明确指定同一环境Python，先执行错误参数，再执行正确参数，分别保存实际结果。这证明当前机器上按这些条件能重现并恢复；另一台机器的绝对路径、版本与报错文字仍可能不同。"),
    ] },
    { id: "minimal-record", title: "六项短记录，让别人知道怎样重做", navGroup: "record", navLabel: "记录与交接", blocks: [
      p("把已有材料压成下面六项最小复现单：别人需要知道起点、操作、预期和实际差异，以及怎样恢复。相同环境和命令可引用一次编号；不适用写明，未知项注明核查办法。"),
      code("可复制的最小记录", "1 目标与预期：运行哪个文件，期望什么输出/环境？\n2 环境身份：系统；Shell；Python版本；实际解释器；Notebook内核（脚本题不适用）\n3 位置：项目根；cwd；实际目标文件（相对项目根）\n4 操作：原样命令，或重启动作与单元格实际执行顺序\n5 结果：stdout；首个相关错误全文及上下文；退出状态（不适用时注明）\n6 恢复：只改了什么；新命令/顺序；实际输出；新会话复验及未核实项"),
      p("主例中，目标是scripts/notice.py，cwd是notice-tool根。单里保留错误与修复参数，并附源码，接手者才能真的照做。"),
      p("Notebook格错误没有普通脚本退出码，该栏写“不适用”；改记内核身份、重启条件、实际格顺序与相关回溯。"),
      p("本地用真实位置核对；对外将共同前缀换成<练习根>，保留target/other等后缀。接手者换成自己的位置后，仍能分清两个项目与解释器。占位符不是实际目录。"),
      p("交接只附必要源码、Notebook和最小复现单。密码、token、私有文件、整个.venv和机器配置不公开；也不收集完整PATH或全部环境变量。"),
      p("同机新会话验证后，若尚无另一人操作，就写“同机已复验，真人接手待验证”。"),
    ] },
    { id: "script-handoff", title: "输出正确，为什么还需要修复？", navGroup: "practice", navLabel: "两道独立任务", blocks: [
      p("这次用新的handoff-lab布局，目标是target的程序必须由target自己的环境运行。按1.4分别建立两个项目环境，保持现有系统Python，不需要不同版本或装额外包。把run.py和现成observe_env.py保存到target。"),
      code("练习一布局", "handoff-lab/\n├── target/           ← 本题cwd\n│   ├── .venv/\n│   ├── run.py\n│   └── observe_env.py\n└── other/\n    └── .venv/"),
      sample("target"),
      p("下面是1.4已用过的只读工具，原样保存为observe_env.py，并用与run.py相同的解释器运行。比较Interpreter与Environment的目标后缀，公共基础/版本可引用环境卡。"),
      sample("environmentProbe"),
      p("从target根执行下列受控故障命令。它们使用other的Python，但脚本仍是target内的文件；先预测普通文字与环境身份各会怎样，再真实运行。"),
      ...commands("wrongRun", "target项目根"), ...commands("wrongProbe", "target项目根"),
      { type: "exercise", id: "reproduce-script-issue", title: "交付脚本环境错配的复现记录", kind: "实验",
        prompt: "自己建立handoff-lab的两个环境与给定run.py、observe_env.py。事前记目标环境及预期，真实复现错环境仍正常打印，再依实际身份独立修复。新开终端按单复现错配与恢复。交两份.py和一份六项最小复现单，前后Interpreter/Environment及实际结果须保留。六项最小复现单只记：①目标与所附文件；②系统/Shell/Python版本（可引用共用卡）；③起点cwd与实际解释器/内核身份；④操作命令或格顺序及起始状态；⑤预期与相关真实输出/错误、适用的退出状态；⑥修复与新会话复验。重复字段引用编号，未知说明核查办法；不附完整PATH或环境变量。 对外路径用一致占位映射；同机复验不能写成真人已接手。",
        hints: ["把“想使用哪个项目的环境”与观察工具实际报告的位置比较；普通文字能区分两个Python吗？", "先确认cwd和源码都属于目标，再看命令中负责启动Python的那一段，与脚本参数分别对应什么。找出需要改变的条件，并用同一观察工具检查改动效果。"],
        solution: [
  "保存两份源码，cwd保持target，核实两个环境文件存在。错误环境运行时普通输出仍可能Target R9、状态0，诊断Interpreter/Environment却位于other/.venv；这就是本题已知错配，无需制造Python异常。",
  "只把启动解释器改为target自己的环境。Windows从target执行：& \".\\.venv\\Scripts\\python.exe\" .\\run.py，再& \".\\.venv\\Scripts\\python.exe\" .\\observe_env.py；macOS：./.venv/bin/python run.py，再./.venv/bin/python observe_env.py。两次普通输出都可为Target R9，恢复证据是实际解释器和环境前缀回到target/.venv。",
  "新终端重新进入target，核对位置后用明确路径先重现other身份、再验证target身份。保存各次实际命令和诊断，六项记录附必要源码；相同版本不意味着同一环境。",
  "常错是看到文字成功就结束、只改VS Code状态栏而未重跑诊断、脱敏时把target/other都删掉。可用明确绝对路径或已核验的编辑器入口等价恢复，但交接仍须说明cwd和实际启动方式，并用新会话证明；不需要复制.venv。",
  "交付按本题题干与rubric：源码可用一份加差异，运行记录用短表；相同命令、环境和版本引用会话卡，不重复誊写。"
],
        rubric: [
  "实际两个环境/两份源码，最小单保留目标、cwd、平台版本引用、身份、命令顺序及相关输出/状态。",
  "真实复现正常输出掩盖身份错配，并以正确环境恢复证据定位修复。",
  "新终端按单再次复现和恢复，必要字段可复用、无冗余环境转储，不虚构同伴或跨机器验证。"
],
      },
      { type: "quiz", id: "normal-output-wrong-identity", question: "run.py正常输出Target R9且状态0，能证明使用target环境了吗？", options: [
  "退出状态0就代表选中了目标环境",
  "run.py放在target目录会强制任何Python切换为target环境",
  "用同一启动选择运行诊断，核对Interpreter/Environment与target要求"
], correct: 2, explanations: [
  "0支持程序正常结束，不能证明环境身份。复现题中错误环境也能正常结束。",
  "脚本位置没有替你选择解释器。保持脚本参数不变，只换解释器并诊断可验证。",
  "目标与实际身份相对照才能定位错配；复现单还要保留cwd与操作顺序。"
] },
    ] },
    { id: "notebook-handoff", title: "补全一份Notebook求助记录", navGroup: "practice", navLabel: "两道独立任务", blocks: [
      p("另一条求助说：“Notebook某格报错，刚才还成功。”别人还不知道实际内核、起始状态和格顺序。沿用1.5已可用的Jupyter，在目标项目打开review-note.ipynb，亲自补齐这些条件。"),
      { type: "downloads", resourceIds: ["review-notebook-file"] },
      p("文档先有Markdown说明，再把以下两行分别放在两个Code格。回顾1.5：先运行赋值格，当前内核才记住batch_label对应的文字；print(batch_label)读取当前对应值，print(\"batch_label\")只会打印引号里的文字。这里仍只用最小赋值与名称读取。"),
      sample("assign"), sample("show"),
      p("末尾保留下面的现成只读观察格，在Notebook代码格运行，观察实际Python是否属于目标.venv。import/sys仅作已提供的工具，不要求独立编写。按1.5核对Kernel选择；同一个Python 3标题不能代替路径证据。"),
      sample("kernelProbe"),
      { type: "exercise", id: "recover-notebook-record", title: "用真实内核补齐缺失的复现条件", kind: "实验",
        prompt: "先指出原求助缺少的起始状态与执行顺序。在目标环境打开review-note.ipynb，核对内核，明确重启后先预测并执行显示格，留真实错误与相关代码，独立恢复。再重启按文档顺序全跑，确认Checked F3，保存后重新打开检查。交本人.ipynb和六项最小复现单。六项最小复现单只记：①目标与所附文件；②系统/Shell/Python版本（可引用共用卡）；③起点cwd与实际解释器/内核身份；④操作命令或格顺序及起始状态；⑤预期与相关真实输出/错误、适用的退出状态；⑥修复与新会话复验。重复字段引用编号，未知说明核查办法；不附完整PATH或环境变量。 Notebook格错误的普通脚本退出码写不适用，保留相关完整回溯；已有文档输出不再另抄，最后按1.5关闭自己的会话与服务。",
        hints: ["“刚才成功”没有说明当前内核从重启后执行过什么。接手的人要怎样知道起点和操作相同？", "找到提供显示格所需名字的那格，核对它是否在当前内核执行；把内核身份、重启动作、实际顺序与完整相关错误补进记录，再设计一次不依赖旧状态的验证。"],
        solution: [
  "缺少目标/实际内核、Python版本、是否重启、具体格源码、真实执行顺序和错误全文等信息。先用观察格核对目标.venv，再明确重启；只关网页可能重连旧内核。",
  "新内核先执行print(batch_label)，实际应有NameError说明batch_label尚未定义。保留回溯中的代码行、末行及顺序；赋值文本虽然已保存，却未在这个新内核执行。",
  "运行提供名字格，再运行显示格，应为Checked F3。保持文档中赋值在使用前，明确重启并从头全部运行，检查无错、输出和目标内核一致；保存，重新打开核对真实文件。",
  "记录故障起点和修复后操作，包括何时重启、各格怎样执行、实际输出。Notebook错误的脚本退出码写不适用。保存的代码/文字/输出并不将运行中的名字自动装入新内核。",
  "常错是只交旧输出、不写重启条件、删错误格当修复。接受依赖合理的等价排列、全新内核会话或先重启再Run All；都须保留实际故障、干净完整执行与文件证据。新会话技术复验尚不能写成同伴成功复现。",
  "交付按本题题干与rubric：源码可用一份加差异，运行记录用短表；相同命令、环境和版本引用会话卡，不重复誊写。"
],
        rubric: [
  "指出原求助缺项，目标内核重启后确实复现乱序错误，保留格顺序与相关完整回溯。",
  "合理恢复，重启后按文档顺序全跑，真实Checked F3与目标内核对应。",
  "保存重开核对文件，最小单让接手者知道cwd/内核/起始状态/顺序；已有输出不抄两份，不虚构他人操作。"
],
      },
    ] },
    { id: "chapter-handoff", title: "第一章结束，留下能重新核对的文件", navGroup: "finish", navLabel: "章末交接", blocks: [
      p("保留两题真实文件与最小复现单。新会话里先重现、再恢复，能检查记录是否足够；再由另一人照做，才有真人接手复现的证据。"),
      p("第一章的前三节让你写出并可靠重跑短程序，后三节补项目环境、Notebook与协作复现。接着进入2.1，在普通.py里系统学习变量的赋值、读取和更新。第5章函数还依赖表达式与控制流程等中间知识，按先修顺序补齐后再读。"),
    ] },
  ],
  resources: [{ id: "review-notebook-file", title: "review-note.ipynb", href: "/downloads/review-note.ipynb", format: "Notebook", description: "第二题起始材料，空输出、默认可按序运行；仍须自行复现故障、补记录并干净重跑。" }],
  references: [
    { title: "Python命令行", href: "https://docs.python.org/3/using/cmdline.html", note: "脚本参数及执行条件。" },
    { title: "Python错误与异常", href: "https://docs.python.org/3/tutorial/errors.html", note: "回溯与NameError；本课不教异常处理。" },
    { title: "sys运行身份", href: "https://docs.python.org/3/library/sys.html", note: "实际解释器与环境前缀。" },
    { title: "Notebook运行代码", href: "https://jupyter-notebook.readthedocs.io/en/stable/examples/Notebook/Running%20Code.html", note: "内核状态及重启。" },
  ],
});
