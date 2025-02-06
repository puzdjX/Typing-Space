export default {
    data: function () {
        return {
            
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
        logout(){
            fetch('http://ts_api.webt.club/api/v1/signout?token=' + this.$root.user.token, {
                method: 'DELETE',
            })

            this.$root.alertShow("注销成功");
            localStorage.removeItem('user');
            setTimeout(() => {
                this.$router.push('/');
            }, 2000)
        }
    },
    created(){

    },
    mounted() {

    },
    template: `
    <div class="top">
        <div class="container">
            <a href="#" class="navbar-brand">
                Typing Space
            </a>
            <ul class="navbar-nav">
                <li>
                    <router-link to="/home" >
                        主页
                    </router-link>
                </li>
                <li>
                    <router-link to="/stats" >
                        统计数据
                    </router-link>
                </li>
                <li>
                    <router-link to="/rank" >
                        排行榜
                    </router-link>
                </li>
            </ul>
            <ul class="navbar-nav navbar-account">
                <li class="dropdown" @click="dropInOut">
                    <a  class="dropdown-toggle">
                        {{$root.user.username}}
                        <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu">
                        <li>
                            <router-link to="/profile" >
                                档案
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/task" >
                                任务
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
    `
}