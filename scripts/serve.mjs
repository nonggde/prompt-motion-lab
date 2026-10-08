import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(process.argv.includes('--dist')?'dist':'.');
const port=Number(process.env.PORT||4173);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.ttf':'font/ttf','.mp4':'video/mp4','.png':'image/png','.webp':'image/webp','.md':'text/plain; charset=utf-8'};
http.createServer(async(req,res)=>{
  try{
    const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    let file=path.resolve(root,'.'+name);if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return}
    if((await stat(file)).isDirectory())file=path.join(file,'index.html');
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(await readFile(file));
  }catch{res.writeHead(404,{'Content-Type':'text/plain'}).end('Not found')}
}).listen(port,'127.0.0.1',()=>console.log(`Prompt Motion Lab → http://127.0.0.1:${port}`));
