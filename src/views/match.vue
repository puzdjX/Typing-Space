<script>
export default {
    data: function () {
        return {
            art_name: "无本文",//文章名称
            article: "",//范文全文
            strExample: [],//范文文本
            txtContent: [], //打字文本
            inputIndex: 0,//获取焦点
            disabledTxt: false,//禁用输入框
            all_txtCon: 0,//所有输入字符数量
            is_empty: false,//判断退行条件

            // 开始游戏
            startd: false,

            // 进度
            schedule: 0,

            // 错误字数正确字数
            wrong: 0,
            correct: 0,
            cw_arr: 0,
            backspace_nm: 0,

            // 正确率错误率
            accuracy: 0,
            wrong_rate: 0,

            // 速度
            speed: 0,

            // 真错误字数
            his_wrong: 0,
            wrong_z: 0,
            accuracy_z: 0,

            // 分值
            score: 0,

            // 时间
            time_token: true,
            count: null,
            timer: 0,
            Locktime: '00:00:00',
            hour: 0,
            minute: 0,
            second: 0,

            // 限时
            li_time: 0,
            seted_time: 0,

            // 每行字数限制
            input_lim: 50,
        }
    },
    methods: {
        // 获取文章
        article_com() {
            fetch('https://ts.webt.club/api/v1/article/' + this.$route.params.id + '/words', {
                method: 'GET',
            }).then(res => {
                res.json().then(data => {
                    if (data.message === 'success') {
                        this.article = data.data.version;
                        this.art_name = data.data.name;

                        // 判断文章类型
                        fetch('https://ts.webt.club/api/v1/article/' + this.$route.params.id + '?token=' + this.$root.user.token, {
                            method: 'GET',
                        }).then(res => {
                            res.json().then(data => {
                                if (data.message === 'success') {
                                    let data_type = data.data.type;

                                    if (data_type == 0) {
                                        this.input_lim = 50;
                                        this.strExample = this.tempDate(this.article);
                                    } else if (data_type == 1) {
                                        this.input_lim = 30;
                                        this.strExample = this.chunkNewList(this.article);
                                    } else {
                                        this.input_lim = 30;
                                        this.strExample = this.chunkNewList(this.article);
                                    }
                                } else {
                                    this.$root.alertShow('token已失效,请重新登录');
                                }
                            })
                        });
                    } else {
                        this.$root.alertShow('token已失效,请重新登录');
                    }
                })
            });
        },
        // 开始
        starts() {
            if (this.startd != true) {
                this.startd = true;
                this.time();
            }
        },

        // 重新开始
        restart() {
            let progressBar = document.querySelector('.progress .bar');
            clearInterval(this.count);
            this.startd = false;

            this.disabledTxt = false;

            this.txtContent = [];
            this.accuracy = 0;
            this.accuracy_z = 0;
            this.correct = 0;
            this.wrong = 0;
            this.wrong_z = 0;
            this.schedule = 0;
            this.speed = 0;
            this.wrong_rate = 0;
            this.timer = 0;
            this.cw_arr = 0;
            this.backspace_nm = 0;
            progressBar.style.width = this.schedule + "%";


            this.Locktime = '00:00:00';
            this.hour = 0;
            this.minute = 0;
            this.second = 0;
            this.li_time = this.seted_time;
            this.time_token = true;

            for (let i = 0; i <= this.inputIndex; i++) {
                this.handleCode(i);
            }

            this.inputIndex = 0;
        },

        // 当前文本染色
        handleCode(index) {
            if (this.startd) {
                let strExample = this.strExample[index]
                let txtContent = this.txtContent[index]

                for (let a = 0; a < strExample.length; a++) {
                    if (a < txtContent.length) {
                        if (txtContent.slice(a, a + 1) === strExample.slice(a, a + 1)) {
                            this.$refs['textColor' + index][a].style.backgroundColor = '#05A28C';
                        } else {
                            this.$refs['textColor' + index][a].style.backgroundColor = 'rgb(223, 57, 84)';

                            if (this.$refs['textColor' + index][a].innerHTML == ' ') {
                                this.$refs['textColor' + index][a].style.backgroundColor = 'rgb(223, 57, 84)';
                            }
                        }

                        this.$refs['textColor' + index][a].className = "sp";
                    } else {
                        this.$refs['textColor' + index][a].style = ""
                        this.$refs['textColor' + index][a].className = "";
                    }
                }

                // 自动跳下一行
                if (txtContent.length >= strExample.length) {
                    this.inputIndex = index + 1;
                    if (this.inputIndex >= 1) {
                        document.querySelector('.type-pro').style.top = this.inputIndex * -130 + 'px';
                    }
                    this.enterNext();
                }
            } else if (this.startd === false) {
                let strExample = this.strExample[index]

                for (let a = 0; a < strExample.length; a++) {
                    this.$refs['textColor' + index][a].style = ""
                    this.$refs['textColor' + index][a].className = "";
                }

                document.querySelector('.type-pro').style.top = 0 + 'px';
            }
        },

        // 全文计算对错
        number() {
            this.is_empty = false;
            this.all_txtCon++;
            if (this.startd) {
                this.his_wrong = this.wrong;

                this.correct = 0;
                this.wrong = 0;

                for (let a = 0; a < this.strExample.length; a++) {
                    let correct = 0;
                    let wrong = 0;

                    let strExample = this.strExample[a]
                    let txtContent = this.txtContent[a]

                    if (txtContent !== 'undefined' && txtContent != null && txtContent !== '') {
                        for (let b = 0; b < strExample.length; b++) {
                            if (b < txtContent.length) {
                                if (txtContent.slice(b, b + 1) === strExample.slice(b, b + 1)) {
                                    correct++;
                                } else {
                                    wrong++;
                                }
                            }
                        }

                        this.correct += correct;
                        this.wrong += wrong;
                        this.cw_arr = this.correct + this.wrong;

                        // 计算正确率
                        this.schedule = (this.cw_arr / this.article.length * 100).toFixed(0);
                        this.accuracy = (this.correct / this.cw_arr * 100).toFixed(0);
                        this.wrong_rate = (this.wrong / this.cw_arr * 100).toFixed(0);

                        // 真实正确率与真实错误字数
                        if (this.wrong - this.his_wrong >= 0) {
                            let gap = this.wrong - this.his_wrong;
                            this.wrong_z += gap;
                            let all_txt = this.all_txtCon - this.backspace_nm;
                            this.accuracy_z = (100 - (this.wrong_z / all_txt * 100)).toFixed(0);
                        }

                        let progressBar = document.querySelector('.progress .bar');
                        progressBar.style.width = this.schedule + "%";

                        if (this.cw_arr >= this.article.length) {
                            this.end();
                        }
                    }
                }
            }
        },
        // 聚焦对应行
        enterNext() {
            if (this.startd) {
                this.$refs['areaDom' + this.inputIndex][0].focus();
                this.is_empty = true;
            }
        },

        // 检测退格
        backspace() {
            if (this.startd) {
                this.backspace_nm++;

                let txtContent = this.txtContent[this.inputIndex];

                if (this.is_empty && (txtContent == 'undefined' || txtContent == null || txtContent == '')) {
                    if (this.inputIndex >= 1) {
                        this.inputIndex = this.inputIndex - 1;
                        document.querySelector('.type-pro').style.top = this.inputIndex * -130 + 'px';

                        this.txtContent[this.inputIndex] = this.txtContent[this.inputIndex].slice(0, -1);
                        this.handleCode(this.inputIndex);
                    }
                    this.enterNext();
                } else if (txtContent == 'undefined' || txtContent == null || txtContent == '') {
                    this.is_empty = true;
                }
            }
        },

        // 时间
        time() {
            if (this.startd) {
                clearInterval(this.count);

                this.count = setInterval(() => {
                    this.timer++;
                    this.second++;
                    if (this.second >= 60) {
                        this.second = 0;
                        this.minute = this.minute + 1;
                    }
                    if (this.minute >= 60) {
                        this.minute = 0;
                        this.hour = this.hour + 1;
                    }

                    let h = this.hour < 10 ? '0' + this.hour : this.hour;
                    let m = this.minute < 10 ? '0' + this.minute : this.minute;
                    let s = this.second < 10 ? '0' + this.second : this.second;
                    this.Locktime = h + ":" + m + ":" + s;

                    this.speed = ((this.cw_arr / (this.timer) * 60) * ((100 - this.wrong_rate) / 100)).toFixed(0);

                    // 限时模式
                    if (this.li_time > 0 && this.li_time != null && this.li_time !== '') {
                        this.li_time--;

                        if (this.li_time <= 0) {
                            this.end()
                        }
                    }
                }, 1000);
            }
        },

        // 暂停
        time_end() {
            if (this.startd) {
                if (this.time_token === true) {
                    clearInterval(this.count);
                    this.time_token = false;
                    this.disabledTxt = true;
                } else {
                    this.time()
                    this.time_token = true;
                    this.disabledTxt = false;
                }
            }
        },

        // 游戏结束
        end() {
            this.startd = false;
            this.disabledTxt = true;
            let popupWrapper = document.querySelectorAll('.popup-wrapper');

            this.time_token = false;
            clearInterval(this.count);


            this.scoring();
            // popupWrapper[1].classList.toggle('show');
            // this.showUp();

            this.match_end();
        },

        // 比赛结束 提交成绩
        match_end() {
            let data = JSON.stringify({
                score: this.score,
            })

            // 获取当前时间并格式化
            const formattedTime = this.getFormattedTime();

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

            fetch('https://ts.webt.club/api/v1/match/score/' + this.$route.params.match_id + '?token=' + this.$root.user.token, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: data
            }).then(res => {
                res.json().then(data => {
                    if (data.message === 'success') {
                        this.uplo(data.data.id);
                    } else {
                        this.$root.alertShow(data.message);
                    }
                })
            });
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

        // 提交数据
        uplo(id) {
            let data = JSON.stringify({
                article_id: this.$route.params.id,
                score_id: id,
                speed: this.speed,
                accuracy: this.accuracy,
                take_time: this.Locktime,
                backspace_nm: this.backspace_nm,
                true_accuracy: this.accuracy_z,
                schedule: this.schedule,
            })

            fetch('https://ts.webt.club/api/v1/grade?token=' + this.$root.user.token, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: data
            }).then(res => {
                res.json().then(data => {
                    if (data.message === 'success') {
                        this.$router.push('/matchGrade/' + this.$route.params.match_id);
                    } else {
                        this.$root.alertShow(data.message);
                    }
                })
            });
        },

        // 拆分文章为字符串
        chunkNewList(array) {
            const length = array.length;

            // 判断文章是否正常
            if (!length || !this.input_lim || this.input_lim < 1) {
                return [];
            }

            let index = 0; //用来表示切割元素的范围start
            let resIndex = 0; //用来递增表示输出数组的下标

            //根据length和input_lim算出输出数组的长度，并且创建它。
            let result = new Array(Math.ceil(length / this.input_lim));
            //进行循环
            while (index < length) {
                //循环过程中设置result[0]和result[1]的值。该值根据array.slice切割得到。
                result[resIndex++] = array.slice(index, (index += this.input_lim));
            }
            //输出新数组
            return result;
        },

        // 拆分文章为字符串 [英文词语]
        tempDate(array) {
            let allStr = [];
            let tempData = '';

            // 分割空格
            let temp = array.split(' ');

            // 循环所有分割空格的词语，持续为当前行添加词组，如果添加的词组大于当前行的字数限制，则进入下一行继续添加。
            temp.forEach(obj => {
                if ((tempData + obj).length < this.input_lim) {
                    tempData = tempData + obj + ' ';
                } else {
                    allStr.push(tempData);
                    tempData = obj + ' ';
                }
            });
            allStr.push(tempData);

            // 输出新数组
            return allStr;
        },

        // 打开设置限时
        openPopupButton() {
            let popupWrapper = document.querySelectorAll('.popup-wrapper');
            popupWrapper[0].classList.toggle('show');
            let cusInput = document.querySelector('.custom-duration input');
            setTimeout(() => {
                cusInput.select();
            }, 100);
        },

        // 关闭设置限时
        closePopupButton() {
            let popupWrapper = document.querySelectorAll('.popup-wrapper');
            let PopupInput = document.querySelector('.custom-duration input')
            popupWrapper[0].classList.toggle('show')

            this.li_time = PopupInput.value;
            this.seted_time = PopupInput.value;
            this.$root.alertShow()
        },

        // 选择限定时间
        sel_time(e) {
            if (this.startd == false) {
                document.querySelector('.set-time .set-time-active').classList.remove('set-time-active')
                e.target.classList.add('set-time-active');

                this.li_time = e.target.innerHTML;
                this.seted_time = e.target.innerHTML;
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

        // 计算分值
        scoring() {
            let sc_ch = this.correct - this.wrong - this.backspace_nm;
            let sc_sp = this.speed * 10;
            this.score = ((sc_ch + sc_sp) * (this.accuracy_z / 100)).toFixed(2);
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
    },
    mounted() {
        // 不要动
        let popup = document.querySelector('.custom-duration');
        let popupWrapper = document.querySelectorAll('.popup-wrapper');
        let closePopupButton = document.querySelector('.custom-duration button');
        let popupInput = document.querySelector('.custom-duration input');

        popup.addEventListener('click', function (e) {
            e.stopPropagation()
        })

        popupWrapper[0].addEventListener('click', function (e) {
            if (!e.target.classList.contains('custom-duration')) {
                popupWrapper[0].classList.toggle('show');
            }
        })

        popupInput.addEventListener('keydown', (e) => {
            if (e.keyCode === 13) {
                closePopupButton.click()
            }
        })
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

        this.article_com();
    },
}
</script>

<template>
    <div class="popup-wrapper">
        <div class="custom-duration popout">
            <p>自定义限时</p>
            <input type="number" placeholder="单位为秒" value="0" oninput="value=value.replace(/[^0-9.]/g,'')">
            <button class="okBtn" @click="closePopupButton()">ok</button>
        </div>
    </div>
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
                </div>
                <div class="rating">
                    <div class="rating__stars">
                        <input id="rating-1" class="rating__input rating__input-1" type="radio" name="rating" value="1">
                        <input id="rating-2" class="rating__input rating__input-2" type="radio" name="rating" value="2">
                        <input id="rating-3" class="rating__input rating__input-3" type="radio" name="rating" value="3">
                        <input id="rating-4" class="rating__input rating__input-4" type="radio" name="rating" value="4">
                        <input id="rating-5" class="rating__input rating__input-5" type="radio" name="rating" value="5">
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
                <button class="okBtn" @click="uplo()">ok</button>
            </div>
        </div>
    </div>

    <div class="container">
        <div class="main-section">
            <div class="box type">
                <div class="title">
                    <div class="time-countdown">
                        <svg xmlns="https://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-alarm" width="50"
                            height="50" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M12 13m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                            <path d="M12 10l0 3l2 0"></path>
                            <path d="M7 4l-2.75 2"></path>
                            <path d="M17 4l2.75 2"></path>
                        </svg>

                        {{ li_time }}
                    </div>
                    {{ art_name }}
                    <ul class="set-time">
                        <li>
                            <span class="set-time-active"></span>
                        </li>
                        <li>
                            <span @click="sel_time($event)">15</span>
                        </li>
                        <li>
                            <span @click="sel_time($event)">30</span>
                        </li>
                        <li>
                            <span @click="sel_time($event)">60</span>
                        </li>
                        <li class="custom" @click="openPopupButton">
                            <svg xmlns="https://www.w3.org/2000/svg"
                                class="icon icon-tabler icon-tabler-adjustments-horizontal" width="24" height="24"
                                viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M14 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                                <path d="M4 6l8 0"></path>
                                <path d="M16 6l4 0"></path>
                                <path d="M8 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                                <path d="M4 12l2 0"></path>
                                <path d="M10 12l10 0"></path>
                                <path d="M17 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                                <path d="M4 18l11 0"></path>
                                <path d="M19 18l1 0"></path>
                            </svg>
                        </li>
                    </ul>
                </div>

                <div class="type-game">
                    <div class="type-pro">
                        <div class="text"
                            :class="txtContent[index] || inputIndex === index ? 'cen-container' : 'bg-color cen-container'"
                            onselectstart="return false" style="-moz-user-select:none;" v-for="(item, index) in strExample"
                            :key="index">
                            <div class="ar-line">
                                <span :ref="'textColor' + index" class="letter" v-for="(data, index1) in strExample[index]"
                                    :key="index1">{{ data }}</span>
                            </div>

                            <input :ref="'areaDom' + index" type="input" :maxlength="input_lim + 1"
                                :class="inputIndex === index ? 'in-border cen-textarea' : 'cen-textarea'"
                                v-model="txtContent[index]"
                                :disabled="(inputIndex !== index && !txtContent[index]) || disabledTxt"
                                @input="starts(), handleCode(index), number()" @keyup.space.native="enterNext()"
                                @keyup.delete.native="backspace()">
                        </div>
                    </div>
                </div>

                <div class="result">
                    <p>
                        <svg xmlns="https://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-speedtest"
                            width="24" height="24" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M5.636 19.364a9 9 0 1 1 12.728 0"></path>
                            <path d="M16 9l-4 4"></path>
                        </svg>
                        速度 <span>{{ speed }} wpm</span>
                    </p>
                    <p>
                        <svg xmlns="https://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-clock-hour-3"
                            width="24" height="24" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                            <path d="M12 12h3.5"></path>
                            <path d="M12 7v5"></path>
                        </svg>
                        时间 <span>{{ Locktime }}</span>
                    </p>
                    <p>
                        <svg xmlns="https://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chart-line" width="24"
                            height="24" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M4 19l16 0"></path>
                            <path d="M4 15l4 -6l4 2l4 -5l4 4"></path>
                        </svg>
                        正确率 <span>{{ accuracy }} %</span>
                    </p>
                    <p>
                        <svg xmlns="https://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-progress" width="24"
                            height="24" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M10 20.777a8.942 8.942 0 0 1 -2.48 -.969"></path>
                            <path d="M14 3.223a9.003 9.003 0 0 1 0 17.554"></path>
                            <path d="M4.579 17.093a8.961 8.961 0 0 1 -1.227 -2.592"></path>
                            <path d="M3.124 10.5c.16 -.95 .468 -1.85 .9 -2.675l.169 -.305"></path>
                            <path d="M6.907 4.579a8.954 8.954 0 0 1 3.093 -1.356"></path>
                        </svg>
                        进度 <span>{{ schedule }} %</span>
                    </p>
                    <div class="control">
                        <button @click="restart" class="control-btn restart" data-content="Restart Text">
                            <svg xmlns="https://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-rotate" width="35"
                                height="35" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M19.95 11a8 8 0 1 0 -.5 4m.5 5v-5h-5"></path>
                            </svg>
                        </button>
                        <button @click="time_end()" class="button control-btn" data-content="Pause">
                            <svg xmlns="https://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-player-pause"
                                width="35" height="35" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor"
                                fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M6 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z">
                                </path>
                                <path d="M14 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z">
                                </path>
                            </svg>
                        </button>
                    </div>
                    <div class="progress">
                        <div class="bar"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


