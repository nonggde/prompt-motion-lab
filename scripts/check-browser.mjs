import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdir,readFile} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {chromium} from 'playwright';
const port=4185,url=process.env.TEST_URL||`http://127.0.0.1:${port}`;
const recipes=JSON.parse(await readFile('data/prompts.json','utf8'));
const expectedCount=recipes.length;
let server,browser;
const errors=[];
try {
  if(!process.env.TEST_URL) {
    server=spawn(process.execPath,['scripts/serve.mjs'],{env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe']});
    await new Promise((resolve,reject)=>{server.on('error',reject);server.on('exit',code=>reject(Error(`Server exited ${code}`)));server.stdout.once('data',resolve)});
  }
  browser=await chromium.launch({headless:true,...(process.env.BROWSER_PATH?{executablePath:process.env.BROWSER_PATH}:{})});
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  // Pin the readback backend so anti-aliasing does not change after pixel inspection.
  await page.addInitScript(()=>{
    const getContext=HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext=function(type,options){return getContext.call(this,type,type==='2d'?{...options,willReadFrequently:true}:options)};
  });
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text())});
  await page.goto(url);await page.waitForFunction(count=>document.querySelector('#catalog-stats').textContent.startsWith(String(count)),expectedCount);
  await page.evaluate(()=>window.seek(6.2));
  assert.equal(await page.locator('#stage').getAttribute('width'),'1920');
  assert.ok((await page.locator('#catalog-stats').innerText()).includes(String(expectedCount)));
  assert.match(await page.locator('[data-catalog-count]').innerText(),new RegExp(String(expectedCount)));
  await page.locator('#language').click();assert.equal(await page.locator('html').getAttribute('lang'),'en');
  assert.match(await page.locator('h1').innerText(),/In motion/);
  await page.locator('#category').selectOption('interactive');
  assert.ok((await page.locator('#results-count').innerText()).startsWith(`${recipes.filter(item=>item.category==='interactive').length} results`));
  await page.locator('#category').selectOption('all');await page.locator('#search').fill('token bucket');
  assert.ok(await page.locator('.prompt-card').count()>0);assert.match(await page.locator('.prompt-card h3').first().innerText(),/令牌桶|Token bucket/i);
  await page.locator('#search').fill('this-query-should-have-zero-results-918274');assert.equal(await page.locator('.prompt-card').count(),0);
  await page.locator('#search').fill('');await page.locator('#load-more').click();assert.equal(await page.locator('.prompt-card').count(),24);
  await page.locator('#tech').selectOption('threejs');
  assert.ok((await page.locator('#results-count').innerText()).startsWith(`${recipes.filter(item=>item.category==='3d'||item.tech_tags.includes('threejs')).length} results`));
  await page.locator('#category').selectOption('interactive');await page.locator('#tech').selectOption('svg');
  const combined=recipes.filter(item=>item.category==='interactive'&&item.tech_tags.includes('svg'));
  assert.ok((await page.locator('#results-count').innerText()).startsWith(`${combined.length} results`));
  await page.locator('#clear-filters').click();assert.equal(await page.locator('.prompt-card').count(),12);
  assert.equal(await page.locator('#clear-filters').isDisabled(),true);
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.copiedRecipe=value}}}));
  await page.locator('.copy-button').first().click();
  assert.match(await page.evaluate(()=>window.copiedRecipe),/Production contract:[\s\S]*Acceptance:[\s\S]*MP4/);
  await page.locator('.prompt-detail').first().locator('summary').click();
  assert.equal(await page.locator('.prompt-detail pre').first().innerText(),await page.evaluate(()=>window.copiedRecipe));
  await page.locator('.prompt-detail').first().locator('summary').click();
  const catalogResponse=await context.request.get(new URL('data/prompts.json',url.endsWith('/')?url:`${url}/`).href);
  assert.equal(catalogResponse.status(),200);assert.equal((await catalogResponse.json()).length,expectedCount);
  await page.locator('[data-mode=bucket]').click();await page.evaluate(()=>window.seek(5.4));
  assert.match(await page.locator('#bucket-summary').innerText(),/Allowed 5 · Limited 1/);
  await page.locator('#capacity').evaluate(el=>{el.value='8';el.dispatchEvent(new Event('input',{bubbles:true}))});
  assert.match(await page.locator('#bucket-summary').innerText(),/Allowed 6 · Limited 0/);
  assert.match(await page.locator('#download-video').getAttribute('href'),/token-bucket.mp4$/);
  await page.evaluate(()=>window.seek(2));assert.match(await page.locator('#time').innerText(),/^02.00/);
  await page.locator('#play').click();await page.waitForFunction(()=>window.motionLab.getState().t>2.05);
  await page.locator('#sound').click();assert.equal(await page.locator('#sound').getAttribute('aria-pressed'),'true');
  await page.locator('#sound').click();await page.evaluate(()=>window.seek(6.2));
  await page.locator('[data-mode=pulse]').click();await page.evaluate(()=>window.seek(8.8));
  assert.match(await page.locator('#work-title').innerText(),/PULSE \/ GRID/);
  assert.match(await page.locator('#download-video').getAttribute('href'),/pulse-grid.mp4$/);
  const hash=()=>{const ctx=document.querySelector('#stage').getContext('2d');const pixels=ctx.getImageData(0,0,1920,1080).data;let value=0;for(let i=0;i<pixels.length;i+=400)value=(value*31+pixels[i])>>>0;return value};
  const stillHash=await page.evaluate(hash);await page.evaluate(()=>window.seek(3));
  assert.notEqual(await page.evaluate(hash),stillHash);
  await page.evaluate(()=>window.seek(8.8));assert.equal(await page.evaluate(hash),stillHash);
  await mkdir('test-results',{recursive:true});
  await page.waitForFunction(()=>document.querySelector('#toast').hidden);
  await page.screenshot({path:'test-results/desktop-en.png',fullPage:true});
  await page.locator('#library').evaluate(el=>window.scrollTo(0,el.offsetTop-24));
  await page.screenshot({path:'test-results/desktop-library-en.png'});
  for(const lang of ['zh','en']) {
    await page.evaluate(value=>window.motionLab.setLanguage(value),lang);
    for(const width of [320,390,768,1280]) {
      await page.setViewportSize({width,height:900});
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
      assert.equal(overflow,false,`${lang}: horizontal overflow at ${width}px`);
    }
  }
  await page.evaluate(()=>window.motionLab.setLanguage('zh'));await page.setViewportSize({width:390,height:900});
  await page.screenshot({path:'test-results/mobile-zh.png',fullPage:true});
  await page.locator('#library').evaluate(el=>window.scrollTo(0,el.offsetTop-24));
  await page.screenshot({path:'test-results/mobile-library-zh.png'});
  await page.locator('.copy-button').first().click();
  assert.match(await page.evaluate(()=>window.copiedRecipe),/制作合同：[\s\S]*验收：[\s\S]*MP4/);
  if(!process.env.TEST_URL) {
    await page.route('http://**/*',route=>route.abort());await page.route('https://**/*',route=>route.abort());
    await page.goto(pathToFileURL(path.resolve('dist/index.html')).href);
    await page.waitForFunction(count=>document.querySelector('#catalog-stats').textContent.startsWith(String(count)),expectedCount);
    assert.equal(await page.locator('#catalog-error').isVisible(),false);
    await page.evaluate(()=>window.seek(6.2));assert.equal(await page.evaluate(()=>document.fonts.check('16px Anton')),true);
  }
  assert.deepEqual(errors,[]);
  console.log(`PASS ${expectedCount} bilingual recipes, combined filters, full-contract copy, JSON download, deterministic canvas, player controls, responsive widths and offline build`);
} finally {await browser?.close();server?.kill();}
