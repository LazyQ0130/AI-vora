// PY101 1.2的短文件与可复制命令；正文和开发期真实路径实验复用。
// 输出标记是字面文本，不自动探测路径；学生必须同时用pwd/文件清单/命令取证。
export const pathFiles = {
  "path-lab/alpha/run.py": 'print("Alpha A1")\n',
  "path-lab/beta/run.py": 'print("Beta B2")\n',
  "path-lab/my scripts/run.py": 'print("Space S3")\n',
  "route-task/east/check.py": 'print("East E4")\n',
  "route-task/west/check.py": 'print("West W5")\n',
  "delivery-task/my notes/ready.py": 'print("Target T6")\n',
} as const;

export const pathCommands = {
  "root-missing": { cwd: "path-lab", windows: "python run.py", mac: "python3 run.py" },
  "root-alpha": { cwd: "path-lab", windows: "python .\\alpha\\run.py", mac: "python3 ./alpha/run.py" },
  "alpha-current": { cwd: "path-lab/alpha", windows: "python .\\run.py", mac: "python3 ./run.py" },
  "beta-current": { cwd: "path-lab/beta", windows: "python run.py", mac: "python3 run.py" },
  "beta-alpha": { cwd: "path-lab/beta", windows: "python ..\\alpha\\run.py", mac: "python3 ../alpha/run.py" },
  "absolute-root": { cwd: "path-lab", windows: 'python "C:\\Users\\你的用户名\\Documents\\path-lab\\alpha\\run.py"', mac: 'python3 "/Users/你的用户名/Documents/path-lab/alpha/run.py"' },
  "absolute-beta": { cwd: "path-lab/beta", windows: 'python "C:\\Users\\你的用户名\\Documents\\path-lab\\alpha\\run.py"', mac: 'python3 "/Users/你的用户名/Documents/path-lab/alpha/run.py"' },
  "space-unquoted": { cwd: "path-lab", windows: "python .\\my scripts\\run.py", mac: "python3 ./my scripts/run.py" },
  "space-quoted": { cwd: "path-lab", windows: 'python ".\\my scripts\\run.py"', mac: 'python3 "./my scripts/run.py"' },
  "task-west": { cwd: "route-task/west", windows: "python .\\check.py", mac: "python3 ./check.py" },
  "task-east": { cwd: "route-task/west", windows: "python ..\\east\\check.py", mac: "python3 ../east/check.py" },
  "task-missing": { cwd: "route-task/west", windows: "python ..\\check.py", mac: "python3 ../check.py" },
} as const;
