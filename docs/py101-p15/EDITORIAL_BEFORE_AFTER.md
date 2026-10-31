# 十二课表达改前/改后

AI辅助逐段编辑；完整350项决定见PARAGRAPH_REVIEW.json，统计不是教学效果评分。

## PY101-C01-L01

原文：

> Windows输入 python，macOS输入 python3，再按回车。看到 >>> 后，解释器正在等待Python指令。只把上面的 print("Hello, Aivora!") 复制进去并回车；>>> 是窗口自己显示的提示符，不复制。若你已经用 py --version 验证了Windows的 py 命令，也可用 py 进入，后文的 python 一律换成 py。

改文：

Windows输入python，macOS输入python3，回车后应看到>>>，表示解释器正在等Python代码。只输入上面的print语句并回车；>>>由窗口显示，不复制。

Windows若已用py --version验证py，就用py进入，并在后文一致替换python。

理由：按任务分开动作、观察结果与必要故障分支 稳定section/练习/Quiz ID、先修、首教代码与命令保留。

## PY101-C01-L02

原文：

> 上一节，你在文件所在的目录输入命令，成功运行了程序。现在换一个位置：电脑里明明有run.py，python run.py还一定能找到它吗？先用一个文件验证。

改文：

上一节的程序已经能运行。现在要从别的文件夹找到同一份程序：命令里要写怎样的路线？先准备一份能辨认的run.py。

理由：按任务分开动作、观察结果与必要故障分支 稳定section/练习/Quiz ID、先修、首教代码与命令保留。

## PY101-C01-L03

原文：

> 先激活main.py。打开命令面板：Windows用Ctrl+Shift+P，macOS用Command+Shift+P，也可用「查看 → 命令面板 / View → Command Palette」。搜索Python: Select Interpreter（Python: 选择解释器），从已安装候选中选前两节验证可用的Python。记录版本和位置，可从候选说明、状态栏或详情查看。不要选择创建环境，本课不创建虚拟环境。

改文：

先打开main.py。按Ctrl+Shift+P（macOS为Command+Shift+P）打开命令面板，搜索Python: Select Interpreter，选择前两节已验证可用的Python。

在候选说明或详情核对路径和版本。此步选已有解释器；项目环境的创建在1.4学习。

理由：按任务分开动作、观察结果与必要故障分支 稳定section/练习/Quiz ID、先修、首教代码与命令保留。

## PY101-C01-L04

原文：

> 沿用1.3的方法，在VS Code单独打开project-a文件夹，打开main.py或observe_env.py。调用Python: Select Interpreter，核对候选的完整位置，选择project-a/.venv对应的解释器。若未发现，可刷新列表或通过「输入解释器路径」定位实际存在的Scripts/python.exe（macOS为bin/python），不要因此另建来源不明的环境。

改文：

在VS Code单独打开project-a，打开main.py或observe_env.py，再用Python: Select Interpreter选project-a/.venv。先看候选完整路径。

未找到候选时，可刷新或用「输入解释器路径」定位已存在的Scripts/python.exe（macOS为bin/python），先确认文件，而不是另建环境。

理由：按任务分开动作、观察结果与必要故障分支 稳定section/练习/Quiz ID、先修、首教代码与命令保留。

## PY101-C01-L05

原文：

> 主流程在项目环境安装Notebook后，通常已有Python内核可用，无需人人额外执行用户级内核注册。列表缺少目标时，先确认安装/启动来自同一项目、该环境有ipykernel；按官方帮助请支持人员检查发现方式，再做有条件的修复，不猜选另一个Python。VS Code的Notebook Kernel选择也不同于普通.py解释器选择，本课继续用浏览器Notebook完成操作。

改文：

在项目环境安装Notebook后通常已有可用内核，先完成上面的选择与诊断。

**内核列表缺少目标时**：请支持人员检查安装/启动是否来自目标项目、ipykernel及内核发现方式，再按官方说明处理。无需人人注册用户级内核；本课使用浏览器Notebook，VS Code的Kernel选择是另一入口。

理由：按任务分开动作、观察结果与必要故障分支 稳定section/练习/Quiz ID、先修、首教代码与命令保留。

## PY101-C01-L06

原文：

> 第一章1.1–1.6帮助你准备了文件、环境与运行能力。接下来按原课程体系进入第二章“变量、基本类型、表达式与输入输出”：2.1「用变量保留并更新程序里的值」已有待人工审核试读，将在普通.py脚本中系统练习名称赋值、读取、更新和执行顺序。第二章其余课时仍只有规划。第5章函数试读还需要表达式与控制流程等中间先修，阅读器的可读课时导航不代表可以直接跳学。整门PY101仍在筹备。

改文：

第一章的前三节让你写出并可靠重跑短程序，后三节补项目环境、Notebook与协作复现。接着进入2.1，在普通.py里系统学习变量的赋值、读取和更新。第5章函数还依赖表达式与控制流程等中间知识，按先修顺序补齐后再读。

