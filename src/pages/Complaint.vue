<template>
  <el-row :gutter="10" style="margin: 0; padding: 0; margin-top: 1vh">
    <el-col :span="8">
      <chartpanel title="投诉率" style="height: 30vh">
        <v-chart
          ref="warnNumChart"
          style="min-height: 25vh"
          :option="warnNumChartOption"
        ></v-chart>
      </chartpanel>
    </el-col>
    <el-col :span="8">
      <chartpanel title="问题分布" style="height: 30vh">
        <div id="warnChart2" style="height: 25vh"></div>
      </chartpanel>
    </el-col>
    <el-col :span="8">
      <chartpanel title="实时投诉" style="height: 30vh">
        <div class="order_header tr flex">
          <div class="th flex_item">问题</div>
          <div class="th date">时间</div>
          <div class="th status">状态</div>
        </div>
        <vue3-seamless-scroll :list="orders" class="orderscroll">
          <div class="item flex" v-for="(item, index) in orders" :key="index">
            <div class="th flex_item">{{ item.from }}</div>
            <div class="th flex_item">{{ item.to }}</div>
            <div class="th date">{{ item.date }}</div>
            <div class="th status" :class="orderStatusClass(item)">
              {{ item.status }}
            </div>
          </div>
        </vue3-seamless-scroll>
      </chartpanel>
    </el-col>
  </el-row>
  <el-row :gutter="10" style="margin: 0; padding: 0; margin-top: 1vh">
    <el-col :span="8">
      <chartpanel title="状态分布" style="height: 30vh">
        <v-chart
          ref="statusChart"
          style="min-height: 25vh"
          :option="statusChartOption"
        ></v-chart>
      </chartpanel>
    </el-col>
    <el-col :span="8">
      <chartpanel title="投诉排行" style="height: 30vh">
        <v-chart
          ref="sortChart"
          style="min-height: 25vh"
          :option="sortChartOption"
        ></v-chart>
      </chartpanel>
    </el-col>
    <el-col :span="8">
      <chartpanel title="处理时间分布" style="height: 30vh">
        <v-chart
          ref="timeChart"
          style="min-height: 25vh"
          :option="timeChartOption"
        ></v-chart>
      </chartpanel>
    </el-col>
  </el-row>
  <el-row :gutter="10" style="margin: 0; padding: 0; margin-top: 1vh">
    <el-col :span="8">
      <chartpanel title="评价统计" style="height: 30vh">
        <v-chart
          ref="evaluateChart"
          style="min-height: 25vh"
          :option="evaluateChartOption"
        ></v-chart>
      </chartpanel>
    </el-col>
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
      <chartpanel title="来源分布" style="height: 30vh">
        <v-chart
          ref="originChart"
          style="min-height: 25vh"
          :option="originChartOption"
        ></v-chart>
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

// 实时投诉样式
const orderStatusClass = computed(() => (item) => {
  return [
    item.status == "待处理" ? "text_color_10" : "",
    item.status == "已处理" ? "text_color_11" : "",
    item.status == "处理中" ? "text_color_12" : "",
    item.status == "待评价" ? "text_color_13" : "",
    item.status == "已评价" ? "text_color_14" : "",
  ];
});

// 初始化处理时间
let timeChart = ref();
let timeChartOption = reactive({});
let timeChartCategory = reactive([
  "1天内",
  "2天内",
  "3天内",
  "4天内",
  "5天内",
  "6天内",
  "7天内",
  "其他",
]);
let timeChartValues = reactive([]);
const initTimeChart = () => {
  timeChartCategory.forEach((item, index) => {
    timeChartValues.push(utils.random(100));
    chartutils.initBarChart(
      timeChartOption,
      timeChartCategory,
      timeChartValues,
      "#f56c6c"
    );
  });
};

