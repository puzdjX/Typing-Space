<script>
import place from '../assets/placeholder.png'

export default {
    data: function () {
        return {
            group_arr: [],
            all_acore: [],
            mvp: [],
            isLoading: true,

            placeUrl: place
        }
    },
    methods: {
        // 查询所有队伍成绩
        match_score() {
            fetch('https://ts.webt.club/api/v1/match/score/' + this.$route.params.match_id + '?token=' + this.$root.user.token, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
            }).then(res => {
                res.json().then(data => {
                    if (data.message == 'success') {
                        // 排序
                        for (const groupName in data.data) {
                            let groupData = data.data[groupName];
                            let sortableGroup = [];

                            for (const userId in groupData) {
                                sortableGroup.push(groupData[userId]);
                            }

                            sortableGroup.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
                            data.data[groupName] = sortableGroup;
                        }

                        this.isLoading = false;
                        this.group_arr = Object.entries(data.data);
                        console.log(this.group_arr);
                        this.acore();
                    }
                })
            });
        },

        // 最高分
        mvp_query() {
            fetch('https://ts.webt.club/api/v1/match/highest/score/' + this.$route.params.match_id + '?token=' + this.$root.user.token, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
            }).then(res => {
                res.json().then(data => {
                    if (data.message == 'success') {
                        this.mvp = data.data;
                    }
                })
            });
        },

        // 成绩总和
        acore() {
            // 循环每个组obj的每个组员key的成绩，将组员成绩相加后添加到总分表all_acore当中，以获得每个组的组员总分和
            this.group_arr.forEach(obj => {

                let score = 0;
                Object.keys(obj[1]).forEach(key => {
                    score += obj[1][key].score * 1;
                });
                this.all_acore.push(score.toFixed(2));
            });
        },
    },
    created() {
    },
    mounted() {
        if (localStorage.getItem('user')) {
            this.$root.user = JSON.parse(localStorage.getItem('user'));
        }

        this.match_score();
        this.mvp_query();
    },
}
</script>

<template>
    <div class="container">
        <div class="main-section">
            <div class="match-group">
                <template v-if="isLoading">
                    <li class="skeleton-card card card-grade">
                        <div class="skeleton-text"></div>
                        <div class="skeleton-text"></div>
                    </li>
                    <li class="skeleton-card card card-grade">
                        <div class="skeleton-text"></div>
                        <div class="skeleton-text"></div>
                    </li>
                </template>
                <div class="card-group grade" v-for="(group, index) in group_arr">
                    <div class="card-inside">
                        <div class="card-group-info">
                            <h1>{{ group[0] }}</h1>
                            <span>已参加 <strong>{{ Object.keys(group[1]).length }}</strong> 人</span>
                        </div>
                        <div class="card-group-rank">
                            <ul class="rank-list">
                                <li :class="user.username === mvp.username ? 'mvp' : ''"
                                    v-for="(user, index) in group[1]">
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
                                        {{ index + 1 }} .
                                    </p>
                                    <img :src="user.head === null ? placeUrl : user.head" alt="">
                                    <p class="rankName">
                                        {{ user.username }}
                                    </p>
                                    <span>{{ user.score }} 分</span>
                                    <div class="mvpSign">
                                        MVP
                                        <div class="throughLine">—-</div>
                                    </div>
                                    <div class="mvpSign shock">
                                        MVP
                                        <div class="throughLine">—-</div>
                                    </div>
                                    <div class="match-data" v-if="user.grade">
                                        <div class="data-own">
                                            <div class="data-name">{{ user.grade.username }}</div>
                                            <div class="match-data-main">
                                                <p>速度：<span id="concrete-data">{{ user.grade.speed }} wpm</span></p>
                                                <p>正确率：<span id="concrete-data">{{ user.grade.accuracy }}%</span></p>
                                                <p>时间：<span id="concrete-data"> {{ user.grade.take_time }}</span></p>
                                                <p>进度：<span id="concrete-data"> {{ user.grade.schedule }} %</span></p>
                                                <p>真实正确率：<span id="concrete-data"> {{ user.grade.true_accuracy }}
                                                        %</span>
                                                </p>
                                                <p>退格数：<span id="concrete-data"> {{ user.grade.backspace_nm }} 次</span>
                                                </p>
                                                <p>分值：<span id="concrete-data"> {{ user.score }} 分</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div class="card-group-total">
                            <h1>{{ all_acore[index] }} 分</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.rankName {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 200px;
    height: 40px;
    text-align: left;
}

.card-group-rank {
    width: 40%;
}

.rank-list li span {
    right: -12%;
}

.match-group .card-group:nth-child(1) {
    z-index: 10;
}

.match-data-main p {
    width: 170px;
    text-align: left;
}
</style>