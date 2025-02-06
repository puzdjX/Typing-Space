<script>
export default {
    data: function () {
        return {
            user: [],
            imageUrl: '',

            password: '',
            new_password: '',
        }
    },
    methods: {
        // 修改用户信息
        update() {
            let formData = new FormData();
            if (this.$refs.photo.files[0]) {
                formData.append('Image', this.$refs.photo.files[0]);
            }

            if (this.user.email) {
                formData.append('email', this.user.email);
            }

            if (this.user.type) {
                formData.append('type', this.user.type);
            }

            if (this.user.username) {
                formData.append('username', this.user.username);
            }

            fetch('https://ts.webt.club/api/v1/user/message?token=' + this.$root.user.token, {
                method: 'POST',
                body: formData,
            }).then(res => {
                res.json().then(data => {
                    if (data.message === 'success') {
                        this.user = data.data;
                        this.$root.user = this.user;
                        localStorage.setItem('user', JSON.stringify(this.$root.user));

                        this.$root.alertShow("保存成功", 'success');
                    } else {
                        this.$root.alertShow("提交的数据有误", 'fail');
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

                fetch('https://ts.webt.club/api/v1/user/password?token=' + this.$root.user.token, {
                    method: 'PATCH',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: data,
                }).then(res => {
                    res.json().then(data => {
                        if (data.message === 'success') {
                            this.$root.alertShow("密码修改成功", 'success');
                            this.password = '';
                            this.new_password = '';
                        } else {
                            this.$root.alertShow("密码不正确", 'fail');
                        }
                    })
                });
            }
        },

        // 点击头像上传头像
        img_file() {
            this.$refs.photo.click();
        },

        // 获取用户信息
        myself_get() {
            fetch('https://ts.webt.club/api/v1/user/myself/message?token=' + this.$root.user.token, {
                method: 'GET',
            }).then(res => {
                res.json().then(data => {
                    if (data.message === 'success') {
                        if (data.data.head_img) {
                            this.user.head_img = data.data.head_img;
                        }

                        this.$root.user = this.user;
                        localStorage.setItem('user', JSON.stringify(this.$root.user));
                    } else {
                        this.$root.alertShow("无法正确获取用户信息");
                    }
                })
            });
        },
        onFileChange(e) {
            let files = e.target.files || e.dataTransfer.files;
            if (!files.length) {
                return
            }

            let reader = new FileReader();
            reader.onload = (e) => {
                this.imageUrl = e.target.result; // 将图片的Base64编码赋值给imageUrl  
            };
            reader.readAsDataURL(files[0]); // 读取文件内容  
        },
    },
    created() {
        if (localStorage.getItem('user')) {
            this.$root.user = JSON.parse(localStorage.getItem('user'));
            this.user = this.$root.user;
            this.myself_get();
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
        <div class="main-section">
            <div class="edit-profile">
                <p>个人信息</p>
                <form class="form-profile">
                    <img v-if="imageUrl" class="rounded" @click="img_file()" :src="imageUrl" alt="">
                    <img v-else-if="user.head_img" class="rounded" @click="img_file()" :src="user.head_img" alt="">
                    <label v-else for="img" class="place">+</label>

                    <input class="img-file" @change="onFileChange" type="file" name="img" id="img" ref="photo">
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

                    <!-- <div class="g-recaptcha" data-sitekey="6LdBd5kpAAAAAGEAzwfIIBvmowMkdMNtxXBT5HNn"></div> -->

                    <div class="form-group">
                        <div class="col">
                            <button type="submit" @click.prevent="update(), update_pass()">保存修改</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
