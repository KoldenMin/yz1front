import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    server: {
        port: 5174,
        proxy: {
            '/api': {
                target: 'http://localhost:8080', // 你的后端服务地址
                changeOrigin: true,              // 改变请求源
                secure: false,                   // 如果是https接口，需要配置这个参数
                // rewrite: (path) => path.replace(/^\/api/, '') // 可选：如果后端接口不包含/api前缀，可以重写路径
            }
        }
    }
})

