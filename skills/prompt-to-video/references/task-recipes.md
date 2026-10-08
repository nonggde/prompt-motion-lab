# 按任务丰富提示词 / Task recipes

这些是 Prompt Motion Lab 自己维护的起始结构，不是固定模板。先替换事实和观众，再决定镜头、技术和声音。/ These are starting structures maintained by Prompt Motion Lab, not fixed templates. Replace facts and audience first, then decide shots, technology, and sound.

## Product launch / 产品发布

**中文**：在 [时长] 秒内向 [观众] 介绍 [真实产品或功能]，观众要记住 [核心价值]。0–3 秒展示真实问题；3–8 秒展示一次关键操作；8–[结束前 3 秒] 秒展示真实结果；最后留下产品名和已确认的行动入口。使用 [界面/工作台/空间] 作为视觉世界，每段只保留一个动作；点击、反馈和声音来自同一时间线。交付双语分镜、16:9 与 [可选竖屏] 版、实际截图或用户提供素材、MP4 和检查记录。

**English**: Introduce [real product or feature] to [audience] in [duration] seconds so they remember [core value]. Show the real problem in 0–3s, one key operation in 3–8s, the real outcome until the final three seconds, then the product name and a confirmed action path. Use [interface/workbench/space] as the visual world; give each beat one action and derive clicks, feedback, and sound from one timeline. Deliver a bilingual storyboard, 16:9 and optional vertical layout, actual screenshots or supplied assets, MP4, and an inspection record.

## Explainer / 科普解释

**中文**：解释 [概念]，先写一句不夸大的结论，再列出 [2–4] 个必须看懂的关系。开头用一个可见问题，随后让形状、标签或数值按因果顺序变化，结尾回到一句可复述的结论。所有示意画面标明是示意；参数、单位和不确定性写进分镜。优先 Canvas 2D 或 SVG；只有空间层级真的重要时才使用 Three.js。

**English**: Explain [concept]. Write one accurate, non-exaggerated takeaway and list [2–4] relationships the viewer must understand. Open with a visible question, change shapes, labels, or values in causal order, and resolve with a repeatable conclusion. Mark schematics as schematics and include parameters, units, and uncertainty in the storyboard. Prefer Canvas 2D or SVG; use Three.js only when spatial hierarchy matters.

## Data story / 数据叙事

**中文**：用 [数据集] 回答 [具体问题]。渲染前检查单位、时间范围、缺失值、比例尺和数据版本。0–5 秒给问题和单位；5–[结束前 6 秒] 秒按共享比例尺揭示主要变化；接着标记最多两个数据支持的观察；结尾说明限制和下一步。不要用截断坐标轴夸大差异，不把相关说成因果。长解释移到字幕或附录，关键数值必须留出阅读时间。

**English**: Use [dataset] to answer [specific question]. Before rendering, check units, date range, missing values, scale, and data version. State the question and units in 0–5s; reveal the main change on a shared scale until the final six seconds; mark no more than two supported observations; then state a limitation and next step. Do not exaggerate with a truncated axis or turn correlation into causation. Move long explanations into captions or notes and hold key values long enough to read.

## Algorithm / 算法与代码

**中文**：解释 [算法或请求流程]，把每个阶段映射成一种稳定形状，把状态变化映射成一种动作。先建立全局关系，再跟随一个事件，最后沿同一逻辑返回或收束。每个标签只保留一个术语；事件表、相机、声音和粒子位置共享同一时间线。避免无意义代码雨、过量标签和不受控物理模拟。

**English**: Explain [algorithm or request flow] by mapping each stage to a stable shape and each state change to one action. Establish the whole relationship, follow one event, then return or resolve along the same logic. Keep one term per label; share one timeline for the event table, camera, sound, and particle position. Avoid decorative code rain, excess labels, and uncontrolled physics.

## Kinetic type / 动态排版

**中文**：用 [三句以内] 的文字表达 [核心命题]。让文字本身成为通道、梁、网格或路径；先完整可读，再变形。限制颜色、字体层级和形变幅度，至少安排一个完全静止的阅读段。不要用装饰插画解释文字，也不要用随机粒子掩盖字形。

**English**: Express [core proposition] in [three or fewer sentences]. Let the words become a passage, beam, grid, or path; keep them fully readable before transforming them. Limit colors, type hierarchy, and deformation, and include at least one still reading hold. Do not add decorative illustrations to explain the words or hide glyphs with random particles.

## Interactive demo / 交互演示

**中文**：制作一个可在浏览器中操作的 [时长] 秒微体验，同时提供固定输入序列的自动演示。键盘和触摸共享规则；暂停、重置、静音和重播状态要清楚。交互版和视频版共用 render(t) 与颜色、动作、声音规则；自动演示不能依赖实时随机或网络。

**English**: Build a browser-playable [duration]-second micro-experience with an automated demo driven by a fixed input sequence. Keyboard and touch share the same rules; pause, reset, mute, and replay states must be clear. The interactive and video versions share render(t), colors, motion, and sound rules; the demo cannot depend on real-time randomness or network timing.
