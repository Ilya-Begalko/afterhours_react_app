import { copyFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vitest/config'

const pagesBase = '/afterhours_react_app/'

function githubPagesSpa(): Plugin {
  let outDir = resolve('dist')

  return {
    name: 'github-pages-spa',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'))
      writeFileSync(resolve(outDir, '.nojekyll'), '')
    },
  }
}

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? pagesBase : '/',
  plugins: [react(), tailwindcss(), githubPagesSpa()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
