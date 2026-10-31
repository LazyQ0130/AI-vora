import { lessonSchema, type ContentBlock } from "../../models";
import { firstRunProgram } from "../../resources/core-programs";
import { resourcesForProgram } from "../../resources/programs";

// 编辑简报与2026-10-29官方核验：docs/py101-p0/。正文、.py和Notebook同源。
const sample = firstRunProgram;
const p = (text: string): ContentBlock => ({ type: "paragraph", text });
const code = (filename: string, text: string, language: "python" | "text" = "text"): ContentBlock => ({ type: "code", filename, language, code: text });
const hello = sample.core.split("\n")[0] + "\n";

export const pythonFirstRunLesson = lessonSchema.parse({
  id: "PY101-C01-L01", courseId: "PY101", chapterId: "PY101-C01", contentVersion: 2,
  title: "从零运行第一个Python程序",
  subtitle: "让电脑显示自己写的文字：运行一行，保存成文件，再修改和排错。",
  prerequisites: "会打开软件、输入文字、创建文件夹与保存文件即可；无需Python或AI000基础。准备一台允许使用本地Python的电脑和英文输入法。手机可阅读，代码实践需要电脑。",
  objectives: [
    "在本地确认解释器版本，并用自己的运行记录区分代码文件、解释器和输出",
    "独立修改并运行一个.py文件，先预测再核对print产生的逐行结果",
    "根据文件位置或报错定位一次运行失败，并验证恢复后的结果",
  ],
  assessmentMap: [{ objective: 1, exerciseIds: ["own-message"] }, { objective: 2, exerciseIds: ["own-message"] }, { objective: 3, exerciseIds: ["find-script"] }],
  learningTime: { reading: [12, 18], practice: [8, 12], coding: [15, 25], basis: "editorial-estimate" },
  sections: [
    {
      id: "first-output", title: "先让电脑说一句话", navGroup: "start", navLabel: "首次输出",
      blocks: [
        p("你想让电脑显示一句问候。我们先让它显示 Hello, Aivora!，接着把问候换成自己的文字。下面是第一条Python指令；运行成功后，屏幕应出现下一框中的一行文字。"),
        code("第一条Python指令", hello, "python"),
        code("预期输出（只用于核对）", "Hello, Aivora!\n"),
        p("Windows在开始菜单打开PowerShell；macOS在「应用程序 → 实用工具」打开「终端」。这个窗口接收命令并显示结果。输入下方对应系统的版本命令，按回车。"),
        code("Windows · 在PowerShell输入", "python --version"),
        code("macOS · 在终端输入", "python3 --version"),
        p("看到Python 3.x.x，说明命令已启动解释器——执行Python代码的软件。记下实际版本，接着运行第一行程序。"),
      {
  "type": "callout",
  "title": "版本命令没有成功时",
  "text": "没有版本号、打开商店或找不到命令，就转到「还没有可用的Python时」。安装/下载或权限受阻请教学支持处理；已有可用的受支持3.x可继续。"
},
        p("Windows输入python，macOS输入python3，回车后应看到>>>，表示解释器正在等Python代码。只输入上面的print语句并回车；>>>由窗口显示，不复制。"),
      p("Windows若已用py --version验证py，就用py进入，并在后文一致替换python。"),
        p("问候出现后，下一行的>>>表示可以继续输入。现在在它后面输入quit()并回车，回到系统终端；接着把程序保存成能反复运行的文件。"),
        { type: "callout", title: "把安装等待单独安排", text: "页面预计时间是编辑估计。安装、下载与故障恢复另预留15–40分钟；权限或网络问题可能更久。若受阻，记下命令和完整提示，找教学支持解决本地环境。先写预测可以继续准备，真正运行成功后才完成本课。" },
      ],
    },
    {
      id: "local-python", title: "还没有可用的Python时", navGroup: "setup", navLabel: "本地环境",
      blocks: [
        p("Windows新安装时打开下方Python官网，选择Python Install Manager。按官网提供的安装文件或Microsoft Store路线完成安装；管理器负责取得和启动解释器。"),
      p("安装后关闭旧PowerShell并新开窗口，执行python --version。若首次调用正在下载运行时，等下载完成，再检查实际版本。"),
        p("学校或单位设备可能限制安装。遇到授权、组织限制或下载失败，保留提示，请管理员或教学支持提供获准环境。"),
      {
  "type": "callout",
  "title": "按当前官方安装说明操作",
  "text": "Install Manager与旧安装器流程不同，不必寻找旧截图中的Add Python to PATH选项；也不以取得管理员密码或关闭防护作为学习步骤。"
},
        p("Windows已有Python时，也可试py --version。选定一个实际能运行的入口，后面保持一致。"),
      p("py可能来自当前Install Manager，也可能是旧Python Launcher；它与python不一定选同一版本，py list也不适用于所有旧安装。保留已有Python，按实际版本结果核对。"),
        p("如果python和py都不可用，先确认安装完成，再重开终端重试。仍失败时，在开始菜单查看「管理应用执行别名」中官方Python (default)的状态。"),
      p("别名是系统将命令交给程序的入口。把别名观察和版本命令结果交给教学支持；python打开商店时也从这里排查，避免反复安装。"),
        p("macOS从Python官网下载稳定版.pkg，先核对安装器列出的系统要求，再安装。官方通用安装包支持其系统要求内的Apple Silicon与Intel机型；标准安装需要管理员授权。"),
      p("安装后，按官方说明运行「应用程序 / Python 3.x」中的Install Certificates.command配置证书。新开终端，执行python3 --version确认。"),
      {
  "type": "callout",
  "title": "没有安装权限时",
  "text": "请管理员或教学支持准备获准的本地环境，再回到第一行程序。"
},
        p("macOS统一用python3。若命令引出Apple开发工具安装，先取消该分支，按Python官网路线或找教学支持核对。保留Apple管理的/usr/bin/python3；版本仍不可用时，提交实际命令和提示。"),
        { type: "reading-links", title: "安装时打开官方页面", links: [
          { title: "Python官方下载", href: "https://www.python.org/downloads/", note: "选择稳定版，跳过标有alpha、beta、rc或pre-release的测试版。" },
          { title: "Windows安装与故障排查", href: "https://docs.python.org/3/using/windows.html", note: "核对Install Manager与已有安装的差异。" },
          { title: "macOS安装说明", href: "https://docs.python.org/3/using/mac.html", note: "核对系统要求、管理员授权与证书配置。" },
        ] },
        p("获得版本号后，回到「先让电脑说一句话」完成那一行输出。后面的代码只使用Python自带的功能，不需要安装第三方库。"),
      ],
    },
    {
      id: "print-text", title: "这一行怎样变成屏幕上的文字", navGroup: "text", navLabel: "文字输出",
      blocks: [
        p("print把括号中的内容显示出来。成对英文引号界定文字，引号本身不显示；空格、逗号和感叹号会保留。先切到英文输入法，把括号和引号配对。"),
        p("这种用引号围起来的文字叫字符串。英文单引号也能标记字符串，开头结尾应使用同一种；本节先用双引号。每执行一条这样的 print，默认在显示完后换到下一行。先试着预测：连续写两条，会得到一行还是两行？保存成文件后就能直接观察。"),
        { type: "quiz", id: "file-interpreter-output", question: "保存了 first_run.py，并用 python first_run.py 看到问候。哪组对应正确？", options: [
  "终端负责执行Python语句；.py文件只是显示问候",
  "first_run.py保存指令；python启动解释器；问候是执行结果",
  "python负责保存编辑文字；终端里看到问候就说明文件已保存"
], correct: 1, explanations: [
  "终端接收命令并展示结果，实际解释Python语句的是解释器。用同一文件重新启动解释器核对。",
  "三种角色对应正确；开放题还要亲自修改文件并实际运行。",
  "磁盘文件由编辑器保存。改一个标记，保存再重跑；问候本身不能证明新修改已存盘。"
] },
      ],
    },
    {
      id: "save-script", title: "把两条指令保存成文件", navGroup: "file", navLabel: "保存与运行",
      blocks: [
        p("交互窗口适合立即试一行；要反复运行自己的几条指令，可以保存成脚本文件。脚本是存有程序指令的文本文件，这里用 .py 结尾的文件名。先在你能写入、容易找到的位置创建一个新文件夹 aivora-python，例如自己的「文档」中。记下它的位置。"),
        p("Windows打开记事本，把下方两行写进新文档。选择「文件 → 另存为」，进入刚建的aivora-python文件夹。"),
      p("文件名填first_run.py，类型选「所有文件」，编码选UTF-8后保存。UTF-8可保存中文；再用文件属性核对完整名称没有多出.txt。"),
        p("macOS打开Python安装附带的IDLE，选择File → New File，向新的编辑窗口写入下方两行。再选File → Save，存到aivora-python，命名first_run.py。"),
      {
  "type": "callout",
  "title": "找不到IDLE时",
  "text": "可在已验证的终端用python3 -m idlelib打开随Python提供的编辑工具。此命令只作启动工具使用；仍打不开时请教学支持检查安装组件。"
},
        code("first_run.py", sample.core, "python"),
        p("代码框的复制按钮只复制两行源码。不要把文件名、行号、>>>、命令或预期输出写进文件。保存后的文件会留在电脑上；网页练习框中的输入只是临时自查，刷新后可能丢失。"),
        { type: "downloads", resourceIds: ["first-run-python"] },
        p("下载与代码框是同一份起始代码，可移入练习文件夹核对文件名。接下来要在自己的.py里修改文字；Notebook文档的操作放到1.5。"),
      ],
    },
    {
      id: "run-script", title: "在文件所在的位置执行", navGroup: "file", navLabel: "保存与运行",
      blocks: [
        p("回到系统终端，先找到刚保存文件的位置。当前目录是终端此刻查找文件的起点，保存文件并不会自动改变它。"),
      p("Windows在资源管理器打开aivora-python，复制地址栏完整路径。用cd加空格和一对英文引号，将实际路径放进引号；下方只是路径形式示例。"),
        code("Windows · PowerShell示例（逐行执行）", 'cd "C:\\Users\\你的用户名\\Documents\\aivora-python"\npwd\ndir'),
        p("pwd显示当前目录，dir列出文件。列表中找到first_run.py后，执行下一条命令；PS C:\\…>等终端前缀不用输入。看到>>>时，先用quit()回到系统终端。"),
        code("Windows · PowerShell", "python first_run.py"),
        p("macOS同样先 cd 到实际保存位置；下面用自己的文稿目录作示例，实际文件夹不同就替换整段路径。pwd显示位置，ls列出文件。引号让含空格的路径也能作为一个整体传入。"),
        code("macOS · 终端示例（逐行执行）", 'cd "$HOME/Documents/aivora-python"\npwd\nls\npython3 first_run.py'),
        p("这次应出现下方两行文字，随后终端重新等待命令，表示脚本已经结束。"),
      p("第二行File: first_run.py是源码中的固定文字，不会检测或跟随文件改名。确认实际执行目标，要结合cwd、文件清单与命令路径。"),
        code("脚本预期输出", "Hello, Aivora!\nFile: first_run.py\n"),
        p("这次过程可以逐项指出：first_run.py保存两条指令；python（或选定的py、macOS的python3）启动解释器读取文件；两条print按从上到下的顺序产生两行输出。屏幕上的旧输出不会因编辑文件自动更新，每次检查修改都要重新执行。"),
      ],
    },
    {
      id: "change-message", title: "让结果带上自己的变化", navGroup: "change", navLabel: "修改与排错",
      blocks: [
        p("把第一行引号内的问候换成今天想做的一件事，第二行保留。先口头预测两行，再保存，用同一命令运行并核对。"),
      p("若仍出现旧问候，先确认保存，再给第一行加一个新标记重跑。新标记也没有出现时，按pwd和命令查找实际文件，区分未保存和跑错目标。"),
        p("这一轮只改引号内的文字，括号和配对引号保持完整。文字可以用中文；若中文显示异常，先确认文件保存为UTF-8，再临时换成英文短句核对执行过程，把显示问题单独记录。接下来的核心练习会要求你独立改两行并新增一行。"),
      ],
    },
    {
      id: "locate-errors", title: "没得到预期结果，从现象找原因", navGroup: "change", navLabel: "修改与排错",
      blocks: [
        p("先看失败发生在哪一步：命令不可用，还没开始执行源码；can’t open file表示文件没有打开；SyntaxError表示源码无法解析。按下表检查错误指向的文件和行号。"),
        { type: "table", caption: "按可观察现象逐项恢复", columns: ["看到什么", "先检查什么", "恢复后怎样验证"], rows: [
          ["python命令不可用，或打开商店", "重开终端，核对安装完成与py --version；回看安装段", "用选定命令取得版本号，再跑第一条print"],
          ["can’t open file / No such file or directory", "pwd位置和dir（macOS为ls）是否包含目标文件", "cd到实际保存文件夹，按清单中的准确文件名运行"],
          ["清单里是first_run.py.txt", "文件属性中的完整名称；记事本另存为类型", "将自己这一个文件另存为所有文件类型的first_run.py，再核对清单并运行"],
          ["SyntaxError，可能提到unterminated string literal", "报错行的一对英文引号和括号；别把中文弯引号当英文引号", "补全配对符号并保存，重新运行至两行正常输出"],
          ["输出还是旧文字", "编辑器是否保存；pwd和运行命令是否对应编辑文件的位置", "先保存，给正在编辑的第一行改一个独特标记，重跑核对标记"],
          ["把cd或python first_run.py输入后出现SyntaxError", "窗口是否正在显示>>>", "在>>>后quit()回到系统终端，再输入终端命令"],
        ] },
        p("想观察语法错误，可在自己的练习文件第一行临时删掉结尾的英文引号，保存再运行。文件会在解析阶段失败，这次不会产生原来两行正常输出；终端中更早的旧输出仍可能留着。把引号补回、保存、重跑，才算验证恢复。无需为这个错误重装Python。"),
      ],
    },
    {
      id: "practice", title: "合上示例，完成自己的程序", navGroup: "practice", navLabel: "独立练习",
      blocks: [
        { type: "exercise", id: "own-message", title: "修改并运行三行提示", kind: "代码",
          prompt: "以first_run.py为起点，自选新主题，改两条文字并增加第三条print，加入自己的独特标记。先口头预测三行，保存并在本地运行。交本人.py和真实三行结果；在同一会话的共用卡上记一次文件位置、实际命令和版本检查结果即可。用一句话或现场指认区分文件、解释器和输出；有差异先修正再重跑。",
          hints: ["查看哪些文字位于配对引号内；想想新增一行输出需要增加哪种指令。先用自己的文字预测，再碰运行命令。", "在起始文件里逐条改引号内文本，独立补第三行；保存后用pwd和文件清单确认位置，再用已验证的解释器命令执行。逐行核对数量、顺序和独特标记。"],
          solution: [
  "先自己确定主题和标记；例如选学习提醒、标记B7，可依次输出 Reading plan B7、File: first_run.py、Next: run again。这只是一个可行例子，你的内容应由你选择。",
  "在文件中分别写三条print，每条用成对英文引号包住自己的文字；预测三行内容及顺序，然后保存为UTF-8的.py。",
  "首次会话检查并记一次python --version（或全程py --version）；macOS记录python3 --version的真实输出。确认当前目录有文件，运行python first_run.py（或py / python3对应命令），保存实际输出并逐行比较。",
  "文件是保存的指令，解释器是运行这些指令的软件，输出是执行后显示的文字。常见错误：只改网页框、文件未保存、只复制三行参考文字却没有独立选主题；应回到本地文件完成变化并重新验证。合理替代：中文主题、配对单引号、其他.py文件名均可，但命令和记录须对应实际文件。",
  "交付按本题题干与rubric：源码可用一份加差异，运行记录用短表；相同命令、环境和版本引用会话卡，不重复誊写。"
],
          rubric: [
  "自选主题与标记，确实改两行并增加一条print，源码可运行。",
  "保留本人真实三行输出，与事前口头或一行预测核对；差异经实际重跑修正。",
  "能指认文件、解释器、输出；共用卡有真实位置、命令与一次版本检查，不重复提交长报告。"
],
        },
        { type: "exercise", id: "find-script", title: "程序存在，为什么说找不到？", kind: "实验",
          prompt: "用刚能运行的.py，在其文件夹内另建空run-check，保留原文件。进入run-check，pwd和清单自查后，用相对文件名实际运行，保留失败。自己选择回原目录或指定完整文件路径修复，真正重跑。提交沿用的源码及一行失败→恢复记录：两个cwd/命令、相关错误、成功输出和位置原因。解释器版本沿用会话卡。",
          hints: ["看失败信息是在说Python命令不存在，还是在说文件打不开；比较当前目录与源码所在目录。", "pwd显示刚进入的run-check，文件清单没有原.py。选择回到记录的原目录，或给解释器传入那个文件的完整路径；路径有空格时用英文双引号包住。再核对恢复输出。"],
          solution: [
  "run-check位于原文件夹内部且为空；从这里运行python first_run.py时，解释器会在当前目录寻找这个相对文件名，所以打开失败，尚未执行print。macOS用python3，原理相同。",
  "一种恢复：cd后跟用双引号包住的原文件夹完整路径，再核对pwd与文件清单，执行原命令。另一种恢复：留在run-check，输入python后加双引号包住的.py完整路径（macOS用python3）。两者都指向你原来的文件。",
  "重跑应出现练习一中自己的三行输出和标记；把失败与恢复后的命令、输出对照保存。常见误判：重装解释器、只改print或只回忆示例输出，都没有修复查找位置。",
  "若原命令本来使用绝对路径，进入run-check仍可能成功；本题要改用相对文件名才能复现。若run-check已有同名脚本，另建一个明确的新空练习文件夹再做，保留现有文件。",
  "交付按本题题干与rubric：源码可用一份加差异，运行记录用短表；相同命令、环境和版本引用会话卡，不重复誊写。"
],
          rubric: [
  "确在不含原脚本的新目录复现相对文件名失败，相关错误真实。",
  "以cwd和命令说明文件未打开，区分命令不可用与定位失败。",
  "一种合法修复实际成功，保留前后命令/位置及自己的输出，未移动或覆盖旧文件。"
],
        },
      ],
    },
    {
      id: "next-step", title: "保留程序，准备下一次运行", navGroup: "finish", navLabel: "下一步",
      blocks: [
        p("保留自己的.py和实际结果。下次重新打开终端，沿记录找到文件、执行同一命令，就能再次看到自己的三行提示。"),
        p("下一节1.2让同一程序从不同目录正确运行；1.3再把修改、保存与重跑放进编辑器。先走完这条短程序主线，再学习项目环境和Notebook工具。第5章函数需要变量、表达式与控制流程基础，补齐后再读。"),
      ],
    },
  ],
  resources: resourcesForProgram("first-run").filter(resource => resource.format === "Python"),
  references: [
    { title: "Python官方下载", href: "https://www.python.org/downloads/", note: "选择受支持的稳定版，安装信息可能更新。" },
    { title: "Windows：Install Manager与排错", href: "https://docs.python.org/3/using/windows.html", note: "运行命令及已有安装的差异。" },
    { title: "macOS安装与执行", href: "https://docs.python.org/3/using/mac.html", note: "官方安装包、授权与python3。" },
    { title: "Python解释器", href: "https://docs.python.org/3/tutorial/interpreter.html", note: "交互、脚本与源码编码。" },
    { title: "print内置功能", href: "https://docs.python.org/3/library/functions.html#print", note: "显示文字与默认换行。" },
    { title: "IDLE编辑器", href: "https://docs.python.org/3/library/idle.html", note: "创建与保存文件的必要操作。" },
  ],
});
