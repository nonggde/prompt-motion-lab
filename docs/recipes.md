# 原创配方规范 / Original recipe contract

配方库是可以继续实验的创作起点。`status: "recipe"` 表示完整简报，不代表已经渲染、被某个模型验证或保证达到某种效果。

The library contains starting points for further experiments. `status: "recipe"` means a complete brief, not an already rendered film, a model benchmark or a quality guarantee.

## 选择与获取 / Select and fetch

按主题、分类和实现技术组合筛选。多词查询必须同时匹配，中文和英文都能搜索。混合技术配方可在每种声明技术下找到；旧配方没有明确技术时按分类提供默认路线。页面复制的完整配方包含正文、声音计划、验收和交付；整个库可以下载为 JSON。

Combine topics, category and implementation filters. Multiword queries match all terms, in either language. Hybrid recipes appear under each declared technology; older entries without explicit tags use a default route based on category. Copying a full recipe includes its brief, audio, acceptance checks and deliverables; download the entire library as JSON.

- 在线数据 / Live data: [data/prompts.json](https://nonggde.github.io/prompt-motion-lab/data/prompts.json)
- 仓库数据 / Repository data: [data/prompts.json](../data/prompts.json)
- 共用复制规则 / Shared copy contract: [src/catalog.js](../src/catalog.js)

## 字段 / Fields

| Field | 中文 | English |
| --- | --- | --- |
| `id` | 不变的唯一标识 | Stable unique identifier |
| `author` | 项目原创作者归属 | Project authorship |
| `category` | `motion` / `explainer` / `3d` / `interactive` | Same four category IDs |
| `title_zh`, `title_en` | 中英标题 | Chinese and English titles |
| `prompt_zh`, `prompt_en` | 中英制作简报 | Bilingual production briefs |
| `tech_tags` | 技术与题材标签 | Implementation and topic tags |
| `prompt_partial` | 完整配方固定为 `false` | `false` for complete recipes |
| `status` | 配方库固定为 `recipe` | `recipe` in the library |
| `recipe.render` | 确定性渲染约束 | Deterministic rendering rule |
| `recipe.audio_zh`, `recipe.audio_en` | 双语声音方案 | Bilingual sound plan |
| `recipe.checks_zh`, `recipe.checks_en` | 题材专属检查 | Topic-specific acceptance checks |
| `recipe.deliverables` | 关键帧、源码、MP4 | Keyframes, source, MP4 |

旧配方没有细分检查字段时，复制合同补入通用检查。`recipe.audio` 保留为英文兼容字段。实际制作的版本、工具、参数与结果另写进[实验记录](../skills/prompt-to-video/references/experiment-log.md)，不改变原配方的状态来冒充实测。

Older recipes without topic-specific fields receive shared acceptance checks in the copy contract. `recipe.audio` remains an English compatibility field. Put production versions, tools, settings and results in an [experiment record](../skills/prompt-to-video/references/experiment-log.md); do not turn the original recipe's status into an unsupported test claim.

## 质量门槛 / Quality gates

- 定义同一个可辨认主体的初态、转变与终态；先检查终态布局，再加入动作。 / Define a recognizable subject's start, transformation and end; inspect the final layout before adding motion.
- 用具体速度、路径、停顿和构图表达情绪。 / Express mood through speed, path, holds and composition.
- 阅读时间按真实字数和语音估算；中文与英文独立检查字宽、行数和字体覆盖。 / Estimate holds from actual text and speech; inspect glyph coverage, line count and width separately in each language.
- 在关键动作前后与最后一帧检查，帧率按题材选择。 / Inspect both sides of key actions and the final frame; choose fps for the content.
- 数据使用固定快照、单位和共享轴域，图解声明简化边界。 / Use fixed datasets, units and shared axes; state schematic limits.
- 交互自动演示用时间戳操作重播，不能依赖真实鼠标或网络时序。 / Replay interactive demos from timestamped events, independent of live cursor or network timing.
- 声音与画面共享事件表，提供静音版本；竖屏必须重新排版。 / Share audio/visual cues, include a silent version and reflow vertical layouts.

使用时可按用户需求改时长、配色、素材和技术，但要重新检查变更影响。领域规则优先使用成熟库，素材要自有或许可清楚。当前渲染器内置 Canvas 导出，DOM / SVG / Three.js 配方需要对应的浏览器渲染路线。

Adapt duration, palette, assets and stack to the user's brief and recheck affected behavior. Prefer established libraries for domain rules and use owned or cleared assets. The shipped exporter targets Canvas; DOM / SVG / Three.js recipes need their respective browser-rendering route.
