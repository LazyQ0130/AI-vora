import { mkdir, writeFile } from "node:fs/promises";
import { programs } from "../src/content/resources/programs";
import { notebookDocuments, notebookDownload } from "../src/content/resources/python-notebook";
await mkdir("public/downloads", { recursive: true });
for (const program of Object.values(programs)) {
  await writeFile(
    `public/downloads/${program.filename}.py`,
    program.code,
    "utf8",
  );
  const notebook = {
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
          `# Aivora · ${program.title}（试读样章，待人工审核）\n`,
          `${program.environment}。代码与网页同源。\n`,
          "请在本地运行并核对断言；阅读记录不代表已经掌握。",
        ],
      },
      {
        id: "experiment",
        cell_type: "code",
        execution_count: null,
        outputs: [],
        metadata: {},
        source: program.code.split(/(?<=\n)/),
      },
    ],
  };
  await writeFile(
    `public/downloads/${program.filename}.ipynb`,
    JSON.stringify(notebook, null, 2),
    "utf8",
  );
}
console.log(
  `已同源生成 ${Object.keys(programs).length} 组 Python / Notebook 下载文件`,
);
for (const document of notebookDocuments) {
  await writeFile(`public/downloads/${document.filename}.ipynb`, JSON.stringify(notebookDownload(document), null, 2), "utf8");
}
console.log(`另生成 ${notebookDocuments.length} 份按单元格组织的Notebook；空输出，不写入机器版本或路径。`);
