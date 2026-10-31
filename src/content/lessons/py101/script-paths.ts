import { lessonSchema, type ContentBlock } from "../../models";
import { pathCommands, pathFiles } from "../../resources/python-paths";

const p = (text: string): ContentBlock => ({ type: "paragraph", text });
const code = (filename: string, text: string, language: "python" | "text" = "text"): ContentBlock => ({ type: "code", filename, language, code: text });
const file = (name: keyof typeof pathFiles) => code(name, pathFiles[name], "python");
const command = (id: keyof typeof pathCommands): ContentBlock[] => [
  code("Windows · PowerShell", pathCommands[id].windows),
  code("macOS · 终端", pathCommands[id].mac),
];

export const pythonScriptPathsLesson = lessonSchema.parse({
  id: "PY101-C01-L02", courseId: "PY101", chapterId: "PY101-C01", contentVersion: 2,
  title: "解释器怎样找到并执行脚本",
  subtitle: "同样输入run.py，可能运行另一份文件：从当前目录出发，沿路径找到真正的目标。",
  prerequisites: "已完成1.1：能打开系统终端，用选定的python、py或python3运行解释器，保存.py、修改print，使用cd、pwd和dir或ls。若还做不到，先按下方入口补齐。本节沿用已有编辑工具与解释器，不再安装软件。",
  prerequisiteLinks: [
    { title: "1.1 保存一个.py文件", href: "/learn/PY101/PY101-C01-L01#save-script", note: "补修文件创建与保存。" },
    { title: "1.1 在文件所在的位置执行", href: "/learn/PY101/PY101-C01-L01#run-script", note: "补修cd、pwd及文件清单。" },
  ],
  objectives: [
    "根据当前工作目录和相对路径指出实际目标文件，并用运行结果核对判断",
    "从两个不同工作目录准确执行同一目标脚本，记录路径、预测与实际输出",
    "识别同名文件或空格传参导致的问题，说明原因并验证修复",
  ],
  assessmentMap: [{ objective: 1, exerciseIds: ["trace-target"] }, { objective: 2, exerciseIds: ["same-target-two-starts"] }, { objective: 3, exerciseIds: ["trace-target", "same-target-two-starts"] }],
  learningTime: { reading: [10, 15], practice: [6, 10], coding: [15, 25], basis: "editorial-estimate" },
  sections: [
    { id: "one-file", title: "电脑里有run.py，就一定找得到吗？", navGroup: "start", navLabel: "定位起点", blocks: [
      p("上一节的程序已经能运行。现在要从别的文件夹找到同一份程序：命令里要写怎样的路线？先准备一份能辨认的run.py。"),
      p("在自己的练习位置新建path-lab文件夹，再在其中新建alpha文件夹，把下面一行保存为alpha里的run.py。目录树中的缩进表示包含关系；path-lab本身此时没有run.py。所有代码使用本地Python 3.x自带的print，无需第三方库。"),
      code("先只准备这一份文件", "path-lab/\n└── alpha/\n    └── run.py"),
      file("path-lab/alpha/run.py"),
      p("先cd到自己的path-lab，用pwd确认起点，再用dir（macOS为ls）确认alpha文件夹。先沿下方路线进入alpha找到run.py，预测输出，再执行。"),
      p("Windows沿用已核验的python或py，macOS沿用python3；后面的路径实验保持同一解释器入口。"),
      ...command("root-alpha"),
      code("这次预期输出", "Alpha A1\n"),
      p("看到Alpha A1，说明解释器已沿这条路线读到文件。现在保持文件和cwd，只把脚本参数缩成run.py：先预测还能否找到，再观察一次受控失败。"),
      ...command("root-missing"),
      p("这条命令会报告can’t open file或同类提示，没有本次Alpha A1输出。解释器已启动，但当前目录没有run.py。"),
      p("若你预测能找到alpha里的文件，就把“电脑里有文件”混成了“相对路径已经指到文件”。现在恢复上方带alpha的脚本路线，文件和print都保持不动，再验证。"),
    ] },
    { id: "relative-route", title: "相对路径是一条从当前位置出发的路线", navGroup: "relative", navLabel: "相对路径", blocks: [
      p("当前工作目录是终端此刻使用的文件夹，pwd显示它。运行这些命令时，解释器通常继承这个位置；相对脚本路径就从这里开始解析。相对路径没有从盘符或系统根目录写起，而是说明从当前目录往哪里走。"),
      p("在path-lab中，.\\alpha\\run.py表示：从这里进入alpha，再找到run.py。Windows用反斜杠分隔目录；macOS写./alpha/run.py，用正斜杠。.表示当前目录，所以上一段命令中的点是明确写出了起点。"),
      p("现在先cd alpha，再pwd确认末尾是path-lab/alpha。此时执行下面一条，预期仍为Alpha A1。run.py和.\\run.py在这里都指向当前目录中的同一文件；macOS对应run.py和./run.py。"),
      ...command("alpha-current"),
      { type: "table", caption: "相同的文件，不同起点的路线", columns: ["当前目录", "Windows脚本参数 / macOS脚本参数", "定位过程"], rows: [
        ["path-lab", ".\\alpha\\run.py / ./alpha/run.py", "当前 → alpha → run.py"],
        ["path-lab/alpha", ".\\run.py / ./run.py", "当前 → run.py"],
        ["path-lab/alpha", "..\\alpha\\run.py / ../alpha/run.py", "上一级path-lab → alpha → run.py"],
      ] },
      p("..表示上一级目录。它每出现一次就向上走一级，不表示随便找另一个文件夹。先确定pwd显示的起点，再从左到右读路径，就能判断每一段走到哪里。"),
    ] },
    { id: "same-name", title: "两份run.py，为什么结果不同？", navGroup: "relative", navLabel: "相对路径", blocks: [
      p("回到path-lab，为它增加beta文件夹，在beta里新建另一份run.py，内容如下。原来的alpha/run.py保留。先看完整布局，再比较相同命令。"),
      code("加入第二份同名文件", "path-lab/\n├── alpha/\n│   └── run.py\n└── beta/\n    └── run.py"),
      file("path-lab/beta/run.py"),
      p("先cd到beta并用pwd确认。预测python run.py会读取alpha还是beta中的文件，再运行："),
      ...command("beta-current"),
      p("这次输出Beta B2。在alpha时，run.py指向alpha/run.py；在beta时，它指向beta/run.py。文件名相同，完整位置和内容却不同。要在beta中运行alpha的文件，可以先向上一级到path-lab，再进入alpha："),
      ...command("beta-alpha"),
      p("预期输出Alpha A1。核对方法是从pwd的beta起步，逐段走..、alpha、run.py；结果应与打开这份目标源码看到的文字一致。输出标记只帮助交叉核对，不能单独证明路径：如果把Alpha A1的源码复制到beta，beta也会打印Alpha A1。"),
    ] },
    { id: "absolute-target", title: "不切换目录，也能指定同一个文件", navGroup: "absolute", navLabel: "绝对路径", blocks: [
      p("如果想从多个目录运行同一个alpha/run.py，还可以把它的完整位置交给解释器。这叫绝对路径：Windows通常从盘符和根分隔符开始，如C:\\…；macOS从系统根目录/开始，如/Users/…。它不以此刻的当前目录为起点。"),
      p("先确认alpha/run.py的完整位置：可在文件管理器查看，也可到alpha用pwd取得目录，再接上run.py。将下方整条示例路径换成自己的位置。"),
      p("这是终端命令中的路径，Windows反斜杠写一个即可。含空格时将完整脚本路径一起放进英文引号。"),
      ...command("absolute-root"),
      p("先在path-lab运行这条替换好的绝对路径命令，再cd到beta，pwd确认位置后原样再运行同一条命令。两次预期都是Alpha A1。当前目录变了，绝对路径仍指向同一个alpha/run.py；相对路径则要随起点重新判断。"),
      { type: "callout", title: "运行记录记的是你自己的位置", text: "保存命令时保留实际路径和pwd结果。上面的C:\\Users\\…与/Users/…只是路径形式示例。路径字母大小写按文件实际名称输入，可减少跨系统差异带来的问题。" },
    ] },
    { id: "space-argument", title: "文件夹名字里有空格时", navGroup: "spaces", navLabel: "空格与引号", blocks: [
      p("回到path-lab，增加名为my scripts的文件夹，注意两个单词之间有一个空格。把下一行保存为其中的run.py。现在path-lab下有alpha、beta、my scripts三个并列文件夹，各有一份run.py。"),
      file("path-lab/my scripts/run.py"),
      p("在path-lab执行下面这条未加引号的命令，先预测能否找到文件："),
      ...command("space-unquoted"),
      p("未加引号时，空格把路径拆成了不同参数：.\\my（macOS为./my）成了脚本路径，后面的scripts部分被分开。这里没有my文件，所以打开失败。"),
      p("参数是命令后交给程序的一项信息。这里需要让完整的my scripts/run.py成为一项，再重跑观察。"),
      p("用一对英文双引号包住完整路径，重跑核对："),
      ...command("space-quoted"),
      code("正确引用后的预期输出", "Space S3\n"),
      p("引号把含空格的路径作为一个整体交给程序；不会给文件改名，也不会改源码里的文字。完整绝对路径只要含空格，也同样整段引用。使用普通英文引号即可，本节路径不包含引号或其他特殊符号。"),
    ] },
    { id: "script-and-cwd", title: "脚本的位置和终端的位置可以不同", navGroup: "boundary", navLabel: "执行边界", blocks: [
      p("在beta用pwd确认起点，运行alpha脚本的绝对路径，结束后再pwd。两次位置都应是beta，程序输出则来自alpha。"),
      p("如果你预测pwd会变到alpha，就把“脚本所在位置”和“终端当前目录”混在一起了。显式cd到alpha再pwd作一次对照，就能看见真正改变终端位置的动作。"),
      p("这里的短脚本只做print，没有切换目录的动作。运行结束后，父终端通常仍停在原目录；启动一个.py文件不会替你执行cd。以后程序可能读取其他文件，那些文件怎样定位需要另学；此处先把脚本目标与当前目录分开。"),
      { type: "quiz", id: "cwd-after-run", question: "终端在beta，执行alpha/run.py的绝对路径且正常结束。接着pwd通常显示哪里？", options: [
  "beta：运行文件没有自动改变父终端cwd",
  "alpha：脚本放在那里，所以父终端跟着过去",
  "脚本文件的完整路径：pwd显示刚执行的文件"
], correct: 0, explanations: [
  "前后各执行一次pwd可验证仍在beta；cd才是本课改变终端位置的动作。",
  "混淆了脚本位置与父终端cwd；在beta用绝对路径执行，再pwd核对。",
  "pwd报告当前目录，不报告最近的文件。将pwd和实际命令分开看。"
] },
    ] },
    { id: "check-path", title: "先核对位置，再修命令", navGroup: "check", navLabel: "路径排错", blocks: [
      p("找不到文件或输出意外时，先pwd找起点，再dir/ls核对名字，最后沿脚本参数逐段定位并查看源码。下表把现象对应到最小修复动作。"),
      { type: "table", caption: "路径问题的最小恢复动作", columns: ["现象", "观察与判断", "恢复后检验"], rows: [
        ["can’t open file / No such file", "把报错中的目标与pwd、实际文件位置对照", "修正相对路线或使用完整路径，重跑核对输出"],
        ["程序成功结束，却打印另一份文字", "可能运行了同名文件；查起点、命令目标和实际源码", "改为想要的目标路径；核对内容和输出，不能只看文件名"],
        ["错误中只出现my，没有my scripts", "查看含空格的脚本路径是否被分成多项", "整段加英文引号，再确认正常输出"],
      ] },
      p("本节错误都是文件定位与传参问题。版本命令本身都不能运行时，回到1.1的环境段处理；如果出现SyntaxError，则先核对源码符号，而不是把所有报错都归为路径问题。故障恢复另预留5–15分钟，时间仍是编辑估计。"),
    ] },
    { id: "practice", title: "换一个布局，自己决定怎样运行", navGroup: "practice", navLabel: "独立练习", blocks: [
      p("以下是两道核心任务。先完成预测与操作，再按需要展开提示；页面输入只作临时思考，源码和真实运行记录保存在本地。"),
      code("任务一目录（与正文不同）", "route-task/\n├── east/\n│   └── check.py\n└── west/\n    └── check.py"),
      file("route-task/east/check.py"), file("route-task/west/check.py"),
      { type: "exercise", id: "trace-target", title: "三条命令分别指向谁？", kind: "实验",
        prompt: "按上方新布局准备两份check.py。在route-task/west保持cwd不变，依次研究本平台三条命令：当前check.py、 ../east/check.py、 ../check.py。用三行表先记目标或缺失判断及预期，再实际运行填结果。自行给其中一份源码加独特print标记，预测受影响路线，只重跑指向该文件的一条确认。交两份源码、三行表及这一次改值对照；命令可编号，逐段路线理由可现场说明。",
        hints: ["每条都从同一个pwd位置出发。注意路径里的点和两个点各移动到哪里，而不是只看check.py这个名字。", "先在纸上写起点，再每读一段更新当前位置；走到最后才检查那个位置是否有该文件。可用dir/ls核对，不要在运行三条命令之间切换目录。自己加标记后，重新沿同样路线判断。"],
        solution: [
  "起点是route-task/west。.\\check.py（macOS为./check.py）留在west，目标是west/check.py，初始输出West W5。",
  "..先到route-task，再进east，所以第二条指向east/check.py，初始输出East E4。第三条先到route-task就寻找check.py，而根目录只有east/west文件夹，因此文件打开失败，没有这次的正常输出。",
  "例如自行给west/check.py追加一个新print：第一条应多一行自选标记，第二条仍输出East E4，第三条仍打不开文件。若选择改east则变化应出现在第二条。记录你实际选择与结果，不照抄本例的选择。",
  "常见错误：把..当作留在west，或运行前不知不觉cd，都会改变推理起点。恢复到明确的west位置再比对。合理替代：用单引号包住路径、等价分隔形式或全程py均可；本题预测仍须针对指定的三条相对路线。",
  "交付按本题题干与rubric：源码可用一份加差异，运行记录用短表；相同命令、环境和版本引用会话卡，不重复誊写。追加标记后的正式要求是一条受影响路线的预测与重跑；其余路线可自查，不要求重复三次。"
],
        rubric: [
  "三路线有事前目标/缺失预测和真实输出/错误，cwd保持west。",
  "能从起点逐段解释实际目标，同名文件不被混淆，命令可引用一次编号。",
  "自选一文件加标记，指出受影响路线并实际重跑该路线；提交原源码加差异即可，无须把三条再全部运行。"
] },
      code("任务二目录", "delivery-task/\n├── work/\n└── my notes/\n    └── ready.py"),
      file("delivery-task/my notes/ready.py"),
      { type: "exercise", id: "same-target-two-starts", title: "两个起点，运行同一份ready.py", kind: "代码",
        prompt: "创建delivery-task/work和my notes/ready.py，为源码加自选标记。从delivery-task与work两个起点，各预测并实际运行同一个ready.py。用两行表交起点、目标、命令、预期和真实结果；目标完整路径相同可只记一次再引用。另保留一次空格路径未加引号的真实失败→补引号成功记录。若方案中cd，记实际执行cwd。交源码，解释两条路径为何到同一目标，不能只凭输出标记判断。",
        hints: ["目标固定，起点改变。分别画出从每个起点到目标的路线；检查终端会把哪段内容当作一个参数。", "先在文件管理器确认my notes里的ready.py及自选标记，再比较两次pwd。若用相对路径就逐段行走；若用绝对路径就核对完整位置。将含空格的完整脚本参数作为一个整体传入，保留修复前后实际结果。"],
        solution: [
  "先给目标追加自己选定的print并保存。例如选择标记Q7，则每次预期两行Target T6与Q7；你的第二行由自己决定。",
  "一种方案：Windows在delivery-task执行python \".\\my notes\\ready.py\"，在work执行python \"..\\my notes\\ready.py\"；macOS分别为python3 \"./my notes/ready.py\"和python3 \"../my notes/ready.py\"。两条都沿已知起点走到同一文件。",
  "另一种方案：先确认ready.py真实绝对路径，在两个目录都输入python后加被引号包住的同一完整路径（macOS为python3）。先cd到目标目录再运行也能成功，但要同时记录初始目录和实际执行目录，解释那一步已经改变起点。",
  "有意省略引号时，my notes被拆开；本布局不存在相应的my路径，文件打开失败。给整个路径补配对英文引号，不改名、不改源码，重跑应得到两行预期结果。",
  "常见错误：从work照抄根目录的相对路径、只用输出标记证明位置，或没记下cd后的实际起点。用pwd、目录清单、目标完整位置与打开的源码一起复核。合理替代：配对单引号、准确绝对路径、明确记录的目录切换都接受；各方案的实际路径应指向同一文件。",
  "交付按本题题干与rubric：源码可用一份加差异，运行记录用短表；相同命令、环境和版本引用会话卡，不重复誊写。"
],
        rubric: [
  "两起点各有预测与实跑；目标位置一次登记、两路线引用，cd后的cwd如实记录。",
  "两次都指向同一保存源码，输出有自选标记，路径与源码相互核对。",
  "真实复现空格拆参并补引号恢复，相关错误和成功结果保留。"
] },
    ] },
    { id: "next-step", title: "带着路径判断能力进入编辑器", navGroup: "finish", navLabel: "下一步", blocks: [
      p("保留源码和两道任务的短表。每次看到python run.py，先从当前目录走一遍路径，就能核对是否在运行想要的文件。"),
      p("下一节1.3把这份路径判断用到编辑器：打开正确文件夹，修改程序，保存后检查实际命令与结果。第5章函数仍需要变量、表达式和控制流程等基础。"),
    ] },
  ],
  resources: [],
  references: [
    { title: "Python命令行：脚本参数", href: "https://docs.python.org/3/using/cmdline.html#interface-options", note: "确认脚本可以用相对或绝对文件系统路径指定。" },
    { title: "PowerShell路径语法", href: "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_path_syntax?view=powershell-7.5", note: "核对当前目录、点、两点及完整路径。" },
    { title: "PowerShell引用规则", href: "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_quoting_rules?view=powershell-7.5", note: "把带空格的路径作为一个参数。" },
    { title: "zsh官方手册：引用", href: "https://zsh.sourceforge.io/Doc/Release/Shell-Grammar.html#Quoting", note: "核对macOS终端示例使用的引用规则。" },
  ],
});
