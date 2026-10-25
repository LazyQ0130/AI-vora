export const artwork = {
  hero: "/artwork/hero-horizon-v2.webp",
} as const;

export interface CourseCover {
  src: string;
  alt: string;
  compactPosition?: string;
}

/** Each course has a dedicated generated raster cover; no shared fallback. */
export const courseCovers = {
  ML201: {
    src: "/artwork/courses-v5/ml201-supervised-learning.webp",
    alt: "监督学习概念插画：分类分隔平面、样本与回归拟合。",
    compactPosition: "35% 40%",
  },
  ML202: {
    src: "/artwork/courses-v5/ml202-classical-algorithms.webp",
    alt: "经典算法概念插画：决策树分支、聚类样本与分类超平面。",
  },
  ML203: {
    src: "/artwork/courses-v5/ml203-model-evaluation.webp",
    alt: "模型评估概念插画：交叉验证分组、混淆矩阵与实验误差比较。",
  },
  AI000: {
    src: "/artwork/courses-v5/ai000-ai-technology-map.webp",
    alt: "AI 技术地图概念插画：知识图谱连接视觉、语言与决策方向。",
  },
  PY101: {
    src: "/artwork/courses-v5/py101-python-programming.webp",
    alt: "Python 编程概念插画：蓝黄 Python 标志、笔记本与模块化文件工作台。",
  },
  MA101: {
    src: "/artwork/courses-v5/ma101-linear-algebra-calculus.webp",
    alt: "线性代数与微积分概念插画：向量、线性变换网格、曲面与切平面。",
  },
  ST101: {
    src: "/artwork/courses-v5/st101-probability-statistics.webp",
    alt: "概率统计概念插画：钟形分布、直方图、抽样与区间估计。",
  },
  DS101: {
    src: "/artwork/courses-v5/ds101-scientific-data-analysis.webp",
    alt: "科学计算与数据分析概念插画：数据清洗、结构化表格、数组与可视化。",
  },
  DL301: {
    src: "/artwork/courses-v5/dl301-neural-backpropagation.webp",
    alt: "神经网络概念插画：分层神经元、前向信号与反向梯度传播。",
  },
  DL302: {
    src: "/artwork/courses-v5/dl302-pytorch-training.webp",
    alt: "PyTorch 实践概念插画：张量批次、训练循环与模型检查点。",
  },
  DL303: {
    src: "/artwork/courses-v5/dl303-deep-learning-architectures.webp",
    alt: "深度学习架构概念插画：卷积特征图、循环序列与 Transformer 模块。",
  },
  NLP401: {
    src: "/artwork/courses-v5/nlp401-natural-language-processing.webp",
    alt: "自然语言处理概念插画：文本切分为词元，经表示转换后按语义分组。",
  },
  LLM401: {
    src: "/artwork/courses-v5/llm401-language-model-foundations.webp",
    alt: "语言模型原理概念插画：词元序列、因果注意力与解码器生成下一词元。",
  },
  LLM402: {
    src: "/artwork/courses-v5/llm402-llm-finetuning-inference.webp",
    alt: "微调与推理工程概念插画：低秩适配模块、量化与推理部署。",
  },
  CV401: {
    src: "/artwork/courses-v5/cv401-computer-vision.webp",
    alt: "计算机视觉概念插画：相机分析自行车图像，展示检测框、分割与特征图。",
  },
  MM401: {
    src: "/artwork/courses-v5/mm401-multimodal-alignment.webp",
    alt: "多模态学习概念插画：鸟类图像与语言词元在共享表示中对齐。",
  },
  RL401: {
    src: "/artwork/courses-v5/rl401-reinforcement-learning.webp",
    alt: "强化学习概念插画：网格环境中的智能体、行动路径、奖励与反馈。",
  },
  GM401: {
    src: "/artwork/courses-v5/gm401-generative-models.webp",
    alt: "生成式模型概念插画：随机噪声逐步去噪形成蝴蝶图像。",
  },
  SYS501: {
    src: "/artwork/courses-v5/sys501-mlops-deployment.webp",
    alt: "MLOps 概念插画：数据版本、训练、模型制品、部署与监测回路。",
  },
  RES501: {
    src: "/artwork/courses-v5/res501-research-reproduction.webp",
    alt: "论文复现概念插画：研究文稿、独立实验与重复结果对照。",
  },
} as const satisfies Record<string, CourseCover>;

export function getCourseCover(id: string): CourseCover {
  const cover = courseCovers[id as keyof typeof courseCovers];
  if (!cover) throw new Error(`Missing course cover: ${id}`);
  return cover;
}
