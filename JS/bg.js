const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// 设置画布大小
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 定义星星的数量
const starCount = 80,
    // 定义星星的最大半径
    maxRadius = 3,
    // 定义星星的最大速度
    maxSpeed = 2,
    // 定义星星的颜色
    starColor = "#ffffff",
    // 定义流星的数量
    meteorCount = 5,
    // 定义流星的最大长度
    maxMeteorLength = 100,
    // 定义流星的最大速度
    maxMeteorSpeed = 5,
    // 定义流星的颜色
    meteorColor = "#FFF"

// 定义星星对象
class Star {
    constructor(x, y, radius, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        // this.speed = speed;
        this.speed = Math.max(speed, 1); // Set minimum speed to 1
    }

    update() {
        this.x -= this.speed;
        if (this.x < 0) {
            this.x = canvas.width;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        ctx.fillStyle = starColor;
        ctx.fill();
        ctx.closePath();
    }
}

// 定义流星对象
class Meteor {
    constructor(x, y, length, speed) {
        this.x = x;
        this.y = y;
        this.length = length;
        this.speed = speed;
    }

    update() {
        this.x -= this.speed;
        if (this.x < -this.length) {
            this.x = canvas.width;
            this.y = Math.random() * canvas.height;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.length, this.y);
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        ctx.strokeStyle = meteorColor;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    }
}

// 创建星星数组
const stars = [];
for (let i = 0; i < starCount; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * maxRadius;
    const speed = Math.random() * maxSpeed;
    const star = new Star(x, y, radius, speed);
    stars.push(star);
}

// 创建流星数组
const meteors = [];
for (let i = 0; i < meteorCount; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const length = Math.random() * maxMeteorLength;
    const speed = Math.random() * maxMeteorSpeed;
    const meteor = new Meteor(x, y, length, speed);
    meteors.push(meteor);
}

// 动画循环
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // for...of... 让数组里每颗星星都执行绘制和更新
    for (const star of stars) {
        star.update();
        star.draw();
    }

    for (const meteor of meteors) {
        meteor.update();
        meteor.draw();
    }

    requestAnimationFrame(animate);
}

animate();