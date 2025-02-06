<script>
import gsap from 'gsap'
import html2canvas from 'html2canvas'

export default {
    data: function () {
        return {
            // 进度
            schedule: 0,

            // 错误字数正确字数
            wrong: 0,
            correct: 0,
            backspace_nm: 0,

            // 正确率错误率
            accuracy: 0,

            // 速度
            speed: 0,

            // 真错误字数
            accuracy_z: 0,

            // 分值
            score: 0,

            // 时间
            Locktime: '00:00:00',

            // 限时
            li_key: false,

            // 评分
            eva: '',

            // 用户平均成绩
            user_average: [],
            ave_speed: 0,
            ave_accuracy: 0,
            ave_take_time: 0,
            ave_schedule: 0,
            ave_accuracy_z: 0,
            ave_backspace_nm: 0,

            // 提交限制
            sub_res: false,
        }
    },
    methods: {
        // 提交数据
        uplo() {
            let popupWrapper = document.querySelectorAll('.popup-wrapper');

            // 获取当前时间并格式化
            const formattedTime = this.getFormattedTime();

            // 将要保存到本地的数据
            let dataLocal = {
                art_name: this.art_name,
                article_id: this.$route.params.id,
                speed: this.speed,
                accuracy: this.accuracy,
                take_time: this.Locktime,
                backspace_nm: this.backspace_nm,
                true_accuracy: this.accuracy_z,
                schedule: this.schedule,
                score: this.score,
                timestamp: formattedTime,
            }

            // 保存成绩到 localStorage
            this.saveScoreToLocalStorage(dataLocal);

            if (this.sub_res == false) {
                if (this.li_key == false) {
                    let data = JSON.stringify({
                        article_id: this.$route.query.id,
                        speed: this.speed,
                        accuracy: this.accuracy,
                        take_time: this.Locktime,
                        backspace_nm: this.backspace_nm,
                        true_accuracy: this.accuracy_z,
                        schedule: this.schedule,
                    })

                    if (this.speed > 600) {
                        window.location.reload()
                        return
                    }

                    this.sub_res = true;

                    fetch('https://ts.webt.club/api/v1/grade?token=' + this.$root.user.token, {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                        },
                        body: data
                    }).then(res => {
                        res.json().then(data => {
                            if (data.message === 'success') {
                                this.uplo_ass()

                                let ITEManimate = ({
                                    start: 0,
                                    bezier: function (p0, p1, p2, p3) {
                                        return ITEManimate.polyBez([p0, p1], [p2, p3]);

                                    },
                                    polyBez: function (p1, p2) {
                                        let A = [null, null],
                                            B = [null, null],
                                            C = [null, null],
                                            bezCoOrd = function (t, ax) {
                                                C[ax] = 3 * p1[ax], B[ax] = 3 * (p2[ax] - p1[ax]) - C[ax], A[ax] = 1 - C[ax] - B[ax];
                                                return t * (C[ax] + t * (B[ax] + t * A[ax]));
                                            },
                                            xDeriv = function (t) {
                                                return C[0] + t * (2 * B[0] + 3 * A[0] * t);
                                            },
                                            xForT = function (t) {
                                                let x = t,
                                                    i = 0,
                                                    z;
                                                while (++i < 14) {
                                                    z = bezCoOrd(x, 0) - t;
                                                    if (Math.abs(z) < 1e-3) break;
                                                    x -= z / xDeriv(x);
                                                }
                                                return x;
                                            };
                                        return function (t) {
                                            return bezCoOrd(xForT(t), 1);
                                        }
                                    }
                                });

                                let tl = gsap.timeline()
                                tl.to('.result-content', {
                                    display: 'none',
                                    opacity: 0,
                                    duration: .2,
                                    ease: ITEManimate.bezier(0.43, 0.05, 0.08, 1.16)
                                })
                                tl.to('.type-result', {
                                    height: 10,
                                    duration: .5,
                                    ease: ITEManimate.bezier(0.43, 0.05, 0.18, 1)
                                })
                                tl.to('.evaluate', {
                                    height: '100%',
                                    fontSize: 5,
                                    opacity: 0,
                                    duration: .5,
                                    ease: ITEManimate.bezier(0.43, 0.05, 0.08, 1.16)
                                })
                                tl.to('.type-result', {
                                    width: 10,
                                    duration: .4,
                                    delay: .1,
                                    ease: ITEManimate.bezier(0.73, 0.06, 0.67, 0.99),
                                    onComplete: function () {
                                        popupWrapper[0].classList.toggle('show');
                                    }
                                }, '<')

                                this.$root.alertShow()
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
                } else {
                    this.$root.alertShow('限时模式不得提交成绩');

                    popupWrapper[0].classList.toggle('show');
                }
            } else {
                this.$root.alertShow('请勿反复提交');
            }
        },

        // 提交评分
        uplo_ass() {
            if (this.eva) {
                let data = JSON.stringify({
                    article_id: this.$route.query.id,
                    assess: this.eva,
                })

                fetch('https://ts.webt.club/api/v1/grade/assesse?token=' + this.$root.user.token, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: data
                });
            }
        },

        // 保存成绩到 localStorage
        saveScoreToLocalStorage(data) {
            // 获取当前时间作为保存的键名
            const timestamp = new Date().toISOString();
            const key = `typing_score_${timestamp}`;

            // 将成绩数据保存到 localStorage
            localStorage.setItem(key, JSON.stringify(data));
        },

        // 获取格式化后的时间
        getFormattedTime() {
            const now = new Date();

            const year = now.getFullYear(); // 年
            const month = now.getMonth() + 1; // 月（注意：getMonth() 返回 0-11，需要加 1）
            const day = now.getDate(); // 日
            const hours = now.getHours(); // 时
            const minutes = now.getMinutes(); // 分
            const seconds = now.getSeconds(); // 秒

            // 补零函数：将单数字补零为双数字（例如 1 -> 01）
            const padZero = (num) => (num < 10 ? `0${num}` : num);

            // 格式化时间为 "2024/1/7 14:30:01"
            const formattedTime = `${year}/${month}/${day} ${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;

            return formattedTime;
        },

        // 动画
        showUp() {
            let ITEManimate = ({
                start: 0,
                bezier: function (p0, p1, p2, p3) {
                    return ITEManimate.polyBez([p0, p1], [p2, p3]);
                },
                polyBez: function (p1, p2) {
                    let A = [null, null],
                        B = [null, null],
                        C = [null, null],
                        bezCoOrd = function (t, ax) {
                            C[ax] = 3 * p1[ax], B[ax] = 3 * (p2[ax] - p1[ax]) - C[ax], A[ax] = 1 - C[ax] - B[ax];
                            return t * (C[ax] + t * (B[ax] + t * A[ax]));
                        },
                        xDeriv = function (t) {
                            return C[0] + t * (2 * B[0] + 3 * A[0] * t);
                        },
                        xForT = function (t) {
                            let x = t,
                                i = 0,
                                z;
                            while (++i < 14) {
                                z = bezCoOrd(x, 0) - t;
                                if (Math.abs(z) < 1e-3) break;
                                x -= z / xDeriv(x);
                            }
                            return x;
                        };
                    return function (t) {
                        return bezCoOrd(xForT(t), 1);
                    }
                }
            });

            let tl = gsap.timeline()
            tl.to('.type-result', {
                width: 900,
                duration: .6, // 持续时间
                delay: .1,
                ease: ITEManimate.bezier(0.73, 0.06, 0.67, 0.99),
                onComplete: this.evaluate()
            })
            tl.to('.type-result', {
                height: 600,
                duration: .8,
                ease: ITEManimate.bezier(0.43, 0.05, 0.18, 1)
            })
            tl.to('.evaluate', {
                fontSize: 55,
                opacity: 1,
                duration: .7,
                ease: ITEManimate.bezier(0.43, 0.05, 0.18, 1)
            }, '<')
            tl.to('.evaluate', {
                height: 90,
                fontSize: 34,
                duration: .8,
                delay: .2,
                ease: ITEManimate.bezier(0.43, 0.05, 0.08, 1.16)
            })
            tl.to('.result-content', {
                display: 'flex',
                opacity: 1,
                duration: .5,
                ease: ITEManimate.bezier(0.43, 0.05, 0.08, 1.16)
            })
        },

        // 结算页面 展开
        moreData() {
            let moreData = document.querySelector('i');
            let resultData = document.querySelector('.result-data');

            if (this.isUnfold) {
                resultData.style.height = '190px'
                moreData.innerText = '更多数据 ↓'
                this.isUnfold = false
            } else {
                resultData.style.height = '300px'
                moreData.innerText = '收起 ↑'
                this.isUnfold = true
            }
        },

        // 评分
        radio_eva(e) {
            this.eva = e.target.value;
        },

        // 根据信息给予评价
        evaluate() {
            let evaluate = document.querySelector('.evaluate');

            // 速度
            switch (true) {
                case this.speed < 60:
                    evaluate.innerHTML = '<h1>Bad</h1>'
                    evaluate.style.backgroundColor = '#f21233'
                    break;
                case this.speed < 100:
                    evaluate.innerHTML = '<h1>Not Bad</h1>'
                    evaluate.style.backgroundColor = '#dccd6a'
                    break;
                case this.speed < 180:
                    evaluate.innerHTML = '<h1>Good</h1>'
                    evaluate.style.backgroundColor = '#7edc6a'
                    break;
                case this.speed < 250:
                    evaluate.innerHTML = '<h1>Excellence</h1>'
                    evaluate.style.backgroundColor = '#e2c30f'
                    break;
                default:
                    evaluate.innerHTML = '<h1>Crazy</h1>'
                    evaluate.style.backgroundColor = '#c343f9'
                    break;
            }
        },

        // 排序
        bubble(list) {
            let temp = 0; // 用来交换的临时数
            // 要遍历的次数
            for (let i = 0; i < list.length - 1; i++) {
                // 从后向前依次的比较相邻两个数的大小，遍历一次后，把数组中第i小的数放在第i个位置上
                for (let j = list.length - 1; j > i; j--) {
                    // 比较相邻的元素，如果前面的数大于后面的数，则交换
                    if (list[j - 1].speed * 1 < list[j].speed * 1) {
                        temp = list[j - 1];
                        list[j - 1] = list[j];
                        list[j] = temp;
                    }
                }
            }

            return list;
        },

        // 计算平均值
        ave_count() {
            this.ave_speed = 0;
            this.ave_accuracy = 0;
            this.ave_take_time = 0;
            this.ave_schedule = 0;
            this.ave_accuracy_z = 0;
            this.ave_backspace_nm = 0;

            for (let i = 0; i < this.user_average.length; i++) {
                this.ave_accuracy = this.ave_accuracy + parseFloat(this.user_average[i].accuracy);
                this.ave_speed = this.ave_speed + parseFloat(this.user_average[i].speed);
                this.ave_take_time = this.ave_take_time + this.timeStringToSeconds(this.user_average[i].take_time);
                this.ave_schedule = this.ave_schedule + parseFloat(this.user_average[i].schedule);
                this.ave_accuracy_z = this.ave_accuracy_z + parseFloat(this.user_average[i].true_accuracy);
                this.ave_backspace_nm = this.ave_backspace_nm + parseFloat(this.user_average[i].backspace_nm);
            }

            this.ave_accuracy = (this.ave_accuracy / this.user_average.length).toFixed(0);
            this.ave_speed = (this.ave_speed / this.user_average.length).toFixed(0);
            this.ave_take_time = this.secondsToTimeString((this.ave_take_time / this.user_average.length).toFixed(0));
            this.ave_schedule = (this.ave_schedule / this.user_average.length).toFixed(0);
            this.ave_accuracy_z = (this.ave_accuracy_z / this.user_average.length).toFixed(0);
            this.ave_backspace_nm = (this.ave_backspace_nm / this.user_average.length).toFixed(0);
        },

        // 比较
        contrast() {
            let evaP = document.querySelectorAll('.data-own p');

            if (this.speed * 1 > this.ave_speed * 1) {
                evaP[0].setAttribute("class", "higher");
            } else if (this.speed * 1 == this.ave_speed * 1) {
                evaP[0].setAttribute("class", "equation");
            } else if (this.speed * 1 < this.ave_speed * 1) {
                evaP[0].setAttribute("class", "below");
            }

            if (this.accuracy * 1 > this.ave_accuracy * 1) {
                evaP[1].setAttribute("class", "higher");
            } else if (this.accuracy * 1 == this.ave_accuracy * 1) {
                evaP[1].setAttribute("class", "equation");
            } else if (this.accuracy * 1 < this.ave_accuracy * 1) {
                evaP[1].setAttribute("class", "below");
            }

            let li_time = this.timeStringToSeconds(this.Locktime);
            let li_ave_time = this.timeStringToSeconds(this.ave_take_time);

            if (li_time > li_ave_time) {
                evaP[2].setAttribute("class", "below");
            } else if (li_time == li_ave_time) {
                evaP[2].setAttribute("class", "equation");
            } else if (li_time < li_ave_time) {
                evaP[2].setAttribute("class", "higher");
            }

            if (this.schedule * 1 > this.ave_schedule * 1) {
                evaP[3].setAttribute("class", "higher");
            } else if (this.schedule * 1 == this.ave_schedule * 1) {
                evaP[3].setAttribute("class", "equation");
            } else if (this.schedule * 1 < this.ave_schedule * 1) {
                evaP[3].setAttribute("class", "below");
            }

            if (this.accuracy_z * 1 > this.ave_accuracy_z * 1) {
                evaP[4].setAttribute("class", "higher");
            } else if (this.accuracy_z * 1 == this.ave_accuracy_z * 1) {
                evaP[4].setAttribute("class", "equation");
            } else if (this.accuracy_z * 1 < this.ave_accuracy_z * 1) {
                evaP[4].setAttribute("class", "below");
            }

            if (this.backspace_nm * 1 > this.ave_backspace_nm * 1) {
                evaP[5].setAttribute("class", "below");
            } else if (this.backspace_nm * 1 == this.ave_backspace_nm * 1) {
                evaP[5].setAttribute("class", "equation");
            } else if (this.backspace_nm * 1 < this.ave_backspace_nm * 1) {
                evaP[5].setAttribute("class", "higher");
            }
        },

        // 计算平均值
        average(index, e) {
            if (e) {
                document.querySelector('.compare-select .selected').classList.remove('selected');
                e.target.classList.add('selected');
            }

            switch (index) {
                case 1:
                    // 获取文章最佳数据
                    fetch('https://ts.webt.club/api/v1/user/' + this.$route.query.id + '/grade?token=' + this.$root.user.token, {
                        method: 'GET',
                    }).then(res => {
                        res.json().then(data => {
                            if (data.message === 'success') {
                                this.user_average = data.data;
                                this.user_average = (this.bubble(this.user_average)[0]);

                                this.ave_accuracy = this.user_average.accuracy;
                                this.ave_speed = this.user_average.speed;
                                this.ave_take_time = this.user_average.take_time;
                                this.ave_schedule = this.user_average.schedule;
                                this.ave_accuracy_z = this.user_average.true_accuracy;
                                this.ave_backspace_nm = this.user_average.backspace_nm;

                                this.contrast();
                            } else {
                                this.$root.alertShow(data.message);
                            }
                        })
                    });
                    break;

                case 2:
                    // 获取个人平均数据
                    fetch('https://ts.webt.club/api/v1/user/' + this.$route.query.id + '/grade?token=' + this.$root.user.token, {
                        method: 'GET',
                    }).then(res => {
                        res.json().then(data => {
                            if (data.message === 'success') {
                                this.user_average = data.data;

                                this.ave_count();
                                this.contrast();
                            } else {
                                this.$root.alertShow(data.message);
                            }
                        })
                    });
                    break;

                case 3:
                    // 获取文章最佳数据
                    fetch('https://ts.webt.club/api/v1/article/' + this.$route.query.id + '/grade?token=' + this.$root.user.token, {
                        method: 'GET',
                    }).then(res => {
                        res.json().then(data => {
                            if (data.message === 'success') {
                                this.user_average = data.data;
                                this.user_average = (this.bubble(this.user_average)[0]);

                                this.ave_accuracy = this.user_average.accuracy;
                                this.ave_speed = this.user_average.speed;
                                this.ave_take_time = this.user_average.take_time;
                                this.ave_schedule = this.user_average.schedule;
                                this.ave_accuracy_z = this.user_average.true_accuracy;
                                this.ave_backspace_nm = this.user_average.backspace_nm;

                                this.contrast();
                            } else {
                                this.$root.alertShow(data.message);
                            }
                        })
                    });
                    break;

                case 4:
                    // 获取文章平均数据
                    fetch('https://ts.webt.club/api/v1/article/' + this.$route.query.id + '/grade?token=' + this.$root.user.token, {
                        method: 'GET',
                    }).then(res => {
                        res.json().then(data => {
                            if (data.message === 'success') {
                                this.user_average = data.data;

                                this.ave_count();
                                this.contrast();
                            } else {
                                this.$root.alertShow(data.message);
                            }
                        })
                    });
                    break;

                default:
                    break;
            }
        },

        // 计算分值
        scoring() {
            let sc_ch = this.correct - this.wrong - this.backspace_nm;
            let sc_sp = this.speed * 10;
            this.score = ((sc_ch + sc_sp) * (this.accuracy_z / 100) * (this.accuracy / 100)).toFixed(2);
        },

        // 时间戳转换秒数
        timeStringToSeconds(timeString) {
            const [hours, minutes, seconds] = timeString.split(':').map(Number);
            return hours * 3600 + minutes * 60 + seconds;
        },

        // 秒数转换时间戳
        secondsToTimeString(totalSeconds) {
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        },

        // 下载结算页面图片
        saveResult(e) {
            let result = document.querySelector('.type-result');
            let resHandles = document.querySelectorAll('.res-handle')
            let resSave = document.querySelector('.qrcode')
            if (!this.isUnfold) {
                this.moreData()
            }
            resHandles.forEach(div => {
                div.style.opacity = 0
            });
            resSave.style.opacity = 1
            let canvas = document.createElement('canvas');
            canvas.width = result.scrollWidth;
            canvas.height = result.scrollHeight;
            canvas.style.width = result.offsetWidth + "px";
            canvas.style.height = result.offsetHeight + "px";
            let ctx = canvas.getContext('2d');

            // 重新计算图片的宽高比
            let data = result.getBoundingClientRect();
            let scale = window.devicePixelRatio;
            canvas.width = data.width * scale;
            canvas.height = data.height * scale;
            canvas.style.width = data.width + "px";
            canvas.style.height = data.height + "px";
            ctx.scale(scale, scale);

            let opts = {
                scale: scale,
                canvas: canvas,
                width: data.width,
                height: data.height,
                offsetX: data.left,
                offsetY: data.top
            };

            // 计算需要放大的比例
            let zoomRatio = 1.01;

            // 计算需要裁剪的宽高
            let cropWidth = data.width / zoomRatio;
            let cropHeight = data.height / zoomRatio;

            // 计算裁剪的起始点坐标
            let cropX = (data.width - cropWidth) / 2;
            let cropY = (data.height - cropHeight) / 2;

            // 设置裁剪区域
            ctx.beginPath();
            ctx.rect(cropX, cropY, cropWidth, cropHeight);
            ctx.closePath();
            ctx.clip();

            html2canvas(result, opts).then(function (canvas) {
                // 创建一个图片元素
                let img = canvas.toDataURL("image/png");
                // 创建一个链接元素
                let link = document.createElement('a');
                link.href = img;
                // 设置下载的文件名
                link.download = 'result.png';
                // 模拟点击触发下载
                link.click();
                resHandles.forEach(div => {
                    div.style.opacity = 1
                });
                resSave.style.opacity = 0
            });
        },

        handleEnd(data) {
            this.article_id = data.article_id;
            this.speed = data.speed;
            this.accuracy = data.accuracy;
            this.Locktime = data.Locktime;
            this.wrong = data.wrong;
            this.correct = data.correct;
            this.backspace_nm = data.backspace_nm;
            this.accuracy_z = data.accuracy_z;
            this.schedule = data.schedule;
            this.li_key = data.li_key

            let popupWrapper = document.querySelectorAll('.popup-wrapper');
            popupWrapper[0].classList.toggle('show');

            this.scoring();
            this.average(4);
            this.showUp();
        }
    },
    mounted() {

    },
    created() {
        if (localStorage.getItem('user')) {
            this.$root.user = JSON.parse(localStorage.getItem('user'));
        } else {
            this.$root.alertShow('token已失效,请重新登录')
            setTimeout(() => {
                this.$router.push('/');
                this.$root.user = [];
            }, 2000);
        };
    },
}
</script>


<template>
    <div class="popup-wrapper">
        <div class="type-result popout">
            <div class="evaluate">
            </div>
            <div class="result-content">
                <div class="result-data">
                    <div class="data data-own">
                        <div class="data-name">{{ $root.user.username }}</div>
                        <p>速度：<span>{{ speed }} wpm</span></p>
                        <p>正确率：<span>{{ accuracy }}%</span></p>
                        <p>时间：<span>{{ Locktime }}</span></p>
                        <p>进度：<span>{{ schedule }} %</span></p>
                        <p>真实正确率：<span>{{ accuracy_z }} %</span></p>
                        <p>退格数：<span>{{ backspace_nm }} 次</span></p>
                        <p>分值：<span>{{ score }} 分</span></p>
                    </div>
                    <svg xmlns="https://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrows-exchange" width="45"
                        height="45" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M7 10h14l-4 -4"></path>
                        <path d="M17 14h-14l4 4"></path>
                    </svg>
                    <div class="data data-compare">
                        <ul class="compare-select res-handle">
                            <li @click="average(1, $event)">个人最佳</li>
                            <li @click="average(2, $event)">个人平均</li>
                            <li @click="average(3, $event)">文章最佳</li>
                            <li class="selected" @click="average(4, $event)">文章平均</li>
                            <li class=""><a href="javascript:" id="export" @click="saveResult()">
                                    导出图片
                                    <svg xmlns="https://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="icon icon-tabler icons-tabler-outline icon-tabler-download">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                                        <path d="M7 11l5 5l5 -5" />
                                        <path d="M12 4l0 12" />
                                    </svg>
                                </a></li>
                        </ul>
                        <div class="data-name">平均成绩</div>
                        <p>速度：<span>{{ ave_speed }} wpm</span></p>
                        <p>正确率：<span>{{ ave_accuracy }} %</span></p>
                        <p>时间：<span>{{ ave_take_time }}</span></p>
                        <p>进度：<span>{{ ave_schedule }} %</span></p>
                        <p>真实正确率：<span>{{ ave_accuracy_z }} %</span></p>
                        <p>退格数：<span>{{ ave_backspace_nm }} 次</span></p>
                    </div>
                    <i class="res-handle" @click="moreData()">更多数据 ↓</i>
                </div>
                <div class="rating res-handle">
                    <div class="rating__stars">
                        <input id="rating-1" class="rating__input rating__input-1" type="radio" name="rating" value="1"
                            v-on:change="radio_eva($event)">
                        <input id="rating-2" class="rating__input rating__input-2" type="radio" name="rating" value="2"
                            v-on:change="radio_eva($event)">
                        <input id="rating-3" class="rating__input rating__input-3" type="radio" name="rating" value="3"
                            v-on:change="radio_eva($event)">
                        <input id="rating-4" class="rating__input rating__input-4" type="radio" name="rating" value="4"
                            v-on:change="radio_eva($event)">
                        <input id="rating-5" class="rating__input rating__input-5" type="radio" name="rating" value="5"
                            v-on:change="radio_eva($event)">
                        <label class="rating__label" for="rating-1">
                            <svg class="rating__star" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
                                <g transform="translate(16,16)">
                                    <circle class="rating__star-ring" fill="none" stroke="#000" stroke-width="16" r="8"
                                        transform="scale(0)" />
                                </g>
                                <g stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <g transform="translate(16,16) rotate(180)">
                                        <polygon class="rating__star-stroke"
                                            points="0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07"
                                            fill="none" />
                                        <polygon class="rating__star-fill"
                                            points="0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07"
                                            fill="#000" />
                                    </g>
                                    <g transform="translate(16,16)" stroke-dasharray="12 12" stroke-dashoffset="12">
                                        <polyline class="rating__star-line" transform="rotate(0)" points="0 4,0 16" />
                                        <polyline class="rating__star-line" transform="rotate(72)" points="0 4,0 16" />
                                        <polyline class="rating__star-line" transform="rotate(144)" points="0 4,0 16" />
                                        <polyline class="rating__star-line" transform="rotate(216)" points="0 4,0 16" />
                                        <polyline class="rating__star-line" transform="rotate(288)" points="0 4,0 16" />
                                    </g>
                                </g>
                            </svg>
                        </label>
                        <label class="rating__label" for="rating-2">
                            <svg class="rating__star" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
                                <g transform="translate(16,16)">
                                    <circle class="rating__star-ring" fill="none" stroke="#000" stroke-width="16" r="8"
                                        transform="scale(0)" />
                                </g>
                                <g stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <g transform="translate(16,16) rotate(180)">
                                        <polygon class="rating__star-stroke"
                                            points="0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07"
                                            fill="none" />
                                        <polygon class="rating__star-fill"
                                            points="0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07"
                                            fill="#000" />
                                    </g>
                                    <g transform="translate(16,16)" stroke-dasharray="12 12" stroke-dashoffset="12">
                                        <polyline class="rating__star-line" transform="rotate(0)" points="0 4,0 16" />
                                        <polyline class="rating__star-line" transform="rotate(72)" points="0 4,0 16" />
                                        <polyline class="rating__star-line" transform="rotate(144)" points="0 4,0 16" />
                                        <polyline class="rating__star-line" transform="rotate(216)" points="0 4,0 16" />
                                        <polyline class="rating__star-line" transform="rotate(288)" points="0 4,0 16" />
                                    </g>
                                </g>
                            </svg>
                        </label>
                        <label class="rating__label" for="rating-3">
                            <svg class="rating__star" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
                                <g transform="translate(16,16)">
                                    <circle class="rating__star-ring" fill="none" stroke="#000" stroke-width="16" r="8"
                                        transform="scale(0)" />
                                </g>
                                <g stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <g transform="translate(16,16) rotate(180)">
                                        <polygon class="rating__star-stroke"
                                            points="0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07"
                                            fill="none" />
                                        <polygon class="rating__star-fill"
                                            points="0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07"
                                            fill="#000" />
                                    </g>
                                    <g transform="translate(16,16)" stroke-dasharray="12 12" stroke-dashoffset="12">
                                        <polyline class="rating__star-line" transform="rotate(0)" points="0 4,0 16" />
                                        <polyline class="rating__star-line" transform="rotate(72)" points="0 4,0 16" />
                                        <polyline class="rating__star-line" transform="rotate(144)" points="0 4,0 16" />
                                        <polyline class="rating__star-line" transform="rotate(216)" points="0 4,0 16" />
                                        <polyline class="rating__star-line" transform="rotate(288)" points="0 4,0 16" />
                                    </g>
                                </g>
                            </svg>
                        </label>
                        <label class="rating__label" for="rating-4">
                            <svg class="rating__star" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
                                <g transform="translate(16,16)">
                                    <circle class="rating__star-ring" fill="none" stroke="#000" stroke-width="16" r="8"
                                        transform="scale(0)" />
                                </g>
                                <g stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <g transform="translate(16,16) rotate(180)">
                                        <polygon class="rating__star-stroke"
                                            points="0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07"
                                            fill="none" />
                                        <polygon class="rating__star-fill"
                                            points="0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07"
                                            fill="#000" />
                                    </g>
                                    <g transform="translate(16,16)" stroke-dasharray="12 12" stroke-dashoffset="12">
                                        <polyline class="rating__star-line" transform="rotate(0)" points="0 4,0 16" />
                                        <polyline class="rating__star-line" transform="rotate(72)" points="0 4,0 16" />
                                        <polyline class="rating__star-line" transform="rotate(144)" points="0 4,0 16" />
                                        <polyline class="rating__star-line" transform="rotate(216)" points="0 4,0 16" />
                                        <polyline class="rating__star-line" transform="rotate(288)" points="0 4,0 16" />
                                    </g>
                                </g>
                            </svg>
                        </label>
                        <label class="rating__label" for="rating-5">
                            <svg class="rating__star" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
                                <g transform="translate(16,16)">
                                    <circle class="rating__star-ring" fill="none" stroke="#000" stroke-width="16" r="8"
                                        transform="scale(0)" />
                                </g>
                                <g stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <g transform="translate(16,16) rotate(180)">
                                        <polygon class="rating__star-stroke"
                                            points="0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07"
                                            fill="none" />
                                        <polygon class="rating__star-fill"
                                            points="0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07"
                                            fill="#000" />
                                    </g>
                                    <g transform="translate(16,16)" stroke-dasharray="12 12" stroke-dashoffset="12">
                                        <polyline class="rating__star-line" transform="rotate(0)" points="0 4,0 16" />
                                        <polyline class="rating__star-line" transform="rotate(72)" points="0 4,0 16" />
                                        <polyline class="rating__star-line" transform="rotate(144)" points="0 4,0 16" />
                                        <polyline class="rating__star-line" transform="rotate(216)" points="0 4,0 16" />
                                        <polyline class="rating__star-line" transform="rotate(288)" points="0 4,0 16" />
                                    </g>
                                </g>
                            </svg>
                        </label>
                    </div>
                    <p>为这篇文章打打分吧~</p>
                </div>
                <button class="okBtn res-handle" @click="uplo()">ok</button>
                <div class="qrcode">
                    <img src="../assets/QRcode.png" alt="">
                </div>
            </div>
        </div>
    </div>

    <router-view :handleEnd="handleEnd"></router-view>
</template>