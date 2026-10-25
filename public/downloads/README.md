# Aivora ML201 演示实验

这是原创合成数据教学示例，演示全批量梯度下降对 y=2x+1 的拟合，不是现实数据的泛化评估。

依赖：Python 3.10+、NumPy。CPU 即可，不需要 GPU、外部数据或模型 API。

```bash
python -m pip install numpy
python linear_regression.py
```

Notebook 使用同一份代码，可在本地 Jupyter 环境逐单元执行。此处不提供在线 Python 执行服务。

本次实际验证环境：Python 3.14.2、NumPy 2.5.2；默认输出接近 w=2、b=1、MSE=0，并通过最小二乘容差断言。更改学习率或数据后需要重新分析结果；过大学习率可能导致发散和断言失败。

学习目标与公式说明见站内 `/learn/ML201/ML201-C04-L01`。此内容为演示样章，正式发布仍需专业人工审校和试学。
