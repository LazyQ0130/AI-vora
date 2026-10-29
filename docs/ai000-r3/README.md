# AI000 R3 定向精修证据

2026-10-29。基线450e40187f444ab551ca1d391ec5aa91c7dc0e5c。正文仅改2.2、5.5、6.2、6.3，6.3配套题设及四条Publication同步；V1.0仍是正式采用的编辑规范。

先读[完整报告](../AI000_R3_REFINEMENT_REPORT.md)、[来源核验](SOURCES.md)与[另轮解题](SEMANTIC_RECHECK.md)。这是AI辅助精修及技术证据，不是教师审核、法律审核或学生试学。

|课时|开写前简报|准确差异|本轮对象/版本/锚点/阅读量证据|
|---|---|---|---|
|2.2 r1→r1|[brief](briefs/2-2.md)|[diff](lessons/2-2.diff)|[JSON](lessons/2-2.json)|
|5.5 r1→r1|[brief](briefs/5-5.md)|[diff](lessons/5-5.diff)|[JSON](lessons/5-5.json)|
|6.2 r1→r1|[brief](briefs/6-2.md)|[diff](lessons/6-2.diff)|[JSON](lessons/6-2.json)|
|6.3 r1→r2|[brief](briefs/6-3.md)|[diff，含配套题设](lessons/6-3.diff)|[JSON](lessons/6-3.json)|

[BEFORE.json](BEFORE.json)独占保存实际基线四课全文、47对象摘要、47发布记录、252生产文件摘要及旧冻结包摘要。[CONTENT.diff](CONTENT.diff)含本轮六个生产源码的完整差异。[AFTER_CHECK.json](AFTER_CHECK.json)记录范围、原/新摘要、目标、映射、稳定ID及导航；它是**本轮新证据**，不覆盖此前任何快照。

[APPROVED_CHANGES.json](APPROVED_CHANGES.json)是本轮技术变更登记（名称沿用项目惯例，“APPROVED”不表示人工学科批准）。只有完整新对象/源码命中登记摘要，历史回归辅助才反向还原到基线进行旧全文比较；额外的正文、提示、发布字段、源码变化仍失败。它不参与产品运行、存储或旧审稿包校验。新稿与旧稿的实际差异仍由上面的diff与本轮完整性检查约束，不用归一化宣称内容没变。

在仓库根目录执行：

```powershell
npx tsx scripts/review-ai000-r3.ts
npm test
```

不要重跑`--baseline`或`--record-changes`覆盖初始证据（独占写会拒绝）。也不要运行旧准备包的生成器试图让旧冻结校验通过；[预期失败日志](evidence/FROZEN_SNAPSHOT_EXPECTED_FAILURE.txt)保留其对现行变更的拒绝。新的人工审稿应绑定本轮教材提交与对象摘要，复制旧模板到新的执行台账，不能沿用旧SHA签署。

浏览器证据为本地生产构建：四课×四视口几何/状态见[BROWSER.json](evidence/BROWSER.json)，8次前后课实际点击见[NAVIGATION.json](evidence/NAVIGATION.json)，手机目录/焦点见[DRAWER.json](evidence/DRAWER.json)，关键桌面/手机JPG存于evidence/。视口模拟、自动化点击及截图都不是实体设备测试或学生理解证据。

24课仍pending-review/preview，AI000仍planned。旧r1/r2记录不删；6.3 r1不继承到r2。未填写任何教师姓名、签署、成绩或学生结果。
