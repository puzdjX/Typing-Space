<script>
import *  as  echarts from 'echarts/core';
import { LineChart, HeatmapChart } from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    VisualMapComponent,
    LegendComponent,
    CalendarComponent,
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    VisualMapComponent,
    LegendComponent,
    CalendarComponent,
    LineChart,
    HeatmapChart,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer
]);

export default {
    data: function () {
        return {
            yxline_data: {
                date: [],
                weekday: [],
            },
            ech_data: [],
            line: [],
            end_time: '2024-1',
            user_data: [],
            data: [], // 数据
            year: 2024, // 年份
            article_id: '', // 文章ID

            // 图表
            curve: '',
            heatmap: '',
            type: false,
        }
    },
    methods: {
        load_curve() {
            this.curve = echarts.init(document.getElementById('curve'))
            const colors = ['#ff8144', '#EE6666', '#ffa800', '#107300', '#107300', '#009ea0', '#4b00a0', '#9e00a0', '#000000'];
            let panel_curve = {
                color: colors,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                legend: {},
                grid: {
                    top: 70,
                    bottom: 50
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
                        data: this.yxline_data.date
                        // data: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日',]
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
                        data: this.yxline_data.weekday
                        // data: ['12月1日', '12月2日', '12月3日', '12月4日', '12月5日', '12月6日', '12月7日',]
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: 'wpm',
                        type: 'line',
                        xAxisIndex: 1,
                        smooth: false,
                        emphasis: {
                            focus: 'series'
                        },
                        data: this.user_data,
                        // data: [200, 220, 274, 235, 249, 258, 312],
                        symbol: 'circle', // Set the symbol to 'circle'
                        symbolSize: 8 // Set the size of the symbol
                    },
                ],
            };
            this.curve.setOption(panel_curve);

            // console.log(this.ech_data);
            this.heatmap = echarts.init(document.getElementById('heatmap'))
            let panel_heatmap = {
                tooltip: {
                    position: 'top',
                    trigger: 'item',
                    formatter: function (params) {
                        return params.value[0] + `<br />` +
                            '练习文章数：' + params.value[1] + `<br />`
                            + '练习时间：' + params.value[2] + `<br />`
                            + '平均速度：' + params.value[3] + ' wpm' + `<br />`
                            + '最高速度：' + params.value[4] + ' wpm';
                    }
                },
                visualMap: {
                    min: 0,
                    max: 10,
                    calculable: true,
                    orient: 'horizontal',
                    left: 'center',
                    top: 'top',
                    color: ['rgb(57, 211, 83)', 'rgb(38, 166, 65)', 'rgb(0, 109, 50)', 'rgb(14, 68, 41)', 'rgb(22, 27, 34)'],
                    show: false,
                },
                calendar: [
                    {
                        range: this.year,
                        cellSize: ['auto', 30],
                        dayLabel: {
                            color: 'white', // 修改字体颜色
                            fontSize: 12, // 修改字体大小
                        },
                        monthLabel: {
                            color: 'white', // 修改字体颜色
                            fontSize: 16, // 修改字体大小
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#c7d1dc',
                                width: 3,
                                type: 'solid',
                            },
                        },
                    },
                ],
                series: [
                    {
                        type: 'heatmap',
                        coordinateSystem: 'calendar',
                        calendarIndex: 0,
                        data: this.ech_data,
                        itemStyle: {
                            borderColor: 'black',
                            borderWidth: 4,
                            borderRadius: 4,
                        },
                    },
                ],
            }
            this.heatmap.setOption(panel_heatmap);

            this.type = true;
        },
        get_mounth() {
            let date = new Date;
            if (date.getMonth() + 1 === 12) {
                this.start_time = date.getFullYear() + '-' + (date.getMonth() + 1);
                this.end_time = date.getFullYear() + 1 + '-' + 1;
            } else {
                this.start_time = date.getFullYear() + '-' + (date.getMonth() + 1);
                this.end_time = date.getFullYear() + '-' + (date.getMonth() + 2);
            }
            this.get_data();
        },
        get_data() {
            fetch('https://ts.webt.club/api/v1/user/grade/' + this.start_time + '/' + this.end_time + '?token=' + this.$root.user.token, {
                method: 'GET',
            }).then(res => {
                res.json().then(data => {
                    if (data.message === 'success') {
                        delete data.data[Object.keys(data.data)[Object.keys(data.data).length - 1]];
                        let arr_data = Object.keys(data.data);
                        function get_weekday(day) {
                            var weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
                            let data = new Date(day);
                            return weekday[data.getDay()];
                        }
                        for (let i = 0; i < arr_data.length; i++) {
                            if (data.data[arr_data[i]].grade_total !== 0) {
                                this.yxline_data.date.push(arr_data[i]);
                                this.user_data.push(data.data[arr_data[i]].faster_speed);
                                this.yxline_data.weekday.push(get_weekday(arr_data[i]));
                            }
                        }
                    } else {
                        this.$root.alertShow(data.message);
                        setTimeout(() => {
                            this.$router.push('/');
                            this.$root.user = [];
                        }, 2000);
                    }
                })
            })

            fetch('https://ts.webt.club/api/v1/user/grade/' + (this.year + '-01-01') + '/' + (+this.year + 1 + '-01-01') + '?token=' + this.$root.user.token, {
                method: 'get',
            }).then(res => {
                res.json().then(data => {
                    if (data.message === 'success') {
                        let a = Object.keys(data.data).pop();
                        delete data.data[a];
                        for (const aKey in data.data) {
                            this.ech_data.push([
                                aKey,
                                data.data[aKey].grade_total,
                                data.data[aKey].take_time.toString(),
                                data.data[aKey].average_speed,
                                data.data[aKey].faster_speed,
                            ])
                        }
                        this.load_curve()
                    } else {
                        this.$root.alertShow(data.message);
                        setTimeout(() => {
                            this.$router.push('/');
                            this.$root.user = [];
                        }, 2000);
                    }
                })
            })
        },
    },
    created() {
    },
    mounted() {
        this.get_mounth();
    },
    unmounted() {
        if (this.type) {
            this.curve.dispose();
            this.heatmap.dispose();
        }
    }
}
</script>

<template>
    <div class="container">
        <div class="main-section">
            <div class="stats-box">
                <div class="chart">
                    <div class="panel" id="curve"></div>
                    <div class="panel" id="heatmap"></div>
                </div>
            </div>
        </div>
    </div>
</template>
