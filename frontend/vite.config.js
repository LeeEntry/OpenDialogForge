import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    server: {
        port: 5174, // 指定本地开发服务器监听 5174 端口（即 http://localhost:5175）
        proxy: { // 配置反向代理，主要用于前后端分离开发时，解决跨域请求问题
            '/api': {
                // 将 /api 的请求转发到后端服务（监听在 9000 端口）
                // 这里要和你的后端端口一致
                target: 'http://localhost:9000',
                // 将请求头中的 origin 设置为目标地址（有些后端会校验 origin）
                changeOrigin: true,
                // 请求路径重写，这里其实等价于不变（通常用于去掉或替换前缀，比如把 /api 换成 /）
                rewrite: (path) => path.replace(/^\/api/, '/api'),
            },
        },
    },
})