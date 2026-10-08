# 贡献 / Contributing

欢迎提交原创双语配方、可运行场景、分镜和有证据的实验记录。/ Contribute original bilingual recipes, runnable scenes, storyboards, and experiment records backed by evidence.

## 配方 / Recipes

- 用自己的语言重写需求、方向和镜头规则；不要把外部合集整段复制进数据文件。/ Write the brief, direction, and shot rules in your own words; do not paste a complete external collection into the dataset.
- 为每条配方填写 `status`：`draft`、`rendered`、`inspected` 或 `validated`。/ Set `status` to `draft`, `rendered`, `inspected`, or `validated`.
- 配方必须有中英文、目标观众、时长、画幅、技术路线、时间分镜、负面规则和实验日志。/ Include Chinese and English, audience, duration, aspect ratio, stack, timed shots, negative rules, and an experiment log.
- `validated` 只表示本项目有实际输出和检查证据，不表示某个模型或云服务保证效果。/ `validated` means this project has an actual output and inspection evidence; it does not promise a model or cloud service result.

## 场景 / Scenes

- 每帧由 `t` 与固定配置计算；随机效果使用固定种子，不能依赖上一帧、网络或未固定的随机数。/ Derive every frame from `t` and fixed configuration; seed randomness and avoid previous-frame state, network timing, or unseeded randomness.
- 导出 `duration`、偶数尺寸的 `width`/`height` 和 `render(ctx, t, config)`；声音可选 `audio(sampleRate)`。/ Export `duration`, even `width`/`height`, and `render(ctx, t, config)`; add `audio(sampleRate)` when needed.
- 提交分镜图、短样片或 MP4 的实际检查结果，以及已知限制。/ Include evidence from the storyboard, short sample, or MP4 and list known limitations.

## 文档与媒体 / Docs and media

新增公开文档、界面文字和 Skill 内容请提供中文与英文。第三方字体、图片、音频或模型必须在 `THIRD_PARTY_NOTICES.md` 记录独立许可；没有许可就不要打包。/ New public docs, UI copy, and Skill content must include Chinese and English. Record separate licenses for third-party fonts, images, audio, or models in `THIRD_PARTY_NOTICES.md`; do not bundle unlicensed assets.

## 本地检查 / Local checks

```sh
npm ci
npm test
npm run build
npm run check:media
npx playwright install chromium
npm run test:browser
```

提交新片前先运行自定义场景的 `--stills-only`，查看分镜，再按自己的尺寸、时长、帧率和音轨检查 MP4。/ Before submitting a new film, run the custom scene with `--stills-only`, inspect the storyboard, then verify the MP4 against its own dimensions, duration, frame rate, and audio track.
