import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { monacoFixPlugin } from './vite-plugin-monaco-fix.js';

export default defineConfig({ 
    ssr: {
        noExternal: [
            "svelte-hero-icons",
            "js-yaml",
            "@iconify/svelte"
        ]
    },
    optimizeDeps: {
        exclude: [
            'monaco-editor',
            'monaco-editor/esm/vs/editor/editor.worker',
            'monaco-editor/esm/vs/language/json/json.worker'
        ]
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('@iconify/svelte')) return 'vendor';
                    if (id.includes('js-yaml')) return 'utils';
                }
            }
        },
        chunkSizeWarningLimit: 1000,
        sourcemap: false,
        minify: 'esbuild',
        target: 'es2022' // <-- Changed from 'esnext' so Rolldown doesn't resolve it to 'es2026'
    },
    esbuild: {
        target: 'es2022' // <-- Ensures esbuild transpilation uses a valid target
    },
    server: {
        fs: {
            allow: ['..']
        }
    },
    define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'MONACO_EDITOR_SOURCEMAP': JSON.stringify(false)
    },
    plugins: [tailwindcss(), sveltekit(), monacoFixPlugin()], // <-- Adapter belongs in svelte.config.js
    resolve: {
        alias: {
            '#lib': fileURLToPath(new URL('./src/lib', import.meta.url)),
            util: 'node:util',
            events: 'node:events',
            timers: 'node:timers',
            path: 'node:path',
            stream: 'node:stream',
            string_decoder: 'node:string_decoder',
            buffer: 'node:buffer'
        }
    }
});
