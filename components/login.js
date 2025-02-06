export default {
    data: function () {
        return {
            username: '',
            password: '',

            error_msg: '',
            isSignIn: true
        }
    },
    methods: {
        // 加载页面
        load: function (purpose = 0) {
            const tl = gsap.timeline(),
                signBox = document.querySelector('.sign-box')
            tl.to('.sign-box', {
                duration: .1,
                height: 150,
                ease: 'power1.inOut',
                onComplete: () => {
                    let signDiv = document.querySelectorAll('.sign')
                    signDiv[purpose].style.display = 'none'
                    document.querySelector('.load-ani').style.display = 'flex'
                }
            })
        },
        loadFail: function (purpose = 0) {
            const tl = gsap.timeline(),
                signBox = document.querySelector('.sign-box')
            tl.to('.sign-box', {
                duration: .1,
                height: 360,
                ease: 'power1.inOut',
                onComplete: () => {
                    setTimeout(() => {
                        let signDiv = document.querySelectorAll('.sign')
                        signDiv[purpose].style.display = 'flex'
                        document.querySelector('.load-ani').style = 'none'
                    }, 250);
                }
            })
        },
        loadSuccess: function () {
            setTimeout(() => {
                const loader = document.querySelector('.loader');
                loader.style.display = 'none';
                gsap.to('.tick', {
                    duration: .6,
                    strokeDashoffset: 0,
                });
            }, 1500);
            setTimeout(() => {
                this.$router.push('/home');
            }, 2500);
        },

        // 登录
        login() {
            let data = {
                username: this.username,
                password: this.password,
            }
            this.load();
            fetch('http://ts_api.webt.club/api/v1/signin', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(data)
            }).then(res => {
                res.json().then(data => {
                    if (data.message == 'success') {
                        this.$root.user = data.data;
                        localStorage.setItem('user', JSON.stringify(this.$root.user));

                        this.loadSuccess()
                    } else {
                        this.loadFail();
                        this.error_msg = "用户名或密码不正确";
                    }
                });
            })
        },

        // 注册
        reg() {
            let data = {
                username: this.username,
                password: this.password,
            }
            this.load(1);
            fetch('http://ts_api.webt.club/api/v1/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            }).then(res => {
                res.json().then(data => {
                    if (data.message == 'success') {
                        this.login();
                    } else {
                        this.loadFail(1);
                        this.error_msg = data.message;
                    }
                });
            })
        },

        // 切换为注册
        login_up: function () {
            document.querySelector('.sign-ins').style.display = 'none';
            document.querySelector('.sign-up').style.display = 'flex';
            this.isSignIn = false

            this.toggleAnimation();
        },

        // 切换为登录
        login_in: function () {
            document.querySelector('.sign-up').style.display = 'none';
            document.querySelector('.sign-ins').style.display = 'flex';
            this.isSignIn = true

            this.toggleAnimation();
        },

        // 闪光
        toggleAnimation: function () {
            let signBox = document.querySelector('.sign-box');

            signBox.classList.remove('animate-shadow');
            void signBox.offsetWidth;
            signBox.classList.add('animate-shadow');
        },

        // 弹出登录页面
        btn: function () {
            let btn = document.querySelector('.btn');
            let signIn = document.querySelector('.sign-in');

            if (localStorage.getItem('user')) {
                fetch('http://ts_api.webt.club/api/v1/article?token=' + this.$root.user.token, {
                    method: 'GET',
                }).then(res => {
                    res.json().then(data => {
                        if (data.message === 'success') {
                            localStorage.setItem('user', JSON.stringify(this.$root.user));
                            this.$router.push('/home');
                        }else{
                            btn.classList.add('btn-hide')
                            signIn.classList.add('sign-show')
                            gsap.to(signIn, {
                                overflow: 'visible',
                                delay: 0.24
                            })
                        }
                    })
                });
            }else{
                btn.classList.add('btn-hide')
                signIn.classList.add('sign-show')
                gsap.to(signIn, {
                    overflow: 'visible',
                    delay: 0.24
                })
            }
        },

        // 贝塞尔曲线与动画
        showUp() {
            let tl = gsap.timeline()
            tl.to('.line', {
                height: '90%', // 缩放
                duration: 1.3, // 持续时间
                ease: ITEManimate.bezier(0.930, 0.035, 0.350, 0.815)
            })
            tl.to('.line-wrapper', {
                width: 100,
                duration: 1,
                ease: ITEManimate.bezier(0.45, 0.16, 0.22, 1)
            }, "+=0.1")
        },
    },
    created() {

    },
    mounted() {
        this.showUp();

        // 不要动
        WriteItJS.u = Array.from(
            document.querySelectorAll("*[" + "writeit-animate" + "]")
        );

        WriteItJS.u.forEach(element => {
            const newELement = element.cloneNode(true);
            newELement.id = "seo_" + element.id;
            newELement.style.display = "none";
            element.parentNode.appendChild(newELement);
        });

        WriteItJS.startAnimation();

        let signInputs = document.querySelectorAll('.inputbox input');

        signInputs.forEach(input => {
            input.addEventListener('keydown', (e) => {
                if (e.keyCode === 13) {
                    let signA = document.querySelectorAll('.sign-box a');
                    if(this.isSignIn) {
                        signA[0].click()
                    }else {
                        signA[1].click()
                    }
                }
            })
        })
    },
    template: `
    <div class="line-wrapper">
        <div class="line"></div>
    </div>
    <div class="container">
        <div class="main">
            <h1 id="title" writeit-animate="true" writeit-speed="10" writeit-start-delay="2.3">Typing Space</h1>
            <div class="start">
                <a href="#" class="btn" @click="btn">
                    Get Started →
                </a>
                <div class="sign-box sign-in sign-hide">
                    <div class="sign-ins sign">
                        <span>Sign In</span>
                        <form action="">
                            <div class="inputbox">
                                <input name="Username" type="text" autocomplete="off" required  v-model="username"/>
                                <label for="Username">用户名</label>
                            </div>
                            <div class="inputbox">
                                <input name="Password" type="password" autocomplete="current-password" required v-model="password"/>
                                <label for="Password">密码</label>
                            </div>
                            <p>{{error_msg}}</p>
                            <router-link @click.prevent="login" to="" >
                                登录
                            </router-link>
                            <span class="sign-up-link" @click="login_up" tabindex="1">创建新账号</span>
                        </form>
                    </div>

                    <div class="sign-up sign">
                        <span>Sign Up</span>
                        <form action="">
                            <div class="inputbox">
                                <input name="Username" type="text" autocomplete="off" required v-model="username"/>
                                <label for="Username">用户名</label>
                            </div>
                            <div class="inputbox">
                                <input name="Password" type="password" autocomplete="current-password" required v-model="password"/>
                                <label for="Password">密码</label>
                            </div>
                            <p>{{error_msg}}</p>

                            <router-link @click.prevent="reg" to="">
                                注册
                            </router-link>
                            <span class="sign-in-link" @click="login_in">登录已有账号</span>
                        </form>
                    </div>
                    <div class="load-ani">                    
                        <div class="loader"></div>
                        <svg width="300" height="150" viewBox="0 0 400 400">
                            <polyline fill="none" stroke="#8BD17C" stroke-width="24" points="88,214 173,284 304,138"
                                stroke-linecap="round" stroke-linejoin="round" class="tick" />
                        </svg>
                    </div>
                </div>


            </div>
        </div>
    </div>
    `
}