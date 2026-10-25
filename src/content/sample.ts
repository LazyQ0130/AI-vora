export const sampleCode = `import numpy as np

# 合成教学数据；不是现实数据上的泛化评估
x = np.linspace(0.0, 1.0, 60)
y = 2.0 * x + 1.0
w, b = 0.0, 0.0
learning_rate = 0.1
losses = []

for step in range(2000):
    prediction = w * x + b
    error = prediction - y
    losses.append(float(np.mean(error ** 2)))
    # 两个梯度必须基于同一次预测计算
    dw = 2.0 * np.mean(error * x)
    db = 2.0 * np.mean(error)
    w -= learning_rate * dw
    b -= learning_rate * db

final_loss = float(np.mean((w * x + b - y) ** 2))
print(f"w={w:.6f}, b={b:.6f}, MSE={final_loss:.8f}")

# 和最小二乘解析求解交叉核对
design = np.column_stack((x, np.ones_like(x)))
reference, *_ = np.linalg.lstsq(design, y, rcond=None)
assert np.allclose([w, b], reference, atol=1e-5)
assert final_loss < losses[0]
assert np.isfinite(losses).all()
`;
export type LessonBlock =
  | { type: "paragraph"; text: string }
  | { type: "callout"; title: string; text: string }
  | { type: "math"; latex: string; explanation: string }
  | { type: "diagram" }
  | { type: "code"; code: string }
  | { type: "experiment" }
  | {
      type: "quiz";
      id: string;
      question: string;
      options: string[];
      correct: number;
      explanations: string[];
    }
  | { type: "summary"; points: string[] };
