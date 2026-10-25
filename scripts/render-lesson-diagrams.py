"""生成精确的教学位图。仅开发时运行；网页不需要 Python 或 matplotlib。"""
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public/learning"
OUT.mkdir(parents=True, exist_ok=True)
plt.rcParams.update({"font.family": ["Microsoft YaHei", "DejaVu Sans"], "text.color": "#e2e8f0", "axes.labelcolor": "#b2c0d8", "xtick.color": "#b2c0d8", "ytick.color": "#b2c0d8", "font.size": 17, "axes.unicode_minus": False})
BG, PANEL, CYAN, VIOLET = "#0e172e", "#16223c", "#67e8f9", "#b6a2ff"

fig, ax = plt.subplots(figsize=(12, 6), dpi=100, facecolor=BG)
ax.set(xlim=(0, 12), ylim=(0, 6)); ax.axis("off")
ax.text(.6, 5.25, "一次函数调用，三个清晰步骤", fontsize=25, weight="bold")
ax.text(.6, 4.65, "transform(3, shift=1)", fontsize=20, color=CYAN, family="DejaVu Sans Mono")
steps = [(0.6, "01  参数绑定", "value = 3\nscale = 2（默认）\nshift = 1"), (4.6, "02  执行函数体", "value × scale + shift\n\n3 × 2 + 1"), (8.65, "03  返回结果", "return 7\n\n交给调用者")]
for x, title, body in steps:
    ax.add_patch(FancyBboxPatch((x, 1.2), 2.75, 2.8, boxstyle="round,pad=0.22,rounding_size=0.16", facecolor=PANEL, edgecolor="#4a5a83", linewidth=1.2))
    ax.text(x+.08, 3.45, title, fontsize=18, color=VIOLET)
    ax.text(x+.08, 2.95, body, fontsize=17, va="top", linespacing=1.8)
for x in (3.65, 7.7):
    ax.annotate("", xy=(x+.5, 2.6), xytext=(x-.15, 2.6), arrowprops={"arrowstyle": "->", "color": CYAN, "lw": 2})
ax.text(.6, .35, "省略 scale 时使用默认值；显式传入 shift 会替代它的默认值。", fontsize=16, color="#b2c0d8")
fig.subplots_adjust(0, 0, 1, 1)
fig.savefig(OUT / "python-function-call.png", facecolor=BG)
plt.close(fig)

fig, ax = plt.subplots(figsize=(12, 7), dpi=100, facecolor=BG)
ax.set_facecolor(BG)
ax.set(xlim=(-.5, 5), ylim=(-.4, 4), xlabel="x", ylabel="y")
ax.set_aspect("equal", adjustable="box")
ax.set_xticks(range(6)); ax.set_yticks(range(5))
ax.grid(color="#293752", linewidth=.8, zorder=0)
for spine in ax.spines.values(): spine.set_color("#5a6b8f")
ax.axhline(0, color="#5a6b8f", lw=1); ax.axvline(0, color="#5a6b8f", lw=1)
def arrow(start, end, color, style="-", alpha=1):
    ax.annotate("", xy=end, xytext=start, arrowprops={"arrowstyle": "-|>", "lw": 3, "color": color, "linestyle": style, "alpha": alpha}, zorder=4)
arrow((0, 0), (1, 2), CYAN)
arrow((0, 0), (3, 1), VIOLET)
arrow((1, 2), (4, 3), VIOLET, "--", .8)
arrow((0, 0), (4, 3), "#e2e8f0")
ax.text(.05, 1.55, "u = (1, 2)", color=CYAN, fontsize=18)
ax.text(1.75, .3, "v = (3, 1)", color=VIOLET, fontsize=18)
ax.text(2.3, 2.9, "平移后的 v", color=VIOLET, fontsize=17)
ax.text(3.15, 3.35, "u + v = (4, 3)", fontsize=18)
ax.scatter([0, 1, 3, 4], [0, 2, 1, 3], s=32, color=["#e2e8f0", CYAN, VIOLET, "#e2e8f0"], zorder=5)
ax.set_title("向量相加：首尾相接，得到同一个终点", loc="left", fontsize=24, pad=24, weight="bold")
fig.subplots_adjust(left=.12, right=.94, top=.85, bottom=.12)
fig.savefig(OUT / "vector-addition.png", facecolor=BG)
plt.close(fig)
print("Generated python-function-call.png (1200×600), vector-addition.png (1200×700)")

