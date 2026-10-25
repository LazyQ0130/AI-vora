export const learningPaths = [
  {
    id: "beginner",
    name: "从零开始",
    label: "零基础学习者",
    description: "先建立 AI 技术地图，再逐步补齐编程、数学与数据能力。",
    note: "MA101 可与 PY101 并行；ST101 在进入经典算法前补足。",
    stages: [
      ["AI000"],
      ["PY101", "MA101"],
      ["DS101"],
      ["ML201", "ST101"],
      ["ML202", "ML203"],
      ["DL301"],
      ["DL302"],
      ["DL303"],
    ],
  },
  {
    id: "python",
    name: "已有编程基础",
    label: "会 Python，尚未学过 ML",
    description: "检查数学与数据处理缺项，从第一个机器学习问题进入。",
    note: "PY101 可按已有能力跳过。MA101/ST101 按缺项补学，不是身份门槛。",
    stages: [
      ["MA101", "ST101"],
      ["DS101"],
      ["ML201"],
      ["ML203", "ML202"],
      ["DL301"],
      ["DL302"],
      ["DL303"],
    ],
  },
  {
    id: "experienced",
    name: "已有 ML / DL 基础",
    label: "经典 ML 或深度学习学习者",
    description: "巩固可靠的实验方法，进入核心架构与感兴趣的专业方向。",
    note: "已有 DL 经验可从下方专业方向开始，仍需检查课程详情中的具体先修。",
    stages: [["ML203"], ["DL301", "DL302"], ["DL303"]],
  },
] as const;
export const branches = [
  {
    name: "语言与大模型",
    ids: ["NLP401", "LLM401", "LLM402"],
    note: "LLM401 可补修 NLP401 核心章节；LLM402 还需 ML203 与 DL302。",
  },
  {
    name: "视觉与多模态",
    ids: ["CV401", "MM401"],
    note: "MM401 同时需要 CV401 与 LLM401 的核心内容。",
  },
  {
    name: "强化与生成",
    ids: ["RL401", "GM401"],
    note: "两门可独立选修；RL401 需 ST101、ML201、DL302，GM401 需 DL302、DL303、ST101。",
  },
] as const;
