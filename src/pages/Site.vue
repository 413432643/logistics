<template>
  <el-row :gutter="10" style="margin: 0; padding: 0; margin-top: 1vh">
    <el-col :span="6">
      <!-- 基础信息 -->
      <chartpanel title="基础信息" style="height: 30vh">
        <div class="flex" style="margin-top: 3vh">
          <div class="flex_item">
            <div class="baseinfoitem flex">
              <div class="icon text_color_11">
                <el-icon><School /></el-icon>
              </div>
              <div class="desc flex_item">
                <div class="value text_color_11">
                  {{ baseinfodata.value1 }}<span class="unit">个</span>
                </div>
                <div class="name">网点数量</div>
              </div>
            </div>
          </div>
          <div class="split_line_h"></div>
          <div class="flex_item">
            <div class="baseinfoitem flex">
              <div class="icon text_color_12">
                <el-icon><Location /></el-icon>
              </div>
              <div class="desc flex_item">
                <div class="value text_color_12">
                  {{ baseinfodata.value2 }}<span class="unit">个</span>
                </div>
                <div class="name">覆盖小区</div>
              </div>
            </div>
          </div>
        </div>
        <div class="split_line_w" style="margin-top: 2vh"></div>
        <div class="flex" style="margin-top: 2vh">
          <div class="flex_item">
            <div class="baseinfoitem flex">
              <div class="icon text_color_13">
                <el-icon><SetUp /></el-icon>
              </div>
              <div class="desc flex_item">
                <div class="value text_color_13">
                  {{ baseinfodata.value3 }}<span class="unit">个</span>
                </div>
                <div class="name">加盟站点</div>
              </div>
            </div>
          </div>
          <div class="split_line_h"></div>
          <div class="flex_item">
            <div class="baseinfoitem flex">
              <div class="icon text_color_14">
                <el-icon><Platform /></el-icon>
              </div>
              <div class="desc flex_item">
                <div class="value text_color_14">
                  {{ baseinfodata.value4 }}<span class="unit">个</span>
                </div>
                <div class="name">菜鸟驿站</div>
              </div>
            </div>
          </div>
        </div>
      </chartpanel>
      <!-- 级别分布 -->
      <chartpanel title="级别分布" style="height: 30vh; margin-top: 1vh">
        <v-chart
          ref="levelChart"
          style="min-height: 25vh"
          :option="levelChartOption"
        >
        </v-chart>
      </chartpanel>
      <!-- 数量走势 -->
      <chartpanel title="数量走势" style="height: 30vh; margin-top: 1vh">
        <v-chart
          ref="numberChart"
          style="min-height: 25vh"
          :option="numberChartOption"
        >
        </v-chart>
      </chartpanel>
    </el-col>
    <el-col :span="18">
      <!-- 订单位置分布 -->
      <chartpanel title="订单位置分布" style="height: 92.4vh">
        <div :id="mapId" style="height: 92.4vh"></div>
      </chartpanel>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, computed } from "vue";

import VChart, { THEME_KEY } from "vue-echarts";
import { Vue3SeamlessScroll } from "vue3-seamless-scroll";

import chartpanel from "../components/chartpanel.vue";
import api from "../assets/js/api.js";
import config from "../assets/js/config.js";
import utils from "../assets/js/utils.js";
import chartutils from "../assets/js/chartutils.js";

import * as echarts from "echarts";
import "echarts-extension-amap";
import "echarts-wordcloud";
import "echarts-liquidfill";
import "echarts-gl";

const $echarts = echarts;
const mapId = ref("mapId" + Date.now() + Math.random())

const baseinfodata = reactive({
  value1: utils.random(10000),
  value2: utils.random(10000),
  value3: utils.random(10000),
  value4: utils.random(10000),
});

