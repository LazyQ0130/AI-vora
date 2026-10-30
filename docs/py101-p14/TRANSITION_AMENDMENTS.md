# 四处末段精确勘误与版本决定

2026-10-31；对照开工HEAD `895bb7644735aa4e28d721e272e04b996c1c8eec`。仅更新已确认的可读状态，不增加知识或考核。

## PY101-C02-L01

文件：`src/content/lessons/py101/variables-and-assignment.ts`，section=`next-step`，末段。

改前：

> 接着学习2.2「分清文字、整数、小数和真假值」，它已有待人工审核试读，将用实际类型观察接续本节的名称与值。2.3、2.4也已有待人工审核试读，2.5–2.6尚未制作；第5章函数试读还需要表达式与控制流程等中间先修，不能把阅读器的可读课时导航当作直接跳学建议。整门PY101仍在筹备。

改后：

> 接着学习2.2「分清文字、整数、小数和真假值」，它已有待人工审核试读，将用实际类型观察接续本节的名称与值。2.3–2.6也均已有待人工审核试读；第5章函数试读还需要表达式与控制流程等中间先修，不能把阅读器的可读课时导航当作直接跳学建议。整门PY101仍在筹备。

完整对象SHA-256：`3e17af71ba303d80a9148336f812cdf18132db0cf4e49c137543443435dcd7f9` → `f1df6afaf46b084d53f2b711b11bf96cc276b6c102100f5102396dd82f5270c3`。Publication technicalEvidence：`docs/py101-p11/TRANSITION_AMENDMENTS.md` → `docs/py101-p14/TRANSITION_AMENDMENTS.md`。

## PY101-C02-L02

文件：`src/content/lessons/py101/basic-value-types.ts`，section=`next-step`，末段。

改前：

> 接着学习2.3「用表达式算出一个结果」，它已有待人工审核试读，2.4–2.6仍在规划。第5章函数试读还需要表达式与控制流程等中间先修；技术导航不表示可以直接跳学。整门PY101仍在筹备。

改后：

> 接着学习2.3「用表达式算出一个结果」，它与2.4–2.6均已有待人工审核试读。第5章函数试读还需要表达式与控制流程等中间先修；技术导航不表示可以直接跳学。整门PY101仍在筹备。

完整对象SHA-256：`47b641470d7d65350e658f2a01c1ade51b21a231dc98e0fe329cbdf024e3ae38` → `4d08818ba271d4bd63bbe9ebe7a56534747c078f9f282a45c743c559a6214291`。Publication technicalEvidence：`docs/py101-p10/TRANSITION_AMENDMENT.md` → `docs/py101-p14/TRANSITION_AMENDMENTS.md`。

## PY101-C02-L03

文件：`src/content/lessons/py101/arithmetic-expressions.ts`，section=`next-step`，末段。

改前：

> 接着学习2.4「让比较表达式给出真假结果」，它已有待人工审核试读，2.5–2.6仍在规划。第5章函数试读还需要比较、输入输出与控制流程等中间先修；技术导航不表示可以直接跳学。整门PY101仍在筹备。

改后：

> 接着学习2.4「让比较表达式给出真假结果」，它与2.5–2.6均已有待人工审核试读。第5章函数试读还需要比较、输入输出与控制流程等中间先修；技术导航不表示可以直接跳学。整门PY101仍在筹备。

完整对象SHA-256：`90a6119fd773ff6cc62266951bfd8107f56236d68da76faa38c4e37bd9512253` → `bd548dc654271eeac72cab8af416984f07155e5cd146241b7e5b1c4ac9c6a8b1`。Publication technicalEvidence：`docs/py101-p11/TRANSITION_AMENDMENTS.md` → `docs/py101-p14/TRANSITION_AMENDMENTS.md`。

## PY101-C02-L04

文件：`src/content/lessons/py101/numeric-comparisons.ts`，section=`next-step`，末段。

改前：

> 接着学习2.5「取得用户输入，再转成需要的数值」，它已有待人工审核试读，2.6尚未制作。第5章函数试读还需输出与控制流程等中间先修，阅读器的下一可读导航不表示直接跳学建议。整门PY101仍在筹备。

改后：

> 接着学习2.5「取得用户输入，再转成需要的数值」，它与2.6均已有待人工审核试读。第5章函数试读还需输出与控制流程等中间先修，阅读器的下一可读导航不表示直接跳学建议。整门PY101仍在筹备。

完整对象SHA-256：`cfec59a758db3df02d07bd4fbedfa49f93fc1aeedef6044ce9e85713a533d62c` → `e2a0a8d45f518b265bccb7daca617ff77b6e77e02d720494374ec57f001c18e4`。Publication technicalEvidence：`docs/py101-p12/TRANSITION_AMENDMENTS.md` → `docs/py101-p14/TRANSITION_AMENDMENTS.md`。

## 共通决定

每份Lesson以基线完整对象为起点，只替换上述一个末段后与现行全对象相等。目标、assessmentMap、题目、提示、答案、rubric、代码、资源、section/exercise ID、学时全部不变，Publication仅technicalEvidence改动。因此依现行COURSE_AUTHORING版本规则保留r1，progressScope和全部旧进度键相等；不删除、迁移或覆盖旧完成。旧读完仍不证明能力。2.5、2.6不改，P8–P13旧报告和快照不改。

逐项scope与Publication全对象在[TRANSITION_AMENDMENTS.json](TRANSITION_AMENDMENTS.json)，现有完整摘要登记在[APPROVED_CHANGES.json](APPROVED_CHANGES.json)。登记器只接受精确完整来源/对象SHA，未知附加正文、目标或发布变更仍被拒绝，未扩展workspaceOnly/protectedText豁免。历史P11/P12技术指针及P13旧对象断言用原登记器回到当时快照后比较；不删除旧断言或改旧快照。
