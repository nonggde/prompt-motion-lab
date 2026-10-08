import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const ffmpeg=process.env.FFMPEG_PATH||require('ffmpeg-static');
for(const [file,expectedSeconds] of [['media/form-flow.mp4',15],['media/token-bucket.mp4',20]]) {
  let metadata='',progress='';
  const child=spawn(ffmpeg,['-hide_banner','-xerror','-i',file,'-map','0:v:0','-map','0:a:0','-progress','pipe:1','-nostats','-f','null','-'],{stdio:['ignore','pipe','pipe']});
  child.stdout.on('data',d=>progress+=d);child.stderr.on('data',d=>metadata+=d);
  await new Promise((resolve,reject)=>{child.on('error',reject);child.on('close',code=>code===0?resolve():reject(Error(`${file}: decode failed\n${metadata}`)))});
  const input=metadata.split('Output #0')[0];
  assert.match(input,/Video: h264/);assert.match(input,/1920x1080/);assert.match(input,/60 fps/);assert.match(input,/Audio: aac/);
  const duration=input.match(/Duration: (\d+):(\d+):([\d.]+)/);
  assert.ok(duration,`${file}: missing duration`);
  const seconds=Number(duration[1])*3600+Number(duration[2])*60+Number(duration[3]);
  assert.ok(Math.abs(seconds-expectedSeconds)<.05,`${file}: ${seconds}s, expected ${expectedSeconds}s`);
  const frames=[...progress.matchAll(/frame=(\d+)/g)].at(-1);
  assert.equal(Number(frames?.[1]),expectedSeconds*60,`${file}: unexpected decoded frame count`);
  assert.match(progress,/progress=end/);
  console.log(`PASS ${file}: 1920×1080, 60fps, ${seconds}s, AAC, ${frames[1]} frames fully decoded`);
}
