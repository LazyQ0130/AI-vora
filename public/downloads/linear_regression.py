import numpy as np

# 合成教学数据；不是现实数据上的泛化评估
x = np.linspace(0.0, 1.0, 60)
y = 2.0 * x + 1.0
w, b = 0.0, 0.0
learning_rate = 0.1
losses = []

for step in range(2000):
    prediction = w * x + b
    error = prediction - y
    losses.append(float(np.mean(error ** 2)))
    # 两个梯度必须基于同一次预测计算
    dw = 2.0 * np.mean(error * x)
    db = 2.0 * np.mean(error)
    w -= learning_rate * dw
    b -= learning_rate * db

final_loss = float(np.mean((w * x + b - y) ** 2))
print(f"w={w:.6f}, b={b:.6f}, MSE={final_loss:.8f}")

# 和最小二乘解析求解交叉核对
design = np.column_stack((x, np.ones_like(x)))
reference, *_ = np.linalg.lstsq(design, y, rcond=None)
assert np.allclose([w, b], reference, atol=1e-5)
assert final_loss < losses[0]
assert np.isfinite(losses).all()
