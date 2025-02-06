export default {
    data: function () {
        return {
            user: [],

            password: '',
            new_password: '',
        }
    },
    methods: {
        // 修改用户信息
        update() {
            let data = JSON.stringify({
                Image: this.user.head_img,
                email: this.user.email,
                phone_number: this.user.phone_number,
                session: this.user.session,
                type: this.user.type,
                username: this.user.username,
            })

            fetch('http://ts_api.webt.club/api/v1/user/message?token=' + this.$root.user.token, {
                method: 'POST',
                body: data,
            }).then(res => {
                res.json().then(data => {
                    if (data.message === 'success') {
                        this.$root.user = this.user;
                        localStorage.setItem('user', JSON.stringify(this.$root.user));
                        this.$root.alertShow("保存成功");
                    } else {
                        this.$root.alertShow("提交的数据有误");
                    }
                })
            });
        },

        // 修改密码
        update_pass() {
            if (!this.new_password == "" || !this.new_password == null || !this.new_password == undefined) {
                let data = JSON.stringify({
                    password: this.password,
                    new_password: this.new_password,
                })
    
                fetch('http://ts_api.webt.club/api/v1/user/password?token=' + this.$root.user.token, {
                    method: 'PATCH',
                    body: data,
                }).then(res => {
                    res.json().then(data => {
                        if (data.message === 'success') {
                            this.$root.alertShow("密码修改成功");
                            this.password = '';
                            this.new_password = '';
                        } else {
                            this.$root.alertShow("密码不正确");
                        }
                    })
                });
            }
        },

        // 上传图片
        update_img(){
            let formData = new FormData();
            formData.append('Image', this.$refs.photo.files[0]);

            fetch('http://ts_api.webt.club/api/v1/user/message?token=' + this.$root.user.token, {
                method: 'POST',
                body: formData,
            }).then(res => {
                res.json().then(data => {
                    if (data.message === 'success') {
                        this.myself_get();
                        this.$root.alertShow("上传成功");
                    } else {
                        this.$root.alertShow("提交的数据有误");
                    }
                })
            });
        },

        // 获取用户信息
        myself_get(){
            fetch('http://ts_api.webt.club/api/v1/user/myself/message?token=' + this.$root.user.token, {
                method: 'GET',
            }).then(res => {
                res.json().then(data => {
                    if (data.message === 'success') {
                        // console.log(data);
                        this.user.head_img = data.data.head_img;
                        this.$root.user = this.user;
                        localStorage.setItem('user', JSON.stringify(this.$root.user));
                    } else {
                        this.$root.alertShow("无法正确获取用户信息");
                    }
                })
            });
        }
    },
    created() {
        if (localStorage.getItem('user')) {
            this.user = JSON.parse(localStorage.getItem('user'));
        } else {
            this.$root.alertShow('token已失效,请重新登录');
            setTimeout(() => {
                this.$router.push('/');
            }, 2000);
        };
    },
    template: `
    <div class="container">
        <div class="main-section">
            <div class="edit-profile">
                <p>个人信息</p>
                <form class="form-profile">
                    <label for="img" class="place">+</label>
                    <img class="rounded" :src="user.head_img" alt="">
                    <input class="img-file" type="file" name="img" id="img" @change="update_img" ref="photo">
                    <label for="img">头像: </label>
                    <div class="form-group">
                        <label for="username">用户名 </label>
                        <input type="text" name="name" id="username" value="" v-model="user.username">
                    </div>
                    <div class="form-group">
                        <label for="group">班级 </label>
                        <input type="text" name="group" id="group" value="" v-model="user.type">
                    </div>
                    <div class="form-group">
                        <label for="email">电子邮箱 </label>
                        <input type="text" name="email" id="email" value="" v-model="user.email">
                    </div>
                    <div class="form-group">
                        <label for="password">原密码 </label>
                        <input type="password" name="password" id="password" value="" v-model="password">
                    </div>
                    <div class="form-group">
                        <label for="new_password">新密码 </label>
                        <input type="password" name="new_password" id="new_password" value="" v-model="new_password">
                    </div>
                    <div class="form-group">
                        <div class="col">
                            <button type="submit" @click.prevent="update(),update_pass()">保存修改</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `
}