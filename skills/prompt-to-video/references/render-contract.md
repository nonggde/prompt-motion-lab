# 渲染接口 / Render contract

## 获取工程 / Obtain the renderer

If you only installed this skill, obtain the renderer in the task workspace, without overwriting an existing checkout. / 只安装 Skill 时，在任务工作目录获取工程，不覆盖已有 checkout。

```sh
git clone https://github.com/nonggde/prompt-motion-lab.git
cd prompt-motion-lab
npm ci
npm test
```

Node.js 20+ is required. `npm ci` installs native canvas and an FFmpeg binary; first installation needs network access. `FFMPEG_PATH` can select an existing executable. Canvas installation may need a supported OS/architecture; report the actual dependency error instead of claiming success. Preview alone uses static browser files.

需要 Node.js 20+。首次安装依赖需要联网，包括原生画布和 FFmpeg；可用 `FFMPEG_PATH` 选择已有程序。原生依赖需要支持的操作系统和架构，出错时报告实际问题。仅预览不需要原生依赖。

## 自定义场景 / Custom scene

Read `examples/custom-scene.cjs` in the renderer repository. Export:

```js
module.exports = {
  duration: 15,
  width: 1920,
  height: 1080,
  render(ctx, t, config) {
    // Draw a complete frame from time and fixed config.
  },
  // Optional: mono Float32Array at sampleRate, exactly duration * sampleRate long.
  audio(sampleRate) { /* return samples */ }
};
```

Use fixed even dimensions for H.264. Clear/reset drawing state each frame. `audio` is optional; the built-in renderer otherwise supplies synthesized music, not narration. The supplied exporter renders one sample per frame; it does not implement multi-sample motion blur or a browser DOM renderer. Add those only when the design needs them and verify the result.

H.264 画幅用固定偶数尺寸，每帧重置绘制状态。可选 `audio` 返回单声道样本，长度与时长一致；默认合成配乐不等于配音。当前导出每帧一次采样，未实现多重采样模糊或 DOM 渲染；需要时另行加入并验证。

```sh
npm run render -- --scene examples/my-scene.cjs --output media/my-film.mp4 --stills-only
# Inspect media/my-film-storyboard.png before the full render.
npm run render -- --scene examples/my-scene.cjs --output media/my-film.mp4 --fps 60
```

## 声音与口播 / Audio and narration

Built-in output uses original synthesized mono audio, AAC, and a single-pass loudness target of -16 LUFS / -1.5 dBTP. This is a target, not a claim of measured output. Speech can be generated through available TTS or supplied by the user; compose/mix to the shot timeline and measure the output if loudness is part of the brief. Do not install or invoke a paid service without user authorization.

内置声音为新合成单声道配乐，AAC 编码，单遍响度目标 -16 LUFS / -1.5 dBTP；这是目标，不能冒充成片测量值。口播可来自可用 TTS 或用户素材，按同一镜头时间线合成和混音，需要指定响度时测量输出。付费服务遵循用户授权。

## 预览与验证 / Preview and verification

```sh
npm start
npm run build
npm run check:media
```

`window.seek(t)` pauses and renders the built-in viewer at a chosen time; `window.motionLab.setMode('reel'|'bucket')` chooses its built-in example. These APIs do not load arbitrary custom scenes. For a custom video, wire a small preview to the same scene function or use its own browser-friendly module. Native canvas and browser font shaping can differ slightly; inspect both outputs if layout is sensitive.

`window.seek(t)` 暂停并定位内置示例，`window.motionLab.setMode('reel'|'bucket')` 选择示例，不自动载入任意自定义场景。自定义视频应给同一场景函数接一个小预览或使用适合浏览器的模块。浏览器和原生画布字形可能略有差异，版式敏感时两边都检查。

Validate the user's film separately: inspect frames, decode the entire MP4, check duration/dimensions/fps/audio, and check story/content. `check:media` knows only the two shipped demo expectations. For a custom scene, use FFmpeg/ffprobe with that scene's expected metadata. Do not pass a built-in checker and imply it tested a new film.

新视频单独验证：看画面、全片解码、检查时长/尺寸/帧率/音轨，并检查叙事和事实。`check:media` 只了解两支示例的期望值；自定义场景需使用 FFmpeg/ffprobe 检查自身元数据，不能用示例检查结果代替。
