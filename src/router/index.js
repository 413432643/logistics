//定义路由相关代码
import {
    createRouter,
    createWebHashHistory
} from "vue-router";

import Index from '../pages/Index.vue'
import Site from '../pages/Site.vue'
import User from '../pages/User.vue'
import Distribution from '../pages/Distribution.vue'
import Storage from '../pages/Storage.vue'
import Order from '../pages/Order.vue'
import Complaint from '../pages/Complaint.vue'
import Live from '../pages/Live.vue'

const routes = [{
    path: '/',
    redirect: "/Index"
},
{
    name: 'Index',
    path: '/Index',
    component: Index,
    meta: {
        keepAlive: true
    }
},
{
    name: 'Site',
    path: '/Site',
    component: Site,
    meta: {
        keepAlive: true
    }
},
{
    name: 'User',
    path: '/User',
    component: User,
    meta: {
        keepAlive: true
    }
},
{
    name: 'Distribution',
    path: '/Distribution',
    component: Distribution,
    meta: {
        keepAlive: true
    }
},
{
    name: 'Storage',
    path: '/Storage',
    component: Storage,
    meta: {
        keepAlive: true
    }
},
{
    name: 'Order',
    path: '/Order',
    component: Order,
    meta: {
        keepAlive: true
    }
},
{
    name: 'Complaint',
    path: '/Complaint',
    component: Complaint,
    meta: {
        keepAlive: true
    }
},
{
    name: 'Live',
    path: '/Live',
    component:Live,
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