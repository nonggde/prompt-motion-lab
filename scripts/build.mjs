import {readFile,writeFile,mkdir,cp,rm} from 'node:fs/promises';
const read=p=>readFile(p,'utf8');
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});
let html=await read('index.html'),css=await read('src/style.css');
const font=(await readFile('assets/fonts/Anton-Regular.ttf')).toString('base64');
css=css.replace("url('../assets/fonts/Anton-Regular.ttf')",`url('data:font/ttf;base64,${font}')`);
html=html.replace('<link rel="stylesheet" href="src/style.css">',()=>`<style>${css}</style>`);
const videos=JSON.parse(await read('data/videos.json'));
html=html.replace('<script src="src/engine.js"></script>',()=>`<script>window.PROMPT_DATA=${JSON.stringify(videos).replaceAll('<','\\u003c')};</script>\n<script src="src/engine.js"></script>`);
for(const file of ['engine','audio','app']){
 const source=(await read(`src/${file}.js`)).replaceAll('</script','<\\/script');
 html=html.replace(`<script src="src/${file}.js"></script>`,()=>`<script>${source}</script>`);
}
await writeFile('dist/index.html',html);
await cp('media','dist/media',{recursive:true});
await cp('LICENSE','dist/LICENSE');await cp('LICENSES','dist/LICENSES',{recursive:true});
await cp('THIRD_PARTY_NOTICES.md','dist/THIRD_PARTY_NOTICES.md');
console.log(`Built dist/index.html with ${videos.length} source records and offline fonts.`);
