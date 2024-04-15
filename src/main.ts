import { createSSRApp } from "vue";
import App from "./App.vue";

//配置字体图标
import "@/common/css/style.css";
export function createApp() {
	const app = createSSRApp(App);
	return {
		app,
	};
}

