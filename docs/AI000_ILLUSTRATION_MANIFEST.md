# AI000 十三课情境插画清单

2026-10-27。13/13已生成、优化并接入；当前为AI辅助视觉与事实自查。教师、中文教学编辑、目标学生试学尚未完成。

工具：内置 `image_gen.imagegen`，新图使用文本生图；1.1另用同一工具带原图编辑一次。没有CLI/API回退、网络素材或运行时模型调用。模型内部版本未由工具公开，未猜测型号。13张最终图合计973400字节（约950.6 KiB），每张1200×800 WebP；源图1536×1024 PNG保留于本机生成目录，不提交原图或失败候选。

先完成1.1/3.4/4.3/4.4四张代表图并实际检查桌面、手机阅读页，再生成其余九张；代表阶段记录见[样图浏览器记录](ai000-4-4/SAMPLE_BROWSER_RESULTS.json)。`PILOT_*`仅为这次样图阶段的历史文件名，发布状态从未设为pilot，不代表学生试学。

文件、编码、尺寸、非空白检查见[资源检查](ai000-4-4/IMAGE_CHECKS.json)；完整机器可读元数据和原图路径见[实际资源](ai000-4-4/ILLUSTRATION_ASSETS.json)、[生成及修改记录](ai000-4-4/GENERATION_RECORDS.json)。图片不能证明模型成绩或真实实验，关键知识仍在原正文和精确图。

|课时|section/区块索引（从0起）|实际资源|尺寸/体积|
|---|---|---|---|
|AI000-C01-L01|mail-task / 1|[WebP](../public/images/lessons/ai000/ai000-c01-l01-mail-sorting.webp)|1200×800 / 77642 B|
|AI000-C01-L02|mistakes / 1|[WebP](../public/images/lessons/ai000/ai000-c01-l02-mail-review.webp)|1200×800 / 55080 B|
|AI000-C01-L03|knowledge / 1|[WebP](../public/images/lessons/ai000/ai000-c01-l03-automation-diagnosis.webp)|1200×800 / 84354 B|
|AI000-C02-L01|deep-learning / 1|[WebP](../public/images/lessons/ai000/ai000-c02-l01-photo-recognition.webp)|1200×800 / 80210 B|
|AI000-C02-L02|generation / 1|[WebP](../public/images/lessons/ai000/ai000-c02-l02-poster-creation.webp)|1200×800 / 99960 B|
|AI000-C03-L01|parcel-examples / 2|[WebP](../public/images/lessons/ai000/ai000-c03-l01-photo-label-pairing.webp)|1200×800 / 79706 B|
|AI000-C03-L02|borrowing-records / 2|[WebP](../public/images/lessons/ai000/ai000-c03-l02-library-observation.webp)|1200×800 / 87468 B|
|AI000-C03-L03|hide-a-piece / 2|[WebP](../public/images/lessons/ai000/ai000-c03-l03-masked-document.webp)|1200×800 / 53436 B|
|AI000-C03-L04|delivery-problem / 2|[WebP](../public/images/lessons/ai000/ai000-c03-l04-delivery-robot.webp)|1200×800 / 72484 B|
|AI000-C04-L01|parcel-records / 1|[WebP](../public/images/lessons/ai000/ai000-c04-l01-parcel-registration.webp)|1200×800 / 72242 B|
|AI000-C04-L02|need-a-model / 2|[WebP](../public/images/lessons/ai000/ai000-c04-l02-queue-estimate.webp)|1200×800 / 62506 B|
|AI000-C04-L03|assign-roles / 1|[WebP](../public/images/lessons/ai000/ai000-c04-l03-records-reserved.webp)|1200×800 / 71280 B|
|AI000-C04-L04|new-arrival / 1|[WebP](../public/images/lessons/ai000/ai000-c04-l04-model-inference.webp)|1200×800 / 77032 B|

## AI000-C01-L01

位置：`mail-task`的区块1，对应[正文](../src/content/lessons/ai000/what-is-ai.ts)。

难点：面对混杂邮件，学生难想象分类任务与整理动作的联系。希望看见：不同来信聚在同一收件视图，操作者准备整理。看后问题：系统要处理什么对象？分类建议之后还要做什么？

alt：一个学生坐在整洁书桌旁查看邮件；屏幕上有封套形状和分组卡片，不显示文字。

图注：先给每封邮件一个类别建议，再决定怎样整理；画面中的屏幕只帮助想象收件情境。

AI自查：重修一次：移除原候选的白色连接箭头和强调光线，保留场景。屏幕只有封套与文件夹形状，不把整理动作当技术流程。 人物/手部、常用物体结构、透视及小屏主体已逐图看过，无明显变形、可读错字、标志或水印。风格在二维感与三维感之间存在强弱变化，已按正文连续浏览接受，仍待人工编辑定稿。

完整初始提示词：

