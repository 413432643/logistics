<template>
  <el-row :gutter="10" :style="rowStyle">
    <el-col :span="6">
      <chartpanel title="今日概况" :style="heightStyle">
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
          <span>接单数:</span>
          <span
            v-for="(item, index) in today.end"
            :key="index"
            class="number-item text_color_12"
          >
            {{ item }}
          </span>
        </div>

        <div class="today-item">
          <span>运算中:</span>
          <span
            v-for="(item, index) in today.run"
            :key="index"
            class="number-item text_color_13"
          >
            {{ item }}
          </span>
        </div>
      </chartpanel>
      <chartpanel title="实时订单" :style="[heightStyle, marginTopStyle]">
        <div class="order_header tr flex">
          <div class="th flex_item">下单位置</div>
          <div class="th flex_item">接收位置</div>
          <div class="th date">下单时间</div>
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
    <el-col :span="12">
      <chartpanel title="实时物流" :style="centerHeightStyle">
        <div :id="mapId" :style="centerHeightStyle"></div>
      </chartpanel>
    </el-col>
    <el-col :span="6">
      <chartpanel title="状态占比" :style="heightStyle">
        <v-chart
          ref="statusChart"
          style="min-height: 25vh"
          :option="statusChartOption"
        ></v-chart>
      </chartpanel>
      <chartpanel title="人员信息" :style="[heightStyle, marginTopStyle]">
        <v-chart
          ref="usertypeChart"
          style="min-height: 25vh"
          :option="usertypeChartOption"
        ></v-chart>
      </chartpanel>
    </el-col>
  </el-row>

  <el-row :gutter="10" :style="rowStyle">
    <el-col :span="6">
      <chartpanel title="订单统计" :style="heightStyle">
        <v-chart
          ref="orderChart"
          style="min-height: 25vh"
          :option="orderChartOption"
        ></v-chart>
      </chartpanel>
    </el-col>
    <el-col :span="6">
      <chartpanel title="投诉统计" :style="heightStyle">
        <div :id="warn" style="height: 25vh"></div>
      </chartpanel>
    </el-col>
    <el-col :span="6">
      <chartpanel title="用时统计" :style="heightStyle">
        <v-chart
          ref="timeChart"
          style="min-height: 25vh"
          :option="timeChartOption"
        ></v-chart>
      </chartpanel>
    </el-col>
    <el-col :span="6">
      <chartpanel title="网点统计" :style="heightStyle">
        <v-chart
          ref="siteChart"
          style="min-height: 25vh"
          :option="siteChartOption"
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
const warn = ref("warn" + Date.now() + Math.random())
const mapId = ref("mapId" + Date.now() + Math.random())

// 全局布局样式
const rowStyle = {
  margin: 0,
  padding: 0,
  marginTop: 1 + "vh",
};
const heightStyle = {
  height: 30 + "vh",
};
const centerHeightStyle = {
  height: 61.2 + "vh",
};
const marginTopStyle = {
  marginTop: 1 + "vh",
};

// 实时订单样式
const orderStatusClass = computed(() => (item) => {
  return [
    item.status == "已揽件" ? "text_color_10" : "",
    item.status == "运送中" ? "text_color_11" : "",
    item.status == "配送中" ? "text_color_12" : "",
    item.status == "待签收" ? "text_color_13" : "",
  ];
});

// 初始化今日概况数据
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

