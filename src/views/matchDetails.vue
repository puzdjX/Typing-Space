<script>
import gsap from 'gsap'

export default {
    data: function () {
        return {
            match_id: this.$route.params.match_id,
            art_id: this.$route.params.id,

            groups_arr: [],
            isLoading: true,

            // 时间
            matchTime: new Date(),
            currentTime: new Date(),
        }
    },
    methods: {
        // 获取比赛队伍信息
        match_groups() {
            fetch('https://ts.webt.club/api/v1/match/' + this.match_id + '/group?token=' + this.$root.user.token, {
                method: 'GET',
            }).then(res => {
                res.json().then(data => {
                    if (data.message === 'success') {
                        this.groups_arr = data.data;
                        this.isLoading = false;
                    } else {
                        this.$root.alertShow(data.message);
                        setTimeout(() => {
                            this.$router.push('/');
                            this.$root.user = [];
                        }, 2000);
                    }
                })
            });
        },

        // 获取比赛时间
        find_match() {
            fetch('https://ts.webt.club/api/v1/match/' + this.match_id + '?token=' + this.$root.user.token, {
                method: 'GET',
            }).then(res => {
                res.json().then(data => {
                    if (data.message === 'success') {
                        this.matchTime = new Date(data.data.match_time);
                        this.currentTime = new Date();
                    } else {
                        this.$root.alertShow(data.message);
                        setTimeout(() => {
                            this.$router.push('/');
                            this.$root.user = [];
                        }, 2000);
                    }
                })
            });
        },

        // 加入比赛队伍
        groups_add(id) {
            let data = {
                competition_id: this.match_id,
                group_id: id,
            }

            fetch('https://ts.webt.club/api/v1/match/join/group?token=' + this.$root.user.token, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(data),
            }).then(res => {
                res.json().then(data => {
                    if (data.message === 'success') {

                    } else {
                        this.$root.alertShow(data.message);
                    }
                })
            });
        }
    },
    created() {
        if (localStorage.getItem('user')) {
            this.$root.user = JSON.parse(localStorage.getItem('user'));
        }

        this.match_groups();
        this.find_match();
    },
    computed: {
        // 比赛未开始
        isBeforeMatchTime() {
            return this.currentTime < this.matchTime;
        },
        // 比赛正在进行
        isMatchTime() {
            // 比赛开始时间是当天的0点，结束时间是当天的23:59:59。
            let startOfDay = new Date(this.matchTime.getFullYear(), this.matchTime.getMonth(), this.matchTime.getDate());
            let endOfDay = new Date(this.matchTime.getFullYear(), this.matchTime.getMonth(), this.matchTime.getDate() + 1);
            endOfDay.setMilliseconds(-1);
            return this.currentTime >= startOfDay && this.currentTime <= endOfDay;
        },
    },
    mounted() {
        const comet = document.querySelectorAll('.comet');
        comet.forEach(btn => {
            btn.addEventListener('click', () => {
                clearInterval()
                setInterval(() => {
                    btn.classList.add("active");
                }, 30);
                setTimeout(function () {
                    btn.classList.remove("active");
                }, 300);
                btn.style.animation = '';
                void btn.offsetWidth;
                btn.style.animation = '0.4s elasticity';
            })
        })

        const queryBtn = document.querySelector('.query')
        const querySpan = document.querySelector('.query span')

        queryBtn.addEventListener('mouseenter', () => {
            const tl = gsap.timeline()
            tl.to(queryBtn, {
                duration: .2,
                height: 150,
                onComplete: () => {
                    querySpan.style.display = 'block'
                }
            })
            tl.to(querySpan, {
                duration: .2,
                opacity: 1,
            }, '>')
        })

        queryBtn.addEventListener('mouseleave', () => {
            const tl = gsap.timeline()
            tl.to(queryBtn, {
                duration: .2,
                height: 35,
                onComplete: () => {
                    querySpan.style.display = 'none'
                    querySpan.style.opacity = 0
                }
            })
        })
    },
}
</script>

<template>
    <div class="container">
        <div class="main-section">
            <div class="match-group">
                <template v-if="isLoading">
                    <li class="skeleton-card card card-detail">
                        <div class="skeleton-text"></div>
                        <div class="skeleton-text"></div>
                        <div class="skeleton-text"></div>
                    </li>
                    <li class="skeleton-card card card-detail">
                        <div class="skeleton-text"></div>
                        <div class="skeleton-text"></div>
                        <div class="skeleton-text"></div>
                    </li>
                </template>
                <div class="card-group" style="--clr: rgb(0, 221, 255);" v-for="groups in groups_arr"
                    v-bind:key="groups.id">
                    <div class="card-inside">
                        <div class="card-group-info">
                            <h1>{{ groups.name }}</h1>
                            <span>已参加 <strong>{{ groups.user_count }}</strong> 人</span>
                        </div>


                        <span v-if="isBeforeMatchTime">比赛未开始</span>
                        <router-link v-else-if="isMatchTime" :to="'/type/match/' + match_id + '/' + art_id"
                            class="comet active" @click="groups_add(groups.id)">
                            Join
                            <span class="shape">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </span>
                        </router-link>
                        <span v-else>比赛已结束</span>
                    </div>
                </div>
            </div>

            <router-link :to="'/matchGrade/' + match_id" class="query">
                <svg xmlns="https://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-search" width="24"
                    height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                    <path d="M21 21l-6 -6" />
                </svg>
                <span>查询成绩</span>
                <div class="wire"></div>
            </router-link>
        </div>
    </div>
</template>
