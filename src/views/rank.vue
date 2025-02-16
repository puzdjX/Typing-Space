<script>
import place from '../assets/placeholder.png'

export default {
    data: function () {
        return {
            rank_arr: [],
            object: [],

            placeUrl: place
        }
    },
    methods: {

    },
    mounted() {

    },
    created() {
        if (localStorage.getItem('user')) {
            this.$root.user = JSON.parse(localStorage.getItem('user'));

            // 获取所有文章
            fetch('https://ts.webt.club/api/v1/article/grade/today/all', {
                method: 'GET',
            }).then(res => {
                res.json().then(data => {
                    if (data.message === 'success') {
                        this.rank_arr = data.data;
                    } else {
                        this.$root.alertShow("文章不存在");
                    }
                })
            });
        } else {
            this.$root.alertShow('token已失效,请重新登录');
            setTimeout(() => {
                this.$router.push('/');
                this.$root.user = [];
            }, 2000);
        };
    },
}
</script>

<template>
    <div class="container">
        <div class="rank-section">
            <div class="box rank rainbowbor  d3d">
                <div class="rank-title">
                    <p>今日排行榜</p>
                    <svg xmlns="https://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trophy" width="50"
                        height="50" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M8 21l8 0" />
                        <path d="M12 17l0 4" />
                        <path d="M7 4l10 0" />
                        <path d="M17 4v8a5 5 0 0 1 -10 0v-8" />
                        <path d="M5 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                        <path d="M19 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                    </svg>
                </div>

                <ul class="rank-list" v-if="rank_arr == ''">
                    <li class="somebody">
                        虚位以待
                    </li>
                </ul>

                <ul class="rank-list" v-else>
                    <li v-for="(rank, index) in rank_arr" :class="'r' + (index + 1)" v-bind:key="index">
                        <p class="rank-nm" v-if="index == 0">
                            🥇.
                        </p>
                        <p class="rank-nm" v-else-if="index == 1">
                            🥈.
                        </p>
                        <p class="rank-nm" v-else-if="index == 2">
                            🥉.
                        </p>
                        <p class="rank-nm" v-else>
                            {{ index + 1 }}.
                        </p>

                        <img :src="rank.head_img === null ? placeUrl : rank.head_img" alt="">
                        <p class="rank-name">
                            {{ rank.username }}
                        </p>
                        <span>{{ rank.speed }} wpm</span>
                        <i>{{ rank.article }}</i>
                    </li>
                </ul>




            </div>
        </div>
    </div>
</template>


<style scoped>
.rank-name {
    width: 42%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