```text
Use case: illustration-story. Asset type: an in-article contextual teaching illustration for Aivora, a beginner AI textbook, landscape 3:2. Modern editorial illustration, sophisticated restrained 2D/3D hybrid with soft matte surfaces and subtle depth, natural everyday objects and proportions, coherent indigo/navy and cyan accents with small amber warm highlights, gentle lighting, clean layered composition, one clear action. This is a concrete scene, not an infographic or marketing banner. No typography, letters, digits, labels, logos, watermarks, fake writing, UI gibberish, mathematical symbols, floating holograms, neural brains or circuit decoration. Screens and papers may use sparse plain geometric placeholders without glyphs. Essential action and objects readable when displayed about 300 pixels wide. Keep focal action within the central 75% of the image. A three-quarter close editorial view of a university student at a real desk, seeing a crowded inbox on a laptop. The screen shows a small stack of simple envelope silhouettes and two plain folders, absolutely no text or numerals. A few ordinary paper envelopes on the desk echo the electronic mail. The student is considering how to sort incoming mail, not celebrating an automated success. Clear relation between one new mail card and the awaiting folders. Modest study-room backdrop, natural seated pose, readable hands, warm desk lamp against calm indigo surroundings.
```

选定原图：`C:\Users\QYF\.codex\generated_images\01a17d65-c568-7932-af9d-4da1538332f9\exec-a9b4554d-99d9-44c4-9a3f-5823245f0d8d.png`。生产文件：`public/images/lessons/ai000/ai000-c01-l01-mail-sorting.webp`。工具返回时间/选定登记时间见JSON；不将登记时间冒充模型运行精确耗时。

修改原因：多出连接箭头与强调光线，改回单纯场景。候选不进生产资源。

```text
Edit the attached teaching illustration. Remove only the white curved arrow between the highlighted mail envelope and the two folders, and remove the three orange emphasis marks above that envelope. Leave the student, hands, laptop, envelopes, folders, room, composition, indigo/cyan/amber palette, lighting and style unchanged. The laptop should show plain mail and folder silhouettes without connecting arrows, text, numerals or labels. This is an everyday mail-sorting context, not a diagram.
```

## AI000-C01-L02

位置：`mistakes`的区块1，对应[正文](../src/content/lessons/ai000/capabilities-and-errors.ts)。

难点：误拦与漏掉的后果需要落实为人工核查动作。希望看见：工作人员把分类建议与独立材料逐项对照。看后问题：仅看系统建议够不够？还需拿什么核对？

alt：工作人员对照笔记材料核查电脑中的邮件卡片，建议区和待复核区分开，无文字。

图注：分类建议要与已知背景核对，再决定怎样处理邮件。

AI自查：卡片与屏幕相互核查的动作清楚；不凭图中颜色判断哪封真实误分，具体误判继续由原四封邮件图说明。 人物/手部、常用物体结构、透视及小屏主体已逐图看过，无明显变形、可读错字、标志或水印。风格在二维感与三维感之间存在强弱变化，已按正文连续浏览接受，仍待人工编辑定稿。

完整初始提示词：

```text
Use case: illustration-story. Asset type: an in-article contextual teaching illustration for Aivora, a beginner AI textbook, landscape 3:2. Modern editorial illustration, sophisticated restrained 2D/3D hybrid with soft matte surfaces and subtle depth, natural everyday objects and proportions, coherent indigo/navy and cyan accents with small amber warm highlights, gentle lighting, clean layered composition, one clear action. This is a concrete scene, not an infographic or marketing banner. No typography, letters, digits, labels, logos, watermarks, fake writing, UI gibberish, mathematical symbols, floating holograms, neural brains or circuit decoration. Screens and papers may use sparse plain geometric placeholders without glyphs. Essential action and objects readable when displayed about 300 pixels wide. Keep focal action within the central 75% of the image. A close over-shoulder view of a staff member carefully comparing a laptop's suggested mail sorting with a separate appointment card on the desk. One envelope-shaped card on the screen is isolated for review; the staff member pauses before moving it into a folder. Screen only has plain card silhouettes, not text or labels. The independent paper reference is clearly separate from the laptop. Focus on checking a suggestion rather than trusting a screen; no checkmarks, crosses, scores, rankings, real product UI or automatically verified answers. Soft daylight with navy, cyan and restrained amber.
```

选定原图：`C:\Users\QYF\.codex\generated_images\01a17d65-c568-7932-af9d-4da1538332f9\exec-3fb90a80-69e9-46b8-9287-f32c14c6a7d4.png`。生产文件：`public/images/lessons/ai000/ai000-c01-l02-mail-review.webp`。工具返回时间/选定登记时间见JSON；不将登记时间冒充模型运行精确耗时。

## AI000-C01-L03

位置：`knowledge`的区块1，对应[正文](../src/content/lessons/ai000/automation-and-ai.ts)。

