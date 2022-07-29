<template>
  <el-row :gutter="10" style="margin: 0; padding: 0; margin-top: 1vh">
    <el-col :span="8">
      <chartpanel title="员工数量分布" style="height: 30vh">
        <v-chart
          ref="numberChart"
          style="min-height: 25vh"
          :option="numberChartOption"
        ></v-chart>
      </chartpanel>
    </el-col>
    <el-col :span="8">
      <chartpanel title="职位分布" style="height: 30vh">
        <v-chart
          ref="postChart"
          style="min-height: 25vh"
          :option="postChartOption"
        ></v-chart>
      </chartpanel>
    </el-col>
    <el-col :span="8">
      <chartpanel title="状态分布" style="height: 30vh">
        <v-chart
          ref="statusChart"
          style="min-height: 25vh"
          :option="statusChartOption"
        ></v-chart>
      </chartpanel>
    </el-col>
  </el-row>
  <el-row :gutter="10" style="margin: 0; padding: 0; margin-top: 1vh">
    <el-col :span="8">
      <chartpanel title="数量走势" style="height: 30vh">
        <v-chart
          ref="quantityChart"
          style="min-height: 25vh"
          :option="quantityChartOption"
        ></v-chart>
      </chartpanel>
    </el-col>
    <el-col :span="8">
      <chartpanel title="工资分布" style="height: 30vh">
        <v-chart
          ref="payChart"
          style="min-height: 25vh"
          :option="payChartOption"
        ></v-chart>
      </chartpanel>
    </el-col>
    <el-col :span="8">
      <chartpanel title="离职原因分布" style="height: 30vh">
        <div :id="warn" style="height: 25vh"></div>
      </chartpanel>
    </el-col>
  </el-row>
  <el-row :gutter="10" style="margin: 0; padding: 0; margin-top: 1vh">
    <el-col :span="8">
      <chartpanel title="学历分布" style="height: 30vh">
        <v-chart
          ref="eduChart"
          style="min-height: 25vh"
          :option="eduChartOption"
        ></v-chart>
      </chartpanel>
    </el-col>
    <el-col :span="8">
      <chartpanel title="年龄分布" style="height: 30vh">
        <v-chart
          ref="ageChart"
          style="min-height: 25vh"
          :option="ageChartOption"
        ></v-chart>
      </chartpanel>
    </el-col>
    <el-col :span="8">
      <chartpanel title="性别分布" style="height: 30vh">
        <v-chart
          ref="sexChart"
          style="min-height: 25vh"
          :option="sexChartOption"
        ></v-chart>
      </chartpanel>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";

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
const warn = ref("warn" + Date.now() + Math.random())

// 初始化数量统计
let numberChart = ref();
let numberChartOption = reactive({});
let numberChartCategory = reactive([
  "河北省",
  "山西省",
  "辽宁省",
  "吉林省",
  "黑龙江省",
  "江苏省",
  "浙江省",
  "安徽省",
  "福建省",
  "江西省",
  "山东省",
  "河南省",
  "湖北省",
  "湖南省",
  "广东省",
  "海南省",
  "四川省",
  "贵州省",
  "云南省",
  "陕西省",
  "甘肃省",
  "青海省",
  "台湾省",
  "内蒙古自治区",
  "广西壮族自治区",
  "西藏自治区",
  "宁夏回族自治区",
  "新疆维吾尔自治区",
  "北京市",
  "天津市",
  "上海市",
  "重庆市",
  "香港特别行政区",
  "澳门特别行政区",
]);
let numberChartValues = reactive([]);
const initNumberChart = () => {
  numberChartCategory.forEach((item, index) => {
    numberChartValues.push(utils.random(100000));
    chartutils.initPictorialBar(
      numberChartOption,
      numberChartCategory,
      numberChartValues,
      "#FF5722"
    );
    numberChartOption.grid.left = "50vh";
    numberChartOption.grid.bottom = "95vh";
    numberChartOption.series[0].symbolSize = [10, 8];
    numberChartOption.series[0].label.show = false;
    numberChartOption.xAxis.axisLabel.interval = 0;
    numberChartOption.xAxis.axisLabel.rotate = 65;
  });
};

// 初始化职位分布
let postChart = ref();
let postChartOption = reactive({});
let postChartCategory = reactive([
  "配送员",
  "库管员",
  "资料员",
  "人事",
  "行政管理",
  "货运司机",
  "客服",
  "区域经理",
]);
let postChartValues = reactive([]);
const initPostChart = () => {
  postChartCategory.forEach(() => {
    postChartValues.push(utils.random(100000));
    chartutils.initBarChart(
      postChartOption,
      postChartCategory,
      postChartValues,
      "#95d475"
    );
    postChartOption.grid.left = "50vh";
    postChartOption.grid.bottom = "70vh";
    postChartOption.series[0].symbolSize = [10, 8];
    postChartOption.series[0].label.show = false;
    postChartOption.xAxis.axisLabel.interval = 0;
    postChartOption.xAxis.axisLabel.rotate = 65;
  });
};

