import { defineConfig } from 'vite';
import { glob } from 'glob';
import path from 'path';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: Object.fromEntries(
        glob.sync('src/**/*.html').map(file => [
          // This removes the `src/` directory prefix and `.html` suffix
          path.relative('src', file.slice(0, file.length - path.extname(file).length)),
          // This provides the absolute path to the file
          fileURLToPath(new URL(file, import.meta.url))
        ])
      )
    }
  },
  server: {
    open: true,
  },
  define: {
    'process.env': {}
  }
});