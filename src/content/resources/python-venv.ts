// 学生源码与真实环境验证同源；诊断只作现成观察工具，不教授模块语法。
export const environmentProbe = 'import sys\n\nprint("Interpreter:", sys.executable)\nprint("Environment:", sys.prefix)\nprint("Base Python:", sys.base_prefix)\nprint("Version:", sys.version.split()[0])\n';
export const venvFiles = {
  "project-a/main.py": 'print("Project A A4")\n',
  "project-b/main.py": 'print("Project B B6")\n',
  "workshop/report/check.py": 'print("Report R8")\n',
  "workshop/tools/label/tag.py": 'print("Label L9")\n',
} as const;
export const venvCommands = {
  create: { windows: 'python --version\npython -m venv .venv', mac: 'python3 --version\npython3 -m venv .venv' },
  inspect: { windows: 'pwd\ndir .venv\ndir .venv\\Scripts\\python.exe', mac: 'pwd\nls -a\nls .venv/bin/python' },
  run: { windows: '& ".\\.venv\\Scripts\\python.exe" .\\main.py', mac: './.venv/bin/python main.py' },
  probe: { windows: '& ".\\.venv\\Scripts\\python.exe" .\\observe_env.py', mac: './.venv/bin/python observe_env.py' },
  activate: { windows: '.\\.venv\\Scripts\\Activate.ps1\npython .\\observe_env.py', mac: 'source .venv/bin/activate\npython observe_env.py' },
  wrong: { windows: '& "..\\project-b\\.venv\\Scripts\\python.exe" .\\main.py\n& "..\\project-b\\.venv\\Scripts\\python.exe" .\\observe_env.py', mac: '../project-b/.venv/bin/python main.py\n../project-b/.venv/bin/python observe_env.py' },
} as const;