难点：定时执行与利用现象排查外观上都自动，方法仍不同。希望看见：备份设备与打印机排查两个日常动作。看后问题：自动执行能否独自说明采用了什么方法？

alt：并置的两个工作角落：备份设备旁有无字钟面；另一处工作人员检查打印机与连接。

图注：定时复制与依据现象排查都能自动进行；判断方法还要看具体说明。

AI自查：定时备份的钟面/外置盘与打印机连接检查可区分；图本身不能证明自动运行或AI方法，图注要求回到正文判断。 人物/手部、常用物体结构、透视及小屏主体已逐图看过，无明显变形、可读错字、标志或水印。风格在二维感与三维感之间存在强弱变化，已按正文连续浏览接受，仍待人工编辑定稿。

完整初始提示词：

```text
Use case: illustration-story. Asset type: an in-article contextual teaching illustration for Aivora, a beginner AI textbook, landscape 3:2. Modern editorial illustration, sophisticated restrained 2D/3D hybrid with soft matte surfaces and subtle depth, natural everyday objects and proportions, coherent indigo/navy and cyan accents with small amber warm highlights, gentle lighting, clean layered composition, one clear action. This is a concrete scene, not an infographic or marketing banner. No typography, letters, digits, labels, logos, watermarks, fake writing, UI gibberish, mathematical symbols, floating holograms, neural brains or circuit decoration. Screens and papers may use sparse plain geometric placeholders without glyphs. Essential action and objects readable when displayed about 300 pixels wide. Keep focal action within the central 75% of the image. A unified editorial diptych within one continuous quiet campus workspace, without dividing frames or text. One side: a laptop and external backup drive beside a simple analogue clock with no numerals, illustrating a scheduled copy task. Other side: a staff member investigating an ordinary desktop printer, checking a cable and a plain test sheet. Two concrete different activities, not a binary 'AI versus non-AI' label. No gears, brain icons, diagram arrows, code or tiny UI. Keep printer, drive and actions clear, natural object proportions and gentle warm light.
```

选定原图：`C:\Users\QYF\.codex\generated_images\01a17d65-c568-7932-af9d-4da1538332f9\exec-f098a42a-6a7d-49be-87fe-e4b72e2184aa.png`。生产文件：`public/images/lessons/ai000/ai000-c01-l03-automation-diagnosis.webp`。工具返回时间/选定登记时间见JSON；不将登记时间冒充模型运行精确耗时。

## AI000-C02-L01

位置：`deep-learning`的区块1，对应[正文](../src/content/lessons/ai000/ai-ml-dl.ts)。

难点：图片任务相同并不能反推内部技术。希望看见：不同猫照片进入同一图片识别工作情境。看后问题：输入是图片，是否足以认定用了深度学习？

alt：桌面摆着不同角度的猫照片，电脑旁留有待核对照片，不画技术包含关系。

图注：同样是判断照片里有没有猫，内部方法仍要另查，不能只凭画面确定。

AI自查：不同照片角度及一张椅子干扰图可辨；猫照片只是输入情境，不画AI/ML/DL集合，未把照片任务直接等同深度学习。 人物/手部、常用物体结构、透视及小屏主体已逐图看过，无明显变形、可读错字、标志或水印。风格在二维感与三维感之间存在强弱变化，已按正文连续浏览接受，仍待人工编辑定稿。

完整初始提示词：

```text
Use case: illustration-story. Asset type: an in-article contextual teaching illustration for Aivora, a beginner AI textbook, landscape 3:2. Modern editorial illustration, sophisticated restrained 2D/3D hybrid with soft matte surfaces and subtle depth, natural everyday objects and proportions, coherent indigo/navy and cyan accents with small amber warm highlights, gentle lighting, clean layered composition, one clear action. This is a concrete scene, not an infographic or marketing banner. No typography, letters, digits, labels, logos, watermarks, fake writing, UI gibberish, mathematical symbols, floating holograms, neural brains or circuit decoration. Screens and papers may use sparse plain geometric placeholders without glyphs. Essential action and objects readable when displayed about 300 pixels wide. Keep focal action within the central 75% of the image. A tabletop editorial still life of several ordinary printed photographs of cats from different angles and one photograph of an empty chair, beside a modest laptop used for photo review. The screen shows only a selected cat image with a plain empty result area, no labels, confidence bars or numbers. A person's hand is placing a new photo beside the others. The scene establishes the concrete photo-recognition task only; do not draw neural networks, layers, nested sets, method taxonomies or imply a particular algorithm. Clean indigo desk, cyan edge accents, warm realistic cat fur and soft daylight.
```

选定原图：`C:\Users\QYF\.codex\generated_images\01a17d65-c568-7932-af9d-4da1538332f9\exec-4a4ccd1a-289c-40a3-b359-2e7a4fe3c03f.png`。生产文件：`public/images/lessons/ai000/ai000-c02-l01-photo-recognition.webp`。工具返回时间/选定登记时间见JSON；不将登记时间冒充模型运行精确耗时。

