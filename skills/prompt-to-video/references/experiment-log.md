# 实验记录 / Experiment log

每次从提示词到视频的尝试都保存一份短记录。记录的目的不是给作品打主观分数，而是让下一次实验能复现输入、确认变化并修复已观察的问题。/ Keep a short record for every prompt-to-video attempt. The goal is not a subjective score; it is to reproduce inputs, isolate changes, and fix observed problems.

## 模板 / Template

    id:
    title:
    status: draft | rendered | inspected | validated | blocked
    created:
    brief:
      zh:
      en:
    audience:
    takeaway:
    direction:
      visual_language:
      palette:
      typography:
      motion:
      sound:
      implementation:
    prompt:
      zh:
      en:
      version:
    storyboard:
      - start:
        end:
        purpose:
        visual:
        motion:
        camera:
        text:
        audio:
        transition:
    renderer:
      scene:
      command:
      width:
      height:
      fps:
      duration:
      seed:
    outputs:
      - path:
        kind: storyboard | sample | mp4 | source
    inspection:
      frames:
      transitions:
      text_safe_area:
      semantic_checks:
      media_metadata:
      repeatability:
    observations:
    defects:
    next_experiment:
    limitations:

## Evidence rules / 证据规则

- draft needs a brief and a direction. / draft 至少要有简报和方向。
- rendered needs a generated storyboard or video path. / rendered 要有生成的分镜或视频路径。
- inspected needs concrete observations from actual frames or playback, including at least one change made or a clearly recorded defect. / inspected 要有来自实际画面或播放的具体观察，至少记录一次修改或一个明确缺陷。
- validated needs output metadata, full decode, narrative/readability checks, and a repeat-render comparison when determinism matters. / validated 要有输出元数据、完整解码、叙事与可读性检查；需要确定性时还要有重复渲染对比。
- blocked names the missing dependency and the smallest next action. / blocked 要写出缺失依赖和最小下一步。

Do not invent a score, measured loudness, model capability, or user approval. Record what was actually observed and what remains unknown. / 不要编造分数、实测响度、模型能力或用户确认；只记录实际观察和仍未知的部分。
