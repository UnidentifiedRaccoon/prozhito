import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import {localMedia} from "./infra/yandex-cloud/local-media.ts";
export default defineConfig({root:"admin",base:"/",cacheDir:"../node_modules/.vite-admin",plugins:[react(),localMedia()],build:{outDir:"../dist-admin",emptyOutDir:true,rollupOptions:{input:{index:"admin/index.html",preview:"admin/preview.html"}}},server:{host:"127.0.0.1",port:5174,proxy:{"/api":{target:"http://127.0.0.1:8080",changeOrigin:false}},fs:{allow:[".."]}}});