理由：移走过时开发状态，以初期成果和工具专题收束第一章 稳定section/练习/Quiz ID、先修、首教代码与命令保留。

## PY101-C02-L01

原文：

> 在自己的练习文件夹新建task_labels.py，源码放在.venv外。用编辑器把下面四行写入，行首都不加缩进。先在本地笔记写下两行预测：第一次print执行时，之前已经发生哪次赋值？第二次print之前又发生了什么？写好再保存运行。

改文：

新建task_labels.py，写入下方四行，行首不缩进。先沿两次print的位置预测各读到什么，再保存整份文件。

理由：按任务分开动作、观察结果与必要故障分支 稳定section/练习/Quiz ID、先修、首教代码与命令保留。

## PY101-C02-L02

原文：

> 回到same_display.py，在原四行之后追加下面这一行；这个文件前面已经给item_count赋值为3。先从里面看：item_count读取当前值3；type(item_count)取得它的类型；外层print再把类型结果显示出来。两层括号分别成对，执行观察时先得到里面的结果，再交给外面的print。写下新增一行的预测，再保存并从头运行same_display.py。

改文：

回到same_display.py，在原四行后追加下方观察语句。先从内层看：item_count读到3，type取得它的类型，外层print再显示这个结果。

两层括号分别配对。先预测新增一行，再保存从头运行；本次没有把3转换成另一类型。

理由：按任务分开动作、观察结果与必要故障分支 稳定section/练习/Quiz ID、先修、首教代码与命令保留。

## PY101-C02-L03

原文：

> 在文件所在目录沿用第一章已核验的解释器。Windows用pwd、dir确认文件，再执行下面第一条；macOS用pwd、ls确认后执行第二条。一直使用py的Windows环境可保持py。本课后续新文件只替换命令中的文件名，始终保存并从头运行整份.py。

改文：

在文件所在目录执行下方对应命令。沿用已核验的python/py或python3；后面每次换文件名后，仍先保存，再整份运行。

理由：按任务分开动作、观察结果与必要故障分支 稳定section/练习/Quiz ID、先修、首教代码与命令保留。

## PY101-C02-L04

原文：

> 在自己的练习文件夹新建capacity_check.py，行首不加缩进，源码放在.venv外。保存后用pwd和Windows的dir确认文件，沿用已核验的解释器运行第一条命令；macOS用pwd、ls确认后运行第二条。此前一直用py的Windows环境可保持py。后面的新文件只替换命令中的文件名，每次都保存并从头运行整份.py。

改文：

新建capacity_check.py，保存后在文件所在目录执行下方对应命令。沿用已核验的解释器，后续新文件替换文件名即可。

理由：按任务分开动作、观察结果与必要故障分支 稳定section/练习/Quiz ID、先修、首教代码与命令保留。

## PY101-C02-L05

原文：

> 终端用pwd和Windows的dir（macOS用ls）确认目录包含文件，沿用第一章核验过的解释器。Windows运行第一条命令，macOS运行第二条；此前一直使用py的Windows环境可保持py。命令放在shell提示符后，不写进.py，也不在Python的>>>后运行脚本命令。

改文：

保存文件后，在其所在目录执行下方对应命令。沿用已核验的python/py或python3；启动命令在Shell中输入，接下来的数据才在程序提示后键入。

理由：按任务分开动作、观察结果与必要故障分支 稳定section/练习/Quiz ID、先修、首教代码与命令保留。

## PY101-C02-L06

原文：

> 另建insert_mass.py，先预测下面一行显示什么，再保存运行。Windows在文件所在目录用python insert_mass.py，macOS用python3 insert_mass.py；一直使用已核验py的Windows环境可保持py。用pwd及dir（macOS用ls）核对目录；源码在.venv外、行首不缩进。命令写终端，不写进.py或Python的>>>。后面新文件替换同一命令的文件名并保存重跑。

改文：

新建insert_mass.py，先预测显示内容，再保存运行。Windows在文件目录用python insert_mass.py，macOS用python3；已验证py的环境可继续用py。源码仍放在.venv外。

理由：按任务分开动作、观察结果与必要故障分支 稳定section/练习/Quiz ID、先修、首教代码与命令保留。

## 统计边界

{
  "before": {
    "count": 350,
    "over100": 205,
    "median": 106.5,
    "max": 263,
    "total": 38759,
    "bands": {
      "upTo60": 12,
      "from61to100": 133,
      "from101to160": 174,
      "above160": 31
    }
  },
  "after": {
    "count": 401,
    "over100": 117,
    "median": 84,
    "max": 144,
    "total": 33815,
    "bands": {
      "upTo60": 77,
      "from61to100": 207,
      "from101to160": 117,
      "above160": 0
    }
  }
}

所有section数量与ID顺序保持，新增H2为0。callout文字另计在EDITORIAL_METRICS.json；没有缩小正文16px字体。保留较长的首次定义/完整技术条件，135处改写含真正的顺序、用途和诊断调整，不把100字当上限。
