import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // 👈 引入 Node.js 的路径处理模块

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 💥 核心配置：把 '@' 映射到当前项目的 'src' 绝对路径上
      '@': path.resolve(__dirname, './src'),
    },
  },
})
