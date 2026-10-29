import { lessonSchema, type ContentBlock } from "../../models";
import { editorFiles, interpreterDiagnostic } from "../../resources/python-editor";
const p = (text: string): ContentBlock => ({ type: "paragraph", text });
const code = (filename: string, text: string, language: "python" | "text" = "text"): ContentBlock => ({ type: "code", filename, language, code: text });
const file = (name: keyof typeof editorFiles, label: string = name) => code(label, editorFiles[name], "python");

export const pythonEditorRerunLesson = lessonSchema.parse({
  id: "PY101-C01-L03", courseId: "PY101", chapterId: "PY101-C01", contentVersion: 1,
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
      p("前两节，你已经能保存文件并从终端运行。本节把这些动作放进编辑器：在main.py里改一行，先不运行，想想怎样证明下一次执行真的读到了这次修改。只看到想要的文字还不够，还要对上文件与命令。"),
      { type: "table", caption: "一次本地执行中的四种角色", columns: ["对象", "负责什么", "本课怎样确认"], rows: [["VS Code编辑器", "管理文件、阅读和修改文字，显示保存状态", "工作区根、文件标签与编辑区"], [".py源码文件", "在磁盘上保存Python指令", "完整位置与保存后的内容"], ["终端", "接受命令、显示结果，命令由其中的shell处理", "pwd、文件清单与输入命令"], ["Python解释器", "读取并执行Python指令", "实际解释器位置与版本"]] },
      p("VS Code让文件查找、修改和保存更方便，但运行Python并不以使用它为前提。Python扩展给VS Code增加语言支持与Python运行入口；安装扩展不等于安装解释器。仍使用1.1中已经验证可运行的Python。"),
    ] },
    { id: "open-folder", title: "先打开整个练习文件夹", navGroup: "workspace", navLabel: "打开文件夹", blocks: [
      p("在自己的aivora-python文件夹中新建editor-lab，用前两节的方法在其中准备main.py和notes.py。先在文件管理器确认两份文件属于同一个editor-lab，再在VS Code选择「文件 → 打开文件夹 / File → Open Folder」，选中editor-lab。项目文件夹只是组织文件的位置，不是Python特殊语法。"),
      code("初始布局", "aivora-python/\n└── editor-lab/\n    ├── main.py\n    └── notes.py"), file("main.initial.py", "main.py · 初始内容"), file("notes.py"),
      p("左侧文件资源管理器的根应为editor-lab。点main.py，文件标签显示名称，编辑区域显示Draft A1那条print；点notes.py可切换文件。打开整个文件夹便于同时核对邻近文件和终端起点；只打开单个文件仍能编辑，但容易漏看项目位置。同名时，在资源管理器查看所属文件夹或悬停标签核对完整位置。"),
      p("若尚无官方Python扩展，在扩展视图搜索Python并核对发布者Microsoft，按官方文档安装；已有则直接使用。本课只需这项Python支持，不安装其他运行扩展。安装或系统授权问题按官方帮助处理，不用练习制造系统配置变化。"),
    ] },
    { id: "save-rerun", title: "先预测，再修改、保存与重跑", navGroup: "edit", navLabel: "保存与重跑", blocks: [
      p("先打开系统外部终端，cd到自己的editor-lab，pwd并列出文件。Windows用dir，macOS用ls。执行对应平台的一条，初始预期是一行Draft A1。Windows若前两节用py，以下所有python均替换为py；macOS用python3。命令输入在系统终端提示符后，不在Python的>>>里。"),
      code("Windows · PowerShell", "python main.py"), code("macOS · 终端", "python3 main.py"),
      p("在自己的记录里先写新预期：第一行Ready B2，第二行Saved copy。回到main.py改第一条文字，再增加一条print，如下。两条指令从上到下执行，print默认在末尾换行。"), file("main.py", "main.py · 修改后"),
      p("先观察标签：常见界面用小圆点表示未保存，具体标记随主题和版本变化。编辑区的内容可以暂时只在内存中，这份正在编辑的副本叫编辑缓冲区。写回磁盘后，独立终端运行磁盘文件才能读到它。开启自动保存时，副本也可能已自动写回，以实际保存状态为准。"),
      p("按Windows的Ctrl+S、macOS的Command+S，或选「文件 → 保存 / File → Save」。首次另存时确认文件名main.py、位置editor-lab；不要存成main.py.txt。保存后未保存标记应消失。回到刚才核对位置的外部终端，用同一条命令再跑。"), code("本次预期输出", "Ready B2\nSaved copy\n"),
      p("逐行对照预测。把证据连在一起：编辑文件的完整位置、保存状态、终端pwd、输入命令、最终源码和本次实际两行输出。独特标记便于辨认版本，但不能单凭标记证明路径；不同文件也可存相同文字。"),
    ] },
    { id: "integrated-terminal", title: "把终端放到编辑器里", navGroup: "run", navLabel: "终端与解释器", blocks: [
      p("选「查看 → 终端 / View → Terminal」打开集成终端。它是放在VS Code里的终端，仍在运行PowerShell、zsh等shell；不是另一种Python解释器。外部终端与集成终端可以完成相同任务，但cwd和命令环境须分别核对。"),
      p("新终端通常从工作区根开始；已有终端、设置或之前的cd都可能改变位置。输入pwd，再用Windows的dir或macOS的ls列出文件。若不是自己的editor-lab，按1.2的方法cd到准确位置后再确认，不能仅凭面板在VS Code里就认定位置正确。"),
      code("Windows · 集成PowerShell", "pwd\ndir\npython main.py"), code("macOS · 集成终端", "pwd\nls\npython3 main.py"),
      p("最后一条应输出Ready B2与Saved copy，和外部终端一致。不同终端结果不同，先比较各自pwd、脚本参数和保存内容，再检查解释器。保留本次命令与结果，别把终端更早的输出当成这次结果。"),
    ] },
    { id: "select-interpreter", title: "让运行入口知道使用哪个Python", navGroup: "run", navLabel: "终端与解释器", blocks: [
      p("先激活main.py。打开命令面板：Windows用Ctrl+Shift+P，macOS用Command+Shift+P，也可用「查看 → 命令面板 / View → Command Palette」。搜索Python: Select Interpreter（Python: 选择解释器），从已安装候选中选前两节验证可用的Python。记录版本和位置，可从候选说明、状态栏或详情查看。不要选择创建环境，本课不创建虚拟环境。"),
      p("选定后，用官方Python扩展的「运行Python文件 / Run Python File」入口，或命令面板的Python: Run Python File in Terminal，运行整个main.py。在集成终端查看实际命令中的解释器位置和脚本位置，核对两行结果。不要选运行选区/行、调试或其他扩展的Run Code，那些入口的执行对象与行为可能不同。"),
      p("Python扩展的某些运行命令会先自动保存；官方教程描述的右键Run Python File in Terminal就有此行为。菜单随版本变化，本课主流程仍先手动保存再运行，不能推断「点击任何运行按钮都会执行旧磁盘内容」。本机核验VS Code 1.143.1、Python扩展2026.10.0；其他版本看实际命令和保存状态。"),
      p("编辑器选定项与终端直接输入python时找到的解释器要分别检查。选择解释器不保证所有已有终端的命令环境都改变。下方是只读诊断工具，在集成终端输入，得到本次进程的解释器完整位置和版本，再到外部终端执行同一条。macOS开头换为python3，Windows此前用py则换为py。引号内原样保留，不把它当成本课要掌握的新语法。"), code("终端只读诊断 · 不输入.py编辑区", interpreterDiagnostic),
      p("把两个终端的实际位置/版本与编辑器选定项、官方运行命令比较。本课不讲解import和sys模块，也不考默写诊断命令。没有候选或命令不可用时，回查1.1的安装与可运行命令；不要通过重装、安装多个版本或修改系统PATH猜测修复。"),
    ] },
    { id: "three-mismatches", title: "输出不符，按证据排查三种错配", navGroup: "recover", navLabel: "检查与恢复", blocks: [
      p("A：文件未保存。先把自己的main.py改回初始一行并保存，在外部终端确认Draft A1。再在编辑器改为两行新内容，暂不保存、不点运行按钮；确认未保存标记仍在。从已核对pwd的独立外部终端运行同一路径main.py。磁盘仍旧时会输出Draft A1。接着在编辑器保存，再从同一外部终端重跑，应变为两行。这个前后对照才支持「刚才未保存」的判断。"),
      p("若自动保存让标记立即消失，磁盘已更新，实验条件不成立，可能直接得到新输出。不要记录为未保存故障。可在自己的练习窗口记录差异并继续正常流程；若自行临时调整自动保存，记住原状态并恢复，不改别人的配置。"),
      p("B：执行另一份文件。保留已保存的两行main.py，运行同目录notes.py会得到Notes N4，即使编辑区仍在main.py。也可在editor-lab中新建other文件夹，保存下方同名main.py；从other运行main.py得到Other folder C3。核对pwd、脚本参数和两份源码，再指定正确目标或切回目标目录重跑，别只反复修改当前标签。"), file("other/main.py"),
      p("C：解释器与预期不符。记录编辑器选定路径/版本，查看官方运行命令，再分别用只读诊断比较集成与外部终端。本机若相同，就记录「未出现解释器错配」，不必制造第二个Python。若不同，检查运行入口、已有终端是否旧会话、选定项是否为先前可用的安装。"),
      p("保持源码与目标不变，分别从官方入口和终端命令运行并比较实际解释器位置，是可观察的排查：路径不同说明环境不同，即使print结果相同。选回已有且验证可用的解释器，再用官方入口重跑；检查新终端，仍不同则保留两条路径寻求安装支持，不用更改PATH掩盖差异。"),
      { type: "quiz", id: "save-evidence", question: "标签有未保存标记，独立外部终端执行磁盘文件仍输出旧文字。下一步怎样取证？", options: ["保存同一路径文件，再用相同命令运行比较", "反复点任意运行按钮，认定所有入口都不保存"], correct: 0, explanations: ["控制文件和命令不变，保存前后对照可支持判断，还需核对路径。", "部分运行命令会自动保存，不能把不同入口混成一个实验。"] },
    ] },
    { id: "practice", title: "合上主例，交付两次可核验操作", navGroup: "practice", navLabel: "独立练习", blocks: [
      file("message.py", "练习一起始文件 · editor-lab/message.py"),
      { type: "exercise", id: "reliable-edit", title: "自己的三行任务卡", kind: "代码",
        prompt: "在editor-lab工作区中新建message.py，输入上方两行。独立选主题和标记，改两处文字，再增一条print，不照搬正文或参考答案。运行前写三行预测，保存，在集成终端真正执行。交付简表：工作区/文件完整位置、编辑器/源码/终端/解释器各负责什么、保存状态、pwd和文件清单、运行命令、解释器位置与版本、最终源码、预测与真实输出、对照结论。用路径和保存内容说明执行了哪份文件，无需长报告。",
        hints: ["找两对引号内要改的文字；新增输出对应哪种指令？标签、磁盘位置与终端各提供什么证据？", "依次核对所属文件夹、保存标记、pwd与清单，选择自己可用的解释器命令和目标参数。最后独立执行，核对行数、顺序、文字及自己的标记。"],
        solution: ["例如练习计划主题、P8标记，可用三条print依次输出Plan: practice P8、Step: save、Check: rerun。先写三行预测再编辑。这只是样例，学生须自己选主题与标记。", "资源管理器确认editor-lab/message.py，保存并确认标记消失。集成终端pwd确认editor-lab，dir或ls确认message.py；Windows运行python message.py（此前用py则保持py），macOS用python3 message.py。", "保留真实三行结果，逐行对照预测；用只读诊断取得解释器位置/版本。记录VS Code负责编辑管理、message.py存指令、终端接受命令并显示结果、解释器执行代码。", "常见错因：修改网页、只跑选中行、未保存、命令写成main.py或只交抄来的输出。回到自己的文件与命令恢复。接受中文、自选文件名、单引号、绝对路径，前提是最终源码、命令、位置和结果对应。只有复制样例或阅读标记不通过。"],
        rubric: ["在正确工作区找到文件，区分四种角色，提供完整位置。", "独立改两处文字并增一条print，含自选标记；提供保存源码与运行前预测。", "集成终端pwd/清单、命令、解释器诊断和真实三行输出可互相核对，逐行比较并处理差异。"],
      },
      { type: "exercise", id: "recover-target", title: "为什么输出一直没有变？", kind: "实验",
        prompt: "输入为本节两行新版editor-lab/main.py和Other folder C3那份editor-lab/other/main.py。两份均已保存、没有未保存标记；使用同一已验证解释器。编辑区打开根目录main.py，但终端已cd到other，pwd末尾为editor-lab/other；这里执行python main.py（macOS用python3），得到Other folder C3。先亲自复现，判断与根目录两行预期不符的唯一原因。检查保存状态与解释器证据，再选一种修复方式真正重跑。交付两份源码位置、故障cwd/命令/真实输出、原因、修复cwd/命令/真实输出，以及为何不用改print或重装。",
        hints: ["题目已排除未保存和解释器变化。从pwd的位置展开相对文件名，与编辑区完整位置比较。", "列出当前目录，查看其中同名文件内容；改变终端位置或脚本参数，使其指向编辑区目标。保留原始证据，最后仍须自己确认目标并运行。"],
        solution: ["从other输入main.py指向other/main.py，所以得到Other folder C3。编辑区的根目录main.py同名却不是同一份；条件已给定保存完成、解释器相同，无需猜别的原因。", "方案一回到editor-lab，pwd与清单确认，再运行python main.py，macOS用python3。方案二留在other，Windows用python ..\\main.py，macOS用python3 ../main.py。已核实的根目录main.py绝对路径也可。", "重跑应为Ready B2、Saved copy两行；保存真实结果，与修复前Other folder C3对照。记录解释器位置/版本与保存状态，说明变化的是执行目标。", "常见错因：复制新源码到other迎合结果、只改编辑区、未重跑或删掉另一份。这些没证明正确定位。可用py或不同终端路径，但真实命令须指向原目标，保留前后证据。"],
        rubric: ["实际复现唯一故障，记录pwd、相对命令、两份位置和Other folder C3真实输出。", "用保存状态与解释器诊断排除已排除项，指出命令定位到other中的同名文件。", "独立修复目录或参数，保留正确目标两行真实输出；解释无需改源码或重装。只有答案文字不足达标。"],
      },
    ] },
    { id: "next-step", title: "留下可重现的运行记录", navGroup: "finish", navLabel: "下一步", blocks: [
      p("保存源码与简表。下次关闭编辑器再打开，能回答：在编辑哪份文件？是否写回磁盘？pwd在哪？哪个Python执行了哪个参数？为什么出现这个结果？再遇错配，按保存状态、目标位置与解释器证据检查并重跑。网页测验与读完只帮助阅读，不验收本地程序。"),
      p("1.4将讨论虚拟环境，目前只有规划，尚无教材页。进入前应能独立打开文件夹、保存并运行.py，确认cwd、目标文件及解释器位置/版本，遇到本课一种错配能恢复。本节不要求提前创建环境或安装依赖。阅读器可能跳到第5章，那里仍需变量、表达式与控制流程等基础，补齐后再读。"),
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
