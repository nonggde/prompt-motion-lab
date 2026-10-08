# 渲染接口 / Render contract

## 获取工程 / Set up

如果只安装了 Skill，请在任务工作目录获取 Prompt Motion Lab，并保留用户已有文件。/ If only the Skill is installed, obtain Prompt Motion Lab in the task workspace and preserve any existing files.

    git clone https://github.com/nonggde/prompt-motion-lab.git
    cd prompt-motion-lab
    npm ci
    npm test

需要 Node.js 20+。npm ci 安装原生 Canvas、Playwright 相关包和 FFmpeg 静态二进制；原生依赖若不支持当前系统，报告实际错误。可用 FFMPEG_PATH 指定已有 FFmpeg。/ Node.js 20+ is required. npm ci installs the native Canvas, Playwright packages, and a static FFmpeg binary; report the actual error if native dependencies do not support the system. Set FFMPEG_PATH to use an existing FFmpeg.

## 场景接口 / Scene interface

自定义场景模块导出 duration、正偶数 width/height 和 render(ctx, t, config)。可选 audio(sampleRate) 返回单声道 Float32Array，长度必须等于 duration * sampleRate。/ A custom scene module exports duration, positive even width/height, and render(ctx, t, config). Optional audio(sampleRate) returns a mono Float32Array exactly duration * sampleRate samples long.

    module.exports = {
      duration: 12,
      width: 1920,
      height: 1080,
      render(ctx, t, config) {
        // Draw a complete frame from t and fixed config.
      },
      audio(sampleRate) {
        // Return mono samples or omit this method.
      }
    };

每帧开始时重置 Canvas 状态并绘制完整画面。不要依赖上一帧位置、实时网络、未固定随机或异步到达顺序。渲染器传入的自定义 config 是空对象；需要可调参数时，在场景模块或项目包装器中定义固定默认值。/ Reset Canvas state and draw a complete frame at the start of every frame. Do not depend on previous-frame positions, live network calls, unseeded randomness, or asynchronous arrival order. The renderer passes an empty custom config object; define stable defaults in the scene module or a project wrapper when parameters need to be adjustable.

## 当前命令 / Current commands

内置场景：/ Built-in scenes:

    npm run render -- --mode reel --output media/form-flow.mp4
    npm run render -- --mode bucket --output media/token-bucket.mp4

自定义场景：/ Custom scene:

    npm run render -- --scene examples/pulse-grid.cjs --output media/pulse-grid.mp4

先生成 16 格分镜而不导出整片：/ Generate the 16-frame storyboard before the full film:

    npm run render -- --scene examples/pulse-grid.cjs --output media/pulse-grid.mp4 --stills-only

脚本支持的选项是 --mode reel|bucket、--scene path、--output file.mp4、--duration seconds、--fps integer 和 --stills-only。自定义场景默认使用模块的 duration；传入 --duration 会覆盖它。/ Supported options are --mode reel|bucket, --scene path, --output file.mp4, --duration seconds, --fps integer, and --stills-only. A custom scene uses its module duration by default; --duration overrides it.

## 声音 / Sound

自定义 audio 返回原始单声道采样；未提供时，内置模式使用项目的合成声音。代码合成配乐或音效不等于口播。需要语音时使用用户提供的录音或已获授权的 TTS，并把语音段落纳入同一时间线。/ Custom audio returns raw mono samples; built-in modes use the project's synthesized sound when no custom audio is provided. Synthesized music or effects are not narration. Use supplied speech or authorized TTS for voice, and place speech segments on the same timeline.

导出器将声音转成 AAC，并应用单遍响度目标 -16 LUFS / -1.5 dBTP。这个值是处理目标，不是成片的实测声明；需要响度结论时单独测量输出。/ The exporter encodes audio as AAC and applies a single-pass target of -16 LUFS / -1.5 dBTP. This is a processing target, not a measured claim; measure the output when loudness matters.

## 预览与验证 / Preview and verification

    npm start
    npm run build
    npm run check:media

内置播放器的 window.seek(t) 可定位时间，window.motionLab.setMode('reel'|'bucket'|'pulse') 可切换三支内置示例；它们不会自动加载任意自定义场景。自定义场景应使用同一 render 函数制作独立预览。/ The built-in viewer exposes window.seek(t) for seeking and window.motionLab.setMode('reel'|'bucket'|'pulse') for the three shipped examples; it does not load arbitrary custom scenes. Give a custom scene its own preview using the same render function.

交付前检查：

- 生成分镜并查看实际图像：文字安全区、重叠、层级、焦点、镜头内部动作和切换两侧。/ Generate and inspect the storyboard: text safe areas, overlaps, hierarchy, focus, in-shot motion, and both sides of transitions.
- 用 FFmpeg 或 ffprobe 检查自定义片的尺寸、帧率、时长、音轨、完整解码和黑帧。/ Use FFmpeg or ffprobe to check the custom film's dimensions, frame rate, duration, audio track, full decode, and black frames.
- 必要时重复渲染并比较关键帧或文件校验值，确认固定种子和时间线生效。/ Repeat the render and compare keyframes or file hashes when determinism matters.
- 叙事、事实、界面行为和数据单位单独核对；媒体元数据通过不代表内容正确。/ Check narrative, facts, UI behavior, and data units separately; passing media metadata does not prove content correctness.

check:media 只检查仓库内三支内置影片的预期值，不能替代自定义场景的检查。/ check:media knows only the three shipped films and cannot replace validation of a custom scene.
