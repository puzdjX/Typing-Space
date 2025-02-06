// 设置贝塞尔曲线函数？
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

const tl = gsap.timeline()
tl.to('.line', {
    height: '90%', // 缩放
    duration: 1.5, // 持续时间
    ease: ITEManimate.bezier(0.930, 0.035, 0.350, 0.815)
})
tl.to('.line-wrapper', {
    width: 100,
    duration: 1,
    ease: ITEManimate.bezier(0.45, 0.16, 0.22, 1)
}, "+=0.1")