# 视觉方向 / Style directions

选择视觉语言时先看内容和验收目标，再写颜色、材质、镜头与实现路线。风格名只是索引；每次使用都要写成可执行规则。/ Choose a visual language from the content and acceptance goal, then specify color, material, camera, and implementation. A style name is only an index; every use must become executable rules.

| 方向 / Direction | 适合 / Fits | 执行规则 / Rules | 风险 / Risks |
| --- | --- | --- | --- |
| 几何科普 / Geometric explainer | 算法、数学、系统 / algorithms, math, systems | 稳定几何、直接标注、共享比例尺、状态驱动动作 / stable geometry, direct labels, shared scales, state-driven motion | 示意图被误读为真实模拟 / schematic mistaken for physical simulation |
| 产品界面 / Product UI | 功能演示、教程 / features, tutorials | 真实界面状态、明确指针、点击先于反馈、匹配转场 / real UI states, visible pointer, click before feedback, match transitions | 虚构界面或功能 / invented UI or behavior |
| 编辑式叙事 / Editorial | 文章、观点、事件 / articles, arguments, events | 证据卡片、局部高亮、时间线、留白、慢切换 / evidence cards, focused highlights, timeline, breathing room | 字幕抢过证据 / captions overpower evidence |
| 数据叙事 / Data story | 指标、实验、调查 / metrics, experiments, surveys | 数据决定位置和速度，共享坐标，显示单位和范围 / data controls position and speed, shared axes, visible units and ranges | 轴域或因果关系误导 / misleading domain or causality |
| 动态字体 / Kinetic type | 开场、品牌句、短宣言 / openers, brand lines, short declarations | 少词大字、遮罩、字形匹配、静止阅读段 / few words, strong type, masks, matched glyph motion, still holds | 变形导致不可读 / deformation reduces readability |
| 纸艺叙事 / Paper story | 人物、文化、情绪 / people, culture, mood | 纸层、受控视差、物体互动、有限色彩 / paper layers, restrained parallax, object interaction, limited palette | 纸层只做装饰 / layers become decoration |
| 程序网格 / Procedural grid | 交互、状态、节奏 / interaction, state, rhythm | 固定种子、网格状态、参数可见、动作有因果 / seeded field, grid states, visible parameters, causal motion | 随机纹理盖住信息 / texture hides information |
| 空间产品 / Product space | 物件、材质、尺度 / objects, material, scale | 基础几何、连续相机、少量材质、功能特写 / primitive geometry, continuous camera, few materials, functional close-ups | 光照或细节抢走功能 / lighting or detail obscures function |

## 写清风格 / Make it actionable

每个方向至少写出：颜色数量和对比、字体与层级、平面或空间、材质来源、镜头运动、对象的内部动作、声音事件、停顿时长和实现路线。/ Specify at least color count and contrast, type hierarchy, flatness or depth, material source, camera movement, in-shot object motion, sound events, hold durations, and implementation route.

不要只写“电影感”“高级”或某个品牌名。把它们拆成可检查的规则，例如“炭黑底、奶油文字、橙色信号点；镜头只沿一条水平轨道移动；每个术语停留两秒”。/ Do not write only “cinematic,” “premium,” or a brand name. Turn the idea into checks such as “charcoal background, cream type, orange signal point; camera moves on one horizontal rail; each term holds for two seconds.”

## 本项目的内置方向 / Built-in directions

- **FORM & FLOW**：动态字体、二维投影点群、炭黑/奶油白/橙色和四段时间线；点群是可解释的视觉结构，不是流体物理模拟。/ Kinetic type, projected point geometry, charcoal/cream/orange, and four timed beats; the points are an explanatory visual structure, not a fluid simulation.
- **Token Bucket**：透明容器、固定请求事件、连续补充和精确消耗；请求流是演示数据，参数决定画面变化。/ Transparent container, fixed request events, continuous refill, and exact consumption; traffic is demonstration data and parameters drive the visual change.
- **PULSE / GRID**：24 格、12 秒、确定性脉冲状态；适合测试节拍、网格与音画事件共享。/ A deterministic 24-cell, 12-second pulse state; useful for testing rhythm, grids, and shared audio-visual events.