## AI000-C02-L02

位置：`generation`的区块1，对应[正文](../src/content/lessons/ai000/generative-ai-and-llm.ts)。

难点：查找现成海报与按描述组织新内容的过程容易混淆。希望看见：创作桌上有现成素材与正形成的新作品。看后问题：这次是找已有作品，还是组织新图像内容？

alt：读书会创作桌上摆着现成图片卡片，显示屏呈现新组织的猫与阅览室图像，无字海报。

图注：找到已有海报与按要求组织新图像是不同工作；用途与处理过程要分开看。

AI自查：现成素材与重新组织的无字作品可区分；生成概念和方法仍由正文及generation-map解释，不将此画面当软件操作或创作来源证明。 人物/手部、常用物体结构、透视及小屏主体已逐图看过，无明显变形、可读错字、标志或水印。风格在二维感与三维感之间存在强弱变化，已按正文连续浏览接受，仍待人工编辑定稿。

完整初始提示词：

```text
Use case: illustration-story. Asset type: an in-article contextual teaching illustration for Aivora, a beginner AI textbook, landscape 3:2. Modern editorial illustration, sophisticated restrained 2D/3D hybrid with soft matte surfaces and subtle depth, natural everyday objects and proportions, coherent indigo/navy and cyan accents with small amber warm highlights, gentle lighting, clean layered composition, one clear action. This is a concrete scene, not an infographic or marketing banner. No typography, letters, digits, labels, logos, watermarks, fake writing, UI gibberish, mathematical symbols, floating holograms, neural brains or circuit decoration. Screens and papers may use sparse plain geometric placeholders without glyphs. Essential action and objects readable when displayed about 300 pixels wide. Keep focal action within the central 75% of the image. An editorial illustration of a reading-club poster-making workspace. A person holds several existing small picture cards as reference material; a tablet on the desk shows a newly composed text-free illustration of a cozy reading room with a cat by the window. A blank drawing stylus rests nearby. Distinguish the existing cards from the new larger composition by physical placement, not labels or arrows. No visible poster typography, prompts, brand UI, magic particle effects, or claims of originality. An approachable creative scene with navy/cyan structure and warm window light.
```

选定原图：`C:\Users\QYF\.codex\generated_images\01a17d65-c568-7932-af9d-4da1538332f9\exec-41c62d08-3839-4c14-a1e2-63103d307ebc.png`。生产文件：`public/images/lessons/ai000/ai000-c02-l02-poster-creation.webp`。工具返回时间/选定登记时间见JSON；不将登记时间冒充模型运行精确耗时。

## AI000-C03-L01

位置：`parcel-examples`的区块2，对应[正文](../src/content/lessons/ai000/supervised-learning.ts)。

难点：照片与已确认类别逐条配对需要想象实际核实。希望看见：工作人员用实物检查照片，再放入包装类别资料夹。看后问题：类别由什么确认，为什么不能用模型猜测代替？

alt：工作人员将纸箱和文件袋照片与对应实物逐一核对，资料夹上无文字。

图注：照片要与核实过的包装类别对应；类别的来源需要能够回查。

AI自查：纸箱/文件袋与对应照片清楚，资料夹示意类别资料；无标签文字、成绩数字，不凭画面断言识别准确率。 人物/手部、常用物体结构、透视及小屏主体已逐图看过，无明显变形、可读错字、标志或水印。风格在二维感与三维感之间存在强弱变化，已按正文连续浏览接受，仍待人工编辑定稿。

完整初始提示词：

```text
Use case: illustration-story. Asset type: an in-article contextual teaching illustration for Aivora, a beginner AI textbook, landscape 3:2. Modern editorial illustration, sophisticated restrained 2D/3D hybrid with soft matte surfaces and subtle depth, natural everyday objects and proportions, coherent indigo/navy and cyan accents with small amber warm highlights, gentle lighting, clean layered composition, one clear action. This is a concrete scene, not an infographic or marketing banner. No typography, letters, digits, labels, logos, watermarks, fake writing, UI gibberish, mathematical symbols, floating holograms, neural brains or circuit decoration. Screens and papers may use sparse plain geometric placeholders without glyphs. Essential action and objects readable when displayed about 300 pixels wide. Keep focal action within the central 75% of the image. An editorial close view of a school mailroom workbench. A clerk compares printed photographs of cardboard boxes and flat paper document mailers with the matching real packages next to them. The clerk is placing one verified photo into an unlabelled physical reference folder. Show a small number of clear one-to-one physical matches, not an exact dataset or chart. Box and flat paper mailer silhouettes must be distinct and natural. No printed addresses, category words, barcodes, screens with accuracy scores, floating labels or diagrams. Warm practical workspace in indigo and cyan with kraft-paper amber.
```

