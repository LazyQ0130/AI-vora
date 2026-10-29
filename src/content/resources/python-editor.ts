// 课文文件与执行校验共用源码，预期输出在校验器中独立声明。
export const editorFiles = {
  "main.initial.py": 'print("Draft A1")\n',
  "main.py": 'print("Ready B2")\nprint("Saved copy")\n',
  "notes.py": 'print("Notes N4")\n',
  "other/main.py": 'print("Other folder C3")\n',
  "message.py": 'print("Plan: read")\nprint("Step: start")\n',
  "message.example.py": 'print("Plan: practice P8")\nprint("Step: save")\nprint("Check: rerun")\n',
} as const;
export const interpreterDiagnostic = 'python -c "import sys; print(sys.executable); print(sys.version.split()[0])"';