// 初始化投诉排行
let sortChart = ref();
let sortChartOption = reactive({});
let sortChartCategory = reactive([
  "丢件",
  "态度不好",
  "损坏",
  "时间慢",
  "少件",
  "客服问题",
  "保险问题",
  "破损",
]);
let sortChartValues = reactive([]);
const initSortChart = () => {
  sortChartCategory.forEach((item, index) => {
    sortChartValues.push(utils.random(100));
    sortChartValues.sort((a, b) => {
      return b - a;
    });
    chartutils.initBarChart(
      sortChartOption,
      sortChartCategory,
      sortChartValues,
      "#c6e2ff"
    );
  });
};

// 初始化投诉来源
let originChart = ref();
let originChartOption = reactive({});
let originChartCategory = reactive([
  "电话投诉",
  "淘宝投诉",
  "拼多多投诉",
  "京东投诉",
  "其他投诉",
]);
let originChartValues = reactive([]);
const initOriginChart = () => {
  originChartCategory.forEach((item, index) => {
    originChartValues.push(utils.random(100));
    chartutils.initPictorialBar(
      originChartOption,
      originChartCategory,
      originChartValues,
      "#409eff"
    );
  });
};

// 初始化状态
let statusChart = ref();
let statusChartOption = reactive({});
let statusChartCategory = reactive([
  "待处理",
  "处理中",
  "已处理",
  "待评价",
  "已评价",
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

// 初始化评价
let evaluateChart = ref();
let evaluateChartOption = reactive({});
let evaluateChartCategory = reactive(["1星", "2星", "3星", "4星", "5星"]);
let evaluateChartValues = reactive([]);
const initEvaluateChart = () => {
  evaluateChartCategory.forEach((item, index) => {
    evaluateChartValues.push(utils.random(100));
    chartutils.initRadarChart(
      evaluateChartOption,
      evaluateChartCategory,
      evaluateChartValues
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
    quantityChartValues.push(utils.random(100));
  }
  chartutils.initLineChart(
    quantityChartOption,
    quantityChartTime,
    quantityChartValues,
    "#4ed33c"
  );
};

// 初始化投诉统计
let warnChart = null;
let warnChartCategory = reactive([
  "丢件",
  "态度不好",
  "损坏",
  "时间慢",
  "少件",
  "客服问题",
  "保险问题",
  "破损",
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
  warnChart = $echarts.init(document.getElementById("warnChart2"));
  warnChart.setOption(option);
};

// 初始化投诉数量
let warnNumChart = ref();
let warnNumChartOption = reactive({});
let warnNumChartCategory = reactive(["投诉数量"]);
let warnNumChartValues = reactive([]);
const initWarnNumChart = () => {
    warnNumChartCategory.forEach((item) => {
    let value = utils.random(100);
    warnNumChartValues.push([
      {
        name: item,
        value: value,
      },
      {
        value: 100 - value,
      },
    ]);
  });

  let series = [];
  let titles = [];
  warnNumChartValues.forEach((item, index) => {
    let col = 100 / warnNumChartValues.length;
    series.push({
      type: "pie",
      center: [ "50%", "45%"],
      radius: ["70%", "55%"],
      itemStyle: {
        borderRadius: 15,
        color: function (pama) {
          if (pama.dataIndex == 0) {
            return config.colors[index];
          } else {
            return "#0baefd33";
          }
        },
      },
      label: {
        show: false,
      },
      data: item,
    });
    titles.push(
      {
        top: "37%",
        subtext: item[0].value + "%",
        left: "46%",
        subtextStyle: {
          color: "#fff",
          fontSize: "1.4rem",
        },
      }
    );
  });

  let option = {
    color: config.colors,
    title: titles,
    series: series,
  };
  for (let key in option) {
    warnNumChartOption[key] = option[key];
  }
};

const initCharts = () => {
  initTimeChart();
  initStatusChart();
  initEvaluateChart();
  initSortChart();
  initOriginChart();
  initQuantityChart();
  initWarnChart();
  initWarnNumChart()
};

// 更新处理时间
const updateTimeChart = () => {
  timeChartValues.forEach((item, index) => {
    timeChartValues[index] = utils.random(100);
  });
};
// 更新投诉排序
const updateSortChart = () => {
  sortChartValues.forEach((item, index) => {
    sortChartValues[index] = utils.random(100);
  });
  sortChartValues.sort((a, b) => {
    return b - a;
  });
};

// 更新来源
const updateOriginChart = () => {
  originChartValues.forEach((item, index) => {
    originChartValues[index] = utils.random(100);
  });
};

// 更新状态
const updateStatusChart = () => {
  statusChartOption.series[0].data.forEach((item, index) => {
    item.value = utils.random(100);
  });
};

// 更新评价
const updateEvaluateChart = () => {
  evaluateChartValues.forEach((item, index) => {
    evaluateChartValues[index] = utils.random(100);
  });
};

// 更新数量走势
const updateQuantityChart = () => {
  quantityChartValues.forEach((item, index) => {
    quantityChartValues[index] = utils.random(100);
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

// 更新投诉数量
const updateWarnNumChart = () => {
    warnNumChartValues.forEach((item, index) => {
    let value = utils.random(100);
    item[0].value = value;
    item[1].value = 100 - value;
    warnNumChartOption.title[0].subtext = value + "%";
  });
};

// 实时订单数据
let orders = reactive([
  {
    from: "物品少件",
    date: new Date().format("yyyy-MM-dd hh:mm:ss"),
    status: "待处理",
  },
  {
    from: "快递破损",
    date: new Date().format("yyyy-MM-dd hh:mm:ss"),
    status: "已处理",
  },
  {
    from: "配送时间慢",
    date: new Date().format("yyyy-MM-dd hh:mm:ss"),
    status: "处理中",
  },
  {
    from: "破损",
    date: new Date().format("yyyy-MM-dd hh:mm:ss"),
    status: "待评价",
  },
    {
    from: "物品少件",
    date: new Date().format("yyyy-MM-dd hh:mm:ss"),
    status: "待处理",
  },
  {
    from: "保险问题",
    date: new Date().format("yyyy-MM-dd hh:mm:ss"),
    status: "已评价",
  },
  {
    from: "外包装损坏",
    date: new Date().format("yyyy-MM-dd hh:mm:ss"),
    status: "处理中",
  },

]);

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
    updateTimeChart();
    updateStatusChart();
    updateEvaluateChart();
    updateSortChart();
    updateOriginChart();
    updateQuantityChart();
    updateWarnChart();
    updateWarnNumChart()
  }, refreshtime);
};

onMounted(() => {
  initCharts();
  startRefreshChart();
  window.onresize = () => {
    timeChart && timeChart.value.resize();
    statusChart && statusChart.value.resize();
    evaluateChart && evaluateChart.value.resize();
    originChart && originChart.value.resize();
    sortChart && sortChart.value.resize();
    quantityChart && quantityChart.value.resize();
    warnNumChart && warnNumChart.value.resize();
    warnChart && warnChart.resize();
  };
});

onBeforeUnmount(() => {
  timer && clearInterval(timer);
});
</script>

<style lang="scss" scoped>
.order_header {
  height: 3vh;
  background: #0adbfa88;
  border-radius: 0.3vh;
  .date {
    width: 14vw;
  }
  .status {
    width: 10vw;
  }
}
.orderscroll {
  height: 22vh;
  width: 100%;
  overflow: hidden;
  .item {
    padding: 1vh 0.8vh;
    font-size: 1.4rem;
    border-radius: 0.5vh;
    text-align: center;
    .date {
      width: 10vw;
    }
    .status {
      width: 10vw;
    }
  }
  .item:nth-child(even) {
    background-color: rgba(255, 255, 255, 0.1);
  }
}
</style>
