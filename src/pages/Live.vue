<template>
  <el-row :gutter="10" style="margin: 0; padding: 0; margin-top: 1vh">
    <el-col :span="18">
      <!-- 实时物流地图 -->
      <chartpanel title="实时物流地图" style="height: 92.4vh">
        <div :id="mapId" style="height: 92.4vh"></div>
      </chartpanel>
    </el-col>
    <el-col :span="6">
      <!-- 实时数量统计 -->
      <chartpanel title="实时数量统计" style="height: 30vh">
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
      <!-- 实时订单信息 -->
      <chartpanel title="实时订单信息" style="height: 30vh; margin-top: 1vh">
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
      <!-- 实时状态分布 -->
      <chartpanel title="实时状态分布" style="height: 30vh; margin-top: 1vh">
        <v-chart
          ref="statusChart"
          style="min-height: 25vh"
          :option="statusChartOption"
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
const mapId = ref("mapId" + Date.now() + Math.random());

// 实时订单样式
const orderStatusClass = computed(() => (item) => {
  return [
    item.status == "已揽件" ? "text_color_10" : "",
    item.status == "运送中" ? "text_color_11" : "",
    item.status == "配送中" ? "text_color_12" : "",
    item.status == "待签收" ? "text_color_13" : "",
  ];
});

// 初始化实时数据
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

// 初始化状态
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

// 初始化地图
let mapChart = null;
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
const initMapChart = () => {
  mapChart = chartutils.initMapChart(
    "实时物流信息",
    mapId.value,
    chinaGeoCoordMap,
    chinaDatas
  );
  let amapComponent = mapChart.getModel().getComponent("amap");
  // 获取高德地图实例，使用高德地图自带的控件(需要在高德地图js API script标签手动引入)
  let amap = amapComponent.getAMap();
  amap.setZoom(5);
};

const destroy = () => {
  chinaGeoCoordMap = {};
  chinaDatas = [];
  mapChart = chartutils.initMapChart(
    "订单信息",
    mapId.value,
    chinaGeoCoordMap,
    chinaDatas
  );
  mapChart = null;
};

const initCharts = () => {
  initTodayData();
  initStatusChart();
  initMapChart();
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
  }, refreshtime);
};

onMounted(() => {
  initCharts();
  startRefreshChart();
  window.onresize = () => {
    mapChart && mapChart.resize();
    statusChart && statusChart.value.resize();
  };
});

onBeforeUnmount(() => {
  timer && clearInterval(timer);
  destroy();
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
