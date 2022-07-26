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
},
{
    name: 'Site',
    path: '/Site',
    component: Site,
},
{
    name: 'User',
    path: '/User',
    component: User,
},
{
    name: 'Distribution',
    path: '/Distribution',
    component: Distribution,
},
{
    name: 'Storage',
    path: '/Storage',
    component: Storage,
},
{
    name: 'Order',
    path: '/Order',
    component: Order,
},
{
    name: 'Complaint',
    path: '/Complaint',
    component: Complaint,
},
{
    name: 'Live',
    path: '/Live',
    component: Live,
}
]

const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})

export default router;