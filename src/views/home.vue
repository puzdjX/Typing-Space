<script>
export default {
    data: function () {
        return {
            pos: 0,
            wid: 0,

            article_arr: [],
            match_arr: [],
            game_arr: [],
            model: 'article',
            isLoading: true,
            data_time: '',
        }
    },
    methods: {
        // 切换为文章
        article() {
            this.model = 'article';
            localStorage.setItem('selectedOption', 'article'); // Add selected option to local storage
        },
        // 切换为比赛
        match() {
            this.model = 'match';
            localStorage.setItem('selectedOption', 'match'); // Add selected option to local storage
        },
        // 切换为多人模式
        multiplayer() {
            this.model = 'multiplayer';
            localStorage.setItem('selectedOption', 'multiplayer'); // Add selected option to local storage
        },
        // 切换为游戏
        games() {
            this.model = 'games';
            localStorage.setItem('selectedOption', 'games'); // Add selected option to local storage
        }
    },
    created() {
    },
    mounted() {
        if (localStorage.getItem('user')) {
            this.$root.user = JSON.parse(localStorage.getItem('user'));

            // 获取时间
            this.data_time = new Date();
            this.data_time.setDate(this.data_time.getDate() - 1);

            // 获取所有文章
            fetch('https://ts.webt.club/api/v1/article?token=' + this.$root.user.token, {
                method: 'GET',
            }).then(res => {
                res.json().then(data => {
                    if (data.message === 'success') {
                        this.article_arr = data.data;
                    } else {
                        this.$root.alertShow('token已失效,请重新登录');
                        localStorage.removeItem('user');
                        setTimeout(() => {
                            this.$router.push('/');
                            this.$root.user = [];
                        }, 2000);
                    }
                })
            });
            // 获取所有比赛
            fetch('https://ts.webt.club/api/v1/match?token=' + this.$root.user.token, {
                method: 'GET',
            }).then(res => {
                res.json().then(data => {
                    if (data.message === 'success') {
                        this.match_arr = data.data;
                        this.isLoading = false;
                    } else {
                        this.$root.alertShow('token已失效,请重新登录');
                        localStorage.removeItem('user');
                        setTimeout(() => {
                            this.$router.push('/');
                            this.$root.user = [];
                        }, 2000);
                    }
                })
            });
            // 获取所有游戏
            fetch('https://ts.webt.club/api/v1/gain/game?token=' + this.$root.user.token, {
                method: 'GET',
            }).then(res => {
                res.json().then(data => {
                    if (data.message === 'success') {
                        this.game_arr = data.data;
                        this.isLoading = false;
                    } else {
                        this.$root.alertShow('token已失效,请重新登录');
                        localStorage.removeItem('user');
                        setTimeout(() => {
                            this.$router.push('/');
                            this.$root.user = [];
                        }, 2000);
                    }
                })
            });
            // this.article();
        } else {
            this.$root.alertShow('token已失效,请重新登录');
            setTimeout(() => {
                this.$router.push('/');
                this.$root.user = [];
            }, 2000);
        };

        // 不要动
        const underline = document.querySelector('.underline'),
            links = document.querySelectorAll('.option-nav li')

        let pos = 0;
        let wid = 0;

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
                    }, 300);
                } else {
                    underline.style.left = position + 'px';
                    underline.style.width = (pos - position + wid) + 'px';
                    setTimeout(function () {
                        underline.style.width = width + 'px';
                    }, 300);
                }

                pos = position;
                wid = width;
            })
        }
        // links[0].click()

        // Retrieve selected option from local storage
        const selectedOption = localStorage.getItem('selectedOption');
        if (selectedOption) {
            this.model = selectedOption;
            switch (true) {
                case this.model == 'article':
                    links[0].click()
                    break;
                case this.model == 'match':
                    links[1].click()
                    break;
                default:
                    links[2].click()
                    break;
            }
        }
    },
}
</script>

<template>
    <div class="container">
        <div class="main-section">
            <div class="nav">
                <ul class="option-nav">
                    <li id="article" @click="article()">
                        文章
                        <svg xmlns="https://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-books" width="35"
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
                    <li id="match" @click="match()">
                        比赛
                        <svg xmlns="https://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-flag" width="32"
                            height="32" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M5 5a5 5 0 0 1 7 0a5 5 0 0 0 7 0v9a5 5 0 0 1 -7 0a5 5 0 0 0 -7 0v-9z" />
                            <path d="M5 21v-7" />
                        </svg>
                    </li>
                    <!-- <li id="multiplayer" class="new" @click="multiplayer()">
                        多人模式
                        <svg xmlns="https://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-users" width="32"
                            height="32" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                            <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
                        </svg>
                    </li> -->
                    <li id="games" @click="games()">
                        小游戏
                        <svg xmlns="https://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-apple-arcade"
                            width="35" height="35" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none"
                            stroke-linecap="round" stroke-linejoin="round">
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
                <template v-else-if="model == 'article'">
                    <router-link :to="{ path: '/typeMain/types', query: { id: article.id } }" class="card"
                        :data-type="article.type == 0 ? '英' : '中'" v-for="article in article_arr" v-bind:key="article.id">
                        <h1 class="text-space">{{ article.name }}</h1>
                        <p class="text-space">{{ article.words }} 字</p>
                        <span>难度：{{ article.assess.toFixed(1) }}⭐</span>
                        <div class="lace"></div>
                    </router-link>
                </template>
                <template v-else-if="model == 'match'">
                    <router-link :to="'/matchDetails/' + match.id + '/' + match.article_id"
                        :class="data_time > new Date(match.match_time) ? 'card card-finished card-match' : 'card card-match'"
                        data-type="英" v-for="match in match_arr" v-bind:key="match.id">
                        <h1 class="text-space">{{ match.article_name }}</h1>
                        <p class="text-space">举办时间：{{ match.match_time }}</p>
                        <span>参与项目数：<strong>{{ match.group_nm }}</strong> </span>
                        <div class="lace"></div>
                        <div class="card-wrap">
                            查看详情
                        </div>
                    </router-link>
                </template>
                <template v-else-if="model == 'multiplayer'">
                    <router-link :to="'/multiplayer/' + 'room' + 1" class="card">
                        <h1 class="text-space">房间 1</h1>
                        <p class="text-space">在线人数: 2 人</p>
                        <span>文章: Who am i</span>
                        <div class="lace"></div>
                    </router-link>
                    <router-link :to="'/multiplayer/' + 'room' + 2" class="card">
                        <h1 class="text-space">房间 2</h1>
                        <p class="text-space">在线人数: 2 人</p>
                        <span>文章: Who am i</span>
                        <div class="lace"></div>
                    </router-link>
                </template>
                <template v-else-if="model == 'games'">
                    <a :href="game.url" class="card game" v-for="game in game_arr" v-bind:key="game.id"
                        @click="this.$root.alertShow('跳转页面中', 'loading' , '10000')">
                        <img :src="game.head_img" :alt=game.name>
                    </a>
                    <div class="card wait4more">
                        <h1>
                            coming soon...
                        </h1>
                    </div>
                </template>
            </ul>
        </div>
    </div>
</template>