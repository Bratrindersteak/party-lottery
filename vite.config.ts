import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // 👈 引入 Node.js 的路径处理模块

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/party-lottery/', // 🚀 核心关键：改成你的 GitHub 仓库名称！前后都要有斜杠.
  resolve: {
    alias: {
      // 💥 核心配置：把 '@' 映射到当前项目的 'src' 绝对路径上
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.xlsx'] // 让 Vite 把 xlsx 当静态资源处理
})
