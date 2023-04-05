import { defineConfig } from 'vite'
import { DewTs } from '../packages/dew-ts'

export default defineConfig({
  plugins: [
    DewTs({
      tsConfig: './tsconfig.json',
      include: 'src',
      baseUrl: 'src',
    }),
  ],
})
