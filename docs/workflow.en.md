# From a brief to a finished film

[中文](workflow.zh-CN.md) · [Project](../README.en.md)

A useful video prompt connects content, visual direction and timing. This guide turns the reference research into a workflow you can implement, inspect and revise.

## 1. Turn the request into a brief

Record objective, audience, real content, duration, aspect, language, assets and sound. Check sources for factual content; use real features and interfaces for product videos. Choose and record defaults for noncritical omissions. Ask specific questions when a missing fact, material choice or paid resource needs the user’s decision.

Replace “make a cool video” with:

> Introduce a task manager to indie developers in 20 seconds. Show “capture → organize → execute today,” one action per shot. 1920×1080, Chinese and English captions, cream background, charcoal text, orange accent. Do not invent testimonials. Deliver MP4, preview, source and storyboard.

Use the structure in the [prompt playbook](../skills/prompt-to-video/references/prompt-playbook.md). Archive text retains its creator’s language; a partial post description is not a complete production brief.

## 2. Choose a visual language for the content

An algorithm needs clear resources, events and state. A product needs real interfaces. An art film benefits from consistent shapes, materials and motion rules. Analyze references through palette, type scale, density, shot timing and motion relationships, then write implementable requirements.

The [eight style directions](../skills/prompt-to-video/references/style-directions.md) are design guidance rather than eight shipped templates. Built-in scenes use Canvas 2D; the torus projects 3D coordinates onto a 2D canvas, rather than using an integrated Three.js scene.

## 3. Time the shots and sound

| Time | Content | In-shot motion | Transition / sound |
| --- | --- | --- | --- |
| 0–3.5s | IDEAS TAKE SHAPE | Masked type enters; a circle grows | Synthesized beat; circular wipe |
| 3.5–8s | FORM INTO FLOW | A 5,720-point torus rotates and deforms | Same beat; circular wipe |
| 8–11.5s | MAKE IT MOVE | Large type reveals; an asterisk rotates and pulses | Inverted palette; circular wipe |
| 11.5–15s | FORM & FLOW | Type resolves; ring elements slowly turn | Ending; music fades |

This is the actual FORM & FLOW shot list. Do not force every topic into 120 BPM or quick cuts. For narration, time shots to the spoken sections and allow reading time. Inspect whether motion inside each shot communicates meaning, as well as reviewing transitions.

The token bucket uses one stable diagram: capacity at 0–4s, burst traffic at 4–8s, rejection at 8–12s, continuous refill at 12–16s and resolution at 16–20s. Counters and request paths share one event model; seeking recomputes it.

## 4. Make every frame seekable

A frame is a function of time `t` and fixed configuration. Avoid accumulated positions, unseeded randomness and real-time network dependencies during rendering. Precompute physics or replay from a fixed initial state. Playback uses a clock; export uses exact `i / fps` timestamps.

Use the [custom scene](../examples/custom-scene.cjs) and [render contract](../skills/prompt-to-video/references/render-contract.md). The built-in player loads two examples; connect new scenes to their own preview using the same drawing function. Check typography and wait for fonts and assets before capture.

## 5. Inspect frames, then a short sample

```sh
npm ci
npm test
npm run render -- --scene examples/custom-scene.cjs --output media/my-film.mp4 --stills-only
```

Inspect the storyboard for glyphs, spacing, overlaps, hierarchy and logic. Still images cannot prove continuous motion: inspect both sides of transitions and a short video. Make targeted revisions such as “move the circle right to clear the title.”

`--duration 2` can render the first two seconds. For another shot, add a fixed time offset in the scene’s sample wrapper. The default storyboard contains 16 evenly spaced timestamps; it does not automatically cover each cut boundary.

## 6. Share events between picture and sound

Music and cues here are synthesized in code. Token bucket cues use the event’s accepted/rejected state and update with preview capacity and refill settings. Downloaded MP4s use the default capacity of 4 and refill of 1 token per second.

Use supplied speech or available TTS when narration is requested. Music does not replace voiceover. No TTS or cloud video service is integrated. The exporter uses a single-pass target of -16 LUFS / -1.5 dBTP; those targets are not measured output claims.

## 7. Export and verify the file

```sh
npm run render -- --mode reel
npm run render -- --mode bucket
npm run check:media
npm run build
npx playwright install chromium
npm run test:browser
```

Check full decoding, 1920×1080, 60fps, 15/20 seconds and AAC audio for the built-in films. Verify languages, filters, playback, parameters and offline builds. Validate each new film against its own dimensions and duration; built-in checks do not verify custom films.

Deliver film, preview, source, brief and credits. Describe actual tools and remaining limitations. The [AI skill](../skills/prompt-to-video/SKILL.md) gives agents with code execution and file access this workflow.

## References

[yihui-dev’s collection](https://github.com/yihui-dev/awesome-opus5-5-videos) supplies attributed prompts. [xilo’s article](https://x.com/xilo2991/status/2104912748794589515) informs structured briefs and preview review. [alchain’s article](https://x.com/alchainhust/status/2107347834668224687) informs style directions, reference analysis and in-shot motion. This guide and the examples are newly authored; see [source notices](../THIRD_PARTY_NOTICES.md).
