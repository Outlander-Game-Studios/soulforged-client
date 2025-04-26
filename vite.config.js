import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import gitDescribe from 'git-describe'

process.env.VUE_APP_GIT_HASH = gitDescribe.gitDescribeSync({
  customArguments: ['--abbrev=8'],
}).hash

console.log('Git HASH:', process.env.VUE_APP_GIT_HASH)

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