选定原图：`C:\Users\QYF\.codex\generated_images\01a17d65-c568-7932-af9d-4da1538332f9\exec-c8961cff-2a61-4482-a639-ef5399acceca.png`。生产文件：`public/images/lessons/ai000/ai000-c03-l01-photo-label-pairing.webp`。工具返回时间/选定登记时间见JSON；不将登记时间冒充模型运行精确耗时。

## AI000-C03-L02

位置：`borrowing-records`的区块2，对应[正文](../src/content/lessons/ai000/unsupervised-learning.ts)。

难点：借阅构成不同不等于读者已被确认身份。希望看见：馆员观察匿名借阅资料及不同书籍展示。看后问题：仅凭这些记录，还不能确认哪些读者特征？

alt：图书馆桌上摆着匿名借阅卡和不同主题的书，馆员在观察资料；不画已确定人群。

图注：借阅资料提供观察线索，读者的长期兴趣和分组含义还要另查。

AI自查：匿名卡片、不同题材书与观察动作清楚；没有给人贴群体标签，未将书堆直接声称为聚类实验结果。 人物/手部、常用物体结构、透视及小屏主体已逐图看过，无明显变形、可读错字、标志或水印。风格在二维感与三维感之间存在强弱变化，已按正文连续浏览接受，仍待人工编辑定稿。

完整初始提示词：

```text
Use case: illustration-story. Asset type: an in-article contextual teaching illustration for Aivora, a beginner AI textbook, landscape 3:2. Modern editorial illustration, sophisticated restrained 2D/3D hybrid with soft matte surfaces and subtle depth, natural everyday objects and proportions, coherent indigo/navy and cyan accents with small amber warm highlights, gentle lighting, clean layered composition, one clear action. This is a concrete scene, not an infographic or marketing banner. No typography, letters, digits, labels, logos, watermarks, fake writing, UI gibberish, mathematical symbols, floating holograms, neural brains or circuit decoration. Screens and papers may use sparse plain geometric placeholders without glyphs. Essential action and objects readable when displayed about 300 pixels wide. Keep focal action within the central 75% of the image. A calm editorial library scene centered on a librarian's worktable with anonymous borrowing cards, small mixed stacks of science-themed and literature-themed books, and open shelving in the background. Covers use simple telescope/nature imagery or abstract storytelling illustrations, without words or symbols representing numerical counts. The librarian examines the existing records without sorting people into fixed groups. No portraits assigned to categories, demographic cues, group colors attached to people, exact charts or pre-labelled clusters. Slightly brighter warm daylight, indigo furniture and cyan details, same soft matte illustration family.
```

选定原图：`C:\Users\QYF\.codex\generated_images\01a17d65-c568-7932-af9d-4da1538332f9\exec-473f89c1-bc40-41dd-82e3-2a12a803acab.png`。生产文件：`public/images/lessons/ai000/ai000-c03-l02-library-observation.webp`。工具返回时间/选定登记时间见JSON；不将登记时间冒充模型运行精确耗时。

## AI000-C03-L03

位置：`hide-a-piece`的区块2，对应[正文](../src/content/lessons/ai000/self-supervised-learning.ts)。

难点：保留原文并遮盖一部分的实际动作需要直观支点。希望看见：一份完整材料与其被遮盖副本分开保留。看后问题：学习目标应该回到哪份材料取得？

alt：桌上保留完整资料，另一份相同版式资料的一小段被纸条遮住；纸面只用抽象行线。

图注：保留完整材料，再遮住副本的一小段；实际片段与目标由正文逐项说明。

AI自查：完整副本与局部遮盖副本并置；抽象行线代替文字，具体被遮目标只由原HTML图核实。 人物/手部、常用物体结构、透视及小屏主体已逐图看过，无明显变形、可读错字、标志或水印。风格在二维感与三维感之间存在强弱变化，已按正文连续浏览接受，仍待人工编辑定稿。

完整初始提示词：

```text
Use case: illustration-story. Asset type: an in-article contextual teaching illustration for Aivora, a beginner AI textbook, landscape 3:2. Modern editorial illustration, sophisticated restrained 2D/3D hybrid with soft matte surfaces and subtle depth, natural everyday objects and proportions, coherent indigo/navy and cyan accents with small amber warm highlights, gentle lighting, clean layered composition, one clear action. This is a concrete scene, not an infographic or marketing banner. No typography, letters, digits, labels, logos, watermarks, fake writing, UI gibberish, mathematical symbols, floating holograms, neural brains or circuit decoration. Screens and papers may use sparse plain geometric placeholders without glyphs. Essential action and objects readable when displayed about 300 pixels wide. Keep focal action within the central 75% of the image. A close top-down editorial illustration of two copies of the same short notice on a tidy study table. The original lies fully visible to one side, while a person's hand places a small opaque cyan paper strip over one short segment of the other copy. Represent the layout with sparse plain gray horizontal rules only, never pseudo-letters or words. Keep the original separate and available for checking what was covered. No model, arrows, labels, formulas, question marks or generated answer text. The teaching action is covering a part while preserving its source. Indigo tabletop, cream paper, soft warm light, natural hands.
```

