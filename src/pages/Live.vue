<template>
  <el-row :gutter="10" style="margin: 0; padding: 0; margin-top: 1vh">
    <el-col :span="18">
      <!-- 实时物流地图 -->
      <chartpanel title="实时物流地图" style="height: 92.4vh;">
        <div id="mapChart" style="height: 61vh; "></div>
      </chartpanel>
    </el-col>
    <el-col :span="6">
      <!-- 实时数量统计 -->
      <chartpanel title="实时数量统计" style="height: 30vh; ">
      </chartpanel>
      <!-- 实时订单信息 -->
      <chartpanel title="实时订单信息" style="height: 30vh; margin-top: 1vh">
      </chartpanel>
      <!-- 实时状态分布 -->
      <chartpanel title="实时状态分布" style="height: 30vh; margin-top: 1vh">
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
</script>

<style lang="scss" scoped></style>
