<script>
import menu_t from './components/menu.vue'

export default {
  data: function () {
    return {
      user: [],
      noticeVersion: 0.3,
      icons: [{
        success: `
        <svg width="50" height="50" viewBox="0 0 400 400">
          <polyline fill="none" stroke="#8BD17C" stroke-width="24" points="88,214 173,284 304,138"
            stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        `
        ,
        fail: `
        <?xml version="1.0" encoding="UTF-8"?><svg width="50px" height="50px" stroke-width="1.2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#f11032"><path d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426" stroke="#f11032" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        `
        ,
        loading: `
        <svg  xmlns="http://www.w3.org/2000/svg"  width="40"  height="40"  viewBox="0 0 24 24"  fill="none"  stroke="#ffffff"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-loader"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 6l0 -3" /><path d="M16.25 7.75l2.15 -2.15" /><path d="M18 12l3 0" /><path d="M16.25 16.25l2.15 2.15" /><path d="M12 18l0 3" /><path d="M7.75 16.25l-2.15 2.15" /><path d="M6 12l-3 0" /><path d="M7.75 7.75l-2.15 -2.15" /></svg>
        `
        ,
        hint: `
        <svg  xmlns="http://www.w3.org/2000/svg"  width="40"  height="40"  viewBox="0 0 24 24"  fill="none"  stroke="#ffffff"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-exclamation-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 9v4" /><path d="M12 16v.01" /></svg>
        `
      }]
    }
  },
  methods: {
    // 提示
    alertShow(message = "操作成功", icon = 'hint' ,time = 1500) {
      // 创建新的弹窗元素
      let alertSelf = document.createElement('div');
      let alerts = document.querySelector('.alerts')
      alertSelf.classList.add('alert');

      // 设置弹窗内容
      alertSelf.innerHTML = `
        ${this.icons[0][icon]}
        ${message}
      `;

      // 将弹窗元素添加到页面中
      alerts.appendChild(alertSelf);

      // 设置弹窗显示样式
      alertSelf.classList.add('alert-show');

      // 设置定时器，一定时间后移除弹窗元素
      setTimeout(() => {
        // 移除弹窗
        alertSelf.classList.add('alert-hide');
        setTimeout(() => {
          alertSelf.remove();
        }, 300);
      }, time);
    },

    // 切换显示公告
    toggleNotice() {
      let noticeBackground = document.querySelector('.notice-background');
      noticeBackground.classList.toggle('notice-hidden')
      localStorage.setItem('ts-notice', this.noticeVersion);
    },
  },

  created() {
    if (localStorage.getItem('user')) {
      this.$root.user = JSON.parse(localStorage.getItem('user'));
    };
  },

  mounted() {
    let notice = document.querySelector('.notice');
    let noticeBackground = document.querySelector('.notice-background');
    let noticeClose = document.querySelector('.notice-close');

    notice.addEventListener('click', function (e) {
      e.stopPropagation()
    })

    noticeBackground.addEventListener('click', function (e) {
      if (!e.target.classList.contains('notice')) {
        noticeClose.click()
      }
    })

    if (localStorage.getItem('ts-notice') == this.noticeVersion) {
      this.toggleNotice()
    }
  },

  components: {
    menu_t
  },
}
</script>

<template>
  <div class="alerts">

  </div>
  <div class="notice-background">
    <div class="notice">
      <div class="notice-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="icon icon-tabler icons-tabler-outline icon-tabler-info-circle">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
          <path d="M12 9h.01" />
          <path d="M11 12h1v4h1" />
        </svg>
        <h1>更新公告：</h1>
        <span class="notice-close" @click="toggleNotice()"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-x">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
          </svg></span>
      </div>
      <div class="notice-content">
        <ul>
          <li>*添加了新的小游戏*</li>
          <li>*应用现已支持渐进式 Web 应用（PWA）功能，你可以选择将应用安装到主屏幕，享受更流畅的使用体验。*</li>
          <li>*更新离线访问功能：PWA 可以在离线状态下加载和使用，使用户能够在没有网络连接的情况下继续浏览应用*</li>
          <li>优化了页面响应式</li>
          <li>优化了样式</li>
          <li>修复本地缓存不会更新的问题</li>
        </ul>
      </div>
    </div>
  </div>
  <menu_t class="menu_t"></menu_t>
  <router-view></router-view>
</template>

<style scoped></style>
