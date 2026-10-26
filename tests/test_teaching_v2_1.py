"""新课时与开放题数值的独立核对，不评价真实学习效果。"""
from pathlib import Path
import contextlib
import io
import json
import runpy
import unittest
import numpy as np

ROOT = Path(__file__).resolve().parents[1]

class TeachingV21Tests(unittest.TestCase):
    def load(self, stem):
        with contextlib.redirect_stdout(io.StringIO()):
            return runpy.run_path(str(ROOT / f"public/downloads/{stem}.py"))

    def test_functions_on_unseen_inputs(self):
        double = self.load("function_basics")["double"]
        scale = self.load("function_binding")["scale"]
        default = self.load("function_defaults")["scale"]
        add_one = self.load("function_return")["add_one"]
        for x in [-7, 0, 2.5, 19]:
            self.assertEqual(double(x), x+x)
            self.assertEqual(default(x), double(x))
            self.assertEqual(scale(factor=3, value=x), x+x+x)
            self.assertEqual(default(x, factor=0), 0)
            self.assertEqual(add_one(add_one(x)), x+2)
        scope = self.load("function_scope")
        self.assertEqual(scope["add_two"](4), 6)
        self.assertEqual(scope["value"], 10)
        self.assertNotIn("result", scope)

    def test_new_hand_exercises(self):
        np.testing.assert_array_equal(np.array([2,-1])+[1,3], [3,2])
        np.testing.assert_array_equal(3*np.array([2,-1]), [6,-3])
        self.assertEqual(np.dot([2,0,-1],[3,4,2]), 4)
        np.testing.assert_array_equal(np.array([[2,0],[-1,3]]).T, [[2,-1],[0,3]])
        M, N = np.array([[1,0,2],[0,1,1]]), np.array([[1,2],[3,0],[2,1]])
        np.testing.assert_array_equal(M@N, [[5,4],[5,1]])
        self.assertEqual((N@M).shape, (3,3))
        self.assertEqual(np.dot([2,3],[4,1]), 11)

    def test_new_gradient_and_update_examples(self):
        # 4.2 先给数字的例子；以有限差分独立验证偏导。
        def loss(w,b): return (2*w+b-5)**2
        h = 1e-5
        np.testing.assert_allclose([(loss(h,0)-loss(-h,0))/(2*h),
                                    (loss(0,h)-loss(0,-h))/(2*h)], [-20,-10], atol=1e-8, rtol=0)
        self.assertAlmostEqual(loss(.2,.1), 20.25)
        x, y = np.array([1.,2.]), np.array([2.,4.])
        w,b = 0.,0.
        for step in range(2000):
            e = w*x+b-y
            # 本地标量循环作独立对照，避免仅复制页面 np.mean 写法。
            dw = sum(2*float(a)*float(v) for a,v in zip(e,x))/len(x)
            db = sum(2*float(a) for a in e)/len(x)
            w,b = w-.1*dw,b-.1*db
            if step == 0:
                np.testing.assert_allclose([w,b], [1,.6], atol=1e-12, rtol=0)
                self.assertAlmostEqual(float(np.mean((w*x+b-y)**2)),1.06)
        np.testing.assert_allclose([w,b], [2,0], atol=1e-7, rtol=0)

    def test_figure_numbers_and_downloads(self):
        data = json.loads((ROOT/"public/learning/v2-1/numeric-evidence.json").read_text())
        np.testing.assert_array_equal(np.array(data["A"])@data["B"],data["product"])
        u = np.array([1,2]); column = u.reshape(2,1)
        self.assertEqual(data["shapes"], [list(v) for v in [u.shape,u.T.shape,column.shape,column.T.shape]])
        for stem in ["function_basics","function_binding","function_return","function_scope","function_defaults","vector_basics","vector_dot","matrix_shape","matrix_product","numpy_shapes"]:
            notebook = json.loads((ROOT/f"public/downloads/{stem}.ipynb").read_text(encoding="utf-8"))
            source = (ROOT/f"public/downloads/{stem}.py").read_text(encoding="utf-8")
            self.assertEqual("".join(notebook["cells"][1]["source"]),source)

if __name__ == "__main__": unittest.main()