选定原图：`C:\Users\QYF\.codex\generated_images\01a17d65-c568-7932-af9d-4da1538332f9\exec-0d8e2343-776b-4f68-baf0-1a6d69ddac40.png`。生产文件：`public/images/lessons/ai000/ai000-c03-l03-masked-document.webp`。工具返回时间/选定登记时间见JSON；不将登记时间冒充模型运行精确耗时。

## AI000-C03-L04

位置：`delivery-problem`的区块2，对应[正文](../src/content/lessons/ai000/reinforcement-learning.ts)。

难点：当前行动会改变后续可见情况，不能只想成分类输出。希望看见：小送物车停在走廊岔口，两条通道后景不同。看后问题：走过去后，位置与下一次选择会怎样变化？

alt：小型轮式送物机器人携带普通包裹停在学校走廊岔口，侧通道与一扇关闭的门清楚可见。

图注：走过岔口会改变位置和后面的选择；入口看得见的情况还不是整段结果。

AI自查：低矮送物车、关闭门和另一通道可辨；无奖励、最优路线箭头或成功标志，不作为真实强化学习记录。 人物/手部、常用物体结构、透视及小屏主体已逐图看过，无明显变形、可读错字、标志或水印。风格在二维感与三维感之间存在强弱变化，已按正文连续浏览接受，仍待人工编辑定稿。

完整初始提示词：

```text
Use case: illustration-story. Asset type: an in-article contextual teaching illustration for Aivora, a beginner AI textbook, landscape 3:2. Modern editorial illustration, sophisticated restrained 2D/3D hybrid with soft matte surfaces and subtle depth, natural everyday objects and proportions, coherent indigo/navy and cyan accents with small amber warm highlights, gentle lighting, clean layered composition, one clear action. This is a concrete scene, not an infographic or marketing banner. No typography, letters, digits, labels, logos, watermarks, fake writing, UI gibberish, mathematical symbols, floating holograms, neural brains or circuit decoration. Screens and papers may use sparse plain geometric placeholders without glyphs. Essential action and objects readable when displayed about 300 pixels wide. Keep focal action within the central 75% of the image. A grounded modern editorial illustration of a compact wheeled delivery cart carrying one plain package, paused at a fork in a quiet school corridor. Show two plausible corridors: one leads toward a visibly closed interior door with a side passage, the other bends toward a receiving area. The robot is an ordinary low cart with a small sensor, not a humanoid or expressive robot face. Eye-level three-quarter viewpoint, clearly readable fork, floor perspective and wheels correct. No route arrows, signs, route letters, rewards, numbers, trophies or indications of an optimal route. This establishes an action-choice situation only, not a completed real training experiment.
```

选定原图：`C:\Users\QYF\.codex\generated_images\01a17d65-c568-7932-af9d-4da1538332f9\exec-db0c25a9-aee0-4250-a2d2-3fa1a4c840dd.png`。生产文件：`public/images/lessons/ai000/ai000-c03-l04-delivery-robot.webp`。工具返回时间/选定登记时间见JSON；不将登记时间冒充模型运行精确耗时。

## AI000-C04-L01

位置：`parcel-records`的区块1，对应[正文](../src/content/lessons/ai000/data-features-labels.ts)。

难点：一行记录对应同一次到件处理需要现实支点。希望看见：工作人员登记包裹及到件时的可见情况。看后问题：此刻能记什么，哪些结果还没有发生？

alt：收发室登记台旁摆着不同大小包裹，工作人员记录到件信息；不显示完成时长。

图注：到件时可以登记尺寸和等待情况，最终处理时长还要等归架后确认。

AI自查：包裹与到件登记动作清楚；没有完成时长、扫描/视觉预测暗示，照片大小不作数值特征表。 人物/手部、常用物体结构、透视及小屏主体已逐图看过，无明显变形、可读错字、标志或水印。风格在二维感与三维感之间存在强弱变化，已按正文连续浏览接受，仍待人工编辑定稿。

完整初始提示词：

