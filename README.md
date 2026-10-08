# Prompt Motion Lab

**从用户需求，到提示词规划、动画与成片。**

[English](README.en.md) · [在线体验](https://nonggde.github.io/prompt-motion-lab/) · [获取 AI Skill](#让-ai-学会做视频) · [制作指南](docs/workflow.zh-CN.md)

一个中英双语的开源代码视频实验室。整合有出处的动效提示词、原创可播放示例，以及 AI 能实际执行的制作流程。不需要特定大模型，也不需要视频生成 API Key。

![FORM & FLOW 分镜预览](media/form-flow-storyboard.png)

## 已经可以做什么

- **513 条来源记录**：按主题、作者、技术和分类搜索，展开原文并复制，保留作者与原帖链接。
- **如实标记数据**：279 条上游标记为完整，234 条为部分提示词或原帖描述；按首尾去空白精确去重后为 459 条文本。不同作品可能使用同一句提示词。
- **2 个原创示例**：15 秒的 FORM & FLOW 动效作品，以及 20 秒、可调整容量与补充速度的令牌桶解释动画。
- **可复现的视频**：1920×1080、60fps、原创合成配乐，浏览器预览与导出共用时间驱动的画面代码。
- **AI 制作 Skill**：理解需求 → 制定简报 → 丰富提示词 → 分镜 → 样片 → 检查 → 导出 MP4 与源码。
- **中英双语**：界面一键切换，文档与创作模板提供两种语言。来源提示词保留作者原始语言。

## 先用起来

无需安装，打开 [在线实验室](https://nonggde.github.io/prompt-motion-lab/)。浏览器中可以播放、拖动时间线、打开声音、调整限流示例参数并下载成片。

本地启动需要 Node.js 20+：

```sh
git clone https://github.com/nonggde/prompt-motion-lab.git
cd prompt-motion-lab
npm ci
npm start
```

打开 `http://127.0.0.1:4173`。`npm run build` 生成 `dist/`，其中的 `index.html` 已嵌入字体、脚本与数据，可以离线打开；影片下载需要同目录下的 `media/`。

## 让 AI 学会做视频

向支持 Skills 的 AI 工具发送：

```text
请从 https://github.com/nonggde/prompt-motion-lab 安装 skills/prompt-to-video，
然后用这个技能，根据我的需求制定提示词与分镜，制作视频并交付 MP4、预览和源码。
```

或者使用支持 SKILL.md 的安装器：

```sh
npx skills add nonggde/prompt-motion-lab --skill prompt-to-video
```

也可以把 [skills/prompt-to-video](skills/prompt-to-video) 整个文件夹放到你的 AI 工具支持的技能目录。仓库中的 Skill 保留独立参考文件，单独安装后也能读取；制作时会在工作目录获取渲染工程。**安装 Skill 提供制作方法，实际生成仍需要你的 AI 工具能执行代码并写入文件。**

开始创作：

```text
用 prompt-to-video 为我的任务管理工具做一条 20 秒产品视频。
观众是独立开发者，重点是「快速捕获 → 自动归类 → 今日执行」。
16:9，中英双语字幕，奶油白背景，一个橘色强调色。
先给我分镜和短样片；完成检查后导出 1080p MP4 与源码。
```

```text
用 prompt-to-video 把这段口播做成 45 秒白板解释动画。
图形跟着讲解展开，保留准确的数据；配乐轻，不要盖住人声。
```

## 自己改动画与导出

```sh
npm test
npm run render -- --mode reel --stills-only
npm run render -- --mode reel
npm run render -- --mode bucket
npm run render -- --scene examples/custom-scene.cjs --output media/custom.mp4
npm run check:media
```

`npm ci` 会安装本地渲染和 FFmpeg 依赖，无须额外配置云服务。可以用 `FFMPEG_PATH` 指向已有的 FFmpeg。渲染先生成 16 帧分镜图，然后按时间逐帧导出影片；`--stills-only` 只生成分镜。示例不宣称无缝循环。

编辑 [src/engine.js](src/engine.js) 可修改内置示例；自定义场景实现 `render(ctx, t, config)`，参考 [examples/custom-scene.cjs](examples/custom-scene.cjs)。科普示例的正确性测试、像素确定性测试、浏览器交互测试和成片检查分别覆盖模型、画面、页面与导出。

## 制作方法与项目结构

[中文制作指南](docs/workflow.zh-CN.md) · [English guide](docs/workflow.en.md) · [风格方向 / Style directions](skills/prompt-to-video/references/style-directions.md) · [Skill](skills/prompt-to-video/SKILL.md)

```text
src/                    预览、时间驱动的动画、代码合成声音
data/videos.json        保留出处的上游提示词快照
media/                  本项目制作的 MP4 与分镜图
scripts/                本地服务、构建、渲染与检查
skills/prompt-to-video/  可供 AI 安装的制作技能
docs/                   中英双语方法与创作说明
```

## 来源、许可与贡献

提示词来源：[yihui-dev/awesome-opus5-5-videos](https://github.com/yihui-dev/awesome-opus5-5-videos)。方法参考：[xilo](https://x.com/xilo2991/status/2104912748794589515)、[huashu-art-motion](https://x.com/alchainhust/status/2107347834668224687)。这两个方向分别启发了结构化制作简报与按内容选择风格、检查镜头内部运动的方法。

本项目新写的工具、示例与 Skill 使用 [MIT](LICENSE)。上游数据与字体保留各自许可，详见 [来源与许可](THIRD_PARTY_NOTICES.md)。不打包原作者的视频和预览图片。

欢迎贡献有来源的提示词、能运行的场景和有证据的制作经验。添加案例时请附作者、原帖、完整性标记；添加风格时请附关键帧、实现方式与已知局限。项目目前的内置渲染路线是 Canvas 2D；Three.js、TTS 和参考片复刻由 Skill 按任务选择，需要相应工具，不表示已集成对应服务。
