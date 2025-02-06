import { createRouter, createWebHashHistory } from 'vue-router'

import login from '../views/login.vue'
import home from '../views/home.vue'
import stats from '../views/stats.vue'
import profile from '../views/profile.vue'

import typesMain from '../views/typeMain.vue'
import types from '../views/type.vue'
import types_new from '../views/type_new.vue'

import match from '../views/match.vue'

import rank from '../views/rank.vue'
import matchDetails from '../views/matchDetails.vue'
import matchGrade from '../views/matchGrade.vue'
import about from '../views/about.vue'
import multiplayer from '../views/multiplayer.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    // 登录
    {
      path: '/',
      name: 'login',
      component: login
    },

    // 首页
    {
      path: '/home',
      name: 'home',
      component: home
    },


    // 菜单页面
    {
      path: '/stats',
      name: 'stats',
      component: stats
    },

    {
      path: '/profile',
      name: 'profile',
      component: profile
    },

    {
      path: '/rank',
      name: 'rank',
      component: rank
    },

    {
      path: '/matchDetails/:match_id/:id',
      name: 'matchDetails',
      component: matchDetails
    },

    {
      path: '/matchGrade/:match_id',
      name: 'matchGrade',
      component: matchGrade
    },

    {
      path: '/about',
      name: 'about',
      component: about
    },

    // 打字页面
    {
      path: '/typeMain',
      name: 'typeMain',
      component: typesMain,
      children: [
        {
          // 旧板
          path: 'types',
          component: types,
        },
        {
          // 新版
          path: 'types_new',
          component: types_new,
        }
      ]
    },

    // 比赛模式
    {
      path: '/type/match/:match_id/:id',
      name: 'match',
      component: match
    },

    // 多人模式
    {
      path: '/multiplayer/room:id',
      name: 'multiplayer',
      component: multiplayer,
    },
  ]
})

// 路由守卫
router.beforeEach((to, from) => {
  if (to.path === '/') {
    document.querySelector('.menu_t').style.display = 'none'
  } else {
    document.querySelector('.menu_t').style.display = 'flex'
  };
});

export default router