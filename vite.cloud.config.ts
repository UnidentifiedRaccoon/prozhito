import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import {localMedia} from "./infra/yandex-cloud/local-media.ts";
export default defineConfig({base:"/",cacheDir:"node_modules/.vite-cloud",plugins:[react(),localMedia()],build:{outDir:"dist-cloud",rollupOptions:{input:"cloud.html"}},server:{host:"127.0.0.1",port:5173,proxy:{"/api":{target:"http://127.0.0.1:8080",changeOrigin:false}},fs:{allow:["."]}}});
