import { lessonSchema, type ContentBlock } from "../../models";
import { reproductionCode, reproductionBlockNames, reproductionCommands as cmd } from "../../resources/python-reproduction";
const p = (text: string): ContentBlock => ({ type: "paragraph", text });
const code = (filename: string, text: string, language: "python" | "text" = "text"): ContentBlock => ({ type: "code", filename, code: text, language });
const sample = (key: keyof typeof reproductionCode) => code(reproductionBlockNames[key], reproductionCode[key], "python");
const commands = (key: keyof typeof cmd, location: string) => [code(`Windows · PowerShell · ${location}`, cmd[key].windows), code(`macOS · zsh / bash · ${location}`, cmd[key].mac)];

export const pythonEnvironmentReproductionLesson = lessonSchema.parse({
  id: "PY101-C01-L06", courseId: "PY101", chapterId: "PY101-C01", contentVersion: 1,
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
      p("在自己的练习位置新建repro-lab/notice-tool，按1.4为notice-tool准备.venv。用编辑器建立scripts目录和notice.py，保存下列源码。print和引号里的文字来自1.1，这里无需新Python语法。文件位于环境目录之外。"),
      code("主例布局", "repro-lab/\n└── notice-tool/       ← 本次项目根和cwd\n    ├── .venv/\n    └── scripts/\n        └── notice.py"),
      sample("notice"),
      p("在终端进入notice-tool，先用pwd确认当前目录，Windows用dir scripts、macOS用ls scripts确认源码位置；使用1.4的现成诊断核对本项目Python路径与版本。把实际系统和Shell名称一起记下。下面的命令只故意写错脚本参数，环境和文件保存状态均保持正确。先预测：它会显示Notice N8，还是还没执行源码就失败？"),
      ...commands("badPath", "notice-tool项目根"),
      p("这些是Shell命令，输入终端，不放进.py或Notebook代码格。Windows的&调用引号中的环境解释器；后面的相对路径从当前目录找文件。这里请求的是根下notice.py，而实际文件在scripts内。执行一次，保留自己得到的完整提示。"),
    ] },
    { id: "read-evidence", title: "把命令、输出和错误分开看", navGroup: "observe", navLabel: "错误与恢复", blocks: [
      p("命令记录你做了什么。标准输出（stdout）接收print这样的正常结果；错误输出（stderr）提供故障线索，终端可能把两者显示在同一个窗口。抄录时分别标明，不能把命令或提示符当程序输出。本例应没有Notice N8，因为解释器还没打开脚本。"),
      p("下面是本轮Windows、Python 3.14.2的实际错误，项目绝对位置已换为占位符。自己的错误文字可能不同；要辨认“哪个解释器无法打开哪个文件”，保留第一条相关错误及必要上下文，而不只交一个Errno关键词。"),
      code("主例实测stderr · 项目位置已脱敏", "<项目根>\\.venv\\Scripts\\python.exe: can't open file '<项目根>\\\\notice.py': [Errno 2] No such file or directory"),
      p("退出状态是外部程序结束时返回给Shell的辅助信号。Python通常以0表示正常完成，非零表示失败，不能只靠一个数字判断原因。在刚才的Python命令后立即执行对应观察行，中间不要先运行其他外部程序。echo在这里让Shell显示上次状态，不是Python的print，也不用把它写入源码。"),
      ...commands("exit", "紧接刚才的Python命令"),
      p("本轮文件定位失败实测为2，修复后为0；记录自己实际得到的值，不必逐字背诵这个版本的错误。若无法确认字段，写“尚未核实”及下一步核查方式；例如重新执行目标命令后立即观察退出状态。"),
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
      p("本轮修复后stderr为空、退出状态0。原因是脚本参数现在从同一个cwd指向真实文件；没有更换解释器，也没有改源码。保留两条命令，才能看出究竟改了什么。"),
      p("新开一个独立终端窗口或终端标签，重新进入notice-tool并用pwd核对位置。不要依赖旧终端的激活状态；按记录明确指定同一环境Python，先执行错误参数，再执行正确参数，分别保存实际结果。这证明当前机器上按这些条件能重现并恢复；另一台机器的绝对路径、版本与报错文字仍可能不同。"),
    ] },
    { id: "minimal-record", title: "六项短记录，让别人知道怎样重做", navGroup: "record", navLabel: "记录与交接", blocks: [
      p("主例做完后，把已有证据整理成下面六项，每项几行即可。目标是让接手的人知道从哪里开始、做什么、比较什么。真正不适用的字段写“不适用”；尚不清楚的字段写“尚未核实”并列核查办法。"),
      code("可复制的最小记录", "1 目标与预期：运行哪个文件，期望什么输出/环境？\n2 环境身份：系统；Shell；Python版本；实际解释器；Notebook内核（脚本题不适用）\n3 位置：项目根；cwd；实际目标文件（相对项目根）\n4 操作：原样命令，或重启动作与单元格实际执行顺序\n5 结果：stdout；首个相关错误全文及上下文；退出状态（不适用时注明）\n6 恢复：只改了什么；新命令/顺序；实际输出；新会话复验及未核实项"),
      p("例如主例目标为Notice N8，文件位置是scripts/notice.py，cwd是notice-tool根；操作记录必须同时保留错误参数和修复后的参数。把真实源码一起交接，不能只说“换个路径好了”。Notebook题的单元格错误没有普通脚本进程退出码，写“不适用，记录内核错误消息及运行顺序”，不编造一个。"),
      p("自己本地核对时使用真实路径，公开记录时可将共同前缀换成<练习根>。约定读者把它替换为自己实际创建的练习目录，后面的handoff-lab/target与other仍完整保留；命令从相应cwd执行。占位符是位置说明，不能原样当作已存在的目录输入。不要为了脱敏抹掉区分两个项目、两个Python的后半段。"),
      p("只附必要源码、Notebook和操作结果。密码、API密钥、Notebook访问token、隐私文件、整个.venv及机器专属配置不公开；环境由对方按已有基础流程重建。无需收集全部环境变量、完整PATH或pip freeze。尚未有别人实际操作时，结论写“同机新会话已验证；他人复现待验证”。"),
    ] },
    { id: "script-handoff", title: "输出正确，为什么还需要修复？", navGroup: "practice", navLabel: "两道独立任务", blocks: [
      p("这次用新的handoff-lab布局，目标是target的程序必须由target自己的环境运行。按1.4分别建立两个项目环境，保持现有系统Python，不需要不同版本或装额外包。把run.py和现成observe_env.py保存到target。"),
      code("练习一布局", "handoff-lab/\n├── target/           ← 本题cwd\n│   ├── .venv/\n│   ├── run.py\n│   └── observe_env.py\n└── other/\n    └── .venv/"),
      sample("target"),
      p("下面是1.4的完整只读观察工具，原样复制到observe_env.py，用与run.py相同的解释器在终端运行。观察Interpreter和Environment是否属于目标项目，Base Python帮助区分环境与基础Python，Version记录版本。本题要求比较输出位置，不要求独立编写import、点号、split或下标语法。"),
      sample("environmentProbe"),
      p("从target根执行下列受控故障命令。它们使用other的Python，但脚本仍是target内的文件；先预测普通文字与环境身份各会怎样，再真实运行。"),
      ...commands("wrongRun", "target项目根"), ...commands("wrongProbe", "target项目根"),
      { type: "exercise", id: "reproduce-script-issue", title: "交付脚本环境错配的复现记录", kind: "实验",
        prompt: "在自己新建的handoff-lab确认两个.venv确实存在，保存给出的两份源码。运行前记录目标解释器所属项目及预期文字。实际执行错误环境命令和诊断，保留cwd、系统/Shell/Python版本、命令、stdout/stderr与退出状态，指出哪条实际身份与目标不符。独立决定怎样用正确环境恢复，重新运行程序和诊断。新开独立终端，核对cwd，再按短记录复现错配及恢复。提交run.py、observe_env.py和六项短记录，保留修复前后身份与实际结果；公开路径用同一占位映射。程序正常打印不能代替身份核验，只有文字答案不算操作完成。",
        hints: ["把“想使用哪个项目的环境”与观察工具实际报告的位置比较；普通文字能区分两个Python吗？", "先确认cwd和源码都属于目标，再看命令中负责启动Python的那一段，与脚本参数分别对应什么。找出需要改变的条件，并用同一观察工具检查改动效果。"],
        solution: ["保存两份源码，cwd保持target，核实两个环境文件存在。错误环境运行时普通输出仍可能Target R9、状态0，诊断Interpreter/Environment却位于other/.venv；这就是本题已知错配，无需制造Python异常。", `只把启动解释器改为target自己的环境。Windows从target执行：${cmd.rightRun.windows}，再${cmd.rightProbe.windows}；macOS：${cmd.rightRun.mac}，再${cmd.rightProbe.mac}。两次普通输出都可为Target R9，恢复证据是实际解释器和环境前缀回到target/.venv。`, "新终端重新进入target，核对位置后用明确路径先重现other身份、再验证target身份。保存各次实际命令和诊断，六项记录附必要源码；相同版本不意味着同一环境。", "常错是看到文字成功就结束、只改VS Code状态栏而未重跑诊断、脱敏时把target/other都删掉。可用明确绝对路径或已核验的编辑器入口等价恢复，但交接仍须说明cwd和实际启动方式，并用新会话证明；不需要复制.venv。"],
        rubric: ["两环境和两份源码真实存在；目标、cwd、平台/版本、实际命令、输出/错误及退出状态可核对。", "真正复现普通输出成功而other身份错误，指出实际路径与目标差异；正确环境恢复有程序与诊断证据。", "新终端按记录再次复现和恢复，提交必要源码与简短脱敏记录；保留项目区别，不虚构同伴或跨机器结果。"],
      },
      { type: "quiz", id: "normal-output-wrong-identity", question: "run.py正常输出Target R9且状态0，能证明使用target环境了吗？", options: ["还需核对相同启动方式下诊断的实际解释器和环境前缀", "能，正常输出就足够"], correct: 0, explanations: ["正常输出回答程序结果，路径诊断回答环境身份。两项要求都要核实。", "两个环境都可能执行这条print，成功退出不能单独区分环境。"] },
    ] },
    { id: "notebook-handoff", title: "补全一份Notebook求助记录", navGroup: "practice", navLabel: "两道独立任务", blocks: [
      p("第二条求助只有：“Notebook打开后运行某个格子出错，但刚才还成功过。”你需要先列出它缺少的条件，再亲自取得证据。沿用1.5已可用的本地Jupyter，在目标项目打开review-note.ipynb，可下载下方起始材料。文件默认按顺序可运行，故障由你的执行操作产生。"),
      { type: "downloads", resourceIds: ["review-notebook-file"] },
      p("文档先有Markdown说明，再把以下两行分别放在两个Code格。回顾1.5：先运行赋值格，当前内核才记住batch_label对应的文字；print(batch_label)读取当前对应值，print(\"batch_label\")只会打印引号里的文字。这里仍只用最小赋值与名称读取。"),
      sample("assign"), sample("show"),
      p("末尾保留下面的现成只读观察格，在Notebook代码格运行，观察实际Python是否属于目标.venv。import/sys仅作已提供的工具，不要求独立编写。按1.5核对Kernel选择；同一个Python 3标题不能代替路径证据。"),
      sample("kernelProbe"),
      { type: "exercise", id: "recover-notebook-record", title: "用真实内核补齐缺失的复现条件", kind: "实验",
        prompt: "先指出那句求助缺少哪些关键条件。在目标环境中打开review-note.ipynb并核对实际内核Python，记录平台与版本。明确重启内核，预测并实际先运行依赖前面赋值的显示格，保存真实错误全文、相关代码和执行顺序。独立解释原因并恢复，记录实际结果。再明确重启，从文档开头按序运行全部核心代码，核对输出与内核，保存.ipynb并重新打开检查文件。交付自己的Notebook及六项短记录：起始状态、实际顺序、错误、改动、干净全跑与保存证据。若出现的不是预期NameError，先调查真实状态而非改写错误。已有输出截图不能替代新执行；结束时按1.5保存并关闭自己的会话和服务。",
        hints: ["“刚才成功”没有说明当前内核从重启后执行过什么。接手的人要怎样知道起点和操作相同？", "找到提供显示格所需名字的那格，核对它是否在当前内核执行；把内核身份、重启动作、实际顺序与完整相关错误补进记录，再设计一次不依赖旧状态的验证。"],
        solution: ["缺少目标/实际内核、Python版本、是否重启、具体格源码、真实执行顺序和错误全文等信息。先用观察格核对目标.venv，再明确重启；只关网页可能重连旧内核。", "新内核先执行print(batch_label)，实际应有NameError说明batch_label尚未定义。保留回溯中的代码行、末行及顺序；赋值文本虽然已保存，却未在这个新内核执行。", "运行提供名字格，再运行显示格，应为Checked F3。保持文档中赋值在使用前，明确重启并从头全部运行，检查无错、输出和目标内核一致；保存，重新打开核对真实文件。", "记录故障起点和修复后操作，包括何时重启、各格怎样执行、实际输出。Notebook错误的脚本退出码写不适用。保存的代码/文字/输出并不将运行中的名字自动装入新内核。", "常错是只交旧输出、不写重启条件、删错误格当修复。接受依赖合理的等价排列、全新内核会话或先重启再Run All；都须保留实际故障、干净完整执行与文件证据。新会话技术复验尚不能写成同伴成功复现。"],
        rubric: ["先指出原求助缺失条件，实际核对目标内核；重启后真正复现乱序错误，保留代码、执行顺序及完整相关错误。", "解释未在当前内核定义名字并合理恢复；重启后按文档顺序全部运行，真实输出Checked F3且环境正确。", "保存并重新打开核对.ipynb，交简短脱敏复现记录与干净全跑证据；区分文件输出和运行状态，没有虚构他人操作。"],
      },
    ] },
    { id: "chapter-handoff", title: "第一章结束，留下能重新核对的文件", navGroup: "finish", navLabel: "章末交接", blocks: [
      p("现在你能把本地脚本保存并重跑，核对文件位置与实际解释器，区分项目环境，在Jupyter按序执行，并把一次问题整理成别人可以按条件尝试的短记录。两题的真实文件和新会话证据才用于自查，网页“读完”只记录阅读。另一位人类实际按记录操作之前，把同伴复现列为待验证。"),
      p("PY101接下来按原课程体系进入第二章“变量、基本类型、表达式与输入输出”。第一章只借用了最小赋值，完整变量、控制流程、函数和依赖管理仍需后续学习。第二章尚无本轮制作的教材链接；阅读器按已有可读课时可能把下一节指向第5章函数试读，那需要中间基础，不作为零基础学生直接跳学的推荐。整门PY101仍在筹备。"),
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
