# 提示词规划 / Prompt playbook

## 把愿望变成可制作的要求 / From aspiration to direction

“做一条惊艳视频”能探索创意，难以稳定表达一个真实产品。先确定用户想让观众理解、感受或采取的动作，再写画面。标签的作用是组织信息，XML 或 Markdown 都可以；没有证据支持某种语法必然优于另一种。

“Make an amazing film” can explore creativity but does little to communicate a real product consistently. Start with what the viewer should understand, feel or do. XML and Markdown both organize a brief; syntax alone is not evidence of better results.

| 块 / Block | 写什么 / Specify | 避免 / Avoid |
|---|---|---|
| role | 实际职责：动效导演、科普作者 / motion director, explainer author | 只有夸张头衔 / grand titles without decisions |
| inputs | 真实内容、受众、时长、画幅、语言、素材 / real content, audience, duration, aspect, language, assets | 编造产品功能、数据 / invented features or data |
| direction | 主视觉概念、配色、字体系、参考保留点 / visual idea, palette, type, reference principles | 堆叠所有效果 / every effect at once |
| structure | 起止时间、画面动作、转场、字幕、声音 / timed shots, action, transition, captions, audio | 只有文案，没有动作 / copy without visual action |
| build | 渲染接口、路线、素材与声音实现 / rendering contract, tools, assets, audio | 必须使用无用依赖 / mandatory irrelevant dependencies |
| verify | 静帧、过渡、事实、时长、解码 / images, transitions, facts, duration, decode | 仅自评“8 分” / self-assigned quality scores |
| deliver | MP4、预览、源码、简报、署名 / MP4, preview, source, brief, credits | 把计划当成片 / a plan presented as a film |

## 有用的变化 / Useful refinements

- 过于泛化：用“一张纸上的城市逐步展开”替换“高级、炫酷”。/ Replace “premium and cool” with a concrete idea, such as “a city unfolds across one sheet of paper.”
- 镜头像幻灯片：指定画面内部动作，如指针移动、路径生长、角色回应、真实数据变化。静止留白也可服务叙事，不为动而动。/ Specify meaningful in-shot action: a moving pointer, growing route, character response or data change. Intentional holds can serve a story.
- 文案拥挤：分离标题与字幕时机，缩短屏幕文案，检查实际边界。/ Separate headline and caption timing, shorten on-screen text and inspect bounds.
- 风格混杂：统一字体、色彩、镜头语言，风格切换由叙事触发。/ Share type, palette and camera language; let story motivate style changes.
- 无法复现：要求 `render(t)` / `seek(t)`，给随机数固定种子，消除跨帧副作用。/ Require `render(t)` / `seek(t)`, seed randomness and remove frame-history dependence.

## 中文模板 / Chinese brief

```xml
<role>你是动效导演，负责从简报到检查后的成片与源码。</role>
<inputs>主题：[主题]；观众：[观众]；目标：[目标]；时长：[时长]；画幅：[画幅]；语言：[语言]；真实内容与素材：[链接或文件]。非关键缺项可自主决定并记录。</inputs>
<direction>核心视觉概念：[一句话]。字体与配色：[选择]。保留：[参考的哪些特征]。避免：[具体不适合本项目的效果]。</direction>
<structure>先写逐镜头时间表，包含画面动作、字幕、转场和声音。优先做能验证主要风格与动作的小样。</structure>
<build>按内容选择实现路线。每帧按时间与配置重现；随机种子固定；音画共用时间线。素材加载完再截图。</build>
<verify>检查关键帧与切镜前后、字的可读性、数据准确性、音效时间、编码时长和播放。修复实际发现的问题。</verify>
<deliver>MP4、可交互预览、源码、简报、素材署名与检查结果。付费或缺少工具时说明具体缺口。</deliver>
```

## English brief

```xml
<role>You are the motion director, responsible for an inspected film and reproducible source.</role>
<inputs>Topic: [topic]; audience: [audience]; objective: [objective]; duration: [duration]; aspect: [aspect]; language: [language]; real content and assets: [links/files]. Choose and record reasonable noncritical defaults.</inputs>
<direction>Central visual idea: [one sentence]. Type and palette: [choices]. Preserve: [reference principles]. Avoid: [effects unsuitable for this project].</direction>
<structure>Write timed shots with visual action, captions, transition and sound. First make a sample that tests the principal style and motion.</structure>
<build>Choose tools to match the content. Reproduce frames from time and fixed config, seed randomness, share an audio/visual timeline and await asset loading.</build>
<verify>Inspect keyframes and both sides of cuts, readable type, accurate data, sound timing, output duration and playback. Repair observed issues.</verify>
<deliver>MP4, interactive preview, source, brief, credits and check results. Identify missing tools or paid-service needs explicitly.</deliver>
```

## 案例库的用法 / Using the archive

检索 `data/videos.json` 的 `prompt`、`author`、`category`、`tech_tags`。`prompt_partial` 为 true 的记录是部分提示词或原帖描述，不能称为完整提示词。按精确文本去重只排除完全相同文本，不代表语义去重。`tech_tags` 来自上游的复刻实现，不能据此断言原作者使用了同样路线。

Search `prompt`, `author`, `category` and `tech_tags` in `data/videos.json`. A true `prompt_partial` means partial instructions or a post description, not a complete prompt. Exact-text deduplication is not semantic deduplication. Upstream technology tags describe remakes and do not prove what the original creator used.
