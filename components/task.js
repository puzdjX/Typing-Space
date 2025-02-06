export default {

    template: `
    <div class="container">
        <div class="main-section">
            <div class="edit-profile">
                <p>任务</p>
                <div class="task">
                    <ul>
                        <li class="done" data-progress="已完成">练习 <a href="#">better call saul</a> 文章 <span>5</span> 次，至少 <span>200</span> 以上打字速度</li>
                        <li data-progress="已练习 6 篇">累计练习 <span>10</span> 篇文章 </li>
                        <li data-progress="最高 182 wpm">最高打字速度达到 <span>220</span> wpm </li>
                        <li class="done" data-progress="已完成">累计练习时长 <span>15</span> 分钟 </li>
                    </ul>
                    <div class="task-count">
                        已完成 1 / 4
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
}