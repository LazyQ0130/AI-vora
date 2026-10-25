import { lessonSchema } from "../models";
import {
  pythonFunctionsCode,
  resourcesForProgram,
} from "../resources/programs";

export const pythonFunctionsLesson = lessonSchema.parse({
  id: "PY101-C05-L01",
  courseId: "PY101",
  chapterId: "PY101-C05",
  contentVersion: 1,
  title: "Python 函数与参数",
  subtitle:
    "把重复的步骤变成清晰的接口：从一次调用，理解参数绑定、返回值与默认对象。",
  durationMinutes: 25,
  prerequisites:
    "能阅读变量赋值、数值表达式和列表，了解基本缩进。无需第三方库。",
  objectives: [
    "区分形参、实参与返回值",
    "正确使用位置、关键字、默认与仅限关键字参数",
    "解释可变默认值的共享风险并写出安全版本",
  ],
  sections: [
    {
      id: "concept",
      title: "函数是一份可以调用的约定",
      navGroup: "concept",
      navLabel: "概念",
      blocks: [
        {
          type: "paragraph",
          text: "函数把一段操作组织起来，并给它一个名字。定义函数时，形参描述需要哪些输入；调用函数时，实参提供具体对象。执行 return 表达式会结束当前调用，把结果交还给调用者。没有执行带值的 return 时，函数返回 None。",
        },
        {
          type: "code",
          filename: "first_function.py",
          language: "python",
          code: "def double(value):\n    return value * 2\n\nresult = double(3)\nassert result == 6\n",
        },
        {
          type: "callout",
          title: "返回结果与显示结果是两件事",
          text: "return 让调用者拿到值，print 把文本写到输出。print 本身返回 None。只在函数里 print(6)，并不能让 result = 函数调用 得到数值 6。函数也可能修改对象或产生其他副作用，并非只能做数学映射。",
        },
      ],
    },
    {
      id: "binding",
      title: "一次调用中，参数如何对应？",
      navGroup: "parameters",
      navLabel: "参数",
      blocks: [
        {
          type: "paragraph",
          text: "下面的 transform 先缩放再平移。value 和 scale 可以按位置或关键字传入；scale 与 shift 有默认值。星号 * 后的 shift 只能按关键字传入，能让调用意图更明确。默认值不是额外相加的数：传入实参时，它就取代对应默认值。",
        },
        {
          type: "code",
          filename: "parameter_binding.py",
          language: "python",
          code: "def transform(value: float, scale: float = 2.0, *, shift: float = 0.0) -> float:\n    return value * scale + shift\n\nassert transform(3) == 6.0\nassert transform(3, scale=4, shift=1) == 13\nassert transform(value=3, shift=-1) == 5.0\n",
        },
        {
          type: "image",
          src: "/learning/python-function-call.png",
          width: 1200,
          height: 600,
          mobile: {
            src: "/learning/python-function-call-mobile.png",
            width: 640,
            height: 1040,
          },
          alt: "transform(3, shift=1) 将 value 绑定为 3，使用默认 scale=2，将 shift 绑定为 1，计算 3×2+1 并返回 7。",
          caption:
            "先完成参数绑定，再执行函数体。图中的调用结果为 7，与省略 shift 时的 6 不同。",
        },
        {
          type: "callout",
          title: "类型注解不是运行时检查",
          text: "value: float 和 -> float 表达接口意图，可供编辑器和类型检查工具使用。Python 不会仅凭这些注解在调用时自动拒绝其他类型。示例中的整数输入可以参与运算；实际项目需要另外设计输入验证。",
        },
        {
          type: "paragraph",
          text: "transform(3, 4, 1) 会因 shift 不接受位置实参而抛出 TypeError。transform(3, value=4) 会给 value 重复赋值，同样报错。普通调用中，位置实参应放在关键字实参之前。参数接收对象的引用，不是自动深拷贝；函数体内部对列表的修改可能被调用者看见。",
        },
      ],
    },
    {
      id: "defaults",
      title: "默认值为什么会跨调用共享？",
      navGroup: "parameters",
      navLabel: "参数",
      blocks: [
        {
          type: "paragraph",
          text: "默认表达式在执行 def 语句时求值一次，不会在每次调用时重新创建。因此 items=[] 创建的同一个列表会被省略 items 的调用共享。这个行为是确定的，但通常不符合“每次获得新列表”的意图。",
        },
        {
          type: "code",
          filename: "shared_default.py",
          language: "python",
          code: "def collect(item, items=[]):\n    items.append(item)\n    return items\n\na = collect('A')\nb = collect('B')\nassert a is b\nassert a == ['A', 'B']  # a 也随同一对象改变\n",
        },
        { type: "heading", text: "用 None 表示未提供列表" },
        {
          type: "paragraph",
          text: "把默认值设为 None，并在函数体中创建新列表，可以隔离省略参数的调用。下面的完整脚本还会复制显式传入的列表，因此不会修改调用者的列表。这是本例选择的接口约定；如果只在 None 时创建新列表，而直接修改传入列表，仍会产生对调用者可见的修改。",
        },
      ],
    },
    {
      id: "code",
      title: "运行完整脚本，核对接口行为",
      navGroup: "code",
      navLabel: "代码",
      blocks: [
        {
          type: "paragraph",
          text: "使用 Python 3.10+，无需安装第三方库。下载后运行 python python_functions.py。第一行结果应为 6.0 13 5.0；脚本还验证仅限关键字参数的异常、独立列表与共享默认值。异常被示例主动捕获，不代表脚本运行失败。",
        },
        {
          type: "code",
          filename: "python_functions.py",
          language: "python",
          code: pythonFunctionsCode,
        },
        {
          type: "callout",
          title: "再做一次小改动",
          text: "将 transform(3) 改成 transform(3, shift=1)，先预测返回 7，再执行核对。接着为 double(3) 的结果赋值，并打印它的类型。不要把函数体中的 print 输出误认成返回值。",
        },
      ],
    },
    {
      id: "quiz",
      title: "把接口约定说清楚",
      navGroup: "quiz",
      navLabel: "练习",
      blocks: [
        {
          type: "quiz",
          id: "binding-check",
          question: "对本节 transform 定义，哪一次调用会正常返回 13？",
          options: [
            "transform(3, 4, 1)",
            "transform(3, scale=4, shift=1)",
            "transform(3, value=4, shift=1)",
          ],
          correct: 1,
          explanations: [
            "shift 在 * 后面，只能以关键字传入，第三个位置实参会触发 TypeError。",
            "正确。value=3，scale=4，shift=1，因此 3×4+1=13。",
            "value 同时收到位置实参 3 和关键字实参 4，重复绑定会触发 TypeError。",
          ],
        },
        {
          type: "quiz",
          id: "defaults-check",
          question:
            "希望 append_item('A') 和 append_item('B') 获得互不影响的新列表，哪种设计合适？",
          options: [
            "用 items=[] 作为默认值，每次直接 append",
            "用 items=None，在函数体内按需创建新列表",
            "给 items 加 list[str] 注解就会自动复制",
          ],
          correct: 1,
          explanations: [
            "默认列表在 def 执行时创建一次，省略该实参的调用会共享对象。",
            "正确。None 表示未提供列表，每次进入函数体再创建新列表。显式传入列表是否复制，需要另外约定。",
            "类型注解不会自动复制对象，也不改变可变默认值的生命周期。",
          ],
        },
      ],
    },
    {
      id: "summary",
      title: "用一份清晰接口减少意外",
      navGroup: "quiz",
      navLabel: "练习",
      blocks: [
        {
          type: "summary",
          points: [
            "形参描述接口，实参在调用时绑定；return 把值交给调用者。",
            "默认值、关键字与 * 共同定义传参规则；重复或不合法绑定会报错。",
            "默认对象只创建一次；None 加函数体内创建可隔离调用。",
            "注解不会自动执行类型检查，复制与副作用应由接口明确约定。",
          ],
        },
      ],
    },
  ],
  resources: resourcesForProgram("python-functions"),
  references: [
    {
      title: "Python 3.14 官方教程：函数与参数",
      href: "https://docs.python.org/3.14/tutorial/controlflow.html#more-on-defining-functions",
      note: "核对默认参数、关键字实参、仅限关键字参数与函数注解的语义。示例与练习为本平台原创。",
    },
  ],
});