// 初始化级别
let levelChart = ref();
let levelChartOption = reactive({});
let levelChartCategory = reactive([
  "合作站点",
  "加盟站点",
  "自营站点",
  "临时站点",
  "区域总部",
]);
let levelChartValues = reactive([]);
const initLevelChart = () => {
  levelChartCategory.forEach((item, index) => {
    levelChartValues.push(utils.random(100));
    chartutils.initBarChart(
      levelChartOption,
      levelChartCategory,
      levelChartValues,
      "#409eff"
    );
  });
};

// 初始化数量走势
let numberChart = ref();
let numberChartOption = reactive({});
let numberChartTime = reactive([]);
let numberChartValues = reactive([]);
const initNumberChart = () => {
  let date = new Date();
  date.setDate(date.getDate() - 7);
  for (
    let i = new Date(date.getTime());
    i.getTime() < new Date().getTime();
    i.setDate(i.getDate() + 1)
  ) {
    numberChartTime.push(i.format("MM-dd"));
    numberChartValues.push(utils.random(10000));
  }
  chartutils.initLineChart(
    numberChartOption,
    numberChartTime,
    numberChartValues,
    "#909399"
  );
  numberChartOption.grid.left = "50vh";
};

// 初始化地图
let mapChart = null;
const initMapChart = function (title, ele) {
  let chinaGeoCoordMap = {
    黑龙江: [127.9688, 45.368],
    内蒙古: [110.3467, 41.4899],
    吉林: [125.8154, 44.2584],
    北京市: [116.4551, 40.2539],
    辽宁: [123.1238, 42.1216],
    河北: [114.4995, 38.1006],
    天津: [117.4219, 39.4189],
    山西: [112.3352, 37.9413],
    陕西: [109.1162, 34.2004],
    甘肃: [103.5901, 36.3043],
    宁夏: [106.3586, 38.1775],
    青海: [101.4038, 36.8207],
    新疆: [87.9236, 43.5883],
    西藏: [91.11, 29.97],
    四川: [103.9526, 30.7617],
    重庆: [108.384366, 30.439702],
    山东: [117.1582, 36.8701],
    河南: [113.4668, 34.6234],
    江苏: [118.8062, 31.9208],
    安徽: [117.29, 32.0581],
    湖北: [114.3896, 30.6628],
    浙江: [119.5313, 29.8773],
    福建: [119.4543, 25.9222],
    江西: [116.0046, 28.6633],
    湖南: [113.0823, 28.2568],
    贵州: [106.6992, 26.7682],
    云南: [102.9199, 25.4663],
    广东: [113.12244, 23.009505],
    广西: [108.479, 23.1152],
    海南: [110.3893, 19.8516],
    上海: [121.4648, 31.2891],
  };
  let chinaDatas = [
    [
      {
        name: "黑龙江",
        value: 0,
      },
    ],
    [
      {
        name: "内蒙古",
        value: 0,
      },
    ],
    [
      {
        name: "吉林",
        value: 0,
      },
    ],
    [
      {
        name: "辽宁",
        value: 0,
      },
    ],
    [
      {
        name: "河北",
        value: 0,
      },
    ],
    [
      {
        name: "天津",
        value: 0,
      },
    ],
    [
      {
        name: "山西",
        value: 0,
      },
    ],
    [
      {
        name: "陕西",
        value: 0,
      },
    ],
    [
      {
        name: "甘肃",
        value: 0,
      },
    ],
    [
      {
        name: "宁夏",
        value: 0,
      },
    ],
    [
      {
        name: "青海",
        value: 0,
      },
    ],
    [
      {
        name: "新疆",
        value: 0,
      },
    ],
    [
      {
        name: "西藏",
        value: 0,
      },
    ],
    [
      {
        name: "四川",
        value: 0,
      },
    ],
    [
      {
        name: "重庆",
        value: 0,
      },
    ],
    [
      {
        name: "山东",
        value: 0,
      },
    ],
    [
      {
        name: "河南",
        value: 0,
      },
    ],
    [
      {
        name: "江苏",
        value: 0,
      },
    ],
    [
      {
        name: "安徽",
        value: 0,
      },
    ],
    [
      {
        name: "湖北",
        value: 0,
      },
    ],
    [
      {
        name: "浙江",
        value: 0,
      },
    ],
    [
      {
        name: "福建",
        value: 0,
      },
    ],
    [
      {
        name: "江西",
        value: 0,
      },
    ],
    [
      {
        name: "湖南",
        value: 0,
      },
    ],
    [
      {
        name: "贵州",
        value: 0,
      },
    ],
    [
      {
        name: "广西",
        value: 0,
      },
    ],
    [
      {
        name: "海南",
        value: 0,
      },
    ],
    [
      {
        name: "北京市",
        value: 1,
      },
    ],
  ];

  let points = [];
  for (let i = 0; i < chinaDatas.length; i++) {
    let dataItem = chinaDatas[i];
    let fromCoord = chinaGeoCoordMap[dataItem[0].name];
    points.push([fromCoord[0], fromCoord[1], 11]);
    for (let j = 0; j < 20; j++) {
      if (j % 2 == 0) {
        points.push([
          fromCoord[0] - Math.random() * 10,
          fromCoord[1] - Math.random() * 10,
          11,
        ]);
      } else {
        points.push([
          fromCoord[0] + Math.random() * 10,
          fromCoord[1] + Math.random() * 10,
          11,
        ]);
      }
    }
  }

  let option = {
    title: chartutils.createChartTitle(title),
    amap: {
      rotateEnable: true,
      pitchEnable: true,
      pitch: 0,
      // rotation: -45,
      // 3D模式，无论你使用的是1.x版本还是2.x版本，都建议开启此项以获得更好的渲染体验
      // viewMode: '3D',
      // 高德地图支持的初始化地图配置
      // 高德地图初始中心经纬度
      center: [105.436561, 33.998546],
      // 高德地图初始缩放级别
      zoom: 4,
      // 是否开启resize
      resizeEnable: true,
      // 自定义地图样式主题
      mapStyle: "amap://styles/darkblue",
      // 移动过程中实时渲染 默认为true 如数据量较大 建议置为false
      renderOnMoving: true,
      // ECharts 图层的 zIndex 默认 2000
      // 从 v1.9.0 起 此配置项已被弃用 请使用 `echartsLayerInteractive` 代替
      // echartsLayerZIndex: 2019,
      // 设置 ECharts 图层是否可交互 默认为 true
      // 设置为 false 可实现高德地图自身图层交互
      // 此配置项从 v1.9.0 起开始支持
      echartsLayerInteractive: true,
      // 是否启用大数据模式 默认为 false
      // 此配置项从 v1.9.0 起开始支持
      largeMode: false,
      // 说明：如果想要添加卫星、路网等图层
      // 暂时先不要使用layers配置，因为存在Bug
      // 建议使用amap.add的方式，使用方式参见最下方代码
    },
    series: [
      {
        type: "effectScatter",
        zlevel: 5,
        // 使用百度地图坐标系
        coordinateSystem: "amap",
        //设置图形 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
        // symbol: 'image://http://localhost:3000/src/assets/video.png',
        symbol: "circle",
        // //标记的大小，可以设置成诸如 10 这样单一的数字，也可以用数组分开表示宽和高，例如 [20, 10] 表示标记宽为20，高为10
        symbolSize: [5, 5],
        itemStyle: {
          color: "#FF5252", //标志颜色
        },
        // 数据格式跟在 geo 坐标系上一样，每一项都是 [经度，纬度，数值大小，其它维度...]
        data: [[116.436561, 39.897346, 11]],
        rippleEffect: {
          scale: 6,
          brushType: "stroke",
        },
        // hoverAnimation: true, //是否开启鼠标 hover 的提示动画效果。
      },
      {
        type: "effectScatter",
        zlevel: 3,
        // 使用百度地图坐标系
        coordinateSystem: "amap",
        //设置图形 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
        // symbol: 'image://http://localhost:3000/src/assets/video.png',
        symbol: "circle",
        // //标记的大小，可以设置成诸如 10 这样单一的数字，也可以用数组分开表示宽和高，例如 [20, 10] 表示标记宽为20，高为10
        symbolSize: [5, 5],
        itemStyle: {
          // color: '#fac858', //标志颜色
          color: function (pama) {
            return config.colors[pama.dataIndex % config.colors.length];
          },
        },
        // 数据格式跟在 geo 坐标系上一样，每一项都是 [经度，纬度，数值大小，其它维度...]
        data: points,
        rippleEffect: {
          scale: 6,
          brushType: "stroke",
        },
        // hoverAnimation: true, //是否开启鼠标 hover 的提示动画效果。
      },
    ],
  };
  // 使用刚指定的配置项和数据显示图表。
  let mapchart = $echarts.init(document.getElementById(ele));
  mapchart.setOption(option);

  // 获取 ECharts 高德地图组件
  var amapComponent = mapchart.getModel().getComponent("amap");
  // 获取高德地图实例，使用高德地图自带的控件(需要在高德地图js API script标签手动引入)
  var amap = amapComponent.getAMap();
  // 添加控件
  amap.addControl(new AMap.Scale());
  amap.addControl(new AMap.ToolBar());
  amap.addControl(new AMap.ControlBar());
  // 禁用 ECharts 图层交互，从而使高德地图图层可以点击交互
  amapComponent.setEChartsLayerInteractive(false);

  return mapchart;
};
const initCharts = () => {
  initLevelChart();
  initNumberChart();
  mapChart = initMapChart("实时物流信息", mapId.value);
};