export type LessonSection = {
  id: string;
  title: string;
  blocks: LessonBlock[];
};
export const sampleLesson = {
  id: "ML201-C04-L01",
  courseId: "ML201",
  title: "线性回归与梯度下降",
  chapter: 4,
  subtitle: "从一条直线出发，理解模型如何通过误差，一步一步学到参数。",
  objectives: [
    "解释权重与偏置的作用",
    "写出均方误差及其参数梯度",
    "用 NumPy 实现全批量梯度下降",
    "分析学习率与收敛的关系",
  ],
  sections: [
    {
      id: "intuition",
      title: "先从一条直线开始",
      blocks: [
        {
          type: "paragraph",
          text: "假设我们观察到一些输入与输出：输入增加，输出大致也在增加。线性回归尝试用一条直线描述这种关系。这里使用人为构造的无噪声数据 y = 2x + 1，让我们把注意力放在优化过程本身。",
        },
        {
          type: "math",
          latex: "\\hat{y}_i = w x_i + b",
          explanation:
            "xᵢ 为输入特征，ŷᵢ 为预测，w 为权重（斜率），b 为偏置（截距）。本例的 x、y 均为无量纲合成数值。",
        },
        { type: "diagram" },
        {
          type: "callout",
          title: "学习的对象是参数",
          text: "数据 x、y 在这个实验中固定。训练要调整的是 w 和 b，而不是修改目标值。真实问题中，还要检查线性假设、数据质量和适用范围。",
        },
      ],
    },
    {
      id: "loss",
      title: "用损失衡量预测误差",
      blocks: [
        {
          type: "paragraph",
          text: "一条直线拟合得好不好，需要可比较的标准。对 n 个样本，将每个预测误差平方后取平均，就得到均方误差 MSE。平方让正负误差不会互相抵消，也会让较大的误差获得更高权重。",
        },
        {
          type: "math",
          latex: "L(w,b)=\\frac{1}{n}\\sum_{i=1}^{n}(w x_i + b-y_i)^2",
          explanation:
            "n 是样本数，L 是标量。这里没有使用 1/2 系数，因此下面的两个梯度都包含系数 2。若 y 带有单位，MSE 的单位为 y 的单位平方。",
        },
        {
          type: "callout",
          title: "训练误差小，不等于泛化能力强",
          text: "这个教学实验没有噪声，也没有独立测试集。它仅用于检验梯度下降是否正确，不能据此推断模型在未知现实数据中的表现。",
        },
      ],
    },
    {
      id: "gradient",
      title: "沿着梯度的反方向更新",
      blocks: [
        {
          type: "paragraph",
          text: "梯度描述损失在参数变化时的局部变化率。对 w、b 分别求偏导，得到以下表达式。每次先用同一组旧参数计算预测和两个梯度，再同时更新参数。",
        },
        {
          type: "math",
          latex:
            "\\frac{\\partial L}{\\partial w}=\\frac{2}{n}\\sum_{i=1}^{n}(w x_i+b-y_i)x_i,\\quad \\frac{\\partial L}{\\partial b}=\\frac{2}{n}\\sum_{i=1}^{n}(w x_i+b-y_i)",
          explanation:
            "本例是一维输入，w、b 及两个偏导都是标量。多特征情况要改用向量与矩阵，并检查维度。",
        },
        {
          type: "math",
          latex:
            "w \\leftarrow w-\\eta\\frac{\\partial L}{\\partial w},\\qquad b \\leftarrow b-\\eta\\frac{\\partial L}{\\partial b}",
          explanation:
            "η > 0 为学习率。步长太小可能收敛很慢，太大可能振荡或发散。适合的步长依赖数据尺度和损失曲率；不是所有正学习率都能保证下降。",
        },
        {
          type: "paragraph",
          text: "对这个满秩二次损失，固定步长满足 0 < η < 2/λmax(H) 时可收敛，H 为关于参数的 Hessian。特征缩放会改变 H，所以不能把本例的学习率直接当作其他数据集的通用参数。",
        },
      ],
    },
    {
      id: "experiment",
      title: "动手观察：学习率改变了什么？",
      blocks: [
        {
          type: "paragraph",
          text: "调整学习率和迭代次数，观察相同 60 个合成数据点上的全批量梯度下降。图示由浏览器内的确定性数学函数计算，参数初值均为 0。拟合图展示其中 20 个点以保持清晰。",
        },
        { type: "experiment" },
      ],
    },
    {
      id: "code",
      title: "用 NumPy 把每一步写出来",
      blocks: [
        {
          type: "paragraph",
          text: "在 Python 3.10+ 与 NumPy 环境运行以下完整脚本。先执行 pip install numpy，再将下载的脚本保存并执行 python linear_regression.py。Notebook 使用同一份代码。无需 GPU、网络数据或模型 API。",
        },
        { type: "code", code: sampleCode },
        {
          type: "paragraph",
          text: "结果应接近 w = 2、b = 1，最终 MSE 接近 0。脚本会和 np.linalg.lstsq 的最小二乘结果进行容差比较。更改数据、学习率或迭代次数后，这些趋势和断言也需要重新核对。",
        },
        {
          type: "callout",
          title: "进一步练习",
          text: "把 learning_rate 改成 0.01 和 1.0，比较损失变化。注意过大的学习率可能使断言失败；失败就是需要解释的实验现象。再给 y 添加固定随机种子的噪声，讨论为何训练误差不再降到 0。",
        },
      ],
    },
    {
      id: "quiz",
      title: "停一下，检查你的理解",
      blocks: [
        {
          type: "quiz",
          id: "q1",
          question: "本节 MSE 定义没有 1/2 系数。关于参数更新，哪一项正确？",
          options: [
            "先更新 w，再用新 w 计算 b 的梯度",
            "用同一次预测计算 dw 和 db，再分别减去学习率乘以梯度",
            "把预测误差取绝对值后直接加到 w",
            "学习率越大，训练效果一定越好",
          ],
          correct: 1,
          explanations: [
            "两个梯度应基于同一组旧参数，否则与本节全批量梯度下降不一致。",
            "正确。MSE 的求导带有系数 2，两个梯度都基于当前同一次预测。",
            "绝对误差不是本节平方误差的梯度，直接加到 w 没有考虑输入 x。",
            "过大的步长会越过局部低点，甚至导致发散。",
          ],
        },
        {
          type: "quiz",
          id: "q2",
          question: "合成训练数据的 MSE 接近 0，能说明什么？",
          options: [
            "模型对所有真实数据都能准确预测",
            "不需要再划分验证集或测试集",
            "本例拟合了训练关系，仍需独立数据评估泛化",
          ],
          correct: 2,
          explanations: [
            "合成无噪声训练数据上的拟合，不能推广为对所有真实数据的保证。",
            "真实建模仍需按任务设计独立、无泄漏的评估流程。",
            "正确。训练损失仅描述当前训练数据；泛化评估需要额外证据。",
          ],
        },
      ],
    },
    {
      id: "summary",
      title: "带走这四个关键点",
      blocks: [
        {
          type: "summary",
          points: [
            "模型 ŷ = wx + b 由斜率和截距决定；训练调整参数。",
            "MSE 是平均平方误差，求导是否含 2 取决于损失定义。",
            "两个梯度由同一次预测计算；学习率需要考虑数据尺度。",
            "正确优化训练损失，只是可靠机器学习流程的一个环节。",
          ],
        },
      ],
    },
  ] satisfies LessonSection[],
};
