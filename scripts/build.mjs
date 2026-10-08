import {readFile,writeFile,mkdir,cp,rm} from 'node:fs/promises';
const read=p=>readFile(p,'utf8');
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});
let html=await read('index.html'),css=await read('src/style.css');
const font=(await readFile('assets/fonts/Anton-Regular.ttf')).toString('base64');
css=css.replace("url('../assets/fonts/Anton-Regular.ttf')",`url('data:font/ttf;base64,${font}')`);
html=html.replace('<link rel="stylesheet" href="src/style.css">',()=>`<style>${css}</style>`);
const prompts=JSON.parse(await read('data/prompts.json'));
html=html.replace('<script src="src/engine.js"></script>',()=>`<script>window.PROMPT_DATA=${JSON.stringify(prompts).replaceAll('<','\\u003c')};</script>\n<script src="src/engine.js"></script>`);
for(const file of ['engine','audio','pulse-scene','catalog','app']){
 const source=(await read(`src/${file}.js`)).replaceAll('</script','<\\/script');
 html=html.replace(`<script src="src/${file}.js"></script>`,()=>`<script>${source}</script>`);
}
await writeFile('dist/index.html',html);
await cp('media','dist/media',{recursive:true});
await cp('data','dist/data',{recursive:true});
await cp('LICENSE','dist/LICENSE');await cp('LICENSES','dist/LICENSES',{recursive:true});
await cp('THIRD_PARTY_NOTICES.md','dist/THIRD_PARTY_NOTICES.md');
await cp('robots.txt','dist/robots.txt');
await cp('sitemap.xml','dist/sitemap.xml');
await cp('site.webmanifest','dist/site.webmanifest');
console.log(`Built dist/index.html with ${prompts.length} original recipes and offline fonts.`);
