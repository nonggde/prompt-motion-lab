const test = require('node:test');
const assert = require('node:assert/strict');
const prompts = require('../data/prompts.json');

test('recipe library is bilingual, original and balanced', () => {
  assert.equal(prompts.length, 32);
  assert.equal(new Set(prompts.map(item => item.id)).size, prompts.length);
  const counts = prompts.reduce((map, item) => map.set(item.category, (map.get(item.category) || 0) + 1), new Map());
  assert.deepEqual(Object.fromEntries(counts), {motion: 8, explainer: 8, '3d': 8, interactive: 8});
  for (const item of prompts) {
    assert.equal(item.author, 'Prompt Motion Lab');
    assert.equal(item.prompt_partial, false);
    assert.ok(item.title_zh && item.title_en && item.prompt_zh && item.prompt_en);
    assert.ok(Array.isArray(item.tech_tags) && item.tech_tags.length > 0);
  }
});
