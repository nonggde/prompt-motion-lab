# 贡献 / Contributing

欢迎提交有来源的提示词、可运行场景和有证据的制作经验。新文档和用户界面请同时提供中文与英文；原作者引用保留原语言。

Contribute sourced prompts, runnable scenes and production lessons backed by evidence. Provide Chinese and English for new documentation and UI; preserve the original language of creator quotes.

- 提示词：附作者、原帖、分类和 `prompt_partial` 标记，不打包无授权视频。/ Prompts: include creator, source post, category and `prompt_partial`; do not bundle unlicensed videos.
- 场景：逐帧依赖时间与固定配置，附简报、抽帧图和实际导出证据。/ Scenes: derive frames from time and fixed config; include a brief, storyboard and evidence of an actual export.
- 方法：说明何时适用、实现方式与已知局限。/ Methods: explain suitability, implementation and limitations.

```sh
npm ci
npm test
npm run build
npx playwright install chromium
npm run test:browser
npm run check:media
```

媒体检查验证两支内置影片。修改它们时重新渲染并检查；新增场景按自己的尺寸、时长和音轨验证。新素材的来源与许可写入 `THIRD_PARTY_NOTICES.md`。

Media checks verify the two built-in films. Re-render them after scene changes. Verify a new scene against its own dimensions, duration and audio. Record new asset sources and licenses in `THIRD_PARTY_NOTICES.md`.
