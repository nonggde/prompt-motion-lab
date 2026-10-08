import {createRequire} from 'node:module';
import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
const require=createRequire(import.meta.url);
const {createCanvas,GlobalFonts}=require('@napi-rs/canvas');
const E=require('../src/engine.js'),A=require('../src/audio.js');
const args=process.argv.slice(2),arg=(key,def)=>{const i=args.indexOf(key);return i<0?def:args[i+1]};
if(args.includes('--help')){
 console.log('npm run render -- --mode reel|bucket [--fps 60] [--stills-only]\nCustom: --scene examples/custom-scene.cjs --output media/custom.mp4\nUse FFMPEG_PATH to override the bundled ffmpeg.');process.exit(0);
}
const scenePath=arg('--scene',null),mode=arg('--mode','reel');
if(!scenePath&&!['reel','bucket'].includes(mode))throw Error('Mode must be reel or bucket; use --scene for a custom scene.');
const scene=scenePath?require(path.resolve(scenePath)):null;
const duration=Number(arg('--duration',scene?.duration||(mode==='reel'?15:20))),fps=Number(arg('--fps',60));
if(!Number.isFinite(duration)||duration<=0||duration>3600||!Number.isInteger(fps)||fps<1||fps>120)throw Error('Invalid duration (0–3600 sec) or fps (1–120 integer).');
const out=path.resolve(arg('--output',`media/${scene?'custom':mode==='reel'?'form-flow':'token-bucket'}.mp4`));
if(path.extname(out).toLowerCase()!=='.mp4')throw Error('Output must have an .mp4 extension.');
if(scene&&(typeof scene.render!=='function'||![scene.width||E.W,scene.height||E.H].every(v=>Number.isInteger(v)&&v>0&&v%2===0)))throw Error('Scene needs render(ctx,t,config) and positive, even integer dimensions.');
await mkdir(path.dirname(out),{recursive:true});
GlobalFonts.registerFromPath(path.resolve('assets/fonts/Anton-Regular.ttf'),'Anton');
const canvas=createCanvas(scene?.width||E.W,scene?.height||E.H),ctx=canvas.getContext('2d');
const render=t=>scene?scene.render(ctx,t,{}):E.render(ctx,mode,t);
const stills=Array.from({length:16},(_,i)=>Math.min(duration-1/fps,duration*i/15));
const board=createCanvas(1920,1168),b=board.getContext('2d');b.fillStyle='#efede5';b.fillRect(0,0,1920,1168);
for(let i=0;i<stills.length;i++){render(stills[i]);const x=i%4*480,y=Math.floor(i/4)*292;b.drawImage(canvas,x,y,480,270);b.fillStyle='#191918';b.font='14px monospace';b.fillText(`${stills[i].toFixed(2)}s`,x+9,y+286)}
await writeFile(out.replace(/\.mp4$/,'-storyboard.png'),board.toBuffer('image/png'));
if(args.includes('--stills-only')){console.log('Storyboard rendered.');process.exit(0)}
const samples=scene?.audio?scene.audio(48000):A.makeSamples(duration,48000,mode);
const wav=Buffer.alloc(44+samples.length*2);wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(48000,24);wav.writeUInt32LE(96000,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(samples.length*2,40);for(let i=0;i<samples.length;i++)wav.writeInt16LE(Math.round(Math.max(-1,Math.min(1,samples[i]))*32767),44+i*2);
const audioPath=out.replace(/\.mp4$/,'.wav');await writeFile(audioPath,wav);
const ffmpeg=process.env.FFMPEG_PATH||require('ffmpeg-static');
const proc=spawn(ffmpeg,['-hide_banner','-loglevel','error','-y','-f','rawvideo','-pixel_format','rgba','-video_size',`${canvas.width}x${canvas.height}`,'-framerate',String(fps),'-i','pipe:0','-i',audioPath,'-map','0:v:0','-map','1:a:0','-c:v','libx264','-preset','fast','-crf','19','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-af','loudnorm=I=-16:TP=-1.5:LRA=11','-ar','48000','-t',String(duration),'-movflags','+faststart',out],{stdio:['pipe','inherit','inherit']});
const completion=once(proc,'close');proc.stdin.on('error',()=>{});
const frames=Math.round(duration*fps);
try{
 for(let i=0;i<frames;i++){
  render(i/fps);if(!proc.stdin.write(canvas.data()))await Promise.race([once(proc.stdin,'drain'),completion.then(([code])=>{throw Error(`FFmpeg exited early: ${code}`)})]);
  if(i%Math.max(1,Math.floor(frames/10))===0)console.log(`${Math.round(i/frames*100)}%`);
 }
 proc.stdin.end();const [code]=await completion;if(code!==0)throw Error(`FFmpeg exited ${code}`);
 console.log(`Rendered ${frames} frames → ${out}`);
}finally{await rm(audioPath,{force:true})}
