---
name: prompt-to-video
description: "Plan and produce original, code-rendered videos from a user brief. Create bilingual prompts, a timed storyboard, a reproducible scene, inspected samples and an MP4. 用于按用户需求规划原创双语提示词、分镜并制作可检查的代码动画视频。"
---

# Prompt to video / 从需求到成片

Produce a film that communicates the user's idea together with an editable preview, reproducible source and a concise experiment record. Follow the user's language, tools, assets, scope and existing authorization. This skill does not grant permission to publish, contact others, spend money or change global configuration.

制作能表达用户想法的视频，同时交付可编辑预览、可复现源码和简短实验记录。遵循用户的语言、工具、素材、范围和已有授权。本技能不额外授权发布、联系他人、付费或修改全局配置。

## Brief and direction / 需求与方向

1. Extract objective, audience, factual content, inputs, duration, aspect ratio, language, assets and audio needs. Ask only for decisions that materially affect the result; choose and record reasonable defaults when the user delegates them.
2. Read [prompt-playbook.md](references/prompt-playbook.md), [style-directions.md](references/style-directions.md) and the relevant [task recipe](references/task-recipes.md). Build a Prompt Motion Lab recipe with intent, visual grammar, renderer, timeline, motion rules, audio plan, quality gates and experiment notes.
3. Use the project's original bilingual recipes as starting points. Do not copy third-party prompts, code, designs or media. Use external material only when the user supplies it and its rights are clear.
4. Save a concise brief and shot list in the task workspace. Each shot has start/end, framing, on-screen content, visual action, transition, captions and sound. Narration sets timing when provided; do not force every topic into rapid cuts or a fixed BPM.

1. 提取目标、观众、事实内容、输入、时长、画幅、语言、素材与声音需求。只问实质影响结果的选择；用户授权自主决定时记录合理默认值。
2. 阅读 [prompt-playbook.md](references/prompt-playbook.md)、[style-directions.md](references/style-directions.md) 和相关 [task recipe](references/task-recipes.md)。建立 Prompt Motion Lab 自有配方，记录目标、视觉语法、渲染路线、时间线、运动规则、声音计划、质量门槛和实验记录。
3. 使用项目自己的双语配方作为起点。不复制第三方提示词、代码、设计或媒体；外部素材只有在用户提供且许可清楚时使用。
4. 在工作目录保存简报和分镜表。每镜包含起止时间、景别、画面、动作、转场、字幕和声音；提供口播时按真实语音定时间，不把所有主题强制套进快切或固定 BPM。

Use [experiment-log.md](references/experiment-log.md) to record the chosen direction, render settings, observations, failures and next steps. A recipe can move from \`draft\` to \`rendered\`, \`inspected\` and \`validated\` only when the matching evidence exists; use \`blocked\` when a required dependency or input is unavailable.

使用 [experiment-log.md](references/experiment-log.md) 记录选择的方向、渲染参数、观察、失败尝试和下一步。只有具备对应证据时，配方才能从 \`draft\` 变为 \`rendered\`、\`inspected\`、\`validated\`；缺少必要依赖或输入时使用 \`blocked\`。

## Build and inspect / 制作与检查

Use the user's project if suitable. Otherwise obtain the runnable renderer from `https://github.com/nonggde/prompt-motion-lab` in the task workspace and read [render-contract.md](references/render-contract.md). Choose the simplest suitable route: Canvas for diagrams and typography, SVG/DOM for interfaces, Three.js for spatial scenes, or an existing video framework for longer work.

优先使用用户已有工程；否则在工作目录获取 `https://github.com/nonggde/prompt-motion-lab` 的渲染工程并阅读 [render-contract.md](references/render-contract.md)。按内容选择最简单可控的路线：Canvas 适合图解和字体，SVG/DOM 适合界面，Three.js 适合空间场景，长片使用现成视频框架。

Keep each frame a function of `render(t, config)`. Seed randomness, replay stateful simulations from a fixed initial state, load fonts and media before capture, and use one timeline for visuals and audio. Rendering must not depend on playback history, network arrival, `Date.now()` or unseeded randomness.

每帧必须是 `render(t, config)` 的函数。随机固定种子，从固定初态重放有状态模拟，捕获前等待字体和素材，音画共用一条时间线。渲染不能依赖播放历史、网络到达、`Date.now()` 或无种子随机。

Render keyframes and a short sample before the full film. Inspect readable type, overlaps, focal hierarchy, silhouette, in-shot motion, transition continuity, phone-sized layout, important semantics, black frames, NaN values, repeated frames and audio peaks. Repair observed weaknesses and record the time, hypothesis, change and rerender result.

全片前先出关键帧和短样片。检查文字可读性、遮挡、主次、主体轮廓、镜头内部动作、转场连续性、手机尺寸、重要语义、黑帧、NaN、重复帧和音频峰值。修复实际问题并记录时间点、假设、改动和重渲结果。

For narration, use available TTS or supplied speech; do not replace missing narration with music. Use code-generated music when it suits the brief, keep speech clear and peaks below clipping, and maintain an asset and rights ledger for non-original material.

配音使用可用 TTS 或用户音轨，不能用音乐冒充配音。适合主题时可使用代码合成音乐，保证语音清楚且峰值不削波；非原创素材维护资产和许可清单。

## Delivery / 交付

Verify encoded dimensions, frame rate, duration, expected audio and successful decoding. Deliver MP4, preview, source, bilingual recipe, timeline, keyframes and test evidence. A render command or HTML alone is not a completed video request. Publish only when the user has authorized publication.

检查编码尺寸、帧率、时长、预期音轨和完整解码。交付 MP4、预览、源码、双语配方、时间线、关键帧和检查证据。只有渲染命令或 HTML 不等于完成视频需求。发布需在用户授权范围内。
