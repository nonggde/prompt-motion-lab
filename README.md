# Prompt Motion Lab

**把一个想法变成可检查、可复现、可继续修改的代码视频。**

[English](README.en.md) · [在线实验室](https://nonggde.github.io/prompt-motion-lab/) · [安装 AI Skill](#让-ai-学会做视频) · [中文工作流](docs/workflow.zh-CN.md)

Prompt Motion Lab 是我们自己维护的中英双语代码视频实验室。它把需求理解、视觉方向、原创提示词、时间分镜、代码场景、音画同步和验收记录放在同一条可复现的工作线上。项目不要求某个特定模型，也不把网页模板冒充云端视频生成服务。

![FORM & FLOW 分镜预览](media/form-flow-storyboard.png)

## 现在可以做什么

- **原创双语配方**：配方按用途、视觉语言、难度和实验状态组织，数量会随实验自然增长，不用一个固定数字代表项目质量。
- **可运行场景**：FORM & FLOW、Token Bucket 和 PULSE / GRID 都由时间驱动画面；同一份场景代码可以预览、抽帧和导出。
- **AI 制作 Skill**：把自然语言需求整理成方向候选、双语提示词、带时间的分镜、代码计划、样片和检查证据。
- **实验回流**：每次实验记录输入、版本、渲染参数、观察结果和下一步，不把未验证的想法标成成品。
- **中英双语**：界面、配方、Skill、贡献规范和工作流均提供中文与英文。

## 快速开始

无需安装即可打开[在线实验室](https://nonggde.github.io/prompt-motion-lab/)。本地运行需要 Node.js 20+：

```sh
git clone https://github.com/nonggde/prompt-motion-lab.git
cd prompt-motion-lab
npm ci
npm start
```

浏览器访问 `http://127.0.0.1:4173`。`npm run build` 会生成可离线打开的 `dist/index.html`；导出的影片需要和 `media/` 一起保留。

## 让 AI 学会做视频

把 [skills/prompt-to-video/SKILL.md](skills/prompt-to-video/SKILL.md) 安装到支持 Skills 的 AI 工具中：

```text
请使用 prompt-to-video，根据我的目标、观众、素材和时长制定双语提示词与时间分镜。
先给出可执行的视觉方向，再制作代码样片，检查实际画面与视频元数据，最后交付源码、MP4、预览和实验记录。
```

也可以使用兼容安装器：

```sh
npx skills add nonggde/prompt-motion-lab --skill prompt-to-video
```

Skill 会根据用户授权选择工具和素材；它不会自动发布、联系他人、购买服务或声称某个模型已经验证过结果。只有真正渲染并检查过的作品才会进入 `validated` 状态。

## 渲染与检查

```sh
npm test
npm run render -- --mode reel --stills-only
npm run render -- --mode reel
npm run render -- --mode bucket
npm run render -- --scene examples/pulse-grid.cjs --output media/pulse-grid.mp4
npm run check:media
npm run build
```

自定义场景导出 `duration`、偶数尺寸的 `width`/`height` 和 `render(ctx, t, config)`。每帧只由时间与固定配置计算；需要声音时可额外导出 `audio(sampleRate)`。先检查分镜图，再渲染整片。当前渲染器支持 `--duration`、`--fps`、`--output` 和 `--stills-only`，完整说明见[渲染契约](skills/prompt-to-video/references/render-contract.md)。

## 项目结构

```text
src/                    预览、时间驱动动画、合成声音与 PULSE 场景
data/prompts.json       Prompt Motion Lab 自有双语配方
examples/               可独立渲染的场景入口
media/                  本项目制作的 MP4 与分镜图
scripts/                本地服务、构建、渲染与检查
skills/prompt-to-video/ 可供 AI 安装的制作 Skill
docs/                   中英双语工作流与实验记录规范
```

## 许可与贡献

代码、原创配方、原创场景和本项目制作的媒体使用 [MIT](LICENSE)。字体的独立许可见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

欢迎提交原创配方、可运行场景、分镜和实验记录。新内容请同时提供中文与英文，并说明实际运行命令、输出参数、观察结果和未解决限制。详见[贡献规范](CONTRIBUTING.md)。
