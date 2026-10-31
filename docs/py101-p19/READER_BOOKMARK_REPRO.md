# P18书签现象：P19有限只读回归（执行前方案）

范围仅本轮隔离生产候选的3009来源和正常UI产生的测试记录，绝不访问/写入/清除原用户3000来源数据，不修改Reader/learning-progress/use-learning-progress源码。读取P18报告与BROWSER_CHECKS后制定以下最多四组定向场景，不循环尝试直到绿色。

1. 3.3/r1的short-circuit：稳定锚点、可见保存入口确认后，完整文档导航离开/重开，再独立reload。
2. 3.3/r1同段：同一调用中点击锚点后尽快SPA返回课程/进入课时，记录实际时序，再reload。
3. 3.4/r1的order-matters：同样稳定完整导航与独立reload。
4. 3.4/r1同段：同样快速SPA往返与reload。

每次记录真实日期/浏览器时间、当前URL/hash、scrollY、目标段top、焦点、可见恢复href；如支持只读读取，限定已知两个测试scope的localStorage.getItem，记录原始序列/section/updatedAt，以区分已持久化与仅UI读数，不调用setItem/removeItem/clear。正常阅读引起的应用自身保存属于用户明确要求的测试状态，不是直接改写数据。其他旧scope用独立存储单测与只读摘要保护，不把当前测试书签变化说成所有旧用户数据丢失。

挂载前没有恢复入口、点击后只有hash/焦点先变、滚动未完成、450ms保存尚未发生、卸载前后记录与完整reload是不同阶段。稳定/快速结果分别判定；如错误section确已写入并在reload保留，提高受影响流程等级并暂停该流程通过声明；若仅暂态读数，仍保留未解决。不推断未经证实根因，不擅改用户源码。实际步骤/结果将在完成后追加，并保留初始方案。

四组执行后补充范围：P18 JSON还明确记录过锚点已稳定后使用SPA，而初定稳定组采用完整导航。为覆盖该原路径，追加且仅追加1条3.3稳定锚点→SPA离开→课程页就绪后返回→reload的对照；总上限5条，不因是否复现而继续扩大。

## 实测结果（UTC时间，原始行见READER_BOOKMARK_ROWS.json）

| 场景 | 稳定离开前恢复入口 | 返回即时/稳定入口 | 完整reload后 | 结论 |
| --- | --- | --- | --- | --- |
| S33：3.3稳定完整文档导航 | #short-circuit | #short-circuit | #short-circuit | 该稳定路径恢复成立 |
| R33：3.3点锚点后立即SPA往返 | 先前保存#short-circuit；新滚动尚未完成 | #short-circuit / #short-circuit | #short-circuit | 此次立即离开未复现错误，不代表问题已修 |
| S34：3.4稳定完整文档导航 | #order-matters | #order-matters | #order-matters | 该新r1稳定路径恢复成立 |
| R34：3.4点锚点后立即SPA往返 | 先前保存#order-matters；新滚动尚未完成 | #order-matters / #order-matters | #order-matters | 此次立即离开未复现错误，不泛化所有时序 |
| 追加P18原路径：3.3锚点稳定后SPA | #short-circuit | **#reverse-result / #reverse-result** | **#reverse-result** | **P1阻断，不能声明该恢复路径通过** |

关键复现：09:26:14.427，3.3 URL为#short-circuit，scrollY=7900，目标段top=175.948，焦点H2、可见恢复入口同为#short-circuit。09:26:14.522课程页已到达，初始scrollY=2429.333；09:26:24.810稳定为0。点击课程中3.3入口，09:26:24.932返回的URL无hash、scrollY=1465.333，但恢复入口已是#reverse-result。09:26:29.829页面稳定scrollY=0，入口仍错误；09:26:30.096完整reload后入口仍#reverse-result。该次与P18错误段相同。只复核一次该确切路径，不声称统计意义上的稳定复现率。

立即离开场景中，锚点点击后hash/H2焦点先变，目标段仍在几千像素之外；快速返回即时scrollY为1472.667或1520，随后回到0，恢复入口仍保持先前目标。因此即时滚动位置不等于保存书签，hash也不能替代恢复入口。正常导航回到标题区不是自动滚回书签，用户仍可点“回到上次位置”。

## 持久化证据边界与影响等级

浏览器只读page evaluation未暴露localStorage（getItem不可用），支持的raw CDP也不支持DOMStorage.getDOMStorageItems。没有转用隐藏脚本/配置/浏览器档案绕过，也没有setItem、removeItem或clear。原始序列化键值未取得，所以不称已核对其内部原始字符串/写入瞬间，更不能声称真实用户旧记录或所有课时数据丢失。

但错误入口在完整文档重载后仍存在，已超出单次过早读取或纯hash差异；这是**持久化恢复行为的P1阻断**，不能用S33/S34成功覆盖。已证实范围为隔离生产候选3.3/r1、锚点稳定后经SPA课程页返回的这一组合。3.4稳定文档导航成立，立即离开那次未复现；3.4稳定后SPA没有另加样本，不假定不受影响。旧2.4/r2、3.1/r1、3.2/r1完成标记在正常UI后续检查仍保留，其他旧字符串由独立存储单测覆盖；这不能替代对本恢复错误的修复。

根因未确认。源码可见450ms保存、requestAnimationFrame滚动跟踪及卸载flush，但没有直接观测这些内部回调的精确写入时刻，故只列候选调查范围，不把某个定时器、框架或浏览器当成已证实根因。原用户Reader/进度源码均未改，真实3000来源未触碰。

建议独立授权修复范围：Reader的SPA进入/离开、平滑滚动目标、active/latest与scope切换、延时保存和卸载flush之间的协调，配套新旧scope保留测试及同路径生产回归；保留原用户修改，不清存储、不扩大为课程重写。P19不执行该修复。

## 本轮门禁决定

暂停该受影响阅读器路径的通过声明。按用户要求不跳过真实阻断，3.4内容虽完成独立技术与候选页面检查，**正式Publication保留draft/private**，不提前标为pending-review/preview或声称P19全量验收成功。候选preview仅用于本轮交互测试，最终恢复同一private清单并复验404。修复Reader并重新通过门禁后，再另行决定3.4试读开放。P0–P18证据全部保留。
