export default {
    data: function () {
        return {

        }
    },
    methods: {

    },
    created() {

    },
    mounted() {
        let curve = echarts.init(document.getElementById('curve'), 'chalk'),
            // bar = echarts.init(document.getElementById('bar'), 'chalk')
            pie = echarts.init(document.getElementById('pie'), 'chalk')
        const colors = ['#5470C6', '#EE6666'];
        let panel_curve = {
            title: {
                text: '本月打字速度',
                textStyle: {
                    fontSize: 24
                },
                left: 'center'
            },
            color: colors,
            tooltip: {
                trigger: 'axis',
                backgroundColor: "#fff", //设置背景颜色
                textStyle: {
                    color: "#000" //设置文字颜色
                },
                borderColor: "#79a6fe", //设置边框颜色
            },
            legend: {
                y: 'bottom',
            },
            grid: {
                top: "15%"
            },
            xAxis: [
                {
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLine: {
                        onZero: false,
                        lineStyle: {
                            color: colors[1]
                        }
                    },

                    // prettier-ignore
                    data: ['2016-1', '2016-2', '2016-3', '2016-4', '2016-5', '2016-6', '2016-7', '2016-8', '2016-9', '2016-10', '2016-11', '2016-12']
                },
                {
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLine: {
                        onZero: false,
                        lineStyle: {
                            color: colors[0]
                        }
                    },
                    // prettier-ignore
                    data: ['2015-1', '2015-2', '2015-3', '2015-4', '2015-5', '2015-6', '2015-7', '2015-8', '2015-9', '2015-10', '2015-11', '2015-12']
                }
            ],
            yAxis: [
                {
                    type: 'value',
                }
            ],
            series: [
                {
                    name: 'Precipitation(2015)',
                    type: 'line',
                    xAxisIndex: 1,
                    // smooth: true,
                    symbol: 'circle', // add symbol property
                    symbolSize: 8, // add symbolSize property
                    emphasis: {
                        focus: 'series'
                    },
                    data: [
                        2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
                    ]
                },
                {
                    name: 'Precipitation(2016)',
                    type: 'line',
                    // smooth: true,
                    symbol: 'circle', // add symbol property
                    symbolSize: 8, // add symbolSize property
                    emphasis: {
                        focus: 'series'
                    },
                    data: [
                        3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7
                    ]
                }
            ]
        }

        curve.setOption(panel_curve);

        // let panel_bar = {
        //     title: {
        //         text: '与班级平均打字速度',
        //         textStyle: {
        //             fontSize: 24
        //         },
        //         left: 'center'
        //     },
        //     tooltip: {
        //         trigger: 'axis',
        //         backgroundColor: "#fff", //设置背景颜色
        //         textStyle: {
        //             color: "#000" //设置文字颜色
        //         },
        //         borderColor: "#79a6fe", //设置边框颜色
        //     },
        //     legend: {
        //         y: 'bottom',
        //     },
        //     grid: {
        //         top: "15%"
        //     },
        //     xAxis: {
        //         type: 'value',
        //         axisLabel: {
        //             fontSize: 18
        //         },
        //     },
        //     yAxis: {
        //         type: 'category',
        //         data: ['班级', '你'],
        //         axisLabel: {
        //             color: 'transparent'
        //         },
        //     },
        //     series: [
        //         {
        //             data: [
        //                 { value: 120, name: '班级' },
        //                 { value: 180, name: '你' }
        //             ],
        //             type: 'bar',
        //             label: {
        //                 show: true, // show the labels
        //                 position: 'insideLeft', // position the labels inside the bars on the right side
        //                 color: '#fff', // set the color of the labels
        //                 fontSize: 24, // set the font size of the labels
        //                 // fontWeight: 'bold',
        //                 formatter: function (params) {
        //                     return params.data.name;
        //                 }
        //             }
        //         }
        //     ]
        // }

        // bar.setOption(panel_bar);

        let panel_pie = {
            title: {
                text: '与班级平均打字速度',
                textStyle: {
                    fontSize: 24
                },
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                y: 'bottom',
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#293441',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 26,
                            fontWeight: 'bold',
                            color: '#fff'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        { value: 1048, name: 'Search Engine' },
                        { value: 735, name: 'Direct' },
                        { value: 580, name: 'Email' },
                        { value: 484, name: 'Union Ads' },
                        { value: 300, name: 'Video Asds' },
                    ]
                }
            ]
        }
        pie.setOption(panel_pie);

        const selects = document.querySelectorAll('.select');
        window.addEventListener('DOMContentLoaded', () => {
            selects.forEach(select => {
                const button = select.querySelector('button');
                const full_height = [];

                [...select.querySelectorAll('div > a')].map(link => {
                    const styles = window.getComputedStyle(link);
                    const box = link.getBoundingClientRect();
                    const margin = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom) || 0;
                    const height = box.height + margin;
                    full_height.push(height);

                    link.addEventListener('click', () => {
                        const link_text = link.textContent;
                        const button_text = button.textContent;
                        button.textContent = link_text;
                        button.style.animationName = "popOut";
                        button.addEventListener("animationend", () => {
                            button.style.animationName = "none"
                        });
                        const span = document.createElement('span');
                        span.textContent = button_text;
                        link.innerHTML = "";
                        link.appendChild(span)
                        link.blur()
                    })
                });

                const totalHeight = full_height.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                select.dataset.totalHeight = totalHeight;
                select.style.setProperty('--max-height', totalHeight);
            });
        });
    },
    template: `
    <div class="container">
        <div class="main-section">
            <div class="stats-box">
                <div class="chart">
                    <div class="panel" id="curve"></div>
                    <div class="panel-contrast">
                        <div class="select" tabindex="0" role="button">
                            <button tabindex="0">环形图</button>
                            <div>
                                <a tabindex="0" href="javascript:void(null)"><span>柱状图</span></a>
                                <a tabindex="0" href="javascript:void(null)"><span>A形图</span></a>
                                <a tabindex="0" href="javascript:void(null)"><span>B形图</span></a>
                                <a tabindex="0" href="javascript:void(null)"><span>C形图</span></a>
                            </div>
                        </div>
                        <!-- <div class="panel" id="bar"></div> -->
                        <div class="panel" id="pie"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
}