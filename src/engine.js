(function(global) {
  'use strict';
  const W=1920,H=1080, TAU=Math.PI*2;
  const C={ink:'#191918',paper:'#efede5',orange:'#f16b46',dim:'#89897f',line:'#cbc9bf',green:'#27785c',pale:'#d9e5d9'};
  const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
  const mix=(a,b,t)=>a+(b-a)*t;
  const ease=x=>{x=clamp(x);return x*x*(3-2*x)};
  const out=x=>1-Math.pow(1-clamp(x),4);
  const events=[4,4.28,4.56,4.84,5.12,5.4,5.68,5.96,8,8.22,8.44,8.66,10.8,11,11.2,11.4,14,14.2,14.4,14.6,14.8,15,15.2,16.2,17.4,18.6];
  function text(c,s,x,y,size,color=C.paper,font='Anton',align='left') {
    c.fillStyle=color;c.font=`${size}px ${font}`;c.textAlign=align;c.textBaseline='alphabetic';c.fillText(s,x,y);
  }
  function label(c,s,x,y,color=C.dim,align='left',size=24) {text(c,s,x,y,size,color,'monospace',align)}
  function line(c,x1,y1,x2,y2,color,width=2) {c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.strokeStyle=color;c.lineWidth=width;c.stroke()}
  function circle(c,x,y,r,color) {c.beginPath();c.arc(x,y,Math.max(.01,r),0,TAU);c.fillStyle=color;c.fill()}
  function round(c,x,y,w,h,r,color) {c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=color;c.fill()}
  function typeFit(c,s,x,y,width,height,color) {
    c.save();c.font=`200px Anton`;const mw=c.measureText(s).width;
    c.translate(x,y);c.scale(width/mw,height/200);text(c,s,0,0,200,color);c.restore();
  }
  function reveal(c,s,x,y,width,height,t,delay,color) {
    const u=out((t-delay)/.65);c.save();c.beginPath();c.rect(x-8,y-height-15,width+16,height+22);c.clip();
    typeFit(c,s,x,y+(1-u)*(height+50),width,height,color);c.restore();
  }
  function footer(c,scene,t,duration,light=false) {
    const col=light?C.ink:C.paper;
    label(c,'FORM / FLOW',82,69,col);label(c,scene,1838,69,col,'right');
    line(c,82,995,1838,995,light?C.line:'#42423d',1);
    line(c,82,995,82+1756*clamp(t/duration),995,C.orange,3);
    label(c,'A CODE-CHOREOGRAPHED STUDY',82,1043,light?C.dim:'#a4a49a', 'left',20);
    label(c,`${t.toFixed(2).padStart(5,'0')} / ${duration.toFixed(2)}`,1838,1043,light?C.ink:C.paper,'right',20);
  }
  // Torus surface projected from actual 3D coordinates. Geometry is deterministic.
  function sculpture(c,t,cx,cy,scale,alpha=1) {
    const points=[], rot=t*.27, tilt=.45+.18*Math.sin(t*.55), morph=ease((t-4.4)/2.5);
    const ca=Math.cos(rot),sa=Math.sin(rot),cb=Math.cos(tilt),sb=Math.sin(tilt);
    for(let i=0;i<110;i++) for(let j=0;j<52;j++) {
      const u=i/110*TAU,v=j/52*TAU, k=.16*Math.sin(u*3+t*.8);
      const R=1.05+.09*Math.cos(u*3-t),r=.34+.10*morph*Math.sin(u*3+t*.6);
      let x=(R+r*Math.cos(v))*Math.cos(u), y=(R+r*Math.cos(v))*Math.sin(u),z=r*Math.sin(v)+k;
      const yy=y*cb-z*sb,zz=y*sb+z*cb;
      const xx=x*ca+zz*sa,zzz=-x*sa+zz*ca;
      const p=3.7/(3.7-zzz);
      points.push([cx+xx*scale*p,cy+yy*scale*p,zzz,1.1+p*.75,j%9===0]);
    }
    points.sort((a,b)=>a[2]-b[2]);
    c.save();c.globalAlpha=alpha;
    for(const [x,y,z,r,accent] of points) {
      c.globalAlpha=alpha*(.16+.74*clamp((z+1.5)/3));
      circle(c,x,y,r,accent?C.orange:C.paper);
    }
    c.restore();
  }
  function showreel(c,t) {
    t=clamp(t,0,15);c.fillStyle=C.ink;c.fillRect(0,0,W,H);
    if(t<3.5) {
      const p=out(t/.8), radius=88+ease((t-1)/2.5)*132;
      circle(c,1490+100*(1-p),550,radius,C.orange);
      c.save();c.translate(1490,550);c.rotate(-t*.32);
      c.strokeStyle=C.paper;c.lineWidth=1.5;c.beginPath();c.ellipse(0,0,radius+58,radius+58,0,0,TAU);c.stroke();
      for(let a=0;a<12;a++){const angle=a/12*TAU;line(c,Math.cos(angle)*(radius+48),Math.sin(angle)*(radius+48),Math.cos(angle)*(radius+68),Math.sin(angle)*(radius+68),C.paper,2)}c.restore();
      reveal(c,'IDEAS',86,402,900,280,t,0,C.paper);
      reveal(c,'TAKE SHAPE.',86,746,1100,280,t,.2,C.paper);
      label(c,'01 / AN IDEA BECOMES A FORM',92,880,C.dim);
      label(c,'PURE GEOMETRY',1490,914,C.paper,'center');
      footer(c,'01 — ORIGIN',t,15);
    } else if(t<8) {
      const q=t-3.5, intro=out(q/.8);
      sculpture(c,t,1310,460,260*mix(.8,1,intro),intro);
      reveal(c,'FORM',86,416,590,270,q,0,C.paper);
      reveal(c,'INTO',86,650,478,196,q,.15,C.dim);
      reveal(c,'FLOW.',86,885,650,220,q,.3,C.orange);
      line(c,980,886,1710,886,'#4c4c45',1);
      label(c,'5,720 POINTS / ONE CONTINUOUS SURFACE',980,926,C.dim,'left',20);
      footer(c,'02 — TRANSFORMATION',t,15);
    } else if(t<11.5) {
      const q=t-8;c.fillStyle=C.paper;c.fillRect(0,0,W,H);
      reveal(c,'MAKE',86,412,1020,285,q,0,C.ink);
      reveal(c,'IT MOVE.',86,842,1460,350,q,.2,C.ink);
      const arm=230*(.92+.08*Math.cos(q*TAU*2));
      c.save();c.translate(1557,363);c.rotate(q*.65);
      for(let i=0;i<8;i++){c.rotate(TAU/8);round(c,-arm/2,-30,arm,60,2,C.orange)}c.restore();
      label(c,'A LITTLE RHYTHM. A LOT OF INTENTION.',92,920,C.dim);
      footer(c,'03 — RHYTHM',t,15,true);
    } else {
      const q=t-11.5,p=out(q/1.05);
      c.save();c.translate(430,545);c.rotate(-.45+q*.16);
      for(let i=0;i<24;i++){
        const a=i/24*TAU,rad=190+Math.sin(i*.6+q)*8*(1-ease((q-1)/1.5));
        const x=Math.cos(a)*rad,y=Math.sin(a)*rad;c.save();c.translate(x,y);c.rotate(a);round(c,-52,-11,104,22,10,i%3===0?C.paper:C.orange);c.restore();
      }c.restore();
      reveal(c,'FORM',825,490,850,260,q,.1,C.paper);
      reveal(c,'& FLOW',825,785,900,260,q,.25,C.paper);
      c.globalAlpha=p;label(c,'FROM A PROMPT TO A MOVING IDEA',837,875,C.dim);c.globalAlpha=1;
      footer(c,'04 — RESOLUTION',t,15);
    }
    // A circular match wipe bridges the hard cut into the typographic scene.
    for(const boundary of [3.5,8,11.5]) {
      const dt=t-boundary;
      if(Math.abs(dt)<.18){const r=2400*(1-Math.abs(dt)/.18);circle(c,boundary===8?960:1390,540,r,C.orange)}
    }
  }
  function bucketState(t,capacity=4,rate=1) {
    capacity=Math.max(1,capacity);rate=Math.max(.01,rate);
    let tokens=capacity,last=0,accepted=0,rejected=0;
    const log=[];
    for(const when of events) {
      if(when>t)break;
      tokens=Math.min(capacity,tokens+(when-last)*rate);last=when;
      const ok=tokens>=1-1e-9;
      if(ok){tokens=Math.max(0,tokens-1);accepted++}else rejected++;
      log.push({when,ok,tokens});
    }
    tokens=Math.min(capacity,tokens+Math.max(0,t-last)*rate);
    return {tokens,accepted,rejected,log,capacity,rate};
  }
  function arrow(c,x,y,color) {line(c,x,y,x+75,y,color,3);line(c,x+75,y,x+61,y-12,color,3);line(c,x+75,y,x+61,y+12,color,3)}
  function bucket(c,t,opts={}) {
    t=clamp(t,0,20);const s=bucketState(t,opts.capacity||4,opts.rate||1);
    c.fillStyle=C.paper;c.fillRect(0,0,W,H);
    const head=t<4?'BURSTS ARE OK.':t<8?'ONE REQUEST. ONE TOKEN.':t<12?'NO TOKEN? TRY LATER.':t<16?'REFILL AT A STEADY RATE.':'ALLOW BURSTS. CAP THE RATE.';
    const sub=t<4?'桶内先存好令牌，允许短时突发':t<8?'每通过一个请求，就消耗一个令牌':t<12?'不足一个令牌时，本次请求被限流':t<16?'按固定速度补充，最多存到桶的容量':'容量决定突发量，补充速度约束长期速率';
    text(c,head,82,204,89,C.ink);text(c,sub,86,266,30,C.dim,'sans-serif');
    label(c,'TOKEN BUCKET / A VISUAL EXPLAINER',82,69,C.ink);label(c,'02 — UNDERSTAND',1838,69,C.ink,'right');
    const bx=812,by=430,bw=296,bh=362;
    // Bucket capacity is a bounded resource, shown continuously including fractional tokens.
    round(c,bx,by,bw,bh,32,'#dfddd3');
    const level=(s.tokens/s.capacity)*(bh-24);
    c.save();c.beginPath();c.roundRect(bx+12,by+12,bw-24,bh-24,22);c.clip();
    c.fillStyle=C.orange;c.fillRect(bx+12,by+bh-12-level,bw-24,level);c.restore();
    for(let i=1;i<s.capacity;i++)line(c,bx+17,by+bh-12-i*(bh-24)/s.capacity,bx+bw-17,by+bh-12-i*(bh-24)/s.capacity,'#efede58c',2);
    text(c,s.tokens.toFixed(1),960,655,116,C.ink,'Anton','center');
    label(c,`CAPACITY ${s.capacity}`,960,848,C.dim,'center',23);
    label(c,`+ ${s.rate.toFixed(1)} TOKEN / SECOND`,960,343,C.ink,'center',26);
    line(c,960,366,960,410,C.orange,3);
    const refillPhase=(t*s.rate)%1;circle(c,960,366+refillPhase*43,7,C.orange);
    label(c,'INCOMING REQUESTS',285,444,C.dim,'center');
    label(c,'ALLOW',1480,444,C.green,'center');
    label(c,'RATE LIMIT',1480,719,C.orange,'center');
    line(c,130,575,772,575,C.line,2);arrow(c,698,575,C.ink);
    line(c,1148,575,1740,575,C.line,2);arrow(c,1666,575,C.green);
    line(c,1148,575,1260,760,C.line,2);line(c,1260,760,1740,760,C.line,2);arrow(c,1666,760,C.orange);
    // Each request reaches the decision point exactly when the resource is consumed.
    for(let i=0;i<events.length;i++) {
      const when=events[i],age=t-when;
      if(age<-.8||age>1)continue;
      const result=s.log.find(e=>e.when===when);const ok=result?result.ok:true;
      let x,y;
      if(age<0){x=mix(135,782,ease((age+.8)/.8));y=575}
      else{x=mix(1132,1760,out(age));y=ok?575:mix(575,760,ease(age/.55))}
      c.globalAlpha=age>.8?clamp((1-age)/.2):1;
      round(c,x-41,y-24,82,48,24,age<0?C.ink:ok?C.green:C.orange);
      label(c,`R${String(i+1).padStart(2,'0')}`,x,y+7,C.paper,'center',20);c.globalAlpha=1;
    }
    const latest=s.log.at(-1);
    if(latest&&t-latest.when<.25){c.globalAlpha=(.25-(t-latest.when))/.25;circle(c,960,575,154,latest.ok?'#27785c35':'#f16b4635');c.globalAlpha=1}
    text(c,String(s.accepted).padStart(2,'0'),1480,552,89,C.green,'Anton','center');
    text(c,String(s.rejected).padStart(2,'0'),1480,826,89,C.orange,'Anton','center');
    label(c,'1 REQUEST = 1 TOKEN',285,665,C.ink,'center');
    label(c,'AT LEAST 1 TOKEN TO PASS',960,925,C.dim,'center',23);
    line(c,82,995,1838,995,C.line,1);line(c,82,995,82+1756*t/20,995,C.orange,3);
    label(c,'A DETERMINISTIC, CONTINUOUS-REFILL MODEL',82,1043,C.dim,'left',20);
    label(c,`${t.toFixed(2).padStart(5,'0')} / 20.00`,1838,1043,C.ink,'right',20);
    return s;
  }
  function render(c,mode,t,opts) {
    c.save();c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;
    c.clearRect(0,0,W,H);const result=mode==='bucket'?bucket(c,t,opts):showreel(c,t);c.restore();return result;
  }
  const api={W,H,C,events,render,bucketState};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  global.MotionEngine=api;
})(globalThis);
