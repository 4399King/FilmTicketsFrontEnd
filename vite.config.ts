import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import { resolve } from 'path';
export default defineConfig({
	plugins: [uni()],
	server: { //uniapp不走此处代理
    
  },resolve: {
    alias: {
      '@': resolve(__dirname, 'src') // 将 '@' 别名指向 'src' 目录
    }
  },
});