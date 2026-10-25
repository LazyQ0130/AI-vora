import { defineMlLesson, p, m, note, links, refs, summary } from "./shared";
import {
  lossComparisonCode,
  resourcesForProgram,
} from "../../resources/programs";
export const lossFunctionsLesson = defineMlLesson("ML201-C03-L03", {
  subtitle:
    "从逐个预测误差走到可比较的损失，分清绝对值、平方、平均，以及训练结果的边界。",
  durationMinutes: 30,
  prerequisites:
    "完成 3.2；能对三项数字求和、取绝对值和平方。先检查：如果误差是 -3，它的平方是 9，而不是 -9。",
  prerequisiteLinks: [
    {
      title: "3.2 模型与参数",
      href: "/learn/ML201/ML201-C03-L02",
      note: "复习如何从同一条直线计算每个预测。",
    },
  ],
  objectives: [
    "逐样本计算误差、MAE 与 MSE",
    "解释平方损失对大误差的敏感性",
    "区分损失定义、优化正确性和现实泛化",
  ],
  references: [refs.loss, refs.d2l],
  resources: resourcesForProgram("ml-losses"),
  sections: [
    {
      id: "errors",
      title: "先明确误差的方向",
      navGroup: "errors",
      navLabel: "误差",
      blocks: [
        p(
          "继续使用 x=[0,1,2]、y=[1,3,5]。取一条很粗糙的候选直线 w=0、b=2，它对三个输入都预测 2。我们约定误差 eᵢ=ŷᵢ−yᵢ：正值表示预测偏高，负值表示预测偏低。某些资料用相反的误差符号，阅读时必须与后续推导一起检查。",
        ),
        m(
          "e_i=\\hat y_i-y_i",
          "eᵢ 是第 i 个预测误差；下标 i 遍历样本，不是参数编号。当前误差依次为 1、−1、−3。",
        ),
        p(
          "前两个误差的平均为 0，但两个预测都没有等于各自的目标。直接求带符号误差的平均会发生抵消，因此不能仅凭“平均误差为 0”判断拟合准确。",
        ),
      ],
    },
    {
      id: "calculate",
      title: "绝对值与平方分别怎样聚合？",
      navGroup: "calculate",
      navLabel: "演算",
      blocks: [
        {
          type: "table",
          caption: "w=0、b=2 时的完整损失计算",
          columns: ["x", "y", "ŷ", "e=ŷ−y", "|e|", "e²"],
          rows: [
            ["0", "1", "2", "1", "1", "1"],
            ["1", "3", "2", "−1", "1", "1"],
            ["2", "5", "2", "−3", "3", "9"],
            ["合计", "—", "—", "−3", "5", "11"],
          ],
        },
        m(
          "\\operatorname{MAE}=\\frac{1}{n}\\sum_{i=1}^{n}|e_i|=\\frac{5}{3},\\qquad\\operatorname{MSE}=\\frac{1}{n}\\sum_{i=1}^{n}e_i^2=\\frac{11}{3}",
          "n=3 是样本数。先对每个误差分别取绝对值或平方，再求和，最后除以 n；不是先平均再平方。MAE 约 1.666667，MSE 约 3.666667。",
        ),
        note(
          "术语和单位",
          "MAE 是平均绝对误差，MSE 是均方误差。这里刻度无量纲。若目标有单位，例如米，MAE 也以米计，而 MSE 的单位为平方米；不能把两个原始数值不加说明地当作同一种量比较。",
        ),
        {
          type: "exercise",
          id: "loss-manual",
          kind: "计算",
          title: "换一条直线，完整重算",
          prompt:
            "改用 w=1、b=1，仍使用同一组三个样本。写出预测、误差、MAE 与 MSE，不要只报告最终结果。",
          hints: [
            "三个预测分别为 x+1。",
            "误差为 0、−1、−2；绝对值合计 3，平方合计 5。",
          ],
          solution: [
            "预测 [1,2,3]，误差 [0,−1,−2]。",
            "MAE=3/3=1，MSE=5/3≈1.666667。",
            "按本例 MAE 和 MSE 都比 w=0、b=2 小，但仍没有完美拟合目标。",
          ],
          rubric: [
            "每个样本都计算了误差",
            "分母是 3，不是参数个数 2",
            "先平方再平均，没有遗漏负号平方变正",
          ],
        },
      ],
    },
    {
      id: "choice",
      title: "为什么大误差会被更强地强调？",
      navGroup: "choice",
      navLabel: "选择",
      blocks: [
        p(
          "误差绝对值从 3 变为 6，绝对误差扩大 2 倍，平方误差却从 9 变为 36，扩大 4 倍。因此 MSE 会更强地强调较大的误差，也更容易受异常值影响。这可能符合某些任务的代价，也可能不符合，需要根据问题选择。",
        ),
        p(
          "MSE 对本节线性模型的参数可微，便于下一章推导梯度。MAE 并不是错误的损失，但绝对值在误差为 0 处不可微，需要另行处理优化；不能把 MSE 的梯度直接用于 MAE。我们本组教材后续固定使用完整 MSE，不加入 1/2 系数。",
        ),
        {
          type: "quiz",
          id: "mean-square",
          question: "本表误差为 1、−1、−3。MSE 的正确计算是什么？",
          options: ["(1+1+9)/3", "((1−1−3)/3)²", "(1+1+9)/2，因为有两个参数"],
          correct: 0,
          explanations: [
            "正确，逐项平方后除以样本数 3。",
            "这是平均带符号误差的平方，计算顺序不同，不是 MSE。",
            "分母是样本数，不是 w、b 的个数。",
          ],
        },
        {
          type: "quiz",
          id: "training-boundary",
          question: "本例训练 MSE 降为 0，最稳妥的解释是哪一项？",
          options: [
            "模型在所有设备上都能准确预测",
            "当前合成训练样本被拟合，现实泛化仍需独立检验",
            "不再需要检查数据泄漏",
          ],
          correct: 1,
          explanations: [
            "没有真实设备或独立测试数据支持这种结论。",
            "正确。训练误差只描述已参与训练的数据。",
            "泄漏会让评估过于乐观；训练损失小不消除泄漏风险。",
          ],
        },
      ],
    },
    {
      id: "code",
      title: "让代码顺序和手算顺序一致",
      navGroup: "code",
      navLabel: "代码",
      blocks: [
        {
          type: "code",
          filename: "ml_losses.py",
          language: "python",
          code: lossComparisonCode,
        },
        p(
          "这份完整脚本只需要 Python 3.10+ 标准库。predictions 与 targets 是等长列表；zip 按对应位置配对，列表推导式得到三个误差，sum 求和，len 给出 n。输出与本表一致。下载脚本、Notebook 和这里的代码同源。",
        ),
        {
          type: "exercise",
          id: "loss-transfer",
          kind: "迁移",
          title: "选择损失时需要哪些证据？",
          prompt:
            "如果任务中特别不能容忍少量很大的预测误差，你会怎样说明考虑 MSE 的理由？还需要记录哪些信息，才能避免凭一次训练损失就宣布方案可靠？",
          hints: [
            "先从误差翻倍时，平方代价如何变化来解释。",
            "再考虑异常数据是否真实、任务代价和独立评估。",
          ],
          solution: [
            "MSE 对大误差的惩罚增长更快，可以作为候选准则，但不自动等于业务真实代价。",
            "应检查异常值质量、不同损失下的误差分布，并在未参与训练的数据上评价；还要记录划分与泄漏检查。",
          ],
          rubric: [
            "区分优化准则与实际业务代价",
            "包含独立评估与数据质量，而非只比较一个训练数值",
          ],
        },
      ],
    },
    {
      id: "summary",
      title: "明确损失，才能讨论优化",
      navGroup: "choice",
      navLabel: "选择",
      blocks: [
        summary([
          "误差有方向；绝对值或平方避免正负抵消。",
          "MAE/MSE 都先逐项处理再平均，分母是样本数。",
          "后续使用完整 MSE，因此求导会出现系数 2；小训练损失不是泛化证明。",
        ]),
        links("衔接与尚未制作的内容", [
          {
            title: "第 3 章课程目录",
            href: "/courses/ML201#ML201-C03",
            note: "3.4 最小二乘法仍在筹备；不把规划链接伪装为正文。",
          },
          {
            title: "4.1 从导数理解优化方向",
            href: "/learn/ML201/ML201-C04-L02",
            note: "若已具备导数基础，可继续优化主线；此节不依赖尚未开放的 3.4。",
          },
        ]),
      ],
    },
  ],
});
