import { defineConfig } from 'vite'

// Configuration basique de Vite
export default defineConfig({
  server: {
    host: true,          // permet d’accéder depuis Docker (0.0.0.0)
    port: 5173,          // port interne
  },
})