// 初始化状态
let statusChart = ref();
let statusChartOption = reactive({});
let statusChartCategory = reactive([
  "在职",
  "实习",
  "试用",
  "离职中",
  "已离职",
]);
let statusChartValues = reactive([]);
const initStatusChart = () => {
  statusChartCategory.forEach((item, index) => {
    statusChartValues.push(utils.random(100));
    chartutils.initPieFullChart(
      statusChartOption,
      statusChartCategory,
      statusChartValues
    );
  });
};

// 初始化数量走势
let quantityChart = ref();
let quantityChartOption = reactive({});
let quantityChartTime = reactive([]);
let quantityChartValues = reactive([]);
const initQuantityChart = () => {
  let date = new Date();
  date.setDate(date.getDate() - 7);
  for (
    let i = new Date(date.getTime());
    i.getTime() < new Date().getTime();
    i.setDate(i.getDate() + 1)
  ) {
    quantityChartTime.push(i.format("MM-dd"));
    quantityChartValues.push(utils.random(10000));
  }
  chartutils.initLineChart(
    quantityChartOption,
    quantityChartTime,
    quantityChartValues,
    "#4ed33c"
  );
  quantityChartOption.grid.left = "50vh";
};

// 初始化工资分布
let payChart = ref();
let payChartOption = reactive({});
let payChartCategory = reactive([
  "<5000",
  "5000-8000",
  "8000-10000",
  "10000-15000",
  "15000-20000",
  "20000-25000",
  "25000-30000",
  ">30000",
]);
let payChartValues = reactive([]);
const initPayChart = () => {
  payChartCategory.forEach(() => {
    payChartValues.push(utils.random(100000));
    chartutils.initBarChart(
      payChartOption,
      payChartCategory,
      payChartValues,
      "#f89898"
    );
    payChartOption.grid.left = "50vh";
    payChartOption.grid.bottom = "80vh";
    payChartOption.series[0].symbolSize = [10, 8];
    payChartOption.series[0].label.show = false;
    payChartOption.xAxis.axisLabel.interval = 0;
    payChartOption.xAxis.axisLabel.rotate = 65;
  });
};

// 初始化离职原因
let warnChart = null;
let warnChartCategory = reactive([
  "太辛苦",
  "家庭原因",
  "干不了",
  "受委屈",
  "工资低",
  "离家远",
  "食堂难吃",
  "加班",
  "老板脑残",
  "同事傻逼",
  "其他",
]);
const initWarnChart = () => {
  let datas = [];
  for (let i = 0; i < 50; i++) {
    let color =
      "rgb(" +
      Math.round(Math.random() * 255) +
      "," +
      Math.round(Math.random() * 255) +
      "," +
      Math.round(Math.random() * 255) +
      ")";
    datas.push({
      name: warnChartCategory[i % warnChartCategory.length],
      value: (Math.random(100) * 1000).toFixed(0),
      textStyle: {
        color: color,
      },
    });
  }

  let option = {
    tooltip: {
      show: true,
      position: "top",
      textStyle: {
        fontSize: 14,
      },
    },
    series: [
      {
        type: "wordCloud",
        // 网格大小，各项之间间距
        gridSize: 20,
        // 形状 circle 圆，cardioid  心， diamond 菱形，
        // triangle-forward 、triangle 三角，star五角星
        shape: "circle",
        // 字体大小范围
        sizeRange: [12, 30],
        // 文字旋转角度范围
        rotationRange: [0, 90],
        // 旋转步值
        rotationStep: 90,
        // 自定义图形
        // maskImage: maskImage,
        left: "center",
        top: "0",
        // 画布宽
        width: "95%",
        // 画布高
        height: "95%",
        // 是否渲染超出画布的文字
        drawOutOfBound: false,
        data: datas,
      },
    ],
  };
  // 使用刚指定的配置项和数据显示图表。
  warnChart = $echarts.init(document.getElementById(warn.value));
  warnChart.setOption(option);
};

