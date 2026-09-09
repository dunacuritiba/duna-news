import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/duna-news/', // Substitua "duna-news" pelo nome exato do repositório no GitHub
})