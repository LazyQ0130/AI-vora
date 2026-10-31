import { lessonSchema, type ContentBlock } from "../../models";
import { environmentProbe, venvCommands, venvFiles } from "../../resources/python-venv";
const p = (text: string): ContentBlock => ({ type: "paragraph", text });
const code = (filename: string, text: string, language: "python" | "text" = "text"): ContentBlock => ({ type: "code", filename, language, code: text });
const commands = (key: keyof typeof venvCommands): ContentBlock[] => [code("Windows · PowerShell", venvCommands[key].windows), code("macOS · zsh / bash", venvCommands[key].mac)];

export const pythonProjectEnvironmentsLesson = lessonSchema.parse({
  id: "PY101-C01-L04", courseId: "PY101", chapterId: "PY101-C01", contentVersion: 2,
  title: "为项目准备独立的虚拟环境",
  subtitle: "两份程序都运行成功，仍可能用错Python：为每个项目建环境，用实际进程确认选择。",
  prerequisites: "已完成1.1–1.3的操作：保存和运行.py，从pwd与路径确认目标，在VS Code打开项目、选择解释器并核查实际命令。沿用本机已确认可运行的Python 3，不需要先会变量、函数、import或软件包安装。",
  prerequisiteLinks: [
    { title: "1.1 在本地运行.py", href: "/learn/PY101/PY101-C01-L01#run-script", note: "补齐运行命令与保存。" },
    { title: "1.2 分辨同名文件", href: "/learn/PY101/PY101-C01-L02#same-name", note: "补齐cwd和脚本目标。" },
    { title: "1.3 核对解释器", href: "/learn/PY101/PY101-C01-L03#select-interpreter", note: "复习工作区、运行入口与实际解释器。" },
  ],
  objectives: ["在两个独立项目中创建.venv，指出环境位置并说明它与基础Python的关系", "用各自环境解释器运行脚本，以实际路径、前缀、版本和输出核对选择", "识别错误项目解释器，在不改系统配置的情况下修复并保留复跑证据"],
  assessmentMap: [{ objective: 1, exerciseIds: ["create-project-envs"] }, { objective: 2, exerciseIds: ["create-project-envs"] }, { objective: 3, exerciseIds: ["repair-wrong-env"] }],
  learningTime: { reading: [14, 18], practice: [6, 10], coding: [20, 30], basis: "editorial-estimate" },
  sections: [
    { id: "two-projects", title: "两个项目，为什么各留一份环境？", navGroup: "start", navLabel: "项目与环境", blocks: [
      p("你已经能让一个.py运行。现在同时维护两个小项目：一个整理个人记录，一个制作物品标签。假设以后它们需要不同的软件工具，或者同一工具的不同版本。如果都向同一个安装位置增减软件，改动就可能影响另一项目。怎样让每个项目分别维护自己的那一份？"),
      p("在python-projects中建立project-a和project-b，各保存下方main.py并预测输出。两行print用于区分项目；暂不安装包，先练习给每个项目选对环境。"),
      code("创建环境之前", "python-projects/\n├── project-a/\n│   └── main.py\n└── project-b/\n    └── main.py"),
      code("project-a/main.py", venvFiles["project-a/main.py"], "python"), code("project-b/main.py", venvFiles["project-b/main.py"], "python"),
      p("虚拟环境是基于已有Python安装创建的一套项目运行环境，通常提供独立的软件包安装位置。创建它所依据的安装叫基础Python。两个项目可以使用同一版本的基础Python，同时拥有不同环境；创建环境没有替你安装一个全新Python版本。"),
      p("本课用Python自带的venv工具。它让项目分别管理Python相关软件，范围不包括完整操作系统隔离：同一台机器上的文件、其他进程和网络资源仍需按各自规则管理。以后系统学习依赖时，再向指定环境安装所需软件。"),
    ] },
    { id: "create-envs", title: "在正确的项目根创建.venv", navGroup: "create", navLabel: "创建环境", blocks: [
      p("新开终端，用1.3的诊断核对基础Python位置和版本。然后cd到project-a，pwd确认项目根，用dir（macOS为ls）找到main.py。"),
      p("旧终端还能运行python，不保证它仍指向预期安装；这次核对会作为两个项目共用的基础记录。"),
      p("以下Windows命令以已确认的python为基础入口。若你一直用py，先用同一py入口取得版本与解释器位置、核对为目标安装，再将创建命令改为py -m venv .venv；不同py安装与配置的选择规则可能不同。macOS保持已验证的python3。"),
      ...commands("create"),
      p("-m venv表示调用这个Python提供的环境创建工具；最后的.venv是要创建的目录名。它位于当前项目根内，不是另一个要cd进去写代码的项目。创建可能需要片刻，成功时也可能没有额外文字；等命令结束后核对文件。"),
      ...commands("inspect"),
      p("创建结束后，Windows应能找到.venv/Scripts/python.exe，macOS为.venv/bin/python；macOS可用ls -a查看隐藏目录。"),
      {
  "type": "callout",
  "title": "已有环境或创建失败",
  "text": "先核对现有目录的来源；不要清空或移动它。创建失败时保存错误并检查基础Python与位置，需要重做就另选明确的新练习位置。"
},
      p("再到project-b的实际位置，pwd和文件清单确认后，独立重复同样的创建与检查。最终布局如下。两处都叫.venv，但完整位置不同；main.py始终与.venv并列。"),
      code("创建后的项目布局", "python-projects/\n├── project-a/\n│   ├── .venv/\n│   └── main.py\n└── project-b/\n    ├── .venv/\n    └── main.py"),
    ] },
    { id: "direct-run", title: "不激活，先明确指定解释器", navGroup: "run", navLabel: "执行与取证", blocks: [
      p("回到project-a根，执行下方命令。前半段指向环境Python，后半段main.py指向源码；两部分都从当前目录判断位置。"),
      p("PowerShell的&启动后面的程序路径，引号保留路径中的空格。图中箭头表示“Shell启动解释器，再执行脚本”；直接指定路径也能使用环境。"),
      {
  "type": "image",
  "src": "/learning/py101/python-script-runtime.png",
  "width": 2187,
  "height": 1573,
  "mobile": {
    "src": "/learning/py101/python-script-runtime-mobile.png",
    "width": 907,
    "height": 2107
  },
  "alt": "终端中的Shell启动Python，Python执行脚本。cwd决定相对路径起点；可直接调用环境Python，版本相同仍需核对身份。",
  "caption": "先从cwd解析相对脚本路径，再由选中的解释器执行；激活只是选择方式之一。"
},
      ...commands("run"),
      code("project-a的预期输出", "Project A A4\n"),
      p("到project-b根用同一形式执行，预期为Project B B6。两次相对命令看起来一样，但从不同cwd出发，分别指向A和B的环境解释器与脚本。这一步没有运行激活脚本，已经使用了项目环境。"),
      p("输出来自脚本，但还没显示图中的解释器身份。下面用现成观察工具核对真实位置。"),
    ] },
    { id: "observe-env", title: "让正在运行的Python报出位置", navGroup: "run", navLabel: "执行与取证", blocks: [
      p("把下面整段分别保存为两个项目根中的observe_env.py，与main.py、.venv并列。它只读取本次Python进程的信息，不创建或修改环境。原样使用即可；本课不要求编写import或解释sys的全部语法。"),
      code("observe_env.py · 现成只读观察工具", environmentProbe, "python"),
      p("先从project-a根运行下方命令，再从project-b根运行同样形式的命令。运行前预测：哪两项位置应不同，哪两项可能相同？路径以你机器的真实输出为准，不照抄别人的用户名或版本。"),
      ...commands("probe"),
      { type: "table", caption: "把四行结果与目标项目对应", columns: ["输出标签", "表示什么", "检查方法"], rows: [
        ["Interpreter", "sys.executable：当前执行代码的Python程序位置", "完整位置属于目标项目.venv下的Scripts或bin"],
        ["Environment", "sys.prefix：当前Python使用的环境位置", "应为目标项目的.venv；A与B这项不同"],
        ["Base Python", "sys.base_prefix：环境所依据的基础Python位置", "两环境来自同一基础安装时可以相同"],
        ["Version", "本次实际Python版本", "同一基础Python创建的两个环境，版本相同也正常"],
      ] },
      p("先比较Environment与Base Python：标准venv里两者不同，支持当前进程处于虚拟环境的判断。再将Interpreter、Environment与目标项目对应，确认是不是要用的那一份。"),
      p("若只看Version，两个同版本环境会被混作一个；若只看(.venv)，两个同名目录也无法区分。用A解释器和B解释器各运行一次观察工具，保留路径后缀作对照。"),
      p("为A、B各留一次创建命令、运行结果和四行诊断。公共基础Python/版本只登记一次；后续命令不变可引用编号，环境身份有变化时再留新诊断。"),
    ] },
    { id: "activate-env", title: "激活只是让当前终端调用更方便", navGroup: "activate", navLabel: "激活与切换", blocks: [
      p("直接调用成功后，再看激活。它在当前shell会话中调整命令查找，使简短的python通常指向环境解释器，省去每次输入完整路径。在对应项目根，按正在使用的shell执行："),
      ...commands("activate"),
      p("上面分别是PowerShell与zsh/bash的激活命令。激活后再运行诊断，路径仍应属于当前项目，随后可用python main.py。"),
      {
  "type": "callout",
  "title": "PowerShell阻止Activate.ps1时",
  "text": "保存原提示，改用direct-run中的环境Python路径运行并诊断。环境可能已可用，无需修改执行策略或系统PATH。"
},
      p("激活没有创建第二个环境，也不是使用环境的唯一方式。结束当前激活时，在同一个shell输入deactivate；之后再次运行诊断确认实际解释器。关闭或换一个终端后，应重新pwd、定位项目并核对解释器；不能把先前会话状态当作新终端的保证。"),
      code("在已激活的当前shell退出", "deactivate"),
      p("只cd到另一个项目，通常不会把已激活环境自动换成另一份。切换时最短可核验的做法是：确认新项目位置，直接调用该项目.venv中的解释器，并重新诊断。终端若仍激活着A，明确写出B解释器路径依然能使用B，不必为修复反复修改源码。"),
    ] },
    { id: "editor-env", title: "在VS Code中分别选择项目环境", navGroup: "editor", navLabel: "编辑器选择", blocks: [
      p("在VS Code单独打开project-a，打开main.py或observe_env.py，再用Python: Select Interpreter选project-a/.venv。先看候选完整路径。"),
      p("未找到候选时，可刷新或用「输入解释器路径」定位已存在的Scripts/python.exe（macOS为bin/python），先确认文件，而不是另建环境。"),
      p("保存文件，用官方Python整文件入口分别执行observe_env.py和main.py。核对终端命令、四行诊断及输出。界面可能随扩展变化，判断依据仍是实际进程。"),
      p("再单独打开project-b文件夹，选它自己的.venv并重新执行。同一版本号可以出现两次，关键是项目位置与实际前缀。新终端可能由扩展自动激活，取决于设置；切换解释器后，已有终端不保证同步改变。分别检查旧终端和新终端中的实际命令，仍以诊断为依据。"),
    ] },
    { id: "recover-env", title: "程序输出正常，为什么仍选错环境？", navGroup: "recover", navLabel: "检查与恢复", blocks: [
      p("回到project-a根，确认main.py与observe_env.py均已保存，目标是用A自己的环境。现在故意指定B的环境执行A的脚本。这里控制脚本、保存状态和基础版本不变，只改变解释器："),
      ...commands("wrong"),
      p("这次仍会显示Project A A4，但Environment位于project-b/.venv，说明用了B。保持A源码不动，只换回A解释器，重跑脚本和观察工具。"),
      p("文字和版本可以不变；Interpreter与Environment回到A，才是本次环境修复的证据。"),
      { type: "table", caption: "遇到不一致时，先定位再恢复", columns: ["现象", "先看什么", "可核验恢复"], rows: [
        ["在错误项目目录建了环境", "pwd、.venv和源码各属于哪里", "保留误建目录，回到正确项目，在尚无环境时用已核对基础Python新建；不移动/改名旧环境"],
        ["VS Code用基础Python或另一项目环境", "实际运行命令和四行诊断", "在当前项目选择其环境，官方入口重跑；或直接指定正确解释器"],
        ["旧终端没跟着切换", "旧终端实际解释器与新项目要求", "明确调用目标环境路径；新终端也重新核对"],
        ["PowerShell激活受限", "保留原错误，检查环境解释器文件", "直接调用环境Python，取得正确诊断；不更改安全策略"],
        ["关闭终端后不知从哪里运行", "项目位置、pwd和保存源码", "重新定位项目，再用明确路径执行并诊断"],
      ] },
      { type: "quiz", id: "same-version-env", question: "A、B的Version相同，B的解释器运行A的print也成功。怎样判断是否符合A使用自己环境的要求？", options: [
  "两个Version相同，已经足以证明环境相同",
  "核对实际Interpreter和Environment是否属于目标项目A",
  "脚本输出Project A，足以证明启动的是A的Python"
], correct: 1, explanations: [
  "同一基础版本能创建多个环境。只换解释器运行观察工具，比较实际路径。",
  "实际解释器与prefix对应目标环境，才支持本题要求；保留前后身份对照。",
  "普通print由脚本决定，B的Python也可能成功显示Project A。用同次选择运行观察工具核对。"
] },
    ] },
    { id: "keep-source", title: "保留源码，让环境能够重新建立", navGroup: "keep", navLabel: "保留与重建", blocks: [
      p(".venv是可按说明重新建立的环境目录，自己的源码留在项目根。换电脑或改变项目位置时，通常在目标位置重新创建环境，不复制整个.venv来代替创建；其中一些脚本会记住原位置。以后学习依赖管理，再补充如何重建所需软件的记录。"),
      p("使用Git时，通常将.venv/写进项目.gitignore，忽略可重建的环境目录；源码仍保留。下方规则不会改变Python执行。"),
      p("较新Python可能在环境内部生成.gitignore，仍需核对项目本身的忽略规则。Git操作的完整流程放在后续课程。"),
      code("项目.gitignore中的环境忽略规则", ".venv/\n"),
    ] },
    { id: "practice", title: "在新的项目里独立完成两次操作", navGroup: "practice", navLabel: "独立练习", blocks: [
      { type: "exercise", id: "create-project-envs", title: "建立自己的两个项目环境", kind: "实验",
        prompt: "另建两个自己命名的新项目，各在.venv外保存带自选标记的.py。口头预测输出，用同一已核对基础Python分别创建.venv，再用各环境解释器执行源码和现成observe_env.py。交两份源码及一张身份表：项目/环境/文件位置、创建/执行命令、真实程序输出、Interpreter与Environment。相同Base和Version只在会话卡记一次并引用；不同则分列。解释源码位置和同版本不同环境。",
        hints: ["先区分项目根、源码、环境三个位置。两个目录都叫.venv时，还需要观察什么才能分辨？", "对每个项目依次核对pwd与源码位置、基础Python、创建后的解释器文件，再让该解释器运行源码和观察工具。比较两份真实前缀，自己补齐目标路径与最后执行。"],
        solution: [
  "一种示例布局是新建workshop/report与workshop/tools/label，在report保存check.py输出自选提醒，在label保存tag.py输出另一标记。示例可为Report R8和Label L9，但你的主题与标记应自己决定；先预测（可口述）。两个源文件均位于环境外。",
  "分别到两个项目根确认pwd，从已核对的基础Python运行python -m venv .venv；macOS用python3，已确认的py可用对应入口。检查各自Scripts/python.exe或bin/python，保留实际创建记录。",
  "在report根可用Windows的& \".\\.venv\\Scripts\\python.exe\" .\\check.py，macOS用./.venv/bin/python check.py；label根把源码参数换成tag.py。两边保存并执行现成观察工具，记录本次源码输出及Interpreter/Environment；Base与Version相同可引用一次真实共用记录。",
  "两个完整prefix分别属于report/.venv与tools/label/.venv，且各自不同于base_prefix，说明这两次进程使用不同项目环境。同一基础安装和版本不影响此判断；不需要安装第二个Python或第三方包。",
  "常见错误是两次都在同一目录创建、源码放进.venv、只凭提示符判断、照抄示例路径。回看pwd/文件位置/实际诊断。接受自选文件名、含空格路径、绝对解释器路径或经实际验证的激活后执行，条件是证据完整且指向各自环境。",
  "交付按本题题干与rubric：源码可用一份加差异，运行记录用短表；相同命令、环境和版本引用会话卡，不重复誊写。"
],
        rubric: [
  "两个新项目实际创建环境，源码在环境外、自选标记真实运行。",
  "一张表有各自创建/运行命令、executable与prefix，Base/Version相同可共用一次真实记录。",
  "以目标完整位置区分环境，说明基础Python关系；普通输出或版本相同不能代替身份。"
],
      },
      { type: "exercise", id: "repair-wrong-env", title: "输出正确，解释器却来自另一项目", kind: "实验",
        prompt: "可复用题一的两个项目作为report与label角色。目标是用report自己的环境运行report/check.py。保持源码已保存、脚本参数正确，先故意用label环境执行程序和观察工具，再独立修复环境选择并实跑。交源码及前后两行对照：cwd/命令、Interpreter/Environment、普通输出、与目标是否相符。未变的Base/Version引用会话卡；解释为何输出及版本未变仍能证实修复。",
        hints: ["已排除未保存、错误脚本和版本差异。看看命令前半段来自哪个项目，诊断的当前环境又属于哪里。", "把目标项目完整位置与实际Interpreter、Environment逐项比对。确定需要替换的解释器或当前shell选择，保持脚本参数不变，再自行执行并核对新诊断。"],
        solution: [
  "在report根，Windows可用& \"..\\tools\\label\\.venv\\Scripts\\python.exe\" .\\check.py，再用同一解释器执行.\\observe_env.py；macOS对应../tools/label/.venv/bin/python check.py与observe_env.py。它可正常打印report标记，但prefix是label环境，违反report必须使用自己环境的条件。",
  "一种修复是留在report根，Windows改为& \".\\.venv\\Scripts\\python.exe\" .\\check.py，macOS用./.venv/bin/python check.py。然后用同一正确解释器执行observe_env.py；不要改check.py去迎合结果。",
  "保存前后诊断。修复后的Interpreter和Environment属于report/.venv，并与base_prefix不同，脚本参数仍是report/check.py；输出与版本允许保持原样，变化的是运行环境。",
  "合理替代为明确绝对路径，或当前shell激活report环境后执行并取得相同诊断。PowerShell激活受限直接走解释器路径。常见错因是只看print或(.venv)、切目录却沿用旧激活、删环境或复制环境目录；这些都没有证明正确选择。",
  "交付按本题题干与rubric：源码可用一份加差异，运行记录用短表；相同命令、环境和版本引用会话卡，不重复誊写。"
],
        rubric: [
  "正确脚本真实由错误项目解释器执行，保留身份错配与正常输出。",
  "对照目标完整位置判断，无须每轮重抄未变的Base/Version。",
  "安全改解释器选择并实际复跑到report环境，不改系统PATH、策略或旧环境。"
],
      },
    ] },
    { id: "next-step", title: "下次打开项目，先核对这条关系", navGroup: "finish", navLabel: "下一步", blocks: [
      p("以后重开项目，按图核对cwd、解释器和脚本，再看诊断是否属于目标环境。项目源码与短记录留好，环境可在需要时按说明重建。"),
      p("1.5要把说明和分段代码放进Notebook。先确认自己能创建环境、直接运行环境Python并诊断；下一节再区分Notebook服务器与执行代码的内核。第5章仍需变量、表达式和控制流程基础。"),
    ] },
  ], resources: [],
  references: [
    { title: "Python venv", href: "https://docs.python.org/3.14/library/venv.html", note: "创建、直接调用、激活与可重建环境。" },
    { title: "Python虚拟环境入门", href: "https://docs.python.org/3/tutorial/venv.html", note: "项目环境的用途；软件包管理留后续学习。" },
    { title: "sys运行信息", href: "https://docs.python.org/3.14/library/sys.html", note: "实际解释器、环境前缀与基础位置。" },
    { title: "VS Code Python environments", href: "https://code.visualstudio.com/docs/python/environments", note: "环境发现和选择，界面与扩展配置有关。" },
    { title: "VS Code Python tutorial", href: "https://code.visualstudio.com/docs/python/python-tutorial", note: "工作区、选定解释器与终端运行。" },
    { title: "Run Python code", href: "https://code.visualstudio.com/docs/python/run", note: "官方整文件运行入口。" },
  ],
});