// 初始化学历
let eduChart = ref();
let eduChartOption = reactive({});
let eduChartCategory = reactive([
  "文盲",
  "小学",
  "初中",
  "高中",
  "大专",
  "本科",
  "研究生",
  "博士",
]);
let eduChartValues = reactive([]);
const initEduChart = () => {
  eduChartCategory.forEach((item, index) => {
    eduChartValues.push(utils.random(100000));
    chartutils.initPictorialBar(
      eduChartOption,
      eduChartCategory,
      eduChartValues,
      "#b1b3b8"
    );
    numberChartOption.grid.left = "50vh";
  });
};

// 初始化年龄
let ageChart = ref();
let ageChartOption = reactive({});
let ageChartCategory = reactive([
  "20-25",
  "25-30",
  "30-35",
  "35-40",
  "40-45",
  "45-50",
  ">50",
]);
let ageChartValues = reactive([]);
const initAgeChart = () => {
  ageChartCategory.forEach((item, index) => {
    ageChartValues.push(utils.random(100));
    chartutils.initRadarChart(
      ageChartOption,
      ageChartCategory,
      ageChartValues,
      "#FF8a26"
    );
  });
};
// 初始化性别
let sexChart = ref();
let sexChartOption = reactive({});
let sexChartCategory = reactive(["男", "女"]);
let sexChartValues = reactive([]);
const initSexChart = () => {
  sexChartCategory.forEach((item, index) => {
    sexChartValues.push(utils.random(100));
  });
  chartutils.initPieChart(sexChartOption, sexChartCategory, sexChartValues);
};

const initCharts = () => {
  initNumberChart();
  initPostChart();
  initStatusChart();
  initQuantityChart();
  initPayChart();
  initWarnChart();
  initEduChart();
  initAgeChart();
  initSexChart();
};

// 更新数量统计
const updateNumberChart = () => {
  numberChartValues.forEach((item, index) => {
    numberChartValues[index] = utils.random(100000);
  });
};

// 更新职位分布
const updatePostChart = () => {
  postChartValues.forEach((item, index) => {
    postChartValues[index] = utils.random(100000);
  });
};

// 更新状态
const updateStatusChart = () => {
  statusChartOption.series[0].data.forEach((item, index) => {
    item.value = utils.random(100);
  });
};

// 更新数量走势
const updateQuantityChart = () => {
  quantityChartValues.forEach((item, index) => {
    quantityChartValues[index] = utils.random(10000);
  });
};

// 更新工资分布
const updatePayChart = () => {
  payChartValues.forEach((item, index) => {
    payChartValues[index] = utils.random(100000);
  });
};

// 更新离职原因
const updateWarnChart = () => {
  let warnChartOption = warnChart.getOption();
  warnChartOption.series[0].data.forEach((item, index) => {
    let color =
      "rgb(" +
      Math.round(Math.random() * 255) +
      "," +
      Math.round(Math.random() * 255) +
      "," +
      Math.round(Math.random() * 255) +
      ")";
    item.value = (Math.random(100) * 1000).toFixed(0);
    item.textStyle.color = color;
  });
  warnChart.setOption(warnChartOption);
};

// 更新学历
const updateEduChart = () => {
  eduChartValues.forEach((item, index) => {
    eduChartValues[index] = utils.random(100000);
  });
};

// 更新年龄
const updateAgeChart = () => {
  ageChartValues.forEach((item, index) => {
    ageChartValues[index] = utils.random(100);
  });
};

// 更新性别
const updateSexChart = () => {
  sexChartOption.series[0].data.forEach((item, index) => {
    item.value = utils.random(100);
  });
};

// 数据刷新
let timer = null;
const startRefreshChart = () => {
  timer && clearInterval(timer);
  //获取刷新周期，TODO 配置变动时，此处需自动更新
  let refreshtime =  10000;
  config.getConfig().forEach(function (item, index) {
    if (item.key == "refreshtime") {
      refreshtime = item.value;
    }
  });

  timer = setInterval(function () {
    updateNumberChart();
    updatePostChart();
    updateStatusChart();
    updateQuantityChart();
    updatePayChart();
    updateWarnChart();
    updateEduChart();
    updateAgeChart();
    updateSexChart();
  }, refreshtime);
};

onMounted(() => {
  initCharts();
  startRefreshChart();
  window.onresize = () => {
    numberChart && numberChart.value.resize();
    postChart && postChart.value.resize();
    statusChart && statusChart.value.resize();
    quantityChart && quantityChart.value.resize();
    payChart && payChart.value.resize();
    warnChart && warnChart.resize();
    eduChart && eduChart.value.resize();
    ageChart && ageChart.value.resize();
    sexChart && sexChart.value.resize();
  };
});

onBeforeUnmount(() => {
  timer && clearInterval(timer);
});
</script>

<style lang="scss" scoped></style>