// 初始化状态占比
let statusChart = ref();
let statusChartOption = reactive({});
let statusChartCategory = reactive(["已揽件", "运送中", "配送中", "待签收"]);
let statusChartValues = reactive([]);
const initStatusChart = () => {
  statusChartCategory.forEach((item) => {
    let value = utils.random(100);
    statusChartValues.push([
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
  statusChartValues.forEach((item, index) => {
    let col = 100 / statusChartValues.length;
    series.push({
      type: "pie",
      center: [index * col + (col - 12) + "%", "45%"],
      radius: ["40%", "30%"],
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
        bottom: "15%",
        text: item[0].name,
        left: index * col + (col - 19) + "%",
        textStyle: {
          color: config.colors[index],
          fontSize: "1.6rem",
        },
      },
      {
        top: "37%",
        subtext: item[0].value + "%",
        left: index * col + (col - 16) + "%",
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
    statusChartOption[key] = option[key];
  }
};

// 初始化人员信息
let usertypeChart = ref();
let usertypeChartOption = reactive({});
let usertypeChartCategory = reactive([
  "配送",
  "人事",
  "管理",
  "运送",
  "库管",
  "仓库",
  "客服",
]);
let usertypeChartValues = reactive([]);
const initUsertypeChart = () => {
  usertypeChartCategory.forEach((item, index) => {
    usertypeChartValues.push(utils.random(100));
    chartutils.initBarChart(
      usertypeChartOption,
      usertypeChartCategory,
      usertypeChartValues,
      "#FF5722"
    );
  });
};

// 初始化订单统计
let orderChart = ref();
let orderChartOption = reactive({});
let orderChartTime = reactive([]);
let orderChartValues = reactive([]);
const initOrderChart = () => {
  let date = new Date();
  date.setDate(date.getDate() - 7);
  for (
    let i = new Date(date.getTime());
    i.getTime() < new Date().getTime();
    i.setDate(i.getDate() + 1)
  ) {
    orderChartTime.push(i.format("MM-dd"));
    orderChartValues.push(utils.random(1000));
  }
  chartutils.initLineChart(
    orderChartOption,
    orderChartTime,
    orderChartValues,
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
  warnChart = $echarts.init(document.getElementById(warn.value));
  warnChart.setOption(option);
};

// 初始化用时统计
let timeChart = ref();
let timeChartOption = reactive({});
let timeChartCategory = reactive([
  "1天",
  "2天",
  "3天",
  "4天",
  "5天",
  "6天",
  "7天",
]);
let timeChartValues = reactive([]);
const initTimeChart = () => {
  timeChartCategory.forEach((item, index) => {
    timeChartValues.push(utils.random(100));
    chartutils.initRadarChart(
      timeChartOption,
      timeChartCategory,
      timeChartValues,
      "#FF8a26"
    );
  });
};

// 初始化网点统计
let siteChart = ref();
let siteChartOption = reactive({});
let siteChartCategory = reactive([
  "区域物流中心",
  "市区物流中心",
  "乡镇物流中心",
  "小区配送网点",
]);
let siteChartValues = reactive([]);
const initSiteChart = () => {
  siteChartCategory.forEach((item, index) => {
    siteChartValues.push(utils.random(100));
    chartutils.initPieFullChart(
      siteChartOption,
      siteChartCategory,
      siteChartValues
    );
  });
};

// 初始化全部图表
let mapChart = null;
const initCharts = () => {
  initTodayData();
  initStatusChart();
  initUsertypeChart();
  initOrderChart();
  initWarnChart();
  initTimeChart();
  initSiteChart();
  mapChart = chartutils.initMapChart("实时物流信息", mapId.value);
};

// 更新状态占比
const updateStatusChart = () => {
  statusChartValues.forEach((item, index) => {
    let value = utils.random(100);
    item[0].value = value;
    item[1].value = 100 - value;
    statusChartOption.title[index * 2 + 1].subtext = value + "%";
  });
};
// 更新人员信息
const updateUsertypeChart = () => {
  usertypeChartValues.forEach((item, index) => {
    usertypeChartValues[index] = utils.random(100);
  });
};
// 更新订单统计
const updateOrderChart = () => {
  orderChartValues.forEach((item, index) => {
    orderChartValues[index] = utils.random(1000);
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

// 更新用时统计
const updateTimeChart = () => {
  timeChartValues.forEach((item, index) => {
    timeChartValues[index] = utils.random(100);
  });
};

// 更新网点统计
const updateSiteChart = () => {
  siteChartOption.series[0].data.forEach((item, index) => {
    item.value = utils.random(100);
  });
};

// 实时订单数据
let orders = reactive([
  {
    from: "广州",
    to: "上海",
    date: new Date().format("yyyy-MM-dd hh:mm:ss"),
    status: "已揽件",
  },
  {
    from: "西安",
    to: "南京",
    date: new Date().format("yyyy-MM-dd hh:mm:ss"),
    status: "运送中",
  },
  {
    from: "西安",
    to: "北京",
    date: new Date().format("yyyy-MM-dd hh:mm:ss"),
    status: "配送中",
  },
  {
    from: "河南",
    to: "新疆",
    date: new Date().format("yyyy-MM-dd hh:mm:ss"),
    status: "待签收",
  },
  {
    from: "河北",
    to: "山东",
    date: new Date().format("yyyy-MM-dd hh:mm:ss"),
    status: "已揽件",
  },
  {
    from: "河北",
    to: "山东",
    date: new Date().format("yyyy-MM-dd hh:mm:ss"),
    status: "已揽件",
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
    initTodayData();
    updateStatusChart();
    updateUsertypeChart();
    updateOrderChart();
    updateWarnChart();
    updateTimeChart();
    updateSiteChart();
  }, refreshtime);
};

onMounted(() => {
  initCharts();
  startRefreshChart();
  window.onresize = () => {
    mapChart && mapChart.resize();
    statusChart && statusChart.value.resize();
    usertypeChart && usertypeChart.value.resize();
    orderChart && orderChart.value.resize();
    warnChart && warnChart.resize();
    timeChart && timeChart.value.resize();
    siteChart && siteChart.value.resize();
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
  height: 8vh;
  margin-left: 2vh;

  .number-item {
    background: #ffffff22;
    font-size: 2.6rem;
    width: 5vh;
    height: 5vh;
    line-height: 5vh;
    text-align: center;
    margin-left: 1vh;
    border-radius: 0.4vh;
  }
}
.order_header {
  height: 3vh;
  background: #0adbfa88;
  border-radius: 0.3vh;
  .date {
    width: 8vw;
  }
  .status {
    width: 3vw;
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
      width: 8vw;
    }
    .status {
      width: 3vw;
    }
  }
  .item:nth-child(even) {
    background-color: rgba(255, 255, 255, 0.1);
  }
}
</style>
