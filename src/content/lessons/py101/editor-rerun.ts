import { lessonSchema, type ContentBlock } from "../../models";
import { editorFiles, interpreterDiagnostic } from "../../resources/python-editor";
const p = (text: string): ContentBlock => ({ type: "paragraph", text });
const code = (filename: string, text: string, language: "python" | "text" = "text"): ContentBlock => ({ type: "code", filename, language, code: text });
const file = (name: keyof typeof editorFiles, label: string = name) => code(label, editorFiles[name], "python");

export const pythonEditorRerunLesson = lessonSchema.parse({
  id: "PY101-C01-L03", courseId: "PY101", chapterId: "PY101-C01", contentVersion: 2,
  title: "用编辑器完成保存与重跑",
  subtitle: "改完文字，为什么还是旧结果？把编辑、保存、目标文件与解释器逐一对上。",
  prerequisites: "已完成1.1与1.2，能保存.py、修改print，在终端用已验证的python、py或python3执行文件，并用pwd和路径确认目标。本节不重复Python安装与全部路径知识。需要本地VS Code和已经可运行的Python 3；扩展准备见正文。",
  prerequisiteLinks: [
    { title: "1.1 保存与运行", href: "/learn/PY101/PY101-C01-L01#save-script", note: "补齐保存与解释器命令。" },
    { title: "1.2 同名文件与路径", href: "/learn/PY101/PY101-C01-L02#same-name", note: "补齐cwd和目标判断。" },
  ],
  objectives: ["在编辑器中打开项目文件夹和指定.py，区分编辑器、源码、终端与解释器的作用", "独立完成修改、预测、保存、执行与结果核对，用文件位置和命令证明运行目标", "检查保存状态、当前目录和解释器，定位一种实际错配并验证恢复"],
  assessmentMap: [{ objective: 1, exerciseIds: ["reliable-edit"] }, { objective: 2, exerciseIds: ["reliable-edit"] }, { objective: 3, exerciseIds: ["recover-target"] }],
  learningTime: { reading: [15, 20], practice: [10, 15], coding: [20, 30], basis: "editorial-estimate" },
  sections: [
    { id: "four-roles", title: "改完代码，运行的是哪一份？", navGroup: "start", navLabel: "四种角色", blocks: [
      p("前两节已能让自己的程序在指定位置运行。现在用VS Code更方便地修改它：改好一行后，怎样让下一次执行读到新内容？先完成一次可靠的保存与重跑。"),
      { type: "table", caption: "一次本地执行中的四种角色", columns: ["对象", "负责什么", "本课怎样确认"], rows: [["VS Code编辑器", "管理文件、阅读和修改文字，显示保存状态", "工作区根、文件标签与编辑区"], [".py源码文件", "在磁盘上保存Python指令", "完整位置与保存后的内容"], ["终端", "接受命令、显示结果，命令由其中的shell处理", "pwd、文件清单与输入命令"], ["Python解释器", "读取并执行Python指令", "实际解释器位置与版本"]] },
      p("VS Code让文件查找、修改和保存更方便，但运行Python并不以使用它为前提。Python扩展给VS Code增加语言支持与Python运行入口；安装扩展不等于安装解释器。仍使用1.1中已经验证可运行的Python。"),
    ] },
    { id: "open-folder", title: "先打开整个练习文件夹", navGroup: "workspace", navLabel: "打开文件夹", blocks: [
      p("在aivora-python内新建editor-lab，准备下方main.py和notes.py。确认两文件属于这个文件夹。"),
      p("在VS Code选「文件 → 打开文件夹」，打开editor-lab。左侧目录根应显示它；项目文件夹只是整理文件的位置，不是新Python语法。"),
      code("初始布局", "aivora-python/\n└── editor-lab/\n    ├── main.py\n    └── notes.py"), file("main.initial.py", "main.py · 初始内容"), file("notes.py"),
      p("点击main.py，标签应显示文件名，编辑区应有Draft A1；点击notes.py可以切换。整文件夹视图让你同时看到相邻文件。"),
      p("遇到同名文件，在文件资源管理器或悬停标签查看完整位置。只打开一个文件也能编辑，但需要另行确认所属目录。"),
      p("若尚无官方Python扩展，在扩展视图搜索Python并核对发布者Microsoft，按官方文档安装；已有则直接使用。本课只需这项Python支持，不安装其他运行扩展。安装或系统授权问题按官方帮助处理，不用练习制造系统配置变化。"),
    ] },
    { id: "save-rerun", title: "先预测，再修改、保存与重跑", navGroup: "edit", navLabel: "保存与重跑", blocks: [
      p("先在外部终端cd到editor-lab，pwd并列出文件，再执行下方对应命令。初始应输出Draft A1。沿用已验证的python/py或python3，命令放在Shell提示符后。"),
      code("Windows · PowerShell", "python main.py"), code("macOS · 终端", "python3 main.py"),
      p("在自己的记录里先写新预期：第一行Ready B2，第二行Saved copy。回到main.py改第一条文字，再增加一条print，如下。两条指令从上到下执行，print默认在末尾换行。"), file("main.py", "main.py · 修改后"),
      p("先看未保存标记，常见界面是标签上的小圆点。编辑中的副本叫编辑缓冲区；独立终端执行的是磁盘文件。"),
      p("若自动保存已经写回磁盘，未保存实验的条件就不成立。以实际标记和结果为准，先按正常保存流程完成本轮。"),
      p("按Ctrl+S（macOS为Command+S）或选「文件 → 保存」。确认main.py位于editor-lab，未保存标记消失。"),
      p("回到刚核对过位置的外部终端，用同一命令重跑。下方两行才是这次保存后要看到的结果。"), code("本次预期输出", "Ready B2\nSaved copy\n"),
      p("逐行核对新输出。新标记没有出现时，先查保存，再查命令指向的完整文件；不同位置也可能存着相同文字。文件位置和实际命令在会话记录中记一次即可。"),
    ] },
    { id: "integrated-terminal", title: "把终端放到编辑器里", navGroup: "run", navLabel: "终端与解释器", blocks: [
      p("选「查看 → 终端 / View → Terminal」打开集成终端。它是放在VS Code里的终端，仍在运行PowerShell、zsh等shell；不是另一种Python解释器。外部终端与集成终端可以完成相同任务，但cwd和命令环境须分别核对。"),
      p("新终端通常从工作区根开始；已有终端、设置或之前的cd都可能改变位置。输入pwd，再用Windows的dir或macOS的ls列出文件。若不是自己的editor-lab，按1.2的方法cd到准确位置后再确认，不能仅凭面板在VS Code里就认定位置正确。"),
      code("Windows · 集成PowerShell", "pwd\ndir\npython main.py"), code("macOS · 集成终端", "pwd\nls\npython3 main.py"),
      p("最后一条应输出Ready B2与Saved copy，和外部终端一致。不同终端结果不同，先比较各自pwd、脚本参数和保存内容，再检查解释器。保留本次命令与结果，别把终端更早的输出当成这次结果。"),
    ] },
    { id: "select-interpreter", title: "让运行入口知道使用哪个Python", navGroup: "run", navLabel: "终端与解释器", blocks: [
      p("先打开main.py。按Ctrl+Shift+P（macOS为Command+Shift+P）打开命令面板，搜索Python: Select Interpreter，选择前两节已验证可用的Python。"),
      p("在候选说明或详情核对路径和版本。此步选已有解释器；项目环境的创建在1.4学习。"),
      p("用官方Python扩展的整文件入口Run Python File，或命令面板的Python: Run Python File in Terminal执行main.py。核对终端实际解释器路径、脚本位置及两行结果。"),
      {
  "type": "callout",
  "title": "区分整文件与选区",
  "text": "运行选区/行、调试和其他扩展的Run Code不是同一个入口。本课用保存后的整份文件作对照。"
},
      p("部分官方运行入口会先自动保存。因而本课先手动保存，再运行整文件；不能把“点了某个运行按钮”一律当作读取旧磁盘的证据。"),
      p("编辑器选中的Python与终端命令python找到的Python分别核对，已有终端未必随选择改变。"),
      p("下面的只读工具取得本次解释器位置和版本。在集成、外部终端各原样运行一次；macOS开头换python3，Windows沿用py时换py。它是观察工具，不是本课要求编写的模块代码。"), code("终端只读诊断 · 不输入.py编辑区", interpreterDiagnostic),
      p("把两个终端的实际位置/版本与编辑器选定项、官方运行命令比较。本课不讲解import和sys模块，也不考默写诊断命令。没有候选或命令不可用时，回查1.1的安装与可运行命令；不要通过重装、安装多个版本或修改系统PATH猜测修复。"),
    ] },
    { id: "three-mismatches", title: "输出不符，按证据排查三种错配", navGroup: "recover", navLabel: "检查与恢复", blocks: [
      p("A：观察未保存。先将main.py恢复一行并保存，外部终端运行确认Draft A1。再改成两行，保持未保存标记，暂不点运行入口。"),
      p("从同一外部终端运行同一路径：磁盘仍旧就显示Draft A1。随后只做保存，再重跑；变成两行，才支持刚才是未保存造成的差异。"),
      p("若自动保存让标记立即消失，磁盘已更新，实验条件不成立，可能直接得到新输出。不要记录为未保存故障。可在自己的练习窗口记录差异并继续正常流程；若自行临时调整自动保存，记住原状态并恢复，不改别人的配置。"),
      p("B：观察另一目标。main.py已保存时，执行notes.py会显示Notes N4，编辑区开着main.py也不改变命令目标。"),
      p("还可在other中新建下方同名main.py，从other运行会得到Other folder C3。用pwd和脚本参数定位，再指定根目录目标重跑。"), file("other/main.py"),
      p("C：解释器与预期不符。记录编辑器选定路径/版本，查看官方运行命令，再分别用只读诊断比较集成与外部终端。本机若相同，就记录「未出现解释器错配」，不必制造第二个Python。若不同，检查运行入口、已有终端是否旧会话、选定项是否为先前可用的安装。"),
      p("保持源码与目标不变，分别从官方入口和终端命令运行并比较实际解释器位置，是可观察的排查：路径不同说明环境不同，即使print结果相同。选回已有且验证可用的解释器，再用官方入口重跑；检查新终端，仍不同则保留两条路径寻求安装支持，不用更改PATH掩盖差异。"),
      { type: "quiz", id: "save-evidence", question: "标签有未保存标记，独立外部终端执行磁盘文件仍输出旧文字。下一步怎样取证？", options: [
  "保持未保存状态，反复在同一外部终端运行即可读到缓冲区",
  "换一个Python解释器，让它读取编辑器里未保存的文字",
  "保存同一路径文件，再用相同外部终端命令重跑比较"
], correct: 2, explanations: [
  "独立外部终端启动脚本时读磁盘文件；重复命令不会替编辑器存盘。",
  "更换解释器没有完成保存，反而新增变量。先保持解释器和路径不变。",
  "只改变保存条件，比较前后标记；仍旧值时再核对完整路径。官方扩展有些入口会自动保存，不能混作这个实验。"
] },
    ] },
    { id: "practice", title: "合上主例，交付两次可核验操作", navGroup: "practice", navLabel: "独立练习", blocks: [
      file("message.py", "练习一起始文件 · editor-lab/message.py"),
      { type: "exercise", id: "reliable-edit", title: "自己的三行任务卡", kind: "代码",
        prompt: "在editor-lab另建message.py，自选主题和标记，改两处文字并增一条print。口头预测三行，保存后在集成终端真正执行。交本人.py、真实输出及一条文件/命令记录；共用卡已有解释器身份时引用即可。保存标记、pwd与文件清单用于操作自查，有差异才附诊断。现场或一句话说明编辑器、源码、终端、解释器的作用。",
        hints: ["找两对引号内要改的文字；新增输出对应哪种指令？标签、磁盘位置与终端各提供什么证据？", "依次核对所属文件夹、保存标记、pwd与清单，选择自己可用的解释器命令和目标参数。最后独立执行，核对行数、顺序、文字及自己的标记。"],
        solution: [
  "例如练习计划主题、P8标记，可用三条print依次输出Plan: practice P8、Step: save、Check: rerun。先口头预测三行再编辑。这只是样例，学生须自己选主题与标记。",
  "资源管理器确认editor-lab/message.py，保存并确认标记消失。集成终端pwd确认editor-lab，dir或ls确认message.py；Windows运行python message.py（此前用py则保持py），macOS用python3 message.py。",
  "保留真实三行结果，逐行对照预测；用共用卡核对实际解释器位置/版本。现场指认VS Code负责编辑管理、message.py存指令、终端接受命令并显示结果、解释器执行代码。",
  "常见错因：修改网页、只跑选中行、未保存、命令写成main.py或只交抄来的输出。回到自己的文件与命令恢复。接受中文、自选文件名、单引号、绝对路径，前提是最终源码、命令、位置和结果对应。只有复制样例或阅读标记不通过。",
  "交付按本题题干与rubric：源码可用一份加差异，运行记录用短表；相同命令、环境和版本引用会话卡，不重复誊写。"
],
        rubric: [
  "正确工作区内独立改两处并增一行，含自选标记，提交保存源码。",
  "集成终端真实三行结果与文件和命令对应，核对事前口头预测。",
  "能区分四种角色；保存/清单作为自查，解释器身份复用会话卡，异常才附额外诊断。"
],
      },
      { type: "exercise", id: "recover-target", title: "为什么输出一直没有变？", kind: "实验",
        prompt: "按正文准备已保存的根目录main.py与other/main.py，保持同一已验证解释器。编辑区打开根文件，终端在other执行相对main.py，真实复现Other folder C3。独立定位并改cwd或脚本参数，重跑原目标。交两份源码及短对照：故障/恢复cwd、命令、真实输出、目标原因。保存与解释器先自查，共用卡不重复抄；不能改print迎合错误目标。",
        hints: ["题目已排除未保存和解释器变化。从pwd的位置展开相对文件名，与编辑区完整位置比较。", "列出当前目录，查看其中同名文件内容；改变终端位置或脚本参数，使其指向编辑区目标。保留原始证据，最后仍须自己确认目标并运行。"],
        solution: [
  "从other输入main.py指向other/main.py，所以得到Other folder C3。编辑区的根目录main.py同名却不是同一份；条件已给定保存完成、解释器相同，无需猜别的原因。",
  "方案一回到editor-lab，pwd与清单确认，再运行python main.py，macOS用python3。方案二留在other，Windows用python ..\\main.py，macOS用python3 ../main.py。已核实的根目录main.py绝对路径也可。",
  "重跑应为Ready B2、Saved copy两行；保存真实结果，与修复前Other folder C3对照。核对解释器位置/版本与保存状态（可引用共用卡），说明变化的是执行目标。",
  "常见错因：复制新源码到other迎合结果、只改编辑区、未重跑或删掉另一份。这些没证明正确定位。可用py或不同终端路径，但真实命令须指向原目标，保留前后证据。",
  "交付按本题题干与rubric：源码可用一份加差异，运行记录用短表；相同命令、环境和版本引用会话卡，不重复誊写。"
],
        rubric: [
  "实际在other复现同名文件错配，前后cwd/命令与两份源码可核对。",
  "指出编辑文件与执行文件不同；已保存、同解释器条件实际自查，不重复一套版本报告。",
  "不改源码迎合结果，修复目标后真正显示Ready B2与Saved copy。"
],
      },
    ] },
    { id: "next-step", title: "留下可重现的运行记录", navGroup: "finish", navLabel: "下一步", blocks: [
      p("保留自己的程序与结果。下一次打开项目时，用“编辑哪份、保存了吗、从哪里启动、启动哪个Python”核对一次；不必把同一环境反复誊写。"),
      p("前三节已经形成“写程序—从不同位置找到它—修改后可靠重跑”的主线。1.4开始处理多个项目的工具环境：为每个项目选对Python。进入前能完成本节的保存、目标定位与解释器核对即可。第5章还需变量、表达式与控制流程等基础。"),
    ] },
  ], resources: [],
  references: [
    { title: "VS Code Python tutorial", href: "https://code.visualstudio.com/docs/python/python-tutorial", note: "打开文件夹、选择与运行；核验于2026-10-29。" },
    { title: "Run Python code", href: "https://code.visualstudio.com/docs/python/run", note: "整文件与选区执行区别。" },
    { title: "Python environments", href: "https://code.visualstudio.com/docs/python/environments", note: "选定已安装解释器，不创建环境。" },
    { title: "Terminal getting started", href: "https://code.visualstudio.com/docs/terminal/getting-started", note: "集成终端和cwd。" },
    { title: "Python in VS Code", href: "https://code.visualstudio.com/docs/languages/python", note: "扩展与单独安装的解释器。" },
  ],
});
