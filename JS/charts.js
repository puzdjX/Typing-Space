let curve = echarts.init(document.getElementById('curve'), 'chalk'),
    bar = echarts.init(document.getElementById('bar'), 'chalk'),
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
            type: 'value'
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

let panel_bar = {
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
    xAxis: {
        type: 'value'
    },
    yAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    series: [
        {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar'
        }
    ]
}

bar.setOption(panel_bar);

let panel_pie = {
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
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 16,
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
                { value: 300, name: 'Video Ads' }
            ]
        }
    ]
}

pie.setOption(panel_pie);