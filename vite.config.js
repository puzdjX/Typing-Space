import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate', // 自动更新 Service Worker
      // registerType: 'none', // 这将禁用自动注册 Service Worker
      filename: '/service-worker.js',
      manifest: {
        name: "Typing Space",
        description: "An efficient, professional and fun typing space",
        theme_color: "#242424",

        // 为了方便，使用svg图标
        icons: [
          {
            src: "/icon-small.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "/icon-large.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
        ],
      },
      devOptions: {
        // 如果想在`vite dev`命令下调试PWA, 必须启用它
        enabled: true,
        // Vite在dev模式下会使用浏览器原生的ESModule，将type设置为`"module"`与原先的保持一致
        type: "module",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
