const test = require('node:test');
const assert = require('node:assert/strict');
const prompts = require('../data/prompts.json');
const catalog = require('../src/catalog.js');

test('recipe library is bilingual, original and balanced', () => {
  assert.ok(prompts.length >= 32);
  assert.equal(new Set(prompts.map(item => item.id)).size, prompts.length);
  const counts = prompts.reduce((map, item) => map.set(item.category, (map.get(item.category) || 0) + 1), new Map());
  assert.deepEqual([...counts.keys()].sort(), ['3d', 'explainer', 'interactive', 'motion']);
  assert.ok([...counts.values()].every(count => count >= 8));
  assert.equal(new Set(prompts.map(item => item.prompt_en.trim())).size, prompts.length);
  for (const item of prompts) {
    assert.equal(item.author, 'Prompt Motion Lab');
    assert.equal(item.prompt_partial, false);
    assert.ok(item.title_zh && item.title_en && item.prompt_zh && item.prompt_en);
    assert.ok(Array.isArray(item.tech_tags) && item.tech_tags.length > 0);
    assert.equal(item.status, 'recipe');
    assert.ok(item.recipe.render && item.recipe.audio);
    if(item.recipe.checks_zh){
      assert.ok(item.recipe.checks_zh.length >= 2);
      assert.equal(item.recipe.checks_zh.length, item.recipe.checks_en.length);
      assert.ok(item.recipe.audio_zh && item.recipe.audio_en);
    }
  }
});

test('combined bilingual search and renderer filtering find relevant recipes', () => {
  const vector = catalog.filter(prompts, {query:'ＶＥＣＴＯＲ diagram', category:'explainer', tech:'canvas'});
  assert.ok(vector.some(item => item.id === 'explainer-vector-search'));
  assert.ok(vector.every(item => item.category === 'explainer' && catalog.technologies(item).includes('canvas')));
  assert.ok(catalog.filter(prompts, {query:'向量'}).some(item => item.id === 'explainer-vector-search'));
  assert.equal(catalog.filter(prompts, {query:'no-match-782534'}).length, 0);
  const spatial = catalog.filter(prompts, {category:'3d', tech:'threejs'});
  assert.equal(spatial.length, prompts.filter(item => item.category === '3d').length);
  assert.equal(catalog.filter(prompts, {category:'3d', tech:'dom'}).length, 0);
  const hybrid=prompts.find(item=>item.id==='motion-product-feature-stack');
  for(const tech of ['canvas','svg'])assert.ok(catalog.filter(prompts,{tech}).includes(hybrid));
});

test('copied recipes include the brief, acceptance checks and deliverables in the requested language', () => {
  const fixture={prompt_zh:'中文简报',prompt_en:'English brief',recipe:{audio_zh:'固定输入触发声音',audio_en:'Fixed-input sound cues',checks_zh:['检查事件次序','检查字形'],checks_en:['Check event order','Check glyphs']}};
  const zh=catalog.fullPrompt(fixture,'zh'),en=catalog.fullPrompt(fixture,'en');
  assert.ok(zh.startsWith(fixture.prompt_zh));
  assert.ok(en.startsWith(fixture.prompt_en));
  assert.match(zh,/固定输入触发声音/);assert.match(zh,/检查事件次序/);assert.match(zh,/完整解码/);
  assert.match(en,/Fixed-input sound cues/);assert.match(en,/Check event order/);assert.match(en,/complete file/);
  assert.ok(!zh.includes('English brief') && !en.includes('中文简报'));
  for(const item of prompts)for(const lang of ['zh','en']){
    const full=catalog.fullPrompt(item,lang);
    assert.ok(full.includes(item[`prompt_${lang}`]) && full.includes('render(t)') && full.includes('MP4'));
  }
});
