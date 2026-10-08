# From a brief to a finished film

[中文](workflow.zh-CN.md) · [Project](../README.en.md)

Prompt Motion Lab treats a production as an experiment record rather than a magic sentence: brief, direction, bilingual prompt, timed storyboard, scene code, sample, evidence, and next step.

## 1. Write the brief

Record the purpose, audience, one-sentence takeaway, required facts, duration, aspect ratio, resolution, fps, language, assets, and sound. Choose and record noncritical defaults such as 15 seconds, 16:9, and three colors. Ask the user when a missing fact or authorization would change the result.

Turn “make a cool video” into:

> Introduce a task manager to indie developers in 20 seconds. Show “capture → organize → execute today,” one operation per shot. 1920×1080, Chinese and English captions, cream background, charcoal body text, orange accent. Do not invent testimonials. Deliver MP4, preview, source, storyboard, and an experiment record.

## 2. Offer directions

Describe color, type, material, composition, camera grammar, in-shot motion, sound, and implementation from the content. Algorithms fit stable geometry and event tables; real products fit real UI states; kinetic type fits few words and strong type; product space needs 3D hierarchy only when depth carries meaning. When the user delegates the choice, pick one direction and record why it serves the goal.

## 3. Write an original bilingual prompt

Make the prompt executable: give every shot one primary message, visible action, camera move, text hold, transition, sound event, negative rule, seed, and acceptance check. Separate facts from visual metaphor; a schematic must not be presented as a physical simulation.

## 4. Time the storyboard

| Time | Information | In-shot action | Camera | Text | Sound / transition |
| --- | --- | --- | --- | --- | --- |
| 0–3s | Establish the question | Main object enters and settles | Wide | One title | Opening cue |
| 3–8s | Show the relationship | Event travels along a path | Follow | One term | Align to action peak |
| 8–13s | Explain the change | State changes and leaves a trace | Push in | Parameter or result | Content-led transition |
| 13–15s | Resolve the takeaway | Elements organize into final form | Pull back | One takeaway | Ending and hold |

Do not force this timing on every topic. For narration, time shots to speech; for data, time them to the factual range. Hold important text long enough to read.

## 5. Choose the implementation and sample

Canvas 2D fits diagrams, particles, and pixels; SVG/HTML fits interfaces and type; Three.js fits spatial hierarchy; GLSL fits material and post-processing. Derive every frame from time and fixed configuration and seed randomness. Precompute stateful simulations or replay them from a fixed initial state.

Generate a storyboard with a custom scene:

    npm ci
    npm test
    npm run render -- --scene examples/custom-scene.cjs --output media/my-film.mp4 --stills-only

Inspect the storyboard and fix text collisions, weak focus, static objects, broken transitions, and semantic errors before rendering a short sample and the full film.

## 6. Share the timeline with sound

Put cues, motion peaks, speech sections, and holds on one timeline. Built-in sound is synthesized music or effects; use supplied speech or authorized TTS for narration and never describe music as voiceover.

## 7. Record status and evidence

Use draft, rendered, inspected, validated, and blocked. Validated requires actual frame inspection, video metadata, full decoding, narrative and readability checks, and a repeated render comparison when determinism matters. Record observations instead of replacing evidence with a subjective score.

## 8. Export and deliver

    npm run render -- --scene examples/my-scene.cjs --output media/my-film.mp4 --fps 60
    npm run build
    npm run check:media

Deliver the MP4, storyboard, preview, source, brief, and experiment record. Validate a custom film against its own dimensions, duration, frame rate, and audio; the built-in check:media knows only the two shipped films.
