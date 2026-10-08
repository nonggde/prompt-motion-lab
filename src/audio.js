(function(global){
  'use strict';
  function makeSamples(duration,sampleRate=48000,mode='reel',config={}) {
    const out=new Float32Array(Math.round(duration*sampleRate)),tau=Math.PI*2;
    const cues=mode==='bucket'?global.MotionEngine.events.map(when=>({when,pass:global.MotionEngine.bucketState(when,config.capacity??4,config.rate??1).log.at(-1).ok})):[];
    let cueStart=0;
    const bass=[65.406,55,43.654,48.999],notes=[261.626,311.127,391.995,466.164,523.251,391.995,311.127,233.082];
    for(let i=0;i<out.length;i++) {
      const t=i/sampleRate,beat=t%.5,hat=t%.25,bar=Math.floor(t/2),f=bass[bar%4];
      let v=0;
      if(mode==='reel') {
        v+=.29*Math.sin(tau*(48*beat+7*(1-Math.exp(-beat*35))))*Math.exp(-beat*21);
        v+=.12*(Math.sin(tau*f*t)+.24*Math.sin(tau*f*2*t))*Math.exp(-beat*6);
        v+=.07*Math.sin(tau*notes[Math.floor(t/.25)%notes.length]*t)*Math.exp(-hat*16);
        const noise=Math.sin(i*313.67+38.7)*43758.5;
        v+=.025*((noise-Math.floor(noise))*2-1)*Math.exp(-hat*100);
      } else {
        v=.035*Math.sin(tau*130.813*t)+.025*Math.sin(tau*195.998*t);
        while(cueStart<cues.length&&t-cues[cueStart].when>.25)cueStart++;
        for(let e=cueStart;e<cues.length&&cues[e].when<=t;e++){
          const {when,pass}=cues[e],d=t-when;
          v+=.12*Math.sin(tau*(pass?660:220)*d)*Math.exp(-d*23);
        }
      }
      const fade=Math.min(1,t/.04,(duration-t)/.7);
      out[i]=Math.max(-.95,Math.min(.95,v*fade));
    }
    return out;
  }
  const api={makeSamples};global.MotionAudio=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
