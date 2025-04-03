import { createRouter, createWebHistory } from 'vue-router';
import { getToken } from '@/utils/auth';
import { ElMessage } from 'element-plus';
import store from '@/store';

/* 路由配置 */
const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/Login.vue'),
        meta: { title: '登录' }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/login/Register.vue'),
        meta: { title: '注册' }
    },
    {
        path: '/',
        component: () => import('@/layout/AppLayout.vue'),
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/views/dashboard/index.vue'),
                meta: { title: '首页', requiresAuth: true }
            },
            {
                path: 'profile',
                name: 'Profile',
                component: () => import('@/views/user/Profile.vue'),
                meta: { title: '个人信息', requiresAuth: true }
            },
            {
                path: 'users',
                name: 'UserList',
                component: () => import('@/views/user/UserList.vue'),
                meta: { title: '用户列表', requiresAuth: true, requiresAdmin: true }
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/dashboard'
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
    // 设置页面标题
    document.title = to.meta.title ? `${to.meta.title} - 用户管理系统` : '用户管理系统';

    // 检查是否需要登录验证
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // 检查是否已登录
        if (!getToken()) {
            ElMessage.warning('请先登录');
            next({ path: '/login', query: { redirect: to.fullPath } });
            return;
        }

        // 如果没有用户信息，先获取用户信息
        if (!store.state.userInfo) {
            try {
                await store.dispatch('getUserInfo');
            } catch (error) {
                // 获取用户信息失败，清除token并跳转到登录页
                await store.dispatch('logout');
                ElMessage.error('获取用户信息失败，请重新登录');
                next({ path: '/login', query: { redirect: to.fullPath } });
                return;
            }
        }

        // 检查是否需要管理员权限
        if (to.meta.requiresAdmin && !store.getters.isAdmin) {
            ElMessage.error('您没有权限访问此页面');
            next({ path: '/dashboard' });
            return;
        }

        next();
    } else {
        // 如果不需要登录验证
        if (getToken() && (to.path === '/login' || to.path === '/register')) {
            next({ path: '/dashboard' });
        } else {
            next();
        }
    }
});

export default router;