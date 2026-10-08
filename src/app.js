(function(){
  'use strict';
  const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
  const canvas=$('#stage'),ctx=canvas.getContext('2d'),E=window.MotionEngine,Catalog=window.MotionCatalog;
  let lang='zh',mode='reel',duration=15,t=0,playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,last=0,data=[],shown=12;
  let audioCtx=null,audioSource=null,sound=false,toastTimer,audioTimer;
  const AudioContextClass=window.AudioContext||window.webkitAudioContext;
  try{lang=localStorage.getItem('motion-language')||'zh';if(!['zh','en'].includes(lang))lang='zh'}catch{}
  const tr=(zh,en)=>lang==='zh'?zh:en;
  const cats={zh:{motion:'动态图形',explainer:'科普解释','3d':'3D 场景',interactive:'游戏与交互'},en:{motion:'Motion graphics',explainer:'Explainers','3d':'3D scenes',interactive:'Games & interactive'}};
  const template={zh:`<role>你是一位动效导演。按我的需求完成可复现的视频与源码。</role>\n<inputs>主题：[填写]；观众：[填写]；目标：[填写]；时长：[15 秒]；画幅：[16:9]；语言：[中文]；素材：[提供的链接或文件]。缺少非关键项时自行选择并记录。</inputs>\n<direction>一个主视觉概念，一套字体，一个强调色。每个镜头只讲一件事。明确哪些参考需要保留、哪些风格需要避免。</direction>\n<structure>先写逐镜头时间表：起止时间、画面、字幕、转场、声音。先做关键帧或短样片，检查后再渲染全片。</structure>\n<build>按内容选择 Canvas、SVG、Three.js 或已有视频框架。每帧由时间与固定配置决定，随机数固定种子。画面与声音使用同一时间线。</build>\n<verify>检查关键帧、切镜前后、字体溢出、音画时点、文件时长和能否播放。</verify>\n<deliver>交付 MP4、可交互预览、源码、制作简报与素材署名。需要付费服务或缺少依赖时先说明具体缺口，未经授权不要消费。</deliver>`,en:`<role>You are a motion director. Deliver a reproducible video and its source for my needs.</role>\n<inputs>Topic: [fill in]; audience: [fill in]; objective: [fill in]; duration: [15 seconds]; aspect: [16:9]; language: [English]; assets: [links or files]. Make and record reasonable choices for noncritical omissions.</inputs>\n<direction>One visual idea, one type system, one accent. One idea per shot. State what to preserve in references and what to avoid.</direction>\n<structure>Write a timed shot list: start/end, visuals, captions, transition, audio. Inspect keyframes or a short sample before the full render.</structure>\n<build>Choose Canvas, SVG, Three.js, or an existing video framework to match the content. Frames depend on time and fixed config; seed randomness. Use the same timeline for picture and sound.</build>\n<verify>Check keyframes, both sides of cuts, text overflow, sound timing, output duration and playback.</verify>\n<deliver>MP4, interactive preview, source, brief and asset credits. Report missing tools or paid-service needs before using them; do not incur unapproved cost.</deliver>`};
  function toast(message){$('#toast').textContent=message;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,2500)}
  async function copy(value){try{await navigator.clipboard.writeText(value);toast(tr('已复制，可以交给你的 AI','Copied — ready for your AI'))}catch{toast(tr('复制未成功，请展开原文后手动复制','Copy unavailable — expand the text and copy it manually'))}}
  function draw(){if(mode==='pulse')MotionPulse.render(ctx,t,{});else E.render(ctx,mode,t,{capacity:+$('#capacity').value,rate:+$('#rate').value});$('#timeline').value=t;$('#time').textContent=`${t.toFixed(2).padStart(5,'0')} / ${duration.toFixed(2)}`}
  function updateBucket(){if(mode!=='bucket')return;const s=E.bucketState(t,+$('#capacity').value,+$('#rate').value);$('#bucket-summary').textContent=tr(`桶内 ${s.tokens.toFixed(1)} · 通过 ${s.accepted} · 限流 ${s.rejected}`,`Tokens ${s.tokens.toFixed(1)} · Allowed ${s.accepted} · Limited ${s.rejected}`)}
  function stopAudio(){if(audioSource){try{audioSource.stop()}catch{}audioSource=null}}
  function syncAudio(){stopAudio();if(!sound||!playing||t>=duration)return;if(!AudioContextClass){toast(tr('当前浏览器不支持网页声音','Web audio is not supported in this browser'));return}if(!audioCtx)audioCtx=new AudioContextClass();audioCtx.resume();const samples=MotionAudio.makeSamples(duration,audioCtx.sampleRate,mode==='pulse'?'reel':mode,{capacity:+$('#capacity').value,rate:+$('#rate').value});const b=audioCtx.createBuffer(1,samples.length,audioCtx.sampleRate);b.copyToChannel(samples,0);audioSource=audioCtx.createBufferSource();audioSource.buffer=b;audioSource.connect(audioCtx.destination);audioSource.start(0,t)}
  function playLabel(){$('#play').textContent=playing?tr('暂停','Pause'):tr('播放','Play');$('#play').setAttribute('aria-label',$('#play').textContent)}
  function setMode(next){mode=next;duration={reel:15,bucket:20,pulse:12}[mode]||15;t=0;$('#timeline').max=duration;$$('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));$('#bucket-controls').hidden=mode!=='bucket';$('#spec').textContent=`${duration} SEC · 1080P · 60 FPS EXPORT`;$('#download-video').href=`media/${mode==='reel'?'form-flow':mode==='bucket'?'token-bucket':'pulse-grid'}.mp4`;refreshWork();draw();updateBucket();syncAudio()}
  function refreshWork(){
    $('#work-title').textContent=mode==='reel'?'FORM & FLOW':mode==='bucket'?tr('令牌桶：允许突发，控制速率','Token bucket: allow bursts, cap the rate'):'PULSE / GRID';
    $('#work-description').textContent=mode==='reel'?tr('15 秒，四个镜头。一颗圆，变成形状、流动与节奏。','15 seconds, four shots. A circle becomes shape, flow and rhythm.'):mode==='bucket'?tr('20 秒，看每一次请求如何消耗令牌。试着改变容量和补充速度。','20 seconds. Watch each request spend a token; explore capacity and refill rate.'):tr('12 秒，24 个方格先逐行再逐列传递信号，最后收束成精确网格。','12 seconds. A signal travels through 24 cells row by row, then column by column, before settling into a precise grid.');
    canvas.setAttribute('aria-label',mode==='reel'?tr('FORM & FLOW：动态字体与三维点阵雕塑的十五秒动效作品','FORM & FLOW: a fifteen-second study in kinetic type and a projected 3D point sculpture'):mode==='bucket'?tr('令牌桶限流动画，可调整容量和补充速度','Animated token bucket with adjustable capacity and refill rate'):tr('PULSE / GRID：24 个方格中的确定性信号传播实验','PULSE / GRID: a deterministic signal experiment across 24 cells'));
    const box=$('#brief-content');box.replaceChildren();
    const p=document.createElement('p');p.textContent=mode==='reel'?tr('实验记录：四镜头简报使用奶油白、炭黑和橘色，所有画面按时间重现。','Experiment note: a four-shot brief uses cream, charcoal and orange; every frame is derived from time.'):mode==='bucket'?tr('实验记录：容量、补充和请求事件由同一模型驱动，拖动时间线会重新计算。','Experiment note: capacity, refill and request events share one model; seeking recomputes them.'):tr('实验记录：24 个方格由固定的行波和列波驱动，最后平滑回到网格。','Experiment note: 24 cells follow fixed row and column waves before settling into a grid.');box.append(p);
    const pre=document.createElement('pre');pre.textContent=mode==='reel'?tr('0–3.5s  IDEAS TAKE SHAPE：字体揭幕与圆形\n3.5–8s  FORM INTO FLOW：5,720 点的三维环面\n8–11.5s MAKE IT MOVE：反色字体与旋转星形\n11.5–15s FORM & FLOW：收束、定格\n声音：120 BPM，代码合成鼓、低音和琶音','0–3.5s  IDEAS TAKE SHAPE: masked type + circle\n3.5–8s  FORM INTO FLOW: a 5,720-point torus\n8–11.5s MAKE IT MOVE: inverted type + asterisk\n11.5–15s FORM & FLOW: resolve and hold\nSound: 120 BPM, synthesized drums, bass and arpeggio'):mode==='bucket'?tr('0–4s 建立容量\n4–8s 出现突发请求\n8–12s 强调拒绝条件\n12–16s 连续补充\n16–20s 收束','0–4s establish capacity\n4–8s burst requests\n8–12s show rejection\n12–16s continuous refill\n16–20s resolve'):tr('0–2.1s 建立 24 个方格\n2.1–4.8s 信号逐行传播\n4.8–8.1s 信号逐列传播\n8.1–12s 回到精确网格','0–2.1s establish 24 cells\n2.1–4.8s row-by-row signal\n4.8–8.1s column-by-column signal\n8.1–12s settle into a precise grid');box.append(pre);
    const note=document.createElement('p');note.className='brief-note';note.textContent=tr('实验记录：画面、声音和检查都由同一条时间线驱动。','Experiment note: picture, sound and checks share one timeline.');box.append(note);
  }
  function catalog(){
    const q=$('#search').value.trim(),cat=$('#category').value,tech=$('#tech').value;
    const records=Catalog.filter(data,{query:q,category:cat,tech});
    $('#clear-filters').disabled=!q&&cat==='all'&&tech==='all';
    $('#results-count').textContent=tr(`${records.length} 条结果 · 显示 ${Math.min(shown,records.length)} 条`,`${records.length} results · showing ${Math.min(shown,records.length)}`);
    const grid=$('#prompt-grid');grid.replaceChildren();
    for(const d of records.slice(0,shown)){
      const card=document.createElement('article');card.className='prompt-card';
      const meta=document.createElement('div');meta.className='card-meta';
      const category=document.createElement('span');category.textContent=cats[lang][d.category];
      const status=document.createElement('span');status.className='full-status';status.textContent=tr('原创配方','Original recipe');meta.append(category,status);
      const author=document.createElement('h3');author.textContent=lang==='zh'?d.title_zh:d.title_en;
      const preview=document.createElement('p');preview.className='prompt-preview';preview.textContent=lang==='zh'?d.prompt_zh:d.prompt_en;
      const tags=document.createElement('div');tags.className='prompt-tags';tags.textContent=d.tech_tags.join(' / ');
      const bottom=document.createElement('div');bottom.className='card-bottom';
      const note=document.createElement('span');note.className='card-source';note.textContent=tr('实验配方','Experimental recipe');
      const btn=document.createElement('button');btn.type='button';btn.className='copy-button';btn.textContent=tr('复制完整配方 ↗','Copy full recipe ↗');btn.addEventListener('click',()=>copy(Catalog.fullPrompt(d,lang)));bottom.append(note,btn);
      const detail=document.createElement('details');detail.className='prompt-detail';const summary=document.createElement('summary');summary.textContent=tr('展开制作合同','Read production contract');const pre=document.createElement('pre');pre.textContent=Catalog.fullPrompt(d,lang);detail.append(summary,pre);
      card.append(meta,author,preview,tags,bottom,detail);grid.append(card);
    }
    if(!records.length){const p=document.createElement('p');p.className='empty';p.textContent=tr('没有找到结果，试试其他关键词。','No matches. Try another keyword.');grid.append(p)}
    $('#load-more').hidden=shown>=records.length;
    if(data.length){const directions=new Set(data.map(d=>d.category)).size;$('#catalog-stats').textContent=tr(`${data.length} 条原创双语配方 · ${directions} 个方向 · 配方待实验验收`,`${data.length} original bilingual recipes · ${directions} directions · recipes awaiting experiment validation`);$('[data-catalog-count]').textContent=tr(`${data.length} 条原创配方`,`${data.length} original recipes`)}
  }
  function applyLanguage(){
    document.documentElement.lang=lang==='zh'?'zh-CN':'en';document.title=tr('Prompt Motion Lab — 从提示词到动态影像','Prompt Motion Lab — From prompts to motion');
    const set=(sel,zh,en,html=false)=>{const el=$(sel);if(el)el[html?'innerHTML':'textContent']=tr(zh,en)};
    set('nav a:nth-child(1)','作品实验室','Studio');set('nav a:nth-child(2)','提示词库','Prompts');set('nav a:nth-child(3)','制作方法','Workflow');
    set('.intro .eyebrow','AN OPEN MOTION PLAYGROUND · 开源动效实验室','AN OPEN MOTION PLAYGROUND');set('.intro h1','让想法<br><span>动起来。</span>','Ideas.<br><span>In motion.</span>',true);
    set('.intro-side>p','从一句提示词，到一段有节奏的影像。<br>看作品，拆方法，做自己的下一条。','From a prompt to a moving idea.<br>Watch, explore, and make your next film.',true);
    $$('.intro-meta span').forEach((e,i)=>e.textContent=tr(['原创双语配方','3 个原创示例','无须 API Key'][i],['Original bilingual recipes','3 original demos','No API key'][i]));
    set('[data-mode="bucket"]','02 / 令牌桶','02 / TOKEN BUCKET');set('[data-mode="pulse"]','03 / PULSE / GRID','03 / PULSE / GRID');set('#download-video','下载成片 ↓','Download video ↓');set('.work-actions a:last-child','查看源码 ↗','Source code ↗');
    set('.brief summary','这一条是怎么做的？<span>BRIEF + EXPERIMENT ↘</span>','How was this made?<span>BRIEF + EXPERIMENT ↘</span>',true);
    set('.library h2','好的作品，从好的问题开始。','Good motion starts with good questions.');set('.library .section-heading>p','我们自己的双语配方。<br>拿去实验，再把结果带回来。','Our own bilingual recipes.<br>Test them, then bring the result back.',true);
    $('#search').placeholder=tr('搜索主题、技术…','Search topics, techniques…');$('#search').setAttribute('aria-label',tr('搜索提示词','Search prompts'));$('#category').setAttribute('aria-label',tr('作品分类','Category'));$('#tech').setAttribute('aria-label',tr('实现技术','Rendering technology'));
    $$('#category option').forEach(o=>o.textContent=o.value==='all'?tr('全部分类','All categories'):cats[lang][o.value]);
    $('#tech option').textContent=tr('全部技术','All technologies');set('#clear-filters','清除筛选','Clear filters');set('#download-catalog','下载配方 JSON ↓','Download recipes JSON ↓');set('#load-more','再看 12 条 ↓','Show 12 more ↓');
    set('.workflow h2','少一点玄学，多一点导演思维。','Less guessing. More directing.');set('.workflow .section-heading>a','完整制作指南 ↗','Production guide ↗');$('.workflow .section-heading>a').href=`https://github.com/nonggde/prompt-motion-lab/blob/main/docs/workflow.${lang==='zh'?'zh-CN':'en'}.md`;
    const z=[['说清想法','主题、观众、时长、画幅。把真实内容和参考交给模型。'],['写出镜头','一个镜头讲一件事。固定字体、配色、节拍和转场。'],['先看样片','在关键时间点看静帧，检查字是否可读、动作是否清楚。'],['导出成片','按同一条时间线渲染画面与声音，得到可复现的影片。']];
    const en=[['Define the idea','Topic, audience, duration and aspect. Give your AI real content and references.'],['Direct each shot','One idea per shot. Define type, palette, beats and transitions.'],['Inspect a sample','Review keyframes. Check readable type and purposeful movement.'],['Render the film','Use one timeline for picture and sound. Make the output reproducible.']];
    $$('.steps article').forEach((a,i)=>{a.querySelector('h3').textContent=tr(z[i][0],en[i][0]);a.querySelector('p').textContent=tr(z[i][1],en[i][1])});
    set('.template h3','把想法填进去，开始下一条。','Your next film starts here.');set('.template p:not(.eyebrow)','一份结构化的制作简报，比一句“全力以赴”更容易控制结果。','A structured brief makes the result easier to direct.');set('#copy-template','复制创作模板 ↗','Copy a creative brief ↗');
    set('#skill-title','让你的 AI 学会这套制作流程。','Give your AI this production workflow.');set('#skill-description','安装技能后，把需求交给能执行代码的 AI，制作提示词、分镜与成片。','Install the skill, then give your brief to a code-capable AI to plan, storyboard and render.');set('#skill-link','获取 AI 技能 ↗','Get the AI skill ↗');
    set('.footer p','原创示例、实验配方与工具以 MIT 协议开源。','Original demos, experiment recipes and tools are released under MIT.');set('.footer a:first-child','GitHub 项目 ↗','GitHub project ↗');set('.footer a:nth-child(2)','获取 AI Skill ↗','Get the AI skill ↗');set('.footer a:last-child','实验文档 ↗','Experiment docs ↗');
    $('.footer a:first-child').href='https://github.com/nonggde/prompt-motion-lab';$('.footer a:nth-child(2)').href='https://github.com/nonggde/prompt-motion-lab/tree/main/skills/prompt-to-video';$('.footer a:last-child').href=`https://github.com/nonggde/prompt-motion-lab/blob/main/docs/workflow.${lang==='zh'?'zh-CN':'en'}.md`;
    $('.brand').setAttribute('aria-label',tr('Prompt Motion Lab 首页','Prompt Motion Lab home'));$('nav').setAttribute('aria-label',tr('主导航','Main navigation'));$('.studio').setAttribute('aria-label',tr('原创作品播放器','Original films player'));$('.mode-buttons').setAttribute('aria-label',tr('选择作品','Choose a film'));$('label[for=timeline]').textContent=tr('播放位置','Playback position');
    $('#language').textContent=lang==='zh'?'EN':'中文';$('#language').setAttribute('aria-label',tr('Switch to English','切换到中文'));
    $('#sound').textContent=sound?tr('声音：开','Sound: on'):tr('声音：关','Sound: off');
    // Preserve sliders while translating their label text nodes.
    const labels=$$('#bucket-controls label');labels[0].firstChild.textContent=tr('容量 ','Capacity ');labels[1].firstChild.textContent=tr('补充速度 ','Refill ');
    $('#rate-value').textContent=`${(+$('#rate').value).toFixed(1)}${tr(' / 秒',' / sec')}`;
    playLabel();refreshWork();catalog();updateBucket();
  }
  $('#language').addEventListener('click',()=>{lang=lang==='zh'?'en':'zh';try{localStorage.setItem('motion-language',lang)}catch{}applyLanguage()});
  $$('[data-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
  $('#play').addEventListener('click',()=>{if(t>=duration)t=0;playing=!playing;playLabel();syncAudio();draw()});
  $('#timeline').addEventListener('input',()=>{t=+$('#timeline').value;draw();updateBucket();syncAudio()});
  $('#sound').addEventListener('click',()=>{sound=!sound;$('#sound').setAttribute('aria-pressed',String(sound));$('#sound').textContent=sound?tr('声音：开','Sound: on'):tr('声音：关','Sound: off');syncAudio()});
  ['capacity','rate'].forEach(id=>$('#'+id).addEventListener('input',()=>{$('#capacity-value').textContent=$('#capacity').value;$('#rate-value').textContent=`${(+$('#rate').value).toFixed(1)}${tr(' / 秒',' / sec')}`;draw();updateBucket();if(sound){stopAudio();clearTimeout(audioTimer);audioTimer=setTimeout(syncAudio,100)}}));
  ['search','category','tech'].forEach(id=>$('#'+id).addEventListener(id==='search'?'input':'change',()=>{shown=12;catalog()}));
  $('#clear-filters').addEventListener('click',()=>{$('#search').value='';$('#category').value='all';$('#tech').value='all';shown=12;catalog()});
  $('#load-more').addEventListener('click',()=>{shown+=12;catalog()});$('#copy-template').addEventListener('click',()=>copy(template[lang]));
  document.addEventListener('visibilitychange',()=>{if(document.hidden){playing=false;stopAudio();playLabel()}last=0});
  let summaryTime=-1;
  function tick(now){if(last&&playing){t=Math.min(duration,t+(now-last)/1000);if(t>=duration){playing=false;playLabel();stopAudio()}}last=now;draw();if(Math.floor(t*2)!==summaryTime){summaryTime=Math.floor(t*2);updateBucket()}requestAnimationFrame(tick)}
  window.seek=seconds=>{t=Math.max(0,Math.min(duration,+seconds||0));playing=false;stopAudio();playLabel();draw();updateBucket()};
  window.motionLab={setMode,getState:()=>({mode,t,playing,lang}),setLanguage:value=>{lang=value==='en'?'en':'zh';applyLanguage()}};
  async function init(){await document.fonts.ready;applyLanguage();draw();requestAnimationFrame(tick);try{if(window.PROMPT_DATA)data=window.PROMPT_DATA;else{const response=await fetch('data/prompts.json');if(!response.ok)throw Error('Catalog request failed');data=await response.json()}catalog()}catch{const e=$('#catalog-error');e.hidden=false;e.textContent=tr('提示词载入失败。请用 npm start 启动，或打开构建后的 dist/index.html。','Could not load prompts. Run npm start, or open the built dist/index.html.');$('#catalog-stats').textContent=tr('数据暂不可用','Data unavailable')}}
  init();
})();
