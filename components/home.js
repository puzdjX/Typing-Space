export default {
    data: function () {
        return {
            pos: 0,
            wid: 0,

            article_arr: [],
            isLoading: true,
        }
    },
    methods: {
        dropInOut: function () {
            if (dropmenu.style.display === 'block') {
                dropmenu.style.display = 'none'
            } else {
                dropmenu.style.display = 'block'
            }
        },

        dropHide: function () {
            if (dropmenu.style.display === 'block') {
                dropmenu.style.display = 'none'
            }
        },
    },
    created() {
        
    },
    mounted() {
        if (localStorage.getItem('user')) {
            // 获取所有文章
            fetch('http://ts_api.webt.club/api/v1/article?token=' + this.$root.user.token, {
                method: 'GET',
            }).then(res => {
                res.json().then(data => {
                    if (data.message === 'success') {
                        this.isLoading = false;
                        this.article_arr = data.data;
                    } else {
                        this.$root.alertShow('token已失效,请重新登录');
                        localStorage.removeItem('user');
                        setTimeout(() => {
                            this.$router.push('/');
                        }, 2000);
                    }
                })
            });
        } else {
            this.$root.alertShow('token已失效,请重新登录');
            setTimeout(() => {
                this.$router.push('/');
            }, 2000);
        };

        // 不要动
        const underline = document.querySelector('.underline'),
            active = document.querySelector('.active'),
            links = document.querySelectorAll('.option-nav li')

        let pos = 0;
        let wid = 0;

        if (active) {
            pos = active.offsetLeft;
            wid = active.offsetWidth;
        }

        for (let i = 0; i < links.length; i++) {
            links[i].addEventListener('click', function (e) {
                e.preventDefault();
                let _this = this;

                let position = _this.offsetLeft;
                let width = _this.offsetWidth;

                if (position >= pos) {
                    underline.style.width = (position - pos + width) + 'px';
                    setTimeout(function () {
                        underline.style.width = width + 'px';
                        underline.style.left = position + 'px';
                        _this.classList.add('active');
                    }, 300);
                } else {
                    underline.style.left = position + 'px';
                    underline.style.width = (pos - position + wid) + 'px';
                    setTimeout(function () {
                        underline.style.width = width + 'px';
                        _this.classList.add('active');
                    }, 300);
                }

                pos = position;
                wid = width;
            })
        }
    },
    template: `
    <div class="container">
        <div class="main-section">
            <div class="nav">
                <ul class="option-nav">
                    <li>
                        文章
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-books" width="35"
                            height="35" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M5 4m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z">
                            </path>
                            <path d="M9 4m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z">
                            </path>
                            <path d="M5 8h4"></path>
                            <path d="M9 16h4"></path>
                            <path
                                d="M13.803 4.56l2.184 -.53c.562 -.135 1.133 .19 1.282 .732l3.695 13.418a1.02 1.02 0 0 1 -.634 1.219l-.133 .041l-2.184 .53c-.562 .135 -1.133 -.19 -1.282 -.732l-3.695 -13.418a1.02 1.02 0 0 1 .634 -1.219l.133 -.041z">
                            </path>
                            <path d="M14 9l4 -1"></path>
                            <path d="M16 16l3.923 -.98"></path>
                        </svg>
                    </li>
                    <li>
                        小游戏
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-apple-arcade"
                            width="35" height="35" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor"
                            fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M12 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                            <path
                                d="M20 12.5v4.75a.734 .734 0 0 1 -.055 .325a.704 .704 0 0 1 -.348 .366l-5.462 2.58a5 5 0 0 1 -4.27 0l-5.462 -2.58a.705 .705 0 0 1 -.401 -.691l0 -4.75">
                            </path>
                            <path
                                d="M4.431 12.216l5.634 -2.332a5.065 5.065 0 0 1 3.87 0l5.634 2.332a.692 .692 0 0 1 .028 1.269l-5.462 2.543a5.064 5.064 0 0 1 -4.27 0l-5.462 -2.543a.691 .691 0 0 1 .028 -1.27z">
                            </path>
                            <path d="M12 7l0 6"></path>
                        </svg>
                    </li>
                    <li class="todo">
                        更多功能开发中...
                    </li>
                </ul>
                <div class="underline"></div>
            </div>

            <ul class="selected-content">
                <template v-if="isLoading">
                    <li class="skeleton-card card">
                        <div class="skeleton-text"></div>
                        <div class="skeleton-text"></div>
                        <div class="skeleton-text"></div>
                    </li>
                    <li class="skeleton-card card">
                        <div class="skeleton-text"></div>
                        <div class="skeleton-text"></div>
                        <div class="skeleton-text"></div>
                    </li>
                </template>
                <template v-else>
                    <router-link :to="'/type/'+article.id" class="card" :data-type="article.type == 0 ? '英' : '中'" v-for="article in article_arr" >
                        <h1 class="text-space">{{ article.name }}</h1>
                        <p class="text-space">{{ article.words }} 字</p>
                        <span>难度：{{ article.assess.toFixed(1) }}⭐</span>
                        <div class="lace"></div>
                    </router-link>
                </template>
            </ul>
        </div>
    </div>
    `
}