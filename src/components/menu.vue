<script>
export default {
    data: function () {
        return {
            isShow: false
        }
    },
    methods: {
        dropInOut() {
            let dropmenu = document.querySelector('.dropdown-menu');

            if (dropmenu.style.display === 'block') {
                dropmenu.style.display = 'none'
            } else {
                dropmenu.style.display = 'block'
            }
        },

        // 注销
        logout() {
            fetch('https://ts.webt.club/api/v1/signout?token=' + this.$root.user.token, {
                method: 'DELETE',
            })

            this.$root.alertShow("注销成功", 'hint');
            localStorage.removeItem('user');
            setTimeout(() => {
                this.$router.push('/');
            }, 2000)
        },

        silderShow() {
            let navSilder = document.querySelector('.nav-silder')
            let navbar = document.querySelector('.navbar-mobile')
            if (this.isShow) {
                navSilder.style.height = '0px'
                navbar.classList.toggle('navbar-active')
                this.isShow = false
            } else {
                navSilder.style.height = '295px'
                navbar.classList.toggle('navbar-active')
                this.isShow = true
            }
        },
    },
    created() {

    },
    mounted() {
        // window.addEventListener('scroll', function () {
        //     let topElement = document.querySelector('.top');
        //     let scrollDistance = window.pageYOffset || document.documentElement.scrollTop;

        //     if (scrollDistance > 200) {
        //         topElement.style.position = 'fixed';
        //     } else {
        //         topElement.style.position = 'relative';
        //     }
        // });
    },
}
</script>

<template>
    <div class="top">
        <div class="nav-silder">
            <ul>
                <li><router-link to="/home">主页</router-link></li>
                <li><router-link to="/stats">统计数据</router-link></li>
                <li><router-link to="/rank">排行榜</router-link></li>
                <li><router-link to="/about">关于 TS</router-link></li>
                <li><a href="#" @click.prevent="logout()">登出</a></li>
            </ul>
        </div>
        <div class="container">
            <a href="#" class="navbar-brand">
                Typing Space
            </a>
            <!-- <div class="navbar-account-mobile">
                <ul class="navbar-nav navbar-account">
                    <li class="dropdown" @click="dropInOut">
                        <a class="dropdown-toggle">
                            {{ $root.user.username }}
                            <span class="caret"></span>
                        </a>
                        <ul class="dropdown-menu">
                            <li>
                                <router-link to="/profile">
                                    档案
                                </router-link>
                            </li>
                            <li>
                                <a href="#" @click.prevent="logout()">登出</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div> -->
            <div class="navbar-mobile">
                <button @click="silderShow()">
                    <span class="navbar-icon"></span>
                    <span class="navbar-icon"></span>
                    <span class="navbar-icon"></span>
                </button>
            </div>
            <ul class="navbar-nav">
                <li>
                    <router-link to="/home">
                        主页
                    </router-link>
                </li>
                <li>
                    <router-link to="/stats">
                        统计数据
                    </router-link>
                </li>
                <li>
                    <router-link to="/rank">
                        排行榜
                    </router-link>
                </li>
                <li>
                    <router-link to="/about">
                        关于 TS
                    </router-link>
                </li>
                <li>
                    <a href="javascript:" @click="this.$root.toggleNotice()">
                        更新公告
                    </a>
                </li>
            </ul>
            <ul class="navbar-nav navbar-account">
                <li class="dropdown" @click="dropInOut">
                    <a class="dropdown-toggle">
                        {{ $root.user.username }}
                        <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu">
                        <li>
                            <router-link to="/profile">
                                档案
                            </router-link>
                        </li>
                        <li>
                            <a href="#" @click.prevent="logout()">登出</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>


