import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import pkg from './package.json' with { type: 'json' }

// Dependencies are installed alongside the package, so keep them (and their subpaths) out of the bundle
const externals = [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)];

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({ tsconfigPath: './tsconfig.build.json', bundleTypes: true }),
    {
      // TypeScript checks side-effect imports (noUncheckedSideEffectImports), so give the stylesheet a declaration
      name: 'stylesheet-types',
      apply: 'build',
      generateBundle() {
        this.emitFile({ type: 'asset', fileName: 'style.css.d.ts', source: 'export {};\n' });
      }
    }
  ],
  resolve: {
    // Examples and stories import the package by name, like a consumer would
    alias: {
      '@attebyte/react-tree-select': resolve(import.meta.dirname, 'lib/main.ts')
    }
  },
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(import.meta.dirname, 'lib/main.ts'),
      formats: ['es'],
      fileName: 'main',
      cssFileName: 'style'
    },
    rolldownOptions: {
      external: (id) => externals.some(name => id === name || id.startsWith(`${name}/`))
    }
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['lib/**/*.test.{ts,tsx}', 'examples/**/*.test.ts']
        }
      },
      {
        // Runs every story (and its play function and accessibility checks) in a real browser
        extends: true,
        plugins: [storybookTest({ configDir: resolve(import.meta.dirname, '.storybook') })],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }]
          },
        }
      }
    ]
  }
})
