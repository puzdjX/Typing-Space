const btn = document.querySelector('.btn'),
    signBox = document.querySelector('.sign-box'),
    signIn = document.querySelector('.sign-in'),
    signUp = document.querySelector('.sign-up'),
    signInLink = document.querySelector('.sign-in-link'),
    signUpLink = document.querySelector('.sign-up-link'),
    toggleSpan = document.querySelector('.sign-box form span'),
    signBtn = document.querySelector('.sign-box a')

function toggleAnimation() {
    signBox.classList.remove('animate-shadow');
    void signBox.offsetWidth;
    signBox.classList.add('animate-shadow');
}

function load() {
    const tl = gsap.timeline()
    tl.to('.sign-box', {
        duration: .1,
        height: 150,
        ease: 'power1.inOut',
        onComplete: () => {
            signBox.innerHTML = `
            <div class="loader"></div>
            <svg width="300" height="150" viewBox="0 0 400 400">
                <polyline fill="none" stroke="#8BD17C" stroke-width="24" points="88,214 173,284 304,138"
                    stroke-linecap="round" stroke-linejoin="round" class="tick" />
            </svg>
            `
            setTimeout(() => {
                const loader = document.querySelector('.loader');
                loader.style.display = 'none';
                gsap.to('.tick', {
                    duration: .6,
                    strokeDashoffset: 0,
                });
            }, 1500);
            setTimeout(() => {
                window.location = './home.html'
            }, 2500);
        }
    })
}

function toggleSignInBox() {
    signBox.innerHTML = `
    <span>Sign In</span>
    <form action="">
        <div class="inputbox">
            <input name="Username" type="text" id="Username" autocomplete="off" required />
            <label for="Username">用户名</label>
        </div>
        <div class="inputbox">
            <input name="Password" type="password" id="Password" required />
            <label for="Password">密码</label>
        </div>
        <a href="#">登录</a>
        <span class="sign-up-link" onclick="toggleSignUpBox()">创建新账号</span>
    </form>
  `;
    const toggleSpan = document.querySelector('.sign-box form span')
    const signBtn = document.querySelector('.sign-box a')
    toggleSpan.addEventListener('click', toggleAnimation);
    signBtn.addEventListener('click', load)
}

function toggleSignUpBox() {
    signBox.innerHTML = `
    <span>Sign Up</span>
    <form action="">
        <div class="inputbox">
            <input name="Username" type="text" id="Username" autocomplete="off" required />
            <label for="Username">用户名</label>
        </div>
        <div class="inputbox">
            <input name="Password" type="password" id="Password" required />
            <label for="Password">密码</label>
        </div>
        <a href="#">注册</a>
        <span class="sign-in-link" onclick="toggleSignInBox()">登录已有账号</span>
    </form>
  `
    const toggleSpan = document.querySelector('.sign-box form span')
    const signBtn = document.querySelector('.sign-box a')
    toggleSpan.addEventListener('click', toggleAnimation)
    signBtn.addEventListener('click', load)
}

toggleSpan.addEventListener('click', toggleAnimation)
signBtn.addEventListener('click', load)

// btn.addEventListener('mousemove', (e) => {
//     const rect = btn.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     const btnWidth = btn.clientWidth;
//     const btnHeight = btn.clientHeight;
//     const transX = (x - btnWidth / 2);
//     const transY = (y - btnHeight / 2);
//     btn.style.transform = `translateX(${transX}px) translateY(${transY}px)`;
// })
// btn.addEventListener('mouseout', (e) => {
//     btn.style.transform = '';
// })

btn.addEventListener('click', () => {
    btn.classList.add('btn-hide')
    signIn.classList.add('sign-show')
    gsap.to(signIn, {
        overflow: 'visible',
        delay: 0.24
    })
})