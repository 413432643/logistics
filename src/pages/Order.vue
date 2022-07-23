<template>
  <el-row :gutter="10" style="margin: 0; padding: 0; margin-top: 1vh">
    <el-col :span="6">
      <chartpanel title="实时订单" style="height: 30vh">
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
      <chartpanel title="来源分布" style="height: 30vh; margin-top: 1vh">
        <v-chart
          ref="originChart"
          style="min-height: 25vh"
          :option="originChartOption"
        ></v-chart>
      </chartpanel>
    </el-col>
    <el-col :span="18">
      <chartpanel title="订单位置分布" style="height: 61.2vh">
        <div id="mapChart" style="height: 61.2vh"></div>
      </chartpanel>
    </el-col>
  </el-row>
  <el-row :gutter="10" style="margin: 0; padding: 0; margin-top: 1vh">
    <el-col :span="6">
      <chartpanel title="订单走势" style="height: 30vh">
        <v-chart
          ref="orderChart"
          style="min-height: 25vh"
          :option="orderChartOption"
        ></v-chart>
      </chartpanel>
    </el-col>
    <el-col :span="6">
      <chartpanel title="类型分布" style="height: 30vh">
        <v-chart
          ref="typeChart"
          style="min-height: 25vh"
          :option="typeChartOption"
        ></v-chart>
      </chartpanel>
    </el-col>
    <el-col :span="6">
      <chartpanel title="发布地分布" style="height: 30vh">
        <v-chart
          ref="startChart"
          style="min-height: 25vh"
          :option="startChartOption"
        ></v-chart>
      </chartpanel>
    </el-col>
    <el-col :span="6">
      <chartpanel title="目的地分布" style="height: 30vh">
        <v-chart
          ref="endChart"
          style="min-height: 25vh"
          :option="endChartOption"
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

// 实时订单样式
const orderStatusClass = computed(() => (item) => {
  return [
    item.status == "已揽件" ? "text_color_10" : "",
    item.status == "运送中" ? "text_color_11" : "",
    item.status == "配送中" ? "text_color_12" : "",
    item.status == "待签收" ? "text_color_13" : "",
  ];
});

// 初始化发布地
let startChart = ref();
let startChartOption = reactive({});
let startChartCategory = reactive([
  "深圳",
  "上海",
  "香港",
  "成都",
  "西安",
  "太原",
  "厦门",
]);
let startChartValues = reactive([]);
const initStartChart = () => {
  startChartCategory.forEach((item, index) => {
    startChartValues.push(utils.random(100));
    chartutils.initBarChart(
      startChartOption,
      startChartCategory,
      startChartValues,
      "#c6e2ff"
    );
  });
};

// 初始化目的地
let endChart = ref();
let endChartOption = reactive({});
let endChartCategory = reactive(["乌鲁木齐", "西安", "内蒙古", "贵阳"]);
let endChartValues = reactive([]);
const initEndChart = () => {
  endChartCategory.forEach((item, index) => {
    endChartValues.push(utils.random(100));
    chartutils.initBarChart(
      endChartOption,
      endChartCategory,
      endChartValues,
      "#409eff"
    );
  });
};

// 初始化来源
let originChart = ref();
let originChartOption = reactive({});
let originChartCategory = reactive([
  "线下",
  "微信",
  "支付宝",
  "淘宝",
  "京东",
  "拼多多",
  "其他",
]);
let originChartValues = reactive([]);
const initOriginChart = () => {
  originChartCategory.forEach((item, index) => {
    originChartValues.push(utils.random(100));
    chartutils.initPieFullChart(
      originChartOption,
      originChartCategory,
      originChartValues
    );
  });
};

// 初始化类型
let typeChart = ref();
let typeChartOption = reactive({});
let typeChartCategory = reactive(["同城", "短途", "长途", "货运", "其他"]);
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

// 初始化订单走势
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
    "#f56c6c"
  );
};

// 更新发布地
const updateStartChart = () => {
  startChartValues.forEach((item, index) => {
    startChartValues[index] = utils.random(100);
  });
};

// 更新目的地
const updateEndChart = () => {
  endChartValues.forEach((item, index) => {
    endChartValues[index] = utils.random(100);
  });
};

// 更新来源
const updateOriginChart = () => {
  originChartOption.series[0].data.forEach((item, index) => {
    item.value = utils.random(100);
  });
};

// 更新类型
const updateTypeChart = () => {
  typeChartOption.series[0].data.forEach((item, index) => {
    item.value = utils.random(100);
  });
};

// 更新订单
const updateOrderChart = () => {
  orderChartValues.forEach((item, index) => {
    orderChartValues[index] = utils.random(100);
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

let mapChart = null;
const initCharts = () => {
  initStartChart();
  initEndChart();
  initOriginChart();
  initTypeChart();
  initOrderChart();
  mapChart = chartutils.initMapChart("实时物流信息", "mapChart");
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
    updateStartChart();
    updateEndChart();
    updateOriginChart();
    updateTypeChart();
    updateOrderChart();
  }, refreshtime);
};

onMounted(() => {
  initCharts();
  startRefreshChart();
  window.onresize = () => {
    mapChart && mapChart.resize();
    startChart && startChart.value.resize();
    endChart && endChart.value.resize();
    originChart && originChart.value.resize();
    typeChart && typeChart.value.resize();
    orderChart & orderChart.value.resize();
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
