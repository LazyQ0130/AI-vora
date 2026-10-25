# Python 3.10+；无第三方依赖，全部数值是合成刻度
targets = [1.0, 3.0, 5.0]
predictions = [2.0, 2.0, 2.0]  # w=0, b=2
assert len(targets) == len(predictions) and len(targets) > 0
errors = [prediction - target for prediction, target in zip(predictions, targets)]
n = len(errors)
mae = sum(abs(error) for error in errors) / n
mse = sum(error ** 2 for error in errors) / n
print("errors:", errors)
print(f"MAE={mae:.6f}, MSE={mse:.6f}")
assert errors == [1.0, -1.0, -3.0]
assert abs(mae - 5.0 / 3.0) < 1e-12
assert abs(mse - 11.0 / 3.0) < 1e-12
