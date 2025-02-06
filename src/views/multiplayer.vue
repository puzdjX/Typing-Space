<script>
export default {
    data: function () {
        return {
            user: [],
            roomId: null,
            socket: null,
            ping: 0, // 添加一个ping变量用于显示延迟时间
            pingTimer: null
        }
    },
    methods: {
        // 获取实时时间
        getCurrentTime() {
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let hour = date.getHours();
            let minute = date.getMinutes();

            let formattedTime = year + '/' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day) + ' - ' + (hour < 10 ? '0' + hour : hour) + ':' + (minute < 10 ? '0' + minute : minute);
            console.log(formattedTime);
            return formattedTime;
        },

        // 发送信息
        sendMessage(name, msg, type) {
            let chatContainer = document.querySelector(".chat-message");
            let messageElement = document.createElement("p");
            messageElement.innerHTML = `<span>[${this.getCurrentTime()}]</span> ` + name + ': ' + msg;
            messageElement.classList.add('message')
            if (type === 'Server') {
                messageElement.style.color = '#79a6fe'
            }
            chatContainer.appendChild(messageElement);
        },

        // 发送ping消息
        sendPing() {
            clearInterval(this.pingTimer)
            let startTime = Date.now(); // 记录发送ping消息的时间戳
            if (this.socket.readyState === WebSocket.OPEN) { // 判断socket是否已经连接成功
                this.socket.send('ping');
                this.socket.addEventListener('message', (e) => {
                    if (e.data === 'pong') {
                        let endTime = Date.now(); // 记录接收pong消息的时间戳
                        this.ping = endTime - startTime; // 计算延迟时间（即ping值）
                        console.log(startTime, endTime, this.ping);
                    }
                });
            }
        }
    },
    created() {
        if (localStorage.getItem('user')) {
            this.$root.user = JSON.parse(localStorage.getItem('user'));
            this.user = this.$root.user;
        } else {
            this.$root.alertShow('token已失效,请重新登录');
            setTimeout(() => {
                this.$router.push('/');
                this.$root.user = [];
            }, 2000);
        };

        // 获取房间号
        this.roomId = this.$route.params.id;

        // 根据房间号连接相应的端口
        this.socket = new WebSocket("ws://localhost:" + (3000 + parseInt(this.roomId)));

        let heartbeatTimeout = 300000; // 5 分钟

        // 连接建立时触发
        this.socket.addEventListener('open', () => {
            console.log("连接已建立");

            // 心跳定时器
            let heartbeatTimer;

            // 发送心跳信号
            function sendHeartbeat() {
                this.socket.send('heartbeat');
            }

            // 收到消息时的处理
            this.socket.addEventListener('message', (e) => {
                const message = e.data;
                if (message === 'ping' || 'pong') {
                    // do nothing
                } else {
                    console.log('收到消息：', message);
                }

                // 重置心跳定时器
                clearTimeout(heartbeatTimer);
                heartbeatTimer = setTimeout(() => {
                    console.log('长时间无操作,连接已断开');
                    this.socket.close(); // 关闭连接
                }, heartbeatTimeout); // 设置心跳超时时间为 5 分钟
            });

            // 连接关闭时的处理
            this.socket.addEventListener('close', () => {
                clearTimeout(heartbeatTimer);
            });

            // 接收到新消息时触发
            this.socket.addEventListener('message', (e) => {
                // 事件对象的 data 属性包含了从服务器接收到的消息内容。可以通过访问事件对象的 data 属性来获取消息内容
                let message = e.data;
                if (message === '欢迎连接服务器') {
                    console.log(message);
                    this.sendMessage('Server', message, 'Server') // #2ba3e2
                    return
                } else if (message === 'ping') {
                    return
                } else if (message === 'pong') {
                    return
                }
                else {
                    this.sendMessage(this.user.username, message)
                }
            })

            // 定时发送心跳信号
            // heartbeatTimer = setInterval(sendHeartbeat, 3000); // 每隔3秒发送一次心跳信号
        })
    },
    mounted() {
        // const pingDiv = document.querySelectorAll('#ping')
        // pingDiv.forEach(element => {
        //     const ping = parseInt(element.innerText);
        //     if (ping > 100) {
        //         element.classList.add("highlag");
        //     } else {
        //         element.classList.remove("highlag");
        //     }
        // });

        // 创建 WebSocket 对象 / 实例, 并指定服务器地址
        // let socket = new WebSocket("ws://localhost:3000");

        let messageInput = document.querySelector(".chat input");
        let sendButton = document.querySelector(".input-panel button");

        // 发送按钮点击事件
        sendButton.addEventListener('click', () => {
            let message = messageInput.value;
            this.socket.send(message);
            messageInput.value = "";
        })

        // 回车发送
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                let message = messageInput.value;
                this.socket.send(message);
                messageInput.value = '';
            }
        });

        // setInterval(() => {
        //     this.sendPing(); // 每隔一段时间发送ping消息
        // }, 2000); // 设置发送ping消息的时间间隔为 2 秒
    },
    beforeUnmount() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.close();
        }
    },
}
</script>

