"""原创、确定性教学图；桌面和手机各自排版，不依赖运行时 Python。"""
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

OUT = Path(__file__).resolve().parents[1] / "public/learning/ml-v2"
OUT.mkdir(parents=True, exist_ok=True)
BG, FG, GRID, CYAN, PURPLE = "#0e172e", "#cbd6ee", "#31415e", "#67e8f9", "#b6a2ff"
plt.rcParams.update({"font.family": ["Microsoft YaHei", "DejaVu Sans"], "axes.unicode_minus": False,
    "text.color": FG, "axes.labelcolor": FG, "xtick.color": FG, "ytick.color": FG})

def canvas(mobile, title, xlabel="输入 x（合成刻度）", ylabel="目标 / 预测 y"):
    size = (6.4, 6.8) if mobile else (12, 6.4)
    fig, ax = plt.subplots(figsize=size, dpi=100, facecolor=BG)
    ax.set_facecolor(BG)
    font = 22 if mobile else 17
    ax.tick_params(labelsize=font)
    ax.set_xlabel(xlabel, fontsize=font, labelpad=12)
    ax.set_ylabel(ylabel, fontsize=font, labelpad=12)
    ax.grid(color=GRID, alpha=.8, lw=.8)
    for spine in ax.spines.values(): spine.set_color(GRID)
    fig.text(.14 if mobile else .1, .94, title, fontsize=23, weight="bold")
    fig.subplots_adjust(left=.18 if mobile else .1, right=.96, bottom=.19 if mobile else .15, top=.78 if mobile else .82)
    return fig, ax

def save(fig, name, mobile):
    fig.savefig(OUT / f"{name}{'-mobile' if mobile else ''}.png", facecolor=BG)
    plt.close(fig)

for mobile in (False, True):
    fig, ax = canvas(mobile, "从连续刻度到数值预测")
    ax.scatter([0, 1, 2], [1, 3, 5], s=90, color=CYAN, zorder=4, label="已知样本")
    ax.scatter([.5], [2], s=110, edgecolor=PURPLE, facecolor=BG, linewidth=2, zorder=4, label="待估计点")
    ax.plot([0, 2], [1, 5], "--", color=PURPLE, alpha=.7)
    ax.set(xlim=(-.2, 2.25), ylim=(0, 6), xticks=[0, .5, 1, 2])
    ax.legend(loc="upper left", fontsize=20 if mobile else 17, facecolor=BG, edgecolor=GRID, labelcolor=FG)
    save(fig, "calibration-samples", mobile)

    fig, ax = canvas(mobile, "权重与偏置改变直线")
    xs = np.linspace(0, 2.2, 100)
    for w, b, color, style in [(2, 1, CYAN, "-"), (1, 1, PURPLE, "--"), (2, 0, "#e3c47a", ":")]:
        ax.plot(xs, w * xs + b, color=color, ls=style, lw=2.5, label=f"w={w}, b={b}")
    ax.scatter([0, 1, 2], [1, 3, 5], s=65, color=FG, zorder=4)
    ax.set(xlim=(0, 2.2), ylim=(-.1, 6), xticks=[0, 1, 2])
    ax.legend(loc="upper left", fontsize=20 if mobile else 17, facecolor=BG, edgecolor=GRID, labelcolor=FG)
    save(fig, "parameter-lines", mobile)

    fig, ax = canvas(mobile, "小步与大步：同一出发点", "参数 θ", "F(θ) = (θ − 2)²")
    ts = np.linspace(-.2, 5, 200)
    ax.plot(ts, (ts - 2) ** 2, color=CYAN, lw=2.5)
    ax.scatter([0, .4, 4.8], [4, 2.56, 7.84], color=[FG, CYAN, PURPLE], s=90, zorder=4)
    ax.annotate("η=0.1", xy=(.4, 2.56), xytext=(.8, .6), fontsize=21 if mobile else 18, color=CYAN, arrowprops={"arrowstyle": "->", "color": CYAN})
    ax.annotate("η=1.2", xy=(4.8, 7.84), xytext=(2.5, 6), fontsize=21 if mobile else 18, color=PURPLE, arrowprops={"arrowstyle": "->", "color": PURPLE})
    ax.text(.1, 4.3, "起点 θ=0", fontsize=21 if mobile else 18)
    ax.set(xlim=(-.3, 5.2), ylim=(-.3, 9), xticks=[0, 2, 4], yticks=[0, 4, 8])
    save(fig, "gradient-direction", mobile)

    fig, ax = canvas(mobile, "一次更新，预测更接近目标")
    ax.scatter([1, 2], [3, 5], color=FG, s=100, zorder=5, label="固定目标")
    xs = np.linspace(0, 2.2, 100)
    ax.plot(xs, np.zeros_like(xs), "--", color=PURPLE, lw=2.5, label="旧 w=0, b=0")
    ax.plot(xs, 1.3 * xs + .8, color=CYAN, lw=2.5, label="新 w=1.3, b=0.8")
    ax.set(xlim=(0, 2.2), ylim=(-.4, 6), xticks=[0, 1, 2])
    ax.legend(loc="upper left", fontsize=18 if mobile else 17, facecolor=BG, edgecolor=GRID, labelcolor=FG)
    save(fig, "first-update", mobile)

    fig, ax = canvas(mobile, "固定数据上的训练 MSE", "更新次数", "MSE（对数尺度）")
    x, y = np.array([1., 2.]), np.array([3., 5.])
    w, b, losses = 0., 0., [17.]
    for _ in range(2000):
        error = w*x+b-y
        dw, db = 2*np.mean(error*x), 2*np.mean(error)
        w, b = w-.1*dw, b-.1*db
        losses.append(float(np.mean((w*x+b-y)**2)))
    ax.semilogy(range(2001), losses, color=CYAN, lw=2.5)
    ax.set(xlim=(0, 2000), xticks=[0, 1000, 2000])
    save(fig, "training-loss", mobile)
print("Generated 5 original teaching diagrams × desktop/mobile (1200×640 / 640×680)")
