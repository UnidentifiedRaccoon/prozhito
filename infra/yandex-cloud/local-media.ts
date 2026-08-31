import {createReadStream,existsSync} from "node:fs";
import {resolve} from "node:path";
import type {Plugin,ViteDevServer} from "vite";
export function localMedia():Plugin {
  const directory=resolve(".work/prozhito/seed/media");
  const attach=(server:Pick<ViteDevServer,"middlewares">)=>{server.middlewares.use((request,response,next)=>{
    const name=request.url?.split("?")[0];
    if(!name?.startsWith("/media/"))return next();
    const file=name.slice(7);
    if(!/^[a-zA-Z0-9_.-]+\.(jpg|jpeg|webp|png)$/.test(file)||file.includes("..")) {response.statusCode=404;response.end();return;}
    const path=resolve(directory,file);
    if(!existsSync(path)){response.statusCode=404;response.end();return;}
    response.setHeader("Content-Type",file.endsWith(".png")?"image/png":file.endsWith(".webp")?"image/webp":"image/jpeg");
    createReadStream(path).pipe(response);
  });};
  return {name:"local-seed-media",configureServer:attach,configurePreviewServer:attach};
}
