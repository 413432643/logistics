<template>
    <el-row :gutter="10" style="margin: 0; padding: 0; margin-top: 1vh">
    <el-col :span="8">
      <chartpanel title="员工数量分布" style="height: 30vh"></chartpanel>
    </el-col>
    <el-col :span="8">
      <chartpanel title="职位分布" style="height: 30vh"></chartpanel>
    </el-col>
    <el-col :span="8">
      <chartpanel title="状态分布" style="height: 30vh"></chartpanel>
    </el-col>
  </el-row>
  <el-row :gutter="10" style="margin: 0; padding: 0; margin-top: 1vh">
    <el-col :span="8">
      <chartpanel title="数量走势" style="height: 30vh"></chartpanel>
    </el-col>
    <el-col :span="8">
      <chartpanel title="工资分布" style="height: 30vh"></chartpanel>
    </el-col>
    <el-col :span="8">
      <chartpanel title="离职原因分布" style="height: 30vh"></chartpanel>
    </el-col>
  </el-row>
  <el-row :gutter="10" style="margin: 0; padding: 0; margin-top: 1vh">
    <el-col :span="8">
      <chartpanel title="学历分布" style="height: 30vh"></chartpanel>
    </el-col>
    <el-col :span="8">
      <chartpanel title="年龄分布" style="height: 30vh"></chartpanel>
    </el-col>
    <el-col :span="8">
      <chartpanel title="性别分布" style="height: 30vh"></chartpanel>
    </el-col>
  </el-row>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
  computed,
} from "vue";

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


// 初始化数量统计
let numberChart = ref();
let numberChartOption = reactive({});
let numberChartCategory = reactive([
  "配送",
  "人事",
  "管理",
  "运送",
  "库管",
  "仓库",
  "客服",
]);
let numberChartValues = reactive([]);
const initNumberChart = () => {
  numberChartCategory.forEach((item, index) => {
    numberChartValues.push(utils.random(100));
    chartutils.initBarChart(
      numberChartOption,
      numberChartCategory,
      numberChartValues,
      "#FF5722"
    );
  });
};

// 更新数量统计

const updateNumberChart =()=>{
  numberChartValues.forEach((item, index) => {
    numberChartValues[index] = utils.random(100);
  });
}



let mapChart = null;
const initCharts = () => {
 initNumberChart()
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
    updateNumberChart()
  }, refreshtime);
};


onMounted(()=>{
  initCharts()
  startRefreshChart();
  window.onresize = () => {
    mapChart && mapChart.resize();
    numberChart && numberChart.value.resize();

  };
})

onBeforeUnmount(() => {
  timer && clearInterval(timer);
});
</script>

<style lang="scss" scoped></style>