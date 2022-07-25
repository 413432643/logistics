//定义路由相关代码
import {
    createRouter,
    createWebHashHistory
} from "vue-router";

const routes = [{
    path: '/',
    redirect: "/Index"
},
{
    name: 'Index',
    path: '/Index',
    component: () => import('../pages/Index.vue')
},
{
    name: 'Site',
    path: '/Site',
    component: () => import('../pages/Site.vue')
},
{
    name: 'User',
    path: '/User',
    component: () => import('../pages/User.vue')
},
{
    name: 'Distribution',
    path: '/Distribution',
    component: () => import('../pages/Distribution.vue')
},
{
    name: 'Storage',
    path: '/Storage',
    component: () => import('../pages/Storage.vue')
},
{
    name: 'Order',
    path: '/Order',
    component: () => import('../pages/Order.vue')
},
{
    name: 'Complaint',
    path: '/Complaint',
    component: () => import('../pages/Complaint.vue')
},
{
    name: 'Live',
    path: '/Live',
    component: () => import('../pages/Live.vue')
}
]

const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})

export default router;