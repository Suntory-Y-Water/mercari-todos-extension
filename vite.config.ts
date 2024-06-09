/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { crx, defineManifest } from '@crxjs/vite-plugin';
import { PluginOption } from 'vite';

// Pluginは非推奨のため、PluginOptionを使う
// ビルド時にエラーが発生してしまうため、Issueを参考に対応
const viteManifestHackIssue846: PluginOption & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderCrxManifest: (manifest: any, bundle: any) => void;
} = {
  // Workaround from https://github.com/crxjs/chrome-extension-tools/issues/846#issuecomment-1861880919.
  name: 'manifestHackIssue846',
  renderCrxManifest(_manifest, bundle) {
    bundle['manifest.json'] = bundle['.vite/manifest.json'];
    bundle['manifest.json'].fileName = 'manifest.json';
    delete bundle['.vite/manifest.json'];
  },
};

const manifest = defineManifest({
  manifest_version: 3,
  name: 'やることリストから再出品',
  version: '1.0.0',
  description: 'やることリストから再出品するGoogleChrome拡張機能です。',
  permissions: ['tabs', 'activeTab', 'scripting'],
  background: {
    service_worker: 'src/background/index.ts',
  },
  content_scripts: [
    {
      matches: ['https://jp.mercari.com/todos'],
      js: ['src/content/todos/index.ts'],
    },
  ],
  action: {
    default_popup: 'index.html',
  },
});

export default defineConfig({
  plugins: [viteManifestHackIssue846, crx({ manifest })],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: 'vitest-setup.ts',
  },
});
