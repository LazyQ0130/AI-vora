"""V2 教材的独立数值对照；不是重复断言页面文字。"""
import unittest
from fractions import Fraction
from pathlib import Path
import runpy
import json
import numpy as np

ROOT = Path(__file__).resolve().parents[1]

class TeachingV2Tests(unittest.TestCase):
    def test_losses_exact(self):
        errors = [1, -1, -3]
        self.assertEqual(sum(Fraction(abs(e), 3) for e in errors), Fraction(5, 3))
        self.assertEqual(sum(Fraction(e*e, 3) for e in errors), Fraction(11, 3))
        self.assertEqual(sum(Fraction(e*e, 3) for e in [0, -1, -2]), Fraction(5, 3))

    def test_hand_update_and_wrong_variants(self):
        x, y = np.array([1., 2.]), np.array([3., 5.])
        loss = lambda w, b: np.mean((w*x+b-y)**2)
        np.testing.assert_allclose([loss(0, 0), loss(1.3, .8), loss(1.3, .41), loss(2.6, 1.6)],
                                   [17, 1.685, 2.8121, 2.34], atol=1e-12, rtol=0)
        e = -y
        self.assertEqual(2*np.mean(e*x), -13)
        self.assertEqual(2*np.mean(e), -8)
        self.assertAlmostEqual(2*np.mean(1.3*x-y), -4.1)

    def test_gradient_finite_difference(self):
        x, y, h = np.array([0., 1., 2.]), np.array([1., 3., 5.]), 1e-5
        def loss(w, b): return np.mean((w*x+b-y)**2)
        for w, b in [(0., 0.), (1.3, .8), (-.7, 2.1)]:
            e = w*x+b-y
            analytic = [2*np.mean(e*x), 2*np.mean(e)]
            numeric = [(loss(w+h, b)-loss(w-h, b))/(2*h), (loss(w, b+h)-loss(w, b-h))/(2*h)]
            np.testing.assert_allclose(analytic, numeric, atol=1e-8, rtol=0)
            doubled = np.tile(x, 2)*w+b-np.tile(y, 2)
            np.testing.assert_allclose(analytic, [2*np.mean(doubled*np.tile(x, 2)), 2*np.mean(doubled)])

    def test_scalar_direction(self):
        f = lambda t: (t-2)**2
        for rate, expected, loss in [(.1, .4, 2.56), (1.2, 4.8, 7.84)]:
            updated = 0-rate*(-4)
            self.assertAlmostEqual(updated, expected)
            self.assertAlmostEqual(f(updated), loss)
        self.assertAlmostEqual(4-.25*4, 3)
        self.assertEqual(f(3), 1)

    def test_complete_program_oracle_and_input_rejection(self):
        values = runpy.run_path(str(ROOT / "public/downloads/ml_gradient_descent.py"))
        np.testing.assert_allclose([values["w"], values["b"]], [2, 1], atol=1e-7, rtol=0)
        self.assertEqual(len(values["losses"]), 2001)
        validate = values["validate_vectors"]
        validate(np.array([1.]), np.array([3.]))
        for x, y in [(np.array([[1.], [2.]]), np.array([3., 5.])),
                     (np.array([]), np.array([])), (np.array([np.nan]), np.array([1.])),
                     (np.array([1.]), np.array([3., 5.])), (np.array([np.inf]), np.array([1.]))]:
            with self.subTest(x=x), self.assertRaises(ValueError): validate(x, y)

    def test_rate_experiment_fixed_budget(self):
        x, y = np.array([1., 2.]), np.array([3., 5.])
        losses = []
        for rate in (.01, .1):
            w, b = 0., 0.
            for _ in range(200):
                error = w*x+b-y
                dw, db = 2*np.mean(error*x), 2*np.mean(error)
                w, b = w-rate*dw, b-rate*db
            losses.append(np.mean((w*x+b-y)**2))
        self.assertGreater(losses[0], losses[1])
        self.assertTrue(np.isfinite(losses).all())

    def test_new_downloads_match_notebooks(self):
        for stem in ["ml_losses", "ml_gradient_descent"]:
            script = (ROOT / f"public/downloads/{stem}.py").read_text(encoding="utf-8")
            notebook = json.loads((ROOT / f"public/downloads/{stem}.ipynb").read_text(encoding="utf-8"))
            self.assertEqual(script, "".join(notebook["cells"][1]["source"]))
            self.assertIsNone(notebook["cells"][1]["execution_count"])
            self.assertEqual(notebook["cells"][1]["outputs"], [])
