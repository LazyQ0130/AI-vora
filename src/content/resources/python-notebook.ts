// 网页、空输出下载与有状态校验共用源码。步骤预期由校验器独立断言。
export const notebookCode = {
  setDraft: 'marker = "Draft A"',
  showMarker: 'print(marker)',
  setReady: 'marker = "Ready B"',
  kernelProbe: 'import sys\nprint(sys.executable)',
  setDelivery: 'delivery_note = "Packed C7"',
  showDelivery: 'print(delivery_note)',
} as const;
export const notebookBlockNames: Record<keyof typeof notebookCode, string> = {
  setDraft: "first-notebook.ipynb · 代码格一",
  showMarker: "first-notebook.ipynb · 代码格二",
  setReady: "first-notebook.ipynb · 修改代码格一",
  kernelProbe: "现成内核观察格",
  setDelivery: "dispatch-note.ipynb · 代码格一",
  showDelivery: "dispatch-note.ipynb · 代码格二",
};
export const notebookCommands = {
  pip: { windows: '& ".\\.venv\\Scripts\\python.exe" -m pip --version', mac: './.venv/bin/python -m pip --version' },
  install: { windows: '& ".\\.venv\\Scripts\\python.exe" -m pip install notebook', mac: './.venv/bin/python -m pip install notebook' },
  start: { windows: '& ".\\.venv\\Scripts\\python.exe" -m jupyter notebook', mac: './.venv/bin/python -m jupyter notebook' },
} as const;
export const notebookDocuments = [
  { filename: "first-notebook", title: "第一次观察单元格状态", cells: [
    { id: "purpose", cell_type: "markdown", source: "# 小型状态观察\n先设置任务标签，再显示它。最终版本使用Ready B；旧状态与倒序实验按网页步骤另做。" },
    { id: "set-marker", cell_type: "code", source: notebookCode.setReady },
    { id: "show-marker", cell_type: "code", source: notebookCode.showMarker },
    { id: "kernel-probe", cell_type: "code", source: notebookCode.kernelProbe },
  ] },
  { filename: "dispatch-note", title: "物流任务的顺序观察", cells: [
    { id: "purpose", cell_type: "markdown", source: "# 出库标签\n按网页题目先记录预测，再在指定内核观察执行顺序，并保存恢复后的结果。" },
    { id: "set-note", cell_type: "code", source: notebookCode.setDelivery },
    { id: "show-note", cell_type: "code", source: notebookCode.showDelivery },
    { id: "kernel-probe", cell_type: "code", source: notebookCode.kernelProbe },
  ] },
] as const;
export function notebookDownload(document: (typeof notebookDocuments)[number]) {
  return { nbformat: 4, nbformat_minor: 5, metadata: { kernelspec: { display_name: "Python 3 (ipykernel)", language: "python", name: "python3" }, language_info: { name: "python" } }, cells: document.cells.map(cell => ({ ...cell, metadata: {}, ...(cell.cell_type === "code" ? { execution_count: null, outputs: [] } : {}) })) };
}
