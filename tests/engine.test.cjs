const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../src/engine.js');
test('a full bucket caps refill and preserves the initial burst',()=>{
 assert.equal(E.bucketState(3.9).tokens,4);
 assert.equal(E.bucketState(4.84).accepted,4);
 assert.equal(E.bucketState(4.84).rejected,0);
});
test('fractional refill permits the fifth request and rejects the sixth',()=>{
 const s=E.bucketState(5.4);assert.equal(s.accepted,5);assert.equal(s.rejected,1);assert.ok(Math.abs(s.tokens-.4)<1e-8);
 assert.equal(s.log.at(-1).ok,false);
});
test('token conservation and capacity hold across different refill rates',()=>{
 for(const cap of [2,4,8])for(const rate of [.5,1,3])for(let t=0;t<=20;t+=.05){const s=E.bucketState(t,cap,rate);assert.ok(s.tokens>=0&&s.tokens<=cap);assert.ok(s.accepted<=cap+rate*t+1e-7);assert.equal(s.accepted+s.rejected,s.log.length)}
});
test('seeking backwards does not change an event result',()=>{
 const a=E.bucketState(11.35,3,1.5);E.bucketState(19,8,3);E.bucketState(0,2,.5);assert.deepEqual(E.bucketState(11.35,3,1.5),a);
});
test('same animation time produces identical pixels after unrelated renders',()=>{
 const {createCanvas,GlobalFonts}=require('@napi-rs/canvas');const {createHash}=require('node:crypto');const path=require('node:path');
 GlobalFonts.registerFromPath(path.resolve('assets/fonts/Anton-Regular.ttf'),'Anton');
 const c=createCanvas(E.W,E.H),ctx=c.getContext('2d'),digest=()=>createHash('sha256').update(c.data()).digest('hex');
 for(const mode of ['reel','bucket']){E.render(ctx,mode,6.2);const before=digest();E.render(ctx,'reel',12.4);E.render(ctx,'bucket',1.1);E.render(ctx,mode,6.2);assert.equal(digest(),before)}
});

test('bucket audio follows the configured decision at the sixth request',()=>{
 const A=require('../src/audio.js'),rate=48000;
 const rejected=A.makeSamples(6,rate,'bucket',{capacity:4,rate:1});
 const accepted=A.makeSamples(6,rate,'bucket',{capacity:8,rate:1});
 const energy=(samples,hz)=>{let re=0,im=0;for(let i=Math.round(5.42*rate);i<Math.round(5.54*rate);i++){const phase=2*Math.PI*hz*i/rate;re+=samples[i]*Math.cos(phase);im+=samples[i]*Math.sin(phase)}return re*re+im*im};
 assert.ok(energy(rejected,220)>energy(rejected,660)*10);
 assert.ok(energy(accepted,660)>energy(accepted,220)*10);
});
