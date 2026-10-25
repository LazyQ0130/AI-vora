import { mkdir, writeFile } from "node:fs/promises";
import { sampleCode } from "../src/content/sample";
await mkdir("public/downloads", { recursive: true });
await writeFile("public/downloads/linear_regression.py", sampleCode, "utf8");
await writeFile(
  "public/downloads/linear_regression.ipynb",
  JSON.stringify(
    {
      nbformat: 4,
      nbformat_minor: 5,
      metadata: {
        kernelspec: {
          display_name: "Python 3",
          language: "python",
          name: "python3",
        },
        language_info: { name: "python", version: "3.10" },
      },
      cells: [
        {
          id: "introduction",
          cell_type: "markdown",
          metadata: {},
          source: [
            "# Aivora · 线性回归与梯度下降（演示样章）\n",
            "原创合成教学数据。Python 3.10+，NumPy；CPU 即可。\n",
            "先在本地安装 NumPy，再逐单元运行。结果接近 w=2、b=1；不构成真实数据的泛化评估。",
          ],
        },
        {
          id: "experiment",
          cell_type: "code",
          execution_count: null,
          outputs: [],
          metadata: {},
          source: sampleCode.split(/(?<=\n)/),
        },
      ],
    },
    null,
    2,
  ),
  "utf8",
);
console.log("已从样章同源生成 Python 与 Notebook 下载文件");