```text
Use case: illustration-story. Asset type: an in-article contextual teaching illustration for Aivora, a beginner AI textbook, landscape 3:2. Modern editorial illustration, sophisticated restrained 2D/3D hybrid with soft matte surfaces and subtle depth, natural everyday objects and proportions, coherent indigo/navy and cyan accents with small amber warm highlights, gentle lighting, clean layered composition, one clear action. This is a concrete scene, not an infographic or marketing banner. No typography, letters, digits, labels, logos, watermarks, fake writing, UI gibberish, mathematical symbols, floating holograms, neural brains or circuit decoration. Screens and papers may use sparse plain geometric placeholders without glyphs. Essential action and objects readable when displayed about 300 pixels wide. Keep focal action within the central 75% of the image. An editorial school mailroom scene showing a clerk registering a newly arrived plain parcel at a counter, with several different-sized packages on shelves and a small waiting area in the background. The clerk uses a simple blank-form clipboard with geometric empty rows only, not readable writing. Make the new parcel and the act of recording current visible information the focal point. No clocks showing exact time, completed-time labels, barcodes, addresses, prediction figures or chart overlays. Clean practical shelving, natural human proportions, indigo workwear, cyan accents, warm kraft cardboard.
```

选定原图：`C:\Users\QYF\.codex\generated_images\01a17d65-c568-7932-af9d-4da1538332f9\exec-6a760d6e-34bb-4825-b16c-3887a60447c5.png`。生产文件：`public/images/lessons/ai000/ai000-c04-l01-parcel-registration.webp`。工具返回时间/选定登记时间见JSON；不将登记时间冒充模型运行精确耗时。

## AI000-C04-L02

位置：`need-a-model`的区块2，对应[正文](../src/content/lessons/ai000/models-and-parameters.ts)。

难点：排队件数作为一个输入怎样对应生活情境。希望看见：工作人员看等待队列作估时准备，不增加其他输入暗示。看后问题：本例只用了哪项输入来估计？

alt：工作人员观察一排等待处理的相近尺寸包裹，旁边放着估时便签，画面无具体数字。

图注：先观察前面有几件在等，再按约定的关系估时；这个简化模型只采用排队件数。

AI自查：一排等待包裹和估时思考清楚；没有摄像识别、颜色输入或数值结果，明确本模型只采用排队件数。 人物/手部、常用物体结构、透视及小屏主体已逐图看过，无明显变形、可读错字、标志或水印。风格在二维感与三维感之间存在强弱变化，已按正文连续浏览接受，仍待人工编辑定稿。

完整初始提示词：

```text
Use case: illustration-story. Asset type: an in-article contextual teaching illustration for Aivora, a beginner AI textbook, landscape 3:2. Modern editorial illustration, sophisticated restrained 2D/3D hybrid with soft matte surfaces and subtle depth, natural everyday objects and proportions, coherent indigo/navy and cyan accents with small amber warm highlights, gentle lighting, clean layered composition, one clear action. This is a concrete scene, not an infographic or marketing banner. No typography, letters, digits, labels, logos, watermarks, fake writing, UI gibberish, mathematical symbols, floating holograms, neural brains or circuit decoration. Screens and papers may use sparse plain geometric placeholders without glyphs. Essential action and objects readable when displayed about 300 pixels wide. Keep focal action within the central 75% of the image. A focused side-view editorial illustration of a mailroom clerk looking along an orderly short queue of similar plain packages waiting for processing. One newly arrived package sits at the near end; the clerk considers the queue while holding an unmarked estimate card. Keep all packages visually similar so color, size and photographs are not presented as model inputs. No camera scanning, barcode reader, live sensors, formulas, counts, numerals, labelled dials or training machinery. Emphasize waiting count as one observable circumstance rather than a fully known actual duration. Subtle depth, navy and cyan workspace with warm cardboard.
```

选定原图：`C:\Users\QYF\.codex\generated_images\01a17d65-c568-7932-af9d-4da1538332f9\exec-39d97dfb-8322-488d-a184-1e29609abf13.png`。生产文件：`public/images/lessons/ai000/ai000-c04-l02-queue-estimate.webp`。工具返回时间/选定登记时间见JSON；不将登记时间冒充模型运行精确耗时。

## AI000-C04-L03

位置：`assign-roles`的区块1，对应[正文](../src/content/lessons/ai000/training-validation-test.ts)。

难点：用于开发的资料与先保留的资料需要形成空间直觉。希望看见：三个分开的记录工作位置，其中一份资料仍闭合保留。看后问题：哪些资料已经影响选择，哪些还应保留？

alt：桌面有打开的学习资料和比较用夹板，较远处留着闭合资料夹；不画文字标签和数据箭头。

图注：有的记录正用于学习或比较，有的先保留；关键在于是否影响过前面的决定。

AI自查：使用中的资料与闭合保留资料分开，双手未接触后者；无测试答案回流或候选排名。 人物/手部、常用物体结构、透视及小屏主体已逐图看过，无明显变形、可读错字、标志或水印。风格在二维感与三维感之间存在强弱变化，已按正文连续浏览接受，仍待人工编辑定稿。

完整初始提示词：

