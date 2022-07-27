import { createApp } from 'vue'
// 路由
import router from "./router/index";
// 网络请求
import axios from 'axios';
// echarts
import * as echarts from 'echarts'

// elementui
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElIcons from '@element-plus/icons-vue'


import App from './App.vue'
const app = createApp(App)

setTimeout(() => { localStorage.clear() }, 10)

app.config.globalProperties.$echarts = echarts;

// element的图标
for (const name in ElIcons) {
    app.component(name, ElIcons[name])
}
app.use(router);
app.use(ElementPlus)

app.mount('#app')


