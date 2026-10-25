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
export const mseGradientLesson = defineMlLesson("ML201-C04-L03", {
  subtitle:
    "用固定数据、链式法则和两个偏导，把“降低误差”变成明确的同步更新规则。",
  durationMinutes: 35,
  prerequisites:
    "完成 3.2、3.3、4.1；会解释平方函数的导数与求和。先修检查：若暂时固定 b，wx+b 对 w 的导数应是 x；若固定 w，对 b 的导数应是 1。若不理解“固定另一个量”，先复习偏导。",
  prerequisiteLinks: [
    prep.calculus,
    {
      title: "4.1 导数与更新方向",
      href: "/learn/ML201/ML201-C04-L02",
      note: "真实可读前一节，复习负导数和学习率。",
    },
    {
      title: "3.3 MSE 的约定",
      href: "/learn/ML201/ML201-C03-L03",
      note: "本教材完整 MSE 不含 1/2。",
    },
  ],
  objectives: [
    "说明偏导中哪些量被固定",
    "逐步推导 MSE 关于 w、b 的梯度",
    "解释同一次预测计算两个梯度的原因",
  ],
  references: [refs.calculus, refs.d2l, refs.stanford],
  sections: [
    {
      id: "setup",
      title: "把要优化的量和固定的量分开",
      navGroup: "setup",
      navLabel: "设定",
      blocks: [
        p(
          "回到线性回归。输入 xᵢ 和目标 yᵢ 是固定的训练数据，我们要改变的是权重 w 与偏置 b。损失是一个接收两个参数、输出一个标量的函数。每次比较参数时，样本和损失定义必须保持一致。",
        ),
        m(
          "e_i(w,b)=wx_i+b-y_i,\\qquad L(w,b)=\\frac{1}{n}\\sum_{i=1}^{n}e_i(w,b)^2",
          "n 为样本数，eᵢ 为预测减目标。当前所有数据、参数与损失按无量纲数值处理；L 是本组教材统一使用的完整 MSE。",
        ),
        p(
          "偏导就是只观察其中一个变量变化时的局部影响：对 w 求偏导时暂时固定 b，对 b 求偏导时暂时固定 w；两种情况下 xᵢ、yᵢ 都固定。记号 ∂L/∂w 不表示两个参数同时变化。",
        ),
      ],
    },
    {
      id: "weight",
      title: "先推导一个样本对 w 的贡献",
      navGroup: "derive",
      navLabel: "推导",
      blocks: [
        p(
          "先不要直接背最终公式。平方误差有两层：里层是误差 eᵢ，外层是平方。改变 w 会先改变误差，误差再改变平方损失，因此要用链式法则把两段变化连接起来。",
        ),
        m(
          "\\frac{\\partial e_i}{\\partial w}=x_i,\\qquad\\frac{\\partial(e_i^2)}{\\partial e_i}=2e_i",
          "wxᵢ 对 w 的偏导是 xᵢ，固定的 b−yᵢ 的偏导为 0；平方对其输入 eᵢ 的导数是 2eᵢ。",
        ),
        m(
          "\\frac{\\partial(e_i^2)}{\\partial w}=\\frac{\\partial(e_i^2)}{\\partial e_i}\\frac{\\partial e_i}{\\partial w}=2e_ix_i",
          "根据链式法则相乘。xᵢ 不能省略：同样大小的预测误差，在不同输入处对斜率的影响可能不同。",
        ),
        m(
          "\\frac{\\partial L}{\\partial w}=\\frac{1}{n}\\sum_{i=1}^{n}2e_ix_i=\\frac{2}{n}\\sum_{i=1}^{n}(wx_i+b-y_i)x_i",
          "有限项求和可以逐项求导，固定常数 1/n 保留。本式对全部样本求平均，叫全批量梯度的一部分。",
        ),
      ],
    },
    {
      id: "bias",
      title: "再推导 b，并写出梯度向量",
      navGroup: "derive",
      navLabel: "推导",
      blocks: [
        m(
          "\\frac{\\partial e_i}{\\partial b}=1,\\qquad\\frac{\\partial L}{\\partial b}=\\frac{2}{n}\\sum_{i=1}^{n}e_i",
          "这次只让 b 变化，w、xᵢ、yᵢ 固定。里层导数是 1，所以结果没有额外乘 xᵢ。",
        ),
        m(
          "\\nabla L=\\begin{bmatrix}\\partial L/\\partial w\\\\\\partial L/\\partial b\\end{bmatrix}",
          "梯度是按约定顺序收集的两个偏导。代码中的 dw、db 就分别对应这两个标量，不是把数组 x、y 本身更新掉。",
        ),
        note(
          "不同资料的系数约定",
          "如果改用 (1/2n)Σeᵢ²，两个梯度中的 2 会抵消。两套定义都可以，但不能用本节损失值配上另一套梯度，却声称完全相同的步长和更新。",
        ),
      ],
    },
    {
      id: "update",
      title: "先计算梯度，再同时更新两个参数",
      navGroup: "update",
      navLabel: "更新",
      blocks: [
        m(
          "w_{t+1}=w_t-\\eta\\,d_w,\\qquad b_{t+1}=b_t-\\eta\\,d_b",
          "d_w、d_b 均在同一旧参数 (wₜ,bₜ) 处求得，η>0。下标 t 是迭代编号，和样本下标 i 不同。",
        ),
        p(
          "一次标准全批量更新应先固定当前 w、b，计算全部预测和误差，再计算两个梯度，最后生成两个新参数。若更新 w 后重新计算误差再求 db，就把 db 换到了另一个位置，已经不是本节定义的同步更新。其他顺序更新方法可以另行研究，但不能把它们混作同一算法。",
        ),
        {
          type: "quiz",
          id: "chain-input",
          question: "为什么 dw 的求和项需要乘以 xᵢ，而 db 不需要？",
          options: [
            "由里层误差对 w 和 b 的偏导分别为 xᵢ、1 决定",
            "只是为了让两个公式看起来不同",
            "因为 b 的误差永远是 0",
          ],
          correct: 0,
          explanations: [
            "正确，这是链式法则中的里层导数。",
            "省略或添加 xᵢ 会改变数学含义，不是排版选择。",
            "b 会改变预测，相关误差一般不为 0。",
          ],
        },
        {
          type: "quiz",
          id: "same-point",
          question: "一次同步更新应使用哪一份误差计算 dw、db？",
          options: [
            "同一组旧参数算出的误差",
            "dw 用旧误差，db 必须在新 w 下重算",
            "直接使用目标 y 当梯度",
          ],
          correct: 0,
          explanations: [
            "正确，两个偏导必须位于同一个参数点。",
            "这是另一种顺序更新，不符合本节同步全批量梯度下降。",
            "梯度取决于误差、输入和损失定义，不能把目标直接代替它。",
          ],
        },
      ],
    },
    {
      id: "practice",
      title: "用少量数字检查公式是否落地",
      navGroup: "practice",
      navLabel: "练习",
      blocks: [
        {
          type: "exercise",
          id: "gradient-sample",
          kind: "计算",
          title: "单个样本的两段链式计算",
          prompt:
            "取一个样本 x=2、y=5，当前 w=b=0。分别计算 e、e²、该样本对 dw 与 db 的贡献。此题只有一个样本，n=1。",
          hints: [
            "先计算预测 0×2+0，再减去目标 5。",
            "对 w 的贡献为 2ex；对 b 为 2e。",
          ],
          solution: [
            "预测为 0，e=−5，e²=25。",
            "n=1，因此 dw=2×(−5)×2=−20，db=2×(−5)=−10。",
            "增加一点 w 或 b 都有可能局部降低这个样本的误差，但实际下降还取决于步长。",
          ],
          rubric: [
            "没有把 n=1 误当成参数个数 2",
            "dw 与 db 区分了里层导数",
            "不把偏导直接当作新参数",
          ],
        },
        {
          type: "code",
          filename: "mse_gradients.py",
          language: "python",
          code: "def gradients(xs, ys, w, b):\n    assert len(xs) == len(ys) and len(xs) > 0\n    errors = [w * x + b - y for x, y in zip(xs, ys)]\n    n = len(xs)\n    dw = 2.0 * sum(e * x for e, x in zip(errors, xs)) / n\n    db = 2.0 * sum(errors) / n\n    return dw, db\n\ndw, db = gradients([1.0, 2.0], [3.0, 5.0], 0.0, 0.0)\nprint(dw, db)\nassert (dw, db) == (-13.0, -8.0)\n",
        },
        p(
          "这段 Python 3.10+ 程序不依赖 NumPy；errors 是等长列表，dw、db 是两个数，返回值应为 (−13,−8)。它先保留同一份 errors，再计算两个平均，正对应前面的推导。下一节会逐项手算这两个数字，而不是把断言结果当作解释本身。",
        ),
        {
          type: "exercise",
          id: "gradient-debug",
          kind: "代码",
          title: "检查忘记平均的实现",
          prompt:
            "某实现使用 dw=2*sum(e*x)，没有除以样本数。为什么换成更大的训练集后，同一个学习率可能表现不同？应该改哪里？",
          hints: [
            "把完全相同的样本复制一遍，求和会怎样变化？",
            "本节 L 定义为平均，而不是误差平方之和。",
          ],
          solution: [
            "重复样本会使梯度求和扩大，尽管平均 MSE 没有改变。",
            "应将两个梯度都除以 n；若使用 np.mean，就不要再次除以 n。可以用复制数据前后的梯度一致性作独立检查。",
          ],
          rubric: [
            "损失与梯度归一化一致",
            "同时检查 dw、db",
            "用可重复的反例解释错误",
          ],
        },
        summary([
          "偏导只让一个参数变化，训练数据与另一参数暂时固定。",
          "平方的外层导数乘误差的里层导数，得到 2eᵢxᵢ 与 2eᵢ。",
          "平均 MSE 保留 1/n，两个梯度先算完再同步更新。",
        ]),
        links("继续学习", [
          {
            title: "4.3 手动计算一次参数更新",
            href: "/learn/ML201/ML201-C04-L04",
            note: "逐样本计算，再核对更新后的损失。",
          },
        ]),
      ],
    },
  ],
});