```text
Use case: illustration-story. Asset type: an in-article contextual teaching illustration for Aivora, a beginner AI textbook, landscape 3:2. Modern editorial illustration, sophisticated restrained 2D/3D hybrid with soft matte surfaces and subtle depth, natural everyday objects and proportions, coherent indigo/navy and cyan accents with small amber warm highlights, gentle lighting, clean layered composition, one clear action. This is a concrete scene, not an infographic or marketing banner. No typography, letters, digits, labels, logos, watermarks, fake writing, UI gibberish, mathematical symbols, floating holograms, neural brains or circuit decoration. Screens and papers may use sparse plain geometric placeholders without glyphs. Essential action and objects readable when displayed about 300 pixels wide. Keep focal action within the central 75% of the image. An oblique overhead editorial illustration of one orderly data-review worktable with three physically separated working areas. Nearest area: an open folder with a few plain record cards being worked on. Middle area: two small unlabelled candidate folders beside a comparison clipboard, still no text. Farthest area: a closed tied portfolio of reserved records, untouched by the person's hands. The closed portfolio must stay visibly separate; do not draw any paper passing from it to the other areas. No arrows, stage labels, numbers, mathematical charts or model diagrams. This is a concrete record-handling scene, while exact training/validation/test roles are taught in HTML. Same matte indigo/cyan/cream/amber editorial style.
```

选定原图：`C:\Users\QYF\.codex\generated_images\01a17d65-c568-7932-af9d-4da1538332f9\exec-3b8852db-d894-41f1-8ea2-ccb535aa4d9d.png`。生产文件：`public/images/lessons/ai000/ai000-c04-l03-records-reserved.webp`。工具返回时间/选定登记时间见JSON；不将登记时间冒充模型运行精确耗时。

## AI000-C04-L04

位置：`new-arrival`的区块1，对应[正文](../src/content/lessons/ai000/using-a-fixed-model.ts)。

难点：已有模型被用于一件新任务，与重新训练容易混淆。希望看见：新包裹、当前记录动作及屏幕估计区域分开。看后问题：此时系统得到的是预测，还是已发生的实际结果？

alt：新包裹摆在登记台，工作人员核对当前信息并查看屏幕中的估计卡片，卡片不含文字或数字。

图注：新包裹先提供当时可取得的信息，系统给出估计；实际时长仍要等处理结束后核对。

AI自查：新包裹、屏幕估计卡与未填实绩记录分开；无预测数字/确定性勾选/训练图，不冒充已知实际时长。 人物/手部、常用物体结构、透视及小屏主体已逐图看过，无明显变形、可读错字、标志或水印。风格在二维感与三维感之间存在强弱变化，已按正文连续浏览接受，仍待人工编辑定稿。

完整初始提示词：

```text
Use case: illustration-story. Asset type: an in-article contextual teaching illustration for Aivora, a beginner AI textbook, landscape 3:2. Modern editorial illustration, sophisticated restrained 2D/3D hybrid with soft matte surfaces and subtle depth, natural everyday objects and proportions, coherent indigo/navy and cyan accents with small amber warm highlights, gentle lighting, clean layered composition, one clear action. This is a concrete scene, not an infographic or marketing banner. No typography, letters, digits, labels, logos, watermarks, fake writing, UI gibberish, mathematical symbols, floating holograms, neural brains or circuit decoration. Screens and papers may use sparse plain geometric placeholders without glyphs. Essential action and objects readable when displayed about 300 pixels wide. Keep focal action within the central 75% of the image. A clear three-quarter editorial view of a newly arrived plain parcel on a school mailroom counter. A staff member checks the current queue behind the counter and looks at one simple estimate card on a modest monitor. The monitor shows a plain card and a small unnumbered clock pictogram only, absolutely no words, digits, progress bars, certainty checkmarks or training graphs. A separate blank space on the paper record remains awaiting later completion. No camera or barcode scanning implied as input. The focus is using a prepared estimating tool for this new task, not training it or declaring an actual completed duration. Natural objects and hands, calm navy/cyan surroundings with warm daylight.
```

选定原图：`C:\Users\QYF\.codex\generated_images\01a17d65-c568-7932-af9d-4da1538332f9\exec-3e1553cb-b132-4e9f-87ac-752f414e045f.png`。生产文件：`public/images/lessons/ai000/ai000-c04-l04-model-inference.webp`。工具返回时间/选定登记时间见JSON；不将登记时间冒充模型运行精确耗时。

## 交付限制与复用

本轮只对WebP等比例缩放与压缩，没有裁切或通过像素编辑修补画面。全部共用3:2构图；手机实际正文约300px仍能辨识主体，因此没有机械复制mobile版本。来源属于本轮生成素材，未引用外部图库；不是权属法律审查或唯一性证明。

后续课程沿用“逐课四问→先代表图→原图自查→真实阅读器→精确资源校验→旧全文反向差异→教师/学生验证”，可采用不同构图。当前插画规范仍为草案，不自动替代V1.0。
