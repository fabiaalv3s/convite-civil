import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Substitua 'nome-do-seu-repositorio' pelo nome exato do repositório que você criar no GitHub
export default defineConfig({
  plugins: [react()],
  base: '/nome-do-seu-repositorio/', 
})