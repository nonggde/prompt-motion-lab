# 提示词规划 / Prompt playbook

这份手册把需求写成可以讨论、渲染和验收的原创双语提示词。/ This playbook turns a brief into an original bilingual prompt that can be discussed, rendered, and verified.

## 必填信息 / Required fields

| 字段 / Field | 要回答的问题 / Question |
| --- | --- |
| goal / 目标 | 观众看完后要理解、相信或行动什么？ / What should the viewer understand, believe, or do? |
| audience / 观众 | 谁会看，已有多少背景知识？ / Who is watching and what do they already know? |
| takeaway / 记忆点 | 观众最终只记住哪一句话？ / What single sentence should remain? |
| content / 内容 | 哪些事实、界面、数据或素材必须出现？ / Which facts, UI states, data, or assets must appear? |
| direction / 方向 | 画面、材质、镜头、声音和实现路线是什么？ / What are the visual, material, camera, sound, and implementation rules? |
| timeline / 时间线 | 每个镜头何时发生、改变什么？ / When does each shot happen and what changes? |
| acceptance / 验收 | 如何证明文字、叙事、输出和可复现性合格？ / How will readability, narrative, output, and repeatability be proven? |

## 可复用模板 / Reusable template

将方括号内容替换为真实信息，保留明确的约束和验收条件。/ Replace bracketed content with real information while keeping concrete constraints and acceptance checks.

    制作一支 [时长] 秒、[分辨率]、[fps]fps、[画幅] 的 [类型] 视频。
    目标观众是 [观众]；他们看完要记住：[一句话记忆点]。

    视觉世界：[空间/平面]、[材质]、[主色与强调色]、[字体和层级]。
    实现路线：[Canvas/SVG/Three.js/其他]。所有画面状态由 render(t) 与固定配置计算；随机效果使用固定种子。

    时间分镜：
    0–[a] 秒：出现 [信息]，动作是 [动作]，声音是 [声音]。
    [a]–[b] 秒：变化为 [信息]，镜头 [运动]，转场 [逻辑]。
    [b]–[c] 秒：展示 [结果]，保留 [阅读/停顿]。

    每个镜头只承担一个主要信息；文字放在安全区并给足阅读时间。
    不要使用 [不需要的风格、素材、品牌或误导性表达]。
    先输出双语简报、分镜和方向选择，再渲染关键帧与短样片。
    交付 [MP4/预览/源码/分镜/实验记录]，并检查 [尺寸/帧率/时长/音轨/解码/重复渲染]。

## Prompt quality / 提示词质量

- Use concrete verbs: enter, unfold, connect, pause, return, settle. Avoid mood-only adjectives such as “高级” or “酷”.
- 用具体动词：进入、展开、连接、停顿、返回、收束。不要只写“高级”“酷”等情绪形容词。
- Give each shot one information change and one visible internal action. A transition cannot replace a shot's meaning.
- 每个镜头只安排一个信息变化和一个可见的内部动作；转场不能代替镜头含义。
- Separate facts from visual metaphor. Label a schematic as a schematic and do not invent measurements, quotes, product behavior, or data.
- 区分事实和视觉隐喻。示意画面要标注为示意，不编造测量值、引文、产品行为或数据。
- Specify type size, contrast, safe area, order, and hold time whenever text carries meaning.
- 文字承担信息时，写清字体大小、对比度、安全区、阅读顺序和停留时间。
- Make audio events share the same timeline as visual events. State when speech is supplied, synthesized, or unavailable.
- 音频事件与画面事件使用同一条时间线；说明语音是用户提供、工具合成还是不可用。

## Production refinements / 制作细化

- Define the same subject at the start, key transformation and end. Compose the final state first and inspect key actions immediately before and after they happen, including the last output frame.
- 定义同一主体的初态、主要转变和终态。先确定终态布局，检查关键动作前后与最后一帧。
- Derive text holds from real word count and speech. Inspect Chinese glyph coverage and English line lengths independently. Vertical versions require a new layout, not a center crop.
- 阅读停留按真实字数和语音安排，分别检查中文字体覆盖与英文行长；竖屏版重新排版，不能直接居中裁切。
- For interactive demos, record timestamped inputs and replay them from a fixed initial state. Use suitable domain libraries when rules or physics already have maintained implementations.
- 交互演示记录带时间戳的输入，从固定初态重放；领域规则和物理已有成熟实现时使用合适库。
- Choose 24, 30 or 60fps for the subject instead of treating one frame rate as universal. An intentional hold is not a failed repeated frame.
- 根据内容选择 24、30 或 60fps；有意的定格不属于错误重复帧。

## Library access / 配方库读取

Fetch `https://nonggde.github.io/prompt-motion-lab/data/prompts.json` or read `data/prompts.json` in the renderer checkout. Match title, brief, category and technology; adapt one coherent direction rather than combining every effect. Copy the matching language's prompt together with its audio and checks. The site adds shared rendering, decode and delivery requirements when copying a full recipe.

读取 `https://nonggde.github.io/prompt-motion-lab/data/prompts.json` 或工程中的 `data/prompts.json`。按标题、简报、分类与技术选择，保持一个连贯方向。使用对应语言的正文、声音和检查项；网页复制完整配方时会补入共用渲染、解码和交付要求。

Entries marked `recipe` have complete briefs but no claimed rendered result. Make a separate experiment record for actual outputs and inspections.

`recipe` 表示完整简报，不代表已渲染结果。实际输出与检查另建实验记录。

## Negative rules / 负面规则

Use only the exclusions that protect this film: no invented UI, no third-party logos, no unlicensed assets, no unseeded randomness, no unexplained code rain, no unreadable microtype, no generic fade when a content-led transition is required, and no claim of a rendered video before inspecting the file.

只写能保护本片的限制：不编造界面、不放第三方 Logo、不用未授权素材、不用未固定随机、不使用无意义代码雨、不放看不清的小字、需要内容转场时不使用默认淡入淡出，也不在检查文件前声称已经完成成片。

## Status / 状态

Store each prompt with a status and a short evidence note:

为每条提示词保存状态和简短证据：

- draft / 草稿：方向和时间线仍可变。/ Direction and timing may change.
- rendered / 已渲染：有分镜或 MP4 文件。/ A storyboard or MP4 exists.
- inspected / 已检查：实际画面和关键切换已看过，问题已记录。/ Actual frames and key transitions were inspected and issues recorded.
- validated / 已验证：元数据、解码、叙事和重复渲染检查通过。/ Metadata, decoding, narrative, and repeat-render checks passed.
- blocked / 受阻：缺少必要事实、素材、工具或授权。/ A required fact, asset, tool, or authorization is missing.
