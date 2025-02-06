export default {
    data: function () {
        return {
            rank_arr:[],

            object:[],

        }
    },
    methods: {
        // 排序
        bubble(list){
            let temp = 0; // 用来交换的临时数
            // 要遍历的次数
            for (let i = 0; i < list.length - 1; i++) {
                // 从后向前依次的比较相邻两个数的大小，遍历一次后，把数组中第i小的数放在第i个位置上
                for (let j = list.length - 1; j > i; j--) {
                    // 比较相邻的元素，如果前面的数大于后面的数，则交换
                    if (list[j - 1][1].speed < list[j][1].speed) {
                        temp = list[j - 1];
                        list[j - 1] = list[j];
                        list[j] = temp;
                    }
                }
            }

            return list;
        }
    },
    created() {
        // if (localStorage.getItem('user')) {
        //     // 获取所有文章
        //     fetch('http://ts_api.webt.club/api/v1/article/grade/today/all', {
        //         method: 'GET',
        //     }).then(res => {
        //         res.json().then(data => {
        //             if (data.message === 'success') {
        //                 this.rank_arr = Object.entries(data.data).slice(0,10);
        //                 this.rank_arr = this.bubble(this.rank_arr);
        //             } else {
        //                 this.$root.alertShow("文章不存在");
        //             }
        //         })
        //     });
        // } else {
        //     this.$root.alertShow('token已失效,请重新登录');
        //     setTimeout(() => {
        //         this.$router.push('/');
        //     }, 2000);
        // };
    },
    mounted() {

    },
    template: `
    <div class="container">
        <div class="rank-section">
            <div class="box rank">
                <div class="rank-title">
                    <p>今日排行榜</p>
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trophy" width="50"
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
                <ul class="rank-list">
                    <li v-for="(rank,index) in rank_arr" :id="'r' + (index + 1)">
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
                            {{index + 1}}.
                        </p>
                        
                        <img :src="rank[1].head_img === null ? 'assets/placeholder.png' : rank[1].head_img"  alt="">
                        {{rank[0]}}
                        <span>{{rank[1].speed}} wpm</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    `
}