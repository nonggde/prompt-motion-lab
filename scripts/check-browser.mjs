import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {chromium} from 'playwright';
const port=4185,url=process.env.TEST_URL||`http://127.0.0.1:${port}`;
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
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text())});
  await page.goto(url);await page.waitForFunction(()=>document.querySelector('#catalog-stats').textContent.includes('32'));
  await page.evaluate(()=>window.seek(6.2));
  assert.equal(await page.locator('#stage').getAttribute('width'),'1920');
  assert.match(await page.locator('#catalog-stats').innerText(),/32/);
  await page.locator('#language').click();assert.equal(await page.locator('html').getAttribute('lang'),'en');
  assert.match(await page.locator('h1').innerText(),/In motion/);
  await page.locator('#category').selectOption('interactive');
  assert.match(await page.locator('#results-count').innerText(),/^8 results/);
  await page.locator('#category').selectOption('all');await page.locator('#search').fill('token');
  assert.ok(await page.locator('.prompt-card').count()>0);assert.match(await page.locator('.prompt-card h3').first().innerText(),/令牌桶|Token bucket/i);
  await page.locator('#search').fill('this-query-should-have-zero-results-918274');assert.equal(await page.locator('.prompt-card').count(),0);
  await page.locator('#search').fill('');await page.locator('#load-more').click();assert.equal(await page.locator('.prompt-card').count(),24);
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
  await mkdir('test-results',{recursive:true});
  await page.screenshot({path:'test-results/desktop-en.png',fullPage:true});
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
  if(!process.env.TEST_URL) {
    await page.route('http://**/*',route=>route.abort());await page.route('https://**/*',route=>route.abort());
    await page.goto(pathToFileURL(path.resolve('dist/index.html')).href);
    await page.waitForFunction(()=>document.querySelector('#catalog-stats').textContent.includes('32'));
    assert.equal(await page.locator('#catalog-error').isVisible(),false);
    await page.evaluate(()=>window.seek(6.2));assert.equal(await page.evaluate(()=>document.fonts.check('16px Anton')),true);
  }
  assert.deepEqual(errors,[]);
  console.log('PASS bilingual navigation, search/filter/pagination, seek/play/audio, bucket settings, four responsive widths, and offline build');
} finally {await browser?.close();server?.kill();}