<template>
    <div class="container">
        <div class="main-section">
            <div class="multiplayer-group">
                <div class="gameing">
                    <h1>游戏进行中...</h1>
                </div>
                <div class="idle">
                    <div class="room-name">
                        <h1>房间 {{ this.roomId }}</h1>
                        <p>当前人数: <strong>2</strong> 人</p>
                    </div>
                    <div class="room-setting">
                        <div class="chooseArticle">
                            选择一篇文章:
                            <select name="article" id="">
                                <option value="0">Who am i</option>
                                <option value="1">Better Call Saul</option>
                                <option value="2">It's Such a Beautiful Day</option>
                                <option value="3">The future of an illusion</option>
                                <option value="4">A special letter</option>
                            </select>
                        </div>
                        <button>开始游戏<span></span></button>
                    </div>
                    <div class="tab-UI">
                        <div class="player_list">
                            <div class="menu-info">
                                <ul>
                                    <li>头像</li>
                                    <li>名称</li>
                                    <li>Ping</li>
                                </ul>
                            </div>
                            <div class="player_detail">
                                <ul>
                                    <li>
                                        <img src="../assets/placeholder.png" alt="">
                                        <div>John</div>
                                        <div id="ping">{{ this.ping }} ms</div>
                                    </li>
                                    <!-- <li>
                                        <img src="../assets/placeholder2.png" alt="">
                                        <div>Mike</div>
                                        <div id="ping">45ms</div>
                                    </li>
                                    <li>
                                        <img src="../assets/placeholder.png" alt="">
                                        <div>Jane</div>
                                        <div id="ping">108ms</div>
                                    </li>
                                    <li>
                                        <img src="../assets/placeholder.png" alt="">
                                        <div>Skylar</div>
                                        <div id="ping">19ms</div>
                                    </li> -->
                                </ul>
                            </div>
                        </div>
                        <div class="chat">
                            <div class="chat-message">
                            </div>
                            <div class="input-panel">
                                <input type="text" placeholder="Enter">
                                <button>发送</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.gameing {
    display: none;
}

.gameing h1 {
    color: #fff;
    font-size: 48px;
    font-weight: 100;
    letter-spacing: 8px;
}

.idle {
    width: 100%;
    color: #fff;
    text-align: center;
}

.idle .room-name {
    display: inline-block;
    padding: 15px 15px;
    margin-bottom: 20px;
    border-bottom: dashed 1px #fff;
}

.idle .room-name h1 {
    font-size: 50px;
    font-weight: 100;
    margin-bottom: 15px;
}

.idle .room-name strong {
    font-size: 24px;
    text-shadow: 0px 0px 5px #fff;
    font-weight: 100;
}

.idle .room-setting {
    font-size: 24px;
}

