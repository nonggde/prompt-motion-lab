# Prompt Motion Lab

**From a user’s needs to a creative brief, prompts, animation and a finished film.**

[中文](README.md) · [Live studio](https://nonggde.github.io/prompt-motion-lab/) · [AI skill](#give-your-ai-the-workflow) · [Production guide](docs/workflow.en.md)

A bilingual, open-source playground for code-rendered video. It combines attributed motion prompts, original playable examples and a production workflow an AI agent can execute. No particular model or video-generation API key is required.

![FORM & FLOW storyboard](media/form-flow-storyboard.png)

## What works today

- **513 source records**: search topics, creators, techniques and categories; expand and copy original text with attribution intact.
- **Honest labels**: 279 records marked complete upstream, 234 partial prompts or post descriptions; 459 distinct texts after trimming outer whitespace and exact deduplication. Several works share the same prompt.
- **Two original examples**: a 15-second FORM & FLOW reel and a 20-second token bucket explainer with adjustable capacity and refill rate.
- **Reproducible output**: 1920×1080, 60fps, original synthesized scores; preview and export use the same time-driven drawing code.
- **An AI production skill**: understand needs → write a brief → develop prompts → storyboard → sample → inspect → deliver MP4 and source.
- **Chinese and English**: switch the interface language; docs and creative templates cover both. Quoted prompts retain their creators’ original language.

## Try it

Open the [live studio](https://nonggde.github.io/prompt-motion-lab/) to play, seek, enable sound, explore the limiter and download the example films.

For local use, install Node.js 20+:

```sh
git clone https://github.com/nonggde/prompt-motion-lab.git
cd prompt-motion-lab
npm ci
npm start
```

Open `http://127.0.0.1:4173`. `npm run build` creates `dist/`; its `index.html` embeds the scripts, fonts and dataset and can be opened offline. Keep `media/` alongside it for video downloads.

## Give your AI the workflow

Tell your skills-enabled AI tool:

```text
Install skills/prompt-to-video from https://github.com/nonggde/prompt-motion-lab.
Use it to turn my needs into prompts and a storyboard, produce the video,
and deliver an MP4, interactive preview and source.
```

Or use a SKILL.md-compatible installer:

```sh
npx skills add nonggde/prompt-motion-lab --skill prompt-to-video
```

You can also place the complete [skills/prompt-to-video](skills/prompt-to-video) folder in the skill directory supported by your AI tool. Its reference files are self-contained; when producing video, the skill obtains the renderer in the task’s workspace. **The skill supplies the workflow. The agent still needs code execution and file access to produce output.**

Example requests:

```text
Use prompt-to-video to make a 20-second launch film for my task manager.
Audience: indie developers. Story: capture → organize → execute today.
16:9, Chinese and English captions, cream background, one orange accent.
Show a storyboard and short sample, then inspect and deliver a 1080p MP4 and source.
```

```text
Use prompt-to-video to turn this voiceover into a 45-second whiteboard explainer.
Reveal the diagrams alongside the narration, preserve accurate data,
and keep the music quiet beneath speech.
```

## Customize and render

```sh
npm test
npm run render -- --mode reel --stills-only
npm run render -- --mode reel
npm run render -- --mode bucket
npm run render -- --scene examples/custom-scene.cjs --output media/custom.mp4
npm run check:media
```

`npm ci` installs the local canvas renderer and FFmpeg; no cloud service is needed. Set `FFMPEG_PATH` to use an existing binary. Rendering first creates a 16-frame storyboard, then renders frames at exact timestamps. `--stills-only` stops after the storyboard. The example films do not claim seamless looping.

Modify [src/engine.js](src/engine.js) for built-in examples. Custom scenes expose `render(ctx, t, config)`; start with [examples/custom-scene.cjs](examples/custom-scene.cjs). Model correctness, pixel determinism, browser interactions and media output have separate checks.

## Workflow and layout

[English guide](docs/workflow.en.md) · [中文指南](docs/workflow.zh-CN.md) · [Style directions](skills/prompt-to-video/references/style-directions.md) · [Skill](skills/prompt-to-video/SKILL.md)

```text
src/                    Preview, time-driven animation and synthesized audio
data/videos.json        Attributed upstream prompt snapshot
media/                  Original example MP4s and storyboards
scripts/                Local server, build, render and checks
skills/prompt-to-video/  Installable AI production skill
docs/                   Chinese and English production guides
```

## Sources, licensing and contributions

Prompt source: [yihui-dev/awesome-opus5-5-videos](https://github.com/yihui-dev/awesome-opus5-5-videos). Workflow references: [xilo](https://x.com/xilo2991/status/2104912748794589515) and [huashu-art-motion](https://x.com/alchainhust/status/2107347834668224687), informing structured briefs, content-led style choices and in-shot motion review.

New tools, demos and skill instructions use [MIT](LICENSE). Dataset and font licenses are preserved; see [third-party notices](THIRD_PARTY_NOTICES.md). Original creators’ videos and preview images are not bundled.

Contribute sourced prompts, runnable scenes and production lessons with evidence. Cases should include author, source post and completeness flags; styles should include keyframes, implementation and limitations. The built-in renderer currently targets Canvas 2D. Three.js, TTS and reference-driven remakes are workflow choices for capable agents, with their respective dependencies, rather than pre-integrated services.
