import numpy as np


def validate_vectors(x, y):
    # 拒绝 (n, 1) 与 (n,) 意外广播成 (n, n)
    if x.ndim != 1 or y.ndim != 1 or x.shape != y.shape or x.size == 0:
        raise ValueError("x and y must be equal-length, nonempty 1-D arrays")
    if not np.isfinite(x).all() or not np.isfinite(y).all():
        raise ValueError("all input values must be finite")


# 与 4.3 手算完全相同的两个无量纲合成样本
x = np.array([1.0, 2.0])
y = np.array([3.0, 5.0])
validate_vectors(x, y)
w, b = 0.0, 0.0
learning_rate = 0.1
losses = [float(np.mean((w * x + b - y) ** 2))]
first_step = None

for step in range(2000):
    prediction = w * x + b
    error = prediction - y
    dw = 2.0 * np.mean(error * x)
    db = 2.0 * np.mean(error)
    w, b = w - learning_rate * dw, b - learning_rate * db
    current_loss = float(np.mean((w * x + b - y) ** 2))
    if not np.isfinite(current_loss) or current_loss > 1e12:
        raise FloatingPointError("loss diverged; check learning rate and data scale")
    losses.append(current_loss)
    if step == 0:
        first_step = (float(w), float(b), current_loss)

final_loss = losses[-1]
print(f"initial MSE={losses[0]:.6f}")
print(f"first w={first_step[0]:.3f}, b={first_step[1]:.3f}, MSE={first_step[2]:.6f}")
print(f"final w={w:.6f}, b={b:.6f}, MSE={final_loss:.10f}")

# 第一轮核对手算；最后一轮核对独立的最小二乘解
assert np.allclose(first_step, [1.3, 0.8, 1.685], atol=1e-12, rtol=0)
design = np.column_stack((x, np.ones_like(x)))
reference, *_ = np.linalg.lstsq(design, y, rcond=None)
assert np.allclose([w, b], reference, atol=1e-7, rtol=0)
assert final_loss < 1e-10
assert np.isfinite(losses).all()
