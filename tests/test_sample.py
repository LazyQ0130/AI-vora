"""运行下载文件、Notebook，并对 NumPy 梯度做独立有限差分校验。"""
import json
import runpy
import unittest
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[1]

class SampleTests(unittest.TestCase):
    def test_script_and_notebook(self):
        scope = runpy.run_path(str(ROOT / "public/downloads/linear_regression.py"))
        self.assertLess(scope["final_loss"], 1e-10)
        self.assertAlmostEqual(scope["w"], 2.0, places=5)
        notebook = json.loads((ROOT / "public/downloads/linear_regression.ipynb").read_text(encoding="utf-8"))
        cell_scope = {}
        exec("".join(notebook["cells"][1]["source"]), cell_scope)
        self.assertAlmostEqual(cell_scope["final_loss"], scope["final_loss"])

    def test_gradient_finite_difference(self):
        x = np.linspace(0.0, 1.0, 60)
        y = 2 * x + 1
        for w, b in [(0., 0.), (1.5, -.2), (2., 1.)]:
            loss = lambda a, c: float(np.mean((a * x + c - y) ** 2))
            eps = 1e-5
            dw = 2 * np.mean((w * x + b - y) * x)
            db = 2 * np.mean(w * x + b - y)
            self.assertAlmostEqual(dw, (loss(w+eps,b)-loss(w-eps,b))/(2*eps), places=7)
            self.assertAlmostEqual(db, (loss(w,b+eps)-loss(w,b-eps))/(2*eps), places=7)

if __name__ == "__main__":
    unittest.main()
