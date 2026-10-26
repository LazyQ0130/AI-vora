"""V2.1 数学教学图：标签来自实际计算，支持桌面和手机构图。"""
from pathlib import Path
import json
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

OUT = Path(__file__).resolve().parents[1] / "public/learning/v2-1"
OUT.mkdir(parents=True, exist_ok=True)
BG, PANEL, TEXT, CYAN, PURPLE = "#0e172e", "#16223c", "#e2e8f0", "#67e8f9", "#b6a2ff"
plt.rcParams.update({"font.family": ["Microsoft YaHei", "DejaVu Sans"], "text.color": TEXT, "axes.unicode_minus": False})
A = np.array([[1, 2], [0, 1]])
B = np.array([[2, 0], [1, 3]])
C = A @ B
assert np.array_equal(C, [[4, 6], [1, 3]])
u = np.array([1, 2])
column = u.reshape(2, 1)
assert (u.shape, u.T.shape, column.shape, column.T.shape) == ((2,), (2,), (2, 1), (1, 2))
assert 3 * 2 == 6

def canvas(width, height, title, mobile):
    fig, ax = plt.subplots(figsize=(width/100, height/100), dpi=100, facecolor=BG)
    ax.set(xlim=(0, width), ylim=(0, height)); ax.axis("off")
    ax.text(36, height-48, title, fontsize=23 if mobile else 25, weight="bold", va="top")
    fig.subplots_adjust(0, 0, 1, 1)
    return fig, ax

def box(ax, x, y, w, h, title, body, mobile=False):
    ax.add_patch(FancyBboxPatch((x,y),w,h,boxstyle="round,pad=0,rounding_size=12", facecolor=PANEL, edgecolor="#4a5a83"))
    size = 22 if mobile else 19
    ax.text(x+20,y+h-22,title,color=PURPLE,fontsize=size,va="top")
    ax.text(x+20,y+h-70,body,fontsize=size,va="top",linespacing=1.6)

for mobile in (False, True):
    suffix = "-mobile" if mobile else ""
    w,h = (640,900) if mobile else (1200,500)
    fig,ax=canvas(w,h,"double(3)：先调用，再计算",mobile)
    steps=[("01 输入与绑定","实参 3 → 形参 value"),("02 执行函数体","value × 2 = 3 × 2 = 6"),("03 返回调用处","return 6 → result = 6")]
    for i,(title,body) in enumerate(steps):
        x,y,bw,bh=(36,h-330-i*245,568,195) if mobile else (36+i*390,145,350,205)
        box(ax,x,y,bw,bh,title,body,mobile)
        if i<2:
            start,end=((320,y-5),(320,y-42)) if mobile else ((x+bw+5,245),(x+bw+34,245))
            ax.annotate("",xy=end,xytext=start,arrowprops={"arrowstyle":"->","color":CYAN,"lw":2})
    fig.savefig(OUT/f"function-flow{suffix}.png",facecolor=BG); plt.close(fig)

    w,h=(640,1080) if mobile else (1200,720)
    fig,ax=canvas(w,h,"矩阵乘法：每格取一行与一列",mobile)
    ax.text(36,h-115,"A = [[1,2],[0,1]]    B = [[2,0],[1,3]]",fontsize=18 if mobile else 21,color=CYAN)
    for i in range(2):
        for j in range(2):
            index=i*2+j
            expression=" + ".join(f"{int(A[i,k])}×{int(B[k,j])}" for k in range(2))
            x,y,bw,bh=(36,h-330-index*205,568,170) if mobile else (36+j*580,365-i*225,548,185)
            box(ax,x,y,bw,bh,f"结果第 {i+1} 行、第 {j+1} 列",f"{expression} = {int(C[i,j])}",mobile)
    ax.text(36,32,"结果 C = [[4,6],[1,3]]；内部维度 2 相同。",fontsize=19 if mobile else 21,color=CYAN)
    fig.savefig(OUT/f"matrix-product{suffix}.png",facecolor=BG); plt.close(fig)

    w,h=(640,900) if mobile else (1200,560)
    fig,ax=canvas(w,h,"相同两个数，区分一维与二维",mobile)
    panels=[("一维 u","[1, 2]\nshape (2,)；u.T 仍为 (2,)"),("二维 column","[[1], [2]]\nreshape(2,1) → (2,1)"),("二维 column.T","[[1, 2]]\n转置后 (1,2)")]
    for i,(title,body) in enumerate(panels):
        x,y,bw,bh=(36,h-330-i*245,568,200) if mobile else (36+i*390,150,350,250)
        box(ax,x,y,bw,bh,title,body,mobile)
    fig.savefig(OUT/f"array-shapes{suffix}.png",facecolor=BG); plt.close(fig)

(OUT/"numeric-evidence.json").write_text(json.dumps({"A":A.tolist(),"B":B.tolist(),"product":C.tolist(),"shapes":[u.shape,u.T.shape,column.shape,column.T.shape],"function":{"input":3,"factor":2,"output":6}},indent=2)+"\n",encoding="utf-8")
print("Generated 6 numerical teaching figures and numeric-evidence.json")
