<template>
  <el-row :gutter="10" style="margin: 0; padding: 0; margin-top: 1vh">
    <el-col :span="8">
      <chartpanel title="数量统计" style="height: 30vh">
        <div class="today-item">
          <span>运单数:</span>
          <span
            v-for="(item, index) in today.in"
            :key="index"
            class="number-item text_color_11"
          >
            {{ item }}
          </span>
        </div>

        <div class="today-item">
          <span>员工数:</span>
          <span
            v-for="(item, index) in today.end"
            :key="index"
            class="number-item text_color_12"
          >
            {{ item }}
          </span>
        </div>
      </chartpanel>
    </el-col>
    <el-col :span="8">
      <chartpanel title="类型分布" style="height: 30vh">
        <v-chart
          ref="typeChart"
          style="min-height: 25vh"
          :option="typeChartOption"
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
          ref="trendChart"
          style="min-height: 25vh"
          :option="trendChartOption"
        ></v-chart>
      </chartpanel>
    </el-col>
    <el-col :span="8">
      <chartpanel title="次数分布" style="height: 30vh">
        <v-chart
          ref="numberChart"
          style="min-height: 25vh"
          :option="numberChartOption"
        ></v-chart>
      </chartpanel>
    </el-col>
    <el-col :span="8">
      <chartpanel title="人员类型" style="height: 30vh">
        <v-chart
          ref="peopleChart"
          style="min-height: 25vh"
          :option="peopleChartOption"
        ></v-chart>
      </chartpanel>
    </el-col>
  </el-row>
  <el-row :gutter="10" style="margin: 0; padding: 0; margin-top: 1vh">
    <el-col :span="8">
      <chartpanel title="数量排行" style="height: 30vh">
        <v-chart
          ref="quantityChart"
          style="min-height: 25vh"
          :option="quantityChartOption"
        ></v-chart>
      </chartpanel>
    </el-col>
    <el-col :span="8">
      <chartpanel title="配送时间" style="height: 30vh">
        <v-chart
          ref="timeChart"
          style="min-height: 25vh"
          :option="timeChartOption"
        ></v-chart>
      </chartpanel>
    </el-col>
    <el-col :span="8">
      <chartpanel title="区域分布" style="height: 30vh">
        <div id="warnChart1" style="height: 25vh"></div>
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

// 初始化数据统计
const today = reactive({
  in: "000000",
  end: "000000",
  run: "000000",
});
const initTodayData = () => {
  let inCount = utils.random(1000000) + "";
  while (inCount.length < 6) {
    inCount = "0" + inCount;
  }
  today.in = inCount;

  let endCount = utils.random(1000000) + "";
  while (endCount.length < 6) {
    endCount = "0" + endCount;
  }
  today.end = endCount;

  let runCount = utils.random(1000000) + "";
  while (runCount.length < 6) {
    runCount = "0" + runCount;
  }
  today.run = runCount;
};

// 初始化次数
let numberChart = ref();
let numberChartOption = reactive({});
let numberChartCategory = reactive(["第一次配送", "第二次配送", "第三次配送"]);
let numberChartValues = reactive([]);
const initNumberChart = () => {
  numberChartCategory.forEach((item, index) => {
    numberChartValues.push(utils.random(100));
    chartutils.initBarChart(
      numberChartOption,
      numberChartCategory,
      numberChartValues,
      "#409eff"
    );
  });
};

// 初始化状态
let statusChart = ref();
let statusChartOption = reactive({});
let statusChartCategory = reactive([
  "待配送",
  "配送中",
  "拒绝",
  "无法联系",
  "已签收",
]);
let statusChartValues = reactive([]);
const initStatusChart = () => {
  statusChartCategory.forEach((item, index) => {
    statusChartValues.push(utils.random(100));
    chartutils.initBarChart(
      statusChartOption,
      statusChartCategory,
      statusChartValues,
      "#b3e19d"
    );
  });
};

// 初始化数量
let quantityChart = ref();
let quantityChartOption = reactive({});
let quantityChartCategory = reactive([
  "张三",
  "李四",
  "小明",
  "小项",
  "小章",
  "小力",
  "大力",
  "大地",
]);
let quantityChartValues = reactive([]);
const initQuantityChart = () => {
  quantityChartCategory.forEach((item, index) => {
    quantityChartValues.push(utils.random(100));
    quantityChartValues.sort((a, b) => {
      return b - a;
    });
    chartutils.initBarChart(
      quantityChartOption,
      quantityChartCategory,
      quantityChartValues,
      "#e6a23c"
    );
  });
};

// 初始化类型
let typeChart = ref();
let typeChartOption = reactive({});
let typeChartCategory = reactive([
  "用户自提",
  "送货上门",
  "货运物流",
  "货到付款",
]);
let typeChartValues = reactive([]);
const initTypeChart = () => {
  typeChartCategory.forEach((item, index) => {
    typeChartValues.push(utils.random(100));
    chartutils.initPieFullChart(
      typeChartOption,
      typeChartCategory,
      typeChartValues
    );
  });
};