.idle select {
    font-size: 18px;
    border-radius: 4px;
    outline: none;
    padding: 4px 0;
    cursor: pointer;
}

.room-setting button {
    margin: 40px 0;
    width: 190px;
    height: 40px;
    font-size: 22px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    position: relative;
}

.room-setting button:hover {
    filter: brightness(0.9);
}

.room-setting button:hover span {
    opacity: 1;
    right: 5%;
}

.room-setting button span {
    border: 10px solid transparent;
    border-bottom: 20px solid #000;
    position: absolute;
    transform: rotate(90deg);
    right: 15%;
    top: 0;
    bottom: 0;
    opacity: 0;
    transition: all .3s ease;
}

.tab-UI {
    position: absolute;
    left: 0;
    top: 0;
    width: 800px;
    height: 800px;
    z-index: -1;
}

.player_list {
    width: 40%;
    color: #fff;
    height: 50%;
    padding: 50px 0;
}

.menu-info {
    margin: 30px 0;
    border-bottom: 2px solid #fff;
    padding-bottom: 15px;
}

.menu-info ul {
    display: flex;
    justify-content: space-between;
    font-size: 24px;
}

.player_detail li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 20px;
    margin-bottom: 20px;
}

.player_detail li::before {
    content: '';
    position: absolute;
    left: -5%;
    width: 10px;
    height: 10px;
    background-color: #fff;
    border-radius: 50%;
}

.player_detail img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
}

.player_detail span {
    color: #79a6fe;
}

.chat {
    width: 90%;
    height: 40%;
    background-color: transparent;
    position: absolute;
    left: -5%;
    overflow: hidden;
    padding: 15px;
    /* transition: all .3s ease; */
    transition-delay: 1.5s;
}

.chat:hover {
    background-color: rgb(184 184 184 / 55%);
    transition: all .3s ease;
}

.chat:hover .chat-message {
    overflow: auto;
    border-bottom: 1px solid #fff;
    transition: all .3s ease;
}

.chat:hover .input-panel {
    opacity: 1;
    transition: all .3s ease;
}

.chat-message {
    width: 100%;
    height: 91%;
    display: flex;
    letter-spacing: 1px;
    flex-flow: column;
    align-items: baseline;
    border: none;
    overflow: hidden;
    transition-delay: 1.5s;
}

.message {
    margin-bottom: 10px;
}

.chat-message span {
    letter-spacing: 0px;
}

.input-panel {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: .0;
    /* transition: all .3s ease; */
    transition-delay: 1.5s;
}

.chat input {
    width: 100%;
    padding: 6px;
    font-size: 16px;
    color: #34365c;
    border: none;
    outline: none;
    letter-spacing: 0.5px;
}

.input-panel button {
    position: absolute;
    z-index: 10;
    right: 0;
    top: 0;
    width: 70px;
    height: 100%;
    border-radius: 0px;
    cursor: pointer;
    background-color: #cab6b63d;
    border: 1px solid #2e2e2e;
}

.input-panel button:hover {
    filter: brightness(0.6);
}

#ping {
    font-weight: bold;
}

.highlag {
    color: #ff4b2b;
    /* color: crimson; */
}

/* 滚动条样式 */
::-webkit-scrollbar {
    width: 10px;
    /* 滚动条宽度 */
    opacity: 0;
}

/* 滚动条轨道样式 */
::-webkit-scrollbar-track {
    background-color: transparent;
    /* 滚动条轨道背景色 */
}

/* 滚动条滑块样式 */
::-webkit-scrollbar-thumb {
    background-image: none;
    /* box-shadow: inset 2px 2px 5px 0 rgba(#fff, 0.5); */
    background-color: rgb(175, 175, 175);
    border-radius: 100px;
    border: none;
}

/* 滚动条滑块悬停样式 */
::-webkit-scrollbar-thumb:hover {
    background-image: none;
    /* 滚动条滑块悬停背景色 */
}
</style>