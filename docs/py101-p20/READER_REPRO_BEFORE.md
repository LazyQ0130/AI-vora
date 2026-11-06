# 修复前：正式Reader生产复现

2026-11-06，隔离3010来源、1440×1000、Webpack生产构建，正式基线d50d2a4的Reader逻辑未改。只用正常UI产生测试记录，没有接触原3000来源。执行前固定三次原路径，before-reader-rows保存每次即时读数；没有无限重试。

| 次数 | 离开前已保存入口 | SPA返回即时 | 稳定后/重载观察 |
| --- | --- | --- | --- |
| 1 | #short-circuit，目标top175.281 | #reverse-result | 稳定仍错；首次reload即刻尚未hydrate，随后下一次点击前读到原错误入口 |
| 2 | #short-circuit，目标top175.948 | #reverse-result | reload观察为#separate-checks，同样不等于已保存目标 |
| 3 | #short-circuit，目标top175.948 | #reverse-result | 稳定后及hydrate后的reload均#separate-checks |

第2/3次明确等课程页scrollY=0再返回；第1次课程页已就绪即返回。最初建立测试书签时还观察到首次恢复入口出现导致布局变化，入口先落在reverse-result；未把这条未满足前提的准备过程算作已保存short-circuit的核心样本，重新用正常UI建立正确前提后才执行三次。

三次均确认原故障类存在；不要求每一次最终错误必须为相同ID。P18/P19的原始报告与JSON不改、不覆盖。before-wrong-resume截图及before-reader-rows保留；重载前后严格区分hydrate前的null与实际已读入口。

另加一次透明存储诊断构建，Reader逻辑仍未改。before-storage-writes包含真实localStorage前后字符串：1793958777038毫秒写short-circuit；1793958789491毫秒在课程页URL下被旧Reader清理写为reverse-result。返回及独立reload仍reverse-result，直接补足P19未取得的原始持久化证据。诊断包装器只记录应用正常写入，最终已移除；不是模拟适配器。

Node确定性测试先于修复：真实Reader的挂载/保存/清理/锚点行为5项中4项失败。新增普通滚轮回归又发现首版scrollend先于UI帧的丢保存窗口，3项新失败与首版浏览器失败另存unit-scrollend-before、after-v1-reader-rows，不隐去。
