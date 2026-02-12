import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const basePath = mode === "production" ? "/React-live-week7/" : "/";

  return {
    base: basePath,
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              // 1. 【React 核心與生態系】
              // 把所有跟 React 緊密相關的都包在一起，避免循環依賴
              if (
                id.includes("react") ||
                id.includes("router") ||
                id.includes("scheduler") || // React 內部排程器
                id.includes("prop-types")
              ) {
                return "vendor-react";
              }

              // 2. 【獨立大型套件】
              // 這些通常很獨立，拆出來沒問題
              if (id.includes("swiper")) return "vendor-swiper";
              if (id.includes("bootstrap")) return "vendor-bootstrap";
              if (id.includes("sweetalert2")) return "vendor-swal";
              if (id.includes("axios")) return "vendor-axios";

              // 3. 【移除 vendor-core】
              // ❌ 不要寫 return "vendor-core";
              // 讓剩下的自動處理，這樣就不會報 Circular chunk 錯誤了
            }
          },
        },
      },
    },
  };
});
