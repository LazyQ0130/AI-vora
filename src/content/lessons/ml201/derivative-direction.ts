import {
  defineMlLesson,
  p,
  m,
  note,
  links,
  prep,
  refs,
  summary,
} from "./shared";
export const derivativeDirectionLesson = defineMlLesson("ML201-C04-L02", {
  subtitle:
    "先研究一个能手算的平方函数，解释导数的符号为什么能提示局部下降方向。",
  prerequisites:
    "理解 3.3 的损失含义，具备 MA101 的函数与基础导数先修。自查：能否展开 (a+h)²，以及解释 ΔF/Δa 是一段区间的平均变化率？若不能，先使用下方导数补修入口。",
  prerequisiteLinks: [
    prep.calculus,
    {
      title: "3.3 损失函数",
      href: "/learn/ML201/ML201-C03-L03",
      note: "复习为什么用一个标量描述预测误差。",
    },
  ],
  objectives: [
    "从差商推导一个平方函数的导数",
    "根据导数正负判断小步更新方向",
    "用数值例子解释步长过大和零导数的边界",
  ],
  references: [refs.calculus, refs.d2l],
  sections: [
    {
      id: "question",
      title: "知道损失以后，下一步往哪走？",
      navGroup: "question",
      navLabel: "问题",
      blocks: [
        p(
          "上一章可以比较两组参数的损失，但反复猜一组参数再比较，效率很低。我们想利用当前位置附近的信息，判断参数稍微增加或减少时，损失会怎样变化。先暂时离开有两个参数的回归模型，只看一个无量纲参数 θ。",
        ),
        m(
          "F(\\theta)=(\\theta-2)^2",
          "θ 是待调整的数，F 是本节演示损失，最小值位置为 2。这里不是在声称所有机器学习损失都是这个形状，而是选一个可完整验算的例子。",
        ),
        p(
          "当 θ=0，F=4；当 θ=0.1，F=3.61。朝右挪一点似乎让损失变小。导数把“当前位置附近每挪一点，函数怎样改变”变成一个数。",
        ),
      ],
    },
    {
      id: "derive",
      title: "从平均变化率走到局部变化率",
      navGroup: "derive",
      navLabel: "推导",
      blocks: [
        p(
          "取一个非零的小变化 h。先算新旧函数值之差，再除以参数变化 h，得到这段区间上的平均变化率。把平方展开，才能看清 h 缩小时留下什么。",
        ),
        m(
          "\\frac{F(\\theta+h)-F(\\theta)}{h}=\\frac{(\\theta+h-2)^2-(\\theta-2)^2}{h}",
          "h≠0，因此可以先做除法。差商并不是直接把 h 设为 0，否则会出现 0/0。",
        ),
        m(
          "(\\theta+h-2)^2=(\\theta-2)^2+2(\\theta-2)h+h^2",
          "使用 (a+h)²=a²+2ah+h²，其中 a=θ−2。",
        ),
        m(
          "\\frac{F(\\theta+h)-F(\\theta)}{h}=2(\\theta-2)+h\\xrightarrow[h\\to0]{}2(\\theta-2)=F'(\\theta)",
          "相同平方项先抵消，再约去非零的 h，最后取极限。F′ 表示 θ 这一点的导数，不是区间内任意位置的斜率。",
        ),
        note(
          "导数是一种局部信息",
          "F′(0)=−4 表示从 0 附近向右增加 θ 时，F 局部下降；F′(3)=2 则提示从 3 附近向左移动可能下降。它并没有保证任意距离的一大步仍然下降。",
        ),
      ],
    },
    {
      id: "step",
      title: "把方向变成一次具体更新",
      navGroup: "step",
      navLabel: "更新",
      blocks: [
        m(
          "\\theta_{\\mathrm{new}}=\\theta-\\eta F'(\\theta),\\qquad\\eta>0",
          "η（eta）是学习率，控制本次步长。减去正导数会向左走；减去负导数会向右走。本节 θ 与损失为无量纲数值。",
        ),
        {
          type: "table",
          caption: "固定 η=0.1 的两次独立演算",
          columns: ["旧 θ", "旧 F", "F′(θ)", "新 θ", "新 F"],
          rows: [
            ["0", "4", "−4", "0−0.1×(−4)=0.4", "2.56"],
            ["3", "1", "2", "3−0.1×2=2.8", "0.64"],
          ],
        },
        {
          type: "image",
          src: "/learning/ml-v2/gradient-direction.png",
          width: 1200,
          height: 640,
          mobile: {
            src: "/learning/ml-v2/gradient-direction-mobile.png",
            width: 640,
            height: 680,
          },
          alt: "平方函数 F(θ)=(θ−2)² 的最低点在 θ=2。图中标记 θ=0 时 F=4，以及一次小步后 θ=0.4 时 F=2.56，箭头指向右侧更低的位置。",
          caption:
            "这是一个单参数函数的精确坐标图。图中的一次更新只解释局部方向和步长，不代表完整回归训练。",
        },
        {
          type: "exercise",
          id: "scalar-step",
          kind: "计算",
          title: "从最低点另一侧开始",
          prompt:
            "取 θ=4、η=0.25，算导数、新 θ、新 F，并解释为什么移动方向应当向左。",
          hints: ["F′(4)=2×(4−2)。", "先算 4−0.25×4，再代入平方函数核对损失。"],
          solution: [
            "导数为 4，新 θ=3，新 F=1，旧 F=4。",
            "当前位置导数为正，减去正量会向左移动，本例接近最低点 2。",
          ],
          rubric: [
            "使用旧位置的导数",
            "同时核对更新后的函数值",
            "能解释符号与方向",
          ],
        },
      ],
    },
    {
      id: "boundaries",
      title: "什么情况下，这个直觉会误导？",
      navGroup: "boundaries",
      navLabel: "边界",
      blocks: [
        p(
          "仍从 θ=0 出发，但把 η 改为 1.2，新 θ=4.8，F=7.84，反而大于原来的 4。问题不在负梯度的局部方向，而在这一大步越过了有用的局部范围。学习率不能脱离函数形状和数值尺度选择。",
        ),
        {
          type: "quiz",
          id: "negative-sign",
          question: "当导数为负，更新 θ←θ−ηF′(θ) 会怎样改变 θ？",
          options: ["增大 θ", "减小 θ", "导数为负就必须让学习率也为负"],
          correct: 0,
          explanations: [
            "正确。η>0，减去一个负数等于增加 θ。",
            "这会把更新公式的符号弄反。",
            "本节定义学习率为正，方向已经由负梯度给出。",
          ],
        },
        {
          type: "quiz",
          id: "stationary",
          question: "一般情况下，导数等于 0 能直接说明已经找到最小值吗？",
          options: [
            "总能",
            "不能；例如 −θ² 在 0 处导数为 0，却是最大值",
            "导数永远不会为 0",
          ],
          correct: 1,
          explanations: [
            "只有结合函数性质才能判断；不能从一个零导数推出一般的全局最优。",
            "正确。本节平方函数是特殊的良性例子，不能把它的全部性质推广给任意函数。",
            "平方函数在 θ=2 的导数就是 0。",
          ],
        },
        {
          type: "exercise",
          id: "rate-experiment",
          kind: "实验",
          title: "只改变一个变量",
          prompt:
            "固定初始 θ=0，只比较 η=0.1 和 1.2 的一次更新。记录旧损失、导数、新参数、新损失，写出能由这些结果支持的一句话结论。另用 H(θ)=−θ² 在 0 处的导数与附近函数值，说明零导数为何不总是最小值。",
          hints: [
            "两个实验的初始位置与函数必须相同。",
            "η=1.2 时新位置为 4.8；先核对平方再比较。对 H，比较 H(0) 与 H(±0.1)。",
          ],
          solution: [
            "两次旧损失均为 4，导数均为 −4；η=0.1 得 θ=0.4、F=2.56，η=1.2 得 θ=4.8、F=7.84。",
            "可支持：本例这两个设定中，大步长导致一次更新后损失增加。不能支持：所有任务都必须使用 0.1。",
            "H′(0)=0，但 H(0)=0 大于 H(±0.1)=−0.01，所以 0 处是最大值；零导数本身不足以证明最小值。",
          ],
          rubric: [
            "实验只改变学习率",
            "报告数值与条件",
            "结论没有超出本例证据",
            "用附近函数值支持零导数反例",
          ],
        },
      ],
    },
    {
      id: "code",
      title: "用可运行的小程序复核",
      navGroup: "code",
      navLabel: "代码",
      blocks: [
        {
          type: "code",
          filename: "scalar_descent.py",
          language: "python",
          code: "def objective(theta):\n    return (theta - 2.0) ** 2\n\nfor rate in (0.1, 1.2):\n    theta = 0.0\n    derivative = 2.0 * (theta - 2.0)\n    updated = theta - rate * derivative\n    print(rate, round(updated, 6), round(objective(updated), 6))\nassert abs(objective(0.4) - 2.56) < 1e-12\nassert abs(objective(4.8) - 7.84) < 1e-12\n",
        },
        p(
          "在本地 Python 3.10+ 运行，无需第三方库。两行输出分别为 0.1 0.4 2.56 与 1.2 4.8 7.84。round 只用于显示，断言用容差检查浮点运算。",
        ),
        summary([
          "导数来自差商的极限，描述当前位置的局部变化率。",
          "沿负导数方向小步调整，才有机会降低损失；步长过大仍可能失败。",
          "零导数需要结合函数形状判断；本节不把简单平方函数当作所有损失的保证。",
        ]),
        links("继续学习", [
          {
            title: "4.2 梯度下降的数学原理",
            href: "/learn/ML201/ML201-C04-L03",
            note: "把单变量导数扩展到回归模型的两个参数。",
          },
        ]),
      ],
    },
  ],
});