# 手机使用单独构图，而非把桌面图缩小或截断。
fig, ax = plt.subplots(figsize=(6.4, 10.4), dpi=100, facecolor=BG)
ax.set(xlim=(0, 6.4), ylim=(0, 10.4)); ax.axis("off")
ax.text(.45, 9.8, "函数调用的三个步骤", fontsize=23, weight="bold")
ax.text(.45, 9.2, "transform(3, shift=1)", fontsize=23, color=CYAN, family="DejaVu Sans Mono")
for y, title, body in [(6.5, "01  参数绑定", "value=3 · scale=2（默认）\nshift=1"), (3.8, "02  执行函数体", "value × scale + shift\n3 × 2 + 1"), (1.1, "03  返回结果", "return 7\n调用者得到数值 7")]:
    ax.add_patch(FancyBboxPatch((.55, y), 5.25, 2.05, boxstyle="round,pad=0.15,rounding_size=0.12", facecolor=PANEL, edgecolor="#4a5a83", linewidth=1.2))
    ax.text(.8, y+1.5, title, fontsize=23, color=VIOLET)
    ax.text(.8, y+1.04, body, fontsize=23, va="top", linespacing=1.35)
for y in (6.3, 3.6):
    ax.annotate("", xy=(3.2, y-.35), xytext=(3.2, y+.05), arrowprops={"arrowstyle": "->", "color": CYAN, "lw": 2})
ax.text(.55, .35, "默认值只在省略对应实参时使用。", fontsize=23, color="#b2c0d8")
fig.subplots_adjust(0, 0, 1, 1)
fig.savefig(OUT / "python-function-call-mobile.png", facecolor=BG)
plt.close(fig)

fig, ax = plt.subplots(figsize=(6.4, 7.2), dpi=100, facecolor=BG)
ax.set_facecolor(BG)
ax.set(xlim=(-.25, 4.7), ylim=(-.2, 4), xlabel="x", ylabel="y")
ax.set_aspect("equal", adjustable="box")
ax.set_xticks(range(5)); ax.set_yticks(range(5)); ax.tick_params(labelsize=23)
ax.xaxis.label.set_size(23); ax.yaxis.label.set_size(23)
ax.grid(color="#293752", linewidth=.8, zorder=0)
for spine in ax.spines.values(): spine.set_color("#5a6b8f")
ax.axhline(0, color="#5a6b8f", lw=1); ax.axvline(0, color="#5a6b8f", lw=1)
arrow((0, 0), (1, 2), CYAN)
arrow((0, 0), (3, 1), VIOLET)
arrow((1, 2), (4, 3), VIOLET, "--", .8)
arrow((0, 0), (4, 3), "#e2e8f0")
ax.text(.1, 2.3, "u=(1,2)", color=CYAN, fontsize=23)
ax.text(1.7, .4, "v=(3,1)", color=VIOLET, fontsize=23)
ax.text(2.05, 3.35, "u+v=(4,3)", fontsize=23)
ax.scatter([0, 1, 3, 4], [0, 2, 1, 3], s=28, color=["#e2e8f0", CYAN, VIOLET, "#e2e8f0"], zorder=5)
fig.text(.1, .94, "向量相加：首尾相接", fontsize=23, weight="bold")
fig.text(.12, .065, "虚线：平移后的 v\n方向与长度不变", fontsize=23, linespacing=1.1, color="#b2c0d8")
fig.subplots_adjust(left=.12, right=.96, top=.87, bottom=.22)
fig.savefig(OUT / "vector-addition-mobile.png", facecolor=BG)
plt.close(fig)
print("Generated mobile compositions (640×1040, 640×720)")