// 初始化人员
let peopleChart = ref();
let peopleChartOption = reactive({});
let peopleChartCategory = reactive([
  "配送员",
  "档案员",
  "司机",
  "人事",
  "主管",
]);
let peopleChartValues = reactive([]);
const initPeopleChart = () => {
  peopleChartCategory.forEach((item, index) => {
    peopleChartValues.push(utils.random(100));
    chartutils.initPieFullChart(
      peopleChartOption,
      peopleChartCategory,
      peopleChartValues
    );
  });
};

// 初始化订单走势
let trendChart = ref();
let trendChartOption = reactive({});
let trendChartTime = reactive([]);
let trendChartValues = reactive([]);
const initTrendChart = () => {
  let date = new Date();
  date.setDate(date.getDate() - 7);
  for (
    let i = new Date(date.getTime());
    i.getTime() < new Date().getTime();
    i.setDate(i.getDate() + 1)
  ) {
    trendChartTime.push(i.format("MM-dd"));
    trendChartValues.push(utils.random(1000));
  }
  chartutils.initLineChart(
    trendChartOption,
    trendChartTime,
    trendChartValues,
    "#f56c6c"
  );
};

// 初始化配送时间
let timeChart = ref();
let timeChartOption = reactive({});
let timeChartTime = reactive([]);
let timeChartValues = reactive([]);
const initTimeChart = () => {
  for (let i = 0; i < 12; i++) {
    timeChartTime.push(i + 7 + ":00");
    timeChartValues.push(utils.random(100));
  }
  chartutils.initLineChart(
    timeChartOption,
    timeChartTime,
    timeChartValues,
    "#79bbff"
  );
};

// 初始化投诉统计
let warnChart = null;
let warnChartCategory = reactive([
  "上海",
  "北京",
  "新疆",
  "杭州",
  "内蒙古",
  "哈尔滨",
  "黑龙江",
  "杭州",
  "西藏",
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
  warnChart = $echarts.init(document.getElementById("warnChart1"));
  warnChart.setOption(option);
};

const initCharts = () => {
  initTodayData();
  initNumberChart();
  initStatusChart();
  initQuantityChart();
  initTypeChart();
  initPeopleChart();
  initTrendChart();
  initTimeChart();
  initWarnChart();
};

// 更新次数
const updateNumberChart = () => {
  numberChartValues.forEach((item, index) => {
    numberChartValues[index] = utils.random(100);
  });
};

// 更新状态
const updateStatusChart = () => {
  statusChartValues.forEach((item, index) => {
    statusChartValues[index] = utils.random(100);
  });
};

// 更新数量
const updateQuantityChart = () => {
  quantityChartValues.forEach((item, index) => {
    quantityChartValues[index] = utils.random(100);
  });
  quantityChartValues.sort((a, b) => {
    return b - a;
  });
};

// 更新类型
const updateTypeChart = () => {
  typeChartOption.series[0].data.forEach((item, index) => {
    item.value = utils.random(100);
  });
};

// 更新人员
const updatePeopleChart = () => {
  peopleChartOption.series[0].data.forEach((item, index) => {
    item.value = utils.random(100);
  });
};

// 更新订单走势
const updateTrendChart = () => {
  trendChartValues.forEach((item, index) => {
    trendChartValues[index] = utils.random(1000);
  });
};

// 更新配送时间
const updateTimeChart = () => {
  timeChartValues.forEach((item, index) => {
    timeChartValues[index] = utils.random(1000);
  });
};

// 更新投诉统计
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
    initTodayData();
    updateNumberChart();
    updateStatusChart();
    updateQuantityChart();
    updateTypeChart();
    updatePeopleChart();
    updateTrendChart();
    updateTimeChart();
    updateWarnChart();
  }, refreshtime);
};

onMounted(() => {
  initCharts();
  startRefreshChart();
  window.onresize = () => {
    numberChart && numberChart.value.resize();
    statusChart && statusChart.value.resize();
    quantityChart && quantityChart.value.resize();
    typeChart && typeChart.value.resize();
    peopleChart && peopleChart.value.resize();
    trendChart && trendChart.value.resize();
    timeChart && timeChart.value.resize();
    warnChart && warnChart.resize();
  };
});

onBeforeUnmount(() => {
  timer && clearInterval(timer);
});
</script>

<style lang="scss" scoped>
.today-item {
  display: flex;
  align-items: center;
  height: 10vh;
  margin-left: 2vh;
  margin-top: 1vh;
  .number-item {
    background: #ffffff22;
    font-size: 4rem;
    width: 8vh;
    height: 8vh;
    line-height: 8vh;
    text-align: center;
    margin-left: 1vh;
    border-radius: 0.4vh;
  }
}
</style>
