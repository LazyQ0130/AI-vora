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
  id: "PY101-C01-L02", courseId: "PY101", chapterId: "PY101-C01", contentVersion: 1,
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
      p("上一节，你在文件所在的目录输入命令，成功运行了程序。现在换一个位置：电脑里明明有run.py，python run.py还一定能找到它吗？先用一个文件验证。"),
      p("在自己的练习位置新建path-lab文件夹，再在其中新建alpha文件夹，把下面一行保存为alpha里的run.py。目录树中的缩进表示包含关系；path-lab本身此时没有run.py。所有代码使用本地Python 3.x自带的print，无需第三方库。"),
      code("先只准备这一份文件", "path-lab/\n└── alpha/\n    └── run.py"),
      file("path-lab/alpha/run.py"),
      p("用1.1的方法cd到你自己的path-lab完整位置。执行pwd，看末尾确实是path-lab；Windows用dir，macOS用ls，确认这里列出alpha文件夹。先预测下面的命令会打印Alpha A1，还是打不开文件，再执行对应系统的一条。Windows若一直使用py，将本课所有python替换为py；macOS继续用python3。"),
      ...command("root-missing"),
      p("本例会出现can’t open file或No such file or directory一类信息，本次没有Alpha A1输出。python命令已经启动了解释器，失败的是打开run.py：当前目录里没有这份文件。它不会因为alpha目录里有同名文件就自动进去寻找。保留这条失败信息，接着只改命令中的脚本路径。"),
      ...command("root-alpha"),
      code("这次预期输出", "Alpha A1\n"),
      p("这一改动没有移动文件，也没有修改print。变化的是告诉解释器去哪里读文件。后面我们就用当前目录、传入的路径和实际结果，解释每一次定位。"),
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
      p("先在文件管理器中确认alpha/run.py的完整位置，或者cd到alpha后用pwd取得文件夹完整路径，再接上run.py。下面用文档目录举例：把整条路径换成你自己的实际位置，不要原样复制「你的用户名」。Windows这里是终端命令中的路径，反斜杠写一个即可；没有在编写Python字符串。"),
      ...command("absolute-root"),
      p("先在path-lab运行这条替换好的绝对路径命令，再cd到beta，pwd确认位置后原样再运行同一条命令。两次预期都是Alpha A1。当前目录变了，绝对路径仍指向同一个alpha/run.py；相对路径则要随起点重新判断。"),
      { type: "callout", title: "运行记录记的是你自己的位置", text: "保存命令时保留实际路径和pwd结果。上面的C:\\Users\\…与/Users/…只是路径形式示例。路径字母大小写按文件实际名称输入，可减少跨系统差异带来的问题。" },
    ] },
    { id: "space-argument", title: "文件夹名字里有空格时", navGroup: "spaces", navLabel: "空格与引号", blocks: [
      p("回到path-lab，增加名为my scripts的文件夹，注意两个单词之间有一个空格。把下一行保存为其中的run.py。现在path-lab下有alpha、beta、my scripts三个并列文件夹，各有一份run.py。"),
      file("path-lab/my scripts/run.py"),
      p("在path-lab执行下面这条未加引号的命令，先预测能否找到文件："),
      ...command("space-unquoted"),
      p("本例会失败：终端用空格分开命令的不同参数，把.\\my（macOS为./my）当成脚本路径，其余scripts\\run.py成了另一个参数。本例没有my这个文件，所以Python报告打不开my，而不是运行my scripts里的run.py。参数就是命令后交给程序的一项信息，这里应该把整个脚本路径作为一项。"),
      p("用一对英文双引号包住完整路径，重跑核对："),
      ...command("space-quoted"),
      code("正确引用后的预期输出", "Space S3\n"),
      p("引号把含空格的路径作为一个整体交给程序；不会给文件改名，也不会改源码里的文字。完整绝对路径只要含空格，也同样整段引用。使用普通英文引号即可，本节路径不包含引号或其他特殊符号。"),
    ] },
    { id: "script-and-cwd", title: "脚本的位置和终端的位置可以不同", navGroup: "boundary", navLabel: "执行边界", blocks: [
      p("先cd到beta并用pwd确认位置，再运行前面替换好的alpha绝对路径，运行结束后再执行pwd。两次pwd应相同，都是beta；输出是Alpha A1。这同时说明：传入的目标路径决定读哪份脚本，启动时的当前目录仍可以在别处。"),
      p("这里的短脚本只做print，没有切换目录的动作。运行结束后，父终端通常仍停在原目录；启动一个.py文件不会替你执行cd。以后程序可能读取其他文件，那些文件怎样定位需要另学；此处先把脚本目标与当前目录分开。"),
      { type: "quiz", id: "cwd-after-run", question: "终端在beta，执行alpha/run.py的绝对路径且正常结束。接着pwd通常显示哪里？", options: ["beta，运行脚本没有自动改变父终端位置", "alpha，因为刚运行的脚本保存在alpha"], correct: 0, explanations: ["目标文件可以位于alpha，父终端仍在beta。用运行前后的pwd实际比较。", "脚本位置与父终端当前目录不同；需要执行cd才切换终端目录。"] },
    ] },
    { id: "check-path", title: "先核对位置，再修命令", navGroup: "check", navLabel: "路径排错", blocks: [
      p("遇到找不到文件或输出意外，按这个顺序检查：pwd看起点；dir或ls看这里有哪些名字；从起点逐段走命令中的路径；打开目标源码核对是否误跑同名文件。下面三种现象都不需要先重装解释器。"),
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
        prompt: "输入：按上面的新布局保存两份check.py。在route-task/west中用pwd确认起点，三条命令之间不要cd。Windows依次研究 python .\\check.py、python ..\\east\\check.py、python ..\\check.py；macOS对应 python3 ./check.py、python3 ../east/check.py、python3 ../check.py。每条运行前先写完整目标位置或缺失判断及预期输出，并简述逐段依据；随后实际执行，保留命令、stdout或错误、比对结果。最后自己在其中一份源码末尾增加一行带自选标记的print，预测哪条命令的结果会变化，再运行验证。用短表交付，不用长报告。",
        hints: ["每条都从同一个pwd位置出发。注意路径里的点和两个点各移动到哪里，而不是只看check.py这个名字。", "先在纸上写起点，再每读一段更新当前位置；走到最后才检查那个位置是否有该文件。可用dir/ls核对，不要在运行三条命令之间切换目录。自己加标记后，重新沿同样路线判断。"],
        solution: ["起点是route-task/west。.\\check.py（macOS为./check.py）留在west，目标是west/check.py，初始输出West W5。", "..先到route-task，再进east，所以第二条指向east/check.py，初始输出East E4。第三条先到route-task就寻找check.py，而根目录只有east/west文件夹，因此文件打开失败，没有这次的正常输出。", "例如自行给west/check.py追加一个新print：第一条应多一行自选标记，第二条仍输出East E4，第三条仍打不开文件。若选择改east则变化应出现在第二条。记录你实际选择与结果，不照抄本例的选择。", "常见错误：把..当作留在west，或运行前不知不觉cd，都会改变推理起点。恢复到明确的west位置再比对。合理替代：用单引号包住路径、等价分隔形式或全程py均可；本题预测仍须针对指定的三条相对路线。"],
        rubric: ["三条命令有运行前预测、完整目标/缺失判断及逐段理由，且起点保持west。", "保留三次实际命令与输出/错误，能解释差异；成功运行另一份文件也要识别为目标不同。", "自选一份文件追加独特标记，独立预测并实跑验证变化只作用于指向它的命令；标记和路径共同取证。"] },
      code("任务二目录", "delivery-task/\n├── work/\n└── my notes/\n    └── ready.py"),
      file("delivery-task/my notes/ready.py"),
      { type: "exercise", id: "same-target-two-starts", title: "两个起点，运行同一份ready.py", kind: "代码",
        prompt: "输入：按上面布局创建空work目录和my notes/ready.py，给ready.py再加一行自己选择的标记。目标始终是my notes里的这一份文件。从delivery-task和delivery-task/work两个起点各完成一次运行，先记录pwd、目标完整位置、打算使用的命令与预期，再执行并比对。至少先在一个起点有意不引用含空格的脚本路径，保存实际失败信息，再修复验证。可以选相对路径、绝对路径或明确cd方案；若先cd，额外记录切换后的pwd，不把它冒称原起点的直接运行。交付两行简表，加一条失败→修复记录；结合源码与路径证明两次目标相同，不能只凭输出写着Target。",
        hints: ["目标固定，起点改变。分别画出从每个起点到目标的路线；检查终端会把哪段内容当作一个参数。", "先在文件管理器确认my notes里的ready.py及自选标记，再比较两次pwd。若用相对路径就逐段行走；若用绝对路径就核对完整位置。将含空格的完整脚本参数作为一个整体传入，保留修复前后实际结果。"],
        solution: ["先给目标追加自己选定的print并保存。例如选择标记Q7，则每次预期两行Target T6与Q7；你的第二行由自己决定。", "一种方案：Windows在delivery-task执行python \".\\my notes\\ready.py\"，在work执行python \"..\\my notes\\ready.py\"；macOS分别为python3 \"./my notes/ready.py\"和python3 \"../my notes/ready.py\"。两条都沿已知起点走到同一文件。", "另一种方案：先确认ready.py真实绝对路径，在两个目录都输入python后加被引号包住的同一完整路径（macOS为python3）。先cd到目标目录再运行也能成功，但要同时记录初始目录和实际执行目录，解释那一步已经改变起点。", "有意省略引号时，my notes被拆开；本布局不存在相应的my路径，文件打开失败。给整个路径补配对英文引号，不改名、不改源码，重跑应得到两行预期结果。", "常见错误：从work照抄根目录的相对路径、只用输出标记证明位置，或没记下cd后的实际起点。用pwd、目录清单、目标完整位置与打开的源码一起复核。合理替代：配对单引号、准确绝对路径、明确记录的目录切换都接受；各方案的实际路径应指向同一文件。"],
        rubric: ["记录两个起点及各自命令、目标完整位置、运行前预测和真实结果；有cd时如实记录切换后位置。", "两次都准确指向my notes/ready.py，输出含自己追加的标记，结合路径与源码取证。", "实际复现一次空格拆参失败，指出具体被拆开的路径，修复后正常执行；合理不同命令可达标。"] },
    ] },
    { id: "next-step", title: "带着路径判断能力进入编辑器", navGroup: "finish", navLabel: "下一步", blocks: [
      p("保留两道任务的源码、预测和实际记录。现在看到python run.py时，你应该先问：当前目录在哪，这条路径具体指向哪份文件？同名文件、空格和目录变化都可以通过这两项信息逐一核对。"),
      p("下一节建议1.3「用编辑器完成保存与重跑」。你已有保存、运行、辨认目标文件和排查路径的基础，届时再检查编辑器里打开的文件、集成终端的位置与选中的解释器是否对应。1.3当前仍是规划；阅读器可能跳到现有第5章，函数课还需要前序变量和表达式等基础。"),
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
