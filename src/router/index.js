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
    component: () => import('../pages/Index.vue'),
    meta: {
        keepAlive: true
    }
},
{
    name: 'Site',
    path: '/Site',
    component: () => import('../pages/Site.vue'),
    meta: {
        keepAlive: true
    }
},
{
    name: 'User',
    path: '/User',
    component: () => import('../pages/User.vue'),
    meta: {
        keepAlive: true
    }
},
{
    name: 'Distribution',
    path: '/Distribution',
    component: () => import('../pages/Distribution.vue'),
    meta: {
        keepAlive: true
    }
},
{
    name: 'Storage',
    path: '/Storage',
    component: () => import('../pages/Storage.vue'),
    meta: {
        keepAlive: true
    }
},
{
    name: 'Order',
    path: '/Order',
    component: () => import('../pages/Order.vue'),
    meta: {
        keepAlive: true
    }
},
{
    name: 'Complaint',
    path: '/Complaint',
    component: () => import('../pages/Complaint.vue'),
    meta: {
        keepAlive: true
    }
},
{
    name: 'Live',
    path: '/Live',
    component: () => import('../pages/Live.vue'),
    meta: {
        keepAlive: true
    }
}
]

const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})

export default router;