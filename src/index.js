import * as echarts from 'echarts';

var dom = document.getElementById('main');
var myChart = echarts.init(dom, null, {
    renderer: 'canvas',
    useDirtyRect: false
});
var app = {};

var option;

var data = [];
var dataCount = 20;
var startTime = +new Date();
var categories = [...Array(20000).keys()]
var types = [
    { name: 'Waitting', color: '#bd6d6c' },
    { name: 'Running', color: '#72b362' }
];
// Generate mock data
categories.forEach(function (category, index) {
    var baseTime = startTime;
    for (var i = 0; i < dataCount; i++) {
        var typeItem = types[Math.round(Math.random() * (types.length - 1))];
        var duration = Math.round(Math.random() * 10000);
        data.push({
            name: typeItem.name,
            value: [index, baseTime, (baseTime += duration), duration],
            itemStyle: {
                normal: {
                    color: typeItem.color
                }
            }
        });
        baseTime += Math.round(Math.random() * 2000);
    }
});
function renderItem(params, api) {
    var categoryIndex = api.value(0);
    var start = api.coord([api.value(1), categoryIndex]);
    var end = api.coord([api.value(2), categoryIndex]);
    var height = api.size([0, 1])[1] * 0.6;
    var rectShape = echarts.graphic.clipRectByRect(
        {
            x: start[0],
            y: start[1] - height / 2,
            width: end[0] - start[0],
            height: height
        },
        {
            x: params.coordSys.x,
            y: params.coordSys.y,
            width: params.coordSys.width,
            height: params.coordSys.height
        }
    );
    return (
        rectShape && {
            type: 'rect',
            transition: ['shape'],
            shape: rectShape,
            style: api.style()
        }
    );
}
option = {
    tooltip: {
        formatter: function (params) {
            return params.marker + params.name + ': ' + params.value[3] + ' ms';
        }
    },
    title: {
        text: 'Profile',
        left: 'center'
    },
    dataZoom: [
        {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'weakFilter',
            showDataShadow: false,
            top: 900,
            labelFormatter: ''
        },
        {
            type: 'inside',
            xAxisIndex: 0,
            filterMode: 'weakFilter'
        },
        {
            type: 'slider',
            yAxisIndex: 0,
            right: 100,
            filterMode: 'weakFilter',
            showDataShadow: false,
            labelFormatter: ''
        },
        {
            type: 'inside',
            yAxisIndex: 0,
            filterMode: 'weakFilter'
        }
    ],
    grid: {
        height: 800
    },
    xAxis: {
        min: startTime,
        scale: true,
        axisLabel: {
            formatter: function (val) {
                return Math.max(0, val - startTime) + ' ms';
            }
        }
    },
    yAxis: {
        data: categories
    },
    series: [
        {
            type: 'custom',
            renderItem: renderItem,
            itemStyle: {
                opacity: 0.8
            },
            encode: {
                x: [1, 2],
                y: 0
            },
            data: data
        }
    ]
};

if (option && typeof option === 'object') {
    myChart.setOption(option);
}

window.addEventListener('resize', myChart.resize);

