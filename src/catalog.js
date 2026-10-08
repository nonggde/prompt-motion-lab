(function(global){
  'use strict';
  const normalize=value=>String(value||'').normalize('NFKC').toLowerCase();
  function technologies(item){
    const declared=['canvas','svg','dom','threejs'].filter(tag=>item.tech_tags.includes(tag));
    return declared.length?declared:[item.category==='3d'?'threejs':'canvas'];
  }
  function filter(items,{query='',category='all',tech='all'}={}){
    const words=normalize(query).trim().split(/\s+/).filter(Boolean);
    return items.filter(item=>{
      if(category!=='all'&&item.category!==category)return false;
      if(tech!=='all'&&!technologies(item).includes(tech))return false;
      const text=normalize([item.title_zh,item.title_en,item.prompt_zh,item.prompt_en,item.author,...item.tech_tags].join(' '));
      return words.every(word=>text.includes(word));
    });
  }
  function fullPrompt(item,language='zh'){
    const zh=language!=='en',recipe=item.recipe||{};
    const checks=recipe[zh?'checks_zh':'checks_en']||[];
    const audio=recipe[zh?'audio_zh':'audio_en']||(zh?'按正文的声音要求制作；声音事件与画面共用时间线，另交无声版本。':recipe.audio||'Follow the brief audio plan; use one timeline for picture and sound and include a silent version.');
    const defaults=zh?[
      '任意时间定位和乱序重复渲染同一时间点，画面应一致；随机数固定种子。',
      '检查关键帧、转场两侧、文字安全区与手机尺寸；确认主体与标签没有遮挡。',
      '核对 MP4 的尺寸、帧率、时长和预期音轨，并完整解码文件。'
    ]:[
      'Seek and render timestamps out of order; repeated frames must match. Seed randomness.',
      'Inspect keyframes, both sides of transitions, text safe areas and a phone-sized view; no subject or label collisions.',
      'Verify MP4 dimensions, fps, duration and expected audio, and decode the complete file.'
    ];
    return [
      item[zh?'prompt_zh':'prompt_en'],
      zh?'制作合同：':'Production contract:',
      zh?'渲染：实现 render(t)，使用固定输入和种子，等待字体与素材加载完成。':'Render: expose render(t) with fixed inputs and seed; wait for fonts and assets.',
      `${zh?'声音':'Audio'}: ${audio}`,
      zh?'验收：':'Acceptance:',
      ...[...checks,...defaults].map(check=>`- ${check}`),
      zh?'交付：关键帧、可运行源码、预览、MP4 与实验记录。先记录实际证据，再标记验收状态。':'Deliver: keyframes, runnable source, preview, MP4 and an experiment record. Assign status only after recording evidence.'
    ].join('\n\n');
  }
  const api={technologies,filter,fullPrompt};
  global.MotionCatalog=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