// 更新级别
const updateLevelChart = () => {
  levelChartValues.forEach((item, index) => {
    levelChartValues[index] = utils.random(100);
  });
};

// 更新数量走势
const updateNumberChart = () => {
  numberChartValues.forEach((item, index) => {
    numberChartValues[index] = utils.random(10000);
  });
};

// 数据刷新
let timer = null;
const startRefreshChart = () => {
  timer && clearInterval(timer);
  //获取刷新周期，TODO 配置变动时，此处需自动更新
  let refreshtime = 60 * 1000;
  config.getConfig().forEach(function (item, index) {
    if (item.key == "refreshtime") {
      refreshtime = item.value;
    }
  });

  timer = setInterval(function () {
    baseinfodata.value1 = utils.random(10000);
    baseinfodata.value2 = utils.random(10000);
    baseinfodata.value3 = utils.random(10000);
    baseinfodata.value4 = utils.random(10000);
    updateLevelChart();
    updateNumberChart();
  }, refreshtime);
};

onMounted(() => {
  initCharts();
  startRefreshChart();
  window.onresize = () => {
    mapChart && mapChart.resize();
    levelChart && levelChart.value.resize();
    numberChart && numberChart.value.resize();
  };
});

onBeforeUnmount(() => {
  timer && clearInterval(timer);
});
</script>

<style lang="scss" scoped>
.baseinfoitem {
  width: 80%;
  margin: 0 auto;
}
.baseinfoitem .icon {
  font-size: 3.4rem;
  width: 30%;
  text-align: right;
  margin-top: 1.5vh;
}
.baseinfoitem .desc {
  text-align: center;
}
.baseinfoitem .desc .value {
  font-size: 2rem;
  height: 3vh;
  line-height: 3vh;
}
.baseinfoitem .desc .name {
  font-size: 1.6rem;
  height: 3vh;
  line-height: 3vh;
  letter-spacing: 0.1875rem;
}
.baseinfoitem .desc .unit {
  font-size: 1.6rem;
  margin-left: 0.5vh;
}
</style>
