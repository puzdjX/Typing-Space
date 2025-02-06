// 引入组件
import login from '../components/login.js'
import home from '../components/home.js'
import stats from '../components/stats.js'
import profile from '../components/profile.js'
import types from '../components/type.js'
import rank from '../components/rank.js'
import task from '../components/task.js'



import menu_t from '../components/menu.js'


// 定义路由
let routes = [
    { path: '/', component: login },
    // 主菜单
    { path: '/home', component: home },


    // 菜单页面
    { path: '/stats', component: stats },
    { path: '/profile', component: profile },
    { path: '/rank', component: rank },
    { path: '/task', component: task },


    // 游戏页面
    { path: '/type/:id', component: types },
]

// 初始化路由
let route = VueRouter.createRouter({
    routes,
    history: VueRouter.createWebHashHistory(),
});

// 路由守卫
route.beforeEach((to, from) => {
    // 当页面是首页时，将app的class样式改成index-page
    if (to.path === '/') {
        document.querySelector('.menu_t').style.display = 'none'
    } else {
        document.querySelector('.menu_t').style.display = 'flex'
    };
});


// Vue变量
Vue.createApp({
    data: function () {
        return {
            user:'',
        }
    },
    methods: {
        // 提示
        alertShow(message = "操作成功") {
            let alertSelf = document.querySelector('.alert')

            alertSelf.innerHTML = `
                ${message}
                <svg width="50" height="50" viewBox="0 0 400 400">
                    <polyline fill="none" stroke="#8BD17C" stroke-width="24" points="88,214 173,284 304,138"
                        stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            `
            alertSelf.classList.add('alert-show')
            setTimeout(() => {
                alertSelf.classList.remove('alert-show')
            }, 1500)
        },
    },
    created() {
        if (localStorage.getItem('user')) {
            this.user = JSON.parse(localStorage.getItem('user'));
        };
    
    },
    mounetd() {

    },
    components: {
        menu_t,
    },
}).use(route).mount('#app');