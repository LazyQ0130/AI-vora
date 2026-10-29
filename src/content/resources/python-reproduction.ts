import { environmentProbe } from "./python-venv";
import { notebookCode } from "./python-notebook";

// 教材、下载和验证共享输入；输出预期由运行器另行判断。
export const reproductionCode = {
  notice: 'print("Notice N8")',
  target: 'print("Target R9")',
  environmentProbe,
  assign: 'batch_label = "Checked F3"',
  show: 'print(batch_label)',
  kernelProbe: notebookCode.kernelProbe,
} as const;
export const reproductionBlockNames: Record<keyof typeof reproductionCode, string> = {
  notice: "scripts/notice.py", target: "target/run.py", environmentProbe: "target/observe_env.py",
  assign: "review-note.ipynb · 提供名字格", show: "review-note.ipynb · 显示格", kernelProbe: "现成内核观察格",
};
export const reproductionCommands = {
  badPath: { windows: '& ".\\.venv\\Scripts\\python.exe" .\\notice.py', mac: './.venv/bin/python notice.py' },
  goodPath: { windows: '& ".\\.venv\\Scripts\\python.exe" .\\scripts\\notice.py', mac: './.venv/bin/python scripts/notice.py' },
  exit: { windows: 'echo $LASTEXITCODE', mac: 'echo $?' },
  wrongRun: { windows: '& "..\\other\\.venv\\Scripts\\python.exe" .\\run.py', mac: '../other/.venv/bin/python run.py' },
  wrongProbe: { windows: '& "..\\other\\.venv\\Scripts\\python.exe" .\\observe_env.py', mac: '../other/.venv/bin/python observe_env.py' },
  rightRun: { windows: '& ".\\.venv\\Scripts\\python.exe" .\\run.py', mac: './.venv/bin/python run.py' },
  rightProbe: { windows: '& ".\\.venv\\Scripts\\python.exe" .\\observe_env.py', mac: './.venv/bin/python observe_env.py' },
} as const;
export const reproductionNotebook = {
  filename: "review-note", title: "待补全的Notebook复现记录",
  cells: [
    { id: "purpose", cell_type: "markdown", source: "# 检查标签\n这份文档记录一个标签。按教材练习补全运行条件、错误和恢复证据。" },
    { id: "set-label", cell_type: "code", source: reproductionCode.assign },
    { id: "show-label", cell_type: "code", source: reproductionCode.show },
    { id: "kernel-probe", cell_type: "code", source: reproductionCode.kernelProbe },
  ],
} as const;
